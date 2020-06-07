import t from 'assert-op'

export default function(res, ref) {
	if (ref) for (var i=0, ks=Object.keys(ref); i<ks.length; ++i) t('===', res[ks[i]], ref[ks[i]], ks[i])
	if (!ref || (ref.cuts && ref.err === undefined && ref.j === undefined)) {
		t('===', res.j, res.input.length, 'j')
		t('!', res.err, 'err')
	}
}
