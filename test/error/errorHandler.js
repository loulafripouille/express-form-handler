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
    ErrorHandler = new ErrorHandler('en');

    it('Must throws an error if the given locale is not available', function () {

        var fn = function() {
            new ErrorHandler('jn');
        };
        test.function(fn).throws(Error);

    });

    it('Must throws an error if the err type not exists', function () {

        var fn = function() {
            ErrorHandler.newError({label: 'test', messages: {integrity: 'message'}}, 'errtypeundefined');
        };
        test.function(fn).throws(Error);

    });

    it('Otherwise, must return an object', function () {

        test.value(ErrorHandler.newError({label: 'test', messages: {integrity: 'message'}}, 'integrity')).isType('object');
        test.object(ErrorHandler.newError({label: 'test', messages: {integrity: 'message'}}, 'integrity')).is({
            field: 'test',
            message: 'message',
            type: 'integrity'
        });

    });
});

//TODO
describe('Field::getErrorMessage()', function() {

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