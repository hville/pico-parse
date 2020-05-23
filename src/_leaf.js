export function Leaf(i, txt, err, kin) {
	this.i = i
	this.txt = txt
	this.j = i+txt.length
	this.err = err
	if (kin) this.id = kin
}
Leaf.prototype.id = ''
Leaf.prototype.add = function(itm) {
	if (itm.set) throw Error('can\'t add a tree to a leaf')
	this.txt += itm.txt
	this.j += itm.j - itm.i
	this.err = this.err & itm.err
}
Leaf.prototype.fuse = function(xfos) {
	//@ts-ignore
	var fcn = xfos && xfos[this.id]
	return fcn ? fcn.call(this, this.txt) : this.txt
}
