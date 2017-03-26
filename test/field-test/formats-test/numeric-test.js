/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const Fieldformat = require('./../../../lib/field/fieldformat')
const Numericformat = require('./../../../lib/field/formats/numeric')

describe('Numericformat object', function () {
  it('should herits Fieldformat', function () {
    let numeric = new Numericformat()

    expect(numeric).to.be.an.instanceOf(Fieldformat)
  })

  it('should repond to check method', function () {
    let numeric = new Numericformat()

    expect(numeric).to.respondTo('check')
  })

  describe('Numericformat check', function () {
    it('should return true if the given string correspond to a numeric', function () {
      let numeric = new Numericformat()

      expect(numeric.check({ value: '187009' })).to.be.true
      expect(numeric.error).to.be.null
    })

    it('should return false if the given string doesnt correspond to a numeric', function () {
      let numeric = new Numericformat()

      expect(numeric.check({ value: '1ef' })).to.be.false
    })

    it('should set the error string on error', function () {
      let numeric = new Numericformat()

      numeric.check({ value: 'abcdef' })

      expect(numeric.error).to.be.not.null
    })
  })
})
