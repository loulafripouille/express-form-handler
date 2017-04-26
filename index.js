/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const FieldFormat = require('./lib/field/fieldformat')
const FieldRule = require('./lib/field/fieldrule')

const Strategy = require('express-form-handler-strategy')

const Stringformat = require('./lib/field/formats/string')
const Dateformat = require('./lib/field/formats/date')
const Emailformat = require('./lib/field/formats/email')
const Numericformat = require('./lib/field/formats/numeric')
const Floatformat = require('./lib/field/formats/float')
const Integerformat = require('./lib/field/formats/integer')
const Alphaformat = require('./lib/field/formats/alpha')
const Alphanumericformat = require('./lib/field/formats/alphanumeric')
const URLformat = require('./lib/field/formats/url')

const Minlengthrule = require('./lib/field/rules/minlength')
const Maxlengthrule = require('./lib/field/rules/maxlength')
const Equalstorule = require('./lib/field/rules/equalsto')
const Customrule = require('./lib/field/rules/custom')

exports.create = require('./lib/form')

exports.format = {
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

exports.rule = {
  minlength: (length) => new Minlengthrule(length),
  maxlength: (length) => new Maxlengthrule(length),
  equalsto: (fieldname) => new Equalstorule(fieldname),
  custom: (fn) => new Customrule(fn)
}

exports.FieldFormat = FieldFormat
exports.FieldRule = FieldRule
exports.Strategy = Strategy
