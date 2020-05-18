import {Leaf} from './_leaf.js'
import {All} from './_all.js'

export function Box(rule) {
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
	peek: function(src, pos) {
		if (this.last) return this.last //TODO this.last.i===index            //for the repeat calls in the loop below
		var next = this.last = new Leaf(pos, '', true) //first pass fails
		while ((next = this.rule.peek(src, pos)).j > this.last.j) this.last = next
		next = this.last
		this.last = null
		return next
	},
	id: All.prototype.id,
	scan: All.prototype.scan,
	spy: All.prototype.spy
}
