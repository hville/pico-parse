const resolve = r => r.rs ? r : tok(r)

const proto = {
	id: '',
	scan(t) {
		const res = this.peek(t,0)
		if (res[1] !== t.length) res[1] = -1
		else if (!res[2] && res.length === 4) return res[3]
		return res
	},
	/* tree: [i,j,n,..tree] || [i,j,n] || [i,-1] */
	out(i,j,subs) {
		//flatten
		if (subs?.length) subs = subs.reduce( (f,t) => {
			if (t[2]) f.push(t)
			else if (t.length > 3) for(let i=3; i<t.length; ++i) f.push(t[i])
			return f
		}, [])
		return subs?.length ? [i,j,this.id||'', ...subs] : this.id ? [i,j,this.id] : [i,j]
	}
}

/* terminal tokens */
export function tok(re) {
	if (Array.isArray(re)) return tok.bind({id: String.raw(...arguments)})
	const term = Object.create(proto)
	term.peek = re.source ? regP : txtP
	term.rs = !re.source ? re : !re.sticky ? RegExp(re.source, 'y'+re.flags) : re
	if (this?.id) term.id = this.id
	return term
}
function regP(t,i=0) {
	const r = this.rs
	r.lastIndex = i
	let j = r.test(t) ? r.lastIndex : -1
	if (j===0) {
		//TODO ambiguity since lastIndex resets... j=0||t.length?
		if (i===0) {
			r.lastIndex = i
			j = r.exec(t)[0].length
		}
		else j = t.length
	}
	return this.out(i, j)
}
function txtP(t,i=0) {
	const r = this.rs
	return this.out(i, t.startsWith(r,i) ? i+r.length : -1)
}

/* rules of many : seq any */
function ruleOfN(...rs) {
	if (Array.isArray(rs[0])) return ruleOfN.bind({peek:this.peek, id:String.raw(...rs)})
	if (!this.id && rs.length === 1) return resolve(rs[0])
	return Object.assign(Object.create(proto), this, {rs: rs.map( resolve )})
}

/* any e0 / e1 / ... / en */
export const any = ruleOfN.bind({peek: function(t,i=0) {
	for (const r of this.rs) {
		const leaf = r.peek(t,i),
					j = leaf[1]
		if (j >= 0) return this.id ? this.out(i,j,leaf) : leaf  //TODO already flattened in out?
	}
	return this.out(i,-1)
}})

/* sequence e0 e1 ... en */
export const seq = ruleOfN.bind({peek: function(t,i=0) {
	const tree = []
	let j = i
	if (j<t.length) for (const r of this.rs) {
		const leaf = r.peek(t,j)
		j = leaf[1]
		if (j < 0) break
		else if (leaf[2]) tree.push(leaf)
		else if (leaf.length > 3) for(let i=3; i<leaf.length; ++i) tree.push(leaf[i]) //TODO already flattened in out?
	} else j = -1
	return this.out(i,j,tree)
}})

/* rules of one : and few not opt run */
function ruleOf1(...rs) {
	if (Array.isArray(rs[0])) return ruleOf1.bind({peek:this.peek, id:String.raw(...rs)})
	const r = Object.assign(Object.create(proto), this)
	r.rs = rs.length > 1 ? seq(...rs) : resolve(rs[0])
	return r
}

/* &(e0 ... en) */
export const and = ruleOf1.bind({peek: function(t,i=0) {
	const j = this.rs.peek(t,i)[1]
	return j<0 ? this.out(i,j) : this.out(i,i)
}})

/* !(e0 ... en) */
export const not = ruleOf1.bind({peek: function(t,i=0) {
	return i>t.length ? this.out(i,-1)
		: this.rs.peek(t,i)[1]<0 ? this.out(i,i) : this.out(i,-1)
}})

/* (e0 ... en)+ */
export const few = ruleOf1.bind({peek: function(t,i=0) {
	const tree = [],
				r = this.rs
	let j = i,
			leaf = r.peek(t,j)
	while(leaf[1]>j) {
		tree.push(leaf)
		j = leaf[1]
		leaf = r.peek(t,j)
	}
	return tree.length > 0 ? this.out(i,leaf[0],tree) : this.out(i,-1)
}})

/* (e0 ... en)* */
export const run = ruleOf1.bind({peek: function(t,i=0) {
	if (i>t.length) return this.out(i,-1)
	const tree = [],
				r = this.rs
	let j = i,
			leaf = r.peek(t,j)
	while(leaf[1]>j) {
		tree.push(leaf)
		j = leaf[1]
		leaf = r.peek(t,j)
	}
	return this.out(i,leaf[0],tree)
}})

/* (e0 ... en)? */
export const opt = ruleOf1.bind({peek: function(t,i=0) {
	if (i>t.length) return this.out(i,-1)
	let leaf = this.rs.peek(t,i)
	return leaf[1] <0 ? this.out(i,i) : this.out(i,leaf[1],[leaf])
}})
