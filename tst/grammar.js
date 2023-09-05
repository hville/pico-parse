import { Grammar, default as $ } from '../parser.js'
import test from 'assert-op'

test(`grammar`, a => {
	const G = new Grammar
	G.w = $( G.x, G.z, G.y )
	G.x = 'x'
	G.y = /y/
	G.z = $('z')
	a`===`( G[Object.keys(G)[0]], G.w )
	a`===`( G.w.scan('xzy').j, 3 )
})

