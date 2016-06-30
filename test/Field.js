'use strict';

var test = require('unit.js'),
    common = require('./../lib/form/common'),
    Field = require('./../lib/form/field'),
    ErrorHandler = require('./../lib/form/error/errorHandler'),
    Constraint = require('./../lib/form/constraint');

describe('new Field()', function() {

    var MyField = new Field();

    it('Field must have a fields member', function () {

        test.object(MyField).hasProperty('fields');

    });

    it('The fields member must be an object', function () {

        test.value(MyField.fields).isType('object');

    });

    it('The fields member must be an empty object', function () {

        test.object(MyField.fields).isEmpty();

    });
});

describe('Field::add()', function() {

    it('Must add the given field to Field::fields member', function () {
        var MyField = new Field();

        MyField.add('test', {
                type: 'string',
                required: true
        });

        test.object(MyField.fields).contains({
            test: {
                type: 'string',
                required: true
            }
        });
    });

    it('Must throw an Error if there is no type given in the field added', function () {
        var MyField = new Field();

        var testAdd = function() {
            MyField.add('test', {
                required: true
            });
        };

        test.function(testAdd).throws(Error);
    });
});

describe('Field::CheckType() ', function() {

    it('must return true', function () {
        var MyField = new Field();
        MyField = test.promise.promisifyAll(MyField);
        MyField.fields = {
            test: {
                type: 'email',
                value: 'test@gmail.com'
            }
        };
        MyField.ErrorHandler = new ErrorHandler('en');
        MyField.Constraint = new Constraint(MyField.ErrorHandler, MyField.fields);
        test.promise

            .given(MyField.checkTypeAsync(MyField.fields.test))

            .then(function(res){
                test.value(res).isType('boolean');
                test.bool(res).isTrue();
            })

            .done();

        MyField.fields = {
            test: {
                type: 'email',
                value: ['test@gmail.com', 'test2@gmail.com']
            }
        };
        test.promise

            .given(MyField.checkTypeAsync(MyField.fields.test))

            .then(function(res){
                test.value(res).isType('boolean');
                test.bool(res).isTrue();
            })

            .done();

    });

    it('must return false', function() {
        var MyField = new Field();
        MyField = test.promise.promisifyAll(MyField);
        MyField.ErrorHandler = new ErrorHandler('en');
        MyField.fields = {
            test: {
                type: 'email',
                value: ['test@test', 'test']
            }
        };
        MyField.Constraint = new Constraint(MyField.ErrorHandler, MyField.fields);
        test.promise

            .given(MyField.checkTypeAsync(MyField.fields.test))

            .then(function(res){
                test.value(res).isType('boolean');
                test.bool(res).isFalse();
            })

            .done();

        MyField.fields = {
            test: {
                type: 'email',
                value: 'test@gmail'
            }
        };
        test.promise

            .given(MyField.checkTypeAsync(MyField.fields.test))

            .then(function(res){
                test.value(res).isType('boolean');
                test.bool(res).isFalse();
            })

            .done();

        MyField.fields = {
            test: {
                type: 'email',
                value: 'test@gmail..'
            }
        };
        test.promise

            .given(MyField.checkTypeAsync(MyField.fields.test))

            .then(function(res){
                test.value(res).isType('boolean');
                test.bool(res).isFalse();
            })

            .done();
    });
});

describe('Field::checkConstraints() ', function() {

    it('must return true (has error(s))', function () {
        var MyField = new Field();
        MyField = test.promise.promisifyAll(MyField);
        MyField.ErrorHandler = new ErrorHandler('en');
        MyField.fields = {
            test: {
                label: 'email',
                type: 'email',
                value: 'test@test.test',
                equal: {
                    label: 'email bis',
                    to: 'testBis'
                }
            },
            testBis: {
                label: 'emailBis',
                type: 'email',
                value: 'testBis@test.test'
            }
        };
        MyField.Constraint = new Constraint(MyField.ErrorHandler, MyField.fields);
        test.promise

            .given(MyField.checkConstraintsAsync(MyField.fields.test))

            .then(function(){
                test.value(MyField.Constraint.hasErrors()).isType('boolean');
                test.bool(MyField.Constraint.hasErrors()).isTrue();
            })

            .done();

        MyField.fields = {
            test: {
                type: 'email',
                value: [],
                require: true
            }
        };
        test.promise

            .given(MyField.checkConstraintsAsync(MyField.fields.test))

            .then(function(){
                test.value(MyField.Constraint.hasErrors()).isType('boolean');
                test.bool(MyField.Constraint.hasErrors()).isTrue();
            })

            .done();
    });

    it('must return false (no errors)', function () {
        var MyField = new Field();
        MyField = test.promise.promisifyAll(MyField);
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
        MyField.Constraint = new Constraint(MyField.ErrorHandler, MyField.fields);
        test.promise

            .given(MyField.checkConstraintsAsync(MyField.fields.test))

            .then(function(){
                test.value(MyField.Constraint.hasErrors()).isType('boolean');
                test.bool(MyField.Constraint.hasErrors()).isFalse();
            })

            .done();

        MyField.fields = {
            test: {
                type: 'string',
                value: ['one', 'two'],
                require: true
            }
        };
        test.promise

            .given(MyField.checkConstraintsAsync(MyField.fields.test))

            .then(function(){
                test.value(MyField.Constraint.hasErrors()).isType('boolean');
                test.bool(MyField.Constraint.hasErrors()).isFalse();
            })

            .done();
    });

});