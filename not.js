import {Tree} from './src/_tree.js'
import {Rule, peek, set} from './src/_rule.js'

export default function() {
	return set.apply(new Not, arguments)
}
function Not() {
	this.rules = []
}
Not.prototype = new Rule(Not, {
	peek: function(text, spot) {
		var next = peek.call(this, text, spot),
				tree = new Tree(text, this, spot, spot)
		if (!next.err) tree.err = true
		return tree
	}
})
