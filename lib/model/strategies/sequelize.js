/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const util = require('util')
const Strategy = require('./../strategy')

function SequelizeStrategy (model) {
  if(!(typeof model !== 'object')) {
    throw new Error('A sequelize model must be an object')
  }

  Strategy.call(this)
  this.name = 'sequelize'
  this.model = model
}

util.inherits(SequelizeStrategy, Strategy)

SequelizeStrategy.prototype.bind = function (values) {
  //
}

SequelizeStrategy.prototype.findOne = function (id) {
  //
}

SequelizeStrategy.prototype.validate = function () {
  //
}

module.exports = SequelizeStrategy
