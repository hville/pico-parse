function trim(tree) {
	if (tree.cuts) {
		const cuts = []
		for (const c of tree.cuts) {
			if (c.id) cuts.push(trim(c))
			else if (c.cuts && trim(c).cuts) cuts.push(...c.cuts)
		}
		if (!cuts.length) delete tree.cuts
		else tree.cuts = cuts
	}
	return tree
}
class R {
	constructor(peek, rule, id) {
		this.peek = peek
		this.rs = rule
		if (id) this.id = id
	}
	static id = ''
	scan(t) {
		const res = trim(this.peek(t,0))
		if (res.j !== t.length) res.j = -1
		else if (!res.id && res.cuts?.length === 1 && res.cuts[0].j === res.j) return res.cuts[0]
		return res
	}
	tree(i,j,cuts,id=this.id) {
		return cuts?.length ? id ? {i,j,id,cuts} : {i,j,cuts} : id ? {i,j,id} : {i,j}
	}
}
function toRule(r) {
	return r instanceof R ? r
		: r.source ? new R(regP, r.sticky ? r : RegExp(r.source, 'y'+r.flags))
		: new R(txtP, r)
}

/* terminal tokens */
function regP(t,i=0) {
	const r = this.rs
	r.lastIndex = i
	// check if reset from t.length => 0 occured
	let j = !r.test(t) ? -1 : r.lastIndex !== 0 ? r.lastIndex : i !== 0 ? t.length : r.exec(t)[0].length
	return this.tree(i, j)
}
function txtP(t,i=0) {
	const r = this.rs
	return this.tree(i, t.startsWith(r,i) ? i+r.length : -1)
}

/* rules of many : seq any */
function ruleOfN(...rs) {
	if (isTag(rs[0])) return ruleOfN.bind({peek: this.peek, id: t(...rs)})
	return Object.assign(
		this instanceof R ? this : new R(this.peek, this.rs, this.id),
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
		if (j >= 0) return this.id ? this.tree(i,j,leaf) : leaf
	}
	return this.tree(i,-1)
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
	return this.tree(i,j,tree)
}})

/* rules of one : and few not opt run */
function ruleOf1(...rs) {
	if (isTag(rs[0])) return ruleOf1.bind({peek: this.peek, id: t(...rs)})
	return Object.assign(
		this instanceof R ? this : new R(this.peek, this.rs, this.id),
		rs.length === 0 ? {rs, set: ruleOf1}
		: rs.length === 1 ? {rs: toRule(rs[0])}
		: {rs: seq(...rs)}
	)
}

/* &(e0 ... en) */
export const and = ruleOf1.bind({peek: function(t,i=0) {
	const j = this.rs.peek(t,i).j
	return j<0 ? this.tree(i,j) : this.tree(i,i)
}})

/* !(e0 ... en) */
export const not = ruleOf1.bind({peek: function(t,i=0) {
	return i>t.length ? this.tree(i,-1)
		: this.rs.peek(t,i).j<0 ? this.tree(i,i) : this.tree(i,-1)
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
	return tree.length > 0 ? this.tree(i,leaf.i,tree) : this.tree(i,-1)
}})

/* (e0 ... en)* */
export const run = ruleOf1.bind({peek: function(t,i=0) {
	if (i>t.length) return this.tree(i,-1)
	const tree = [],
				r = this.rs
	let j = i,
			leaf = r.peek(t,j)
	while(leaf.j>j) {
		tree.push(leaf)
		j = leaf.j
		leaf = r.peek(t,j)
	}
	return this.tree(i,leaf.i,tree)
}})

/* (e0 ... en)? */
export const opt = ruleOf1.bind({peek: function(t,i=0) {
	if (i>t.length) return this.tree(i,-1)
	let leaf = this.rs.peek(t,i)
	return leaf.j <0 ? this.tree(i,i) : this.tree(i,leaf.j,[leaf])
}})

function isTag(a0) {
  return Array.isArray(a0) && Array.isArray(a0.raw)
}
function t(a0, ...as) {
	let	t=a0[0], i=0
	while(i<a0.length-1) t += as[i]+a0[++i]
	return t
}
