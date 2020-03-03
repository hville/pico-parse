var Tree = require('./_tree'),
		Leaf = require('./_leaf'),
		tok = require('../tok'),
		all = require('../all')

module.exports = {
	isRule: true,
	scan: function(string) {
		var res = this.peek(string, 0)
		if (res.j !== string.length) {
			if (!res.add) res = (new Tree(res.i).add(res))
			res.add(new Leaf(res.j, string.slice(res.j), true))
		}
		return res
	},
	test: function() {
		this.tRules = new Set
		this.nRules = new Set
		this.rRules = new Set
		testRule.call(this, this)
		return this
	},
	_setone: function(rule) {
		this.rules = arguments.length > 1 ? all.apply(null, arguments) : rule.rules ? rule : tok(rule)
		return this
	},
	_setall: function() {
		for (var i=0, def = this.rules = []; i<arguments.length; ++i) {
			var arg = arguments[i]
			def[i] = arg.rules ? arg : tok(arg)
		}
		return this
	}
}
function testRule(rule) {
	if (rule.term) return this.tRules.add(rule)
	if (this.nRules.has(rule)) return this.rRules.add(rule)
	this.nRules.add(rule)
	if (rule.rules.rules) return testRule.call(this, rule.rules)
	rule.rules.forEach(testRule, this)
}
