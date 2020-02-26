var Tree = require('./src/_tree'),
		set = require('./src/__rulesetn'),
		Rule = require('./src/_rule')

module.exports = function() {
	return set.apply(new All, arguments)
}
function All() {
	this.def = null
}
All.prototype = new Rule(set,
	function(string, index, debug) {
		var ops = this.def,
				tree = new Tree(index || 0)
		for (var i=0; i<ops.length; ++i) {
			if (tree.add(ops[i].peek(string, tree.j, debug)).err && !debug) break
		}
		return tree
	}
)
