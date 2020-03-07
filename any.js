var set = require('./src/__allset'),
		Rule = require('./src/_rule')

module.exports = function() {
	return set.apply(new Any, arguments)
}
function Any() {
	this.rules = []
}
Any.prototype = new Rule(Any, {
	set: set,
	peek: function(string, index) {
		var ops = this.rules, //TODO no-rules case
				pos = index || 0,
				itm
		for (var i=0; i<ops.length; ++i) if (!(itm = ops[i].peek(string, pos)).err) break
		return itm
	}
})

