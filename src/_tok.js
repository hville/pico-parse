import {Tree} from './_tree.js'

export function Tok(term) {
	var isRegX = term.source,
			isRegY = isRegX && term.sticky != null
	this.term = isRegX ? new RegExp(term.source, isRegY ? 'y' : 'g') : term
	this.peek = isRegY ? stickyAt : isRegX ? globalAt : textAt
	if (typeof this.peek !== 'function') throw Error
}
Tok.prototype = {
	constructor: Tok,
	scan: function(text) {
		var res = this.peek(text, 0)
		//complete the result with a failed remaining portion
		if (res.j !== text.length) res.add(new Tree(text, this, res.j, text.length, 1))
		return res
	},
	spy: function(spy) {
		var peek = this.peek
		this.peek = function(src, pos) {
			return spy.call(this, peek.call(this, src, pos))
		}
		return this
	}
}

function textAt(src, pos) {
	if (pos >= src.length) new Tree(src, this, pos, pos, 1)
	var ref = this.term,
			i = 0,
			j = pos
	while (i<ref.length) if (ref[i++] !== src[j++]) return new Tree(src, this, pos, Math.min(j, src.length), 1)
	return new Tree(src, this, pos, j, 0)
}
function stickyAt(src, pos) {
	if (pos >= src.length) new Tree(src, this, pos, pos, 1)
	this.term.lastIndex = pos
	var res = this.term.test(src)
	return res ? new Tree(src, this, pos, this.term.lastIndex, 0)
		: new Tree(src, this, pos, pos === src.length ? pos : pos+1, 1)
}
function globalAt(src, pos) {
	if (pos >= src.length) new Tree(src, this, pos, pos, 1)
	this.term.lastIndex = pos
	var res = this.term.exec(src)
	return (res && res.index === pos) ? new Tree(src, this, pos, pos+res[0].length, 0)
		: new Tree(src, this, pos, pos === src.length ? pos : pos+1, 1)
}
