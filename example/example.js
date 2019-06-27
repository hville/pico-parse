const tok = require('../any'),
			any = require('../any'),
			all = require('../all'),
			rep = require('../rep')
			//spy = require('../spy')
const _ = /[ ]*/,
			int = tok.call('myInteger', /[0-9]+/),
			ids = /[a-zA-Z$_][a-zA-Z$_0-9]+/,
			val = any(),
			sum = all('+', _, val),
			exp = all.call('myExpression', val, rep( all(_, sum) ), _)
val.set(int, ids, exp, all('(', _, val, _, ')'))

console.log(exp.scan('11 +22')) //eslint-disable-line

