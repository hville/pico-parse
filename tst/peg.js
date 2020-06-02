import test from './tester.js'
import peg from '../example/peg.js'

test(peg.scan('x=y'))
test(peg.scan('x = "y"'))
test(peg.scan('x = /y/'))
test(peg.scan('x = [y]'))
test(peg.scan('x = (/y/)'))

test(peg.scan('x = y z'))
test(peg.scan('x = (y) z'))
test(peg.scan('x = y (z)'))

test(peg.scan('x = y|z'))
test(peg.scan('x =y "a"\nz= a'))

test(peg.scan('x =y "a"\nz= a'))
test(peg.scan('x = y "a"'))
test(peg.scan('z = (x | /a/) [b]'))
test(peg.scan('x = y "a"\nz = (x | /a/) [b]'))
test(peg.scan(`
x = y "a"
z = (x | /a/) [b]
`))
test(peg.scan('x = (((a) b) c) d (e (f (g)))'))
console.log(peg.scan(`
x = y "a"
z = (x | /a/) [b]
`))

