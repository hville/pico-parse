var set = require('./src/__rulesetn'),
		Rule = require('./src/_rule'),
		Leaf = require('./src/_leaf')

module.exports = function() {
	return set.apply(new Any, arguments)
}
function Any() {
	this.def = null
}
Any.prototype = new Rule(set,
	function(string, index) {
		var ops = this.def,
				pos = index || 0,
				itm
		for (var i=0; i<ops.length; ++i) if (!(itm = ops[i].peek(string, pos)).err) break
		return itm
	}
)
//@ts-ignore
Any.prototype.fix = function() {
	this.any = this.peek
	this.last = null
	this.peek = function(src, i) {
		if (this.last) return this.last              //for the repeat calls in the loop below
		var next = this.last = new Leaf(i, '', true) //first pass fails
		while (true) {
			var tree = this.any(src, i)
			if (tree.j > next.j) next = this.last = tree
			else return (this.last = null), next
		}
	}
	return this
}
