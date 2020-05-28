import t from 'assert-op'
import tok from '../tok.js'

var simNoSticky = Object.defineProperty(/abc/, 'sticky', {value: null}),
		abcT = tok('abc'),
		abcG = tok(simNoSticky),
		abcS = tok(/abc/),
		//voidS = tok(/.{0,0}/),
		voidG = Object.defineProperty(/.{0,0}/, 'sticky', {value: null})

function test(res, ref) {
	for (var i=0, ks=Object.keys(ref); i<ks.length; ++i) t('===', res[ks[i]], ref[ks[i]], ks[i])
}

// init sticky/global flags
test(simNoSticky, {sticky:null})
test(abcG.term, {sticky:false, global:true})

test(/abc/, {sticky:false, global:false})
test(abcS.term, {sticky:true, global:false})

// name
test(tok('abc').peek('abc', 0), {i:0, j: 3, err: 0})
test(tok(/abc/).peek('abc', 0), {i:0, j: 3, err: 0})
test(tok(simNoSticky).peek('abc', 0), {i:0, j: 3, err: 0})

// tok string pass
test(abcT.scan('abc'), {i:0, j: 3, err: 0})
test(abcT.peek('aabc', 1), {i:1, j: 4, err: 0})
test(tok('').peek('aabc', 1), {i:1, j: 1, err: 0})
// tok string fail
test(abcT.peek('ab', 0), {i:0, j: 2, err: 1})
test(abcT.peek('aabc', 0), {i:0, j: 2, err: 1})
test(abcT.scan('aabc'), {i:0, j: 4, err: 2})
test(abcT.peek('abc', 1), {i:1, j: 2, err: 1})
// tok sticky pass
test(abcS.scan('abc'), {i:0, j: 3, err: 0})
test(abcS.peek('aabc', 1), {i:1, j: 4, err: 0})
test(tok(/[ ]*/).peek('a', 0), {i:0, j: 0, err: 0})
// tok sticky fail
test(abcS.peek('ab', 0), {i:0, j: 1, err: 1})
test(abcS.peek('aabc', 0), {i:0, j: 1, err: 1})
test(abcS.peek('abc', 1), {i:1, j: 2, err: 1})
// tok global pass
test(abcG.peek('abc', 0), {i:0, j: 3, err: 0})
test(abcG.peek('aabc', 1), {i:1, j: 4, err: 0})
test(tok(voidG).peek('aabc', 1), {i:1, j: 1, err: 0})
// tok global fail
test(abcG.peek('ab', 0), {i:0, j: 1, err: 1})
test(abcG.peek('aabc', 0), {i:0, j: 1, err: 1})
test(abcG.peek('abc', 1), {i:1, j: 2, err: 1})
// rename
var subT = abcT,
		subS = abcS
test(subT.scan('abc'), {i:0, j: 3, err: 0})
test(subS.scan('abc'), {i:0, j: 3, err: 0})
// spy
function cb(res) {
	res.txt = (''+res).toUpperCase()
	res.id = this.constructor.name
	return res
}
test(tok('abc').spy(cb).peek('abc', 0), {id:'Tok', i:0, txt:'ABC', j: 3, err: 0})
