var Tree = require('./src/_tree'),
		Rule = require('./src/_rule'),
		set = require('./src/__ruleset1')

module.exports = function() {
	return set.apply(new Few, arguments)
}
function Few() {
	this.def = null
}
Few.prototype = new Rule(set,
	function(string, index) {
		var rule = this.def,
				tree = new Tree(index || 0)
		for (var i=0; i<string.length; ++i) {
			var res = rule.peek(string, tree.j)
			if (res.err) break
			tree.add(res)
		}
		if (tree.set.length < 1) {
			tree.err = true
			++tree.j
		}
		return tree
	}
)
