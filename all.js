var mapR = require('./src/__rulesetn'),
		proto = require('./src/prototype')

module.exports = function() {
	return mapR.apply(new All, arguments)
}
function All() {
	this.def = null
}
All.prototype = proto
