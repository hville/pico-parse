module.exports = Tree

function Tree(i) {
	this.i = i
	this.j = i
	this.err = false
	this.set = []
}
Tree.prototype.add = function(itm) {
	//failure is contagious, unless you've never really failed
	if (!this.err || this.j === this.i) this.err = itm.err
	this.j = itm.j
	//merge orphan lists
	var set = this.set
	if (itm.set && !itm.kin) for (var i=0; i<itm.set.length; ++i) set[set.length] = itm.set[i]
	else if (itm.j > itm.i) set[set.length] = itm
	//done!
	return this
}

Tree.prototype.fuse = function(xfos) {
	var fcn = xfos && xfos[this.kin], //TODO this.kin
			set = this.set,
			res = ''
	for (var i=0; i<set.length; ++i) res += set[i].fuse(xfos)
	return fcn ? fcn.call(this, res) : res
}
Tree.prototype.fold = function(red, tgt) {
	for (var i=0, set = this.set; i<set.length; ++i) tgt = red(tgt, set[i])
	return tgt
}
