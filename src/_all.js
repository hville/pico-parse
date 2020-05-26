import {Leaf} from './_leaf.js'
import {Tree} from './_tree.js'
import {Tok} from './_tok.js'

export function All() {
	this.rules = []
}
All.prototype = {
	constructor: All,
	maxE: 50,
	isRule: true,
	kin:'',
	set: function() { //TODO push rule?
		var def = this.rules,
				len = def.length = arguments.length
		for (var i=0; i<len; ++i) {
			var arg = arguments[i]
			def[i] = arg.isRule ? arg : new Tok(arg)
		}
		return this
	},
	peek: peekall,
	hop: function() {
		var skip = All.prototype.set.apply(new All, arguments)
		this.peek = function(src, pos) {
			var ops = this.rules,
					tree, itm
			if (ops.length === 1) {
				tree = ops[0].peek(src, pos)
				itm = skip.peek(src, tree.j)
				if (itm.err === 0) tree.j = itm.j
			}
			else {
				tree = new Tree(pos)
				for (var i=0; i<ops.length; ++i) {
					tree.add(ops[i].peek(src, tree.j))
					itm = skip.peek(src, tree.j)
					if (itm.err === 0) tree.j = itm.j
				}
			}
			if (this.kin) tree.id = this.kin
			return tree
		}
		return this
	},
	id: Tok.prototype.id,
	spy: Tok.prototype.spy,
	scan: function(string) {
		var res = this.peek(string, 0)
		//complete the result with a failed remaining portion
		if (res.j !== string.length) res.add(new Leaf(res.j, string.slice(res.j), 1))
		return res
	},
	box: function(){
		var peek = this.peek,
				last = new Map,
				next = null
		this.peek = function(string, spot) {
			if (last.has(spot)) {
				next = last.get(spot)
				//last.delete(spot)
				return next
			}
			//console.log('opening', spot, string[spot], string.length, last.keys(), string)
			next = new Tree(spot)
			next.err = 1 //first pass fails
			last.set(spot, next)
			while (last.get(spot).j < (next = peek.call(this, string, spot)).j) last.set(spot, next)
			next = last.get(spot)
			last.delete(spot)
			//console.log('closing', spot, string[spot], string.length, last.keys(), string)
			return next
		}
		return this
	}
}
//chop(string, res) //TODO
/* function chop(src, itm) {
	if (itm.constructor === Tree) for (var i=0, a=itm.set; i<a.length; ++i) chop(src, a[i])
	else if (itm.i !== itm.j) itm.txt = src.slice(itm.i, itm.j)
}
 */
function peekall(src, pos) {
	//memoize and recursion check
	if (this._lastSrc !== src || this._lastPos !== pos) { // context changed, reset
		console.log('MEM-reset', pos, this.lastPos, src, this._lastSrc, this._lastSrc !== src || this._lastPos !== pos)
		this._lastSrc = src
		this._lastPos = pos
		this._lastRes = null
	} else if (this._lastRes === null) { // recursion is in the air
		//TODO
		console.log('MEM-unbox', pos, src)
	} else {
		console.log('MEM-recall', pos, src)
		return this._lastRes
	}

	var ops = this.rules,
			tree
	if (ops.length === 1) tree = ops[0].peek(src, pos)
	else {
		tree = new Tree(pos)
		for (var i=0; i<ops.length; ++i) tree.add(ops[i].peek(src, tree.j))
	}
	if (this.kin) tree.id = this.kin
	return this._lastRes = tree
}
