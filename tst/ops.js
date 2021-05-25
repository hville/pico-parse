import t from './tester.js'
import { and, any, few, not, opt, run, seq } from '../index.js'

// rep pass
t(run('ab').peek('x', 0), [0,0])
t(run('ab').peek('ab', 0), [0,2])
t(run('ab').peek('abababX', 0), [0,6])
t(run('a', 'b').peek('abababX', 0), [0,6])

// few pass
t(few('ab').peek('abababX', 0), [0,6])
t(few('a', 'b').peek('abababX', 0), [0,6])

// few fail
t(few('ab').peek('x', 0))

// opt pass
t(opt('ab').peek('x', 0), [0,0])
t(opt('a', 'b').peek('x', 0), [0,0])
t(opt('ab').peek('ab', 0), [0,2])
t(opt('a', 'b').peek('ab', 0), [0,2])
t(opt('ab').peek('abababX', 0), [0,2])
t(opt('a', 'b').peek('abababX', 0), [0,2])

// any pass
t(any('x','ab','abab').peek('abababX', 0), [0,2])

// and not
t(and('ab').peek('abc', 0), [0,0])
t(not('ab').peek('abc', 0))
t(and('ba').peek('abc', 0))
t(not('ba').peek('abc', 0), [0,0])
t(seq('a', and('c')).peek('abc', 0))
t(seq('a', and('b')).peek('abc', 0), [0,1])
t(seq('a', not('c')).peek('abc', 0), [0,1])
t(seq('a', not('b')).peek('abc', 0))
