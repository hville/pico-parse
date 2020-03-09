var Leaf = require('./src/_leaf'),
		proto = require('./src/_All').prototype

module.exports = function() {
	return proto.set.apply(new Opt, arguments)
}
function Opt() {
	this.rules = []
}
Opt.prototype = {
	constructor: Opt,
	isRule: true,
	kin:'',
	set: proto.set,
	peek: function(string, index) {
		var pos = index || 0,
				res = proto.peek.call(this, string, pos)
		if (res.err) return new Leaf(pos, '', false)
		return res
	},
	name: proto.name,
	scan: proto.scan,
	spy: proto.spy
}
