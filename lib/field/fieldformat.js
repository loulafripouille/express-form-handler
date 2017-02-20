/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

function Fieldformat () {  
  this.error = null
  this.name = null
}

//
Fieldformat.prototype.check = function (field, value) {
  throw new Error('Fieldformat#check must be overridden by subclass')
}

module.exports = Fieldformat
