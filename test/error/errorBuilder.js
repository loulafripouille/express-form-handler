'use strict';

var test = require('unit.js'),
    common = require('./../../lib/form/common');

describe('new ErrorBuilder()', function() {
    var ErrorBuilder = require('./../../lib/form/error/errorBuilder');

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

        var ErrorBuilder = require('./../../lib/form/error/errorBuilder');
        ErrorBuilder = new ErrorBuilder('error message', {label: 'test', type:'email', required: true}, common.ERROR_TYPE_INTEGRITY, 'en');
        test.value(ErrorBuilder).isType('object');
        test.object(ErrorBuilder).is({
            field: 'test',
            message: 'error message',
            type: common.ERROR_TYPE_INTEGRITY
        });

    });

    it('Must return the built error object with translated error message (locale = en)', function () {

        var ErrorBuilder = require('./../../lib/form/error/errorBuilder');
        ErrorBuilder = new ErrorBuilder('error.constraints.equal', {label: 'Password', type:'text', required: true, equal: {to: 'passwordConfirm', label: 'Password confirmation'}}, common.ERROR_TYPE_CONSTRAINT_EQUAL, 'en');
        test.value(ErrorBuilder).isType('object');
        test.object(ErrorBuilder).is({
            field: 'Password',
            message: 'The field Password must be equal to the field Password confirmation',
            type: common.ERROR_TYPE_CONSTRAINT_EQUAL
        });

    });

});