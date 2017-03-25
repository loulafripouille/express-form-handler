/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

<<<<<<< HEAD
const config = require('./config')
const Field = require('./field/field')

let acceptedMethods = ['post', 'put', 'patch', 'POST', 'PUT', 'PATCH']

// Public API
// Constructor
let Form = function (fields = []) {
  if(Array.isArray(fields) === false) throw new Error('You must pass an array')

  this.fields = fields.map(field => new Field(field))
  this.errors = []
  this.process = this.process.bind(this)
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
  }

  if(config.getModelStrategy()) {
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
    if(!config.isValidationByModel()) {
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
    for(let field of this.fields) {
      try {
        field.check(this.fields)
      } catch(e) {
        reject(e)
      }

      if(field.errors.length > 0) {
        this.errors.concat(field.errors)
      }

      resolve()
    }
  }.bind(this))
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

  // Chaining methods
  return this
}

// Shortcut for create method below
module.exports = (fields) => new Form(fields)

module.exports.create = (fields) => new Form(fields)
module.exports.setLocale = (locale) => config.setLocale(locale)
module.exports.setModelStrategy = (strategy) => config.setModelStrategy(strategy)
module.exports.setValidationMethod = (method) => config.setValidationMethod(method)
=======
const 
    Field = require('./field'),
    ErrorHandler = require('./error/errorHandler'),
    Constraint = require('./constraint'),
    Model = require('./model'),
    async = require('async'),
    fs = require('fs'),
    path = require('path')

var locale = 'en',
    adapter = 'mongoose'

/**
 * This is the main Class for the express form handler lib
 *
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
class Form {
    /**
     * 
     */
    constructor() {
        this.Field = new Field()
        this.locale = null
        this.Model = new Model(adapter)
        this.formModel = null
    }

    /**
     *
     * @returns {Function} The express route middleware
     */
    handleRequest() {
        let self = this

        /**
         * The express route middleware
         *
         * @param {Object} req
         * @param {Object} res
         * @param {Function} next
         */
        return (req, res, next) => {
            let errors,
                reqId

            if (req.method !== "POST" && req.method !== "PUT" && req.method !== "PATCH") return next()

            errors = self.Field.errors = [],
            reqId = req.params.id || null
            res.locals.formErrors = req.form = {}

            self.Field.ErrorHandler = new ErrorHandler(self.locale)
            self.Field.Constraint = new Constraint(self.Field.ErrorHandler)
            self.Model.model = self.formModel

            self.Field.setFieldsValue(req.body, () => {
                //Do the form assertion on each field
                async.forEachOf(
                    self.Field.fields,
                    (field, fieldName, cb) => {
                        self.Field.checkField(field, self.locale, err => {
                            if (err) {
                                return cb(err)
                            }

                            req.form[fieldName] = field.value
                            return cb()
                        })
                    },
                    (err) => {
                        if (err) {
                            return next(err)
                        }

                        //Model persitence
                        self.Model.persist(self.Field.fields, reqId, (err, doc) => {
                            if(err) {
                                return next(err) //persitence error
                            }

                            req.form.model = doc

                            //Fill form errors
                            if(self.Field.Constraint.hasErrors()) {
                                errors = self.Field.errors.concat(self.Field.Constraint.errors)
                            }

                            res.locals.formErrors = errors
                            req.form.isValid = errors.length === 0

                            return next()
                        })
                    }
                )
            })
        }
    }

    /**
     * Add the given fields in the Field instance
     *
     * @param {Array} fields
     */
    addFields(fields) {
        let self = this
        for(var field in fields) {
            if(fields.hasOwnProperty(field)) {
                self.Field.add(field, fields[field])
            }
        }
    }

    /**
     * Extend the (this) form with the given form instance
     *
     * @param {Form} formObject
     *
     * @returns {Form}
     */
    extend(formObject) {
        if(!formObject instanceof Form) {
            throw new Error(
                '[express-form-handler] You can not extend a form with parameter that is not an instance of Form'
            )
        }
        if(!formObject.hasOwnProperty('Field')) {
            throw new Error('[express-form-handler] A form object must have a Field member')
        }
        if(!formObject.Field.hasOwnProperty('fields')) {
            throw new Error('[express-form-handler] A Field object must have a fields member')
        }

        this.addFields(formObject.Field.fields)

        //To chain extend method
        return this
    }
}

module.exports = {

    /**
     * Public method that is the entry point of the lib
     * @see README to learn more on all usages and features
     *
     * @param {Object} definition
     * @param {String} locale
     *
     * @returns {Form}
     */
    create: (definition, model = null) => {
        let form = new Form()
        form.locale = locale
        form.formModel = model

        if(!definition.hasOwnProperty('fields')) {
            throw new Error('[express-form-handler] When you create a form, you must give the fields definition')
        }

        form.addFields(definition.fields)
        return form
    },

    /**
     * Public method that defined a selected locale
     * @see README to learn more on all usages and features
     *
     * @param {String} new_locale
     */
    setLocale: (new_locale) => {
        try {
            fs.statSync(path.join(__dirname, '..', 'locales', new_locale + '.json')).isFile()
            locale = new_locale
        } catch (err) {
            locale = 'en'
        }
        
        return locale
    },

    /**
     * Public method that defined a selected adapter
     * @see README to learn more on all usages and features
     *
     * @param {String} new_adapter
     */
    setAdapter: (new_adapter) => {
        try {
            fs.statSync(path.join(__dirname, 'adapters', new_adapter + '.js')).isFile()
            adapter = new_locale
        } catch (err) {
            adapter = 'mongoose'
        }
        
        return adapter
    }
}
>>>>>>> 9a5216b9e61059e1bd85de1071fc527121573163
