var Tree = require('./src/_tree'),
		tok = require('./tok'),
		Rule = require('./src/_rule'),
		all = require('./all')

module.exports = function() {
	return optset.apply(new Rule(optset, optpeek), arguments)
}

function optset(rule) {
	this.def = arguments.length > 1 ? all.apply(null, arguments) : rule.isRule ? rule : tok(rule)
	return this
}

function optpeek(string, index) {
	var rule = this.def,
			pos = index || 0,
			res = rule.peek(string, pos)
	if (res.err) return new Tree(pos, this.kin)
	if (this.kin) res.kin = this.kin
	return res
}
