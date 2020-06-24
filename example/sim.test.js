import test from '../tst/tester.js'
import sim from './sim.js'

test(sim.scan('a=1'))
test(sim.scan('a=1;b=2'))
test(sim.scan('a=1;b=a'))
test(sim.scan('a=1;b=2;c=a+b'))

test(sim.scan('a:1'))
test(sim.scan('a:1;b=2'))
test(sim.scan('a=1;b:a'))
test(sim.scan('a:1;b=2;c:a+b'))

test(sim.scan('a:Math.cos(1)'))
test(sim.scan('a:Math.log(1);b=2'))
test(sim.scan('a=1;b=Math.sin(a+1)'))
test(sim.scan('a:1;b=2;c:a**b'))

test(sim.scan('a=N(1,2)'))
test(sim.scan('a=N(1,2);b=N(1,2)'))

test(sim.scan('a=N(1,2)'))
test(sim.scan('a=N(1,2);b=N(1,2,a)'))
test(sim.scan('a=N(1,2);b=N(1,2,a,0.6)'))

test(sim.scan('a=1;b=2;c=N(a,a+b);d=N(a,a+b,a,0.6)'))
test(sim.scan('a=1;b=2;c=N(a,a+b);d=N(a,a+b,a,(a+b)/b)'))

test(sim.scan('a=1;b=2;c:N(a,a+b);d:N(a,a+b,a,0.6)'))
test(sim.scan('a=1;b=2;c:N(a,a+b);d:N(a,a+b,a,(a+b)/b)'))
test(sim.scan('a=1\nb=2\nc:N(a,a+b)\nd:N(a,a+b,a,(a+b)/b)'))
test(sim.scan(`
//a=1
b=2
`))
test(sim.scan(`
a=1
b=2
c:N(a,a+b)
d:N(a,a+b,a,(a+b)/b)
e:d-c
`))

test(sim.scan('a=1+N(1,2)'))//
test(sim.scan('a=N(1,2);b=1+N(1,2,a)'))
test(sim.scan('a=N(1,2);b=+N(1,2,a,0.6)'))

test(sim.scan('a=1;b=2;c=N(a,a+b);d=N(a,a+b,1,(a+b)/b)'), {err: true}) //bad correl reference

//console.log(sim.scan('a=1+N(1,2)'))
//console.log(sim.scan('a=1;b=2;c:1+N(a,a+b);d:N(a,a+b,a,0.6)'))
