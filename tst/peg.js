import {peg} from '../index.js'
import PEG from '../grammar.js'

function pegTest(txt) {
	const tree = PEG.scan(txt)
	//console.log(peg.peek(txt))
	console.assert(tree[1]===txt.length, `parsed ${txt} until ${tree[1]}`)
	console.assert(tree[2]==='peg', `parsed ${txt} as valid`)
}

pegTest(`G <- 'a'`)

pegTest(`Grammar <- Spacing Definition+ EndOfFile
Definition <- Identifier LEFTARROW Expression`)

pegTest(`# Hierarchical syntax
Grammar <- Spacing`)

pegTest(`Primary <- Identifier !LEFTARROW / OPEN Expression CLOSE / Literal / Class / DOT`)

pegTest(String.raw`x <- [\]\\]`)
pegTest(String.raw`
Char <- [nrt’"\[\]\\]
`)

pegTest(String.raw`# Hierarchical syntax
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
`).scan('12+3')[2] === 'add', 'compile PEG')
