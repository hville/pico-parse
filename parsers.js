class R {
	constructor(peek, rules=[]) {
		this.peek = peek
		this.cb = undefined
		const rs = rules.filter( r => r.apply ? !(this.cb = r) : true )
		this.rs = (peek !== P['|'] && peek !== P[' '] && rs.length > 1) ? [new R(P[' '], rs)]
		: (peek === TXT || peek === REG) ? rs
		: rs.map( r => r instanceof R ? r
			: r.source ? new R(REG, [r.sticky ? r : RegExp(r.source, 'y'+r.flags)])
			: new R(TXT, [r])
		)
	}
	scan(t) {
		let tree = this.peek(t,0)
		if (tree === null || tree.j !== t.length) return null
		prune(tree, t)
		return tree.cb ? tree.cb(tree, t) : tree
	}
	tree(i, j, itms=[]) {
		if (this.cb) itms.cb = this.cb
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

function prune(tree, t) {
	let len = 0
	for (let i=0; i<tree.length; ++i) {
		const kid = tree[i]
		if (kid.cb) {
			const res = kid.cb?.(prune(kid, t), t)
			if (res !== undefined) tree[len++] = res
		} else {
			tree.splice(i+1, 0, ...kid)
		}
	}
	tree.length = len
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
const P = {
'|': function(t,i=0) { /* any e0 / e1 / ... / en */
	for (const r of this.rs) {
		const leaf = r.peek(t,i)
		if (leaf !== null) return this.cb ? this.tree(i,leaf.j,leaf) : leaf
	}
	return null
},
' ': function(t,i=0) { /* DEFAULT: sequence e0 e1 ... en */
	const tree = []
	let j = i
	if (j<t.length) for (const r of this.rs) {
		const leaf = r.peek(t,j)
		if (leaf === null) return leaf
		j = leaf.j
		if (leaf.cb) tree.push(leaf)
		else for(const cut of leaf) tree.push(cut)
	} else return null
	return this.tree(i,j,tree)
},
'&': function(t,i=0) { /* &(e0 ... en) */
	if (this.rs[0].peek(t,i) === null) return null
	return this.tree(i,i)
},
'!': function(t,i=0) { /* !(e0 ... en) */
	return (i>t.length || this.rs[0].peek(t,i)!==null) ? null :  this.tree(i,i)
},
'@': function(t,i=0) { /* (!e .)* e */
	let k = i
	while(k<t.length) {
		const leaf = this.rs[0].peek(t,k++)
		if (leaf !== null) return this.tree(i, leaf.j, leaf)
	}
	return null
},
'+': function(t,i=0) { /* (e0 ... en)+ */
	const tree = [],
				r = this.rs[0]
	let leaf = {j:i}
	while(leaf = r.peek(t, leaf.j)) tree.push(leaf)
	return tree.length > 0 ? this.tree(i,tree[tree.length-1].j,tree) : null
},
'*': function(t,i=0) { /* (e0 ... en)* */
	if (i>t.length) return null
	const tree = [],
				r = this.rs[0]
	let leaf = {j:i}
	while(leaf = r.peek(t,leaf.j)) tree.push(leaf)
	return this.tree(i, tree.length ? tree[tree.length-1].j : i,tree)
},
'?': function(t,i=0) { /* (e0 ... en)? */
	if (i>t.length) return null
	let leaf = this.rs[0].peek(t,i)
	return leaf === null ? this.tree(i,i) : this.tree(i,leaf.j,[leaf])
}}
