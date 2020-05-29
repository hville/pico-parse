import {Rule, set} from './src/_rule.js'

export default function() {
	return set.apply(new All, arguments)
}
function All() {
	this.rules = []
}
All.prototype = new Rule(All)
