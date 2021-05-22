import {Tree} from './src/_tree.js'
import {Rule, add, peek} from './src/_rule.js'

export default function() {
	return add.apply(new Few, arguments)
}
function Few() {
	this.rules = []
}
Few.prototype = new Rule({
	peek: function(code, spot) {
		var tree = new Tree(code, this, spot, spot),
				res = peek.call(this, code, tree.j)
		if (!tree.add(res).err) while(tree.j < code.length) {
			res = peek.call(this, code, tree.j)
			if (res.err) return tree
			tree.add(res)
		}
		return tree
	}
})
