import $ from './parsers.js'
/*
TODO standardize
https://www.python.org/dev/peps/pep-0617/#the-new-proposed-peg-parser
	S: 't' | X { action }
https://github.com/pegjs/pegjs/tree/master/docs/grammar
	S= 't' / left:multiplicative "+" right:additive { return left + right; }
*/

//# helpers
const identifier = /[\p{ID_Start}\$_][\p{ID_Continue}\$_\u200C\u200D]*/u

//# Lexical syntax
const
_ = /(?:\s*#[^\n\r]*(?:\r\n|\n|\r)+)?\s*/,
TXT = $`|`( // " "/’ ’ primary 5 Literal string
	$( `'`, $.lit( /(?:[^']|\\[^])+/ ), `'` ),
	$( '"', $.lit( /(?:[^"]|\\[^])+/ ), '"' ),
	$( '’', $.lit( /(?:[^’]|\\[^])+/ ), '’' )
),
DOT = $.dot( '.' ), // . primary 5 Any character
CHR = $.rng( /\[(?:(?:\\[^])|[^\]])+\]/ ), // [ ] primary 5 Character class
REG = $.reg( '/', $.lit( /(?:[^/]|\\\/)+/ ), '/', $.lit( /[^\s\/]*/ ) )

//# Hierarchical syntax
const
exp = $(),
PID = $.lit( identifier ),
prm = $( //Primary = Identifier !LEFTARROW / OPEN Expression CLOSE / Literal / Class / DOT
	$`|`($('(', _, exp, _, ')'), TXT, CHR, DOT, REG,
	$( $( PID, r=>get(r) ), _, $`!`('='))), _
),
FEW = $( prm, $.ops('+') ), //e+ unary suffix 4 One-or-more
OPT = $( prm, $.ops('?') ), //e? unary suffix 4 Optional
RUN = $( prm, $.ops('*') ), //e* unary suffix 4 Zero-or-more
suf = $`|`( FEW, OPT, RUN, prm ), //Suffix = Primary (QUESTION / STAR / PLUS)?
AND = $( $.ops('&'), suf ), //&e unary prefix 3 And-predicate
NOT = $( $.ops('!'), suf), //!e unary prefix 3 Not-predicate
GET = $( $.ops('@'), suf), //@e === (!e .)* e
KIN = $.kin( PID, _, ':', _, $`|`(AND, NOT, GET, suf) ), //TODO label global or local?
pre = $`|`(KIN, AND, NOT, GET, suf), //Prefix = (AND / NOT)? Suffix
SEQ = $.seq(pre, $`+`(_, pre) ), //e1 e2 binary 2 Sequence ////Sequence = Prefix*
itm = $`|`(SEQ, pre),
ANY = $(itm, $`+`(_, '|', _, itm), r=>$`|`(...r)), //e1 / e2 binary 1 Prioritized Choice //Expression = Sequence (SLASH Sequence)*
DEF = $(PID, _, '=', _, exp, r=>set(r[0], get(r[1])) ),//Definition = Identifier LEFTARROW Expression
// Error Management
ERR = $(/[^\s]*/, r=>(r.error = `error at ${ r.i }.`, r))

exp.reset`|`(ANY, SEQ, KIN, AND, NOT, GET, FEW, OPT, RUN, prm)

const actions = {
	lit: (r,s) => s,
	dot: () => /[^]/,
	rng: (r,s) => RegExp( s, 'uy'),
	reg: r => RegExp( r[0], [...new Set(Array.from('uy'+r[1])).values()].join('') ),
	ops: (r, s) => $([s])(...r), // TODO THIS IS WRONG... missing arguments
	kin: r=>set(r[0], get(r[1])), //TODO
	seq: r=>$(...r) //(/TODO now here/
}


// final grammar
export default $(
	_, $`|`(DEF, exp, ERR), $`*`( _, $`|`(DEF, ERR) ), _,
	r=>m.values().next()[(m.clear(), 'value')]
)
/*
			m = new Map,
			get = k => ( m.get(k) ?? m.set(k, $()).get(k) ), // create if it does not exist
			set = (k,v) => ( m.has(k) ? Object.assign(m.get(k), v) : (m.set(k,v), v) ) // do not change refs


*/
