var Tree = require('./src/_tree'),
		Rule = require('./src/_rule'),
		arrset = require('./src/__arrset')

module.exports = function() {
	var tok = new Rule(arrset, allpeek)
	//@ts-ignore
	if (this instanceof String) tok.kin = ''+this
	return arrset.apply(tok, arguments)
}

function allpeek(string, index, debug) {
	var ops = this.def,
			tree = new Tree(index || 0, this.kin)
	for (var i=0; i<ops.length; ++i) {
		if (tree.add(ops[i].peek(string, tree.j, debug)).err && !debug) break
	}
	return tree
}
