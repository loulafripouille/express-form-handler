var common = require('./../common'),
    Field = require('./../field'),
    ErrorHandlerObject = require('./../error/errorHandler');

/**
 *
 * @param {ErrorHandler} ErrorHandler
 * @constructor
 */
var Custom = function (ErrorHandler) {
    'use strict';

    if(!ErrorHandler || !ErrorHandler instanceof ErrorHandlerObject) {

        throw new Error('[express-form-handler] Bad parameter for new Require instance. Expected: an ErrorHandler instance');
    }

    /**
     *
     * @param field
     * @param fieldName
     * @param body
     * @param cb
     */
    this.validate = function(field, fieldName, body, cb) {
        var error = '',
            fieldsHelper = new Field(),
            customReturn;

        if('function' !== typeof field.custom) {
            throw new Error('[express-form-handler] A custom constraint must be a function');
        }

        customReturn = field.custom(body[fieldName]);

        if('boolean' !== typeof customReturn) {
            throw new Error('[express-form-handler] A custom constraint must return a boolean');
        }

        if(false === customReturn) {
            error = ErrorHandler.newError(fieldsHelper.getErrorMessage(field, common.ERROR_TYPE_CONSTRAINT_CUSTOM), fieldName, common.ERROR_TYPE_CONSTRAINT_CUSTOM);
        }

        if('function' === typeof cb) return cb(error);
        return error;
    }
};

/**
 *
 * @type {Require}
 */
module.exports = Custom;