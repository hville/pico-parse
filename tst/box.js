import test from './tester.js'
import any from '../any.js'
import seq from '../seq.js'

// E<-E1|1
var A = any()
A.add(seq(A,'1'),'1')
test(A.scan('111'))

// E<-E1|E2|1|2
var B = any()
test(B.add(seq(B,'1'), seq(B,'2'),/[12]/).scan('121'))
test(B.add(seq(B,'1'), seq(B,'2'),/[12]/).scan('212'))

// E<- 1E1|1
var C = any()
test(C.add(seq('1', C,'1'),'1').scan('111'))

// E<-E1|1|E1
var D = any()
D.add(seq(D,'1'),'1', seq(D,'1'))
test(D.scan('1111'))

//must not throw
A.scan('')
B.scan('')
C.scan('')
D.scan('')
