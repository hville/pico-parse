import t from 'assert-op'
import all from '../all.js'
import run from '../run.js'
import few from '../few.js'
import opt from '../opt.js'
import and from '../and.js'
import not from '../not.js'

function test(res, ref) {
	for (var i=0, ks=Object.keys(ref); i<ks.length; ++i) t('===', res[ks[i]], ref[ks[i]])
}

// rep pass
test(run('ab').peek('x', 0), {i:0, j:0, err: 0})
test(run('ab').peek('ab', 0), {i:0, j:2, err: 0})
test(run('ab').peek('abababX', 0), {i:0, j:6, err: 0})
test(run('a', 'b').peek('abababX', 0), {i:0, j:6, err: 0})

// few pass
test(few('ab').peek('abababX', 0), {i:0, j:6, err: 0})
test(few('a', 'b').peek('abababX', 0), {i:0, j:6, err: 0})

// few fail
test(few('ab').peek('x', 0), {i:0, j:1, err: 1})

// opt pass
test(opt('ab').peek('x', 0), {i:0, j:0, err: 0})
test(opt('a', 'b').peek('x', 0), {i:0, j:0, err: 0})
test(opt('ab').peek('ab', 0), {i:0, j:2, err: 0})
test(opt('a', 'b').peek('ab', 0), {i:0, j:2, err: 0})
test(opt('ab').peek('abababX', 0), {i:0, j:2, err: 0})
test(opt('a', 'b').peek('abababX', 0), {i:0, j:2, err: 0})

//TODO
// fuse
//t('===', all('ab', 'cd').peek('ab').fuse(), 'ab')
//t('===', all('ab', /[^]*/).peek('abxy').fuse({xxx: txt => txt.toUpperCase() }), 'ABXY')
//t('===', all('ab', all(/[^]*/)).peek('abxy').fuse({ not: txt=>txt.replace('y', 'z'), all: txt => txt.toUpperCase()}), 'ABXZ')

// and not
test(and('ab').peek('abc', 0), { i:0, j:0, err: 0})
test(not('ab').peek('abc', 0), { i:0, j:0, err: 1 })
test(and('ba').peek('abc', 0), {i:0, j:0, err: 1 })
test(not('ba').peek('abc', 0), {i:0, j:0, err: 0})
test(all('a', and('c')).peek('abc', 0), {i:0, err: 1})//
test(all('a', and('b')).peek('abc', 0), {i:0, err: 0})
test(all('a', not('c')).peek('abc', 0), {i:0, err: 0})
test(all('a', not('b')).peek('abc', 0), {i:0, err: 1})
