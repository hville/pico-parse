import t from 'assert-op'
import all from '../all.js'

function test(res, ref) {
	for (var i=0, ks=Object.keys(ref); i<ks.length; ++i) t('===', res[ks[i]], ref[ks[i]], ks[i])
}

// all pass
test(all('abc').peek('abc', 0), {i:0, j: 3, err: false})
test(all('bc').peek('abc', 1), {i:1, j: 3, err: false})
test(all('ab', /c/).scan('abc'), {i:0, j: 3, err: false})
test(all('a', all('b', all('c'))).scan('abc'), {i:0, j: 3, err: false})
var _ = / */,
		spaced = all('a', _, 'b', _, 'c')
t('===', spaced.peek('abc', 0).j, 3)
t('===', spaced.peek('a bc', 0).j, 4)
t('===', spaced.peek('a  bc', 0).j, 5)
t('===', spaced.peek('a  b c', 0).j, 6)

// all fail
test(all('abc').peek('abc', 1), {i:1, j:2, err: true})
test(all('a', 'c').peek('abc', 0), {i:0, j:2, err: true})

var rule = all('a', all('b', all('C'))),
		pack = rule.peek('abc', 0)
test(pack, {i:0, j:3, err: true})

// all scan
test(all('abc').peek('abc', 0), {i:0, j: 3, err: false})
test(all('abc').scan('abc'), {i:0, j: 3, err: false})
