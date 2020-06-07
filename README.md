<!-- markdownlint-disable MD032 MD036 MD041 -->
# pico-parse

*small PEG-style lexer and parser without pre-compilation*

[Example](#example) • [API](#api) • [License](#license)

## Example

```javascript
const {any, seq, run} = require('pico-parse')

const _ = /[ ]*/,
      integer = /[0-9]+/,
      label = /[a-zA-Z$_][a-zA-Z$_0-9]+/,
      value = any(),
      addition = seq('+', _, value),
      expression = seq(value, run( seq(_, addition) ), _)
value.add(integer, label, expression, seq('(', _, value, _, ')'))
console.log(expression.scan('11 +22'))
/*
Tree {
  i: 0,
  j: 6,
  err: false,
  add: [
    Tree { i: 0', j: 2, err: false },
    Tree { i: 2, j: 3, err: false },
    Tree { i: 3, j: 4, err: false },
    Tree { i: 4', j: 6, err: false }
  ],
  id: 'expression'
}
*/
```

## API

### Rule factories

Rules are created with the following factories

* `tok(Rule|String|RegExp) : Rule` converts a string, regular expression or other terminal to a terminal rule
* `any(...Rule|String|RegExp) : Rule` finds the first passing rule (/ operator)
* `seq(...Rule|String|RegExp) : Rule` chains all rules, all must pass
* `few(...Rule|String|RegExp) : Rule` repeat all rules one or more times (+ operator)
* `run(...Rule|String|RegExp) : Rule` repeat rules any times (* operator)
* `opt(...Rule|String|RegExp) : Rule` optional rule (? operator)
* `and(...Rule|String|RegExp) : Rule` pass if lookahead passes (& operator)
* `not(...Rule|String|RegExp) : Rule` pass if lookahead fails (! operator)

### Rule

* `.add(factoryArguments) : this` for recursive rules, allow to define a rule after it is created
* `.peek(string [, index=0]) : Tree` Used internally to parse a string at a given position
* `.scan(string) : Tree` parses the complete string
* `.box() : this` allows left-recursive rules by 'boxing' the recursive calls(fails if no recursion)

### Tree

* `.i : number` start position of the tree (same as the first contained tree)
* `.j : number` start position of the next token after the tree in the input string
* `.cuts : Array<Tree>` the sub trees
* `.err : boolean` if the result is an error
* `.fuse([transforms:Object]) : string` returns the transformed tree text after transforming the leaves
* `.fold( (target:any, item: Pack) => any, target:any) : any` fold/reduce to parse tree

## License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)
