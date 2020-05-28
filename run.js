import {Tree} from './src/_tree.js'
import {set, peek, spy, scan} from './src/proto.js'

export default function() {
	return set.apply(new Run, arguments)
}
function Run() {
	this.rules = []
}
Run.prototype = {
	constructor: Run,
	set: set,
	peek: function(text, spot) {
		var tree = new Tree(text, this, spot, spot, 0)
		while(tree.j < text.length) {
			var res = peek.call(this, text, tree.j)
			if (res.err) return tree
			tree.add(res)
		}
		return tree
	},
	scan: scan,
	spy: spy
}
