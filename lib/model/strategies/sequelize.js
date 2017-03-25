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

SequelizeStrategy.prototype.update = function (req) {
  return new Promise(function (resolve, reject) {
    try {
      if(req.params.id) {
        this
        .findOne(req.params.id)
        .then(function (doc) {
          this.modelInstance = doc
          this.bind(req.body)
          resolve(this.modelInstance)
        }.bind(this))
      } else {
        this.modelInstance = this.model.build()
        this.bind(req.body)
        resolve(this.modelInstance)
      }
    } catch (e) {
      reject(e)
    }
  }.bind(this))
}

SequelizeStrategy.prototype.bind = function (body) {
  for(let param in body) {
    this.modelInstance[param] = body[param]
  }
}

// @returns {Promise}
SequelizeStrategy.prototype.findOne = function (id) {
  return this.model
  .findById(id)
  .then(function (doc) {
    this.modelInstance = doc
  }.bind(this))
}

// @returns {Promise}
SequelizeStrategy.prototype.validate = function () {
  return this.modelInstance.validate()
}

module.exports = SequelizeStrategy
