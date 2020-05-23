import t from 'assert-op'
import all from '../all.js'

function test(res, ref) {
	for (var i=0, ks=Object.keys(ref); i<ks.length; ++i) t('===', res[ks[i]], ref[ks[i]])
}

// all pass
test(all('abc').peek('abc', 0), {id:'', i:0, j: 3, err: 0})
test(all('bc').peek('abc', 1), {id:'', i:1, j: 3, err: 0})
test(all('ab', /c/).id('kin').scan('abc'), {id:'kin', i:0, j: 3, err: 0})
test(all('a', all('b', all('c'))).scan('abc'), {i:0, j: 3, err: 0})
var _ = / */,
		spaced = all('a', _, 'b', _, 'c')
t('===', spaced.peek('abc', 0).j, 3)
t('===', spaced.peek('a bc', 0).j, 4)
t('===', spaced.peek('a  bc', 0).j, 5)
t('===', spaced.peek('a  b c', 0).j, 6)

// all fail
test(all('abc').peek('abc', 1), {i:1, j:2, err: 1})
test(all('a', 'c').peek('abc', 0), {i:0, j:2, err: 1})

var rule = all('a', all('b', all('C')).id('A')),
		pack = rule.peek('abc', 0)
test(pack, {i:0, j:3, err: 1})

// all scan
test(all('abc').id('kin').peek('abc', 0), {id:'kin', i:0, j: 3, err: 0})
test(all('abc').id('kin').scan('abc'), {id:'kin', i:0, j: 3, err: 0})
