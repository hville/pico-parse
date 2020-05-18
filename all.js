import {All} from './src/_all.js'

export default function() {
	return All.prototype.set.apply(new All, arguments)
}
