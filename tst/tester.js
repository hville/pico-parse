import a from 'assert-op/assert.js'

export default function(res, ref) {
	if (ref) {
		a('===', res[0], ref[0], 'i')
		a('===', res[1], ref[1], 'j')
		a('===', res[2], ref[2], 'id')
		a('===', res.length, ref.length, 'length')
	}
	if (!ref) {
		a('<', res[1], 0, 'j<0')
	}
}
