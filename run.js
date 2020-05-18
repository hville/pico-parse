import {Tree} from './src/_tree.js'
import {All} from './src/_all.js'

export default function() {
	return All.prototype.set.apply(new Run, arguments)
}
function Run() {
	this.rules = []
}
Run.prototype = {
	constructor: Run,
	isRule: true,
	set: All.prototype.set,
	peek: function(string, index) {
		var tree = new Tree(index)
		for (var i=0; i<string.length; ++i) {
			var res = All.prototype.peek.call(this, string, tree.j)
			if (res.err) return tree
			tree.add(res)
		}
		return tree
	},
	id: All.prototype.id,
	scan: All.prototype.scan,
	spy: All.prototype.spy
}
