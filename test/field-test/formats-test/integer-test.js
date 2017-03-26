/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const Fieldformat = require('./../../../lib/field/fieldformat')
const Intergerformat = require('./../../../lib/field/formats/integer')

describe('Intergerformat object', function () {
  it('should herits Fieldformat', function () {
    let integer = new Intergerformat()

    expect(integer).to.be.an.instanceOf(Fieldformat)
  })

  it('should repond to check method', function () {
    let integer = new Intergerformat()

    expect(integer).to.respondTo('check')
  })

  describe('Intergerformat check', function () {
    it('should return true if the given string correspond to a integer', function () {
      let integer = new Intergerformat()

      expect(integer.check({ value: '1' })).to.be.true
      expect(integer.error).to.be.null
    })

    it('should return false if the given string doesnt correspond to a integer', function () {
      let integer = new Intergerformat()

      expect(integer.check({ value: '1.2' })).to.be.false
    })

    it('should set the error string on error', function () {
      let integer = new Intergerformat()

      integer.check({ value: 'abcdef' })

      expect(integer.error).to.be.not.null
    })
  })
})
