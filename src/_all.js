var Tree = require('./_tree'),
		Leaf = require('./_leaf'),
		Tok = require('./_tok')

module.exports = All
function All() {
	this.rules = []
}
All.prototype = {
	constructor: All,
	isRule: true,
	kin:'',
	set: function() {
		var def = this.rules,
				len = def.length = arguments.length
		for (var i=0; i<len; ++i) {
			var arg = arguments[i]
			def[i] = arg.isRule ? arg : new Tok(arg)
		}
		return this
	},
	peek: function(string, index, debug) {
		var ops = this.rules,
				tree
		if (ops.length === 1) tree = ops[0].peek(string, index, debug)
		else {
			tree = new Tree(index || 0)
			for (var i=0; i<ops.length; ++i) {
				var part = ops[i].peek(string, tree.j, debug)
				if (tree.add(part).err && !debug) break
			}
		}
		if (this.kin) tree.id = this.kin
		return tree
	},
	id: Tok.prototype.id,
	spy: Tok.prototype.spy,
	scan: function(string) {
		var res = this.peek(string, 0)
		//complete the result with a failed remaining portion
		if (res.j !== string.length) res.add(new Leaf(res.j, string.slice(res.j), true))
		return res
	},
	box: function(){
		var peek = this.peek,
				last = new Map,
				next = null
		this.peek = function(string, index) {
			var spot = index||0
			if (last.has(spot)) {
				next = last.get(spot)
				//last.delete(spot)
				return next
			}
			//console.log('opening', spot, string[spot], string.length, last.keys(), string)
			next = new Leaf(spot, '', true) //first pass fails
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
