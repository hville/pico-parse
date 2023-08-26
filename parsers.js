const all = ruleOfN(ALL) /* DEFAULT: sequence e0 e1 ... en */
const parsers = {
	' ': all,
	'|': ruleOfN(ANY), /* any e0 / e1 / ... / en */
	'&': ruleOf1(AND), /* &(e0 ... en) */
	'!': ruleOf1(NOT), /* !(e0 ... en) */
	'+': ruleOf1(FEW), /* (e0 ... en)+ */
	'*': ruleOf1(RUN), /* (e0 ... en)* */
	'?': ruleOf1(OPT), /* (e0 ... en)? */
	'@': ruleOf1(GET), /* (!e .)* e */
}
export default function define(a) {
	return Array.isArray(a) ? parsers[a[0]] : parsers[' '].apply(this, arguments)
}
export class Grammar {
	constructor() {
		return new Proxy({}, {
			get(tgt, key) { // initiate rules not already defined
				return tgt[key] ?? tgt[(tgt[key] = new R).id = key]
			},
			set(tgt, key, val) {
				const rule = toRule(val)
				rule.id = key // automatic id assignment
				if (tgt[key]) Object.assign(tgt[key], rule) // keep existing reference
				else tgt[key] = rule
				return true
			}
		})
	}
}

// base class for all parser rules
class R {
	constructor(peek, rules=[]) {
		/* 	memo(t, i, m=new WeakMap) {
		let history = m.get(this)
		if (!history) m.set(this, history={} )
		return history[i] !== undefined ? history[i] : ( history[i] = this.peek(t, i) )
		}
		TODO
		x = R()
		x.set('a', /b/)
		x.add('a', /b/)
		x.('a', /b/)

		*/
		this.peek = peek
		this.rs = rules
		this.id = ''
	}
	reset(a) {
		return Array.isArray(a)
			? (...rs) => Object.assign(this, parsers[a[0]](...rs) )
			: Object.assign(this, parsers[' '].apply(this, arguments) )
	}
	scan(t) {
		const res = this.peek(t,0)
		if (res === null || res.j !== t.length) return null
		trim(res)
		return (!res.id && res.length===1) ? res[0] : res
	}
	tree(i,j,itms=[],id=this.id) {
		if (id) itms.id = id
		itms.i = i
		itms.j = j
		return itms
	}
}
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
function toRule(r) {
	return r instanceof R ? r
		: r.source ? new R(REG, [r.sticky ? r : RegExp(r.source, 'y'+r.flags)])
		: new R(TXT, [r])
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
function ANY(t,i=0) {
	for (const r of this.rs) {
		const leaf = r.peek(t,i)
		if (leaf !== null) return this.id ? this.tree(i,leaf.j,leaf) : leaf
	}
	return null
}
function ALL(t,i=0) {
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
}
function AND(t,i=0) {
	if (this.rs[0].peek(t,i) === null) return null
	return this.tree(i,i)
}
function NOT(t,i=0) {
	return (i>t.length || this.rs[0].peek(t,i)!==null) ? null :  this.tree(i,i)
}
function GET(t,i=0) {
	let k = i
	while(k<t.length) {
		const leaf = this.rs[0].peek(t,k++)
		if (leaf !== null) return this.tree(i, leaf.j, leaf)
	}
	return null
}
function FEW(t,i=0) {
	const tree = [],
				r = this.rs[0]
	let leaf = {j:i}
	while(leaf = r.peek(t, leaf.j)) tree.push(leaf)
	return tree.length > 0 ? this.tree(i,tree[tree.length-1].j,tree) : null
}
function RUN(t,i=0) {
	if (i>t.length) return null
	const tree = [],
				r = this.rs[0]
	let leaf = {j:i}
	while(leaf = r.peek(t,leaf.j)) tree.push(leaf)
	return this.tree(i, tree.length ? tree[tree.length-1].j : i,tree)
}
function OPT(t,i=0) {
	if (i>t.length) return null
	let leaf = this.rs[0].peek(t,i)
	return leaf === null ? this.tree(i,i) : this.tree(i,leaf.j,[leaf])
}

/* helpers */
function ruleOfN(FCN) {
	return (...rs) => new R(FCN, rs.map( toRule ) )
}
function ruleOf1(FCN) {
	return (...rs) => new R(FCN, [ rs.length > 1 ? all(...rs) : toRule(rs[0]) ] )
}
