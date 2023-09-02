import t from 'assert-op'
import P from './pegparser.js'

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

//console.log( P(`(/a/ )`, {}) )
//console.log(P(`A="a"`).scan('a'))
/* t('simple terminal expressions tree', a=> {
	a`===`( P(`"A=a"`), 'peg')
	a`===`( P(`A='a'`), 'peg')
	a`===`( P('A=/a/'), 'peg')
	a`===`( P('A=/a/uyg'), 'peg')
	a`===`( P('A=[a-z0-9]'), 'peg')
})
 */


//console.log('#1',PEG(`B = 'a'`, {}))

function pegTest(name, txt) {
	t(name, a => {
		const tree = PEG.peek(txt)
		//console.log(tree)
		a`===`(tree.j, txt.length, `parsed ${txt} until ${tree.j}`)
		//a`===`(id, 'peg', `parsed ${txt} as valid`)
	})
}
//pegTest('token',`B = 'a'`)

/* pegTest('simple =',`
B = A
A = 'a'
`)
 *//* pegTest('anonymous 1st',`
A 'x'
A = 'a'
`)

//https://en.wikipedia.org/wiki/Parsing_expression_grammar#Examples
pegTest('grammar #1',`
Expr    = Sum
Sum     = Product (('+' | '-') Product)*
Product = Power (('*' | '/') Power)*
Power   = Value ('^' Power)?
Value   = [0-9]+ | '(' Expr ')'
`)

pegTest('grammar #2',`S = 'if' C 'then' S 'else' S | 'if' C 'then' S`)

pegTest('grammar #3',`
Begin = '(*'
End   = '*)'
C     = Begin N* End
N     = C | (!Begin !End Z)
Z     = .
`)

pegTest('grammar #4',`
S = &(A 'c') 'a'+ B !.
A = 'a' A? 'b'
B = 'b' B? 'c'
`)

pegTest('original peg grammar', String.raw`# Hierarchical syntax
Grammar = Spacing Definition+ EndOfFile
Definition = Identifier LEFTARROW Expression
Expression = Sequence (SLASH Sequence)*
Sequence = Prefix*
Prefix = (AND | NOT)? Suffix
Suffix = Primary (QUESTION | STAR | PLUS)?
Primary = Identifier !LEFTARROW
  | OPEN Expression CLOSE
  | Literal | Class | DOT
# Lexical syntax
Identifier = IdentStart IdentCont* Spacing
IdentStart = [a-zA-Z_]
IdentCont = IdentStart | [0-9]
Literal = [’] (![’] Char)* [’] Spacing
  | ["] (!["] Char)* ["] Spacing
Class = ’[’ (!’]’ Range)* ’]’ Spacing
Range = Char ’-’ Char | Char
Char = ’\\’ [nrt’"\[\]\\]
  | ’\\’ [0-2][0-7][0-7]
  | ’\\’ [0-7][0-7]?
  | !’\\’ .
LEFTARROW = ’=’ Spacing
SLASH = ’/’ Spacing
AND = ’&’ Spacing
NOT = ’!’ Spacing
QUESTION = ’?’ Spacing
STAR = ’*’ Spacing
PLUS = ’+’ Spacing
OPEN = ’(’ Spacing
CLOSE = ’)’ Spacing
DOT = ’.’ Spacing
Spacing = (Space | Comment)*
Comment = ’#’ (!EndOfLine .)* EndOfLine
Space = ’ ’ | ’\t’ | EndOfLine
EndOfLine = ’\r\n’ | ’\n’ | ’\r’
EndOfFile = !.`)

 */



/* t('simple peg parse', a => {
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
}) */
/* t('complex peg parse', a => {
	const rule = peg`
		add = nbr '+' exp
		exp = add | nbr
		nbr = [0-9]+
	`
	//a`===`(rule('12+3').j, 4)
})
 */
