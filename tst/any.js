import test from './tester.js'
import any from '../any.js'
import all from '../all.js'

// any pass
var fail = all('X', 'Y', 'Z'),
		ab = any(fail, fail, fail, 'ab'),
		rule = any(fail, fail, fail, all(any(fail, fail, ab, 'abc')))
test(rule.peek('abc', 0), {i:0, j:2, err: false})

// any fail
fail = any('X', 'Y', 'abX')
rule = any(fail, any(fail), fail)
test(rule.peek('abcd', 0), {i:0, j:3, err: true})
