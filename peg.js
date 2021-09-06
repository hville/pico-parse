import * as fs from './parsers.js'
import PEG from './grammar.js'


export default function(source) {
	const peg = Array.isArray(source) && Array.isArray(source.raw) ? String.raw.apply(String, arguments) : source,
				tree = PEG.scan(peg)
	if (tree.id?.[0]==='X') return null
	const map = {},
				ctx = {map, peg}
	for (const def of tree) {
		const id = def.id === 'def' ? peg.slice(def[0].i, def[0].j) : '',
					expT = id ? def[def.length-1] : def
		Object.assign(map[id] = fs.seq(), buildRule.call(ctx,expT) )
	}
	return map[Object.keys(map)[0]]
}
function buildRule(tree) {
	const {i,j,id} = tree
	if (id === 'kin') {
		const t0 = tree.shift(),
					rule = buildRule.call(this, tree)
		rule.id = peg.slice(t0.i, t0.j)
		return rule
	}
	if (tree.length) {
		console.log('******LEN*******', id, this.peg.slice(i,j))
		return fs[id](...tree.map(buildRule,this))
	}
	const tok = this.peg.slice(i,j)
	return id==='txt' ? fs.seq(tok)
		: id==='reg' ? fs.seq(RegExp(tok, 'uy'))
		: id==='idv' ? this.map[tok] || (this.map[tok] = fs.seq())
		: console.log('*******TODO*******', id) //TODO
}
