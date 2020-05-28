import {Tree} from './src/_tree.js'
import {set, peek, spy, scan} from './src/proto.js'

export default function() {
	return set.apply(new Opt, arguments)
}
function Opt() {
	this.rules = []
}
Opt.prototype = {
	constructor: Opt,
	set: set,
	peek: function(text, pos) {
		var res = peek.call(this, text, pos)
		if (res.err) return new Tree(text, this, pos, pos)
		return res
	},
	scan: scan,
	spy: spy
}
