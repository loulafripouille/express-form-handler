'use strict';

var test = require('unit.js'),
    ErrorHandler = require('./../lib/form/error/errorHandler'),
    Form = require('./..');

describe('new Constraint() must respect some ', function() {

    var Constraint = require('./../lib/form/constraint');
    Constraint = new Constraint(new ErrorHandler('en'), []);

    it('Constraint must have a constraints member', function () {

        test.object(Constraint).hasProperty('constraints');

    });

    it('The constraints member must be an object', function () {

        test.value(Constraint.constraints).isType('object');

    });

    it('The constraints member must not be an empty object', function () {

        test.object(Constraint.constraints).isNotEmpty();

    });

    it('The constraints member must contain all constraints', function () {

        test.object(Constraint.constraints).hasProperty('equal');
        test.object(Constraint.constraints).hasProperty('required');
        test.object(Constraint.constraints).hasProperty('custom');

    });

    it('Constraint must have an errors member', function () {

        test.object(Constraint).hasProperty('errors');

    });

    it('The errors member must be an object', function () {

        test.value(Constraint.errors).isType('object');

    });

    it('The errors member must be an empty object', function () {

        test.object(Constraint.errors).isEmpty();

    });
});

describe('Constraint::check()', function() {

    var Constraint = require('./../lib/form/constraint');

    it('Must set Constraint::errors on error', function () {
        var form = Form.create({
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
            test: 'testNotEqualToTestBis',
            testBis: 'testEqualToTestBis'
        };
        var MyConstraint = new Constraint(new ErrorHandler('en'), []);
        MyConstraint.check(form.Field.fields.test, form.body);
        test.array(MyConstraint.errors).isNotEmpty();

        //Simulate the express req.body used by the Form.handleRequest middleware
        form.body = {
            //value of the test form-field
            test: 'testEqualToTestBis',
            testBis: 'testEqualToTestBis'
        };
        MyConstraint = new Constraint(new ErrorHandler('en'), []);
        MyConstraint.check(form.Field.fields.test, form.body);
        test.array(MyConstraint.errors).isEmpty();

    });
});

describe('Constraint::hasErrors()', function () {
    var Constraint = require('./../lib/form/constraint');

    it('Must return boolean, true if there are errors or false if not', function(){
        var MyConstraint = new Constraint(new ErrorHandler('en'), []);
        test.value(MyConstraint.hasErrors()).isType('boolean');
        test.bool(MyConstraint.hasErrors()).isFalse();

        MyConstraint.errors.push({test: 'the field test is required'});
        test.value(MyConstraint.hasErrors()).isType('boolean');
        test.bool(MyConstraint.hasErrors()).isTrue();
    });

});