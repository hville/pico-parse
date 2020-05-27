const {any, all, run} = require('../')

const _ = /[ ]*/,
			integer = /[0-9]+/,
			label = /[a-zA-Z$_][a-zA-Z$_0-9]+/,
			value = any(),
			addition = all('+', _, value),
			expression = all(value, run( all(_, addition) ), _)
value.set(integer, label, expression, all('(', _, value, _, ')'))
console.log(expression.scan('11 +22'))

