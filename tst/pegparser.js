export default $ => {
//# helpers
const identifier = /[\p{ID_Start}\$_][\p{ID_Continue}\$_\u200C\u200D]*/u

//# Lexical syntax
const
_ = /(?:\s*#[^\n\r]*(?:\r\n|\n|\r)+)?\s*/,
TXT = $`|`( // " ' primary 5 Literal string
	$( `'`, $.lit( /(?:[^']|\\[^])+/ ), `'` ),
	$( '"', $.lit( /(?:[^"]|\\[^])+/ ), '"' )
),
DOT = $.dot( '.' ), // . primary 5 Any character
CHR = $.rng( /\[(?:(?:\\[^])|[^\]])+\]/ ), // [ ] primary 5 Character class
REG = $.reg( '/', $.lit( /(?:[^/]|\\\/)+/ ), '/', $.lit`?`( /[a-z]*/ ) )

//# Hierarchical syntax
const
exp = $`|`(),
PID = $.lit( identifier ),
VAR = $( $.ref( PID ), _, $`!`('=') ),
prm = $`|`( $('(', _, exp, _, ')'), TXT, CHR, DOT, REG, VAR ), //Primary = Identifier !LEFTARROW / OPEN Expression CLOSE / Literal / Class / DOT
FEW = $.ops( prm, $.fcn('+') ), //e+ unary suffix 4 One-or-more
OPT = $.ops( prm, $.fcn('?') ), //e? unary suffix 4 Optional
RUN = $.ops( prm, $.fcn('*') ), //e* unary suffix 4 Zero-or-more
suf = $`|`( FEW, OPT, RUN, prm ), //Suffix = Primary (QUESTION / STAR / PLUS)?
AND = $.ops( $.fcn('&'), suf ), //&e unary prefix 3 And-predicate
NOT = $.ops( $.fcn('!'), suf), //!e unary prefix 3 Not-predicate
GET = $.ops( $.fcn('@'), suf), //@e === (!e .)* e
pre = $`|`(AND, NOT, GET, suf), //Prefix = (AND / NOT)? Suffix
SEQ = $.seq(pre, $`+`(_, pre) ), //e1 e2 binary 2 Sequence ////Sequence = Prefix*
itm = $`|`(SEQ, pre),
ANY = $.any(itm, $`+`(_, '|', _, itm) ), //e1 / e2 binary 1 Prioritized Choice //Expression = Sequence (SLASH Sequence)*
DEF = $.def(PID, _, '=', _, exp ),//Definition = Identifier LEFTARROW Expression
// Error Management
ERR = $.err( /[^\s]+/ ),
// final grammar
PEG = $.peg( _, $`|`(DEF, exp, ERR), $`*`( _, $`|`(DEF, ERR) ), _ )

exp.set(ANY, SEQ, AND, NOT, GET, FEW, OPT, RUN, prm)

const m = new Map // memory to store PEG references before being declared

const acts = {
	lit: (r,s) => s,
	dot: () => /[^]/,
	rng: (r,s) => RegExp( s, 'uy'),
	reg: r => RegExp( r[0], r[1] ? [...new Set(Array.from('uy'+r[1])).values()].join('') : 'uy' ),
	fcn: (r, s) => $([s]),
	ops: r => typeof r[0] === 'function' ? r.shift()(...r) : r.pop()(...r),
	seq: r => $(...r),
	any: r => $`|`(...r),
	def: ([k,v]) => { // do not change refs,
		if (!v.peek) v = $(v)
		v.id = k
		if (m.has(k)) {
			v = Object.assign( m.get(k), v )
			m.delete(k)
		}
		m.set(k, v)
		return v
	},
	ref: r => m.get(r[0]) ?? m.set(r[0], $()).get(r[0]), // create if it does not exist
	err: r =>(r.error = `error at ${ r.i }.`, r),
	peg: () => m.values().next()[(m.clear(), 'value')]
}

return (source, actions=acts) => PEG.scan(source, actions)
}
