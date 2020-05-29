import {Tree} from './src/_tree.js'
import {Rule, set, peek} from './src/_rule.js'

export default function() {
	return set.apply(new Opt, arguments)
}
function Opt() {
	this.rules = []
}
Opt.prototype = new Rule(Opt, {
	peek: function(text, pos) {
		var res = peek.call(this, text, pos)
		if (res.err) return new Tree(text, this, pos, pos)
		return res
	}
})
