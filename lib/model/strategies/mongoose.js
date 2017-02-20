/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const util = require('util')
const Strategy = require('./../strategy')

function MongooseStrategy () {
  Strategy.call(this)
  this.name = 'mongoose'
}

util.inherits(MongooseStrategy, Strategy)

MongooseStrategy.prototype.bind = function (field, value) {
  //
}

module.exports = MongooseStrategy
