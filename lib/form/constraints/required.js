/**
 *
 * @param {ErrorHandler} ErrorHandler
 * @constructor
 */
var Require = function (ErrorHandler) {
    'use strict';

    if(!ErrorHandler || !ErrorHandler instanceof require('./../error/errorHandler')) {

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

        if(!body[fieldName]) {
            error = ErrorHandler.newError('error.constraints.required', fieldName, 'required constraint');
        }

        return error;
    }
};

/**
 *
 * @type {Require}
 */
module.exports = Require;