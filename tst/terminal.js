import R from '../parsers.js'
import test from 'assert-op'
import a from 'assert-op/assert.js'

withRofN(R, 'R')
withRofN(R`|`, 'R`|`')
withRofN(R` `, 'R` `')

function eq(val, res) {
	if ( val === null || res === null ) a`===`(val, res)
	else if ( val.error || res.error ) a`===`( !val.error, !val.error )
	else {
		a`===`(val.i, res.i)
		a`===`(val.j, res.j)
	}
}

function withRofN(rule, name) {
	const abcT = rule('abc'),
				abcR = rule(/abc/)
	abcR.id = 'r'
	test(`${name}(terminal)`, a => {
		// name
		eq(rule('abc').peek('abc', 0), {i:0,j:3})//
		eq(rule(/abc/).peek('abc', 0), {i:0,j:3})

		// rule string pass
		eq(abcT.scan('abc'), {i:0,j:3})
		eq(abcT.peek('aabc', 1), {i:1,j:4})
		eq(rule('').peek('aabc', 1), {i:1,j:1})
		// rule string fail
		eq(abcT.peek('ab', 0), null)
		eq(abcT.peek('aabc', 0), null)
		eq(abcT.scan('aabc'), {error:'...'})
		eq(abcT.peek('abc', 1), null)
		// rule regexp pass
		eq(abcR.scan('abc'), {i:0,j:3,id:'r'})
		eq(abcR.peek('aabc', 1), {i:1,j:4,id:'r'})
		eq(rule(/[ ]*/).peek('a', 0), {i:0,j:0})
		// rule regexp fail
		eq(abcR.peek('ab', 0), null)
		eq(abcR.peek('aabc', 0), null)
		eq(abcR.peek('abc', 1), null)
	})
}

