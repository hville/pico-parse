import {Tree} from './src/_tree.js'
import {set, peek, spy, scan} from './src/proto.js'

export default function() {
	return set.apply(new Few, arguments)
}
function Few() {
	this.rules = []
}
Few.prototype = {
	constructor: Few,
	set: set,
	peek: function(text, pos) {
		var tree = new Tree(text, this, pos, pos)
		for (var i=0; i<text.length; ++i) {
			var res = peek.call(this, text, tree.j)
			if (res.err) break
			tree.add(res)
		}
		if (tree.cuts.length === 0) {
			tree.err = true
			++tree.j
		}
		return tree
	},
	scan: scan,
	spy: spy
}
