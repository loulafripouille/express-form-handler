/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

function Strategy () {  
  this.name = null
}

//
Strategy.prototype.bind = function (model, values) {
  throw new Error('Strategy#bind must be overridden by subclass')
}

module.exports = Strategy
