class R {
	constructor(ctx) { Object.assign(this, ctx) }
	static id = ''
	scan(t) {
		const res = this.peek(t,0)
		if (res.j !== t.length) res.j = -1
		else if (!res.id && res.cuts?.length === 1 && res.cuts[0].j === res.j) return res.cuts[0]
		return res
	}
	/* tree: [i,j,n,..tree] || [i,j,n] || [i,-1] */
	out(i,j,cuts) {
		//flatten
		if (cuts?.length) cuts = cuts.reduce( (f,t) => {
			if (t.id) f.push(t)
			else if (t.cuts) f.push.apply(f,t.cuts)
			return f
		}, [])
		return cuts?.length ? this.id ? {i,j,id:this.id,cuts} : {i,j,cuts} : this.id ? {i,j,id:this.id} : {i,j}
	}
}
function toRule(r) {
	return r instanceof R ? r : tok(r)
}

/* terminal tokens */
function tok(re) {
	if (isTag(re)) return tok.bind({id: t(...arguments)})
	const term = new R(this)
	term.peek = re.source ? regP : txtP
	term.rs = !re.source ? re : !re.sticky ? RegExp(re.source, 'y'+re.flags) : re
	return term
}
function regP(t,i=0) {
	const r = this.rs
	r.lastIndex = i
	// check if reset from t.length => 0 occured
	let j = !r.test(t) ? -1 : r.lastIndex !== 0 ? r.lastIndex : i !== 0 ? t.length : r.exec(t)[0].length
	return this.out(i, j)
}
function txtP(t,i=0) {
	const r = this.rs
	return this.out(i, t.startsWith(r,i) ? i+r.length : -1)
}

/* rules of many : seq any */
function ruleOfN(...rs) {
	if (isTag(rs[0])) return ruleOfN.bind({peek: this.peek, id: t(...rs)})
	return Object.assign(
		this instanceof R ? this : new R(this),
		rs.length === 0 ? {rs, set: ruleOfN}
		: rs.length === 1 && !(this.id && rs[0].id) ? toRule(rs[0])
		: {rs: rs.map( toRule )}
	)
}

/* any e0 / e1 / ... / en */
export const any = ruleOfN.bind({peek: function(t,i=0) {
	for (const r of this.rs) {
		const leaf = r.peek(t,i),
					j = leaf.j
		if (j >= 0) return this.id ? this.out(i,j,leaf) : leaf
	}
	return this.out(i,-1)
}})

/* sequence e0 e1 ... en */
export const seq = ruleOfN.bind({peek: function(t,i=0) {
	const tree = []
	let j = i
	if (j<t.length) for (const r of this.rs) {
		const leaf = r.peek(t,j)
		j = leaf.j
		if (j < 0) break
		else if (leaf.id) tree.push(leaf)
		else if (leaf.cuts) for(const cut of leaf.cuts) tree.push(cut)
	} else j = -1
	return this.out(i,j,tree)
}})

/* rules of one : and few not opt run */
function ruleOf1(...rs) {
	if (isTag(rs[0])) return ruleOf1.bind({peek: this.peek, id: t(...rs)})
	return Object.assign(
		this instanceof R ? this : new R(this),
		rs.length === 0 ? {rs, set: ruleOf1}
		: rs.length === 1 ? {rs: toRule(rs[0])}
		: {rs: seq(...rs)}
	)
}

/* &(e0 ... en) */
export const and = ruleOf1.bind({peek: function(t,i=0) {
	const j = this.rs.peek(t,i).j
	return j<0 ? this.out(i,j) : this.out(i,i)
}})

/* !(e0 ... en) */
export const not = ruleOf1.bind({peek: function(t,i=0) {
	return i>t.length ? this.out(i,-1)
		: this.rs.peek(t,i).j<0 ? this.out(i,i) : this.out(i,-1)
}})

/* (e0 ... en)+ */
export const few = ruleOf1.bind({peek: function(t,i=0) {
	const tree = [],
				r = this.rs
	let j = i,
			leaf = r.peek(t,j)
	while(leaf.j>j) {
		tree.push(leaf)
		j = leaf.j
		leaf = r.peek(t,j)
	}
	return tree.length > 0 ? this.out(i,leaf.i,tree) : this.out(i,-1)
}})

/* (e0 ... en)* */
export const run = ruleOf1.bind({peek: function(t,i=0) {
	if (i>t.length) return this.out(i,-1)
	const tree = [],
				r = this.rs
	let j = i,
			leaf = r.peek(t,j)
	while(leaf.j>j) {
		tree.push(leaf)
		j = leaf.j
		leaf = r.peek(t,j)
	}
	return this.out(i,leaf.i,tree)
}})

/* (e0 ... en)? */
export const opt = ruleOf1.bind({peek: function(t,i=0) {
	if (i>t.length) return this.out(i,-1)
	let leaf = this.rs.peek(t,i)
	return leaf.j <0 ? this.out(i,i) : this.out(i,leaf.j,[leaf])
}})

function isTag(a0) {
  return Array.isArray(a0) && Array.isArray(a0.raw)
}
function t(a0, ...as) {
	let	t=a0[0], i=0
	while(i<a0.length-1) t += as[i]+a0[++i]
	return t
}
