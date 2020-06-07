import {Tree} from './src/_tree.js'
import {Rule, add, peek} from './src/_rule.js'

export default function() {
	return add.apply(new Run, arguments)
}
function Run() {
	this.rules = []
}
Run.prototype = new Rule(Run, {
	peek: function(code, spot) {
		var tree = new Tree(code, this, spot, spot)
		while(tree.j < code.length) {
			var res = peek.call(this, code, tree.j)
			if (res.err) return tree
			tree.add(res)
		}
		return tree
	}
})
