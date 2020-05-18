import {Tree} from './src/_tree.js'
import {All} from './src/_all.js'

export default function() {
	return All.prototype.set.apply(new Opt, arguments)
}
function Opt() {
	this.rules = []
}
Opt.prototype = {
	constructor: Opt,
	isRule: true,
	set: All.prototype.set,
	peek: function(string, pos) {
		var res = All.prototype.peek.call(this, string, pos)
		if (res.err) return new Tree(pos)
		return res
	},
	id: All.prototype.id,
	scan: All.prototype.scan,
	spy: All.prototype.spy
}
