var Tok = require('../src/_tok')
module.exports = {
	nl: new Tok(/[\n\r\u2028\u2029]/), //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar
	ws: new Tok(/[ \t\v\f\x20\xA0]/)
}
