/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const Strategy = require('./../../lib/model/strategy')

describe('strategy object', function () {
  it('new instance should have null name', function () {
    let strategy = new Strategy()

    expect(strategy).to.has.ownProperty('name')
  })

  it('all methods should throw error for implementation needed', function () {
    let strategy = new Strategy()

    expect(strategy.bind).to.throw(Error, 'Strategy#bind must be overridden by subclass')
    expect(strategy.findOne).to.throw(Error, 'Strategy#findOne must be overridden by subclass')
    expect(strategy.validate).to.throw(Error, 'Strategy#validate must be overridden by subclass')
  })
})
