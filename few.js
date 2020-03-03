var Tree = require('./src/_tree'),
		set = require('./src/__set'),
		proto = require('./src/prototype')

module.exports = function() {
	return set.apply(new Few, arguments)
}
function Few() {
	this.rules = null
	this.peek = peek
}
Few.prototype = proto
function peek(string, index) {
	var tree = new Tree(index || 0)
	for (var i=0; i<string.length; ++i) {
		var res = proto.peek.call(this, string, tree.j)
		if (res.err) break
		tree.add(res)
	}
	if (tree.set.length < 1) {
		tree.err = true
		++tree.j
	}
	return tree
}