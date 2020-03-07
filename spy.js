var text = require('./tok'),
		proto = require('./src/prototype')

module.exports = function(rule, spy) {
	return set.call(new Spy, rule, spy)
}
function Spy() {
	this.rules = []
	this.spy = null
	this.peek = peek
	this.set = set
}
Spy.prototype = proto

function set(rule, spy) {
	this.rules = rule.rules ? rule : text(rule) //TODOchange to rule
	this.spy = spy
	return this
}
function peek(string, index) {
	var pos = index || 0,
			itm = this.rules.peek(string, pos),
			spy = this.spy
	if (spy) spy(itm)
	return itm
}
