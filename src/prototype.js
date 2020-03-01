var Tree = require('./_tree'),
		Leaf = require('./_leaf'),
		mapR = require('./__rulesetn')

module.exports = {
	isRule: true, //TODO replace with this.rules?
	set: function() {
		return mapR.apply(this, arguments)
	},
	peek: function(string, index, debug) {
		var ops = this.def, //TODO this.rules
				tree = new Tree(index || 0)
		for (var i=0; i<ops.length; ++i) {
			if (tree.add(ops[i].peek(string, tree.j, debug)).err && !debug) break
		}
		return tree
	},
	scan: function scan(string) {
		var res = this.peek(string, 0)
		if (res.j !== string.length) {
			if (!res.add) res = (new Tree(res.i).add(res))
			res.add(new Leaf(res.j, string.slice(res.j), true))
		}
		return res
	},
	test: function test() {
		this.tRules = new Set
		this.nRules = new Set
		this.rRules = new Set
		testRule.call(this, this)
		return this
	},
	fix: function() {
		this.any = this.peek
		this.last = null
		this.peek = function(src, i) {
			if (this.last) return this.last              //for the repeat calls in the loop below
			var next = this.last = new Leaf(i, '', true) //first pass fails
			while (true) {
				var tree = this.any(src, i)
				if (tree.j > next.j) next = this.last = tree
				else return (this.last = null), next
			}
		}
		return this
	}
}

function testRule(rule) {
	if (rule.term) return this.tRules.add(rule)
	if (this.nRules.has(rule)) return this.rRules.add(rule)
	this.nRules.add(rule)
	if (rule.def.isRule) return testRule.call(this, rule.def)
	rule.def.forEach(testRule, this)
}
