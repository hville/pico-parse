var Tree = require('./src/_tree'),
		scan = require('./src/__rulescan'),
		set = require('./src/__ruleset1')

module.exports = function() {
	return Few.prototype.set.apply(new Few, arguments)
}

function Few() {
	this.def = null
}
Few.prototype.isRule = true
Few.prototype.scan = scan
Few.prototype.set = set
Few.prototype.peek = function(string, index) {
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
