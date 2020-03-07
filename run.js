var Tree = require('./src/_tree'),
		set = require('./src/__allset'),
		peek = require('./src/__allpeek'),
		Rule = require('./src/_rule')

module.exports = function() {
	return set.apply(new Run, arguments)
}
function Run() {
	this.rules = []
}
Run.prototype = new Rule(Run, {
	set: set,
	peek: function(string, index) {
		var tree = new Tree(index || 0)
		for (var i=0; i<string.length; ++i) {
			var res = peek.call(this, string, tree.j)
			if (res.err) break
			tree.add(res)
		}
		return tree
	}
})
