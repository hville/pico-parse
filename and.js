var Leaf = require('./src/_leaf'),
		set = require('./src/__ruleset1'),
		proto = require('./src/prototype')

module.exports = function() {
	return set.apply(new And, arguments)
}
function And() {
	this.def = null
	this.peek = peek
	this.set = set
}
And.prototype = proto
function peek(string, index) {
	var spot = index || 0,
			tree = this.def.peek(string, spot)
	return new Leaf(spot, '', tree.err)
}
