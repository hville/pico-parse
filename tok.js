var Leaf = require('./src/_leaf'),
		Rule = require('./src/_rule')

module.exports = function(pattern) {
	return Tok.prototype.set.call(new Tok, pattern)
}
function Tok() {
	this.term = null
	this.peek = null
}
Tok.prototype = new Rule(
	function(pattern) {
		if (pattern.source) {
			this.term = new RegExp(pattern.source, pattern.sticky == null ? 'g' : 'y')
			this.peek = this.term.sticky ? stickyAt : globalAt
		} else {
			this.term = pattern
			this.peek = textAt
		}
		return this
	},
	null
)
function textAt(string, index) {
	var ref = this.term,
			i = 0,
			pos = index || 0,
			j = pos
	while (i<ref.length) if (ref[i++] !== string[j++]) return new Leaf(pos, string.slice(pos, j), true)
	return new Leaf(pos, string.slice(pos, j), false)
}
function stickyAt(string, index) {
	var ref = this.term,
			pos = ref.lastIndex = index || 0,
			res = ref.exec(string)
	return res ? new Leaf(pos, res[0], false)
		: new Leaf(pos, pos >= string.length - 1 ? '' : string[pos], true)
}
function globalAt(string, index) {
	var ref = this.term,
			pos = ref.lastIndex = index || 0,
			res = ref.exec(string)
	return (res && res.index === pos) ? new Leaf(pos, res[0], false)
		: new Leaf(pos, pos >= string.length - 1 ? '' : string[pos], true)
}
