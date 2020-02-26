var Rule = require('./src/_rule'),
		text = require('./tok')

module.exports = function(rule, cb) {
	return Spy.prototype.set.call(new Spy, rule, cb)
}
function Spy() {
	this.def = null
}
Spy.prototype = new Rule(
	function(rule, cb) {
		this.def = [rule.isRule ? rule : text(rule), cb]
		return this
	},
	function(string, index) {
		var pos = index || 0,
				itm = this.def[0].peek(string, pos),
				cb = this.def[1]
		if (cb) cb(itm)
		return itm
	}
)
