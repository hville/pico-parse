var Tree = require('./src/_tree'),
		Rule = require('./src/_rule'),
		arrset = require('./src/__rulesetn')

module.exports = function() {
	return arrset.apply(new Rule(arrset, allpeek), arguments)
}

function allpeek(string, index, debug) {
	var ops = this.def,
			tree = new Tree(index || 0, this.kin)
	for (var i=0; i<ops.length; ++i) {
		if (tree.add(ops[i].peek(string, tree.j, debug)).err && !debug) break
	}
	return tree
}
