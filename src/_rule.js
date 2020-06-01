import {Tree} from './_tree.js'

export function Rule(constructor, stuff) {
	this.constructor = constructor
	this.peek = peek // most called function by far... closer up the prototype chain
	if (stuff) Object.assign(this, stuff)
}
export const add = Rule.prototype.add = function() {
	var def = this.rules,
			len = arguments.length
	for (var i=0; i<len; ++i) {
		var arg = arguments[i]
		def.push(arg.peek ? arg : new Rule.Tok(arg)) //assigned in Tok down the import chain
	}
	return this
}
export function peek(src, pos) {
	var ops = this.rules
	if (ops.length === 1 && !this._id && !this._kin) return ops[0].peek(src, pos)
	var tree = new Tree(src, this, pos, pos)
	for (var i=0; i<ops.length; ++i) if (tree.add(ops[i].peek(src, tree.j)).err) break
	return tree
}
/* TODO future peek(tree, pos)
	if (tree.rule !== this || !tree.cuts.length) normal
	else tree.cuts.forEach(leaf => )
*/
Rule.prototype.scan = function(text) {
	var res = this.peek(text, 0)
	//complete the result with a failed remaining portion
	if (res.j !== text.length) res.add(new Tree(text, this, res.j, text.length, true))
	return res
}
Rule.prototype.spy = function(ante, post) {
	var oldPeek = this.peek
	this.peek = function(src, pos) {
		if (ante) ante.call(this, src, pos)
		var res = oldPeek.call(this, src, pos)
		if (post) post.call(this, src, pos, res)
		return res
	}
	return this
}
Rule.prototype.id = function(id) {
	this._id = id
	return this
}
Rule.prototype.kin = function(kin) {
	this._kin = kin
	return this
}
import {Tok} from './_tok.js'
Rule.Tok = Tok
