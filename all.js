import {Rule, add} from './src/_rule.js'

export default function() {
	return add.apply(new All, arguments)
}
function All() {
	this.rules = []
}
All.prototype = new Rule(All)
