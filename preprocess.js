const preprocess = query => {
		return query
				.toLowerCase()
				.replace(/(ões|ães|ãos)$/, 'ão')
				.replace(/([aeiou])is$/, '$1l')
				.replace(/éis$/, 'el')
				.replace(/ns$/, 'm')
//				.replace(/([rsz])es$/, '$1')
}

module.exports = { preprocess }
