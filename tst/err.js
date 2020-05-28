import t from 'assert-op'
import all from '../all.js'
//import run from '../run.js'
//import few from '../few.js'
//import opt from '../opt.js'
//import and from '../and.js'
//import not from '../not.js'

function test(res, ref) {
	for (var i=0, ks=Object.keys(ref); i<ks.length; ++i) t('===', res[ks[i]], ref[ks[i]])
}

var abcde = all('a', 'b', 'c', 'd', 'e')
// rep pass
test(abcde.peek('ab_de', 0), {i:0, j:5, err: 1})
test(abcde.peek('ab__e', 0), {i:0, j:5, err: 2})
test(abcde.peek('abde', 0), {i:0, j:4, err: 3})

