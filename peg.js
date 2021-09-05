import * as fs from './parsers.js'
import PEG from './grammar.js'

export default function(source) {
	const peg = Array.isArray(source) && Array.isArray(source.raw) ? String.raw.apply(String, source) : source,
				tree = PEG.scan(peg)
	if (tree.id?.[0]==='X') return null
	const map = {},
				ctx = {map, peg}
	for (const def of tree) {
		const [idT, expT] = def,
					id = peg.slice(idT.i, idT.j)
		map[id] = fs.seq`${id}`()
		map[id].set( buildRule.call(ctx,expT) )
	}
	return map[Object.keys(map)[0]]
}
function buildRule(tree) {
	const {i,j,id} = tree
	if (tree.length) return fs[id]( tree.map(buildRule,this) )

	const tok = this.peg.slice(i,j)
	return id==='txt' ? fs.seq(tok)
		: id==='reg' ? fs.seq(RegExp(tok, 'uy'))
		: /* id */ this.map[tok] || (this.map[tok] = fs.seq`${tok}`())
}
