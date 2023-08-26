import Rules from './rules.js'
/*
TODO
standardize
https://www.python.org/dev/peps/pep-0617/#the-new-proposed-peg-parser
	S: 't' | X { action }
https://github.com/pegjs/pegjs/tree/master/docs/grammar
	S= 't' / left:multiplicative "+" right:additive { return left + right; }
*/

const G = new Rules
const identifier = /[\p{ID_Start}\$_][\p{ID_Continue}\$_\u200C\u200D]*/u

//# Lexical syntax
const _ = /(?:\s*#[^\n\r]*(?:\r\n|\n|\r)+)?\s*/
G.txt = G`|`(G(`'`,G(/(?:[^']|\\[^])+/),`'`), G('"',G(/(?:[^"]|\\[^])+/),'"'), G('’',G(/(?:[^’]|\\[^])+/),'’')) // " "/’ ’ primary 5 Literal string
G.dot = G('.') //. primary 5 Any character
G.chr = /\[(?:(?:\\[^])|[^\]])+\]/ // [ ] primary 5 Character class
G.reg = G( '/', G.source = /(?:[^/]|\\\/)+/, '/', G.flags = /[^\s\/]*/ )

//# Hierarchical syntax
const	prm = G(G`|`(G('(', _, G.exp, _, ')'), G.txt, G.chr, G.dot, G.reg, G(G.id, _, G`!`('='))), _), //Primary = Identifier !LEFTARROW / OPEN Expression CLOSE / Literal / Class / DOT
			suf = G`|`(G['+'], G['?'], G['*'], prm), //Suffix = Primary (QUESTION / STAR / PLUS)?
			pre = G`|`(G.kin, G['&'], G['!'], G['@'], suf), //Prefix = (AND / NOT)? Suffix
			itm = G`|`(G[' '], pre)
G.id = G(identifier)
G['*'] = G(prm, '*') //e* unary suffix 4 Zero-or-more
G['?'] = G(prm, '?') //e? unary suffix 4 Optional
G['+'] = G(prm, '+') //e+ unary suffix 4 One-or-more
G['!'] = G('!', suf) //!e unary prefix 3 Not-predicate
G['&'] = G('&', suf) //&e unary prefix 3 And-predicate
G['@'] = G('@', suf) //@e === (!e .)* e
G.kin = G(G.id, _, ':', _, G`|`(G['&'], G['!'], G['@'], suf)),
G[' '] = G(pre, G`+`(_, pre)), //e1 e2 binary 2 Sequence ////Sequence = Prefix*
G['|'] = G(itm, G`+`(_, '|', _, itm)), //e1 / e2 binary 1 Prioritized Choice //Expression = Sequence (SLASH Sequence)*
G.def = G(G.id, _, '=', _, G.exp)//Definition = Identifier LEFTARROW Expression
G.exp = G`|`(G['|'], G[' '], G.kin, G['&'], G['!'], G['@'], G['+'], G['?'], G['*'], prm)

// Error Management
G.Xexp = /[^\s]*/
G.Xdef = G`|`( G(G.id, _, '=', _, G.Xexp), G.Xexp )

// final grammar
export default G(_, G`|`(
	G.peg = G`|`( G`+`(G.def, _), G(G`|`(G.def, G.exp), _, G`*`(G.def, _)) ),
	G.Xpeg = G`+`( G`|`(G.def, G.Xdef, G.exp), _ )
) ) //Grammar = Spacing Definition+ EndOfFile
