/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const util = require('util')
const validator = require('validator')
const Fieldformat = require('./../fieldformat')

function Dateformat () {
  Fieldformat.call(this)
  this.name = 'email'
  this.error = null
}

util.inherits(Dateformat, Fieldformat)

Dateformat.prototype.check = function (field) {
  if(!validator.isDate(field.value + '')) {
    this.error = `The field ${field.label} must be a date`
    return false
  }

  return true
}

module.exports = Dateformat
