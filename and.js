import {Tree} from './src/_tree.js'
import {All} from './src/_all.js'

export default function() {
	return All.prototype.set.apply(new And, arguments)
}
function And() {
	this.rules = []
}
And.prototype = {
	constructor: And,
	isRule: true,
	set: All.prototype.set,
	peek: function(string, index) {
		var spot = index,
				next = All.prototype.peek.call(this, string, spot),
				tree = new Tree(spot)
		if (next.err > 0) tree.err = 1
		return tree
	},
	id: All.prototype.id,
	scan: All.prototype.scan,
	spy: All.prototype.spy
}
