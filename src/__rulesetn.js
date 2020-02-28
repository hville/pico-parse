var tok = require('../tok')

module.exports = function() {
	//@ts-ignore
	for (var i=0, def = this.def = []; i<arguments.length; ++i) {
		var arg = arguments[i]
		def[i] = arg.isRule ? arg : tok(arg)
	}
	return this
}
