var Leaf = require('./src/_leaf'),
		set = require('./src/__allset'),
		Rule = require('./src/_rule'),
		peek = require('./src/__allpeek')

module.exports = function() {
	return set.apply(new Not, arguments)
}
function Not() {
	this.rules = []
}
Not.prototype = new Rule(Not, {
	peek: function(string, index) {
		var spot = index || 0,
				tree = peek.call(this, string, spot)
		return new Leaf(spot, '', !tree.err)
	},
	set: set
})
