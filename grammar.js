import { seq,any,few,not } from './parsers.js'
/*
TODO
standardize
https://www.python.org/dev/peps/pep-0617/#the-new-proposed-peg-parser
	S: 't' | X { action }
https://github.com/pegjs/pegjs/tree/master/docs/grammar
	S= 't' / left:multiplicative "+" right:additive { return left + right; }
*/

const identifier = /[\p{ID_Start}\$_][\p{ID_Continue}\$_\u200C\u200D]*/u

const //# Lexical syntax
	_ = seq(/(?:\s*#[^\n\r]*(?:\r\n|\n|\r)+)?\s*/),
	set = seq(/[=:←]|(?:<-)/),
	sep = seq(/[|\/]/),
	LIT = any(seq(`'`,seq`txt`(/(?:[^']|\\[^])+/),`'`), seq('"',seq`txt`(/(?:[^"]|\\[^])+/),'"'), seq('’',seq`txt`(/(?:[^’]|\\[^])+/),'’')), // " "/’ ’ primary 5 Literal string
	DOT = seq`reg`('.'), //. primary 5 Any character
	CHR = seq`reg`(/\[(?:(?:\\[^])|[^\]])+\]/) // [ ] primary 5 Character class

const //# Hierarchical syntax
	exp = any(),
	ID = seq`id`(identifier),
	prm = seq(any(seq('(',_, exp, _, ')'), LIT, CHR, DOT, seq(ID, _, not(set))), _), //Primary <- Identifier !LEFTARROW / OPEN Expression CLOSE / Literal / Class / DOT
	RUN = seq`run`(prm, '*'), //e* unary suffix 4 Zero-or-more
	OPT = seq`opt`(prm, '?'), //e? unary suffix 4 Optional
	FEW = seq`few`(prm, '+'), //e+ unary suffix 4 One-or-more
	suf = any(FEW,OPT,RUN,prm), //Suffix <- Primary (QUESTION / STAR / PLUS)?
	NOT = seq`not`('!', suf), //!e unary prefix 3 Not-predicate
	AND = seq`and`('&', suf), //&e unary prefix 3 And-predicate
	pre = any(AND,NOT,suf), //Prefix <- (AND / NOT)? Suffix
	SEQ = seq`seq`(pre, few(_, pre), _), //e1 e2 binary 2 Sequence ////Sequence <- Prefix*
	itm = any(SEQ,pre),
	ANY = seq`any`(itm, few(_, sep, _, itm)), //e1 / e2 binary 1 Prioritized Choice //Expression <- Sequence (SLASH Sequence)*
	DEF = seq`def`(ID, _, set, _, exp)//Definition <- Identifier LEFTARROW Expression
exp.set(ANY,itm)

const // Error Management
	Xexp = seq(_, seq`Xexp`(/[^\s]*/), _),//Grammar <- Spacing Definition+ EndOfFile
	XDEF = any`Xdef`('Xdef', seq(ID, _, set, _, Xexp), Xexp)//Definition <- Identifier LEFTARROW Expression

export default seq(_, any(few`peg`(DEF, _), few`Xpeg`(any(DEF,XDEF),_) ) ) //Grammar <- Spacing Definition+ EndOfFile
