import {Tree} from './src/_tree.js'
import {All} from './src/_all.js'

export default function() {
	return All.prototype.set.apply(new Few, arguments)
}
function Few() {
	this.rules = []
}
Few.prototype = {
	constructor: Few,
	isRule: true,
	set: All.prototype.set,
	peek: function(string, pos) {
		var tree = new Tree(pos)
		for (var i=0; i<string.length; ++i) {
			var res = All.prototype.peek.call(this, string, tree.j)
			if (res.err) break
			tree.add(res)
		}
		if (tree.set.length < 1) {
			tree.err = 1
			++tree.j
		}
		return tree
	},
	id: All.prototype.id,
	scan: All.prototype.scan,
	spy: All.prototype.spy
}
