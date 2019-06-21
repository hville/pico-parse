var Rule = require('./src/_rule'),
		arrset = require('./src/__arrset')

module.exports = function() {
	var tok = new Rule(arrset, anypeek)
	//@ts-ignore
	if (this instanceof String) tok.kin = ''+this
	return arrset.apply(tok, arguments)
}

function anypeek(string, index) {
	var ops = this.def,
			pos = index || 0,
			itm
	for (var i=0; i<ops.length; ++i) if (!(itm = ops[i].peek(string, pos)).err) break
	if (this.kin) itm.kin = this.kin
	return itm
}
