export function Tree(i) {
	this.i = i
	this.j = i
	this.err = 0
	this.set = []
}
Tree.prototype.id = ''
Tree.prototype.txt = ''
Tree.prototype.add = function(itm) {
	var set = this.set
	this.j = itm.j
	if (!itm.set) { //Leaf
		var last = set[set.length-1]
		if (last && itm.err === last.err && itm.id === last.id) last.add(itm)
		else {
			set.push(itm)
			this.err += itm.err
		}
	} else if (itm.err || itm.id) {
		this.err += itm.err
		set.push(itm)
	} else if (itm.j > itm.i) { //merge annonymous groups
		this.j = itm.j
		if (itm.set && !itm.id) for (var i=0; i<itm.set.length; ++i) this.set.push(itm.set[i])
		//append named groups
		this.set.push(itm)
	}
	return this
}

Tree.prototype.fuse = function(xfos) {
	//@ts-ignore
	var fcn = xfos && xfos[this.id],
			set = this.set,
			res = ''
	for (var i=0; i<set.length; ++i) res += set[i].fuse(xfos)
	return fcn ? fcn.call(this, res) : res
}
Tree.prototype.fold = function(red, tgt) {
	for (var i=0, set = this.set; i<set.length; ++i) tgt = red(tgt||this, set[i])
	return tgt
}
