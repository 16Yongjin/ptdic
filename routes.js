const express = require('express')
const _ = require('partial-js')
const searchDict = require('./searchDict')

const trim = str => str && str.trim()
const errorMessage = message => ({ message, error: true })
const successMessage = (message, dicts) => ({ message, error: false, dicts })

const router = express.Router()

router.get('/search/:query', async (req, res) => {
  const query = trim(req.params.query)
  console.log(query)
  if (!query) return res.send(errorMessage('단어를 입력해주세요.'))

  try {
    const dicts = await searchDict(query)
    console.log('dict', dicts)
    if (_.isEmpty(dicts)) res.send(errorMessage('단어를 찾지 못했습니다.'))
    else res.send(successMessage('단어를 찾았습니다.', dicts))
  } catch (message) {
    console.error('[ERROR]', message)
    res.send(errorMessage(message.toString()))
  }
})

module.exports = router