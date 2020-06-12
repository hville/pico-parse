export function Tree(input, rule, i, j, err) {
	this.i = i
	this.j = j
	this.cuts = []
	this.err = err || false
	Object.defineProperty(this, 'input', {value: input})
	if (rule._id) this.id = rule._id
}
Tree.prototype = {
	constructor: Tree,
	id: '',
	toString: function(xfo) {
		var code = this.input
		if (!xfo) return !this.i && this.j === code.length ? code : code.slice(this.i, this.j)
		if (!this.cuts.length) return xfo.call(this, !this.i && this.j === code.length ? code : code.slice(this.i, this.j))
		var j = this.i,
				cuts = this.cuts,
				res = ''
		for (var i=0; i<cuts.length; ++i) {
			if (cuts[i].i > j) res += code.slice(j, cuts[i].i)
			res += cuts[i].toString(xfo)
			j = cuts[i].j
		}
		if (this.j > j) res += code.slice(j, this.j)
		return xfo.call(this, res)
	},
	add: function(itm) {
		var kids = this.cuts
		this.j = itm.j
		if (itm.err) { //simple add to keep the error (and minimize work)
			this.err = true
			kids.push(itm)
		} else if (itm.id && itm.id !== this.id) {
			var kin = this.item(-1)
			if (kin && itm.id === kin.id) kin.cuts.push.apply(kin.cuts, itm.cuts) //drop the middle man, fuse with elder brother
			else kids.push(itm) //simple add - itm is one of a kind
		} else kids.push.apply(kids, itm.cuts) //drop the middle man, fuse to self
		return this
	},
	item: function(idx) {
		return idx < 0 ? this.cuts[this.cuts.length-idx] : this.cuts[idx]
	},
	each: function(fcn, ctx) {
		for (var i=0, arr=this.cuts; i<arr.length; ++i) fcn.call(ctx, arr[i], i, arr)
		return this
	},
	map: function(fcn, ctx) {
		return this.cuts.map(fcn, ctx||this)
	},
	fold: function(fcn, res) {
		for (var i=0, arr=this.cuts; i<arr.length; ++i) res = fcn(res, arr[i], i, arr)
		return res
	}
}
