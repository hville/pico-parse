var Rule = require('./src/_rule'),
		text = require('./tok')

module.exports = function(rule, spy) {
	return Spy.prototype.set.call(new Spy, rule, spy)
}
function Spy() {
	this.def = null
	this.spy = null
}
Spy.prototype = new Rule(
	function(rule, spy) {
		this.def = rule.isRule ? rule : text(rule)
		this.spy = spy
		return this
	},
	function(string, index) {
		var pos = index || 0,
				itm = this.def.peek(string, pos),
				spy = this.spy
		if (spy) spy(itm)
		return itm
	}
)
