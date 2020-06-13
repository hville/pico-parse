import {seq, any, run, few, opt, tok} from 'pico-parse'
import {nb, id, nl0, nl1} from 'pico-parse/rules/js.js'

//values
const nmb = tok(nb).id('9'),
			exp = seq().id('exp'),
			ls0 = opt(exp, run(nl0, ',', nl0, exp)),
			ls2 = seq(exp, few(nl0, ',', nl0, exp)).id('ls2'),
			gen = seq(/[NLWD]/, '(', nl0, ls2.spy(forceCst), nl0, ')').id('gen'),
			fcn = seq(seq('Math.', tok(id).id('f')), '(', nl0, ls0, nl0, ')').id('fcn'),
			val = seq(opt(/[+-]/, nl0), any(nmb, gen, fcn, seq('(', nl0, exp, nl0, ')'), tok(id).id('x')))
exp.add(val, run(nl0, /\*{1,2}|\+(?!\+)|-(?!-)|[/%]/, nl0, val))

//assignment
const y = tok(id).id('y'),
			eql = seq(y, nl0, '=', nl0, exp).id('eql').spy(validate), //hoist generator
			def = seq(y, nl0, ':', nl0, exp).id('def').spy(validate) //hoist generator

const constants = new Set,
			lines = [[],[],[]]
let idx = 0

const __0 = any(nl0, run(';', nl0)),
			__1 = any(nl1, few(nl0, ';', nl0)),
			ln1 = any(eql, def),
			all = seq(__0, ln1, run(__1, ln1), __0),
			oldscan = all.scan

all.scan = function(input) {
	constants.clear()
	idx = lines[0].length = lines[1].length = lines[2].length = 0
	const tree = oldscan.call(this, input)
	tree.code = `const ${ lines[0].join(',') };return function(){const ${ lines[1].join(',') };return{${ lines[2].join(',') }}}`
	tree.toFunction = function() { return new Function('{N,L,W,D}', tree.code) }
	return tree
}
export default all

function isCst(tree) {
	switch (tree.id) {
		case '9': return true
		case 'x': return constants.has(tree.toString())
		case 'fcn': return tree.toString() === 'random' ? false : tree.cuts.every(isCst)
		case 'gen': return false
		default: return tree.cuts.every(isCst)
	}
}
function forceCst(tree) {
	const items = tree.cuts
	if (!isCst(items[0])) return tree.err = true
	for (var i=1; i<items.length; i+=2) if (!isCst(items[i])) return tree.err = true
}
function validate(tree) {
	if (tree.err) return
	var name = tree.item(0).toString()
	if (isCst(tree.item(1))) {
		constants.add(name)
		lines[0].push(name+'='+tree.item(1).toString())
		if (tree.id === 'def') lines[2].push(name)
	} else {
		const code = tree.item(1).toString(hoistRnd)
		lines[1].push(name+'='+code)
		if (tree.id === 'def') lines[2].push(name)
	}
}
function hoistRnd(tree) {
	if (tree.id === 'gen') {
		const proxy = `_${idx++}`
		lines[0].push(proxy + '=' + tree)
		return proxy
	} else return tree.toString(hoistRnd)
}
