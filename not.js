import {Tree} from './src/_tree.js'
import {set, peek, spy, scan} from './src/proto.js'

export default function() {
	return set.apply(new Not, arguments)
}
function Not() {
	this.rules = []
}
Not.prototype = {
	constructor: Not,
	set: set,
	peek: function(text, spot) {
		var next = peek.call(this, text, spot),
				tree = new Tree(text, this, spot, spot)
		if (!next.err) tree.err = true
		return tree
	},
	scan: scan,
	spy: spy
}
