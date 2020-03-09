var ct = require('cotest'),
		tok = require('../tok')

var simNoSticky = Object.defineProperty(/abc/, 'sticky', {value: null}),
		abcT = tok('abc'),
		abcG = tok(simNoSticky),
		abcS = tok(/abc/),
		voidS = tok(/.{0,0}/),
		voidG = Object.defineProperty(/.{0,0}/, 'sticky', {value: null})

function test(t, res, ref) {
	for (var i=0, ks=Object.keys(ref); i<ks.length; ++i) t('===', res[ks[i]], ref[ks[i]])
}

ct('init sticky/global flags', t => {
	test(t, simNoSticky, {sticky:null})
	test(t, abcG.term, {sticky:false, global:true})

	test(t, /abc/, {sticky:false, global:false})
	test(t, abcS.term, {sticky:true, global:false})
})
ct('name', t => {
	test(t, tok('abc').name('kin').peek('abc'), {kin:'kin', i:0, txt: 'abc', j: 3, err: false})
	test(t, tok(/abc/).name('kin').peek('abc'), {kin:'kin', i:0, txt: 'abc', j: 3, err: false})
	test(t, tok(simNoSticky).name('kin').peek('abc'), {kin:'kin', i:0, txt: 'abc', j: 3, err: false})
	test(t, tok(tok(simNoSticky).name('kin')).name('KIN').peek('abc'), {kin:'KIN', i:0, txt: 'abc', j: 3, err: false})
})
ct('tok string pass', t => {
	test(t, abcT.scan('abc'), {kin:'', i:0, txt: 'abc', j: 3, err: false})
	test(t, abcT.peek('aabc', 1), {kin:'', i:1, txt: 'abc', j: 4, err: false})
	test(t, tok('').peek('aabc', 1), {kin:'', i:1, txt: '', j: 1, err: false})
})
ct('tok string fail', t => {
	test(t, abcT.peek('ab'), {kin:'', i:0, txt: 'ab', j: 2, err: true})
	test(t, abcT.peek('aabc'), {kin:'', i:0, txt: 'a', j: 1, err: true})
	test(t, abcT.scan('aabc'), {kin:'', i:0, j: 4, err: true})
	test(t, abcT.peek('abc', 1), {kin:'', i:1, txt: '', j: 1, err: true})
	test(t, abcT.peek('abc', 3), {kin:'', i:3, txt: '', j: 3, err: true})
})
ct('tok sticky pass', t => {
	test(t, abcS.peek('abc'), {kin:'', i:0, txt: 'abc', j: 3, err: false})
	test(t, abcS.peek('aabc', 1), {kin:'', i:1, txt: 'abc', j: 4, err: false})
	test(t, tok(/[ ]*/).peek('a', 0), {
		i:0, txt: '', j: 0, err: false
	})
	test(t, tok(/[ ]*/).peek('a', 1), {
		i:1, txt: '', j: 1, err: false
	})
})
ct('tok sticky fail', t => {
	test(t, abcS.peek('ab'), {kin:'', i:0, txt: 'a', j: 1, err: true})
	test(t, abcS.peek('aabc'), {kin:'', i:0, txt: 'a', j: 1, err: true})
	test(t, abcS.peek('abc', 1), {kin:'', i:1, txt: 'b', j: 2, err: true})
	test(t, abcS.peek('abc', 3), {kin:'', i:3, txt: '', j: 3, err: true})
})
ct('tok global pass', t => {
	test(t, abcG.peek('abc'), {kin:'', i:0, txt: 'abc', j: 3, err: false})
	test(t, abcG.peek('aabc', 1), {kin:'', i:1, txt: 'abc', j: 4, err: false})
	test(t, tok(voidG).peek('aabc', 1), {kin:'', i:1, txt: '', j: 1, err: false})
})
ct('tok global fail', t => {
	test(t, abcG.peek('ab'), {kin:'', i:0, txt: 'a', j: 1, err: true})
	test(t, abcG.peek('aabc'), {kin:'', i:0, txt: 'a', j: 1, err: true})
	test(t, abcG.peek('abc', 1), {kin:'', i:1, txt: 'b', j: 2, err: true})
	test(t, abcG.peek('abc', 3), {kin:'', i:3, txt: '', j: 3, err: true})
})
ct('rename', t => {
	var subT = abcT.name('subT'),
			subS = abcS.name('subS')
	test(t, subT.scan('abc'), {kin:'subT', i:0, txt: 'abc', j: 3, err: false})
	test(t, subS.scan('abc'), {kin:'subS', i:0, txt: 'abc', j: 3, err: false})
})
ct('spy', t => {
	function cb(res) {
		res.txt = res.txt.toUpperCase()
		res.kin = this.constructor.name
		return res
	}
	test(t, tok('abc').spy(cb).peek('abc'), {kin:'Tok', i:0, txt:'ABC', j: 3, err: false})
})
