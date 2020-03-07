var text = require('./tok'),
		Rule = require('./src/_rule')

module.exports = function(rule, spy) {
	return Spy.prototype.set.call(new Spy, rule, spy)
}
function Spy() {
	this.rules = []
	this.spy = null
}
Spy.prototype = new Rule(Spy, {
	set: function(rule, spy) {
		this.rules = rule.isRule ? rule : text(rule) //TODOchange to rule
		this.spy = spy
		return this
	},
	peek: function(string, index) {
		var pos = index || 0,
				itm = this.rules.peek(string, pos),
				spy = this.spy
		if (spy) spy(itm)
		return itm
	}
})
