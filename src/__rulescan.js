var Tree = require('./_tree'),
		Leaf = require('./_leaf')

module.exports = function(string) {
	//@ts-ignore
	var res = this.peek(string, 0)
	if (res.j !== string.length) {
		if (!res.add) res = (new Tree(res.i).add(res))
		res.add(new Leaf(res.j, string.slice(res.j), true))
	}
	return res
}
