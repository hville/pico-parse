export function Tree(input, rule, i, j, err) {
	this.i = i
	this.j = j
	this.cuts = []
	this.err = err || false
	Object.defineProperty(this, 'input', {value: input})
	if (rule._kin) Object.assign(this, rule._kin)
	if (rule._id) this.id = rule._id
}
Tree.prototype = {
	constructor: Tree,
	id: '',
	get text() {
		var code = this.input
		if (!this.cuts.length) return !this.i && this.j === code.length ? code : code.slice(this.i, this.j)
		var j = this.i,
				cuts = this.cuts,
				res = ''
		for (var i=0; i<cuts.length; ++i) {
			if (cuts[i].i > j) res += code.slice(j, cuts[i].i)
			res += cuts[i].text
			j = cuts[i].j
		}
		if (this.j > j) res += code.slice(j, this.j)
		return res
	},
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
	each: function(fcn, ctx) {
		for (var i=0, arr=this.cuts; i<arr.length; ++i) fcn.call(ctx, arr[i], i, arr)
		return this
	},
	map: function(fcn, ctx) {
		return this.cuts.map(fcn, ctx||this)
	},
	foldl: function(fcn, res) {
		for (var i=0, arr=this.cuts; i<arr.length; ++i) res = fcn(res, arr[i], i, arr)
		return res
	},
	foldr: function(fcn, res) {
		for (var arr=this.cuts, i=arr.length-1; i>=0; --i) res = fcn(res, arr[i], i, arr)
		return res
	}
}
