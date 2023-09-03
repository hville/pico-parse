import t from 'assert-op'
import toPEG from './pegparser.js'
import $ from '../parsers.js'
import PEG from './original-peg-grammar.js'

const P = toPEG($)

t('simple terminal expressions tree', a=> {
	a`===`( P(`"a"`, {}).id, 'peg')
	a`===`( P(`'a'`, {}).id, 'peg')
	a`===`( P('/a/', {}).id, 'peg')
	a`===`( P('/a/uyg', {}).id, 'peg')
	a`===`( P('[a-z0-9]', {}).id, 'peg')
})
t('simple terminal rule tree', a=> {
	a`===`( P(`A="a"`, {}).id, 'peg')
	a`===`( P(`A='a'`, {}).id, 'peg')
	a`===`( P('A =/a/', {}).id, 'peg')
	a`===`( P('A= /a/uyg', {}).id, 'peg')
	a`===`( P('A = [a-z0-9]', {}).id, 'peg')
})
t('simple terminal rule parser', a=> {
	a`===`( P(`A="ab"`).scan('ab').j, 2)
	a`===`( P(`A='ab'`).scan('ab').j, 2)
	a`===`( P('A =/ab/').scan('ab').j, 2)
	a`===`( P('A= /ab/uyg').scan('ab').j, 2)
	a`===`( P('A = [a-z0-9]').scan('a').j, 1)
	a`===`( P(`A=("ab")`).scan('ab').j, 2)
	a`===`( P(`A=(/ab/)`).scan('ab').j, 2)
})
t('single operator rule parser', a=> {
	a`===`( P(`A="a" 'b'`).scan('ab').j, 2)
	a`===`( P(`A= /a/ 'b'`).scan('ab').j, 2)
	a`===`( P('A = (/a/) "b"').scan('ab').j, 2)
	a`===`( P('A= /a/ (/b/)').scan('ab').j, 2)
	a`===`( P('A = [a-z0-9][a-b]').scan('ab').j, 2)
})
t('multiple operator rule parser', a=> {
	a`===`( P(`A="a" B
	B='b'`).scan('ab').j, 2)
})

t('https://en.wikipedia.org/wiki/Parsing_expression_grammar#Examples', a=> {
	a`===`( P(`
	Expr    = Sum
	Sum     = Product (('+' | '-') Product)*
	Product = Power (('*' | '/') Power)*
	Power   = Value ('^' Power)?
	Value   = [0-9]+ | '(' Expr ')'
	`).scan('12^(34)*56+78').error, undefined)
})

t('https://en.wikipedia.org/wiki/Parsing_expression_grammar#Examples', a=> {
	a`===`( P(`
	Begin = '(*'
	End   = '*)'
	C     = Begin N* End
	N     = C | (!Begin !End Z)
	Z     = .
	`).error, undefined)
})

t('original peg grammar', a => {
	a`===`( P(PEG).scan(`A='a'`).j, 5)
	a`===`( P(PEG).scan(`Grammar = Spacing Definition+ EndOfFile`).error, undefined)
	//TODO peg example fails to parse self (comments)
})
