var Tree = require('./_tree'),
		Leaf = require('./_leaf')

module.exports = Rule

function Rule(constructor, methods) {
	this.constructor = constructor
	if (methods) for (var i=0, ks=Object.keys(methods); i<ks.length; ++i)
		this[ks[i]] = methods[ks[i]]
}
Rule.prototype.isRule = true
Rule.prototype.scan = function(string) {
	var res = this.peek(string, 0)
	if (res.j !== string.length) {
		if (res.constructor === Leaf) res = (new Tree(res.i)).add(res)
		res.add(new Leaf(res.j, string.slice(res.j), true))
	}
	return res
}
Rule.prototype.set = null
Rule.prototype.peek = null
Rule.prototype.kin = ''
Rule.prototype.name = function(kin) {
	this.kin = ''+kin
	return this
}
