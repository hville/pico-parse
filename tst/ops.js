import test from 'assert-op'
import a from 'assert-op/assert.js'
import R from '../parsers.js'

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

	const id = a => a,
				ax = R`|`('a',),
				sx = R(R`|`('a'))
	ax.act = sx.act = id
	eq(ax, sx)
})

test('actions', a => {
	a`===`( R('a', R('a', (r,s)=>r.i /* 1 */), (r,s)=>s+r.i+r[0]).scan('aa') , 'aa01')
	a`===`( R( R('a', ()=>'A'), R('b', ()=>'B'), R('c', ()=>'C'), r=>r.join('') ).scan('abc') , 'ABC')
})
