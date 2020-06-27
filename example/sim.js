import {seq, any, run, few, opt, tok, not} from '../index.js'
import {nb, id, nl0, nl1, ci, cm} from '../rules/js.js'

function label(obj) { //TODO implement?
	Object.keys(obj).forEach(k => obj[k].id(k))
}

//constants
const number = tok(nb),
			_ = seq(nl0, run(cm, nl0)),
			expression = seq(),
			//random objects
			range = seq(expression, _, ',', _, expression),
			dependency = seq(id, _, ',', _, expression),
			rndvar = seq(/[NLWD]/, '(', _, range, run(_, ',', _, dependency), opt(_, ',', _, id), _, ')'),
			//values
			rndval = seq('Math.random(', _, ')'),
			parameters = opt(expression, run(_, ',', _, expression)),
			mathCall = seq(seq(/Math.(?!random)/, tok(id)), '(', _, parameters, _, ')'),
			variable = seq(id, not('(')),//TODO get rid of not?
			value = seq(opt(/[+-]/, _), any(number, rndvar, mathCall, rndval, seq('(', _, expression, _, ')'), variable))
expression.add(value, run(_, /\*{1,2}|\+(?!\+)|-(?!-)|[/%]/, _, value))

//assignment
const equals = any('=', ':'),
			define = seq(variable, _, equals, _, rndvar),
			assign = seq(variable, _, equals, _, expression)

label({number, rndval, variable, rndvar, expression, equals, define, assign})

//code
const $ = any(seq(_, ';'), seq(_, ci, nl1), nl1),
			$0 = run($),
			$1 = few($),
			operation = any(define, assign),
			sim = seq($0, _, operation, run($1, _, operation), $0)

function toConst(defs) {
	return !defs.length ? '' : `const ${defs.join(',') };`
}
sim.spy(function(tree) {
	const ctx = {
		cst: new Set,
		top: [],
		mid: [],
		exp: [],
		idx: 0
	}
	tree.each(validate, ctx)
	tree.code = `${ toConst(ctx.top) }return function(){${ toConst(ctx.mid) }return{${ ctx.exp.join(',') }}}`
	tree.toFunction = function() { return new Function('{N,L,W,D}', tree.code) }
	return tree
})

export default sim
function isCst(tree, ctx) {
	switch (tree.id) {
		case 'number': return true
		case 'rndvar': case 'rndval': return false
		case 'variable': return ctx.cst.has(tree.toString())
		default:
			if (tree.cuts.length) {
				for (var i=0; i<tree.cuts.length; ++i) if (!isCst(tree.cuts[i], ctx)) return false
				return true
			}
			return false
	}
}
function validate(tree) {
	if (tree.err) return
	var kin = tree.item(0).toString(),
			ops = tree.item(1).toString(),
			val = tree.item(2)
	if (tree.id === 'define') this.top.push(kin + '=' + val)
	else { //tree.id === assign
		if(!val) console.log(tree, tree.item(0).toString(), tree.item(1).toString())
		if (isCst(val, this)) {
			this.cst.add(kin)
			this.top.push(kin + '=' + val)
		} else {
			this.mid.push(kin + '=' + val.toString(hoistRnd, this))
		}
		if (ops === ':') this.exp.push(kin)
	}
}
function hoistRnd(tree) {
	if (tree.id === 'rndvar') {
		const proxy = `_${this.idx++}`
		this.top.push(proxy + '=' + tree)
		return proxy
	}
	return tree.toString(hoistRnd)
}
