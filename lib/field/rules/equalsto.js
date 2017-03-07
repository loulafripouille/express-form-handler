/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const util = require('util')
const Fieldrule = require('./../fieldrule')
const assert = require('assert')

function Equalstorule () {
  Fieldrule.call(this)
  this.name = 'equalsto'
}

util.inherits(Equalstorule, Fieldrule)

Equalstorule.prototype.check = function (field) {
  if(!assert.deepEqual(field.value, field.equalTarget.value)) {
    this.error = `The field ${field.label} must match the field ${field.equalTarget.label} value`
    return false
  }

  return true
}

module.exports = Equalstorule