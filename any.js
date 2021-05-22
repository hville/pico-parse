import {Rule, add} from './src/_rule.js'
import {Tree} from './src/_tree.js'

export default function() {
	return add.apply(new Any, arguments)
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
Any.prototype = new Rule({
	add: function() {
		var rule = add.apply(this, arguments),
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

function flatpeek(code, pos) {
	var ops = this.rules,
			itm
	for (var i=0; i<ops.length; ++i) {
		itm = ops[i].peek(code, pos)
		if (!itm.err) break
	}
	return !itm ? new Tree(code, this, pos, pos) : this._id ? (new Tree(code, this, pos, pos)).add(itm) : itm
}
