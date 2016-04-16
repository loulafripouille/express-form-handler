var test = require('unit.js'),
    Form = require('./..'),
    Field = require('./../lib/form/field'),
    Constraint = require('./../lib/form/constraint');

describe('new Form()', function() {

    var MyForm = new Form();

    it('Form must have a Field member', function () {

        test.object(MyForm).hasProperty('Field');

    });

    it('The Field member must be an instanceOf Field', function () {

        test.object(MyForm.Field).isInstanceOf(Field);

    });

    it('Form must have a Constraint member', function () {

        test.object(MyForm).hasProperty('Constraint');

    });

    it('The Constraint member must be an instanceOf Constraint', function () {

        test.object(MyForm.Constraint).isInstanceOf(Constraint);

    });

    it('Form must have a validator member', function () {

        test.object(MyForm).hasProperty('validator');

    });

    it('The validator member must be the validator node module', function () {

        test.value(MyForm.validator).is(require('validator'));

    });

    it('Form must have a errors member', function () {

        test.object(MyForm).hasProperty('errors');

    });

    it('The errors member must be an empty array', function () {

        test.value(MyForm.errors).is([]);

    });
});

describe('Form::create()', function() {
    var MyForm = new Form();

    it('Form Creation with no params must throws an Error', function () {

        test.function(function() {
            MyForm.create();
        }).throws(Error);

    });

    it('Form Creation with bad params must throws an Error', function () {

        test.function(function() {
            MyForm.create({
                test: {}
            });
        }).throws(Error);

    });

    it('Form Creation must return a Form instance', function () {

        var form = MyForm.create({
            fields: {}
        });
        test.object(form).isInstanceOf(Form);

    });
});

describe('Form::Field#fields', function() {
    var MyForm = new Form();

    it('The form member Field must not be empty and contains the given fields on Form::create()', function () {
        var form = MyForm.create({
            fields: {
                test: {
                    type: 'string',
                    required: true
                }
            }
        });
        test.value(form.Field.fields).isType('object');
        test.object(form.Field.fields).contains({
            test: {
                type: 'string',
                required: true
            }
        });
    });

});

describe('Form::CheckTypeIntegrity() ', function() {
    var MyForm = new Form();

    it('must return boolean', function () {
        var form = MyForm.create({
            fields: {
                test: {
                    type: 'email'
                }
            }
        });

        //Simulate the express req.body used by the Form.handleRequest middleware
        form.body = {
            //value of the test form-field
            test: 'test@gmail.com'
        };

        test.value(form.checkTypeIntegrity(form.Field.fields.test, 'test')).isType('boolean');
        test.bool(form.checkTypeIntegrity(form.Field.fields.test, 'test')).isTrue();

        //Simulate the express req.body used by the Form.handleRequest middleware
        form.body = {
            //value of the test form-field
            test: 'test@test'
        };

        test.value(form.checkTypeIntegrity(form.Field.fields.test, 'test')).isType('boolean');
        test.bool(form.checkTypeIntegrity(form.Field.fields.test, 'test')).isFalse();

        //Simulate the express req.body used by the Form.handleRequest middleware
        form.body = {
            //value of the test form-field
            test: 'test'
        };

        test.value(form.checkTypeIntegrity(form.Field.fields.test, 'test')).isType('boolean');
        test.bool(form.checkTypeIntegrity(form.Field.fields.test, 'test')).isFalse();

        //Simulate the express req.body used by the Form.handleRequest middleware
        form.body = {
            //value of the test form-field
            test: 'test@test..'
        };

        test.value(form.checkTypeIntegrity(form.Field.fields.test, 'test')).isType('boolean');
        test.bool(form.checkTypeIntegrity(form.Field.fields.test, 'test')).isFalse();
    });

});