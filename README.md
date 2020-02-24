<!-- markdownlint-disable MD032 MD036 MD041 -->
# pico-parse

*small PEG-style lexer and parser*

[Example](#example) • [API](#api) • [License](#license)

## Example

```javascript
const tok = require('pico-parse/tok'),
      {any, all, rep, kin, spy} = require('pico-parse')

const _ = /[ ]*/,
      int = kin('myInteger', /[0-9]+/),
      ids = /[a-zA-Z$_][a-zA-Z$_0-9]+/,
      val = any(),
      sum = all('+', _, val),
      exp = kin('myExpression', val, rep( all(_, sum) ), _)
val.set(int, ids, exp, all('(', _, val, _, ')'))
console.log(exp.scan('11 +22'))
/*
Pack {
  kin: 'myExpression',
  i: 0,
  j: 6,
  err: false,
  set:
   [ Word { i: 0, txt: '11', j: 2, err: false, kin: 'myInteger' },
     Word { i: 2, txt: ' ', j: 3, err: false },
     Word { i: 3, txt: '+', j: 4, err: false },
     Word { i: 4, txt: '22', j: 6, err: false, kin: 'myInteger' } ] }
*/
```

## API

### Rule factories

Rules are created with the following factories

* `tok(String|RegExp|Rule) : Rule` converts a string or a regular expression to a rule
* `any(...Rule|String|RegExp) : Rule` finds the first passing rule
* `all(...Rule|String|RegExp) : Rule` chains all rules
* `few(...Rule|String|RegExp) : Rule` repeat all rules one or more times (+ operator)
* `run(...Rule|String|RegExp) : Rule` repeat rules any times (* operator)
* `opt(...Rule|String|RegExp) : Rule` optional rule (? operator)
* `and(...Rule|String|RegExp) : Rule` pass if lookahead passes (& operator)
* `not(...Rule|String|RegExp) : Rule` pass if lookahead fails (! operator)
* `spy(Rule [,Function]]) : Rule` executes a callback with the result of the rule

Any rule can be named. All results of named rule will have a `kin` property with that name.
* mutate with direct assignment: `myRule.kin = 'myName'`
* new named Rule with the `kin` function `namedRule = kin('name', ...rules)`

### Rule

* `.kin : string|undefined` optional family name to be assigned to results
* `.set(factoryArguments) : this` for recursive rules, allow to define a rule after it is created
* `.peek(string [, index=0]) : Tree|Leaf` parses a substring at a given position
* `.scan(string) : Tree|Leaf` parses the given complete string

### Leaf

* `.kin : string|undefined` optional family name
* `.i : number` start position of the token in the input string
* `.j : number` start position of the next token in the input string
* `.txt : string` the substring found
* `.err : boolean` if the result is an error
* `.fuse([transforms:Object]) : string` returns the transformed token text

### Tree

* `.kin : string|undefined` optional family name
* `.i : number` start position of the tree (same as the first contained leaf)
* `.j : number` start position of the next token after the tree in the input string
* `.set : Array<Tree|Leaf>` the sub trees and leafs
* `.err : boolean` if the result is an error
* `.fuse([transforms:Object]) : string` returns the transformed tree text after transforming the leaves
* `.fold( (target:any, item: Pack|Leaf) => any, target:any) : any` fold/reduce to parse tree

## License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)
