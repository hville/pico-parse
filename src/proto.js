import {Tree} from './_tree.js'
import {Tok} from './_tok.js'

export function set() {
	var def = this.rules,
			len = arguments.length
	for (var i=0; i<len; ++i) {
		var arg = arguments[i]
		def.push(arg.peek ? arg : new Tok(arg))
	}
	return this
}

/* TODO future
	peek(tree, pos)
	if (tree.rule !== this || !tree.cuts.length) normal
	else tree.cuts.forEach(leaf => )
*/
export function peek(src, pos) {
	var ops = this.rules
	if (ops.length === 1) return ops[0].peek(src, pos)
	var tree = new Tree(src, this, pos, pos)
	for (var i=0; i<ops.length; ++i) if (tree.add(ops[i].peek(src, tree.j)).err) break
	return tree
}

export const {scan, spy} = Tok.prototype
