/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const util = require('util')
const validator = require('validator')
const Fieldformat = require('./../fieldformat')

function Integerformat () {
  Fieldformat.call(this)
  this.name = 'integer'
}

util.inherits(Integerformat, Fieldformat)

Integerformat.prototype.check = function (field) {
  if(!validator.isInt(field.value + '')) {
    this.error = `The field ${field.label} must be an integer`
    return false
  }

  return true
}

module.exports = Integerformat
