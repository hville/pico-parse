var Tree = require('./_tree'),
		Leaf = require('./_leaf')

module.exports = {
	peek: function(string, index, debug) {
		var ops = this.rules //TODO this.rules
		if (ops.length === 1) return ops[0].peek(string, index, debug)

		var tree = new Tree(index || 0)
		for (var i=0; i<ops.length; ++i) {
			var part = ops[i].peek(string, tree.j, debug)
			if (!part) throw Error()
			if (tree.add(part).err && !debug) break
		}
		return tree
	},
	scan: function scan(string) {
		var res = this.peek(string, 0)
		if (res.j !== string.length) {
			if (!res.add) res = (new Tree(res.i)).add(res) //TODO looks like this line is never called
			res.add(new Leaf(res.j, string.slice(res.j), true))
		}
		return res
	}
}
