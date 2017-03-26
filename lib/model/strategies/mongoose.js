/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const util = require('util')
const Strategy = require('./../strategy')

// Public API
// @constructor
function MongooseStrategy (Model) {
  Strategy.call(this)
  this.name = 'mongoose'
  this.Model = Model
  this.modelInstance = null
}

util.inherits(MongooseStrategy, Strategy)

MongooseStrategy.prototype.update = function (req) {
  return new Promise(function (resolve, reject) {
    try {
      if (req.params.id) {
        this
        .findOne(req.params.id)
        .then(function () {
          if (!this.modelInstance) reject(new Error('document not found'))
          this.bind(req.body)
          resolve(this.modelInstance)
        }.bind(this))
        .catch(e => reject(e))
      } else {
        this.modelInstance = new this.Model()
        this.bind(req.body)
        resolve(this.modelInstance)
      }
    } catch (e) {
      reject(e)
    }
  }.bind(this))
}

MongooseStrategy.prototype.bind = function (body) {
  for (let param in body) {
    if (param !== '_id' && param !== '_v') {
      this.modelInstance[param] = body[param]
    }
  }
}

// @returns {Promise}
MongooseStrategy.prototype.findOne = function (id) {
  return this.Model
  .findById(id)
  .then(function (doc) {
    this.modelInstance = doc
  }.bind(this))
}

// @returns {Promise}
MongooseStrategy.prototype.validate = function () {
  return this.modelInstance.validate()
}

module.exports = MongooseStrategy
