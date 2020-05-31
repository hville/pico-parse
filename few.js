import {Tree} from './src/_tree.js'
import {Rule, add, peek} from './src/_rule.js'

export default function() {
	return add.apply(new Few, arguments)
}
function Few() {
	this.rules = []
}
Few.prototype = new Rule(Few, {
	peek: function(text, pos) {
		var tree = new Tree(text, this, pos, pos)
		for (var i=0; i<text.length; ++i) {
			var res = peek.call(this, text, tree.j)
			if (res.err) break
			tree.add(res)
		}
		if (tree.cuts.length === 0) {
			tree.err = true
			++tree.j
		}
		return tree
	}
})
