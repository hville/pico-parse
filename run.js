var Tree = require('./src/_tree'),
		set = require('./src/__rulesetn'),
		proto = require('./src/prototype')


module.exports = function() {
	return set.apply(new Run, arguments)
}
function Run() {
	this.def = null
	this.set = set
	this.peek = peek
}
Run.prototype = proto

function peek(string, index) {
	var tree = new Tree(index || 0)
	for (var i=0; i<string.length; ++i) {
		var res = proto.peek.call(this, string, tree.j)
		if (res.err) break
		tree.add(res)
	}
	return tree
}
