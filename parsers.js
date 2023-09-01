class R {
	constructor(peek, rules=[]) {
		this.peek = peek
		this.id = ''
		this.set( ...rules ) //this.rs
	}
	set( ...rs ) {
		this.rs = (this.peek !== P['|'] && this.peek !== P[' '] && rs.length > 1) ? [new R(P[' '], rs)]
		: (this.peek === TXT || this.peek === REG) ? rs
		: rs.map( r => r instanceof R ? r : r.source ? new R(REG, [r.sticky ? r : RegExp(r.source, 'y'+r.flags)]) : new R(TXT, [r]) )
		return this
	}
	tree(i, j, itms=[]) {
		if (this.id) itms.id = this.id
		itms.i = i
		itms.j = j
		return itms
	}
	scan(text, actions) {
		let tree = this.peek(text, 0)
		if (tree?.j !== text.length) {
			if (tree === null) tree = this.tree(0,0)
			tree.error = `Parse failed at position ${tree.j}.`
			return tree
		}
		prune(tree, text, actions)
		const action = actions?.[tree.id]
		return !action ? tree : action.length < 2 ? action( tree ) : action( tree, t.slice(tree.i, tree.j) )
	}
}
export default new Proxy(
	(...args) => Array.isArray(args[0]) ? (...rs) => new R(P[args[0][0]], rs) : new R(P[' '], args),
	{ get: (f,id) => (...as) => { const r=f(...as); r.id=id; return r } }
)

function prune(tree, t, acts) {
	let len = 0
	for (let i=0; i<tree.length; ++i) {
		const kid = tree[i]
		if (kid.error && !tree.error) tree.error = kid.error
		if (kid.id) { // a branch with an action => ACT
			prune(kid, t, acts)
			const act = acts?.[kid.id],
						res = !act ? kid : act.length < 2 ? act( kid ) : act( kid, t.slice(kid.i, kid.j) )
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
		if (leaf !== null) return this.id ? this.tree(i,leaf.j,leaf) : leaf
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
		if (leaf.id) tree.push(leaf)
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
},
'.': function(t,i=0) { /* (s.e+) === (e (s e)*) */
	let k = i
	while(k<t.length) {
		const leaf = this.rs[0].peek(t,k++)
		if (leaf !== null) return this.tree(i, leaf.j, leaf)
	}
	return null
}}
/*
TODO
https://www.raincode.com/docs/PEGGrammar/UserGuide.html
X*,"," a comma-separated, possibly empty list of Xs
Y+,";;" a semicolon-separated non-empty list of Ys
Z{5},i:s a space-separated list of at least five Zs

https://peps.python.org/pep-0617/
s.e+ === (e (s e)*)   //Seperator not in parse tree
sep=atom '.' node=atom '+' {Gather(sep, node)}

https://www.inf.puc-rio.br/~roberto/lpeg/
sep = lpeg.S(",;") * space

$( e, $`*`(s, e) )
$`.`(s, e)
$( $`|`(a, b), $`*`(s, $`|`(a, b)) )
$`.`(s, $`|`(a, b))

*/
