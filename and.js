import {Tree} from './src/_tree.js'
import {Rule, set, peek} from './src/_rule.js'

export default function() {
	return set.apply(new And, arguments)
}
function And() {
	this.rules = []
}
And.prototype = new Rule(And, {
	peek: function(text, spot) {
		var next = peek.call(this, text, spot),
				tree = new Tree(text, this, spot, spot)
		if (next.err) tree.err = true
		return tree
	}
})
