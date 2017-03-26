/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const config = require('./config')
const Field = require('./field/field')

let acceptedMethods = ['post', 'put', 'patch', 'POST', 'PUT', 'PATCH']

// Public API
// Constructor
let Form = function (fields = []) {
  if (Array.isArray(fields) === false) throw new Error('You must pass an array')

  this.fields = fields.map(field => new Field(field))
  this.errors = []
  this.process = this.process.bind(this)
}

// Express route middleware
Form.prototype.process = function (req, res, next) {
  if (!acceptedMethods.includes(req.method)) {
    return next(
      new Error(`Expected post, put or patch method. ${req.method} given`)
    )
  }

  for (let field of this.fields) {
    if (!req.body.hasOwnProperty(field.definition.name)) {
      return next(
        new Error(`No field found in the request body for the field name: ${field.definition.name}`)
      )
    }

    field.value = req.body[field.definition.name]
  }

  if (config.getModelStrategy()) {
    return config
    .getModelStrategy()
    .update(req)
    .then(function () {
      this.send(req, res, next)
    }.bind(this))
  }

  return this.send(req, res, next)
}

Form.prototype.send = function (req, res, next) {
  return this
  .validate()
  .then(function () {
    req.form = {}
    req.form.model = config.getModelStrategy() ? config.getModelStrategy().modelInstance : null
    req.form.isValid = this.errors.length === 0
    req.form.errors = this.errors
    req.form.body = this.fields

    return next()
  }.bind(this))
  .catch(err => next(err))
}

// @returns {Promise}
Form.prototype.validate = function () {
  if (!config.isValidationByModel()) {
    return this.validateWithFields()
  }
  return this.validateWithModel()
}

// @returns {Promise}
Form.prototype.validateWithModel = function () {
  return new Promise(function (resolve, reject) {
    config
    .getModelStrategy()
    .validate()
    .then(function () {
      resolve()
    })
    .catch(function (errors) {
      this.errors = errors
      resolve()
    }.bind(this))
  }.bind(this))
}

// @returns {Promise}
Form.prototype.validateWithFields = function () {
  return new Promise(function (resolve, reject) {
    for (let field of this.fields) {
      try {
        field.check(this.fields)
      } catch (e) {
        reject(e)
      }

      if (field.errors.length > 0) {
        this.errors.concat(field.errors)
      }

      resolve()
    }
  }.bind(this))
}

// "Extend" the current Form instance with the given one
Form.prototype.extends = function (form) {
  if (typeof form !== 'object' || form instanceof Form === false) {
    throw new Error('Extends method expects a Form instance')
  }

  // Push new fields
  form.fields.forEach(function (field) {
    this.fields.push(field)
  }, this)

  // Chaining methods
  return this
}

// Shortcut for create method below
module.exports = (fields) => new Form(fields)

module.exports.create = (fields) => new Form(fields)
module.exports.setLocale = (locale) => config.setLocale(locale)
module.exports.setModelStrategy = (strategy) => config.setModelStrategy(strategy)
module.exports.setValidationMethod = (method) => config.setValidationMethod(method)
