var scan = require('./__rulescan')

module.exports = Rule

function Rule(set, peek) {
	this.def = null
	this.set = set
	this.peek = peek
}
Rule.prototype.isRule = true
Rule.prototype.scan = scan
