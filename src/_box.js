var Leaf = require('./_leaf'),
		proto = require('./_all').prototype

module.exports = Box
function Box(rule) {
	this.rule = rule
	this.last = null
}
Box.prototype = {
	constructor: Box,
	isRule: true,
	kin:'',
	set: function() {
		this.rule.set.apply(this.rule, arguments)
		return this
	},
	peek: function(string, index) {
		if (this.last) return this.last //TODO this.last.i===index            //for the repeat calls in the loop below
		var spot = index||0,
				next = this.last = new Leaf(spot, '', true) //first pass fails
		while ((next = this.rule.peek(string, spot)).j > this.last.j) this.last = next
		next = this.last
		this.last = null
		return next
	},
	id: proto.id,
	scan: proto.scan,
	spy: proto.spy
}
