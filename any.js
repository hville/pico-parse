import {All} from './src/_all.js'

export default function() {
	return All.prototype.set.apply(new Any, arguments)
}
function Any() {
	this.rules = []
}
Any.prototype = {
	constructor: Any,
	isRule: true,
	set: All.prototype.set,
	peek: function(string, pos) {
		var ops = this.rules, //TODO no-rules case
				min
		for (var i=0; i<ops.length; ++i) {
			var itm = ops[i].peek(string, pos)
			if (!itm.err) return itm
			if (!min || min.err > itm.err) min = itm
		}
		return itm
	},
	id: All.prototype.id,
	scan: All.prototype.scan,
	spy: All.prototype.spy,
	box: All.prototype.box
}
