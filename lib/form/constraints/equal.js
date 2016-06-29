var validator = require('validator'),
    common = require('./../common'),
    _ = require('lodash');

/**
 *
 * @param {ErrorHandler} ErrorHandler
 * @constructor
 */
var Equal = function (ErrorHandler) {
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
        var valid,
            error = '';

        if(!_.isArray(field.value)) {
            valid = validator.equals(field.value, fields[field.equal.to]);
        } else {
            valid = _.isEqual(field.value, fields[field.equal.to]);
        }

        if(!valid) {
            error = ErrorHandler.newError(
                field,
                common.ERROR_TYPE_CONSTRAINT_EQUAL
            );
        }

        return cb(error);
    }
};

/**
 *
 * @type {Require}
 */
module.exports = Equal;