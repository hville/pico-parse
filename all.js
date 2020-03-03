var mapR = require('./src/__set'),
		proto = require('./src/prototype')

module.exports = function() {
	return mapR.apply(new All, arguments)
}
function All() {
	this.rules = null
}
All.prototype = proto
