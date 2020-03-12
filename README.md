<!-- markdownlint-disable MD032 MD036 MD041 -->
# pico-parse

*small PEG-style lexer and parser without pre-compilation*

[Example](#example) • [API](#api) • [License](#license)

## Example

```javascript
const {any, all, run} = require('pico-parse')

const _ = /[ ]*/,
      integer = /[0-9]+/,
      label = /[a-zA-Z$_][a-zA-Z$_0-9]+/,
      value = any(),
      addition = all('+', _, value),
      expression = all(value, run( all(_, addition) ), _).id('expression')
value.set(integer, label, expression, all('(', _, value, _, ')'))
console.log(expression.scan('11 +22'))
/*
Tree {
  i: 0,
  j: 6,
  err: false,
  set: [
    Leaf { i: 0, txt: '11', j: 2, err: false },
    Leaf { i: 2, txt: ' ', j: 3, err: false },
    Leaf { i: 3, txt: '+', j: 4, err: false },
    Leaf { i: 4, txt: '22', j: 6, err: false }
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
* `all(...Rule|String|RegExp) : Rule` chains all rules, all must pass
* `few(...Rule|String|RegExp) : Rule` repeat all rules one or more times (+ operator)
* `run(...Rule|String|RegExp) : Rule` repeat rules any times (* operator)
* `opt(...Rule|String|RegExp) : Rule` optional rule (? operator)
* `and(...Rule|String|RegExp) : Rule` pass if lookahead passes (& operator)
* `not(...Rule|String|RegExp) : Rule` pass if lookahead fails (! operator)

### Rule

* `.set(factoryArguments) : this` for recursive rules, allow to define a rule after it is created
* `.id(string) : this` results of this rule are given a `id` property
* `.spy( Tree|Leaf => Tree|Leaf ) : this` results of this rule are pre-processed with the given callback
* `.peek(string [, index=0]) : Tree|Leaf` Used internally to parse a string at a given position
* `.scan(string) : Tree|Leaf` parses the complete string
* `.box() : this` allows left-recursive rules by 'boxing' the recursive calls(fails if no recursion)

### Leaf

* `.id : string|undefined` optional id
* `.i : number` start position of the token in the input string
* `.j : number` start position of the next token in the input string
* `.txt : string` the substring found
* `.err : boolean` if the result is an error
* `.fuse([transforms:Object]) : string` returns the transformed token text

### Tree

* `.id : string|undefined` optional name
* `.i : number` start position of the tree (same as the first contained leaf)
* `.j : number` start position of the next token after the tree in the input string
* `.set : Array<Tree|Leaf>` the sub trees and leafs
* `.err : boolean` if the result is an error
* `.fuse([transforms:Object]) : string` returns the transformed tree text after transforming the leaves
* `.fold( (target:any, item: Pack|Leaf) => any, target:any) : any` fold/reduce to parse tree

## License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)
