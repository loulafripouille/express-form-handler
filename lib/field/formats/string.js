/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const util = require('util')
const Fieldformat = require('./../fieldformat')

function Stringformat () {
  Fieldformat.call(this)
  this.name = 'string'
  this.error = null
}

util.inherits(Stringformat, Fieldformat)

Stringformat.prototype.check = function (field) {
  if(typeof field.value !== 'string') {
    this.error = `The field ${field.label} must be a string`
    return false
  }

  return true
}

module.exports = Stringformat
