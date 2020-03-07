var All = require('./src/_all')

module.exports = function() {
	return All.prototype.set.apply(new All, arguments)
}
