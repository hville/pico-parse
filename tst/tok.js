import t from 'assert-op'
import tok from '../tok.js'

var simNoSticky = Object.defineProperty(/abc/, 'sticky', {value: null}),
		abcT = tok('abc'),
		abcG = tok(simNoSticky),
		abcS = tok(/abc/),
		//voidS = tok(/.{0,0}/),
		voidG = Object.defineProperty(/.{0,0}/, 'sticky', {value: null})

function test(res, ref) {
	for (var i=0, ks=Object.keys(ref); i<ks.length; ++i) t('===', res[ks[i]], ref[ks[i]])
}

// init sticky/global flags
test(simNoSticky, {sticky:null})
test(abcG.term, {sticky:false, global:true})

test(/abc/, {sticky:false, global:false})
test(abcS.term, {sticky:true, global:false})

// name
test(tok('abc').id('kin').peek('abc', 0), {id:'kin', i:0, txt: 'abc', j: 3, err: 0})
test(tok(/abc/).id('kin').peek('abc', 0), {id:'kin', i:0, txt: 'abc', j: 3, err: 0})
test(tok(simNoSticky).id('kin').peek('abc', 0), {id:'kin', i:0, txt: 'abc', j: 3, err: 0})
test(tok(tok(simNoSticky).id('kin')).id('KIN').peek('abc', 0), {id:'KIN', i:0, txt: 'abc', j: 3, err: 0})

// tok string pass
test(abcT.scan('abc'), {id:'', i:0, txt: 'abc', j: 3, err: 0})
test(abcT.peek('aabc', 1), {id:'', i:1, txt: 'abc', j: 4, err: 0})
test(tok('').peek('aabc', 1), {id:'', i:1, txt: '', j: 1, err: 0})
// tok string fail
test(abcT.peek('ab', 0), {id:'', i:0, txt: 'ab', j: 2, err: 1})
test(abcT.peek('aabc', 0), {id:'', i:0, txt: 'a', j: 1, err: 1})
test(abcT.scan('aabc'), {id:'', i:0, j: 4, err: 1})
test(abcT.peek('abc', 1), {id:'', i:1, txt: '', j: 1, err: 1})
test(abcT.peek('abc', 3), {id:'', i:3, txt: '', j: 3, err: 1})
// tok sticky pass
test(abcS.scan('abc'), {id:'', i:0, txt: 'abc', j: 3, err: 0})
test(abcS.peek('aabc', 1), {id:'', i:1, txt: 'abc', j: 4, err: 0})
test(tok(/[ ]*/).peek('a', 0), {i:0, txt: '', j: 0, err: 0})
test(tok(/[ ]*/).peek('a', 1), {i:1, txt: '', j: 1, err: 0})
// tok sticky fail
test(abcS.peek('ab', 0), {id:'', i:0, txt: 'a', j: 1, err: 1})
test(abcS.peek('aabc', 0), {id:'', i:0, txt: 'a', j: 1, err: 1})
test(abcS.peek('abc', 1), {id:'', i:1, txt: 'b', j: 2, err: 1})
test(abcS.peek('abc', 3), {id:'', i:3, txt: '', j: 3, err: 1})
// tok global pass
test(abcG.peek('abc', 0), {id:'', i:0, txt: 'abc', j: 3, err: 0})
test(abcG.peek('aabc', 1), {id:'', i:1, txt: 'abc', j: 4, err: 0})
test(tok(voidG).peek('aabc', 1), {id:'', i:1, txt: '', j: 1, err: 0})
// tok global fail
test(abcG.peek('ab', 0), {id:'', i:0, txt: 'a', j: 1, err: 1})
test(abcG.peek('aabc', 0), {id:'', i:0, txt: 'a', j: 1, err: 1})
test(abcG.peek('abc', 1), {id:'', i:1, txt: 'b', j: 2, err: 1})
test(abcG.peek('abc', 3), {id:'', i:3, txt: '', j: 3, err: 1})
// rename
var subT = abcT.id('subT'),
		subS = abcS.id('subS')
test(subT.scan('abc'), {id:'subT', i:0, txt: 'abc', j: 3, err: 0})
test(subS.scan('abc'), {id:'subS', i:0, txt: 'abc', j: 3, err: 0})
// spy
function cb(res) {
	res.txt = res.txt.toUpperCase()
	res.id = this.constructor.name
	return res
}
test(tok('abc').spy(cb).peek('abc', 0), {id:'Tok', i:0, txt:'ABC', j: 3, err: 0})
