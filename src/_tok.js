import {Leaf} from './_leaf.js'
import {Tree} from './_tree.js'

export function Tok(rule) {
	var isRule = rule.isRule,
			isRegX = rule.source,
			isRegY = isRegX && rule.sticky != null
	this.term = isRule ? rule.term : isRegX ? new RegExp(rule.source, isRegY ? 'y' : 'g') : rule
	this.peek = isRule ? rule.peek : isRegY ? stickyAt : isRegX ? globalAt : textAt
	if (typeof this.peek !== 'function') throw Error
}
Tok.prototype = {
	constructor: Tok,
	isRule: true, //TODO used?
	kin:'',
	id: function(kin) {
		this.kin = ''+kin
		return this
	},
	scan: function(string) {
		var leaf = this.peek(string, 0)
		//complete the result with a failed remaining portion
		return leaf.j === string.length ? leaf
			: (new Tree(leaf.i)).add(leaf).add(new Leaf(leaf.j, string.slice(leaf.j), 1))
	},
	spy: function(spy) {
		var peek = this.peek
		this.peek = function(src, pos) {
			return spy.call(this, peek.call(this, src, pos))
		}
		return this
	}
}

function textAt(string, pos) {
	var ref = this.term,
			i = 0,
			j = pos
	while (i<ref.length) if (ref[i++] !== string[j++]) return new Leaf(pos, string.slice(pos, j-1), 1, this.kin)
	return new Leaf(pos, string.slice(pos, j), 0, this.kin)
}
function stickyAt(src, pos) {
	this.term.lastIndex = pos
	var res = this.term.exec(src)
	return res ? new Leaf(pos, res[0], 0, this.kin)
		: new Leaf(pos, pos === src.length ? '' : src[pos], 1, this.kin)
}
function globalAt(src, pos) {
	this.term.lastIndex = pos
	var res = this.term.exec(src)
	return (res && res.index === pos) ? new Leaf(pos, res[0], 0, this.kin)
		: new Leaf(pos, pos === src.length ? '' : src[pos], 1, this.kin)
}
