/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const config = require('./../lib/config')
const redisStrategy = require('./../lib/model/strategies/redis')

describe('Config module', function () {

  describe('handles locales', function () {

    it('should be "en" by default', function () {

      expect(config.getLocale()).to.be.equal('en')
    })

    it('should change the locale value', function () {

      config.setLocale('fr')
      expect(config.getLocale()).to.be.equal('fr')

      config.setLocale('en')
      expect(config.getLocale()).to.be.equal('en')
    })

    it('should set the locale to "en" on unknown given locale', function () {

      config.setLocale('de')
      expect(config.getLocale()).to.be.equal('en')

      config.setLocale('it')
      expect(config.getLocale()).to.be.equal('en')
    })
  })

  describe('handles model strategies', function () {

    it('should be mongoose strategy by default', function () {

      expect(config.getModelStrategy()).to.has.respondTo('bind')
      expect(config.getModelStrategy().name).to.be.equal('mongoose')
    })

    it('should set the strategy with the given one', function () {
      config.setModelStrategy(new redisStrategy())
      expect(config.getModelStrategy().name).to.be.equal('redis')
    })
  })
})
