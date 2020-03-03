var Tree = require('./src/_tree'),
		set = require('./src/__set'),
		proto = require('./src/prototype')

module.exports = function() {
	return set.apply(new Opt, arguments)
}
function Opt() {
	this.rules = null
	this.set = set
	this.peek = peek
}
Opt.prototype = proto

function peek(string, index) {
	var pos = index || 0,
			res = proto.peek.call(this, string, pos)
	if (res.err) return new Tree(pos)
	return res
}
