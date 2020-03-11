var proto = require('./src/_All').prototype

module.exports = function() {
	return proto.set.apply(new Any, arguments)
}
function Any() {
	this.rules = []
}
Any.prototype = {
	constructor: Any,
	isRule: true,
	set: proto.set,
	peek: function(string, index) {
		var ops = this.rules, //TODO no-rules case
				pos = index || 0,
				itm
		for (var i=0; i<ops.length; ++i) if (!(itm = ops[i].peek(string, pos)).err) break
		return itm
	},
	id: proto.id,
	scan: proto.scan,
	spy: proto.spy
}
