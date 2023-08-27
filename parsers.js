const P = {}

// base class for all parser rules
class R {
	constructor(peek, rules=[]) {
		this.peek = peek
		this.act = null
		const rs = rules.filter( r => r.call ? !(this.act = r) : true )
		this.rs = (peek !== P['|'] && peek !== P[' '] && rs.length > 1) ? [new R(P[' '], rs)]
		: (peek === TXT || peek === REG) ? rs
		: rs.map( r => r instanceof R ? r
			: r.source ? new R(REG, [r.sticky ? r : RegExp(r.source, 'y'+r.flags)])
			: new R(TXT, [r])
		)
	}
	scan(t) {
		let res = this.peek(t,0)
		if (res === null || res.j !== t.length) return null
		trim(res)
		if ((!res.act && res.length===1)) res = res[0] //TODO in trim?
		return res
	}
	tree(i, j, itms=[]) {
		if (this.act) itms.act = this.act
		itms.i = i
		itms.j = j
		return itms
	}
	reset(...rs) {
		return Array.isArray(rs[0]) ? (...as) => this ? Object.assign(this, new R(P[rs[0][0]], as)) : new R(P[rs[0][0]], as)
		: this ? Object.assign(this, new R(P[' '], rs))
		: new R(P[' '], rs)
	}
}

export default R.prototype.reset

function trim(tree) {
	const kids = []
	while (tree.length) {
		const c = tree.shift()
		if (c.act) kids.push(trim(c))
		else if (c.length && trim(c).length) kids.push(...c)
	}
	tree.push(...kids)
	return tree
}

/* terminal tokens */
function REG(t,i=0) {
	const r = this.rs[0]
	r.lastIndex = i
	return !r.test(t) ? null : this.tree(i,
		// check if reset t.length => 0 occured
		r.lastIndex !== 0 ? r.lastIndex : i !== 0 ? t.length : r.exec(t)[0].length
	)
}
function TXT(t,i=0) {
	const r = this.rs[0]
	return t.startsWith(r,i) ? this.tree(i, i+r.length) : null
}

/* parsers */
P['|'] = function ANY(t,i=0) { /* any e0 / e1 / ... / en */
	for (const r of this.rs) {
		const leaf = r.peek(t,i)
		if (leaf !== null) return this.act ? this.tree(i,leaf.j,leaf) : leaf
	}
	return null
}
P[' '] = function ALL(t,i=0) { /* DEFAULT: sequence e0 e1 ... en */
	const tree = []
	let j = i
	if (j<t.length) for (const r of this.rs) {
		const leaf = r.peek(t,j)
		if (leaf === null) return leaf
		j = leaf.j
		if (leaf.act) tree.push(leaf)
		else for(const cut of leaf) tree.push(cut)
	} else return null
	return this.tree(i,j,tree)
}
P['&'] = function AND(t,i=0) { /* &(e0 ... en) */
	if (this.rs[0].peek(t,i) === null) return null
	return this.tree(i,i)
}
P['!'] = function NOT(t,i=0) { /* !(e0 ... en) */
	return (i>t.length || this.rs[0].peek(t,i)!==null) ? null :  this.tree(i,i)
}
P['@'] = function GET(t,i=0) { /* (!e .)* e */
	let k = i
	while(k<t.length) {
		const leaf = this.rs[0].peek(t,k++)
		if (leaf !== null) return this.tree(i, leaf.j, leaf)
	}
	return null
}
P['+'] = function FEW(t,i=0) { /* (e0 ... en)+ */
	const tree = [],
				r = this.rs[0]
	let leaf = {j:i}
	while(leaf = r.peek(t, leaf.j)) tree.push(leaf)
	return tree.length > 0 ? this.tree(i,tree[tree.length-1].j,tree) : null
}
P['*'] = function RUN(t,i=0) { /* (e0 ... en)* */
	if (i>t.length) return null
	const tree = [],
				r = this.rs[0]
	let leaf = {j:i}
	while(leaf = r.peek(t,leaf.j)) tree.push(leaf)
	return this.tree(i, tree.length ? tree[tree.length-1].j : i,tree)
}
P['?'] = function OPT(t,i=0) { /* (e0 ... en)? */
	if (i>t.length) return null
	let leaf = this.rs[0].peek(t,i)
	return leaf === null ? this.tree(i,i) : this.tree(i,leaf.j,[leaf])
}
