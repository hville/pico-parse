var set = require('./src/__set'),
		proto = require('./src/prototype'),
		Leaf = require('./src/_leaf')

module.exports = function() {
	return set.apply(new Box, arguments)
}
function Box() {
	this.rules = null
	this.peek = peek
	this.last = null
}
Box.prototype = proto
function peek(string, index) {
	if (this.last) return this.last              //for the repeat calls in the loop below
	var spot = index||0,
			next = this.last = new Leaf(spot, '', true), //first pass fails
			tree
	while ((tree = proto.peek.call(this, string, spot)).j > next.j) next = this.last = tree
	return (this.last = null), next
}
