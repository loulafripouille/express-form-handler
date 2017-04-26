/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const sinonTest = require('sinon-test')
const Form = require('./..')

sinon.test = sinonTest.configureTest(sinon)

describe('Form module', function () {
  describe('Create a new form', function () {
    it('Must return a new instance', function () {
      let form = Form.create()
      expect(form.constructor.name).to.be.equal('Form')
      expect(form).to.have.property('fields')
      expect(form).to.have.property('errors')
      expect(form).to.respondTo('process')
      expect(form).to.respondTo('extends')
      expect(form).to.respondTo('config')
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
          required: true
        },
        {
          name: 'password',
          label: 'Password',
          format: Form.format.string(),
          required: true
        }
      ])
      expect(form.fields).to.be.an.instanceof(Array)
      expect(form.fields).to.has.length(2)
      expect(form.fields[0].constructor.name).to.be.equal('Field')
      expect(form.fields[0]).to.has.ownProperty('definition', 'value', 'errors', 'checked')
      expect(form.fields[0]).to.respondTo('check')
    })
  })

  describe('Extend a form', function () {
    it('Should add given form fields into extended form fields array', function () {
      let rootForm = Form.create([
        {
          name: 'username',
          label: 'Username',
          format: Form.format.string(),
          required: true
        },
        {
          name: 'password',
          label: 'Password',
          format: Form.format.string(),
          required: true
        }
      ])
      let form = Form.create([
        {
          name: 'email',
          label: 'Email',
          format: Form.format.email(),
          required: true
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
            required: true
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

  describe('Configure a form', function () {
    it('Should has default values', function() {
      let form = Form.create([])

      expect(form.configs).to.deep.equal({
        modelStrategy: null,
        validationByModel: false,
        modelSourcing: null
      })
    })

    it('Should throw on bad config', function() {
      let form = function() { 
        Form.create([]).config({
          modelStrategy: 'check',
          validationByModel: false,
          modelSourcing: null
        })
      }

      let formbis = function() { 
        Form.create([]).config({
          modelStrategy: null,
          validationByModel: 'check',
          modelSourcing: null
        })
      }

      expect(form).to.throw()
      expect(formbis).to.throw()
    })

    it('Should set passed value', function() {
      let form = Form.create([]).config({
        modelStrategy: null,
        validationByModel: true,
        modelSourcing: 'test'
      })

      expect(form.configs).to.deep.equal({
        modelStrategy: null,
        validationByModel: true,
        modelSourcing: 'test'
      })
    })
  })

  // describe('Validate a form', function () {
  //   let MongooseStrategy = require('./../lib/model/strategies/mongoose')

  //   it('should call Field:check on each fields', sinon.test(function (done) {
  //     let form = Form.create([{ name: 'test', label: 'test', format: Form.format.string() }])
  //     let checkStub = this.stub(form.fields[0], 'check')
  //     let req = { method: 'post', body: { test: 'test' } }
  //     let res = {}

  //     form
  //     .validate()
  //     .then(function () {
  //       expect(checkStub.calledOnce)
  //       done()
  //     })
  //     .catch(e => done(e))
  //   }))

  //   it('should call ModelStrategy:validate on each fields', sinon.test(function (done) {

  //     let form = Form.create([{ name: 'test', label: 'test', format: Form.format.string() }])
  //     form.config({
  //       modelStrategy: new MongooseStrategy({})
  //     })
  //     let modelStrategyValidateStub = this.stub(form.modelStrategy, 'validate')
  //     let req = { method: 'post', body: { test: 'test' } }
  //     let res = {}

  //     form
  //     .validate()
  //     .then(function () {
  //       expect(modelStrategyValidateStub.calledOnce)
  //       done()
  //     })
  //     .catch(e => done(e))
  //   }))
  // })

  describe('Process a form', function () {
    it('should call next with error on bad method', sinon.test(function () {
      let form = Form.create()
      let nextStub = this.stub()
      let req = { method: 'get' }
      let res = {}
      let errorArg = new Error('Expected post, put or patch method. get given')

      form.process(req, res, nextStub)

      expect(nextStub.calledOnce).to.be.true
      expect(nextStub.args[0][0].message).to.be.equal('Expected post, put or patch method. get given')
    }))

    // it('should call next with error on unknown field', sinon.test(function () {
    //   let form = Form.create([{ name: 'test', label: 'test', format: Form.format.string() }])
    //   let nextStub = this.stub()
    //   let req = { method: 'post', body: {} }
    //   let res = {}
    //   let errorArg = new Error()

    //   form.process(req, res, nextStub)

    //   expect(nextStub.calledOnce).to.be.true
    //   expect(nextStub.args[0][0].message).to.be.equal('No field found in the request body for the field name: test')
    // }))

    it('should call next without error', sinon.test(function (done) {
      let form = Form.create([{ name: 'test', label: 'test', format: Form.format.string() }])
      let next = this.spy()
      let req = { method: 'post', body: { test: 'test' } }
      let res = {}

      form
      .process(req, res, next)
      .then(function () {
        expect(next.calledOnce).to.be.true
        done()
      })
      .catch(e => done(e))
    }))
  })

  // describe('Send the form informations to the next middleware', function () {
  //   it('Should call Form::validate then next', sinon.test(function (done) {
  //     let form = Form.create([{ name: 'test', label: 'test', format: Form.format.string() }])
  //     let nextStub = this.spy()
  //     let validateStub = this.spy(form, 'validate')
  //     let req = { method: 'post', body: { test: 'test' } }
  //     let res = {}

  //     form
  //     .send(req, res, nextStub)
  //     .then(function () {
  //       expect(validateStub.calledBefore(nextStub)).to.be.true
  //       expect(nextStub.calledOnce).to.be.true
  //       expect(req.form).to.has.ownProperty('body', 'errors', 'isValid')
  //       done()
  //     })
  //     .catch(e => done(e))
  //   }))
  // })
})
