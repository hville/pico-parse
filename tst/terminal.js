import {seq, any} from '../parsers.js'
import test from 'assert-op'

	withRofN(seq, 'seq')
	withRofN(any, 'any')

function withRofN(rule, name) {
	const abcT = rule('abc'),
				abcR = rule`r`(/abc/)
	test(`${name}(terminal)`, a => {
		// name
		a`{===}`(rule('abc').peek('abc', 0), {i:0,j:3})
		a`{===}`(rule(/abc/).peek('abc', 0), {i:0,j:3})

		// rule string pass
		a`{===}`(abcT.scan('abc'), {i:0,j:3})
		a`{===}`(abcT.peek('aabc', 1), {i:1,j:4})
		a`{===}`(rule('').peek('aabc', 1), {i:1,j:1})
		// rule string fail
		a`===`(abcT.peek('ab', 0), null)
		a`===`(abcT.peek('aabc', 0), null)
		a`===`(abcT.scan('aabc'), null)
		a`===`(abcT.peek('abc', 1), null)
		// rule regexp pass
		a`{===}`(abcR.scan('abc'), {i:0,j:3,id:'r'})
		a`{===}`(abcR.peek('aabc', 1), {i:1,j:4,id:'r'})
		a`{===}`(rule(/[ ]*/).peek('a', 0), {i:0,j:0})
		// rule regexp fail
		a`===`(abcR.peek('ab', 0), null)
		a`===`(abcR.peek('aabc', 0), null)
		a`===`(abcR.peek('abc', 1), null)
	})
}
