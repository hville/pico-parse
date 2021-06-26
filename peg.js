import * as fs from './parsers.js'
import PEG from './grammar.js'

export default function(peg) {
	const [,,kin,...rules] = PEG.scan(peg)
	if (kin[0]==='X') return null
	const map = {},
				ctx = {map, peg}
	for (const def of rules) {
		const id = peg.slice(def[3][0], def[3][1])
		map[id] = fs.seq`${id}`()
		map[id].set( buildRule.call(ctx,def[4]) )
	}
	return map[Object.keys(map)[0]]
}
function buildRule([i,j,f,...a]) {
	if (a.length) return fs[f]( ...a.map(buildRule,this) )

	const tok = this.peg.slice(i,j)
	return f==='txt' ? fs.seq(tok)
		: f==='reg' ? fs.seq(RegExp(tok, 'uy'))
		: /* id */ this.map[tok] || (this.map[tok] = fs.seq`${tok}`())
}
