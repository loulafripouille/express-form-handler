/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const Fieldformat = require('./../../../lib/field/fieldformat')
const Floatformat = require('./../../../lib/field/formats/float')

describe('Floatformat object', function () {
  it('should herits Fieldformat', function () {
    let float = new Floatformat()

    expect(float).to.be.an.instanceOf(Fieldformat)
  })

  it('should repond to check method', function () {
    let float = new Floatformat()

    expect(float).to.respondTo('check')
  })

  describe('Floatformat check', function () {
    it('should return true if the given string correspond to a float', function () {
      let float = new Floatformat()

      expect(float.check({ value: '1.25' })).to.be.true
      expect(float.error).to.be.null
    })

    it('should return false if the given string doesnt correspond to a float', function () {
      let float = new Floatformat()

      expect(float.check({ value: '1,2' })).to.be.false
    })

    it('should set the error string on error', function () {
      let float = new Floatformat()

      float.check({ value: 'abcdef' })

      expect(float.error).to.be.not.null
    })
  })
})
