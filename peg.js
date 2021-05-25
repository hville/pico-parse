import * as fs from './parsers.js'
import PEG from './grammar.js'

export default function(peg) {
	const [,,kin,...prs] = PEG.scan(peg)
	if (kin[0]==='X') return 'TODO FAILED'
	const map = {},
				ctx = {map, peg}
	for (const def of prs) {
		const id = peg.slice.apply(peg, def[3]),
					nt = map[id] || (map[id] = fs.seq.call(id)),
					pr = bld.call(ctx,def[4])
		if (pr.id) nt.rs.push(pr)
		else Object.assign(nt, pr)
	}
	return map[Object.keys(map)[0]]
}
function bld([i,j,f,...a]) {
	if (a.length) return fs[f]( ...a.map(bld,this) )

	const tok = this.peg.slice(i,j)
	return f==='txt' ? fs.tok(tok)
		: f==='reg' ? fs.tok(RegExp(tok, 'uy'))
		: /* id */ this.map[tok] || (this.map[tok] = fs.seq.call(tok))
}
