import {Tree} from './src/_tree.js'
import {set, peek, spy, scan} from './src/proto.js'

export default function() {
	return set.apply(new And, arguments)
}
function And() {
	this.rules = []
}
And.prototype = {
	constructor: And,
	set: set,
	peek: function(text, spot) {
		var next = peek.call(this, text, spot),
				tree = new Tree(text, this, spot, spot, 0)
		if (next.err > 0) tree.err = 1
		return tree
	},
	scan: scan,
	spy: spy
}
