'use strict';

var test = require('unit.js');

describe('new ErrorHandler()', function() {
    var ErrorHandler = require('./../../lib/form/error/errorHandler');

    it('must throws an error on construct if no fields parameter or no locale parameter are given', function () {

        var newErrorHandler = function() {
            new ErrorHandler({});
        };
        test.function(newErrorHandler).throws(Error);

        newErrorHandler = function() {
            new ErrorHandler(null, 'en');
        };
        test.function(newErrorHandler).throws(Error);

        newErrorHandler = function() {
            new ErrorHandler();
        };
        test.function(newErrorHandler).throws(Error);

    });

});

describe('ErrorHandler::newError()', function() {
    var ErrorHandler = require('./../../lib/form/error/errorHandler');
    ErrorHandler = new ErrorHandler(
        {
            test: {label: 'test', type: 'email', required: true}
        },
        'en'
    );

    it('Must throws an error if the field given for the error is not in the fields array given on ErrorHandler construct', function () {

        var fn = function() {
            ErrorHandler.newError('message', 'testBis', 'integrity');
        };
        test.function(fn).throws(Error);

    });

    it('Otherwise, must return an object', function () {

        test.value(ErrorHandler.newError('message', 'test', 'integrity')).isType('object');
        test.object(ErrorHandler.newError('message', 'test', 'integrity')).is({
            field: 'test',
            message: 'message',
            type: 'integrity'
        });

    });
});