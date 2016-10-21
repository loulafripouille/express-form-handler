var test = require('unit.js'),
    Form = require('./../..'),
    ErrorHandler = require('./../../lib/error/errorHandler'),
    requiredir = require("require-dir"),
    constraints = requiredir('./../../lib/constraints');

describe('constraints/Equal', function() {

    it('Equal::validate() must return the error string message if there is an error, or return an empty string.', function () {
        var form = Form.create({
            fields: {
                test: {
                    type: 'email',
                    required: true,
                    equal: 'testBis',
                    value: ['testEqualToTestBis']
                },
                testBis: {
                    type: 'string',
                    value: ['testEqualToTestBis']
                }
            }
        });

        var Equal = test.promisifyAll(new constraints['equal'](new ErrorHandler('en')));
        test.promise

            .given(Equal.validateAsync(form.Field.fields.test, form.Field.fields))
            .then(function(res){
                test.value(res).isEmpty()
            })

            .done();

        //Simulate the express req.body used by the Form.handleRequest middleware
        form.Field.fields = {
            test: {
                type: 'email',
                required: true,
                equal: {
                    to: 'testBis'
                },
                value: 'testNotEqualToTestBis'
            },
            testBis: {
                type: 'string',
                value: 'testEqualToTestBis'
            }
        };
        Equal = test.promisifyAll(new constraints['equal'](new ErrorHandler('en')));
        test.promise

            .given(Equal.validateAsync(form.Field.fields.test, form.Field.fields))
            .then(function(res){
                test.value(res).isType('object');
                test.object(res).is({
                    field: 'test',
                    message: 'error.constraints.equal',
                    type: 'equal'
                });
            })

            .done();
    });

    it('Equal::validate() must return the custom error string message when there is one on error', function () {
        var form = Form.create({
            fields: {
                test: {
                    type: 'email',
                    equal: {
                        to: 'testBis',
                        label: 'test bis'
                    },
                    value: 'testNotEqualToTestBis',
                    messages: {
                        equal: 'custom equal message'
                    }
                },
                testBis: {
                    type: 'string',
                    value: 'testEqualToTestBis'
                }
            }
        });

        var Equal = test.promisifyAll(new constraints['equal'](new ErrorHandler('en')));
        test.promise

            .given(Equal.validateAsync(form.Field.fields.test, form.Field.fields))
            .then(function(err){
                test.value(err.message).is('custom equal message');
            })

            .done();
    });
});
