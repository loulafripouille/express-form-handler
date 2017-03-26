/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const Fieldformat = require('./../../../lib/field/fieldformat')
const Alphanumericformat = require('./../../../lib/field/formats/alphanumeric')

describe('Alphanumericformat object', function () {
  it('should herits Fieldformat', function () {
    let alphanuemricformat = new Alphanumericformat()

    expect(alphanuemricformat).to.be.an.instanceOf(Fieldformat)
  })

  it('should repond to check method', function () {
    let alphanuemricformat = new Alphanumericformat()

    expect(alphanuemricformat).to.respondTo('check')
  })

  describe('Alphanumericformat check', function () {
    it('should return true with a string containing only alphanumeric carachters', function () {
      let alphanuemricformat = new Alphanumericformat()

      expect(alphanuemricformat.check({ value: 'abcdef1234' })).to.be.true
      expect(alphanuemricformat.error).to.be.null
    })

    it('should return false with a string containing not only alphanumeric carachters', function () {
      let alphanuemricformat = new Alphanumericformat()

      expect(alphanuemricformat.check({ value: 'abcdef1234%$`"' })).to.be.false
    })

    it('should set the error string on error', function () {
      let alphanuemricformat = new Alphanumericformat()

      alphanuemricformat.check({ value: 'abcdef1234/+=' })

      expect(alphanuemricformat.error).to.be.not.null
    })
  })
})
