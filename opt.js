var Tree = require('./src/_tree'),
		set = require('./src/__ruleset1'),
		proto = require('./src/prototype')

module.exports = function() {
	return set.apply(new Opt, arguments)
}
function Opt() {
	this.def = null
	this.set = set
	this.peek = peek
}
Opt.prototype = proto

function peek(string, index) {
	var rule = this.def,
			pos = index || 0,
			res = rule.peek(string, pos)
	if (res.err) return new Tree(pos)
	return res
}
