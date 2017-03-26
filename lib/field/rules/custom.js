/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const util = require('util')
const Fieldrule = require('./../fieldrule')

function Customrule (fn) {
  Fieldrule.call(this)
  this.name = 'equalsto'
  this.fn = fn
}

util.inherits(Customrule, Fieldrule)

Customrule.prototype.check = function (field) {
  if (!this.fn(field.value)) {
    this.error = `The field ${field.label} doesn't respect the expected format`
    return false
  }

  return true
}

module.exports = Customrule
