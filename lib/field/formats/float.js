/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const util = require('util')
const validator = require('validator')
const Fieldformat = require('./../fieldformat')

function Floatformat () {
  Fieldformat.call(this)
  this.name = 'float'
}

util.inherits(Floatformat, Fieldformat)

Floatformat.prototype.check = function (field) {
  if(!validator.isFloat(field.value + '')) {
    this.error = `The field ${field.label} must be a float`
    return false
  }

  return true
}

module.exports = Floatformat
