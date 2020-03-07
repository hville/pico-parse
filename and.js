var Leaf = require('./src/_leaf'),
		set = require('./src/__allset'),
		Rule = require('./src/_rule'),
		peek = require('./src/__allpeek')

module.exports = function() {
	return set.apply(new And, arguments)
}
function And() {
	this.rules = []
}
And.prototype = new Rule(And, {
	set: set,
	peek: function(string, index) {
		var spot = index || 0,
				tree = peek.call(this, string, spot)
		return new Leaf(spot, '', tree.err) //TODO no point in having a name?
	}
})
