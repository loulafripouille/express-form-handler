/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const util = require('util')
const Fieldformat = require('./../fieldformat')

function Alphanumericformat () {
  Fieldformat.call(this)
  this.name = 'alphanumeric'
}

util.inherits(Alphanumericformat, Fieldformat)

Alphanumericformat.prototype.check = function (field) {
  if(!validator.isAlphanumeric(field.value)) {
    this.error = `The field ${field.label} doesn't accept special caracters`
    return false
  }

  return true
}

module.exports = Alphanumericformat
