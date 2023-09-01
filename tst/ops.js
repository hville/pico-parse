import test from 'assert-op'
import a from 'assert-op/assert.js'
import R from '../parsers.js'

function eq(val, res) {
	if ( val === null || res === null ) a`===`(val, res)
	else if ( val.error || res.error ) a`===`( !val.error, !val.error )
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
	eq(r.set('a').peek('abc', 0), {i:0,j:1})
	eq(r.set(/[^]/).peek('cde', 0), {i:0,j:1})
	eq(r.set('a').peek('abc', 0), {i:0,j:1})
})

test('consistent reduction', a => {
	eq(R(R`|`('a')), R`|`('a'))

	const an = R`|`('a')
	an.id = 'n'
	eq(R(an), an)

	const sn = R(R`|`('a'))
	sn.id = 'n'
	eq(sn, an)

	const	ax = R`|`('a',),
				sx = R(R`|`('a'))
	ax.id = sx.id = 'id'
	eq(ax, sx)
})

test('ids and actions', a => {
	a`===`( R.a('a', R.b('b'), R.c('c') ).scan('abc', { a:r=>r.join(''), b:(r,s)=>s, c:()=>'C' }) , 'bC')
})
