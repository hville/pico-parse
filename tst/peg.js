import t from 'assert-op'
import peg from '../peg.js'
import PEG from '../grammar.js'

function pegTest(name, txt) {
	t(name, a => {
		const {j,id} = PEG.scan(txt)
		a`===`(j, txt.length, `parsed ${txt} until ${j}`)
		a`===`(id, 'peg', `parsed ${txt} as valid`)
	})
}

pegTest('simple <-',`
B <- A
A <- 'a'
`)
pegTest('simple ←',`
B ← A
A ← 'a'
`)
pegTest('simple =',`
B = A
A = 'a'
`)
pegTest('anonymous 1st',`
A 'x'
A = 'a'
`)
pegTest('label',`
A X:'x'
A = 'a'
`)
//https://en.wikipedia.org/wiki/Parsing_expression_grammar#Examples
pegTest('grammar #1',`
Expr    ← Sum
Sum     ← Product (('+' / '-') Product)*
Product ← Power (('*' / '/') Power)*
Power   ← Value ('^' Power)?
Value   ← [0-9]+ / '(' Expr ')'
`)

pegTest('grammar #2',`S ← 'if' C 'then' S 'else' S / 'if' C 'then' S`)

pegTest('grammar #3',`
Begin ← '(*'
End   ← '*)'
C     ← Begin N* End
N     ← C / (!Begin !End Z)
Z     ← .
`)

pegTest('grammar #4',`
S ← &(A 'c') 'a'+ B !.
A ← 'a' A? 'b'
B ← 'b' B? 'c'
`)

pegTest('original peg grammar', String.raw`# Hierarchical syntax
Grammar <- Spacing Definition+ EndOfFile
Definition <- Identifier LEFTARROW Expression
Expression <- Sequence (SLASH Sequence)*
Sequence <- Prefix*
Prefix <- (AND / NOT)? Suffix
Suffix <- Primary (QUESTION / STAR / PLUS)?
Primary <- Identifier !LEFTARROW
  / OPEN Expression CLOSE
  / Literal / Class / DOT
# Lexical syntax
Identifier <- IdentStart IdentCont* Spacing
IdentStart <- [a-zA-Z_]
IdentCont <- IdentStart / [0-9]
Literal <- [’] (![’] Char)* [’] Spacing
  / ["] (!["] Char)* ["] Spacing
Class <- ’[’ (!’]’ Range)* ’]’ Spacing
Range <- Char ’-’ Char / Char
Char <- ’\\’ [nrt’"\[\]\\]
  / ’\\’ [0-2][0-7][0-7]
  / ’\\’ [0-7][0-7]?
  / !’\\’ .
LEFTARROW <- ’<-’ Spacing
SLASH <- ’/’ Spacing
AND <- ’&’ Spacing
NOT <- ’!’ Spacing
QUESTION <- ’?’ Spacing
STAR <- ’*’ Spacing
PLUS <- ’+’ Spacing
OPEN <- ’(’ Spacing
CLOSE <- ’)’ Spacing
DOT <- ’.’ Spacing
Spacing <- (Space / Comment)*
Comment <- ’#’ (!EndOfLine .)* EndOfLine
Space <- ’ ’ / ’\t’ / EndOfLine
EndOfLine <- ’\r\n’ / ’\n’ / ’\r’
EndOfFile <- !.`)

//console.log(pa)
//console.log(pab.rs[0])
//console.log(pa.scan('a'))
//console.log(pab.scan('ab'))

t('simple peg parse', a => {
	const	pnab = peg`ab='a' 'b'`,
				pnanb = peg`ab='a' b b='b'`
	console.log(pnanb.rs[1])
	console.log(PEG.scan(`ab='a' b b='b'`))
	//a`===`(peg`'a'`.scan('a').j, 1)
	//a`===`(peg`'a' 'b'`.scan('ab').j, 2)
	//a`===`(pnab.scan('ab').j, 2)
	//a`===`(pnanb.scan('ab').j, 2)
})

//const nbr = peg`nbr <- [0-9]+`
//console.log(peg`add <- nbr nbr <- 'a'`)

const rule = peg(`
add <- nbr '+' exp
exp <- add / nbr
nbr <- [0-9]+
`)
//console.log(rule.rs[3])
//console.log(rule.scan('12+3'))

console.assert( peg(`
add <- nbr '+' exp
exp <- add / nbr
nbr <- [0-9]+
`)?.scan('12+3')?.id === 'add', 'compile PEG')
