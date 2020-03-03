var Leaf = require('./src/_leaf'),
		set = require('./src/__set'),
		proto = require('./src/prototype')

module.exports = function() {
	return set.apply(new Not, arguments)
}
function Not() {
	this.rules = null
	this.set = set
	this.peek = peek
}
Not.prototype = proto
function peek(string, index) {
	var spot = index || 0,
			tree = proto.peek.call(this, string, spot)
	return new Leaf(spot, '', !tree.err)
}
