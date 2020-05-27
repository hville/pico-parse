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

export function peek(src, pos) {
	var ops = this.rules,
			tree
	if (ops.length === 1) tree = ops[0].peek(src, pos)
	else {
		tree = new Tree(src, this, pos, pos, 0)
		for (var i=0; i<ops.length; ++i) tree.add(ops[i].peek(src, tree.j))
	}
	return tree
}

export const {scan, spy} = Tok.prototype
