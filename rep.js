var Tree = require('./src/_tree'),
		text = require('./tok'),
		Rule = require('./src/_rule'),
		all = require('./all')

module.exports = function() {
	var tok = new Rule(repset, reppeek)
	//@ts-ignore
	if (this && this.trim) tok.kin = ''+this
	return repset.apply(tok, arguments)
}

function repset() {
	var count = [],
			rules = []
	for (var i=0; i<arguments.length; ++i) {
		var arg = arguments[i]
		if (arg.constructor === Number) count.push(arg)
		else rules.push(arg.isRule ? arg : text(arg))
	}
	this.def = [rules.length === 1 ? rules[0] : all.apply(null, rules), count[0] || 0, count[1] || Infinity]
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
