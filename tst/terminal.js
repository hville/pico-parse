import t from './tester.js'
import {seq, any} from '../index.js'
import test from 'assert-op'

	withRofN(seq, 'seq')
	withRofN(any, 'any')

function withRofN(rule, name) {
	const abcT = rule('abc'),
				abcR = rule`r`(/abc/)
	test(`${name}(terminal)`, a => {
		// name
		t(rule('abc').peek('abc', 0), [0,3])
		t(rule(/abc/).peek('abc', 0), [0,3])

		// rule string pass
		t(abcT.scan('abc'), [0,3])
		t(abcT.peek('aabc', 1), [1,4])
		t(rule('').peek('aabc', 1), [1,1])
		// rule string fail
		t(abcT.peek('ab', 0), [0,-1])
		t(abcT.peek('aabc', 0), [0,-1])
		t(abcT.scan('aabc'), [0,-1])
		t(abcT.peek('abc', 1), [1,-1])
		// rule regexp pass
		t(abcR.scan('abc'), [0,3,'r'])
		t(abcR.peek('aabc', 1), [1,4,'r'])
		t(rule(/[ ]*/).peek('a', 0), [0,0])
		// rule regexp fail
		t(abcR.peek('ab', 0))
		t(abcR.peek('aabc', 0))
		t(abcR.peek('abc', 1))
	})
}
