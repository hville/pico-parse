import {All} from './src/_all.js'

export default function() {
	return All.prototype.set.apply(new Any, arguments)
}
function Any() {
	this.rules = []
	this._lastSrc = ''
	this._lastPos = -1
	this._lastRes = null
}
Any.prototype = {
	constructor: Any,
	isRule: true,
	set: All.prototype.set,
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
	id: All.prototype.id,
	scan: All.prototype.scan,
	spy: All.prototype.spy,
	box: All.prototype.box
}
