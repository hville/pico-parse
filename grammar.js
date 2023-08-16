import { seq,any,few,not,run } from './parsers.js'
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
	LIT = any(seq(`'`,seq`txt`(/(?:[^']|\\[^])+/),`'`), seq('"',seq`txt`(/(?:[^"]|\\[^])+/),'"'), seq('’',seq`txt`(/(?:[^’]|\\[^])+/),'’')), // " "/’ ’ primary 5 Literal string
	DOT = seq`dot`('.'), //. primary 5 Any character
	CHR = seq`reg`(/\[(?:(?:\\[^])|[^\]])+\]/), // [ ] primary 5 Character class
	REG = seq('/', seq`reg`(/(?:[^/]|\\\/)+/), '/') //TODO add flags!

const //# Hierarchical syntax
	exp = any(),
	IDK = seq`idk`(identifier),
	IDV = seq`idv`(identifier),
	prm = seq(any(seq('(',_, exp, _, ')'), LIT, CHR, DOT, REG, seq(IDV, _, not('='))), _), //Primary = Identifier !LEFTARROW / OPEN Expression CLOSE / Literal / Class / DOT
	RUN = seq`run`(prm, '*'), //e* unary suffix 4 Zero-or-more
	OPT = seq`opt`(prm, '?'), //e? unary suffix 4 Optional
	FEW = seq`few`(prm, '+'), //e+ unary suffix 4 One-or-more
	suf = any(FEW,OPT,RUN,prm), //Suffix = Primary (QUESTION / STAR / PLUS)?
	NOT = seq`not`('!', suf), //!e unary prefix 3 Not-predicate
	AND = seq`and`('&', suf), //&e unary prefix 3 And-predicate
	GET = seq`get`('@', suf), //@e === (!e .)* e
	KIN = seq`kin`(IDK, _, ':', _, any(AND,NOT,GET,suf)),
	pre = any(KIN,AND,NOT,GET,suf), //Prefix = (AND / NOT)? Suffix
	SEQ = seq`seq`(pre, few(_, pre)), //e1 e2 binary 2 Sequence ////Sequence = Prefix*
	itm = any(SEQ,pre),
	ANY = seq`any`(itm, few(_, '|', _, itm)), //e1 / e2 binary 1 Prioritized Choice //Expression = Sequence (SLASH Sequence)*
	DEF = seq`def`(IDV, _, '=', _, exp)//Definition = Identifier LEFTARROW Expression
Object.assign(exp, any(ANY,SEQ,KIN,AND,NOT,GET,FEW,OPT,RUN,prm))

const // Error Management
	Xexp = seq(_, seq`Xexp`(/[^\s]*/), _),//Grammar = Spacing Definition+ EndOfFile
	XDEF = any`Xdef`('Xdef', seq(IDV, _, '=', _, Xexp), Xexp)//Definition = Identifier LEFTARROW Expression

export default seq(_, any(
	few`peg`(DEF, _),
	seq`peg`(any(DEF,exp), _, run(DEF, _)),
	few`Xpeg`(any(DEF,XDEF,exp),_)
) ) //Grammar = Spacing Definition+ EndOfFile
