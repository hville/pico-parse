var tok = require('./tok'),
		all = require('./all'),
		proto = require('./src/prototype')

module.exports = function() {
	return set.apply(new Kin, arguments)
}
function Kin() {
	this.kin = ''
	this.def = null
	this.set = set
	this.peek = peek
}
Kin.prototype = proto

function set(name) {
	this.kin = name
	for (var i=1, rs=[]; i<arguments.length; ++i) {
		var arg = arguments[i]
		rs.push(arg.isRule ? arg : tok(arg))
	}
	this.def = rs.length === 1 ? rs[0] : all.apply(null, rs)
	return this
}
function peek(string, index) {
	var tree = this.def.peek(string, index||0)
	tree.kin = this.kin
	return tree
}
