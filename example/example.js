const tok = require('../tok'),
			any = require('../any'),
			all = require('../all'),
			rep = require('../rep'),
			kin = require('../kin')

const _ = /[ ]*/,
			int = tok(/[0-9]+/),
			ids = /[a-zA-Z$_][a-zA-Z$_0-9]+/,
			val = any(),
			sum = all('+', _, val),
			exp = all(val, rep( all(_, sum) ), _)

val.set(int, ids, exp, all('(', _, val, _, ')'))
int.kin = 'myInteger'
kin({myExpression: exp})
console.log(exp.scan('11 +22')) //eslint-disable-line

