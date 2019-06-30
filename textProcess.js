const preprocess = query => {
  return query
    .toLowerCase()
    .replace(/(ões|ães|ãos)$/, 'ão')
    .replace(/([aeiou])is$/, '$1l')
    .replace(/éis$/, 'el')
    .replace(/ns$/, 'm')
}

const postprocess = query => {
  return query
    .toLowerCase()
    .replace(/([rsz])es$/, '$1')
    .replace(/(os|a|as)$/, 'o')
}

module.exports = { preprocess, postprocess }
