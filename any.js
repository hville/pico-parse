var Rule = require('./src/_rule'),
		arrset = require('./src/__rulesetn')

module.exports = function() {
	return arrset.apply(new Rule(arrset, anypeek), arguments)
}

function anypeek(string, index) {
	var ops = this.def,
			pos = index || 0,
			itm
	for (var i=0; i<ops.length; ++i) if (!(itm = ops[i].peek(string, pos)).err) break
	if (this.kin) itm.kin = this.kin
	return itm
}
