import test from './tester.js'
import all from '../all.js'
import any from '../any.js'
import run from '../run.js'
import few from '../few.js'
import opt from '../opt.js'
import and from '../and.js'
import not from '../not.js'
import tok from '../tok.js'
import {nb} from '../rules/js.js'
import {id} from '../rules/js.js'
import {nl0} from '../rules/js.js'
import {nl1} from '../rules/js.js'
import {ws0} from '../rules/js.js'
import {ws1} from '../rules/js.js'

function toRule(res, itm, idx) {

}

const name = tok(id),
			text = any(all('"', /(?:\\"|[^"])*/,'"'), all('\'', /(?:\\'|[^'])*/,'\'')),
			char = all('[', /(?:\\]|[^\]])*/,']'),
			rexp = all('/', /(?:\\\/|[^/])*/,'/'),
			expr = any(),
			rule = any(text, rexp, char, all('(', nl0, expr, nl0, ')'), name),
			_all = all(rule, few(any(ws1, nl1), rule, not(nl0, '='))).kin(),
			_any = all(rule, few(nl0, '|', nl0, rule, not(nl0, '='))),
			_opt = all(rule, nl0, '?'),
			_few = all(rule, nl0, '+'),
			_run = all(rule, nl0, '*'),
			_and = all('&', nl0, rule, not(nl0, '=')),
			_not = all('&', nl0, rule, not(nl0, '=')),
			equl = all(name, nl0, '=', nl0, expr),
			gram = all(equl, run(nl1, equl)),
			code = all(nl0, gram, nl0)
expr.add(_and, _not, _opt, _few, _run, _all, _any, rule)

test(text.peek('"xyz"', 0), {i:0, j:5, err: false})
test(rexp.peek('/xyz/', 0), {i:0, j:5, err: false})

test(rule.peek('"xyz"', 0), {i:0, j:5, err: false})
test(rule.peek('/xyz/', 0), {i:0, j:5, err: false})
test(rule.peek('xyz', 0), {i:0, j:3, err: false})

test(gram.scan('x=y'))
test(gram.scan('x = "y"'))
test(gram.scan('x = /y/'))
test(gram.scan('x = [y]'))
test(gram.scan('x = (/y/)'))

test(gram.scan('x = y z'))
test(gram.scan('x = (y) z'))
test(gram.scan('x = y (z)'))

test(gram.scan('x = y|z'))
test(gram.scan('x =y "a"\nz= a'))

test(code.scan('x =y "a"\nz= a'))
test(code.scan('x = y "a"'))
test(code.scan('z = (x | /a/) [b]'))
test(code.scan('x = y "a"\nz = (x | /a/) [b]'))
test(code.scan(`
x = y "a"
z = (x | /a/) [b]
`))
test(gram.scan('x = (((a) b) c) d (e (f (g)))'))
