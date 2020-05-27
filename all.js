import {set, peek, spy, scan} from './src/proto.js'

export default function() {
	return set.apply(new All, arguments)
}
function All() {
	this.rules = []
}
All.prototype = {
	constructor: All,
	maxE: 50,
	set: set,
	peek: peek,
	spy: spy,
	scan: scan
}
