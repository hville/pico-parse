import test from './tester.js'
import t from 'assert-op'

import all from '../all.js'
import tok from '../tok.js'

var ab = all(tok('a'), tok('b').id('b')), //undefined with named children
		cd = all(tok('c').id('*'), tok('d').id('*')).id('*'), //all with same name
		ef = all('e', 'f'), //all undefined
		af = all(ab, cd, ef),
		res = af.scan('abcdef')
test(res, {i:0, j:6, id:'', err: false})
t('===', res.cuts.length,2, 'only b & * should be left')
test(res.cuts[0], {i:1, j:2, id:'b', err: false})
test(res.cuts[1], {i:2, j:4, id:'*', err: false})
t('===', res.cuts[1].cuts.length, 0, 'all * are merged')
