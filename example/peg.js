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

const text = any(all('"', tok(/(?:\\"|[^"])*/).id('text'), '"'), all('\'', tok(/(?:\\'|[^'])*/).id('text'), '\'')),
			char = tok(/\[(?:\\]|[^\]])*\]/).id('regx'),
			regx = all('/', tok(/(?:\\\/|[^/])*/).id('regx'), '/'),
			expr = any(),
			rule = any(expr, text, regx, char, all('(', nl0, expr, nl0, ')'), tok(id).id('x')),
			_all = all(rule, few(any(ws1, nl1), rule, not(nl0, '='))).id('all'),
			_any = all(rule, few(nl0, '|', nl0, rule, not(nl0, '='))).id('any'),
			_opt = all(rule, nl0, '?').id('opt'),
			_few = all(rule, '+').id('few'),
			_run = all(rule, '*').id('run'),
			_and = all('&', nl0, rule, not(nl0, '=')).id('and'),
			_not = all('&', nl0, rule, not(nl0, '=')).id('not'),
			defn = all(tok(id).id('y'), nl0, '=', nl0, expr).id('defn'),
			code = all(nl0, defn, run(nl0, defn), nl0)
expr.add(_and, _not, _opt, _few, _run, _all, _any, rule)

export default code

const kinds = {tok, not, any, all, opt, few, run, and, not}

code.kin({
	toRule: function() {
		return this.foldl(setRule, {})
	}
})
function setRule(rules, def) {
	var name = ''+def.item(0)
	rules[name] = parseRule.call(rules, def.item(1)).id(name)
	return rules
}
function parseRule(item) {
	var kin = item.id
	return kin === 'x' ? this[''+item]
		: kin === 'text' ? tok(''+item)
		: kin === 'regx' ? tok(new RegExp(''+item))
		: kinds[kin](item.cuts.map(parseRule, this))
}

var tree = code.scan(`
id = /[a-z]*/
nb = [0-9]
val = nb | id
eq = id "=" (id | nb)
`)
//
//console.log(tree)
//
//

//console.log(tree.toRule().id.scan('x13'))
//console.log(tree.toRule().val.scan('0'))
console.log(tree.toRule().eq.scan('x13=0'))
