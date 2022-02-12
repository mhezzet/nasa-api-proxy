const express = require('express')
const marsWeather = require('./mars-weather')

const router = express.Router()

router.use('/mars-weather', marsWeather)

module.exports = router
