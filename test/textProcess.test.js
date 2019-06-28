const expect = require('expect')
const { preprocess, postprocess } = require('../textProcess')
const _ = require('partial-js')

const testPreprocess = ([query, target]) =>
  it(`${query} to ${target}`, () => {
    expect(preprocess(query)).toBe(target)
  })

const testPostprocess = ([query, target]) =>
  it(`${query} to ${target}`, () => {
    expect(postprocess(query)).toBe(target)
  })

describe('Prerocess plural of ão', () => {
  const cases = [
    ['Aviões', 'avião'],
    ['alemães', 'alemão'],
    ['irmãos', 'irmão']
  ]

  _.map(testPreprocess)(cases)
})

describe('Preprocess plural of words ending in "L"', () => {
  const cases = [
    ['animais', 'animal'],
    ['capitais', 'capital'],
    ['papéis', 'papel']
  ]

  _.map(testPreprocess)(cases)
})

describe('Preprocess plural of words ending in "M"', () => {
  const cases = [['nuvens', 'nuvem'], ['trens', 'trem']]

  _.map(testPreprocess)(cases)
})

describe('Postprocess plural of words ending in "es"', () => {
  const cases = [['cobertores', 'cobertor'], ['luzes', 'luz']]

  _.map(testPostprocess)(cases)
})

describe('Postprocess plural of words ending in "os, a, as"', () => {
  const cases = [['elétrica', 'elétrico']]

  _.map(testPostprocess)(cases)
})
