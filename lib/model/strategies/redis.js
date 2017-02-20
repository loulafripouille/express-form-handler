/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const util = require('util')
const Strategy = require('./../strategy')

function RedisStrategy () {
  Strategy.call(this)
  this.name = 'redis'
}

util.inherits(RedisStrategy, Strategy)

RedisStrategy.prototype.bind = function (field, value) {
  //
}

module.exports = RedisStrategy
