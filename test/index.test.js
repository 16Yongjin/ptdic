const expect = require('expect')
const searchDict = require('../searchDict')
const _ = require('partial-js')

const firstMean = _.pipe(
  _.sel('0->means->0->mean'),
  s => s.split('.')[0]
)

const testWord = ([word, mean]) =>
  xit(`WORD: ${word}`, async () => {
    const dict = await searchDict(word)
    expect(firstMean(dict)).toBe(mean)
  })

describe('Fetch PTDIC', () => {
  const testCases = [
    ['dia', '날'],
    ['bom', '좋은'],
    ['passar', '지나가게 하다'],
    ['mesmo', '같은'],
    ['alegres', '기쁘게 하다']
  ]
  _.map(testWord)(testCases)
})
