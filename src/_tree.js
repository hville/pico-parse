export function Tree(text, rule, i, j, err) {
	this.text = text
	this.i = i
	this.j = j
	this.cuts = []
	this.err = err || false
	if (rule._kin) Object.assign(this, rule._kin)
	if (rule._id) this.id = rule.id
}
Tree.prototype = {
	constructor: Tree,
	id: '',
	add: function(itm) {
		this.j = itm.j
		if (itm.err) {
			this.err = true
			this.cuts.push(itm)
		} else if (itm.id && itm.id !== this.id) {
			var kin = this.item(-1)
			if (kin && itm.id === kin.id) kin.add(itm)
			else this.cuts.push(itm)
		} else this.cuts.push.apply(this.cuts, itm.cuts)
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
	},
	fuse: function() {
		var src = this.cuts,
				tgt = []
		for (var i=0; i<src.length; ++i) {
			var kid = src[i]
			// feed the kids first
			kid.fuse()
			if (!kid.id || kid.id === this.id)
				// then eat the orphans and siblings
				tgt.push(...kid.cuts)
			else if (i && kid.id === src[i-1].id) {
				// and match kids that have mutual afinities
				src[i-1].cuts.push(...kid.cuts)
				if (kid.err) src[i-1].err = true
			}
			else tgt.push(kid) // but leave the loners alone
		}
		this.cuts = tgt
		return this
	},
	walk: function(ante, post, val) {
		//loop each children with a transformation on the way down and on the way up
		val = ante(val, this, this.id)
		for (var i=0,arr=this.cuts; i<arr.length; ++i) val = arr[i].walk(ante, post, val)
		return post(val, this, this.id)
	}
}
