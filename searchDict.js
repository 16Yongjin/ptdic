const { get, post } = require('request')
const { promisify } = require('util')
const _ = require('partial-js')
const verbRoots = require('./verbRoots.json')
const { preprocess } = require('./preprocess')
const [getAsync, postAsync] = [get, post].map(promisify)
const fetchJson = uri => getAsync({ uri, json: true }).then(_.sel('body'))
const decentDictTypes = [
  '한국외국어대학교 지식출판원 한국어 포르투갈어 사전',
  '성안당 한포사전',
  '성안당 포한사전'
]

const splitString = mark => str => str.split(mark)
const stripHTMLTag = str => str.replace(/<(?:.|\n)*?>/gm, '')

const isDecentDict = dictType => decentDictTypes.includes(dictType)
const exist = x => !!x.length && x

const toAscii = {
  à: 'a',
  á: 'a',
  â: 'a',
  ã: 'a',
  ç: 'c',
  é: 'e',
  ê: 'e',
  í: 'i',
  ó: 'o',
  ô: 'o',
  õ: 'o',
  ú: 'u',
  ü: 'u'
}

const toNormalForm = str => str.replace(/[àáâãçéêíóôõúü]/gi, c => toAscii[c])

const extractEntryIds = query =>
  _.pipe(
    _.sel(`searchResultMap->searchResultListMap->WORD->items`),

    _.filter(
      ({ handleEntry, sourceDictnameKO }) =>
        toNormalForm(handleEntry) === toNormalForm(query) &&
        isDecentDict(sourceDictnameKO)
    ),
    _.pluck('entryId'),
    exist
  )

const getQueryUri = query =>
  `https://dict.naver.com/api3/ptko/search?query=${encodeURIComponent(
    query
  )}&lang=ko`

const getEntryUri = entryId =>
  `https://dict.naver.com/api/platform/ptko/entry.nhn?entryId=${entryId}&meanType=default`

const searchEntry = query => _.go(query, getQueryUri, fetchJson)

const searchEntryIds = query => _.go(query, searchEntry, extractEntryIds(query))

const getPron = _.pipe(
  _.sel('entry->members->0->prons->0->korean_pron_symbol'),
  splitString('||'),
  _.first
)

const getEntryName = _.sel('entry->members->0->entry_name')

const getMeans = _.pipe(
  _.sel('entry->means'),
  _.map(mean => ({
    mean: mean.origin_mean,
    part: mean.part.part_ko_name
  }))
)

const getDictFromEntry = entry => ({
  entry: getEntryName(entry),
  pron: getPron(entry),
  means: getMeans(entry)
})

const searchDictByEntry = _.pipe(
  getEntryUri,
  fetchJson,
  getDictFromEntry
)

const searchDictsByEntry = _.map(searchDictByEntry)

const searchWord = _.pipe(
  searchEntryIds,
  searchDictsByEntry
)
const searchWords = _.pipe(
  _.map(searchWord),
  _.flatten
)

const verbRootRegex = /verbo (\w+)/
const adjetiveRootRegex = /(plural|feminino) de (\w+)/

const rootsFromWikiMeans = _.map(
  _.pipe(
    m => m.match(verbRootRegex) || m.match(adjetiveRootRegex),
    _.last
  )
)

const meansFromWiki = _.pipe(
  _.sel(
    `searchResultMap->searchResultListMap->WORD->items->($.sourceDictnameKO === '윅셔너리 사전')->meansCollector->0->means`
  ),
  _.pluck('value'),
  _.map(stripHTMLTag)
)

const uniqueEntity = __(_.uniq, _.filter(_.isString))
const emptyFilter = v => v.length && v
const rootsFromWiki = _.pipe(
  meansFromWiki,
  rootsFromWikiMeans,
  uniqueEntity,
  emptyFilter
)
const getVerbRoots = query => verbRoots[query]

const searchDict = query =>
  _.go(query, preprocess, searchEntry, entry => {
    const entryIds = extractEntryIds(preprocess(query))(entry)
    console.log('entryIds', entryIds)
    if (entryIds) return searchDictsByEntry(entryIds)

    const wikiRoots = rootsFromWiki(entry)
    if (wikiRoots) {
      console.log('wikiRoots', wikiRoots)
      return _.go(wikiRoots, searchWords)
    }
    const verbRoots = getVerbRoots(query)
    if (verbRoots) {
      console.log('verbRoot', verbRoots)
      return _.go(verbRoots, searchWords)
    }
  })

//searchDict('maca').then(_.hi)
//searchDict('bom').then(_.hi)
//searchDict('passava').then(_.hi)
//searchDict('passaria').then(_.hi)
//searchDict('rapido').then(_.hi)
// searchDict('alemães').then(_.hi)
searchDict('alegres').then(_.hi)
module.exports = searchDict