var Leaf = require('./src/_leaf'),
		Rule = require('./src/_rule')

module.exports = function(pattern) {
	var tok = new Rule(tokset)
	//@ts-ignore
	if (this instanceof String) tok.kin = ''+this
	return tok.set(pattern)
}
function tokset(pattern) {
	var src = pattern.source
	this.def = !src ? pattern : new RegExp(src, pattern.sticky == null ? 'g' : 'y')
	this.peek = !src ? textAt : this.def.sticky ? stickyAt : globalAt
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
