var Leaf = require('./src/_leaf'),
		Rule = require('./src/_rule'),
		set = require('./src/__ruleset1')

module.exports = function() {
	return set.apply(new Not, arguments)
}
function Not() {
	this.def = null
}
Not.prototype = new Rule(set,
	function(string, index) {
		var spot = index || 0,
				tree = this.def.peek(string, spot)
		return new Leaf(spot, '', !tree.err)
	}
)
