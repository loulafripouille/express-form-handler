/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const Fieldformat = require('./../../../lib/field/fieldformat')
const Alphaformat = require('./../../../lib/field/formats/alpha')

describe('Alphaformat object', function () {

  it('should herits Fieldformat', function () {
    let alphaformat = new Alphaformat()

    expect(alphaformat).to.be.an.instanceOf(Fieldformat)
  })

  it('should repond to check method', function () {
    let alphaformat = new Alphaformat()

    expect(alphaformat).to.respondTo('check')
  })

  describe('Alphaformat check', function () {

    it('should return true with a string containing only alpha carachters', function () {
      let alphaformat = new Alphaformat()

      expect(alphaformat.check({ value: 'abcdef' })).to.be.true
      expect(alphaformat.error).to.be.null
    })

    it('should return false with a string containing not only alpha carachters', function () {
      let alphaformat = new Alphaformat()

      expect(alphaformat.check({ value: 'abcdef1234' })).to.be.false
    })

    it('should set the error string on error', function () {
      let alphaformat = new Alphaformat()

      alphaformat.check({ value: 'abcdef1234' })

      expect(alphaformat.error).to.be.not.null
    })
  })
})
