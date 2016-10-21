'use strict';

var test = require('unit.js'),
    ErrorHandler = require('./../lib/error/errorHandler'),
    Field = require('./../lib/field');

describe('new Constraint() must respect some ', function() {

    var Constraint = require('./../lib/constraint');
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

    var Constraint = require('./../lib/constraint');

    it('Must set Constraint::errors on error', function () {
        var MyField = new Field();
        MyField.ErrorHandler = new ErrorHandler('en');
        MyField.fields = {
            test: {
                type: 'email',
                value: 'test@test.test',
                equalTo: 'testBis'
            },
            testBis: {
                type: 'email',
                value: 'test@test.test'
            }
        };
        var MyConstraint = new Constraint(MyField.ErrorHandler, MyField.fields);
        MyConstraint = test.promise.promisifyAll(MyConstraint);
        test.promise

            .given(MyConstraint.checkAsync(MyField.fields.test))

            .then(function(){
                test.value(MyConstraint.hasErrors()).isType('boolean');
                test.bool(MyConstraint.hasErrors()).isFalse();
            })

            .done();
    });
});

describe('Constraint::hasErrors()', function () {
    var Constraint = require('./../lib/constraint');

    it('Must return boolean, true if there are errors or false if not', function(){
        var MyConstraint = new Constraint(new ErrorHandler('en'), []);
        test.value(MyConstraint.hasErrors()).isType('boolean');
        test.bool(MyConstraint.hasErrors()).isFalse();

        MyConstraint.errors.push({test: 'the field test is required'});
        test.value(MyConstraint.hasErrors()).isType('boolean');
        test.bool(MyConstraint.hasErrors()).isTrue();
    });

});