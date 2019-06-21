var Tree = require('./src/_tree'),
		text = require('./tok'),
		Rule = require('./src/_rule')

module.exports = function(rule, min, max) {
	var tok = new Rule(repset, reppeek)
	//@ts-ignore
	if (this instanceof String) tok.kin = ''+this
	return tok.set(rule, min, max)
}

function repset(rule, min, max) {
	this.def = [rule.isRule ? rule : text(rule), min || 0, max || Infinity]
	return this
}

function reppeek(string, index) {
	var rule = this.def[0],
			min = this.def[1],
			max = Math.min(this.def[2], string.length),
			tree = new Tree(index || 0, this.kin)
	for (var i=0; i<max; ++i) {
		var res = rule.peek(string, tree.j)
		if (res.err) break
		tree.add(res)
	}
	if (tree.set.length < min) tree.err = true
	if (tree.err) ++tree.j

	return tree
}
