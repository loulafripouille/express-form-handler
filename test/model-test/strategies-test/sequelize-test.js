/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const SequelizeStrategy = require('./../../../lib/model/strategies/sequelize')
const Strategy = require('./../../../lib/model/strategy')

describe('sequelize model strategy', function () {
  it('should herits Strategy', function () {
    let sequelizeStrategy = new SequelizeStrategy()

    expect(sequelizeStrategy).to.be.an.instanceOf(Strategy)
  })

  it('should implement update, bind, findOne and validate method', function () {
    let sequelizeStrategy = new SequelizeStrategy()

    expect(sequelizeStrategy).to.have.property('bind')
    expect(sequelizeStrategy).to.have.property('findOne')
    expect(sequelizeStrategy).to.have.property('update')
    expect(sequelizeStrategy).to.have.property('validate')
  })

  describe('Update the model', function () {
    it('Should call Strategy:findOne, Strategy:bind and returns a promise', sinon.test(function (done) {
      let sequelizeStrategy = new SequelizeStrategy({})
      let findOneStube = sinon.stub(sequelizeStrategy, 'findOne')
      let bindStub = sinon.stub(sequelizeStrategy, 'bind')

      findOneStube.returns(new Promise((resolve, reject) => resolve()))

      sequelizeStrategy
      .update({ params: { id: 1 } })
      .then(function (model) {
        expect(findOneStube.calledBefore(bindStub)).to.be.true
        expect(bindStub.calledOnce).to.be.true

        done()
      })
      .catch(err => done(err))
    }))

    it('Should create a new model instance then call Strategy:bind and returns a promise', sinon.test(function (done) {
      let sequelizeStrategy = new SequelizeStrategy({ build: function () {} })
      let bindStub = sinon.stub(sequelizeStrategy, 'bind')

      sequelizeStrategy
      .update({ params: { } })
      .then(function (model) {
        expect(bindStub.calledOnce).to.be.true

        done()
      })
      .catch(err => done(err))
    }))
  })
})
