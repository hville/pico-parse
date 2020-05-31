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
	var cuts = this.cuts,
			i = 0
	this.err = false
	while(i<cuts.length) {
		var itm = cuts[i],
				fix = itm.rule._kin
		if (ante && fix && fix[ante]) itm = cuts[i] = fix[ante](itm, i)
		if (itm) {
			fix = itm.rule._kin
			itm.each(ante, post)
			if (post && fix && fix[post]) itm = cuts[i] = fix[post](itm, i)
		}
		if (!itm) cuts.splice(i,1)
		else {
			if (itm.err) this.err = true
			++i
		}
	}
	return this
}
Tree.prototype.fold = function(ante, post, result) {
	//loop each children with a transformation on the way down and on the way up
	for (var i=0, cuts = this.cuts; i<cuts.length; ++i) {
		var fix = cuts[i].rule
		if (ante && fix && fix[ante]) result = fix[ante](result, cuts[i], i)
		result = cuts[i].fold(ante, post, result)
		fix = cuts[i].rule
		if (post && fix && fix[post]) result = fix[post](result, cuts[i], i)
	}
	return result
}
Tree.prototype.fuse = function() {
	var src = this.cuts,
			tgt = []
	for (var i=0; i<src.length; ++i) {
		var kid = src[i]
		// feed the kids first
		kid.fuse()
		if (!kid.rule._kin || kid.rule._kin === this.rule._kin)
			// then eat the orphans and siblings
			tgt.push(...kid.cuts)
		else if (i && kid.rule._kin === src[i-1].rule._kin) {
			// and match kids that have mutual afinities
			src[i-1].cuts.push(...kid.cuts)
			if (kid.err) src[i-1].err = true
		}
		else tgt.push(kid) // but leave the loners alone
	}
	this.cuts = tgt
	return this
}
