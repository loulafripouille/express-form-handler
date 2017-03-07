/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const fs = require('fs')
const path = require('path')
const Strategy = require('./model/strategy')
const MongooseStrategy = require('./model/strategies/mongoose')

let locale = 'en'
let modelStrategy = null
let validationModel = false

//
module.exports.setLocale = function (newLocale = 'en') {
  try {
    fs.statSync(path.join(__dirname, '..', 'locales', newLocale + '.json')).isFile()
    locale = newLocale
  } catch (err) {
    locale = 'en'
  }
},

//
module.exports.setModelStrategy = function (strategy) {
  if(strategy instanceof Strategy === false) {
    throw new Error('A strategy must be an instance of Strategy')
  }
  modelStrategy = strategy
}

//
module.exports.resetModelStrategy = function () {
  modelStrategy = null
}

//
module.exports.validationByModel = function (value) {
  if(typeof value !== 'boolean') {
    throw new Error('Validation model option must be a boolean')
  }

  validationModel = value
}

module.exports.getModelStrategy = () => modelStrategy
module.exports.getLocale = () => locale
module.exports.isValidationByModel = () => validationModel
