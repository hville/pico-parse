var {any, all, rep, opt, spy, kin, few, run, and, not} = require('./index'),
		Box = require('./src/_box')
//  A finite set N of nonterminal symbols and Σ of terminal symbols disjoint from N
//  A finite set P of parsing rules
//  An expression eS termed the starting expression
//  Each parsing rule in P has the form A ← e, where A is a nonterminal symbol and e is a parsing expression
var e = new Box(any()),
		A = /[^←=<-ε/|*+?!\s\n\t]/,
		T = /'[^']*'/,
		_$ = /\s*/,
		__ = /\s+/,
		rule = all(A, _$, /[←=]|<-/, _$, e),
		line = /\s*(?:\n+|;+)\s*/,
		peg = all(_$, rule, _$, run(line,rule), _$)
//  A parsing expression e is constructed in the following fashion
//    An atomic parsing expression consists of:
//      any T terminal symbol,
//      any A nonterminal symbol, or
//      the empty string ε
var ε = ''
//    Given any existing parsing expressions e, e1, and e2, a new parsing expression can be constructed using the following operators:
//      Sequence: e1 e2
//      Ordered choice: e1 / e2
//      Zero-or-more: e*
//      One-or-more: e+
//      Optional: e?
//      And-predicate: &e
//      Not-predicate: !e
var sequence = all(e, __, e),
		orderedChoice = all(e,'/',e),
		zeroOrMore = all(e,'*'),
		oneOrMore = all(e,'+'),
		optional = all(e,'?'),
		andPredicate = all('&', e),
		notPredicate = all('!', e),
		group = all('(',e,')')
e.set(group, notPredicate, andPredicate, optional, oneOrMore, zeroOrMore, orderedChoice, A,T,ε)
console.log(e.scan(`
Expr    ← Sum
Sum     ← Product (('+' / '-') Product)*
Product ← Power (('*' / '/') Power)*
Power   ← Value ('^' Power)?
Value   ← [0-9]+ / '(' Expr ')'
`))
