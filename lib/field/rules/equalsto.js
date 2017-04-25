/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const util = require('util')
const Fieldrule = require('./../fieldrule')
const assert = require('assert')

function Equalstorule (target) {
  Fieldrule.call(this)
  this.name = 'equalsto'
  this.target = target
}

util.inherits(Equalstorule, Fieldrule)

Equalstorule.prototype.check = function (field, fields) {
  let target = fields.filter(f => f.definition.name === this.target, this)
  target = target.length > 0 ? target[0].definition : null
  
  if (!target) {
    throw new Error('the given target passed to equalsto rule doesn\'t exist')
  }

  if (field.value !== target.value) {
    this.error = `The field ${field.label} must match the field ${target.label} value`
    return false
  }

  return true
}

module.exports = exports = Equalstorule
