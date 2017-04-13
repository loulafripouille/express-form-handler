/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const util = require('util')
const Fieldrule = require('./../fieldrule')

function Maxlengthrule (length) {
  Fieldrule.call(this)
  this.name = 'maxlength'
  this.length = length
}

util.inherits(Maxlengthrule, Fieldrule)

Maxlengthrule.prototype.check = function (field) {
  if (field.value.length > this.length) {
    this.error = `The field ${field.label} accepts a maximum length of ${this.length}`
    return false
  }

  return true
}

module.exports = exports = Maxlengthrule
