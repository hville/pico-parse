var text = require('./tok'),
		Rule = require('./src/_rule')

module.exports = function(rule, spy) {
	return Spy.prototype.set.call(new Spy, rule, spy)
}
function Spy() {
	this.rule = null
	this.spy = null
}
Spy.prototype = new Rule(Spy, {
	set: function(rule, spy) {
		this.rule = rule.isRule ? rule : text(rule)
		this.spy = spy
		return this
	},
	peek: function(string, index) {
		var pos = index || 0,
				itm = this.rule.peek(string, pos),
				spy = this.spy
		if (spy) spy(itm)
		return itm
	}
})
