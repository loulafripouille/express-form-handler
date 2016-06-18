var common = require('./../common');

/**
 *
 * @param {ErrorHandler} ErrorHandler
 * @constructor
 */
var Custom = function (ErrorHandler) {
    'use strict';

    /**
     *
     * @param {Object} field
     * @param {Array} fields
     * @param {Function} cb, the callback function(null|mixed error)
     *
     * @returns {*}
     */
    this.validate = function(field, fields, cb) {
        var error = '',
            customReturn;

        if('function' !== typeof field.custom) {
            throw new Error('[express-form-handler] A custom constraint must be a function');
        }

        customReturn = field.custom(field.value);

        if('boolean' !== typeof customReturn) {
            throw new Error('[express-form-handler] A custom constraint must return a boolean');
        }

        if(false === customReturn) {
            error = ErrorHandler.newError(
                field,
                common.ERROR_TYPE_CONSTRAINT_CUSTOM
            );
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