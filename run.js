var Tree = require('./src/_tree'),
		scan = require('./src/__rulescan'),
		set = require('./src/__ruleset1')

module.exports = function() {
	return set.apply(new Run, arguments)
}

function Run() {
	this.def = null
}
Run.prototype.isRule = true
Run.prototype.scan = scan
Run.prototype.set = set
Run.prototype.peek = function(string, index) {
	var rule = this.def,
			tree = new Tree(index || 0)
	for (var i=0; i<string.length; ++i) {
		var res = rule.peek(string, tree.j)
		if (res.err) break
		tree.add(res)
	}
	return tree
}
