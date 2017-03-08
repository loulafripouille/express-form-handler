/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const util = require('util')
const Strategy = require('./../strategy')

function SequelizeStrategy (model) {
  Strategy.call(this)
  this.name = 'sequelize'
  this.model = model
  this.modelInstance = null
}

util.inherits(SequelizeStrategy, Strategy)

SequelizeStrategy.prototype.bind = function (body) {
  this.modelInstance = this.model.build(body)
}

// @returns {Promise}
SequelizeStrategy.prototype.findOne = function (id) {
  return this.model.findById(id)
}

// @returns {Promise}
SequelizeStrategy.prototype.validate = function () {
  return this.modelInstance.validate()
}

module.exports = SequelizeStrategy
