var Leaf = require('./_leaf'),
		Tree = require('./_tree')

module.exports = Tok

function Tok(rule) {
	var isRule = rule.isRule,
			isRegX = rule.source,
			isRegY = isRegX && rule.sticky != null
	this.term = isRule ? rule.term : isRegX ? new RegExp(rule.source, isRegY ? 'y' : 'g') : rule
	this.peek = isRule ? rule.peek : isRegY ? stickyAt : isRegX ? globalAt : textAt
	if (typeof this.peek !== 'function') throw Error
}
Tok.prototype = {
	constructor: Tok,
	isRule: true,
	kin:'',
	id: function(kin) {
		this.kin = ''+kin
		return this
	},
	scan: function(string) {
		var leaf = this.peek(string, 0)
		//complete the result with a failed remaining portion
		if (leaf.j !== string.length) return (new Tree(leaf.i)).add(leaf).add(new Leaf(leaf.j, string.slice(leaf.j), true))
		return leaf
	},
	spy: function(spy) {
		var peek = this.peek
		this.peek = function(src, pos) {
			return spy.call(this, peek.call(this, src, pos))
		}
		return this
	}
}

function textAt(string, index) {
	var ref = this.term,
			i = 0,
			pos = index || 0,
			j = pos
	while (i<ref.length) if (ref[i++] !== string[j++]) return new Leaf(pos, string.slice(pos, j-1), true, this.kin)
	return new Leaf(pos, string.slice(pos, j), false, this.kin)
}
function stickyAt(string, index) {
	var ref = this.term,
			pos = ref.lastIndex = index || 0,
			res = ref.exec(string)
	return res ? new Leaf(pos, res[0], false, this.kin)
		: new Leaf(pos, pos >= string.length - 1 ? '' : string[pos], true, this.kin)
}
function globalAt(string, index) {
	var ref = this.term,
			pos = ref.lastIndex = index || 0,
			res = ref.exec(string)
	return (res && res.index === pos) ? new Leaf(pos, res[0], false, this.kin)
		: new Leaf(pos, pos >= string.length - 1 ? '' : string[pos], true, this.kin)
}
