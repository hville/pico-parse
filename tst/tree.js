import test from './tester.js'
import t from 'assert-op'

import seq from '../seq.js'
import tok from '../tok.js'

var ab = seq(tok('a'), tok('b').id('b')), //undefined with named children
		cd = seq(tok('c').id('*'), tok('d').id('*')).id('*'), //seq with same name
		ef = seq('e', 'f'), //seq undefined
		af = seq(ab, cd, ef),
		res = af.scan('abcdef')
test(res, {i:0, j:6, id:'', err: false})
t('===', res.cuts.length,2, 'only b & * should be left')
test(res.cuts[0], {i:1, j:2, id:'b', err: false})
test(res.cuts[1], {i:2, j:4, id:'*', err: false})
t('===', res.cuts[1].cuts.length, 0, 'seq * are merged')
