'use strict';

var test = require('unit.js'),
    common = require('./../lib/form/common'),
    Field = require('./../lib/form/field');

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

//TODO
describe('Form::CheckTypeIntegrity() ', function() {

    it('must return true', function () {
        var form = Form.create({
            fields: {
                test: {
                    type: 'email'
                }
            }
        });
        form = test.promise.promisifyAll(form);

        //Simulate the express req.body used by the Form.handleRequest middleware
        form.body = {
            //value of the test form-field
            test: 'test@gmail.com'
        };

        test.promise

            .given(form.checkTypeIntegrityAsync(form.Field.fields.test, 'test'))

            .then(function(res){
                test.value(res).isType('boolean');
                test.bool(res).isTrue();
            })

            .done();

    });

    it('must return false', function() {
        var form = Form.create({
            fields: {
                test: {
                    type: 'email'
                }
            }
        });
        form = test.promise.promisifyAll(form);

        //Simulate the express req.body used by the Form.handleRequest middleware
        form.body = {
            //value of the test form-field
            test: ['test@test', 'test2']
        };

        test.promise

            .given(form.checkTypeIntegrityAsync(form.Field.fields.test, 'test'))

            .then(function(res){
                test.value(res).isType('boolean');
                test.bool(res).isFalse();
            })

            .done();




        //Simulate the express req.body used by the Form.handleRequest middleware
        form.body = {
            //value of the test form-field
            test: 'test'
        };

        test.promise

            .given(form.checkTypeIntegrityAsync(form.Field.fields.test, 'test'))

            .then(function(res){
                test.value(res).isType('boolean');
                test.bool(res).isFalse();
            })

            .done();

        //Simulate the express req.body used by the Form.handleRequest middleware
        form.body = {
            //value of the test form-field
            test: 'test@test..'
        };

        test.promise

            .given(form.checkTypeIntegrityAsync(form.Field.fields.test, 'test'))

            .then(function(res){
                test.value(res).isType('boolean');
                test.bool(res).isFalse();
            })

            .done();
    });
});

describe('Form::checkConstraints() ', function() {

    it('must return true (has error(s))', function () {
        var form = Form.create({
            fields: {
                test: {
                    type: 'email',
                    required: true
                }
            }
        });
        form.Constraint = new Constraint(form.ErrorHandler);
        form = test.promise.promisifyAll(form);

        //Simulate the express req.body used by the Form.handleRequest middleware
        form.body = {
            //value of the test form-field
            test: ''
        };

        test.promise

            .given(form.checkConstraintsAsync(form.Field.fields.test, 'test'))

            .then(function(){
                test.value(form.Constraint.hasErrors()).isType('boolean');
                test.bool(form.Constraint.hasErrors()).isFalse();
            })

            .done();

        //Simulate the express req.body used by the Form.handleRequest middleware
        form.body = {
            //value of the test form-field
            test: ' '
        };

        test.promise

            .given(form.checkConstraintsAsync(form.Field.fields.test, 'test'))

            .then(function(){
                test.value(form.Constraint.hasErrors()).isType('boolean');
                test.bool(form.Constraint.hasErrors()).isFalse();
            })

            .done();
    });

    it('must return false (no errors)', function () {
        var form = Form.create({
            fields: {
                test: {
                    type: 'email',
                    required: true
                }
            }
        });
        form.Constraint = new Constraint(form.ErrorHandler);
        form = test.promise.promisifyAll(form);

        //Simulate the express req.body used by the Form.handleRequest middleware
        form.body = {
            //value of the test form-field
            test: '.'
        };

        test.promise

            .given(form.checkConstraintsAsync(form.Field.fields.test, 'test'))

            .then(function(){
                test.value(form.Constraint.hasErrors()).isType('boolean');
                test.bool(form.Constraint.hasErrors()).isFalse();
            })

            .done();

        //Simulate the express req.body used by the Form.handleRequest middleware
        form.body = {
            //value of the test form-field
            test: ' dd '
        };

        test.promise

            .given(form.checkConstraintsAsync(form.Field.fields.test, 'test'))

            .then(function(){
                test.value(form.Constraint.hasErrors()).isType('boolean');
                test.bool(form.Constraint.hasErrors()).isFalse();
            })

            .done();

        //Simulate the express req.body used by the Form.handleRequest middleware
        form.body = {
            //value of the test form-field
            test: 'false'
        };

        test.promise

            .given(form.checkConstraintsAsync(form.Field.fields.test, 'test'))

            .then(function(){
                test.value(form.Constraint.hasErrors()).isType('boolean');
                test.bool(form.Constraint.hasErrors()).isFalse();
            })

            .done();

        //Simulate the express req.body used by the Form.handleRequest middleware
        form.body = {
            //value of the test form-field
            test: '0'
        };

        test.promise

            .given(form.checkConstraintsAsync(form.Field.fields.test, 'test'))

            .then(function(){
                test.value(form.Constraint.hasErrors()).isType('boolean');
                test.bool(form.Constraint.hasErrors()).isFalse();
            })

            .done();
    });

});