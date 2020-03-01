var Leaf = require('./src/_leaf'),
		set = require('./src/__ruleset1'),
		proto = require('./src/prototype')

module.exports = function() {
	return set.apply(new Not, arguments)
}
function Not() {
	this.def = null
	this.set = set
	this.peek = peek
}
Not.prototype = proto
function peek(string, index) {
	var spot = index || 0,
			tree = this.def.peek(string, spot)
	return new Leaf(spot, '', !tree.err)
}
