import t from './tester.js'
import {seq} from '../index.js'

const abcT = seq('abc'),
			abcR = seq`r`(/abc/)

// name
t(seq('abc').peek('abc', 0), [0,3])
t(seq(/abc/).peek('abc', 0), [0,3])

// seq string pass
t(abcT.scan('abc'), [0,3])
t(abcT.peek('aabc', 1), [1,4])
t(seq('').peek('aabc', 1), [1,1])
// seq string fail
t(abcT.peek('ab', 0), [0,-1])
t(abcT.peek('aabc', 0), [0,-1])
t(abcT.scan('aabc'), [0,-1])
t(abcT.peek('abc', 1), [1,-1])
// seq regexp pass
t(abcR.scan('abc'), [0,3,'r'])
t(abcR.peek('aabc', 1), [1,4,'r'])
t(seq(/[ ]*/).peek('a', 0), [0,0])
// seq regexp fail
t(abcR.peek('ab', 0))
t(abcR.peek('aabc', 0))
t(abcR.peek('abc', 1))
