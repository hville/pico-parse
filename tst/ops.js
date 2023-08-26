import test from 'assert-op'
import a from 'assert-op/assert.js'
import R from '../parsers.js'
import {Grammar} from '../parsers.js'

function eq(val, res) {
	if (val === null || res === null) a`===`(val, res)
	else {
		a`===`(val.i, res.i)
		a`===`(val.j, res.j)
	}
}

test('R`*`', a => {
	eq(R`*`('ab').peek('x', 0), {i:0,j:0})
	eq(R`*`('ab').scan('ab'), {i:0,j:2})
	eq(R`*`('ab').scan('ababab'), {i:0,j:6})
	eq(R`*`('a', 'b').scan('ababab'), {i:0,j:6})
})

test('R`+`', a => {
	//pass
	eq(R`+`('ab').scan('ababab'), {i:0,j:6})
	eq(R`+`('a', 'b').scan('ababab'), {i:0,j:6})
	// few fail
	eq(R`+`('ab').peek('x', 0), null)
})

test('R`?`', a => {
	// R`?` pass
	eq(R`?`('ab').peek('x', 0), {i:0,j:0})
	eq(R`?`('a', 'b').peek('x', 0), {i:0,j:0})
	eq(R`?`('ab').scan('ab'), {i:0,j:2})
	eq(R`?`('a', 'b').scan('ab'), {i:0,j:2})
})

test('R`|`', a => {
	// R`|` pass
	eq(R`|`('x','ab','abab').peek('abababX', 0), {i:0,j:2})
})

test('R`&`', a => {
	eq(R`&`('ab').peek('abc', 0), {i:0,j:0})
	eq(R`&`('ba').peek('abc', 0), null)
	eq(R('a', R`&`('c')).peek('abc', 0), null)
	eq(R('a', R`&`('b')).peek('abc', 0), {i:0,j:1})
})

test('R`!`', a => {
	eq(R`!`('ab').peek('abc', 0), null)
	eq(R`!`('ba').peek('abc', 0), {i:0,j:0})
	eq(R('a', R`!`('c')).peek('abc', 0), {i:0,j:1})
	eq(R('a', R`!`('b')).peek('abc', 0), null)
})

test('R`@`', a => {
	eq(R`@`('ba').peek('abc', 0), null)
	eq(R`@`('ab').peek('abc', 0), {i:0,j:2})
	eq(R`@`('bc').peek('abc', 0), {i:0,j:3})
})

test('reset', a => {
	const r = R()
	eq(r.reset('a').peek('abc', 0), {i:0,j:1})
	eq(r.reset`|`('c', 'b').peek('bcd', 0), {i:0,j:1})
	eq(r.reset(/[^]/).peek('cde', 0), {i:0,j:1})
	eq(r.reset('a').peek('abc', 0), {i:0,j:1})
})

test('consistent reduction', a => {
	eq(R(R`|`('a')), R`|`('a'))

	const an = R`|`('a')
	an.id = 'n'
	eq(R(an), an)

	const sn = R(R`|`('a'))
	sn.id = 'n'
	eq(sn, an)

	const G = new Grammar
	G.test = R(G.an)
	G.an = R`|`('a')
	G.sn = R(R`|`('a'))
	eq(G.sn, G.an)
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
