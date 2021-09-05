import test from 'assert-op'
import { and, any, few, not, opt, run, seq } from '../parsers.js'

test('run', a => {
	a`{===}`(run('ab').peek('x', 0), {i:0,j:0})
	a`{===}`(run('ab').scan('ab'), {i:0,j:2})
	a`{===}`(run('ab').scan('ababab'), {i:0,j:6})
	a`{===}`(run('a', 'b').scan('ababab'), {i:0,j:6})
})

test('few', a => {
	//pass
	a`{===}`(few('ab').scan('ababab'), {i:0,j:6})
	a`{===}`(few('a', 'b').scan('ababab'), {i:0,j:6})
	// few fail
	a`===`(few('ab').peek('x', 0), null)
})

test('opt', a => {
	// opt pass
	a`{===}`(opt('ab').peek('x', 0), {i:0,j:0})
	a`{===}`(opt('a', 'b').peek('x', 0), {i:0,j:0})
	a`{===}`(opt('ab').scan('ab'), {i:0,j:2})
	a`{===}`(opt('a', 'b').scan('ab'), {i:0,j:2})
})

test('any', a => {
	// any pass
	a`{===}`(any('x','ab','abab').peek('abababX', 0), {i:0,j:2})
})

test('and', a => {
	a`{===}`(and('ab').peek('abc', 0), {i:0,j:0})
	a`===`(and('ba').peek('abc', 0), null)
	a`===`(seq('a', and('c')).peek('abc', 0), null)
	a`{===}`(seq('a', and('b')).peek('abc', 0), {i:0,j:1})
})

test('not', a => {
	a`===`(not('ab').peek('abc', 0), null)
	a`{===}`(not('ba').peek('abc', 0), {i:0,j:0})
	a`{===}`(seq('a', not('c')).peek('abc', 0), {i:0,j:1})
	a`===`(seq('a', not('b')).peek('abc', 0), null)
})

test('consistent reduction', a => {
	a`{===}`(seq(any('a')), any('a'))
	a`{===}`(seq`n`(any('a')), any`n`('a'))
	a`{===}`(seq(any`n`('a')), any`n`('a'))

	a`{===}`(any(seq('a')), seq('a'))
	a`{===}`(any`n`(seq('a')), seq`n`('a'))
	a`{===}`(any(seq`n`('a')), seq`n`('a'))
})

/*
test('tie', a => {
	//anonymous
	a`{===}`(tie('.','a').peek('a.b', 0), {i:0,j:1})
	a`{===}`(tie('.','a').peek('a.a.b', 0), [0,3])
	a`{===}`(tie('.','a').peek('a.a.a.b', 0), [0,5])
	//any
	a`{===}`(tie('.','a','b').peek('a.b', 0), [0,3])
	a`{===}`(tie('.','a','b').peek('a.a.b', 0), [0,5])
	a`{===}`(tie('.','a','b').peek('a.a.a.b', 0), [0,7])
	//named
	a`{===}`(tie`n`('.','a').peek('a.b', 0), [0,1,'n'])
	a`{===}`(tie`n`('.','a').peek('a.a.b', 0), [0,3,'n'])
	a`{===}`(tie`n`('.','a').peek('a.a.a.b', 0), [0,5,'n'])
})
*/
