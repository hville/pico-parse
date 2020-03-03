var tok = require('../tok')

module.exports = function() {
	//@ts-ignore
	for (var i=0, def = this.rules = []; i<arguments.length; ++i) {
		var arg = arguments[i]
		def[i] = arg.rules ? arg : tok(arg)
	}
	return this
}
