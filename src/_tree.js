export function Tree(text, rule, i, j, err) {
	this.text = text
	this.rule = rule
	this.i = i
	this.j = j
	this.cuts = []
	this.err = err || false
}
Tree.prototype.add = function(itm) {
	this.j = itm.j
	this.cuts.push(itm)
	if (itm.err) this.err = true
	return this
}
Tree.prototype.toString = function() {
	return this.cuts.length ? this.cuts.join('') : this.text.slice(this.i, this.j)
}
Tree.prototype.each = function(ante, post) {
	//loop each children with a transformation on the way down and on the way up
	var set = this.set,
			i = 0
	this.err = false
	while(i<set.length) {
		if (ante && set[i].rule[ante]) set[i] = set[i].rule[ante](set[i], i)
		if (set[i]) {
			set[i].each(ante, post)
			if (post && set[i].rule[post]) set[i] = set[i].rule[post](set[i], i)
		}
		if (set[i] && set[i++].err) this.err = true
		else set.splice(i,1)
	}
	return this
}
Tree.prototype.fold = function(ante, post, crop) {
	//loop each children with a transformation on the way down and on the way up
	var set = this.set,
			i = 0
	while(i<set.length) {
		if (ante && set[i].rule[ante]) crop = set[i].rule[ante](crop, set[i], i)
		set[i].fold(ante, post, crop)
		if (post && set[i].rule[post]) crop = set[i].rule[post](crop, set[i], i)
	}
	return crop
}
