import {Tree} from './_tree.js'
import {Tok} from './_tok.js'

export function Rule(constructor, stuff) {
	this.constructor = constructor
	this.peek = peek // most called function by far... closer up the prototype chain
	if (stuff) Object.assign(this, stuff)
}
export const set = Rule.prototype.set = function() {
	var def = this.rules,
			len = arguments.length
	for (var i=0; i<len; ++i) {
		var arg = arguments[i]
		def.push(arg.peek ? arg : new Tok(arg))
	}
	return this
}
export function peek(src, pos) {
	var ops = this.rules
	if (ops.length === 1) return ops[0].peek(src, pos)
	var tree = new Tree(src, this, pos, pos)
	for (var i=0; i<ops.length; ++i) if (tree.add(ops[i].peek(src, tree.j)).err) break
	return tree
}
/* TODO future peek(tree, pos)
	if (tree.rule !== this || !tree.cuts.length) normal
	else tree.cuts.forEach(leaf => )
*/
Rule.prototype.scan = Tok.prototype.scan
Rule.prototype.spy = Tok.prototype.spy
