var ct = require('cotest'),
		{any, all, rep, opt, few, run, and, not} = require('..'),
		Box = require('../src/_box')

function test(t, res, ref) {
	for (var i=0, ks=Object.keys(ref); i<ks.length; ++i) t('===', res[ks[i]], ref[ks[i]])
}

ct('E<-E1|1', t => {
	var E = any(),
			B = new Box(E)
	test(t, B.set(all(B,'1'),'1').peek('111'), { i:0, j:3, err: false })
})
ct('E<-E1|E2|1', t => {
	var B = new Box(any())
	test(t, B.set(all(B,'1'), all(B,'2'),'1').peek('121'), { i:0, j:3, err: false })
})
