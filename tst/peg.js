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

console.assert( peg(`
add <- nbr '+' exp
exp <- add / nbr
nbr <- [0-9]+
`).scan('12+3').id === 'add', 'compile PEG')

