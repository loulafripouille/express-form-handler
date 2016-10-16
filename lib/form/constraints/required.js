'use strict';

var common = require('./../common');

/**
 * @param {ErrorHandler} ErrorHandler
 * @constructor
 *
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
var Require = function(ErrorHandler) {

    /**
     *
     * @param {Object} field
     * @param {Array} fields
     * @param {Function} cb, the callback function(null|mixed error)
     *
     * @returns {*}
     */
    this.validate = (field, fields, cb) => {
        let error = '';

        if(!field.value) {
            error = ErrorHandler.newError(
                field,
                common.ERROR_TYPE_CONSTRAINT_REQUIRED
            );
        }

        return cb(error);
    }
};

module.exports = Require;