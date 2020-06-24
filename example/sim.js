import {seq, any, run, few, opt, tok, not, max} from '../index.js'
import {nb, id, nl0, nl1, ci, cm} from '../rules/js.js'

function name(obj) { //TODO nice?!
	Object.keys(obj).forEach(k => obj[k].id(k))
}
//TODO add comments to lines
//constants
const nmbr = tok(nb).id('9'),
			cexp = seq().id('exp'),
			cls0 = opt(cexp, run(nl0, ',', nl0, cexp)),
			cfcn = seq(seq(/Math.(?!random)/, tok(id)), '(', nl0, cls0, nl0, ')').id('fcn'),
			cval = seq(opt(/[+-]/, nl0), any(nmbr, cfcn, seq('(', nl0, cexp, nl0, ')'), seq(id, not(nl0, '(')).id('cst')))
cexp.add(cval, run(nl0, /\*{1,2}|\+(?!\+)|-(?!-)|[/%]/, nl0, cval))

name({})

//random objects
const conf = seq(cexp, nl0, ',', nl0, cexp),
			corl = seq(id, nl0, ',', nl0, cexp),
			rvar = seq(/[NLWD]/, '(', nl0, conf, run(nl0, ',', nl0, corl), opt(nl0, ',', nl0, id), nl0, ')').id('gen')
//values
const vexp = seq().id('exp'),
			vls0 = opt(vexp, run(nl0, ',', nl0, vexp)),
			vfcn = seq(seq('Math.', tok(id)), '(', nl0, vls0, nl0, ')').id('fcn'),
			vval = seq(opt(/[+-]/, nl0), any(cval, rvar, vfcn, seq('(', nl0, vexp, nl0, ')'), seq(id, not('(')).id('val')))
vexp.add(vval, run(nl0, /\*{1,2}|\+(?!\+)|-(?!-)|[/%]/, nl0, vval))

//assignment
const y = tok(id).id('y'),
			ycst = seq(y, nl0, '=', nl0, cexp).id('ycst'),
			yrnd = seq(y, nl0, '=', nl0, rvar).id('yrnd'),
			yvar = seq(y, nl0, '=', nl0, vexp).id('yvar')

//exports
const ecst = seq(y, nl0, ':', nl0, cexp).id('ecst'),
			ernd = seq(y, nl0, ':', nl0, rvar).id('ernd'),
			evar = seq(y, nl0, ':', nl0, vexp).id('evar')

//code
const __0 = seq(run(nl0, ';'), nl0),
			__1 = any(few(nl0, ';', nl0), nl1),
			ln1 = max(ycst, ecst, yrnd, ernd, yvar, evar), //TODO
			cmt = opt(__0, any(ci, cm)),
			all = seq(__0, ln1, cmt, run(__1, ln1, cmt), __0),
			oldscan = all.scan

const constants = new Set,
			lines = [[],[],[]]
let idx = 0

function toConst(defs) {
	return !defs.length ? '' : `const ${defs.join(',') };`
}
all.scan = function(input) {
	constants.clear()
	idx = lines[0].length = lines[1].length = lines[2].length = 0
	const tree = oldscan.call(this, input)
	tree.each(validate)
	tree.code = `${ toConst(lines[0]) };return function(){${ toConst(lines[1]) }return{${ lines[2].join(',') }}}`
	tree.toFunction = function() { return new Function('{N,L,W,D}', tree.code) }
	return tree
}
export default all
function isCst(tree) {
	switch (tree.id) {
		case '9': return true
		case 'gen': return false
		case 'cst': case 'val': return constants.has(tree.toString())
		default:
			for (var i=0; i<tree.cuts.length; ++i) if (!isCst(tree.cuts[i])) return false
			return true
	}
}
function validate(tree) { //cst,rnd,var, y, e
	if (tree.err) return
	var name = tree.item(0).toString()
	switch (tree.id) {
		case 'ycst': case 'ecst':
			if (isCst(tree)) {
				constants.add(name)
				lines[0].push(name + '=' + tree.item(1).toString())
			} else {
				lines[1].push(name + '=' + tree.item(1).toString(hoistRnd))
			}
			break
		case 'yrnd': case 'ernd':
			lines[0].push(name + '=' + tree.item(1).toString())
			break
		case 'yvar': case 'evar':
			lines[1].push(name + '=' + tree.item(1).toString(hoistRnd))
			break
	}
	if (tree.id[0] === 'e') {
		lines[2].push(name)
	}
}
function hoistRnd(tree) {
	if (tree.id === 'gen') {
		const proxy = `_${idx++}`
		lines[0].push(proxy + '=' + tree)
		return proxy
	} else return tree.toString(hoistRnd)
}
