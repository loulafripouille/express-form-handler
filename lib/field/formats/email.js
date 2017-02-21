/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const util = require('util')
const Fieldformat = require('./../fieldformat')

function Emailformat () {
  Fieldformat.call(this)
  this.name = 'email'
}

util.inherits(Emailformat, Fieldformat)

Emailformat.prototype.check = function (field) {
  if(!validator.isEmail(field.value + '')) {
    this.error = `The field ${field.label} must be an email`
    return false
  }

  return true
}

module.exports = Emailformat
