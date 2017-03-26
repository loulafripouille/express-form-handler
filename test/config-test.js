/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const config = require('./../lib/config')
const sequelizeStrategy = require('./../lib/model/strategies/sequelize')

describe('Config module', function () {
  // describe('handles locales', function () {

  //   it('should be "en" by default', function () {

  //     expect(config.getLocale()).to.be.equal('en')
  //   })

  //   it('should change the locale value', function () {

  //     config.setLocale('fr')
  //     expect(config.getLocale()).to.be.equal('fr')

  //     config.setLocale('en')
  //     expect(config.getLocale()).to.be.equal('en')
  //   })

  //   it('should set the locale to "en" on unknown given locale', function () {

  //     config.setLocale('de')
  //     expect(config.getLocale()).to.be.equal('en')

  //     config.setLocale('it')
  //     expect(config.getLocale()).to.be.equal('en')
  //   })
  // })

  describe('handles model strategies', function () {
    it('should be null by default', function () {
      expect(config.getModelStrategy()).to.be.equal(null)
    })

    it('should set the strategy with the given one', function () {
      config.setModelStrategy(new sequelizeStrategy({}))
      expect(config.getModelStrategy().name).to.be.equal('sequelize')
    })

    beforeEach(function () {
      config.resetModelStrategy()
    })
  })

  describe('validation by the model strategy', function () {
    it('should throw an error on non boolean arg given', function () {
      let fn = function () {
        config.validationByModel('true')
      }
      expect(fn).to.throw(Error, 'Validation model option must be a boolean')
    })

    it('should set the validation model value', function () {
      config.validationByModel(true)
      expect(config.isValidationByModel()).to.be.equal(true)
    })

    after(function () {
      config.validationByModel(false)
    })
  })
})
