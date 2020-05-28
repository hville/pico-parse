//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar
export const ws1 = /[ \t\v\f\x20\xA0]+/
export const ws0 = /[ \t\v\f\x20\xA0]*/

export const nl1 = /[ \t\v\f\x20\xA0]*[\n\r\u2028\u2029]+[ \t\v\f\x20\xA0\n\r\u2028\u2029]*/
export const nl0 = /[ \t\v\f\x20\xA0\n\r\u2028\u2029]*/

export const ci = /\/\/[^\n\r\u2028\u2029]*/
export const cm = /\/\*[^]*?\*\//

export const int= /-?\d+/
export const flt= /-?(?:\d+\.\d*|\.\d+)(?:[eE]-?\d+)?/
export const nb= /-?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE]-?\d+)?/

export const id= /[^0-9\n\r\u2028\u2029 \t\v\f\x20\xA0`~!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/}][^\n\r\u2028\u2029 \t\v\f\x20\xA0`~!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/}]*/

//https://mathiasbynens.be/notes/reserved-keywords#ecmascript-5

/**
 * An identifier must start with $, _, or any character in the Unicode categories “Uppercase letter (Lu)”, “Lowercase letter (Ll)”, “Titlecase letter (Lt)”, “Modifier letter (Lm)”, “Other letter (Lo)”, or “Letter number (Nl)”.

The rest of the string can contain the same characters, plus any U+200C zero width non-joiner characters, U+200D zero width joiner characters, and characters in the Unicode categories “Non-spacing mark (Mn)”, “Spacing combining mark (Mc)”, “Decimal digit number (Nd)”, or “Connector punctuation (Pc)”

This effectively means that supplementary Unicode characters (e.g. 丽, i.e. U+2F800 CJK Compatibility Ideograph, which is listed in the [Lo] category) are disallowed in identifier names, as JavaScript interprets them as two individual surrogate halves (e.g. \uD87E\uDC00) which don’t match any of the allowed Unicode categories.

Another gotcha is the following:

Unicode escape sequences are also permitted in an IdentifierName, where they contribute a single character. […] A UnicodeEscapeSequence cannot be used to put a character into an IdentifierName that would otherwise be illegal.

This means that you can use var \u0061 and var a interchangeably. Similarly, since var 1 is invalid, so is var \u0031.

*
 *
 *
 *
 */