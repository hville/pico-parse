import {seq, any} from '../index.js'
import test from 'assert-op'

	withRofN(seq, 'seq')
	withRofN(any, 'any')

function withRofN(rule, name) {
	const abcT = rule('abc'),
				abcR = rule`r`(/abc/)
	test(`${name}(terminal)`, a => {
		// name
		a`{===}`(rule('abc').peek('abc', 0), [0,3])
		a`{===}`(rule(/abc/).peek('abc', 0), [0,3])

		// rule string pass
		a`{===}`(abcT.scan('abc'), [0,3])
		a`{===}`(abcT.peek('aabc', 1), [1,4])
		a`{===}`(rule('').peek('aabc', 1), [1,1])
		// rule string fail
		a`{===}`(abcT.peek('ab', 0), [0,-1])
		a`{===}`(abcT.peek('aabc', 0), [0,-1])
		a`{===}`(abcT.scan('aabc'), [0,-1])
		a`{===}`(abcT.peek('abc', 1), [1,-1])
		// rule regexp pass
		a`{===}`(abcR.scan('abc'), [0,3,'r'])
		a`{===}`(abcR.peek('aabc', 1), [1,4,'r'])
		a`{===}`(rule(/[ ]*/).peek('a', 0), [0,0])
		// rule regexp fail
		a`{===}`(abcR.peek('ab', 0), [0,-1,'r'])
		a`{===}`(abcR.peek('aabc', 0), [0,-1,'r'])
		a`{===}`(abcR.peek('abc', 1), [1,-1,'r'])
	})
}
