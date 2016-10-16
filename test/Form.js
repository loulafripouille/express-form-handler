'use strict';

var test = require('unit.js'),
    Form = require('./..'),
    Field = require('./../lib/form/field');

describe('Form::setLocale()', function() {
    it('Form Creation with no locale specified must have locale variable to "en"', function () {

        var form = Form.setLocale();
        test.assert(form === 'en');

    });

    it('Form Creation with locale & file found must return new selected locale', function () {

        var form = Form.setLocale('fr');
        test.assert(form === 'fr');

    });

    it('Form Creation with locale but no file found must return default locale', function () {

        var form = Form.setLocale('es');
        test.assert(form === 'en');

    });
});

describe('Form::create()', function() {
    it('Form Creation with no params must throws an Error', function () {

        test.function(function() {
            Form.create();
        }).throws(Error);

    });

    it('Form Creation with bad params must throws an Error', function () {

        test.function(function() {
            Form.create({
                test: {}
            });
        }).throws(Error);

    });

    it('Form Creation must return a Form instance', function () {

        var form = Form.create({
            fields: {}
        });
        test.value(form).isObject();

    });
});

describe('Form::Field#fields', function() {

    it('The form member Field must not be empty and contains the given fields on Form::create()', function () {
        var form = Form.create({
            fields: {
                test: {
                    type: 'string',
                    required: true
                }
            }
        });
        test.value(form.Field.fields).isType('object');
        test.object(form.Field.fields).contains({
            test: {
                type: 'string',
                required: true
            }
        });
    });

});

describe('Form::extend() ', function() {

    it('with a bad param (not a Form instance) must throw an Error', function () {
        var form = function(){
            Form.create({
                fields: {
                    test: {
                        type: 'email'
                    }
                }
            }).extend('Im a bad param');
        };

        test.function(form).throws(Error);
    });

    it('all ok, must contains the extended form', function () {
        var form = Form.create({
            fields: {
                test1: {
                    type: 'text'
                }
            }
        });

        var formChild = Form.create({
                fields: {
                    test2: {
                        type: 'email'
                    }
                }
            }).extend(form);

        // Contains the two form fields
        test.object(formChild.Field.fields).contains({
            test1: {
                type: 'text'
            },
            test2: {
                type: 'email'
            }
        });

        form = Form.create({fields:{}}).extend(form).extend(formChild);

        // Contains the two form fields
        test.object(form.Field.fields).is({
            test1: {
                label: 'test1',
                type: 'text'
            },
            test2: {
                label: 'test2',
                type: 'email'
            }
        });
    });

    it('must overwrite parent fields', function () {
        var form = Form.create({
            fields: {
                test1: {
                    type: 'text'
                }
            }
        });

        var formChild = Form.create({
            fields : {
                test1: {
                    label: 'test1',
                    type: 'text'
                }
            }
        }).extend(form);

        // Contains the two form fields
        test.object(formChild.Field.fields).is({
            test1: {
                label: 'test1',
                type: 'text'
            }
        });
    });

});