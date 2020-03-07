var tok = require('./tok'),
		Rule = require('./src/_rule'),
		peek = require('./src/__allpeek')

//TODO: note standalone function to return a new rule as opposed to modifing one
module.exports = function() {
	return set.apply(new Kin, arguments)
}
function Kin() {
	this.kin = ''
	this.rules = []
}
Kin.prototype = new Rule(Kin, {
	set: set,
	peek: function(string, index) {
		var tree = this.rules.length === 1 ? this.rules[0].peek(string, index||0) : peek.call(this, string, index||0)
		tree.kin = this.kin
		return tree
	}
})
function set(name) {
	this.kin = name
	for (var i=1, rs=this.rules=[]; i<arguments.length; ++i) {
		var arg = arguments[i]
		rs.push(arg.isRule ? arg : tok(arg))
	}
	return this
}
