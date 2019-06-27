var ct = require('cotest'),
		any = require('../any'),
		all = require('../all'),
		rep = require('../rep'),
		opt = require('../opt'),
		spy = require('../spy')

function test(t, res, ref) {
	for (var i=0, ks=Object.keys(ref); i<ks.length; ++i) t('===', res[ks[i]], ref[ks[i]])
}

ct('all pass', t => {
	test(t, all.call('kin', 'abc').peek('abc'), {
		kin:'kin', i:0, j: 3, err: false
	})
	test(t, all('abc').peek('abc'), {
		kin:undefined, i:0, j: 3, err: false
	})
	test(t, all('abc').peek('abc').set[0], {
		kin:undefined, i:0, j: 3, err: false
	})
	t('===', all('abc').peek('abc').set.length, 1)

	t('===', all('bc').peek('abc', 1).err, false)
	t('===', all('bc').peek('abc', 1).kin, undefined)
	t('===', all.call('kin', 'bc').peek('abc', 1).kin, 'kin')
	t('===', all('bc').peek('abc', 1).i, 1)
	t('===', all('bc').peek('abc', 1).j, 3)
	t('===', all('bc').peek('abc').set.length, 1)

	t('===', all('ab', /c/).peek('abc').err, false)
	t('===', all('ab', /c/).peek('abc').kin, undefined)
	t('===', all.call('kin', 'ab', /c/).peek('abc').kin, 'kin')
	t('===', all('ab', /c/).peek('abc').i, 0)
	t('===', all('ab', /c/).peek('abc').j, 3)
	t('===', all('ab', /c/).peek('abc').set.length, 2)

	t('===', all('a', all('b', all('c'))).peek('abc').err, false)
	t('===', all('a', all('b', all('c'))).peek('abc').kin, undefined)
	t('===', all('a', all('b', all('c'))).peek('abc').i, 0)
	t('===', all('a', all('b', all('c'))).peek('abc').j, 3)
	t('===', all('a', all('b', all('c'))).peek('abc').set.length, 3)

	var rule = all('a', all.call('A','b', all('c'))),
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
	t('===', all('abc').peek('abc', 1).set.length, 1)

	t('===', all('a', 'c').peek('abc').err, true)
	t('===', all('a', 'c').peek('abc').i, 0)
	t('===', all('a', 'c').peek('abc').j, 2)
	t('===', all('a', 'c').peek('abc').set.length, 2)
	t('===', all('a', 'c').peek('abc').set[1].j, 2)

	var rule = all('a', all.call('A','b', all('C'))),
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
	test(t, all.call('kin', 'abc').scan('abcdef'), {
		kin:'kin', i:0, j: 6, err: true
	})
})

ct('any pass', t => {
	var fail = any('X', 'Y', 'Z'),
			ab = any(fail, 'ab'),
			rule = any(fail, any.call('kin', fail, ab, 'abc')),
			pack = rule.peek('abc')
	t('===', pack.err, false)
	t('===', pack.kin, 'kin')
	t('===', pack.i, 0)
	t('===', pack.j, 2)
})

ct('any fail', t => {
	var fail = any('X', 'Y', 'abX'),
			rule = any(fail, any.call('kin', fail), fail),
			pack = rule.peek('abc')
	t('===', pack.err, true)
	t('===', pack.kin, undefined)
	t('===', pack.i, 0)
	t('===', pack.txt, 'abc')
	t('===', pack.j, 3)
})

ct('rep pass', t => {
	t('===', rep('ab').peek('ab').kin, undefined)
	t('===', rep.call('kin', 'bc').peek('ab').kin, 'kin')

	t('===', rep('ab').peek('x').err, false)
	t('===', rep('ab').peek('x').i, 0)
	t('===', rep('ab').peek('x').j, 0)

	t('===', rep('ab').peek('ab').err, false)
	t('===', rep('ab').peek('ab').i, 0)
	t('===', rep('ab').peek('ab').j, 2)

	t('===', rep('ab').peek('abababX').err, false)
	t('===', rep('ab').peek('abababX').i, 0)
	t('===', rep('ab').peek('abababX').j, 6)

	t('===', rep('ab', 1, 2).peek('abababX').err, false)
	t('===', rep('ab', 1, 2).peek('abababX').i, 0)
	t('===', rep('ab', 1, 2).peek('abababX').j, 4)
})

ct('rep fail', t => {
	t('===', rep('ab', 1).peek('x').err, true)
	t('===', rep('ab', 1).peek('x').i, 0)
	t('===', rep('ab', 1).peek('x').j, 1)

	t('===', rep('ab', 2).peek('ab').err, true)
	t('===', rep('ab', 2).peek('ab').i, 0)
	t('===', rep('ab', 2).peek('ab').j, 3)

	t('===', rep('ab', 3).peek('ababX').err, true)
	t('===', rep('ab', 3).peek('ababX').i, 0)
	t('===', rep('ab', 3).peek('ababX').j, 5)
})

ct('opt pass', t => {
	t('===', opt('ab').peek('ab').kin, undefined)
	t('===', opt.call('kin', 'bc').peek('ab').kin, 'kin')

	t('===', opt('ab').peek('x').err, false)
	t('===', opt('ab').peek('x').i, 0)
	t('===', opt('ab').peek('x').j, 0)

	t('===', opt('ab').peek('ab').err, false)
	t('===', opt('ab').peek('ab').i, 0)
	t('===', opt('ab').peek('ab').j, 2)

	t('===', opt('ab').peek('abababX').err, false)
	t('===', opt('ab').peek('abababX').i, 0)
	t('===', opt('ab').peek('abababX').j, 2)
})

ct('spy', t => {
	test(t, spy.call('SPY', 'abc', res=>(res.txt=res.txt.toUpperCase())).peek('abc'), {
		kin:'SPY', i:0, txt:'ABC', j: 3, err: false
	})
})

ct('fuse', t => {
	t('===', all('ab', 'cd').peek('ab').fuse(), 'ab')
	t('===', all('ab', any.call('xxx', /[^]*/)).peek('abxy').fuse({xxx: txt => txt.toUpperCase() }), 'abXY')
	t('===', all.call('xxx', 'ab', /[^]*/).peek('abxy').fuse({xxx: txt => txt.toUpperCase() }), 'ABXY')
	t('===', all.call('all', 'ab', any.call('not', /[^]*/)).peek('abxy').fuse({
		not: txt=>txt.replace('y', 'z'),
		all: txt => txt.toUpperCase()
	}), 'ABXZ')
})
