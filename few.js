var Tree = require('./src/_tree'),
		proto = require('./src/_All').prototype

module.exports = function() {
	return proto.set.apply(new Few, arguments)
}
function Few() {
	this.rules = []
}
Few.prototype = {
	constructor: Few,
	isRule: true,
	set: proto.set,
	peek: function(string, index) {
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
	},
	name: proto.name,
	scan: proto.scan,
	spy: proto.spy
}
