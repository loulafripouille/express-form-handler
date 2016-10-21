/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const 
    validator = require('validator'),
    common = require('./../common')

/**
 * @param {ErrorHandler} ErrorHandler
 * @constructor
 *
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
const Equal = (ErrorHandler) => {

    function arraysEqual(a, b) {
        a = Array.isArray(a) ? a : []
        b = Array.isArray(b) ? b : []
        return a.length === b.length && a.every((el, ix) => el === b[ix])
    }

    /**
     *
     * @param {Object} field
     * @param {Array} fields
     * @param {Function} cb, the callback function(null|mixed error)
     *
     * @returns {*}
     */
    this.validate = (field, fields, cb) => {
        let valid,
            error = ''

        if(field.value.constructor !== Array) {
            valid = validator.equals(field.value, fields[field.equal.to].value)
        } else {
            valid = arraysEqual(field.value, fields[field.equal.to])
        }

        if(!valid) {
            error = ErrorHandler.newError(
                field,
                common.ERROR_TYPE_CONSTRAINT_EQUAL
            )
        }

        return cb(error)
    }
}

/**
 *
 * @type {Require}
 */
module.exports = Equal