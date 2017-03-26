/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const Fieldformat = require('./../../../lib/field/fieldformat')
const Emailformat = require('./../../../lib/field/formats/email')

describe('Emailformat object', function () {
  it('should herits Fieldformat', function () {
    let email = new Emailformat()

    expect(email).to.be.an.instanceOf(Fieldformat)
  })

  it('should repond to check method', function () {
    let email = new Emailformat()

    expect(email).to.respondTo('check')
  })

  describe('Emailformat check', function () {
    it('should return true if the given string correspond to a email', function () {
      let email = new Emailformat()

      expect(email.check({ value: 'test@test.test' })).to.be.true
      expect(email.error).to.be.null
    })

    it('should return false if the given string doesnt correspond to a email', function () {
      let email = new Emailformat()

      expect(email.check({ value: 'blabla@blabla' })).to.be.false
      expect(email.check({ value: 'blabla@blabla.b' })).to.be.false
      expect(email.check({ value: 'blabla.bla' })).to.be.false
    })

    it('should set the error string on error', function () {
      let email = new Emailformat()

      email.check({ value: 'notaemail' })

      expect(email.error).to.be.not.null
    })
  })
})
