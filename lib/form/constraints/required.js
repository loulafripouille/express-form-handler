var common = require('./../common');;

/**
 *
 * @param {ErrorHandler} ErrorHandler
 * @constructor
 */
var Require = function (ErrorHandler) {
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
        var error = '';

        if(!field.value) {
            error = ErrorHandler.newError(
                field,
                common.ERROR_TYPE_CONSTRAINT_REQUIRED
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
module.exports = Require;