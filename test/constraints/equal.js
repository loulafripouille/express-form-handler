var test = require('unit.js'),
    Form = require('./../..'),
    ErrorHandler = require('./../../lib/form/error/errorHandler'),
    requiredir = require("require-dir"),
    constraints = requiredir('./../../lib/form/constraints');

describe('constraints/Equal', function() {
    var MyForm = new Form();

    it('Equal::validate() must return the error string message if there is an error, or return an empty string.', function () {
        var form = MyForm.create({
            fields: {
                test: {
                    type: 'email',
                    required: true,
                    equal: 'testBis'
                },
                testBis: {
                    type: 'string'
                }
            }
        });

        //Simulate the express req.body used by the Form.handleRequest middleware
        form.body = {
            //value of the test form-field
            test: 'testEqualToTestBis',
            testBis: 'testEqualToTestBis'
        };
        var Equal = new constraints['equal'](new ErrorHandler(form.Field.fields, 'en'));
        test.value(Equal.validate(form.Field.fields.test, 'test', form.body)).isEmpty();

        //Simulate the express req.body used by the Form.handleRequest middleware
        form.body = {
            //value of the test form-field
            test: 'testNotEqualToTestBis',
            testBis: 'testEqualToTestBis'
        };
        Equal = new constraints['equal'](new ErrorHandler(form.Field.fields, 'en'));
        test.value(Equal.validate(form.Field.fields.test, 'test', form.body)).isNotEmpty();
    });

    it('Equal::validate() must return the custom error string message when there is one on error', function () {
        var form = MyForm.create({
            fields: {
                test: {
                    type: 'email',
                    equal: {
                        to: 'testBis',
                        label: 'test bis'
                    },
                    messages: {
                        equal: 'custom equal message'
                    }
                },
                testBis: {
                    type: 'string'
                }
            }
        });

        //Simulate the express req.body used by the Form.handleRequest middleware
        form.body = {
            //value of the test form-field
            test: 'testNotEqualToTestBis',
            testBis: 'testEqualToTestBis'
        };
        Equal = new constraints['equal'](new ErrorHandler(form.Field.fields, 'en'));
        var err = Equal.validate(form.Field.fields.test, 'test', form.body);
        test.value(err.message).is('custom equal message');
    });
});
