var mapR = require('./src/__rulesetn'),
		proto = require('./src/prototype')

module.exports = function() {
	return mapR.apply(new Any, arguments)
}
function Any() {
	this.def = null
	this.peek = peek
}
Any.prototype = proto
function peek(string, index) {
	var ops = this.def,
			pos = index || 0,
			itm
	for (var i=0; i<ops.length; ++i) if (!(itm = ops[i].peek(string, pos)).err) break
	return itm
}
