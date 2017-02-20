/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const asArray = require('as-array')
const Fieldformat = require('./fieldformat')
const Fieldrule = require('./fieldrule')

// private API
// Generate errors array form an strings array
let generateErrors = function (errMessages, field, opt = {}) {
  return asArray(errMessages).map(function (errMessage) {
    let err = {}
    err.message = errMessage
    err.field = field
    // err.info = opt

    return err
  })
}

// Public API
// constructor
function Field (field) {
  if(field.format instanceof Fieldformat === false) {
    throw new Error(`The field format must be an instance of Fieldformat`)
  }
  asArray(field.rules).forEach(function (rule) {
    if(rule instanceof Fieldrule === false) {
      throw new Error(`A field rule must be an instance of Fieldrule`)
    }
  })

  this.definition = field
  this.value = null
  this.errors = []
  this.checked = false
}

Field.prototype.check = function () {
  // Reset field format error
  this.definition.format.error = null
  if(!this.definition.format.check(this.definition, this.value)) {
    this.errors.concat(generateErrors(this.definition.format.error, this.definition.name))
  }

  for(let rule of asArray(this.definition.rules)) {
    // Reset rule error
    rule.error = null

    if(!rule.check(this.definition, this.value)) {
      this.errors.concat(generateErrors(rule.error, this.definition.name))
    }
  }

  this.checked = true
}

module.exports = Field
