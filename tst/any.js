import t from 'assert-op'
import any from '../any.js'
import all from '../all.js'

function test(res, ref) {
	for (var i=0, ks=Object.keys(ref); i<ks.length; ++i) t('===', res[ks[i]], ref[ks[i]])
}

// any pass
var fail = all('X', 'Y', 'Z'),
		ab = any(fail, fail, fail, 'ab'),
		rule = any(fail, fail, fail, all(any(fail, fail, ab, 'abc')))
test(rule.peek('abc', 0), {i:0, j:2, err:0})

// any fail
fail = any('X', 'Y', 'abX')
rule = any(fail, any(fail), fail)
test(rule.peek('abcd', 0), {txt:'abc', i:0, j:3, err: 1})
