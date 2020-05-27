export function Tree(text, rule, i, j, err) {
	this.text = text
	this.rule = rule
	this.i = i
	this.j = j
	this.cuts = []
	this.err = err
}
Tree.prototype.add = function(itm) {
	this.j = itm.j
	this.cuts.push(itm)
	this.err += itm.err
	return this
}
Tree.prototype.cut = function() {
	return this.text.slice(this.i, this.j)
}
