/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const formHandler = require('./../lib/form')

describe('Form module', function () {
  
  describe('Create a new form', function () {
    
    it('Must return a new instance', function () {
      let form = formHandler.create()
      expect(form.constructor.name).to.be.equal('Form')
      expect(form).to.has.ownProperty('fields', 'errors')
      expect(form).to.respondTo('process', 'extends')
    })

    it('Must throw an error on bad args', function () {
      let createForm = function () {
        formHandler.create({})
      }
      expect(createForm).throw(Error, 'You must pass an array')
    })

    it('Must bind given fields', function () {
      let form = formHandler.create([
        {
          name: 'username',
          label: 'Username',
          format: new formHandler.Stringformat(),
          rules: [new formHandler.Requiredrule()]
        },
        {
          name: 'password',
          label: 'Password',
          format: new formHandler.Stringformat(),
          rules: [new formHandler.Requiredrule()]
        }
      ])
      expect(form.fields).to.be.instanceof(Array)
      expect(form.fields).to.has.length(2)
      expect(form.fields[0].constructor.name).to.be.equal('Field')
      expect(form.fields[0]).to.has.ownProperty('definition', 'value', 'errors', 'checked')
      expect(form.fields[0]).to.respondTo('check')
    })

    it('Must throw an error on bad fields arg (no field.type)', function () {
      let createForm = function () {
        formHandler.create([
          {
            name: 'username',
            label: 'Username',
            rules: [new formHandler.Requiredrule()]
          }
        ])
      }
      expect(createForm).to.throw(Error, 'The field format must be an instance of Fieldformat')
    })

    it('Must throw an error on bad fields arg (unknown field type)', function () {
      let createForm = function () {
        formHandler.create([
          {
            name: 'username',
            label: 'Username',
            format: 'badType',
            rules: [new formHandler.Requiredrule()]
          }
        ])
      }
      expect(createForm).to.throw(Error, 'The field format must be an instance of Fieldformat')
    })

    describe('Extend a form', function () {

      it('Should add given form fields into extended form fields array', function () {
        let rootForm = formHandler.create([
          {
            name: 'username',
            label: 'Username',
            format: new formHandler.Stringformat(),
            rules: [new formHandler.Requiredrule()]
          },
          {
            name: 'password',
            label: 'Password',
            format: new formHandler.Stringformat(),
            rules: [new formHandler.Requiredrule()]
          }
        ])
        let form = formHandler.create([
          {
            name: 'email',
            label: 'Email',
            format: new formHandler.Emailformat(),
            rules: [new formHandler.Requiredrule()]
          },
          {
            name: 'birthday',
            label: 'Birthday date',
            format: new formHandler.Dateformat()
          }
        ]).extends(rootForm)
        expect(form.fields).to.be.length(4)
      })

      it('Should throw an error on bad param', function () {
        let createExtendedForm = function () {
          let rootForm = {}
          let form = formHandler.create([
            {
              name: 'email',
              label: 'Email',
              format: new formHandler.Emailformat(),
              rules: [new formHandler.Requiredrule()]
            },
            {
              name: 'birthday',
              label: 'Birthday date',
              format: new formHandler.Dateformat()
            }
          ]).extends(rootForm)
        }
        expect(createExtendedForm).to.throw(Error, 'Extends method expects a Form instance')
      })
    })

    describe('Process a form', function () {

      it('should call next on bad method', function () {
        let form = formHandler.create()
        let nextStub = sinon.stub()
        let req = { method: 'get' }
        let res = {}
        let errorArg = new Error()

        form.process(req, res, nextStub)

        expect(nextStub.calledOnce).to.be.true
        expect(nextStub.calledWithExactly(errorArg)).to.be.true
        expect(nextStub.args[0][0].message).to.be.equal('Expected post, put or patch method. get given')
      })

      it('should call next on unknown field', function () {
        let form = formHandler.create([{ name: 'test', label: 'test', format: new formHandler.Stringformat() }])
        let nextStub = sinon.stub()
        let req = { method: 'post', body: {} }
        let res = {}
        let errorArg = new Error()

        form.process(req, res, nextStub)

        expect(nextStub.calledOnce).to.be.true
        expect(nextStub.calledWithExactly(errorArg)).to.be.true
        expect(nextStub.args[0][0].message).to.be.equal('No field found in the request body for the field name: test')
      })

      it('should call check on field, call next and set req form data', function () {
        let form = formHandler.create([{ name: 'test', label: 'test', format: new formHandler.Stringformat() }])
        let nextStub = sinon.stub()
        let checkStub = sinon.spy(form.fields[0], 'check')
        let req = { method: 'post', body: { test: 'test' } }
        let res = {}

        form.process(req, res, nextStub)

        expect(checkStub.calledBefore(nextStub)).to.be.true
        expect(nextStub.calledOnce).to.be.true
        expect(req.form).to.has.ownProperty('body', 'errors', 'isValid')
      })
    })
  })
})
