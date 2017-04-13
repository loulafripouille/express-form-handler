/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

function Strategy () {
  this.name = null
}

//
Strategy.prototype.update = function () {
  throw new Error('Strategy#update must be overridden by subclass')
}

//
Strategy.prototype.bind = function (values) {
  throw new Error('Strategy#bind must be overridden by subclass')
}

//
Strategy.prototype.findOne = function (id) {
  throw new Error('Strategy#findOne must be overridden by subclass')
}

//
Strategy.prototype.validate = function () {
  throw new Error('Strategy#validate must be overridden by subclass')
}

module.exports = exports = Strategy
