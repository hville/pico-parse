import $ from './parsers.js'
/*
TODO standardize
https://www.python.org/dev/peps/pep-0617/#the-new-proposed-peg-parser
	S: 't' | X { action }
https://github.com/pegjs/pegjs/tree/master/docs/grammar
	S= 't' / left:multiplicative "+" right:additive { return left + right; }
*/

//# helpers
const identifier = /[\p{ID_Start}\$_][\p{ID_Continue}\$_\u200C\u200D]*/u,
			slice = (r,s)=>s.slice(r.i, r.j),
			m = new Map,
			get = k => ( m.get(k) ?? m.set(k, $()).get(k) ), // create if it does not exist
			set = (k,v) => ( m.has(k) ? Object.assign(m.get(k), v) : (m.set(k,v), v) ) // do not change refs

//# Lexical syntax
const
_ = /(?:\s*#[^\n\r]*(?:\r\n|\n|\r)+)?\s*/,
TXT = $`|`( // " "/’ ’ primary 5 Literal string
	$( `'`,$( /(?:[^']|\\[^])+/, slice ), `'` ),
	$( '"',$( /(?:[^"]|\\[^])+/, slice ), '"' ),
	$( '’',$( /(?:[^’]|\\[^])+/, slice ), '’' )
),
DOT = $( '.', ()=>/[^]/ ), //. primary 5 Any character
CHR = $( /\[(?:(?:\\[^])|[^\]])+\]/, (r,s)=>RegExp(s.slice(r.i,r.j), 'uy') ), // [ ] primary 5 Character class
REG = $( '/', $( /(?:[^/]|\\\/)+/, slice ), '/', $( /[^\s\/]*/, slice ), r=>RegExp(r[0], 'uy'+r[1]) )

//# Hierarchical syntax
const
exp = $(),
PID = $(identifier, slice),
prm = $( //Primary = Identifier !LEFTARROW / OPEN Expression CLOSE / Literal / Class / DOT
	$`|`($('(', _, exp, _, ')'), TXT, CHR, DOT, REG,
	$( $( PID, r=>get(r) ), _, $`!`('='))), _
),
FEW = $(prm, '+', r=>$`+`(...r) ), //e+ unary suffix 4 One-or-more
OPT = $(prm, '?', r=>$`?`(...r)), //e? unary suffix 4 Optional
RUN = $(prm, '*', r=>$`*`(...r)), //e* unary suffix 4 Zero-or-more
suf = $`|`(FEW, OPT, RUN, prm), //Suffix = Primary (QUESTION / STAR / PLUS)?
AND = $('&', suf, r=>$`&`(...r) ), //&e unary prefix 3 And-predicate
NOT = $('!', suf, r=>$`!`(...r)), //!e unary prefix 3 Not-predicate
GET = $('@', suf, r=>$`@`(...r)), //@e === (!e .)* e
KIN = $( PID, _, ':', _, $`|`(AND, NOT, GET, suf), r=>set(r[0], get(r[1])) ), //TODO label global or local?
pre = $`|`(KIN, AND, NOT, GET, suf), //Prefix = (AND / NOT)? Suffix
SEQ = $(pre, $`+`(_, pre), r=>$(...r)), //e1 e2 binary 2 Sequence ////Sequence = Prefix*
itm = $`|`(SEQ, pre),
ANY = $(itm, $`+`(_, '|', _, itm), r=>$`|`(...r)), //e1 / e2 binary 1 Prioritized Choice //Expression = Sequence (SLASH Sequence)*
DEF = $(PID, _, '=', _, exp, r=>set(r[0], get(r[1])) ),//Definition = Identifier LEFTARROW Expression
// Error Management
XEXP = $(/[^\s]*/, r=>new Error(`XEXP at i=${r.i}`) ),
XDEF = $(PID, _, '=', _, XEXP )

exp.reset`|`(ANY, SEQ, KIN, AND, NOT, GET, FEW, OPT, RUN, prm)

// final grammar
export default $(_, $`|`(
	$`|`( $`+`(DEF, _), $( $`|`(DEF, exp), _, $`*`(DEF, _)) ),
	$`+`( $`|`(DEF, $`|`(XDEF, XEXP), exp), _ ),
	r=>(m.clear(), r[0]) //TODO return m.values().next().value the FIRST! OR error!
) )
