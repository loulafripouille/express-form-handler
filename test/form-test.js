/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const Form = require('./..')

describe('Form module', function () {
  describe('Create a new form', function () {
    it('Must return a new instance', function () {
      let form = Form.create()
      expect(form.constructor.name).to.be.equal('Form')
      expect(form).to.have.property('fields')
      expect(form).to.have.property('errors')
      expect(form).to.respondTo('process')
      expect(form).to.respondTo('extends')
      expect(form).to.respondTo('send')
      expect(form).to.respondTo('send')
      expect(form).to.respondTo('validate')
      expect(form).to.respondTo('validateWithModel')
    })

    it('Must throw an error on bad args', function () {
      let createForm = function () {
        Form.create({})
      }
      expect(createForm).to.throw(Error, 'You must pass an array')
    })

    it('Must bind given fields', function () {
      let form = Form.create([
        {
          name: 'username',
          label: 'Username',
          format: Form.format.string(),
          rules: [Form.rule.required()]
        },
        {
          name: 'password',
          label: 'Password',
          format: Form.format.string(),
          rules: [Form.rule.required()]
        }
      ])
      expect(form.fields).to.be.an.instanceof(Array)
      expect(form.fields).to.has.length(2)
      expect(form.fields[0].constructor.name).to.be.equal('Field')
      expect(form.fields[0]).to.has.ownProperty('definition', 'value', 'errors', 'checked')
      expect(form.fields[0]).to.respondTo('check')
    })

    describe('Extend a form', function () {
      it('Should add given form fields into extended form fields array', function () {
        let rootForm = Form.create([
          {
            name: 'username',
            label: 'Username',
            format: Form.format.string(),
            rules: Form.rule.required()
          },
          {
            name: 'password',
            label: 'Password',
            format: Form.format.string(),
            rules: Form.rule.required()
          }
        ])
        let form = Form.create([
          {
            name: 'email',
            label: 'Email',
            format: Form.format.email(),
            rules: Form.rule.required()
          },
          {
            name: 'birthday',
            label: 'Birthday date',
            format: Form.format.date()
          }
        ]).extends(rootForm)
        expect(form.fields).to.be.length(4)
      })

      it('Should throw an error on bad param', function () {
        let createExtendedForm = function () {
          let rootForm = {}
          let form = Form.create([
            {
              name: 'email',
              label: 'Email',
              format: Form.format.email(),
              rules: Form.rule.required()
            },
            {
              name: 'birthday',
              label: 'Birthday date',
              format: Form.format.date()
            }
          ]).extends(rootForm)
        }
        expect(createExtendedForm).to.throw(Error, 'Extends method expects a Form instance')
      })
    })

    describe('Validate a form', function () {
      let config = require('./../lib/config')
      let MongooseStrategy = require('./../lib/model/strategies/mongoose')

      it('should call Field:check on each fields', sinon.test(function (done) {
        let form = Form.create([{ name: 'test', label: 'test', format: Form.format.string() }])
        let checkStub = this.stub(form.fields[0], 'check')
        let isValidationByModelStub = this.stub(config, 'isValidationByModel')
        let req = { method: 'post', body: { test: 'test' } }
        let res = {}

        form
        .validate()
        .then(function () {
          expect(isValidationByModelStub.calledBefore(checkStub))
          expect(checkStub.calledOnce)
          done()
        })
        .catch(e => done(e))
      }))

      it('should call ModelStrategy:validate on each fields', sinon.test(function (done) {
        config.setModelStrategy(new MongooseStrategy({}))

        let form = Form.create([{ name: 'test', label: 'test', format: Form.format.string() }])
        let modelStrategyValidateStub = this.stub(config.getModelStrategy(), 'validate')
        let isValidationByModelStub = this.stub(config, 'isValidationByModel')
        let req = { method: 'post', body: { test: 'test' } }
        let res = {}

        form
        .validate()
        .then(function () {
          expect(isValidationByModelStub.calledBefore(modelStrategyValidateStub))
          expect(modelStrategyValidateStub.calledOnce)
          done()
        })
        .catch(e => done(e))
      }))

      afterEach(function () {
        config.validationByModel(false)
        config.resetModelStrategy()
      })
    })

    describe('Process a form', function () {
      it('should call next on bad method', sinon.test(function () {
        let form = Form.create()
        let nextStub = this.stub()
        let req = { method: 'get' }
        let res = {}
        let errorArg = new Error()

        form.process(req, res, nextStub)

        expect(nextStub.calledOnce).to.be.true
        expect(nextStub.calledWithExactly(errorArg)).to.be.true
        expect(nextStub.args[0][0].message).to.be.equal('Expected post, put or patch method. get given')
      }))

      it('should call next on unknown field', sinon.test(function () {
        let form = Form.create([{ name: 'test', label: 'test', format: Form.format.string() }])
        let nextStub = this.stub()
        let req = { method: 'post', body: {} }
        let res = {}
        let errorArg = new Error()

        form.process(req, res, nextStub)

        expect(nextStub.calledOnce).to.be.true
        expect(nextStub.calledWithExactly(errorArg)).to.be.true
        expect(nextStub.args[0][0].message).to.be.equal('No field found in the request body for the field name: test')
      }))

      it('should call Form:send', sinon.test(function (done) {
        let form = Form.create([{ name: 'test', label: 'test', format: Form.format.string() }])
        let next = this.spy()
        let sendStub = this.spy(form, 'send')
        let req = { method: 'post', body: { test: 'test' } }
        let res = {}

        form
        .process(req, res, next)
        .then(function () {
          expect(sendStub.calledOnce).to.be.true
          done()
        })
        .catch(e => done(e))
      }))
    })

    describe('Send the form informations to the next middleware', function () {
      it('Should call Form::validate then next', sinon.test(function (done) {
        let form = Form.create([{ name: 'test', label: 'test', format: Form.format.string() }])
        let nextStub = this.spy()
        let validateStub = this.spy(form, 'validate')
        let req = { method: 'post', body: { test: 'test' } }
        let res = {}

        form
        .send(req, res, nextStub)
        .then(function () {
          expect(validateStub.calledBefore(nextStub)).to.be.true
          expect(nextStub.calledOnce).to.be.true
          expect(req.form).to.has.ownProperty('body', 'errors', 'isValid')
          done()
        })
        .catch(e => done(e))
      }))
    })
  })
})
