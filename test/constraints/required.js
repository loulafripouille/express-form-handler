var test = require('unit.js'),
    Form = require('./../..'),
    constraints = require('./../../lib/form/constraints');

describe('constraints/required', function() {
    var MyForm = new Form();

    it('Required::validate() must return the error string message if there is an error, or return an empty string.', function () {
        var form = MyForm.create({
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
        var Required = new constraints['required']();
        test.value(Required.validate(form.Field.fields.test, 'test', form.body)).isNotEmpty();

        //Simulate the express req.body used by the Form.handleRequest middleware
        form.body = {
            //value of the test form-field
            test: 'required is true'
        };
        Required = new constraints['required']();
        test.value(Required.validate(form.Field.fields.test, 'test', form.body)).isEmpty();
    });
});