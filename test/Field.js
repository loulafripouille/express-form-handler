'use strict';

var test = require('unit.js');

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