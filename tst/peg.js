import t from 'assert-op'
import peg from '../peg.js'
import PEG from '../pegparser.js'


t('simple peg parse', a => {
	//a`===`(peg`'abc'`('abc').j, 3)
	a`===`(peg`'x' | 'abc'`('abc').j, 3)
	//a`===`(peg`'a' 'bc'`('abc').j, 3)
	//a`===`(peg`'a' &b 'bc'`('abc').j, 3)
	a`===`(peg`'a' 'b' 'c'`('abc').j, 3)
	console.log()
	//a`===`(peg`@'c'`('abc').j, 3)
	a`===`(peg`'a' [b] 'c'`('abc').j, 3)
	//a`===`(peg`'a' [b-c]+`('abc').j, 3)
	a`===`(peg`ab='ab' 'c'`('abc').j, 3)
	//a`===`(peg`abc='a' bc bc='b' c c='c'`('abc').j, 3)
	//a`===`(peg`abc='a'+ bc+ bc='b'+ c+ c='c'+`('abc').j, 3)
	//label
	//a`===`(peg`'a' b:'b' 'c'`('abc').j, 2)
	//a`===`(peg`'a' b:'b' 'c'`('abc').id, 'b')
})
/* t('complex peg parse', a => {
	const rule = peg`
		add = nbr '+' exp
		exp = add | nbr
		nbr = [0-9]+
	`
	//a`===`(rule('12+3').j, 4)
})
 */
