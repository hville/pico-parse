var Leaf = require('./src/_leaf'),
		proto = require('./src/_All').prototype

module.exports = function() {
	return proto.set.apply(new Not, arguments)
}
function Not() {
	this.rules = []
}
Not.prototype = {
	constructor: Not,
	isRule: true,
	set: proto.set,
	peek: function(string, index) {
		var spot = index || 0,
				tree = proto.peek.call(this, string, spot)
		return new Leaf(spot, '', !tree.err)
	},
	id: proto.id,
	scan: proto.scan,
	spy: proto.spy
}
