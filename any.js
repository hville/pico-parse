import {set, spy, scan} from './src/proto.js'

export default function() {
	return set.apply(new Any, arguments)
}
function Any() {
	this.rules = []
}
Any.prototype = {
	constructor: Any,
	set: set,
	peek: function(src, pos) {
		var ops = this.rules, //TODO no-rules case
				min
		for (var i=0; i<ops.length; ++i) {
			var itm = ops[i].peek(src, pos)
			if (!itm.err) break
			if (!min || min.err > itm.err) min = itm
		}
		return itm
	},
	scan: scan,
	spy: spy
}
