import test from './tester.js'
import t from 'assert-op'

import all from '../all.js'

var ab = all('a', 'b'),
		cd = all('c', 'd').kin(),
		ef = all('e', 'f'),
		af = all(ab, cd, ef),
		res = af.scan('abcdef')
t('===', res.cuts.length,3)
t('===', res.cuts[0].cuts.length,2)
t('===', res.cuts[1].cuts.length,2)
t('===', res.cuts[2].cuts.length,2)
test(res.cuts[0], {i:0, j:2, err: false})
test(res.cuts[1], {i:2, j:4, err: false})
test(res.cuts[2], {i:4, j:6, err: false})
res.fuse()
t('===', res.cuts.length,1, 'only cd should be left')
t('===', res.cuts[0].cuts.length,0, 'and cd should have a single kid left')
test(res.cuts[0], {i:2, j:4, err: false})
