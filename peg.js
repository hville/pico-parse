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
		if (!map[id]) map[id] = fs.seq()
		Object.assign(map[id], buildRule.call(ctx,expT) )
	}
	return map[Object.keys(map)[0]]
}
function buildRule(tree) {
	const {i,j,id} = tree
	if (id === 'kin') {
		const rule = buildRule.call(this, tree[1])
		rule.id = this.peg.slice(tree[0].i, tree[0].j)
		return rule
	}
	if (id === 'get') {
		const exp = buildRule.call(this, tree[0])
		return fs.seq(fs.run(fs.not(exp), /[^]/), exp)
	}
	if (id === 'dot') {
		return fs.seq(/[^]/)
	}
	if (tree.length) {
		return fs[id](...tree.map(buildRule,this))
	}
	const tok = this.peg.slice(i,j)
	return id==='txt' ? fs.seq(tok)
		: id==='reg' ? fs.seq(RegExp(tok, 'uy'))
		: /* id==='idv' ? */ this.map[tok] || (this.map[tok] = fs.seq())
}
