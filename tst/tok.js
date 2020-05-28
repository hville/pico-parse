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
test(tok('abc').peek('abc', 0), {i:0, j: 3, err: false})
test(tok(/abc/).peek('abc', 0), {i:0, j: 3, err: false})
test(tok(simNoSticky).peek('abc', 0), {i:0, j: 3, err: false})

// tok string pass
test(abcT.scan('abc'), {i:0, j: 3, err: false})
test(abcT.peek('aabc', 1), {i:1, j: 4, err: false})
test(tok('').peek('aabc', 1), {i:1, j: 1, err: false})
// tok string fail
test(abcT.peek('ab', 0), {i:0, j: 2, err: true})
test(abcT.peek('aabc', 0), {i:0, j: 2, err: true})
test(abcT.scan('aabc'), {i:0, j: 4, err: true})
test(abcT.peek('abc', 1), {i:1, j: 2, err: true})
// tok sticky pass
test(abcS.scan('abc'), {i:0, j: 3, err: false})
test(abcS.peek('aabc', 1), {i:1, j: 4, err: false})
test(tok(/[ ]*/).peek('a', 0), {i:0, j: 0, err: false})
// tok sticky fail
test(abcS.peek('ab', 0), {i:0, j: 1, err: true})
test(abcS.peek('aabc', 0), {i:0, j: 1, err: true})
test(abcS.peek('abc', 1), {i:1, j: 2, err: true})
// tok global pass
test(abcG.peek('abc', 0), {i:0, j: 3, err: false})
test(abcG.peek('aabc', 1), {i:1, j: 4, err: false})
test(tok(voidG).peek('aabc', 1), {i:1, j: 1, err: false})
// tok global fail
test(abcG.peek('ab', 0), {i:0, j: 1, err: true})
test(abcG.peek('aabc', 0), {i:0, j: 1, err: true})
test(abcG.peek('abc', 1), {i:1, j: 2, err: true})
// rename
var subT = abcT,
		subS = abcS
test(subT.scan('abc'), {i:0, j: 3, err: false})
test(subS.scan('abc'), {i:0, j: 3, err: false})
// spy
function cb(str, pos, res) {
	res.txt = (''+res).toUpperCase()
	res.id = this.constructor.name
}
test(tok('abc').spy(null, cb).peek('abc', 0), {id:'Tok', i:0, txt:'ABC', j: 3, err: false})
