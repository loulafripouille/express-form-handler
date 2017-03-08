/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const config = require('./config')
const Field = require('./field/field')

let acceptedMethods = ['post', 'put', 'patch']

// Public API
// Constructor
let Form = function (fields = []) {
  if(Array.isArray(fields) === false) throw new Error('You must pass an array')

  this.fields = fields.map(field => new Field(field))
  this.errors = []
}

// @returns {Promise}
Form.prototype.validate = function () {
  let _this = this
  return new Promise(function(resolve, reject) {
    if(!config.isValidationByModel()) {
      for(let field of _this.fields) {
        try {
          field.check(_this.fields)
        } catch(e) {
          reject(e)
        }

        if(field.errors.length > 0) {
          _this.errors.concat(field.errors)
        }

        resolve()
      }
    } else {
      config
      .getModelStrategy()
      .validate()
      .then(function () {
        resolve()
      })
      .catch(function (errors) {
       _this.errors = errors
       resolve()
      })
    }
  })
}

// Express route middleware
Form.prototype.process = function (req, res, next) {
  let _this = this
  if(!acceptedMethods.includes(req.method)) {
    return next(
      new Error(`Expected post, put or patch method. ${req.method} given`)
    )
  }

  for(let field of this.fields) {
    if(!req.body.hasOwnProperty(field.definition.name)) {
      return next(
        new Error(`No field found in the request body for the field name: ${field.definition.name}`)
      )
    }

    field.value = req.body[field.definition.name]
    if(config.getModelStrategy() !== null) {
      config.getModelStrategy().bind(body)
    }
  }

  this
  .validate()
  .then(function() {
    req.form = {}
    req.form.model = config.getModelStrategy() ? config.getModelStrategy().modelInstance : null
    req.form.isValid = _this.errors.length === 0
    req.form.errors = _this.errors
    req.form.body = _this.fields

    return next()
  })
  .catch(e => next(e))
}

// "Extend" the current Form instance with the given one
Form.prototype.extends = function (form) {
  if(typeof form !== 'object' || form instanceof Form === false) {
    throw new Error('Extends method expects a Form instance')
  }

  // Push new fields
  form.fields.forEach(function (field) {    
    this.fields.push(field)
  }, this)

  // To chain extends
  return this
}

// Shortcut for create method below
module.exports = (fields) => new Form(fields)

module.exports.create = (fields) => new Form(fields)
module.exports.setLocale = (locale) => config.setLocale(locale)
module.exports.setModelStrategy = (strategy) => config.setModelStrategy(strategy)
module.exports.setValidationMethod = (method) => config.setValidationMethod(method)

