/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const config = require('./config')
const Field = require('./field/field')

const Stringformat = require('./field/formats/string')
const Dateformat = require('./field/formats/date')
const Emailformat = require('./field/formats/email')
const Numericformat = require('./field/formats/numeric')
const Floatformat = require('./field/formats/float')
const Integerformat = require('./field/formats/integer')
const Alphaformat = require('./field/formats/alpha')
const Alphanumericformat = require('./field/formats/alphanumeric')
const URLformat = require('./field/formats/url')

const Requiredrule = require('./field/rules/required')
const Minlengthrule = require('./field/rules/minlength')
const Maxlengthrule = require('./field/rules/maxlength')
const Equalstorule = require('./field/rules/equalsto')
const Customrule = require('./field/rules/custom')

let acceptedMethods = ['post', 'put', 'patch']

// Public API
// Constructor
let Form = function (fields = [], model = {}) {
  if(!Array.isArray(fields)) throw new Error('You must pass an array')

  this.fields = fields.map(field => new Field(field))
  this.errors = []
}

// Express route middleware
Form.prototype.process = function (req, res, next) {
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
    try {
      field.check()
    } catch(e) {
      console.log(e)
      return next(e)
    }

    if(field.errors.length > 0) {
      this.errors.concat(field.errors)
    }
  }
  
  req.form = {}
  req.form.isValid = this.errors.length === 0
  req.form.errors = this.errors
  req.form.body = this.fields

  return next()
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

module.exports = {
  create: (fields, model) => new Form(fields, model),
  setLocale: (locale) => config.setLocale(locale),
  setModelStrategy: (strategy) => config.setModelStrategy(strategy),

  formats : {
    string: () => new Stringformat(),
    text: () => new Stringformat(),
    textarea: () => new Stringformat(),
    email: () => new Emailformat(),
    date: () => new Dateformat(),
    numeric: () => new Numericformat(),
    integer: () => new Integerformat(),
    float: () => new Floatformat(),
    alpha: () => new Alphaformat(),
    alphanumeric: () => new Alphanumericformat(),
    url: () => new URLformat()
  },

  rules: {
    equired: () => new Requiredrule(),
    minlength: (length) => new Minlengthrule(length),
    maxlength: (length) => new Maxlengthrule(length),
    equalsto: (fieldname) => new Equalstorule(field),
    custom: (fn) => new Customrule(fn)
  }
}
