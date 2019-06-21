var ct = require('cotest'),
		text = require('../tok')

var simNoSticky = Object.defineProperty(/abc/, 'sticky', {value: null}),
		abcT = text('abc'),
		abcG = text(simNoSticky),
		abcS = text(/abc/),
		voidS = text(/.{0,0}/),
		voidG = Object.defineProperty(/.{0,0}/, 'sticky', {value: null})

function test(t, res, ref) {
	for (var i=0, ks=Object.keys(ref); i<ks.length; ++i) t('===', res[ks[i]], ref[ks[i]])
}

ct('init sticky/global flags', t => {
	t('===', abcS.def.sticky, true)
	t('===', abcS.def.global, false)

	t('===', abcG.def.sticky, false)
	t('===', abcG.def.global, true)
})
ct('kin', t => {
	test(t, text.call('kin', 'abc').peek('abc'), {
		kin:'kin', i:0, txt: 'abc', j: 3, err: false
	})
	test(t, text.call('kin', /abc/).peek('abc'), {
		kin:'kin', i:0, txt: 'abc', j: 3, err: false
	})
	test(t, text.call('kin', simNoSticky).peek('abc'), {
		kin:'kin', i:0, txt: 'abc', j: 3, err: false
	})
})
ct('text string pass', t => {
	test(t, abcT.peek('abc'), {
		kin:undefined, i:0, txt: 'abc', j: 3, err: false
	})
	test(t, abcT.peek('aabc', 1), {
		kin:undefined, i:1, txt: 'abc', j: 4, err: false
	})
	test(t, text('').peek('aabc', 1), {
		kin:undefined, i:1, txt: '', j: 1, err: false
	})
})
ct('text string fail', t => {
	test(t, abcT.peek('ab'), {
		kin:undefined, i:0, txt: 'ab', j: 2, err: true
	})
	test(t, abcT.peek('aabc'), {
		kin:undefined, i:0, txt: 'aa', j: 2, err: true
	})
	test(t, abcT.peek('abc', 1), {
		kin:undefined, i:1, txt: 'b', j: 2, err: true
	})
	test(t, abcT.peek('abc', 3), {
		kin:undefined, i:3, txt: '', j: 3, err: true
	})
})
ct('text sticky pass', t => {
	test(t, abcS.peek('abc'), {
		kin:undefined, i:0, txt: 'abc', j: 3, err: false
	})
	test(t, abcS.peek('aabc', 1), {
		kin:undefined, i:1, txt: 'abc', j: 4, err: false
	})
	test(t, text(voidS).peek('aabc', 1), {
		kin:undefined, i:1, txt: '', j: 1, err: false
	})
	test(t, text(/[ ]*/).peek('a', 0), {
		i:0, txt: '', j: 0, err: false
	})
	test(t, text(/[ ]*/).peek('a', 1), {
		i:1, txt: '', j: 1, err: false
	})
})
ct('text sticky fail', t => {
	test(t, abcS.peek('ab'), {
		kin:undefined, i:0, txt: 'a', j: 1, err: true
	})
	test(t, abcS.peek('aabc'), {
		kin:undefined, i:0, txt: 'a', j: 1, err: true
	})
	test(t, abcS.peek('abc', 1), {
		kin:undefined, i:1, txt: 'b', j: 2, err: true
	})
	test(t, abcS.peek('abc', 3), {
		kin:undefined, i:3, txt: '', j: 3, err: true
	})
})
ct('text global pass', t => {
	test(t, abcG.peek('abc'), {
		kin:undefined, i:0, txt: 'abc', j: 3, err: false
	})
	test(t, abcG.peek('aabc', 1), {
		kin:undefined, i:1, txt: 'abc', j: 4, err: false
	})
	test(t, text(voidG).peek('aabc', 1), {
		kin:undefined, i:1, txt: '', j: 1, err: false
	})
})
ct('text global fail', t => {
	test(t, abcG.peek('ab'), {
		kin:undefined, i:0, txt: 'a', j: 1, err: true
	})
	test(t, abcG.peek('aabc'), {
		kin:undefined, i:0, txt: 'a', j: 1, err: true
	})
	test(t, abcG.peek('abc', 1), {
		kin:undefined, i:1, txt: 'b', j: 2, err: true
	})
	test(t, abcG.peek('abc', 3), {
		kin:undefined, i:3, txt: '', j: 3, err: true
	})
})
