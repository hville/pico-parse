var box = require('../box')

module.exports = function(rule) {
	rule.rules.forEach(check, rule)
}
function check(kid, i, set) {
	if (kid.rules) { //only non-terminal
		if (kid === this) set[i] = box(kid)
		else kid.rules.forEach(check, this)
	}
}

/* module.exports = function(rule) {
	check(rule, rule.rules)
}
function check(ref, kids) {
	for (var i=0; i<kids.length; ++i) if (kids[i].rules) { //only non-terminal
		if (kids[i] === ref) kids[i] = box(kids[i])
		else check(ref, kids[i].rules)
	}
} */
