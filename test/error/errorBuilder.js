'use strict';

var test = require('unit.js'),
    common = require('./../../lib/common'),
    ErrorBuilder = require('./../../lib/error/errorBuilder');

//TODO FIX
describe('new ErrorBuilder()', function() {

    it('Expected four parameters: message, field, type and locale. Otherwise, throws an Error', function () {

        var newError= function() {
            new ErrorBuilder();
        };
        test.function(newError).throws(Error);

        newError = function() {
            new ErrorBuilder('message');
        };
        test.function(newError).throws(Error);

        newError = function() {
            new ErrorBuilder('message', {});
        };
        test.function(newError).throws(Error);

        newError = function() {
            new ErrorBuilder('message', {}, 'integrity');
        };
        test.function(newError).throws(Error);

    });

    it('Must return the built error object', function () {

        var errorBuilder = new ErrorBuilder(
            'error message',
            {label: 'test', type:'email', required: true},
            common.ERROR_TYPE_INTEGRITY,
            'en'
        )
        ;
        test.value(errorBuilder).isType('object');
        test.object(errorBuilder).is({
            field: 'test',
            message: 'error message',
            type: common.ERROR_TYPE_INTEGRITY
        });

    });

    it('Must return the built error object with translated error message (locale = en)', function () {

        var errorBuilder = new ErrorBuilder(
            'error.constraints.equal',
            {label: 'Password', type:'text', required: true, equal: {to: 'passwordConfirm', label: 'Password confirmation'}},
            common.ERROR_TYPE_CONSTRAINT_EQUAL,
            'en'
        );

        test.value(errorBuilder).isType('object');
        test.object(errorBuilder).is({
            field: 'Password',
            message: 'The field Password must be equal to the field Password confirmation',
            type: common.ERROR_TYPE_CONSTRAINT_EQUAL
        });

    });

    it('Must return the built error object with the custom error message', function () {

        var errorBuilder = new ErrorBuilder(
            'They must be equal!',
            {
                label: 'Password',
                type:'text',
                required: true,
                equal: {
                    to: 'passwordConfirm',
                    label: 'Password confirmation'
                },
                messages: {
                    equal: 'They must be equal!'
                }
            },
            common.ERROR_TYPE_CONSTRAINT_EQUAL,
            'en'
        );

        test.value(errorBuilder).isType('object');
        test.object(errorBuilder).is({
            field: 'Password',
            message: 'They must be equal!',
            type: common.ERROR_TYPE_CONSTRAINT_EQUAL
        });

    });

});