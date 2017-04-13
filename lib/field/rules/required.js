/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const util = require('util')
const Fieldrule = require('./../fieldrule')

function Requiredrule () {
  Fieldrule.call(this)
  this.name = 'email'
}

util.inherits(Requiredrule, Fieldrule)

Requiredrule.prototype.check = function (field) {
  if (!field.value) {
    this.error = `The field ${field.label} is required and must be filled`
    return false
  }

  return true
}

module.exports = exports = Requiredrule
