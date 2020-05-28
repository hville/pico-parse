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
		var ops = this.rules //TODO no-rules case
		for (var i=0; i<ops.length; ++i) {
			var itm = ops[i].peek(src, pos)
			if (!itm.err) break
		}
		return itm
	},
	scan: scan,
	spy: spy
}
