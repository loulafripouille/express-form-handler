var common = require('./../common'),
    Field = require('./../field'),
    ErrorHandlerObject = require('./../error/errorHandler');

/**
 *
 * @param {ErrorHandler} ErrorHandler
 * @constructor
 */
var Require = function (ErrorHandler) {
    'use strict';

    if(!ErrorHandler || !ErrorHandler instanceof ErrorHandlerObject) {

        throw new Error('[express-form-handler] Bad parameter for new Require instance. Expected: an ErrorHandler instance');
    }

    /**
     *
     * @param field
     * @param fieldName
     * @param body
     */
    this.validate = function(field, fieldName, body) {
        var error = '';
        var fieldsHelper = new Field();

        if(!body[fieldName]) {
            error = ErrorHandler.newError(fieldsHelper.getErrorMessage(field, common.ERROR_TYPE_CONSTRAINT_REQUIRED), fieldName, common.ERROR_TYPE_CONSTRAINT_REQUIRED);
        }

        return error;
    }
};

/**
 *
 * @type {Require}
 */
module.exports = Require;