'use strict';

var test = require('unit.js');

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

    it('Must return the error object', function () {

        var ErrorBuilder = require('./../../lib/form/error/errorBuilder');
        ErrorBuilder = new ErrorBuilder('error message', {label: 'test', type:'email', required: true}, 'integrity', 'en');
        test.value(ErrorBuilder).isType('object');
        test.object(ErrorBuilder).is({
            field: 'test',
            message: 'error message',
            type: 'integrity'
        });

    });

});