import peg from '../example/peg.js'

function t(src, tgt) {
	var tree = peg.scan(src)
	if (tree.err) throw Error('invalid PEG source: '+src)
	if (tree.toRule().y.scan(tgt).err) throw Error('invalid PEG target: '+tgt)
}
//terminal
t('y="x"', 'x')
t('y=\'x\'', 'x')
t('y=[x]', 'x')
t('y=/x/', 'x')
//spaces
t('y ="x"', 'x')
t('y= \'x\'', 'x')
t('y=[x] ', 'x')
t(' y=/x/', 'x')
//sequence
t('y=[a] [b]', 'ab')
t('y=[a-z] [A-Z] [0-9]', 'bB1')
//choice
t('y=[a] | [b] [c] | [d]', 'a')
t('y=[a] | [b] [c] | [d]', 'bc')
t('y=[a] | [b] [c] | [d]', 'd')
//non-terminal
t('n=[0-9]\ny=n+', '12')

