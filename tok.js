var Leaf = require('./src/_leaf'),
		Rule = require('./src/_rule')

module.exports = function(pattern) {
	return tokset.call(new Rule(tokset), pattern)
}
function tokset(pattern) {
	if (pattern.constructor === Rule) {
		this.def = pattern.def
		this.peek = pattern.peek
	} else if (pattern.source) {
		this.def = new RegExp(pattern.source, pattern.sticky == null ? 'g' : 'y')
		this.peek = this.def.sticky ? stickyAt : globalAt
	} else {
		this.def = pattern
		this.peek = textAt
	}
	return this
}
function textAt(string, index) {
	var ref = this.def,
			i = 0,
			pos = index || 0,
			j = pos
	while (i<ref.length) if (ref[i++] !== string[j++]) return new Leaf(pos, string.slice(pos, j), true, this.kin)
	return new Leaf(pos, string.slice(pos, j), false, this.kin)
}
function stickyAt(string, index) {
	var ref = this.def,
			pos = ref.lastIndex = index || 0,
			res = ref.exec(string)
	return res ? new Leaf(pos, res[0], false, this.kin) : new Leaf(pos, pos >= string.length - 1 ? '' : string[pos], true, this.kin)
}
function globalAt(string, index) {
	var ref = this.def,
			pos = ref.lastIndex = index || 0,
			res = ref.exec(string)
	return (res && res.index === pos) ? new Leaf(pos, res[0], false, this.kin) : new Leaf(pos, pos >= string.length - 1 ? '' : string[pos], true, this.kin)
}
