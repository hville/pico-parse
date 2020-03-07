var Tree = require('./src/_tree'),
		set = require('./src/__allset'),
		Rule = require('./src/_rule'),
		peek = require('./src/__allpeek')

module.exports = function() {
	return set.apply(new Few, arguments)
}
function Few() {
	this.rules = []
}
Few.prototype = new Rule(Few, {
	set: set,
	peek: function(string, index) {
		var tree = new Tree(index || 0)
		for (var i=0; i<string.length; ++i) {
			var res = peek.call(this, string, tree.j)
			if (res.err) break
			tree.add(res)
		}
		if (tree.set.length < 1) {
			tree.err = true
			++tree.j
		}
		return tree
	}
})
