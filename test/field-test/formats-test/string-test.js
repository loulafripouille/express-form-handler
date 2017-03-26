/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const Fieldformat = require('./../../../lib/field/fieldformat')
const Stringformat = require('./../../../lib/field/formats/string')

describe('Stringformat object', function () {
  it('should herits Fieldformat', function () {
    let string = new Stringformat()

    expect(string).to.be.an.instanceOf(Fieldformat)
  })

  it('should repond to check method', function () {
    let string = new Stringformat()

    expect(string).to.respondTo('check')
  })

  describe('Stringformat check', function () {
    it('should return true if the given string correspond to a string', function () {
      let string = new Stringformat()

      expect(string.check({ value: 'iamastring' })).to.be.true
      expect(string.error).to.be.null
    })

    it('should return false if the given string doesnt correspond to a string', function () {
      let string = new Stringformat()

      expect(string.check({ value: {} })).to.be.false
    })

    it('should set the error string on error', function () {
      let string = new Stringformat()

      string.check({ value: [] })

      expect(string.error).to.be.not.null
    })
  })
})
