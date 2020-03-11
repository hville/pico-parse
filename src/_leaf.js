module.exports = Leaf

function Leaf(i, txt, err, kin) {
	this.i = i
	this.txt = txt
	this.j = i+txt.length
	this.err = err
	if (kin) this.kin = kin
}
Leaf.prototype.kin = ''
Leaf.prototype.fuse = function(xfos) {
	//@ts-ignore
	var fcn = xfos && xfos[this.kin]
	return fcn ? fcn.call(this, this.txt) : this.txt
}
