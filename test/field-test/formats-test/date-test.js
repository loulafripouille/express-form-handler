/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const Fieldformat = require('./../../../lib/field/fieldformat')
const Dateformat = require('./../../../lib/field/formats/date')

describe('Dateformat object', function () {
  it('should herits Fieldformat', function () {
    let date = new Dateformat()

    expect(date).to.be.an.instanceOf(Fieldformat)
  })

  it('should repond to check method', function () {
    let date = new Dateformat()

    expect(date).to.respondTo('check')
  })

  describe('Dateformat check', function () {
    it('should return true if the given string correspond to a date', function () {
      let date = new Dateformat()

      expect(date.check({ value: '12 janv. 2017' })).to.be.true
      expect(date.error).to.be.null
    })

    it('should return false if the given string doesnt correspond to a date', function () {
      let date = new Dateformat()

      expect(date.check({ value: 'blabla' })).to.be.false
    })

    it('should set the error string on error', function () {
      let date = new Dateformat()

      date.check({ value: 'notadate' })

      expect(date.error).to.be.not.null
    })
  })
})
