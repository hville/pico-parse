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
		if (res.j !== text.length) res.add(new Tree(text, this, res.j, text.length, true))
		return res
	},
	spy: function(ante, post) {
		var peek = this.peek
		this.peek = function(src, pos) {
			if (ante) ante.call(this, src, pos)
			var res = peek.call(this, src, pos)
			if (post) post.call(this, src, pos, res)
			return res
		}
		return this
	}
}

function textAt(src, pos) {
	if (pos >= src.length) new Tree(src, this, pos, pos, true)
	var ref = this.term,
			i = 0,
			j = pos
	while (i<ref.length) if (ref[i++] !== src[j++]) return new Tree(src, this, pos, Math.min(j, src.length), true)
	return new Tree(src, this, pos, j)
}
function stickyAt(src, pos) {
	if (pos >= src.length) new Tree(src, this, pos, pos, true)
	this.term.lastIndex = pos
	var res = this.term.test(src)
	return res ? new Tree(src, this, pos, this.term.lastIndex)
		: new Tree(src, this, pos, pos === src.length ? pos : pos+1, true)
}
function globalAt(src, pos) {
	if (pos >= src.length) new Tree(src, this, pos, pos, true)
	this.term.lastIndex = pos
	var res = this.term.exec(src)
	return (res && res.index === pos) ? new Tree(src, this, pos, pos+res[0].length)
		: new Tree(src, this, pos, pos === src.length ? pos : pos+1, true)
}
