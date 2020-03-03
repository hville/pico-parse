var tok = require('./tok'),
		all = require('./all'),
		proto = require('./src/prototype')

module.exports = function() {
	return set.apply(new Kin, arguments)
}
function Kin() {
	this.kin = ''
	this.rules = null
	this.set = set
	this.peek = peek
}
Kin.prototype = proto

function set(name) {
	this.kin = name
	for (var i=1, rs=this.rules=[]; i<arguments.length; ++i) {
		var arg = arguments[i]
		rs.push(arg.rules ? arg : tok(arg))
	}
	return this
}
function peek(string, index) {
	var tree = this.rules.length === 1 ? this.rules[0].peek(string, index||0) : proto.peek.call(this, string, index||0)
	tree.kin = this.kin
	return tree
}
