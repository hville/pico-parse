var set = require('./src/__rulesetn'),
		Rule = require('./src/_rule')

module.exports = function() {
	return set.apply(new Any, arguments)
}
function Any() {
	this.def = null
}
Any.prototype = new Rule(set,
	function(string, index) {
		var ops = this.def,
				pos = index || 0,
				itm
		for (var i=0; i<ops.length; ++i) if (!(itm = ops[i].peek(string, pos)).err) break
		return itm
	}
)
