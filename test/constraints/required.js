var test = require('unit.js'),
    Form = require('./../..'),
    ErrorHandler = require('./../../lib/form/error/errorHandler'),
    requiredir = require("require-dir"),
    constraints = requiredir('./../../lib/form/constraints');

//TODO FIX
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
        var Required = new constraints['required'](new ErrorHandler(form.Field.fields, 'en'));
        test.value(Required.validate(form.Field.fields.test, 'test', form.body)).isNotEmpty();

        //Simulate the express req.body used by the Form.handleRequest middleware
        form.body = {
            //value of the test form-field
            test: 'required is true'
        };
        Required = new constraints['required'](new ErrorHandler(form.Field.fields, 'en'));
        test.value(Required.validate(form.Field.fields.test, 'test', form.body)).isEmpty();
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

        //Simulate the express req.body used by the Form.handleRequest middleware
        form.body = {
            //value of the test form-field
            test: ''
        };
        var Required = new constraints['required'](new ErrorHandler(form.Field.fields, 'en'));
        var err = Required.validate(form.Field.fields.test, 'test', form.body);
        test.value(err.message).is('test required custom message');

    });
});