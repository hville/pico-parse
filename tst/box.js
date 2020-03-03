var ct = require('cotest'),
		{any, all, rep, opt, spy, kin, few, run, and, not} = require('..')

function test(t, res, ref) {
	for (var i=0, ks=Object.keys(ref); i<ks.length; ++i) t('===', res[ks[i]], ref[ks[i]])
}

ct('box', t => {
	var a = any()
	//test(t, a.set(a,'a').peek('aaa'), { i:0, j:1, err: false })
	//test(t, a.set(all(a,'a'),'a').peek('aaa'), { i:0, j:3, err: false })
	test(t, a.set(all(a,run('a')),'a').peek('aaa'), { i:0, j:3, err: false })
	test(t, a.set(all(a,/a*/),'a').peek('aaa'), { i:0, j:3, err: false })
	test(t, a.set(all(a,/a*/),all(a,/b*/),/[ab]/).peek('aba'), { i:0, j:3, err: false })
	//E <- E '+n' / 'n'
	test(t, a.set(all(a,'+n'),'n').peek('n+n+n'), { i:0, j:3, err: false })
})
