/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

function Fieldrule () {
  this.error = null
  this.name = null
}

//
Fieldrule.prototype.check = function (field, value) {
  throw new Error('Fieldrule#check must be overridden by subclass')
}

module.exports = exports = Fieldrule
