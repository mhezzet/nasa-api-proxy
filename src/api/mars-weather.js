const express = require('express')
const axios = require('axios')
const rateLimit = require('express-rate-limit')
const slowDown = require('express-slow-down')

const { NASA_WEATHER_API_URL } = require('../constants')

const router = express.Router()

const limiter = rateLimit({
  windowMs: 30 * 1000,
  max: 10,
})

const speedLimiter = slowDown({
  windowMs: 30 * 1000,
  delayAfter: 1,
  delayMs: 500,
})

const urlParams = new URLSearchParams({
  api_key: process.env.NASA_API_KEY,
  feedtype: 'json',
  ver: '1.0',
})

let cachedData
let cachTime

router.get('/', limiter, speedLimiter, async (req, res, next) => {
  if (cachTime > Date.now() - 30 * 1000) {
    return res.send(cachedData)
  }

  try {
    const { data } = await axios.get(`${NASA_WEATHER_API_URL}${urlParams}`)

    cachedData = data
    cachTime = Date.now()
    data.cachTime = cachTime

    res.send(data)
  } catch (error) {
    next(error)
  }
})

module.exports = router
