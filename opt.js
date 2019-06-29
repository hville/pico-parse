var Tree = require('./src/_tree'),
		text = require('./tok'),
		Rule = require('./src/_rule'),
		all = require('./all')

module.exports = function() {
	var tok = new Rule(optset, optpeek)
	//@ts-ignore
	if (this instanceof String) tok.kin = ''+this
	return optset.apply(tok, arguments)
}

function optset(rule) {
	this.def = [arguments.length > 1 ? all.apply(null, arguments) : rule.isRule ? rule : text(rule)]
	return this
}

function optpeek(string, index) {
	var rule = this.def[0],
			pos = index || 0,
			res = rule.peek(string, pos)
	if (res.err) return new Tree(pos, this.kin)
	if (this.kin) res.kin = this.kin
	return res
}
