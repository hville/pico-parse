import {Tree} from './src/_tree.js'
import {Rule, add, peek} from './src/_rule.js'

export default function() {
	return add.apply(new And, arguments)
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
