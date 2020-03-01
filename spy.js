var text = require('./tok'),
		proto = require('./src/prototype')

module.exports = function(rule, spy) {
	return set.call(new Spy, rule, spy)
}
function Spy() {
	this.def = null
	this.spy = null
	this.peek = peek
	this.set = set
}
Spy.prototype = proto

function set(rule, spy) {
	this.def = rule.isRule ? rule : text(rule)
	this.spy = spy
	return this
}
function peek(string, index) {
	var pos = index || 0,
			itm = this.def.peek(string, pos),
			spy = this.spy
	if (spy) spy(itm)
	return itm
}
