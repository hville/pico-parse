import { tok,seq,any,few,not } from './parsers.js'

//FIXME must use string.raw for the char definition AND maybe regexp is not a good idea?
const identifier = /[\p{ID_Start}\$_][\p{ID_Continue}\$_\u200C\u200D]*/u

const //# Lexical syntax
	_ = tok(/(?:\s*#[^\n\r]*(?:\r\n|\n|\r)+)?\s*/),
	LIT = any([`'`,tok.call('txt', /[^']+/),`'`], ['"',tok.call('txt', /[^"]+/),'"'], ['’',tok.call('txt', /[^’]+/),'’']), // " "/’ ’ primary 5 Literal string
	DOT = tok.call('reg', '.'), //. primary 5 Any character
	CHR = tok.call('reg', /\[(?:(?:\\[^])|[^\]])+\]/) // [ ] primary 5 Character class, TODO tricky to use regexp for this
const //# Hierarchical syntax
	exp = any(),
	ID = tok.call('id',identifier),
	prm = seq(any(['(',_, exp, _, ')'], LIT, CHR, DOT, seq(ID, _, not('<-'))), _), //Primary <- Identifier !LEFTARROW / OPEN Expression CLOSE / Literal / Class / DOT
	RUN = seq.call('run', prm, '*'), //e* unary suffix 4 Zero-or-more
	OPT = seq.call('opt', prm, '?'), //e? unary suffix 4 Optional
	FEW = seq.call('few', prm, '+'), //e+ unary suffix 4 One-or-more
	suf = any(FEW,OPT,RUN,prm), //Suffix <- Primary (QUESTION / STAR / PLUS)?
	NOT = seq.call('not', '!', suf), //!e unary prefix 3 Not-predicate
	AND = seq.call('and', '&', suf), //&e unary prefix 3 And-predicate
	pre = any(AND,NOT,suf), //Prefix <- (AND / NOT)? Suffix
	SEQ = seq.call('seq', pre, few(_, pre), _), //e1 e2 binary 2 Sequence ////Sequence <- Prefix*
	itm = any(SEQ,pre),
	ANY = seq.call('any', itm, few(_, '/', _, itm)), //e1 / e2 binary 1 Prioritized Choice //Expression <- Sequence (SLASH Sequence)*
	DEF = seq.call('def', ID, _, '<-', _, exp)//Definition <- Identifier LEFTARROW Expression
exp.rs.push(ANY,itm)

const // Error Management
	Xexp = seq(_, tok.call('Xexp',/[^\s]*/), _),//Grammar <- Spacing Definition+ EndOfFile
	XDEF = any.call('Xdef', [ID, _, '<-', _, Xexp], Xexp)//Definition <- Identifier LEFTARROW Expression

export default seq(_, any(few.call('peg',DEF, _), few.call('Xpeg',any(DEF,XDEF),_) ) ) //Grammar <- Spacing Definition+ EndOfFile
