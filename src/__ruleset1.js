var tok = require('../tok'),
		all = require('../all')

module.exports = function (rule) {
	//@ts-ignore
	this.def = arguments.length > 1 ? all.apply(null, arguments) : rule.isRule ? rule : tok(rule)
	return this
}
