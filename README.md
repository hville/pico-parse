<!-- markdownlint-disable MD032 MD036 MD041 -->
# pico-parse

*small top-down parser combinator similar to [PEG](https://bford.info/pub/lang/peg.pdf)
 without pre-compilation*

[Example](#example) • [API](#api) • [Notes](#notes) • [License](#license)

## Example

Below is the actual code to parse [PEG](https://bford.info/pub/lang/peg.pdf) grammar

```javascript
import $ from './parser.js'
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
exp = $(),
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
ERR = $.err( /[^\s]+/ )

exp.assign( $`|`(ANY, SEQ, AND, NOT, GET, FEW, OPT, RUN, prm) )
// final grammar
export default $( _, $`|`(DEF, exp, ERR), $`*`( _, $`|`(DEF, ERR) ), _ )
```

## API

### Rule types

* $`>`(...Rule|String|RegExp) : Rule ( e0 e1 ... en )               // sequence
* $(...Rule|String|RegExp) : Rule ( e0 e1 ... en )                  // sequence, same as above
* $`|`(...Rule|String|RegExp) : Rule  ( e0 / e1 / ... / en ) // option
* $`*`(...Rule|String|RegExp) : Rule  (e0 ... en)*
* $`+`(...Rule|String|RegExp) : Rule  (e0 ... en)+
* $`?`(...Rule|String|RegExp) : Rule  (e0 ... en)?
* $`&`(...Rule|String|RegExp) : Rule  &(e0 ... en)                  // lookahead without capture
* $`!`(...Rule|String|RegExp) : Rule  !(e0 ... en)                  // lookahead without capture
* $`@`(...Rule|String|RegExp) : Rule  ( (!(e0 ... en) .)* (e0 ... en) )

`String` and `RegExp` arguments are converted to terminal litteral token rules.

### Rule ids

* $.myid`>`(...Rule|String|RegExp) : Rule with id set to myid
* $.myName(...Rule|String|RegExp) : Rule with id set to myName
* $.myid(/a/) : a terminal rule with an id

rules without ids are considered temporary constructs and are pruned from the resulting tree

### Rule Object

* `.id` name, empty string by default
* `.rs` child rules
* `.peek(string, index=0) : Tree` Used internally to parse a string at a given position
* `.scan(string, actions={}) : Tree` parses the complete string, prune branches without ids and applies actions if provided
* `.assign( rule ) : Rule` merges a rule with an existing reference for recursions

### Actions

Actions have the form { id: (tree, substring) => any } and are used to replace a branch

### Tree

The resulting tree does not hold the token, only the indices where they are found
* `tree: Array<tree>` with
  * `i : number` start position of the tree
  * `j : number` next position in the tree (length = j-i)
  * `id : string` the id of the source rule

## Notes

* left recursion currently not supported nor prevented
* packrat memoization not supported
* in some cases, `String.raw` must be used to support `\\` escaped characters
* unamed branches (no id) are removed from the tree when using `.scan` (unamed parents except the root are flattened)

## License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)
