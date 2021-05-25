<!-- markdownlint-disable MD032 MD036 MD041 -->
# pico-parse

*small top-down parser combinator and [PEG](https://bford.info/pub/lang/peg.pdf)
 parser without pre-compilation*

[Example](#example) • [API](#api) • [Notes](#notes) • [License](#license)

## Example

Below is the actual code to parse [PEG](https://bford.info/pub/lang/peg.pdf) grammar

```javascript
import { tok,seq,any,few,not } from './parsers.js'
import { identifier } from './regexp.js'

const //# Lexical syntax
  _ = tok(/(?:\s*#[^\n\r]*(?:\r\n|\n|\r)+)?\s*/),
  LIT = any([`'`,tok.call('txt', /[^']+/),`'`], ['"',tok.call('txt', /[^"]+/),'"'], ['’',tok.call('txt', /[^’]+/),'’']),
  DOT = tok.call('reg', '.'), // . any character
  CHR = tok.call('reg', /\[(?:(?:\\[^])|[^\]])+\]/) // [.] Character class
const //# Hierarchical syntax
  exp = any(),
  ID = tok.call('id',identifier),
  //Primary <- Identifier !LEFTARROW / OPEN Expression CLOSE / Literal / Class / DOT
  prm = seq(any(['(',_, exp, _, ')'], LIT, CHR, DOT, seq(ID, _, not('<-'))), _),
  RUN = seq.call('run', prm, '*'), //e* unary suffix Zero-or-more
  OPT = seq.call('opt', prm, '?'), //e? unary suffix Optional
  FEW = seq.call('few', prm, '+'), //e+ unary suffix One-or-more
  suf = any(FEW,OPT,RUN,prm), //Suffix <- Primary (QUESTION / STAR / PLUS)?
  NOT = seq.call('not', '!', suf), //!e unary prefix Not-predicate
  AND = seq.call('and', '&', suf), //&e unary prefix And-predicate
  pre = any(AND,NOT,suf), //Prefix <- (AND / NOT)? Suffix
  SEQ = seq.call('seq', pre, few(_, pre), _), //e1 e2 binary Sequence ////Sequence <- Prefix*
  itm = any(SEQ,pre),
  ANY = seq.call('any', itm, few(_, '/', _, itm)), //e1 / e2 binary Prioritized Choice : Expression <- Sequence (SLASH Sequence)*
  DEF = seq.call('def', ID, _, '<-', _, exp)//Definition <- Identifier LEFTARROW Expression
exp.rs.push(ANY,itm)

const // Error Management
  Xexp = seq(_, tok.call('Xexp',/[^\s]*/), _),//Grammar <- Spacing Definition+ EndOfFile
  XDEF = any.call('Xdef', [ID, _, '<-', _, Xexp], Xexp)//Definition <- Identifier LEFTARROW Expression

export default seq(_, any(few.call('peg',DEF, _), few.call('Xpeg',any(DEF,XDEF),_) ) ) //Grammar <- Spacing Definition+ EndOfFile
```

## API

### Rule factories

Rules are created with the following factories
* `tok(String|RegExp) : Rule` converts a string, regular expression or other terminal to a terminal rule
* `any(...Rule|Array|String|RegExp) : Rule` finds the first passing rule (/ operator)
* `seq(...Rule|Array|String|RegExp) : Rule` chains all rules, all must pass
* `few(...Rule|Array|String|RegExp) : Rule` repeat all rules one or more times (+ operator)
* `run(...Rule|Array|String|RegExp) : Rule` repeat rules any times (* operator)
* `opt(...Rule|Array|String|RegExp) : Rule` optional rule (? operator)
* `and(...Rule|Array|String|RegExp) : Rule` pass if lookahead passes (& operator)
* `not(...Rule|Array|String|RegExp) : Rule` pass if lookahead fails (! operator)

Rules can have a name by calling them: `named = any.call('myname', e0, e1, ...childRules)`

Arguments
* `String` and `RegExp` arguments are converted to terminal token rules (eg. `'a'` becomes `tok('a')`)
* `Array` arguments are converted to a sequence rule (eg. `['a', /b/]` becomes `seq(tok('a'), tok(/b/))`

### Rule

* `.id` name, empty string by default
* `.rs` child rules
* `.peek(string, index=0) : Tree` Used internally to parse a string at a given position
* `.scan(string) : Tree` parses the complete string

### Abstract Syntax Tree

The resulting tree does not hold the token, only the indices where they are found
* `tree: [i, j, id, ...childTrees]`
* `i : number` start position of the tree
* `j : number` next position in the tree

notes
* to get the token, `source.slice(i,j)`
* unamed empty trees are removed
* unamed trees are flattened
* failed token have negative j. A token of `[4,-1,'id']` means that at `source[4]` the rule named `id` failed

## Notes

* left recursion currently not supported nor prevented
* packrat memoization not yet supported
* in some cases, `String.raw` must be used to support `\\` escaped characters

## License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)
