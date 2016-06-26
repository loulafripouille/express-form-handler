var test = require('unit.js'),
    Form = require('./../..'),
    ErrorHandler = require('./../../lib/form/error/errorHandler'),
    requiredir = require("require-dir"),
    constraints = requiredir('./../../lib/form/constraints');

describe('constraints/Required', function() {

    it('Required::validate() must return the error string message if there is an error, or return an empty string.', function () {
        var form = Form.create({
            fields: {
                test: {
                    type: 'email',
                    required: true
                }
            }
        });

        //Simulate the express req.body used by the Form.handleRequest middleware
        form.body = {
            //value of the test form-field
            test: ''
        };
        var Require = test.promisifyAll(new constraints['required'](new ErrorHandler('en')));
        test.promise

            .given(Require.validateAsync(form.Field.fields.test, form.Field.fields))
            .then(function(res){
                test.value(res).isObject();
            })

            .done();

        //Simulate the express req.body used by the Form.handleRequest middleware
        form.body = {
            //value of the test form-field
            test: 'required is true'
        };
        test.promise

            .given(Require.validateAsync(form.Field.fields.test, form.Field.fields))
            .then(function(res){
                test.value(res).isEmpty();
            })

            .done();
    });

    it('Required::validate() must return the custom error string message if there is one on error.', function () {
        var form = Form.create({
            fields: {
                test: {
                    type: 'email',
                    required: true,
                    messages: {
                        required: 'test required custom message'
                    }
                }
            }
        });
        var Require = test.promisifyAll(new constraints['required'](new ErrorHandler('en')));

        //Simulate the express req.body used by the Form.handleRequest middleware
        form.body = {
            //value of the test form-field
            test: ''
        };
        test.promise

            .given(Require.validateAsync(form.Field.fields.test, form.Field.fields))
            .then(function(err){
                test.value(err).isObject();
                test.value(err.message).is('test required custom message');
            })

            .done();
    });
});