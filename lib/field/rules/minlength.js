/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const util = require('util')
const Fieldrule = require('./../fieldrule')

function Minlengthrule (length) {
  Fieldrule.call(this)
  this.name = 'minlength'
  this.length = length
}

util.inherits(Minlengthrule, Fieldrule)

Minlengthrule.prototype.check = function (field) {
  if (field.value.length < this.length) {
    this.error = `The field ${field.label} required a minimum length of ${this.length}`
    return false
  }

  return true
}

module.exports = Minlengthrule
