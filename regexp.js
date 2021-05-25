//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar
//https://mathiasbynens.be/notes/reserved-keywords#ecmascript-5

export const
	identifier = /[\p{ID_Start}\$_][\p{ID_Continue}\$_\u200C\u200D]*/u,
	keywords = /break|case|catch|continue|debugger|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|this|throw|try|typeof|var|void|while|with/,
	futureReserved = /class|const|enum|export|extends|import|super|implements|interface|let|package|private|protected|public|static|yield/,
	litterals = /null|true|fales/,
	nonReserved = /NaN|Infinity|undefined|eval|arguments/,
	reserved = RegExp( [keywords, futureReserved, litterals, nonReserved].map( re => re.source ).join('|') ),
	number = /[+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:[eE][+-]?\d+)?/

export const
	ws1 = /[ \t\v\f\x20\xA0]+/,
	ws0 = /[ \t\v\f\x20\xA0]*/,
	nl1 = /[ \t\v\f\x20\xA0]*[\n\r\u2028\u2029]+[ \t\v\f\x20\xA0\n\r\u2028\u2029]*/,
	nl0 = /[ \t\v\f\x20\xA0\n\r\u2028\u2029]*/,
	ci = /\/\/[^\n\r\u2028\u2029]*/,
	cm = /\/\*[^]*?\*\//
