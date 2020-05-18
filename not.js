import {Tree} from './src/_tree.js'
import {All} from './src/_all.js'

export default function() {
	return All.prototype.set.apply(new Not, arguments)
}
function Not() {
	this.rules = []
}
Not.prototype = {
	constructor: Not,
	isRule: true,
	set: All.prototype.set,
	peek: function(string, spot) {
		var next = All.prototype.peek.call(this, string, spot),
				tree = new Tree(spot)
		if (next.err === 0) tree.err = 1
		return tree
	},
	id: All.prototype.id,
	scan: All.prototype.scan,
	spy: All.prototype.spy
}
