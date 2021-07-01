import * as fs from './parsers.js'
import PEG from './grammar.js'

export default function(peg) {
	const tree = PEG.scan(peg),
				{id,cuts} = tree
	if (id?.[0]==='X') return null
	const map = {},
				ctx = {map, peg}
	if (cuts) for (const def of cuts) {
		const [idT, expT] = def.cuts,
					id = peg.slice(idT.i, idT.j)
		map[id] = fs.seq`${id}`()
		map[id].set( buildRule.call(ctx,expT) )
	}
	return map[Object.keys(map)[0]]
}
function buildRule({i,j,id,cuts}) {
	if (cuts?.length) return fs[id]( cuts.map(buildRule,this) )

	const tok = this.peg.slice(i,j)
	return id==='txt' ? fs.seq(tok)
		: id==='reg' ? fs.seq(RegExp(tok, 'uy'))
		: /* id */ this.map[tok] || (this.map[tok] = fs.seq`${tok}`())
}
