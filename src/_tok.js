import {Tree} from './_tree.js'
import {Rule} from './_rule.js'

export function Tok(term) {
	var isRegX = term.source,
			isRegY = isRegX && term.sticky != null
	this.term = isRegX ? new RegExp(term.source, isRegY ? 'y' : 'g') : term
	this.peek = isRegY ? stickyAt : isRegX ? globalAt : textAt
}
Tok.prototype = new Rule()

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
