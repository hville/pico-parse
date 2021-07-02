<!-- markdownlint-disable MD032 MD036 MD041 -->
# pico-parse

*small top-down parser combinator and [PEG](https://bford.info/pub/lang/peg.pdf)
 parser without pre-compilation*

[Example](#example) • [API](#api) • [Notes](#notes) • [License](#license)

## Example

Below is the actual code to parse [PEG](https://bford.info/pub/lang/peg.pdf) grammar

```javascript
import { seq,any,few,not } from './parsers.js'

const identifier = /[\p{ID_Start}\$_][\p{ID_Continue}\$_\u200C\u200D]*/u

const //# Lexical syntax
  _ = seq(/(?:\s*#[^\n\r]*(?:\r\n|\n|\r)+)?\s*/),
  LIT = any(seq(`'`,seq`txt`(/[^']+/),`'`), seq('"',seq`txt`(/[^"]+/),'"'), seq('’',seq`txt`(/[^’]+/),'’')), // " "/’ ’ primary 5 Literal string
  DOT = seq`reg`('.'), //. primary 5 Any character
  CHR = seq`reg`(/\[(?:(?:\\[^])|[^\]])+\]/) // [ ] primary 5 Character class

const //# Hierarchical syntax
  exp = any(),
  ID = seq`id`(identifier),
  prm = seq(any(seq('(',_, exp, _, ')'), LIT, CHR, DOT, seq(ID, _, not('<-'))), _), //Primary <- Identifier !LEFTARROW / OPEN Expression CLOSE / Literal / Class / DOT
  RUN = seq`run`(prm, '*'), //e* unary suffix 4 Zero-or-more
  OPT = seq`opt`(prm, '?'), //e? unary suffix 4 Optional
  FEW = seq`few`(prm, '+'), //e+ unary suffix 4 One-or-more
  suf = any(FEW,OPT,RUN,prm), //Suffix <- Primary (QUESTION / STAR / PLUS)?
  NOT = seq`not`('!', suf), //!e unary prefix 3 Not-predicate
  AND = seq`and`('&', suf), //&e unary prefix 3 And-predicate
  pre = any(AND,NOT,suf), //Prefix <- (AND / NOT)? Suffix
  SEQ = seq`seq`(pre, few(_, pre), _), //e1 e2 binary 2 Sequence ////Sequence <- Prefix*
  itm = any(SEQ,pre),
  ANY = seq`any`(itm, few(_, '/', _, itm)), //e1 / e2 binary 1 Prioritized Choice //Expression <- Sequence (SLASH Sequence)*
  DEF = seq`def`(ID, _, '<-', _, exp)//Definition <- Identifier LEFTARROW Expression
exp.set(ANY,itm)

const // Error Management
  Xexp = seq(_, seq`Xexp`(/[^\s]*/), _),//Grammar <- Spacing Definition+ EndOfFile
  XDEF = any`Xdef`('Xdef', seq(ID, _, '<-', _, Xexp), Xexp)//Definition <- Identifier LEFTARROW Expression

export default seq(_, any(few`peg`(DEF, _), few`Xpeg`(any(DEF,XDEF),_) ) ) //Grammar <- Spacing Definition+ EndOfFile
```

## API

### Rule factories

Rules are created with the following factories
* `any(...Rule|Array|String|RegExp) : Rule` finds the first passing rule (/ operator)
* `seq(...Rule|Array|String|RegExp) : Rule` chains all rules, all must pass
* `few(...Rule|Array|String|RegExp) : Rule` repeat all rules one or more times (+ operator)
* `run(...Rule|Array|String|RegExp) : Rule` repeat rules any times (* operator)
* `opt(...Rule|Array|String|RegExp) : Rule` optional rule (? operator)
* `and(...Rule|Array|String|RegExp) : Rule` pass if lookahead passes (& operator)
* `not(...Rule|Array|String|RegExp) : Rule` pass if lookahead fails (! operator)

Rules can have a name by calling them: `named = any.call('myname', e0, e1, ...childRules)`

Arguments
* `String` and `RegExp` arguments are converted to terminal litteral token rules

### Rule

* `.id` name, empty string by default
* `.rs` child rules
* `.peek(string, index=0) : Tree` Used internally to parse a string at a given position
* `.scan(string) : Tree` parses the complete string

### Capture Tree

The resulting tree does not hold the token, only the indices where they are found
* `tree: {i, j [, id] [, cuts]}`
* `i : number` start position of the tree
* `j : number` next position in the tree

notes
* to get the token, `source.slice(i,j)`
* unamed empty trees are removed
* unamed trees are flattened
* failed token have negative j

## Notes

* left recursion currently not supported nor prevented
* packrat memoization not yet supported
* in some cases, `String.raw` must be used to support `\\` escaped characters

## License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)
