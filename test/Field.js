'use strict';

var test = require('unit.js'),
    common = require('./../lib/form/common');

describe('new Field()', function() {

    var Field = require('./../lib/form/field');
    Field = new Field();

    it('Field must have a fields member', function () {

        test.object(Field).hasProperty('fields');

    });

    it('The fields member must be an object', function () {

        test.value(Field.fields).isType('object');

    });

    it('The fields member must be an empty object', function () {

        test.object(Field.fields).isEmpty();

    });
});

describe('Field::add()', function() {

    var Field = require('./../lib/form/field');

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

describe('Field::getErrorMessage()', function() {

    var Field = require('./../lib/form/field');

    it('Must return the error message defined in the field object', function () {
        var MyField = new Field();

        var message = MyField.getErrorMessage({
            label: 'test',
            type: 'text',
            messages: {
                integrity: 'this field %field% is required'
            }
        }, common.ERROR_TYPE_INTEGRITY);

        test.value(message).is('this field %field% is required');
    });

    it('Must return the default error message when no message is defined in the field object', function () {
        var MyField = new Field();

        var message = MyField.getErrorMessage({
            label: 'test',
            type: 'text',
            messages: {}
        }, common.ERROR_TYPE_INTEGRITY);

        test.value(message).is('error.integrity');
    });
});