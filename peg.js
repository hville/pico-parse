import Rules from './parsers.js'
import PEG from './pegparser.js'

export default function(source) {
	const R = new Rules,
				peg = Array.isArray(source) && Array.isArray(source.raw) ? String.raw.apply(String, arguments) : source,
				tree = PEG.scan(peg)
	if (tree.id?.[0]==='X') return null
	const ctx = {R, peg}
	for (const def of tree) {
		const id = def.id === 'def' ? peg.slice(def[0].i, def[0].j) : '',
					expT = id ? def[def.length-1] : def
		R[id] = buildRule.call(ctx,expT)
	}
	console.log(Object.keys(R))
	const head = R[Object.keys(R)[0]] // First declared Id is the output rule
	return head.scan.bind(head)
}
function buildRule(tree) { //this = {R, peg}
	const {i,j,id} = tree,
				{R, peg} = this
	switch (id) {
		case 'kin':
			const idR = peg.slice(tree[0].i, tree[0].j)
			return ( this.R[idR] = buildRule.call(this, tree[1]) )
		case 'dot': return R(/[^]/)
		case 'exp': return R(...tree.map(buildRule,this))
		case 'txt': return R(peg.slice(i+1,j-1))
		case 'chr': return R(RegExp(peg.slice(i,j), 'uy'))
		case 'id' : return R[peg.slice(i,j)]
		case 'reg' : //TODO flags
			console.log('REG', tree)
			return R(RegExp(peg.slice(i+1,j-1), 'uy'))
		default:
			if (id.length > 1) throw Error(id)
			return R([id])(...tree.map(buildRule,this))
	}
}
