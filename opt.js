var Tree = require('./src/_tree'),
		set = require('./src/__allset'),
		Rule = require('./src/_rule'),
		peek = require('./src/__allpeek')

module.exports = function() {
	return set.apply(new Opt, arguments)
}
function Opt() {
	this.rules = []
}
Opt.prototype = new Rule(Opt, {
	set: set,
	peek: function(string, index) {
		var pos = index || 0,
				res = peek.call(this, string, pos)
		if (res.err) return new Tree(pos)
		return res
	}
})
