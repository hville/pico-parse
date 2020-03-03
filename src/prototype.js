var Tree = require('./_tree'),
		Leaf = require('./_leaf'),
		mapR = require('./__set')

function Box(rule) {
	this.rules = rule.rules
	this.poke = rule.peek
	this.peek = peek
	this.last = null
}
Box.prototype = module.exports = {
	set: function() {
		mapR.apply(this, arguments).rules.forEach(check, this)
		return this
	},
	peek: function(string, index, debug) {
		var ops = this.rules //TODO this.rules
		if (ops.length === 1) return ops[0].peek(string, index, debug)

		var tree = new Tree(index || 0)
		for (var i=0; i<ops.length; ++i) {
			if (tree.add(ops[i].peek(string, tree.j, debug)).err && !debug) break
		}
		return tree
	},
	scan: function scan(string) {
		var res = this.peek(string, 0)
		if (res.j !== string.length) {
			if (!res.add) res = (new Tree(res.i).add(res))
			res.add(new Leaf(res.j, string.slice(res.j), true))
		}
		return res
	}
}
function peek(string, index) {
	if (this.last) return this.last //TODO this.last.i===index            //for the repeat calls in the loop below
	var spot = index||0,
			next = this.last = new Leaf(spot, '', true), //first pass fails
			tree
	while ((tree = this.poke(string, spot)).j > next.j) next = this.last = tree
	return (this.last = null), next
}
function check(kid, i, set) {
	if (!kid.term) { //only non-terminal
		if (!Array.isArray(kid.rules)) console.log(kid, kid.rules)
		if (kid === this) set[i] = new Box(kid)
		else kid.rules.forEach(check, this)
	}
}

/* module.exports = function(rule) {
	check(rule, rule.rules)
}
function check(ref, kids) {
	for (var i=0; i<kids.length; ++i) if (kids[i].rules) { //only non-terminal
		if (kids[i] === ref) kids[i] = box(kids[i])
		else check(ref, kids[i].rules)
	}
} */
