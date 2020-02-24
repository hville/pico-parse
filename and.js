var Leaf = require('./src/_leaf'),
		scan = require('./src/__rulescan'),
		set = require('./src/__ruleset1')

module.exports = function() {
	return set.apply(new And, arguments)
}

function And() {
	this.def = null
}
And.prototype.isRule = true
And.prototype.scan = scan
And.prototype.set = set
And.prototype.peek = function(string, index) {
	var spot = index || 0,
			tree = this.def.peek(string, spot)
	return new Leaf(spot, '', tree.err)
}
