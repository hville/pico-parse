import t from './tester.js'
import {tok} from '../index.js'

const abcT = tok('abc'),
			abcR = tok.call('r',/abc/)

// name
t(tok('abc').peek('abc', 0), [0,3])
t(tok(/abc/).peek('abc', 0), [0,3])

// tok string pass
t(abcT.scan('abc'), [0,3])
t(abcT.peek('aabc', 1), [1,4])
t(tok('').peek('aabc', 1), [1,1])
// tok string fail
t(abcT.peek('ab', 0), [0,-1])
t(abcT.peek('aabc', 0), [0,-1])
t(abcT.scan('aabc'), [0,-1])
t(abcT.peek('abc', 1), [1,-1])
// tok regexp pass
t(abcR.scan('abc'), [0,3,'r'])
t(abcR.peek('aabc', 1), [1,4,'r'])
t(tok(/[ ]*/).peek('a', 0), [0,0])
// tok regexp fail
t(abcR.peek('ab', 0))
t(abcR.peek('aabc', 0))
t(abcR.peek('abc', 1))
