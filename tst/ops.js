import test from 'assert-op'
import a from 'assert-op/assert.js'
import { and, any, few, not, opt, run, seq } from '../parsers.js'

function eq(val, res) {
	if (val === null || res === null) a`===`(val, res)
	else {
		a`===`(val.i, res.i)
		a`===`(val.j, res.j)
	}
}

test('run', a => {
	eq(run('ab').peek('x', 0), {i:0,j:0})
	eq(run('ab').scan('ab'), {i:0,j:2})
	eq(run('ab').scan('ababab'), {i:0,j:6})
	eq(run('a', 'b').scan('ababab'), {i:0,j:6})
})

test('few', a => {
	//pass
	eq(few('ab').scan('ababab'), {i:0,j:6})
	eq(few('a', 'b').scan('ababab'), {i:0,j:6})
	// few fail
	eq(few('ab').peek('x', 0), null)
})

test('opt', a => {
	// opt pass
	eq(opt('ab').peek('x', 0), {i:0,j:0})
	eq(opt('a', 'b').peek('x', 0), {i:0,j:0})
	eq(opt('ab').scan('ab'), {i:0,j:2})
	eq(opt('a', 'b').scan('ab'), {i:0,j:2})
})

test('any', a => {
	// any pass
	eq(any('x','ab','abab').peek('abababX', 0), {i:0,j:2})
})

test('and', a => {
	eq(and('ab').peek('abc', 0), {i:0,j:0})
	eq(and('ba').peek('abc', 0), null)
	eq(seq('a', and('c')).peek('abc', 0), null)
	eq(seq('a', and('b')).peek('abc', 0), {i:0,j:1})
})

test('not', a => {
	eq(not('ab').peek('abc', 0), null)
	eq(not('ba').peek('abc', 0), {i:0,j:0})
	eq(seq('a', not('c')).peek('abc', 0), {i:0,j:1})
	eq(seq('a', not('b')).peek('abc', 0), null)
})

test('consistent reduction', a => {
	eq(seq(any('a')), any('a'))
	eq(seq`n`(any('a')), any`n`('a'))
	eq(seq(any`n`('a')), any`n`('a'))

	eq(any(seq('a')), seq('a'))
	eq(any`n`(seq('a')), seq`n`('a'))
	eq(any(seq`n`('a')), seq`n`('a'))
})

/*
test('tie', a => {
	//anonymous
	eq(tie('.','a').peek('a.b', 0), {i:0,j:1})
	eq(tie('.','a').peek('a.a.b', 0), [0,3])
	eq(tie('.','a').peek('a.a.a.b', 0), [0,5])
	//any
	eq(tie('.','a','b').peek('a.b', 0), [0,3])
	eq(tie('.','a','b').peek('a.a.b', 0), [0,5])
	eq(tie('.','a','b').peek('a.a.a.b', 0), [0,7])
	//named
	eq(tie`n`('.','a').peek('a.b', 0), [0,1,'n'])
	eq(tie`n`('.','a').peek('a.a.b', 0), [0,3,'n'])
	eq(tie`n`('.','a').peek('a.a.a.b', 0), [0,5,'n'])
})
*/
