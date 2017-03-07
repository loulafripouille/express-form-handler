/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const util = require('util')
const Strategy = require('./../strategy')

// Public API
// @constructor
function MongooseStrategy (model) {
  if(!(typeof model !== 'object')) {
    throw new Error('A mongoose model must be an object')
  }

  Strategy.call(this)
  this.name = 'mongoose'
  this.model = model
  this.modelInstance = null
}

util.inherits(MongooseStrategy, Strategy)

MongooseStrategy.prototype.bind = function (body) {
  this.modelInstance = new this.model()
  body.forEach(function (fieldValue, fieldName) {
    if(this.modelInstance.hasOwnProperty(fieldName)) {
      this.modelInstance[key] = value
    }
  })
}

// @returns {Promise}
MongooseStrategy.prototype.findOne = function (id) {
  return this.model.findById(id)
}

// @returns {Promise}
MongooseStrategy.prototype.validate = function () {
  return this.modelInstance.validate()
}

module.exports = MongooseStrategy
