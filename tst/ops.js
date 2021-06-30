import test from 'assert-op'
import { and, any, few, not, opt, run, seq } from '../index.js'

test('run', a => {
	a`{===}`(run('ab').peek('x', 0), [0,0])
	a`{===}`(run('ab').peek('ab', 0), [0,2])
	a`{===}`(run('ab').peek('abababX', 0), [0,6])
	a`{===}`(run('a', 'b').peek('abababX', 0), [0,6])
})

test('few', a => {
	//pass
	a`{===}`(few('ab').peek('abababX', 0), [0,6])
	a`{===}`(few('a', 'b').peek('abababX', 0), [0,6])
	// few fail
	a`{===}`(few('ab').peek('x', 0), [0,-1])
})

test('opt', a => {
	// opt pass
	a`{===}`(opt('ab').peek('x', 0), [0,0])
	a`{===}`(opt('a', 'b').peek('x', 0), [0,0])
	a`{===}`(opt('ab').peek('ab', 0), [0,2])
	a`{===}`(opt('a', 'b').peek('ab', 0), [0,2])
	a`{===}`(opt('ab').peek('abababX', 0), [0,2])
	a`{===}`(opt('a', 'b').peek('abababX', 0), [0,2])
})

test('any', a => {
	// any pass
	a`{===}`(any('x','ab','abab').peek('abababX', 0), [0,2])
})

test('and', a => {
	a`{===}`(and('ab').peek('abc', 0), [0,0])
	a`{===}`(and('ba').peek('abc', 0), [0,-1])
	a`{===}`(seq('a', and('c')).peek('abc', 0), [0,-1])
	a`{===}`(seq('a', and('b')).peek('abc', 0), [0,1])
})

test('not', a => {
	a`{===}`(not('ab').peek('abc', 0), [0,-1])
	a`{===}`(not('ba').peek('abc', 0), [0,0])
	a`{===}`(seq('a', not('c')).peek('abc', 0), [0,1])
	a`{===}`(seq('a', not('b')).peek('abc', 0), [0,-1])
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
	a`{===}`(tie('.','a').peek('a.b', 0), [0,1])
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
