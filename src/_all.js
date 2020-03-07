var set = require('./__allset'),
		Rule = require('./_rule'),
		peek = require('./__allpeek')

module.exports = All
function All() {
	this.rules = []
}
All.prototype = new Rule(All, {
	set: set,
	peek: peek
})
