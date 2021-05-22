import {Tree} from './src/_tree.js'
import {Rule, add, peek} from './src/_rule.js'

export default function() {
	return add.apply(new Opt, arguments)
}
function Opt() {
	this.rules = []
}
Opt.prototype = new Rule({
	peek: function(code, pos) {
		var res = peek.call(this, code, pos)
		if (res.err) return new Tree(code, this, pos, pos)
		return this._id ? (new Tree(code, this, pos, pos)).add(res) : res
	}
})
