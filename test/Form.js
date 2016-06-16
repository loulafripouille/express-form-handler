var test = require('unit.js'),
    Form = require('./..'),
    Field = require('./../lib/form/field');

describe('Form::create()', function() {
    it('Form Creation with no params must throws an Error', function () {

        test.function(function() {
            Form.create();
        }).throws(Error);

    });

    it('Form Creation with bad params must throws an Error', function () {

        test.function(function() {
            Form.create({
                test: {}
            });
        }).throws(Error);

    });

    it('Form Creation must return a Form instance', function () {

        var form = Form.create({
            fields: {}
        });
        test.value(form).isObject();

    });
});

describe('Form::Field#fields', function() {

    it('The form member Field must not be empty and contains the given fields on Form::create()', function () {
        var form = Form.create({
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

    it('must return boolean', function () {
        var form = Form.create({
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
            test: ['test@test', 'test2']
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

describe('Form::extend() ', function() {

    it('with a bad param (not a Form instance) must throw an Error', function () {
        var form = function(){
            Form.create({
                fields: {
                    test: {
                        type: 'email'
                    }
                }
            }).extend('Im a bad param');
        };

        test.function(form).throws(Error);
    });

    it('all ok, must contains the extended form', function () {
        var form = Form.create({
            fields: {
                test1: {
                    type: 'text'
                }
            }
        });

        var formChild = Form.create({
                fields: {
                    test2: {
                        type: 'email'
                    }
                }
            }).extend(form);

        // Contains the two form fields
        test.object(formChild.Field.fields).contains({
            test1: {
                type: 'text'
            },
            test2: {
                type: 'email'
            }
        });

        form = Form.create({fields:{}}).extend(form).extend(formChild);

        // Contains the two form fields
        test.object(form.Field.fields).is({
            test1: {
                label: 'test1',
                type: 'text'
            },
            test2: {
                label: 'test2',
                type: 'email'
            }
        });
    });

    it('must overwrite parent fields', function () {
        var form = Form.create({
            fields: {
                test1: {
                    type: 'text'
                }
            }
        });

        var formChild = Form.create({
            fields : {
                test1: {
                    label: 'test1',
                    type: 'text'
                }
            }
        }).extend(form);

        // Contains the two form fields
        test.object(formChild.Field.fields).is({
            test1: {
                label: 'test1',
                type: 'text'
            }
        });
    });

});