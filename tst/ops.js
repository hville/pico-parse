var ct = require('cotest'),
		{any, all, rep, opt, few, run, and, not} = require('../')

function test(t, res, ref) {
	for (var i=0, ks=Object.keys(ref); i<ks.length; ++i) t('===', res[ks[i]], ref[ks[i]])
}

ct('all pass', t => {
	test(t, all('abc').peek('abc'), {kin:'', i:0, j: 3, err: false})
	test(t, all('bc').peek('abc', 1), {kin:'', i:1, j: 3, err: false})
	test(t, all('ab', /c/).name('kin').scan('abc'), {kin:'kin', i:0, j: 3, err: false})
	test(t, all('a', all('b', all('c'))).scan('abc'), {i:0, j: 3, err: false})
	var _ = / */,
			spaced = all('a', _, 'b', _, 'c')
	t('===', spaced.peek('abc').j, 3)
	t('===', spaced.peek('a bc').j, 4)
	t('===', spaced.peek('a  bc').j, 5)
	t('===', spaced.peek('a  b c').j, 6)
})

ct('all fail', t => {
	test(t, all('abc').peek('abc', 1), {i:1, j:1, err: true})
	test(t, all('a', 'c').peek('abc'), {i:0, j:1, err: true})

	var rule = all('a', all('b', all('C')).name('A')),
			pack = rule.peek('abc')
	test(t, pack, {i:0, j:2, err: true})
	test(t, pack.set[1], {kin:'A', i:1, j:2, err: true})
})

ct('all scan', t => {
	test(t, all('abc').name('kin').peek('abc'), {kin:'kin', i:0, j: 3, err: false})
	test(t, all('abc').name('kin').scan('abc'), {kin:'kin', i:0, j: 3, err: false})
})

ct('any pass', t => {
	var fail = any('X', 'Y', 'Z'),
			ab = any(fail, 'ab'),
			rule = any(fail, all(any(fail, ab, 'abc')).name('kin')),
			pack = rule.peek('abc')
	t('===', pack.err, false)
	t('===', pack.kin, 'kin')
	t('===', pack.i, 0)
	t('===', pack.j, 2)
})

ct('any fail', t => {
	var fail = any('X', 'Y', 'abX'),
			rule = any(fail, any(fail), fail)
	test(t, rule.peek('abc'), {txt:'ab', i:0, j:2, err: true})
})

ct('rep few pass', t => {
	t('===', run('ab').peek('x').err, false)
	t('===', run('ab').peek('x').i, 0)
	t('===', run('ab').peek('x').j, 0)

	t('===', run('ab').peek('ab').err, false)
	t('===', run('ab').peek('ab').i, 0)
	t('===', run('ab').peek('ab').j, 2)

	t('===', run('ab').peek('abababX').err, false)
	t('===', run('ab').peek('abababX').i, 0)
	t('===', run('ab').peek('abababX').j, 6)

	t('===', few('ab').peek('abababX').err, false)
	t('===', few('ab').peek('abababX').i, 0)
	t('===', few('ab').peek('abababX').j, 6)

	t('===', few('a', 'b').peek('abababX').err, false)
	t('===', few('a', 'b').peek('abababX').i, 0)
	t('===', few('a', 'b').peek('abababX').j, 6)
})

ct('run few fail', t => {
	t('===', few('ab').peek('x').err, true)
	t('===', few('ab').peek('x').i, 0)
	t('===', few('ab').peek('x').j, 1)
})

ct('opt pass', t => {
	t('===', opt('ab').peek('x').err, false)
	t('===', opt('ab').peek('x').i, 0)
	t('===', opt('ab').peek('x').j, 0)

	t('===', opt('ab').peek('ab').err, false)
	t('===', opt('ab').peek('ab').i, 0)
	t('===', opt('ab').peek('ab').j, 2)

	t('===', opt('ab').peek('abababX').err, false)
	t('===', opt('ab').peek('abababX').i, 0)
	t('===', opt('ab').peek('abababX').j, 2)

	t('===', opt('a', 'b').peek('abababX').i, 0)
	t('===', opt('a', 'b').peek('abababX').j, 2)

})

ct.skip('fuse', t => {
	t('===', all('ab', 'cd').peek('ab').fuse(), 'ab')
	//t('===', all('ab', kin('xxx', /[^]*/)).peek('abxy').fuse({xxx: txt => txt.toUpperCase() }), 'abXY')
	t('===', all('ab', /[^]*/).peek('abxy').fuse({xxx: txt => txt.toUpperCase() }), 'ABXY')
	t('===', all('ab', all(/[^]*/)).peek('abxy').fuse({
		not: txt=>txt.replace('y', 'z'),
		all: txt => txt.toUpperCase()
	}), 'ABXZ')
})

ct('and not', t => {
	test(t, and('ab').peek('abc'), {
		i:0, j:0, err: false
	})
	test(t, not('ab').peek('abc'), {
		i:0, j:0, err: true
	})
	test(t, and('ba').peek('abc'), {i:0, j:0, err: true})
	test(t, not('ba').peek('abc'), {i:0, j:0, err: false})
	test(t, all('a', and('c')).peek('abc'), {i:0, err: true})
	test(t, all('a', and('b')).peek('abc'), {i:0, err: false})
	test(t, all('a', not('c')).peek('abc'), {i:0, err: false})
	test(t, all('a', not('b')).peek('abc'), {i:0, err: true})
})
