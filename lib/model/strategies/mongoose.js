/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const util = require('util')
const Strategy = require('./../strategy')

function MongooseStrategy (model) {
  if(!(typeof model !== 'object')) {
    throw new Error('A mongoose model must be an object')
  }

  Strategy.call(this)
  this.name = 'mongoose'
  this.model = model
}

util.inherits(MongooseStrategy, Strategy)

MongooseStrategy.prototype.bind = function (values) {
  //
}

MongooseStrategy.prototype.findOne = function (id) {
  //
}

MongooseStrategy.prototype.validate = function () {
  //
}

module.exports = MongooseStrategy
