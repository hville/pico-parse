var mapR = require('./src/__set'),
		proto = require('./src/prototype')

module.exports = function() {
	return mapR.apply(new Any, arguments)
}
function Any() {
	this.rules = null
	this.peek = peek
}
Any.prototype = proto
function peek(string, index) {
	var ops = this.rules,
			pos = index || 0,
			itm
	for (var i=0; i<ops.length; ++i) if (!(itm = ops[i].peek(string, pos)).err) break
	return itm
}
