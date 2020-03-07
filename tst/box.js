var ct = require('cotest'),
		{any, all, rep, opt, spy, kin, few, run, and, not} = require('..'),
		box = require('../src/box')

function test(t, res, ref) {
	for (var i=0, ks=Object.keys(ref); i<ks.length; ++i) t('===', res[ks[i]], ref[ks[i]])
}

ct('E<-E1|1', t => {
	var E = any(),
			B = box(E)
	test(t, B.set(all(B,'1'),'1').peek('111'), { i:0, j:3, err: false })
})
