var ct = require('cotest'),
		{any, all, rep, opt, spy, kin, few, run, and, not, box} = require('../')

function test(t, res, ref) {
	for (var i=0, ks=Object.keys(ref); i<ks.length; ++i) t('===', res[ks[i]], ref[ks[i]])
}

ct('all pass', t => {
	test(t, kin('kin', 'abc').peek('abc'), {
		kin:'kin', i:0, j: 3, err: false
	})
	test(t, all('abc').peek('abc'), {
		kin:undefined, i:0, j: 3, err: false
	})
	test(t, all('abc').peek('abc'), {
		kin:undefined, i:0, j: 3, err: false
	})
	t('===', all('bc').peek('abc', 1).err, false)
	t('===', all('bc').peek('abc', 1).kin, undefined)
	t('===', kin('kin', 'bc').peek('abc', 1).kin, 'kin')
	t('===', all('bc').peek('abc', 1).i, 1)
	t('===', all('bc').peek('abc', 1).j, 3)

	t('===', all('ab', /c/).peek('abc').err, false)
	t('===', all('ab', /c/).peek('abc').kin, undefined)
	t('===', kin('kin', 'ab', /c/).peek('abc').kin, 'kin')
	t('===', all('ab', /c/).peek('abc').i, 0)
	t('===', all('ab', /c/).peek('abc').j, 3)
	t('===', all('ab', /c/).peek('abc').set.length, 2)

	t('===', all('a', all('b', all('c'))).peek('abc').err, false)
	t('===', all('a', all('b', all('c'))).peek('abc').kin, undefined)
	t('===', all('a', all('b', all('c'))).peek('abc').i, 0)
	t('===', all('a', all('b', all('c'))).peek('abc').j, 3)
	t('===', all('a', all('b', all('c'))).peek('abc').set.length, 3)

	var rule = all('a', kin('A','b', all('c'))),
			pack = rule.peek('abc'),
			nest = pack.set[1]
	t('===', pack.err, false)
	t('===', nest.err, false)
	t('===', pack.kin, undefined)
	t('===', nest.kin, 'A')
	t('===', pack.i, 0)
	t('===', nest.i, 1)
	t('===', pack.j, 3)
	t('===', nest.j, 3)
	t('===', pack.set.length, 2)
	t('===', nest.set.length, 2)
	var _ = / */,
			spaced = all('a', _, 'b', _, 'c')
	t('===', spaced.peek('abc').j, 3)
	t('===', spaced.peek('a bc').j, 4)
	t('===', spaced.peek('a  bc').j, 5)
	t('===', spaced.peek('a  b c').j, 6)
})

ct('all fail', t => {
	t('===', all('abc').peek('abc', 1).err, true)
	t('===', all('abc').peek('abc', 1).i, 1)
	t('===', all('abc').peek('abc', 1).j, 2)

	t('===', all('a', 'c').peek('abc').err, true)
	t('===', all('a', 'c').peek('abc').i, 0)
	t('===', all('a', 'c').peek('abc').j, 2)
	t('===', all('a', 'c').peek('abc').set.length, 2)
	t('===', all('a', 'c').peek('abc').set[1].j, 2)

	var rule = all('a', kin('A','b', all('C'))),
			pack = rule.peek('abc'),
			nest = pack.set[1]
	t('===', pack.err, true)
	t('===', nest.err, true)
	t('===', pack.kin, undefined)
	t('===', nest.kin, 'A')
	t('===', pack.i, 0)
	t('===', nest.i, 1)
	t('===', pack.j, 3)
	t('===', nest.j, 3)
	t('===', pack.set.length, 2)
	t('===', nest.set.length, 2)
})

ct('all scan', t => {
	test(t, kin('kin', 'abc').scan('abc'), {
		kin:'kin', i:0, j: 3, err: false
	})
})

ct('kin', t => {
	t('===', kin('kin', 'a').kin, 'kin')
	t('===', kin('kin', 'a').peek('a').kin, 'kin')
	t('===', kin('kin', 'a').peek('b').kin, 'kin')
})

ct('any pass', t => {
	var fail = any('X', 'Y', 'Z'),
			ab = any(fail, 'ab'),
			rule = any(fail, kin('kin', any(fail, ab, 'abc'))),
			pack = rule.peek('abc')
	t('===', pack.err, false)
	t('===', pack.kin, 'kin')
	t('===', pack.i, 0)
	t('===', pack.j, 2)
})

ct('any fail', t => {
	var fail = any('X', 'Y', 'abX'),
			rule = any(fail, any(fail), fail),
			pack = rule.peek('abc')
	t('===', pack.err, true)
	t('===', pack.kin, undefined)
	t('===', pack.i, 0)
	t('===', pack.txt, 'abc')
	t('===', pack.j, 3)
})

ct('rep few pass', t => {
	t('===', run('ab').peek('ab').kin, undefined)

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
	t('===', opt('ab').peek('ab').kin, undefined)

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

ct('spy', t => {
	test(t, kin('SPY', spy('abc', res=>(res.txt=res.txt.toUpperCase()))).peek('abc'), {
		kin:'SPY', i:0, txt:'ABC', j: 3, err: false
	})
})

ct('fuse', t => {
	t('===', all('ab', 'cd').peek('ab').fuse(), 'ab')
	t('===', all('ab', kin('xxx', /[^]*/)).peek('abxy').fuse({xxx: txt => txt.toUpperCase() }), 'abXY')
	t('===', kin('xxx', 'ab', /[^]*/).peek('abxy').fuse({xxx: txt => txt.toUpperCase() }), 'ABXY')
	t('===', kin('all', 'ab', kin('not', /[^]*/)).peek('abxy').fuse({
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
	test(t, and('ba').peek('abc'), {
		i:0, j:0, err: true
	})
	test(t, not('ba').peek('abc'), {
		i:0, j:0, err: false
	})
	test(t, all('a', and('c')).peek('abc'), {
		i:0, err: true
	})
	test(t, all('a', and('b')).peek('abc'), {
		i:0, err: false
	})
	test(t, all('a', not('c')).peek('abc'), {
		i:0, err: false
	})
	test(t, all('a', not('b')).peek('abc'), {
		i:0, err: true
	})
})
ct('box', t => {
	var a = any()
	test(t, a.set(box(a,'a'), 'a').peek('aaa'), { i:0, j:3, err: false })
	var b = box()
	test(t, b.set(any(all(b,'a'),'a')).peek('aaa'), { i:0, j:3, err: false })
})
