var text = require('./tok'),
		Rule = require('./src/_rule')

module.exports = function(rule, cb) {
	var tok = new Rule(spyset, spypeek)
	//@ts-ignore
	if (this instanceof String) tok.kin = ''+this
	return tok.set(rule, cb)
}

function spyset(rule, cb) {
	this.def = [rule.isRule ? rule : text(rule), cb]
	return this
}

function spypeek(string, index) {
	var pos = index || 0,
			itm = this.def[0].peek(string, pos),
			cb = this.def[1]
	if (this.kin) itm.kin = this.kin
	if (cb) cb(itm)
	return itm
}
