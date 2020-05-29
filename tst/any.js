import t from 'assert-op'
import any from '../any.js'
import all from '../all.js'

function test(res, ref) {
	if (ref) for (var i=0, ks=Object.keys(ref); i<ks.length; ++i) t('===', res[ks[i]], ref[ks[i]], ks[i])
	if (!ref || (ref.err === undefined && ref.j === undefined)) {
		t('===', res.j, res.text.length, 'j')
		t('!', res.err, 'err')
	}
}

// any pass
var fail = all('X', 'Y', 'Z'),
		ab = any(fail, fail, fail, 'ab'),
		rule = any(fail, fail, fail, all(any(fail, fail, ab, 'abc')))
test(rule.peek('abc', 0), {i:0, j:2, err: false})

// any fail
fail = any('X', 'Y', 'abX')
rule = any(fail, any(fail), fail)
test(rule.peek('abcd', 0), {i:0, j:3, err: true})

// recursion

// E<-E1|1
//var A = any()
//A.set(all(A,'1'),'1')
//console.log(A.scan('111'))
//test(A.scan('111'))//
// E<-E1|E2|1|2
//var B = any()
//test(B.set(all(B,'1'), all(B,'2'),/[12]/).scan('121'))
//test(B.set(all(B,'1'), all(B,'2'),/[12]/).scan('212'))

// E<- 1E1|1
//var C = any()
//test(C.set(all('1', C,'1'),'1').scan('111'))
