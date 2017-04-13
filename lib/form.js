/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const Field = require('./field/field')
const Strategy = require('./model/strategy')

let acceptedMethods = ['post', 'put', 'patch', 'POST', 'PUT', 'PATCH']

// Private API
// @returns {Promise}
let validate = function () {
  if (!this.validationByModel) return validateByForm.call(this)
  return validateByModel.call(this)
}

// Private API
// @returns {Promise}
let validateByModel = function () {
  return new Promise(function (resolve, reject) {
    this.modelStrategy
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

// Private API
// @returns {Promise}
let validateByForm = function () {
  return new Promise(function (resolve, reject) {
    for (let field of this.fields) {
      try {
        field.check(this.fields)
      } catch (e) {
        reject(e)
      }

      if (field.errors.length > 0) this.errors.concat(field.errors)
      resolve()
    }
  }.bind(this))
}

// Private API
let send = function (req, res, next) {
  return validate.call(this)
  .then(function () {
    req.form = {}
    req.form.model = this.modelStrategy ? this.modelStrategy.modelInstance : null
    req.form.isValid = this.errors.length === 0
    req.form.errors = this.errors
    req.form.body = this.fields

    return next()
  }.bind(this))
  .catch(err => next(err))
}

// Public API
// Constructor
let Form = function (fields = []) {
  if (Array.isArray(fields) === false) throw new Error('You must pass an array')

  this.fields = fields.map(field => new Field(field))
  this.errors = []
  this.process = this.process.bind(this)

  // Configurations
  this.modelStrategy = null
  this.validationByModel = false
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

  if (this.modelStrategy) {
    return this.modelStrategy
    .update(req)
    .then(function () {
      send.call(this, req, res, next)
    }.bind(this))
    .catch(e => next(e))
  }

  return send.call(this, req, res, next)
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

  return this
}

// Overwrite default Form configuration
Form.prototype.config = function (options) {
  if (options.modelStrategy) {
    if (options.modelStrategy instanceof Strategy === false) {
      throw new Error('A strategy must be an instance of Strategy')
    }

    this.modelStrategy = options.modelStrategy
  }

  if (options.validationByModel) {
    if (typeof options.validationByModel !== 'boolean') {
      throw new Error('Validation model option must be a boolean')
    }

    this.validationByModel = options.validationByModel
  }

  return this
}

module.exports = exports = (fields) => new Form(fields)
