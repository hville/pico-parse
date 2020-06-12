import test from './tester.js'
import seq from '../seq.js'

// seq pass
test(seq('abc').peek('abc', 0), {i:0, j: 3, err: false})
test(seq('bc').peek('abc', 1), {i:1, j: 3, err: false})
test(seq('ab', /c/).scan('abc'), {i:0, j: 3, err: false})
test(seq('a', seq('b', seq('c'))).scan('abc'), {i:0, j: 3, err: false})
var _ = / */,
		spaced = seq('a', _, 'b', _, 'c')
test(spaced.peek('abc', 0))
test(spaced.peek('a bc', 0))
test(spaced.peek('a  bc', 0))
test(spaced.peek('a  b c', 0))

// seq fail
test(seq('abc').peek('abc', 1), {i:1, j:2, err: true})
test(seq('a', 'c').peek('abc', 0), {i:0, j:2, err: true})

var rule = seq('a', seq('b', seq('C'))),
		pack = rule.peek('abc', 0)
test(pack, {i:0, j:3, err: true})

// seq scan
test(seq('abc').peek('abc', 0))
test(seq('abc').scan('abc'))

// seq spy
test(seq('abc').spy(res=>res.err=true).scan('abc'), {i:0, j:3, err: true})
