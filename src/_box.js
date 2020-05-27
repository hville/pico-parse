import {Tree} from './_tree.js'
import {spy, scan} from './src/proto.js'

//TODO
export function Box(rule) {
	this.rule = rule
	this.last = null
}
Box.prototype = {
	constructor: Box,
	set: function() {
		this.rule.set.apply(this.rule, arguments)
		return this
	},
	peek: function(src, pos) {
		if (this.last) return this.last //TODO this.last.i===index            //for the repeat calls in the loop below
		var next = this.last = new Tree(src, this, pos, pos, 1) //first pass fails
		while ((next = this.rule.peek(src, pos)).j > this.last.j) this.last = next
		next = this.last
		this.last = null
		return next
	},
	scan: scan,
	spy: spy
}
