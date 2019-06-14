const searchDict = require('./searchDict')
const { sel, hi } = require('fxjs2')

const firstMean = sel('0.mean')
test('Fetch PTDIC WORD: bom', async () => {
  console.log(searchDict)

  expect(true).toBe(true)
})

test('sel shoud select element from object', () => {
  const obj = {
    a: {
      b: {
        c: 'selected',
      },
    },
  }

  expect(sel('a.b.c')(obj)).toBe('selected')
})
