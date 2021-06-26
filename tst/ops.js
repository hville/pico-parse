import t from './tester.js'
import test from 'assert-op'
import { and, any, few, not, opt, run, seq } from '../index.js'

test('run', a => {
	t(run('ab').peek('x', 0), [0,0])
	t(run('ab').peek('ab', 0), [0,2])
	t(run('ab').peek('abababX', 0), [0,6])
	t(run('a', 'b').peek('abababX', 0), [0,6])
})

test('few', a => {
	//pass
	t(few('ab').peek('abababX', 0), [0,6])
	t(few('a', 'b').peek('abababX', 0), [0,6])
	// few fail
	t(few('ab').peek('x', 0))
})

test('opt', a => {
	// opt pass
	t(opt('ab').peek('x', 0), [0,0])
	t(opt('a', 'b').peek('x', 0), [0,0])
	t(opt('ab').peek('ab', 0), [0,2])
	t(opt('a', 'b').peek('ab', 0), [0,2])
	t(opt('ab').peek('abababX', 0), [0,2])
	t(opt('a', 'b').peek('abababX', 0), [0,2])
})

test('any', a => {
	// any pass
	t(any('x','ab','abab').peek('abababX', 0), [0,2])
})

test('and', a => {
	t(and('ab').peek('abc', 0), [0,0])
	t(and('ba').peek('abc', 0))
	t(seq('a', and('c')).peek('abc', 0))
	t(seq('a', and('b')).peek('abc', 0), [0,1])
})

test('not', a => {
	t(not('ab').peek('abc', 0))
	t(not('ba').peek('abc', 0), [0,0])
	t(seq('a', not('c')).peek('abc', 0), [0,1])
	t(seq('a', not('b')).peek('abc', 0))
})

test('consistent reduction', a => {
	a('{===}', seq(any('a')), any('a'))
	a('{===}', seq`n`(any('a')), any`n`('a'))
	a('{===}', seq(any`n`('a')), any`n`('a'))

	a('{===}', any(seq('a')), seq('a'))
	a('{===}', any`n`(seq('a')), seq`n`('a'))
	a('{===}', any(seq`n`('a')), seq`n`('a'))
})
