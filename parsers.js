function trim(tree) {
	const kids = []
	while (tree.length) {
		const c = tree.shift()
		if (c.id) kids.push(trim(c))
		else if (c.length && trim(c).length) kids.push(...c)
	}
	tree.push(...kids)
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
		const res = this.peek(t,0)
		if (res === null || res.j !== t.length) return null
		trim(res)
		if (!res.id && res.length === 1 && res[0].j === res.j) return res[0]
		return res
	}
	tree(i,j,itms=[],id=this.id) {
		if (id) itms.id = id
		itms.i = i
		itms.j = j
		return itms
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
	return !r.test(t) ? null
		// check if reset from t.length => 0 occured
		: this.tree(i, r.lastIndex !== 0 ? r.lastIndex : i !== 0 ? t.length : r.exec(t)[0].length)
}
function txtP(t,i=0) {
	const r = this.rs
	return t.startsWith(r,i) ? this.tree(i, i+r.length) : null
}

/* rules of many : seq any */
function ruleOfN(...rs) {
	if (isTag(rs[0])) return ruleOfN.bind({peek: this.peek, id: t(...rs)})
	return Object.assign(
		this instanceof R ? this : new R(this.peek, this.rs, this.id),
		rs.length === 0 ? {rs}
		: rs.length === 1 && !(this.id && rs[0].id) ? toRule(rs[0])
		: {rs: rs.map( toRule )}
	)
}

/* any e0 / e1 / ... / en */
export const any = ruleOfN.bind({peek: function(t,i=0) {
	for (const r of this.rs) {
		const leaf = r.peek(t,i)
		if (leaf !== null) return this.id ? this.tree(i,leaf.j,leaf) : leaf
	}
	return null
}})

/* sequence e0 e1 ... en */
export const seq = ruleOfN.bind({peek: function(t,i=0) {
	const tree = []
	let j = i
	if (j<t.length) for (const r of this.rs) {
		const leaf = r.peek(t,j)
		if (leaf === null) return leaf
		j = leaf.j
		if (leaf.id) tree.push(leaf)
		else for(const cut of leaf) tree.push(cut)
	} else return null
	return this.tree(i,j,tree)
}})

/* rules of one : and few not opt run */
function ruleOf1(...rs) {
	if (isTag(rs[0])) return ruleOf1.bind({peek: this.peek, id: t(...rs)})
	return Object.assign(
		this instanceof R ? this : new R(this.peek, this.rs, this.id),
		rs.length === 0 ? {rs}
		: rs.length === 1 ? {rs: toRule(rs[0])}
		: {rs: seq(...rs)}
	)
}

/* &(e0 ... en) */
export const and = ruleOf1.bind({peek: function(t,i=0) {
	if (this.rs.peek(t,i) === null) return null
	return this.tree(i,i)
}})

/* !(e0 ... en) */
export const not = ruleOf1.bind({peek: function(t,i=0) {
	return (i>t.length || this.rs.peek(t,i)!==null) ? null :  this.tree(i,i)
}})

/* (e0 ... en)+ */
export const few = ruleOf1.bind({peek: function(t,i=0) {
	const tree = [],
				r = this.rs
	let leaf = {j:i}
	while(leaf = r.peek(t, leaf.j)) tree.push(leaf)
	return tree.length > 0 ? this.tree(i,tree[tree.length-1].j,tree) : null
}})

/* (e0 ... en)* */
export const run = ruleOf1.bind({peek: function(t,i=0) {
	if (i>t.length) return null
	const tree = [],
				r = this.rs
	let leaf = {j:i}
	while(leaf = r.peek(t,leaf.j)) tree.push(leaf)
	return this.tree(i, tree.length ? tree[tree.length-1].j : i,tree)
}})

/* (e0 ... en)? */
export const opt = ruleOf1.bind({peek: function(t,i=0) {
	if (i>t.length) return null
	let leaf = this.rs.peek(t,i)
	return leaf === null ? this.tree(i,i) : this.tree(i,leaf.j,[leaf])
}})

function isTag(a0) {
  return Array.isArray(a0) && Array.isArray(a0.raw)
}
function t(a0, ...as) {
	let	t=a0[0], i=0
	while(i<a0.length-1) t += as[i]+a0[++i]
	return t
}
