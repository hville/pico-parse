var tok = require('./tok')

/**
 * @param {Object.<string, Object|string>} pairs
 * @return {Object.<string, Object>}
 */
module.exports = function(pairs) {
	for (var i=0, ks=Object.keys(pairs); i<ks.length; ++i) {
		var kin = ks[i],
				itm = pairs[kin]
		if (!itm.isRule) itm = pairs[kin] = tok(itm)
		itm.kin = ks[i]
	}
	return pairs
}
