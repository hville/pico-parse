var tok = require('../tok')

module.exports = function() {
	//@ts-ignore
	var def = this.rules,
			len = def.length = arguments.length
	for (var i=0; i<len; ++i) {
		var arg = arguments[i]
		def[i] = arg.isRule ? arg : tok(arg)
	}
	return this
}
