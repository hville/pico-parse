export function Tree(text, rule, i, j, err) {
	this.text = text
	this.i = i
	this.j = j
	this.cuts = []
	this.err = err || false
	if (rule._kin) Object.assign(this, rule._kin)
	if (rule._id) this.id = rule._id
}
Tree.prototype = {
	constructor: Tree,
	id: '',
	add: function(itm) {
		var kids = this.cuts
		this.j = itm.j
		if (itm.err) {
			this.err = true
			kids.push(itm)
		} else if (itm.id && itm.id !== this.id) {
			var kin = this.item(-1)
			if (kids.length && kin && itm.id === kin.id) kin.add(itm)
			else kids.push(itm)
		} else kids.push.apply(kids, itm.cuts)
		return this
	},
	item: function(idx) {
		return idx < 0 ? this.cuts[this.cuts.length-idx] : this.cuts[idx]
	},
	toString: function() {
		return this.cuts.length ? this.cuts.join('') : this.text.slice(this.i, this.j)
	},
	each: function(fcn, ctx) {
		for (var i=0, arr=this.cuts; i<arr.length; ++i) fcn.call(ctx, arr[i], i, arr)
		return this
	},
	foldl: function(fcn, res) {
		for (var i=0, arr=this.cuts; i<arr.length; ++i) res = fcn(res, arr[i], i, arr)
		return this
	},
	foldr: function(fcn, res) {
		for (var arr=this.cuts, i=arr.length-1; i>=0; --i) res = fcn(res, arr[i], i, arr)
		return this
	}
}
