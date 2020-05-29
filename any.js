import {Rule, set} from './src/_rule.js'
import {Tree} from './src/_tree.js'

export default function() {
	return set.apply(new Any, arguments)
}
function Any() {
	this.rules = []
	var oldTxt = '',
			memory = null
	this.cache = function(code, spot, tree) {
		//TODO normal|unrap, only the last value (highest i) is needed
		//TODO for wraped|leftRec past recall occurs
		if (code !== oldTxt) {
			oldTxt = code
			memory = {} // all new cache
		}
		return tree ? (memory[spot] = tree) : memory[spot]
	}
	this.peek = normPeek
}
function normPeek(code, spot) {
	var old = this.cache(code, spot)
	if (old) return old
	return this.cache(code, spot, flatpeek.call(this, code, spot))
}
function wrapPeek(src, pos) {
	var old = this.cache(src, pos)
	if (old) return old
	this.cache(src, pos, new Tree(src, this, pos, pos, true)) //first pass fails
	var next
	while ((next = flatpeek.call(this, src, pos)).j > this.cache(src, pos).j) {
		this.cache(src, pos, next)
	}
	return this.cache(src, pos)
}
Any.prototype = new Rule(Any, {
	set: function() {
		var rule = Rule.prototype.set.apply(this, arguments),
				todo = rule.rules.slice()
		while (todo.length) {
			var item = todo.pop()
			if (item === rule) {
				rule.peek = wrapPeek
				return rule
			}
			if (item.rules) todo.push.apply(todo, item.rules)
		}
		rule.peek = normPeek
		return rule
	}
})

function flatpeek(src, pos) {
	var ops = this.rules,
			itm
	for (var i=0; i<ops.length; ++i) {
		itm = ops[i].peek(src, pos)
		if (!itm.err) break
	}
	return itm || new Tree(src, this, pos, pos)
}
/* TODO future
? tree reuse (premature optimisation)
		peek(tree, spot)
		if (tree.rule !== this || !tree.cuts.length) apply rule as normal
		else just check each leaves, all the way down to tokens
		+ no branching, just recheck tokens
		+ if token unchanged, old tree is still good
		~ if token changed (pass), replace token, shift all i,j
		~ if token fails, retry parent, retry parent, retry parent ... all the way to the root
? this.last; this.text instead of cache
*/
