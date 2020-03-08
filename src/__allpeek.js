var Tree = require('./_tree')

module.exports = function(string, index, debug) {
	var ops = this.rules //TODO this.rule
	if (ops.length === 1) return ops[0].peek(string, index, debug)

	var tree = new Tree(index || 0)
	for (var i=0; i<ops.length; ++i) {
		var part = ops[i].peek(string, tree.j, debug)
		if (tree.add(part).err && !debug) break
	}
	return tree
}
