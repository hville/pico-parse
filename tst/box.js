import test from './tester.js'
import any from '../any.js'
import all from '../all.js'

// E<-E1|1
var A = any()
A.set(all(A,'1'),'1')
test(A.scan('111'))//

// E<-E1|E2|1|2
var B = any()
test(B.set(all(B,'1'), all(B,'2'),/[12]/).scan('121'))
test(B.set(all(B,'1'), all(B,'2'),/[12]/).scan('212'))

// E<- 1E1|1
var C = any()
test(C.set(all('1', C,'1'),'1').scan('111'))

// E<-E1|1|E1
var D = any()
D.set(all(D,'1'),'1', all(D,'1'))
test(D.scan('1111'))
