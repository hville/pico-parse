var tok = require('../tok')

module.exports = function() {
	//@ts-ignore
	var def = this.def = []
	for (var i=0; i<arguments.length; ++i) {
		var arg = arguments[i]
		def[i] = arg.isRule ? arg : tok(arg)
	}
	return this
}
