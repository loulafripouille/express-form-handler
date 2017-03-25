/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const Fieldformat = require('./../../../lib/field/fieldformat')
const Urlformat = require('./../../../lib/field/formats/url')

describe('Urlformat object', function () {

  it('should herits Fieldformat', function () {
    let url = new Urlformat()

    expect(url).to.be.an.instanceOf(Fieldformat)
  })

  it('should repond to check method', function () {
    let url = new Urlformat()

    expect(url).to.respondTo('check')
  })

  describe('Urlformat check', function () {

    it('should return true if the given url correspond to a url', function () {
      let url = new Urlformat()

      expect(url.check({ value: 'https://nodejs.org' })).to.be.true
      expect(url.check({ value: 'http://nodejs.org' })).to.be.true
      expect(url.check({ value: 'http://www.nodejs.org' })).to.be.true
      expect(url.check({ value: 'www.nodejs.org' })).to.be.true
      expect(url.check({ value: 'nodejs.org' })).to.be.true
      expect(url.error).to.be.null
    })

    it('should return false if the given url doesnt correspond to a url', function () {
      let url = new Urlformat()

      expect(url.check({ value: 'hahaha' })).to.be.false
    })

    it('should set the error url on error', function () {
      let url = new Urlformat()

      url.check({ value: 'www/' })

      expect(url.error).to.be.not.null
    })
  })
})
