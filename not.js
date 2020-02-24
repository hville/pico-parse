var Leaf = require('./src/_leaf'),
		scan = require('./src/__rulescan'),
		set = require('./src/__ruleset1')

module.exports = function() {
	return set.apply(new Not, arguments)
}

function Not() {
	this.def = null
}
Not.prototype.isRule = true
Not.prototype.scan = scan
Not.prototype.set = set
Not.prototype.peek = function(string, index) {
	var spot = index || 0,
			tree = this.def.peek(string, spot)
	return new Leaf(spot, '', !tree.err)
}
