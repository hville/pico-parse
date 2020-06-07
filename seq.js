import {Rule, add} from './src/_rule.js'

export default function() {
	return add.apply(new Seq, arguments)
}
function Seq() {
	this.rules = []
}
Seq.prototype = new Rule(Seq)
