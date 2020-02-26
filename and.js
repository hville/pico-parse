var Leaf = require('./src/_leaf'),
		set = require('./src/__ruleset1'),
		Rule = require('./src/_rule')

module.exports = function() {
	return set.apply(new And, arguments)
}
function And() {
	this.def = null
}
And.prototype = new Rule(set,
	function(string, index) {
		var spot = index || 0,
				tree = this.def.peek(string, spot)
		return new Leaf(spot, '', tree.err)
	}
)
