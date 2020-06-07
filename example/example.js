const {any, seq, run} = require('../')

const _ = /[ ]*/,
			integer = /[0-9]+/,
			label = /[a-zA-Z$_][a-zA-Z$_0-9]+/,
			value = any(),
			addition = seq('+', _, value),
			expression = seq(value, run( seq(_, addition) ), _)
value.add(integer, label, expression, seq('(', _, value, _, ')'))
console.log(expression.scan('11 +22'))

