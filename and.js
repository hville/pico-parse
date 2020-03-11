var Leaf = require('./src/_leaf'),
		proto = require('./src/_All').prototype

module.exports = function() {
	return proto.set.apply(new And, arguments)
}
function And() {
	this.rules = []
}
And.prototype = {
	constructor: And,
	isRule: true,
	set: proto.set,
	peek: function(string, index) {
		var spot = index || 0,
				tree = proto.peek.call(this, string, spot)
		return new Leaf(spot, '', tree.err) //TODO no point in having a name?
	},
	name: proto.name,
	scan: proto.scan,
	spy: proto.spy
}
