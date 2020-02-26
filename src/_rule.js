var Tree = require('./_tree'),
		Leaf = require('./_leaf')

module.exports = Rule

function Rule(set, peek) {
	this.def = null
	this.set = set
	this.peek = peek
}
Rule.prototype.isRule = true
Rule.prototype.scan = function(string) {
	var res = this.peek(string, 0)
	if (res.j !== string.length) {
		if (!res.add) res = (new Tree(res.i).add(res))
		res.add(new Leaf(res.j, string.slice(res.j), true))
	}
	return res
}
