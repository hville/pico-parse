import {set, peek, spy, scan} from './src/proto.js'

export default function() {
	return set.apply(new Err, arguments)
}
function Err() {
	this.rules = []
}
Err.prototype.set = set
Err.prototype.scan = scan
Err.prototype.spy = spy
Err.prototype.peek = function(text, pos) {
	var res = peek.call(this, text, pos)
	res.err = true //TODO if an error is returned, the parsing still stops how useful is that?
	return res
}
