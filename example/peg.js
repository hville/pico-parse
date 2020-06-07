import seq from '../seq.js'
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

/*
a toy peg parser
TODO allow out-of sequence rule definitions
*/

const text = any(seq('"', tok(/(?:\\"|[^"])*/).id('text'), '"'), seq('\'', tok(/(?:\\'|[^'])*/).id('text'), '\'')),
			char = tok(/\[(?:\\]|[^\]])*\]/).id('regx'),
			regx = seq('/', tok(/(?:\\\/|[^/])*/).id('regx'), '/'),
			expr = any(),
			term = any(text, regx, char, seq('(', nl0, expr, nl0, ')'), tok(id).id('x')),
			_and = seq('&', nl0, term, not(nl0, '=')).id('and'),
			_not = seq('&', nl0, term, not(nl0, '=')).id('not'),
			_opt = seq(term, nl0, '?').id('opt'),
			_few = seq(term, '+').id('few'),
			_run = seq(term, '*').id('run'),
			mods = any(_and, _not, _opt, _few, _run, term),
			_seq = seq(mods, few(any(ws1, nl1), mods, not(nl0, '='))).id('seq'),
			list = any(_seq, mods),
			_any = seq(list, few(nl0, '|', nl0, list, not(nl0, '='))).id('any'),
			defn = seq(tok(id).id('y'), nl0, '=', nl0, expr).id('defn'),
			code = seq(nl0, defn, run(nl0, defn), nl0)
expr.add(_any, list)

export default code
export {_seq, _any, _opt, _few, _run, _and, _not}

const kinds = {tok, any, seq, opt, few, run, and, not}

code.kin({
	toRule: function() {
		return this.foldl(setRule, {})
	}
})
function setRule(rules, def) {
	var name = def.item(0).text
	rules[name] = parseRule.call(rules, def.item(1)).id(name)
	return rules
}
function parseRule(item) {
	var kin = item.id,
			txt = item.text
	return kin === 'x' ? this[txt]
		: kin === 'text' ? tok(txt)
		: kin === 'regx' ? tok(new RegExp(txt))
		: kinds[kin].apply(null, item.map(parseRule, this))
}
