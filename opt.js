var Tree = require('./src/_tree'),
		Rule = require('./src/_rule'),
		set = require('./src/__ruleset1')

module.exports = function() {
	return set.apply(new Opt, arguments)
}
function Opt() {
	this.def = null
}
Opt.prototype = new Rule(set,
	function(string, index) {
		var rule = this.def,
				pos = index || 0,
				res = rule.peek(string, pos)
		if (res.err) return new Tree(pos)
		return res
	}
)
