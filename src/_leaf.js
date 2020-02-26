module.exports = Leaf

function Leaf(i, txt, err) {
	this.i = i
	this.txt = txt
	this.j = i+txt.length
	this.err = err
}
Leaf.prototype.fuse = function(xfos) {
	var fcn = xfos && xfos[this.kin] //TODO this.kin?
	return fcn ? fcn.call(this, this.txt) : this.txt
}
