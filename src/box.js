var Tree = require('./_tree'),
		Leaf = require('./_leaf'),
		mapR = require('./__set')

function log(f) {
	return f
}
var proto = {
	set: mapR, //TODO breaks link when set...
	peek: function(string, index) {
		console.log(index, this.last)
		if (this.last) return this.last //TODO this.last.i===index            //for the repeat calls in the loop below
		var spot = index||0,
				next = this.last = new Leaf(spot, '', true) //first pass fails
		while ((next = log(this.poke(string, spot))).j > this.last.j) this.last = next
		next = this.last
		this.last = null
		return next
	},
	scan: function(string) {
		var res = this.peek(string, 0)
		if (res.j !== string.length) {
			if (!res.add) res = (new Tree(res.i).add(res))
			res.add(new Leaf(res.j, string.slice(res.j), true))
		}
		return res
	}
}
module.exports = function(rule) {
	return Object.assign(Object.create(proto), {
		rules: rule.rules,
		poke: rule.peek,
		last: null
	})
}
