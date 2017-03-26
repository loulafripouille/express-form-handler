/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const rewire = require('rewire')
const Field = rewire('./../../lib/field/field')
const Form = require('./../..')

describe('Field module', function () {
  describe('create a new field instance', function () {
    it('must throw an error on bad format', function () {
      let newfield = function () {
        let field = new Field({ name: 'test', label: 'test', format: 'email' })
      }

      expect(newfield).to.throw(Error, 'The field format must be an instance of Fieldformat')
    })

    it('must throw an error on bad rule', function () {
      let newfield = function () {
        let field = new Field({ name: 'test', label: 'test', format: Form.format.email(), rules: 'required' })
      }

      expect(newfield).to.throw(Error, 'A field rule must be an instance of Fieldrule')
    })

    it('must throw an error on missing property', function () {
      let newfield = function () {
        let field = new Field({ label: 'test', format: Form.format.email() })
      }

      expect(newfield).to.throw(Error, 'A field must has name, label and format properties')
    })

    it('must return a new instance', function () {
      let field = new Field({ name: 'test', label: 'test', format: Form.format.email() })
      expect(field.constructor.name).to.be.equal('Field')
      expect(field).to.has.ownProperty('definition', 'value', 'errors', 'checked')
      expect(field).to.respondTo('check')
    })
  })

  describe('check a field', function () {
    it('must call the field format check method', sinon.test(function () {
      let field = new Field({ name: 'test', label: 'test', format: Form.format.email() })
      let formatCheckStub = this.stub(field.definition.format, 'check')

      formatCheckStub.returns(true)

      field.value = 'test@test.com'
      field.check([])

      expect(formatCheckStub.calledOnce).to.be.true
      expect(formatCheckStub.calledWithExactly(field.definition, [])).to.be.true
    }))

    it('must reset the field format errors', sinon.test(function () {
      let field = new Field({ name: 'test', label: 'test', format: Form.format.email() })
      let formatCheckStub = this.stub(field.definition.format, 'check')

      formatCheckStub.returns(true)

      field.value = 'test@test.com'
      field.check()

      expect(field.definition.format.error).to.be.null
    }))

    it('must call the field rule check method', sinon.test(function () {
      let field = new Field(
        {
          name: 'test',
          label: 'test',
          format: Form.format.email(),
          rules: Form.rule.required()
        }
      )
      let formatCheckStub = this.stub(field.definition.format, 'check')
      let ruleCheckStub = this.stub(field.definition.rules, 'check')

      formatCheckStub.returns(true)
      ruleCheckStub.returns(true)

      field.value = 'test@test.com'
      field.check([])

      expect(formatCheckStub.calledBefore(ruleCheckStub)).to.be.true
      expect(formatCheckStub.calledWithExactly(field.definition, [])).to.be.true
      expect(ruleCheckStub.calledOnce).to.be.true
      expect(formatCheckStub.calledWithExactly(field.definition, [])).to.be.true
    }))

    it('must call generateErrors function on a field format error', sinon.test(function () {
      let field = new Field(
        {
          name: 'test',
          label: 'test',
          format: Form.format.email(),
          rules: Form.rule.required()
        }
      )
      let formatCheckStub = this.stub(field.definition.format, 'check')
      let ruleCheckStub = this.stub(field.definition.rules, 'check')
      let generateErrorsSpy = this.spy()
      Field.__set__('generateErrors', generateErrorsSpy)

      formatCheckStub.returns(false)
      ruleCheckStub.returns(true)

      field.value = 'test@test.com'
      field.check([])

      expect(formatCheckStub.calledBefore(generateErrorsSpy)).to.be.true
      expect(formatCheckStub.calledWithExactly(field.definition, [])).to.be.true
      expect(generateErrorsSpy.calledOnce).to.be.true
    }))

    it('must call generateErrors function on a field rule error', sinon.test(function () {
      let field = new Field(
        {
          name: 'test',
          label: 'test',
          format: Form.format.email(),
          rules: Form.rule.required()
        }
      )
      let formatCheckStub = this.stub(field.definition.format, 'check')
      let ruleCheckStub = this.stub(field.definition.rules, 'check')
      let generateErrorsSpy = this.spy()
      Field.__set__('generateErrors', generateErrorsSpy)

      formatCheckStub.returns(true)
      ruleCheckStub.returns(false)

      field.value = 'test@test.com'
      field.check([])

      expect(formatCheckStub.calledBefore(ruleCheckStub)).to.be.true
      expect(formatCheckStub.calledWithExactly(field.definition, [])).to.be.true
      expect(ruleCheckStub.calledBefore(generateErrorsSpy)).to.be.true
      expect(ruleCheckStub.calledWithExactly(field.definition, [])).to.be.true
      expect(generateErrorsSpy.calledOnce).to.be.true
    }))
  })
})
