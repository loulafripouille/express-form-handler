/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const FieldFormat = require('./lib/field/fieldformat')
const FieldRule = require('./lib/field/fieldrule')

const Strategy = require('./lib/model/strategy')
const MongooseStrategy = require('./lib/model/strategies/mongoose')
const SequelizeStrategy = require('./lib/model/strategies/sequelize')

const Stringformat = require('./lib/field/formats/string')
const Dateformat = require('./lib/field/formats/date')
const Emailformat = require('./lib/field/formats/email')
const Numericformat = require('./lib/field/formats/numeric')
const Floatformat = require('./lib/field/formats/float')
const Integerformat = require('./lib/field/formats/integer')
const Alphaformat = require('./lib/field/formats/alpha')
const Alphanumericformat = require('./lib/field/formats/alphanumeric')
const URLformat = require('./lib/field/formats/url')

const Requiredrule = require('./lib/field/rules/required')
const Minlengthrule = require('./lib/field/rules/minlength')
const Maxlengthrule = require('./lib/field/rules/maxlength')
const Equalstorule = require('./lib/field/rules/equalsto')
const Customrule = require('./lib/field/rules/custom')

module.exports = require('./lib/form')

module.exports.format = {
  string: () => new Stringformat(),
  text: () => new Stringformat(),
  textarea: () => new Stringformat(),
  email: () => new Emailformat(),
  date: () => new Dateformat(),
  numeric: () => new Numericformat(),
  integer: () => new Integerformat(),
  float: () => new Floatformat(),
  alpha: () => new Alphaformat(),
  alphanumeric: () => new Alphanumericformat(),
  url: () => new URLformat()
}

module.exports.rule = {
  required: () => new Requiredrule(),
  minlength: (length) => new Minlengthrule(length),
  maxlength: (length) => new Maxlengthrule(length),
  equalsto: (fieldname) => new Equalstorule(fieldname),
  custom: (fn) => new Customrule(fn)
}

module.exports.FieldFormat = FieldFormat
module.exports.FieldRule = FieldRule
module.exports.Strategy = Strategy
module.exports.MongooseStrategy = MongooseStrategy
module.exports.SequelizeStrategy = SequelizeStrategy
