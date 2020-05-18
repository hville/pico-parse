import t from 'assert-op'
import any from '../any.js'
import all from '../all.js'

function test(res, ref) {
	for (var i=0, ks=Object.keys(ref); i<ks.length; ++i) t('===', res[ks[i]], ref[ks[i]])
}

// any pass
var fail = any('X', 'Y', 'Z'),
		ab = any(fail, 'ab'),
		rule = any(fail, all(any(fail, ab, 'abc')).id('kin'))
test(rule.peek('abc', 0), {i:0, j:2, err:0, id: 'kin'})

// any fail
fail = any('X', 'Y', 'abX')
rule = any(fail, any(fail), fail)
test(rule.peek('abc', 0), {txt:'ab', i:0, j:2, err: 1})
