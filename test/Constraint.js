'use strict';

var test = require('unit.js'),
    Form = require('./..');

describe('new Constraint()', function() {

    var Constraint = require('./../lib/form/constraint');
    Constraint = new Constraint();

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
        var MyForm = new Form();
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
            test: 'testNotEqualToTestBis',
            testBis: 'testEqualToTestBis'
        };
        var MyConstraint = new Constraint();
        MyConstraint.check(form.Field.fields.test, 'test', form.body);
        test.value(MyConstraint.errors).isNotEmpty();

        //Simulate the express req.body used by the Form.handleRequest middleware
        form.body = {
            //value of the test form-field
            test: 'testEqualToTestBis',
            testBis: 'testEqualToTestBis'
        };
        MyConstraint = new Constraint();
        MyConstraint.check(form.Field.fields.test, 'test', form.body);
        test.value(MyConstraint.errors).isEmpty();

    });
});

describe('Constraint::hasErrors()', function () {
    var Constraint = require('./../lib/form/constraint');

    it('Must return boolean, true if there are errors or false if not', function(){
        var MyConstraint = new Constraint();
        test.value(MyConstraint.hasErrors()).isType('boolean');
        test.bool(MyConstraint.hasErrors()).isFalse();

        MyConstraint.errors = {test: 'the field test is required'};
        test.value(MyConstraint.hasErrors()).isType('boolean');
        test.bool(MyConstraint.hasErrors()).isTrue();
    });

});