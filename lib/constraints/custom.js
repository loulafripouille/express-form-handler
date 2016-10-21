/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const common = require('./../common')

/**
 * @param {ErrorHandler} ErrorHandler
 * @constructor
 *
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
var Custom = function(ErrorHandler) {

    /**
     *
     * @param {Object} field
     * @param {Array} fields
     * @param {Function} cb, the callback function(null|mixed error)
     *
     * @returns {*}
     */
    this.validate = (field, fields, cb) => {
        let error = '',
            customReturn

        if('function' !== typeof field.custom) {
            throw new Error('[express-form-handler] A custom constraint must be a function')
        }

        customReturn = field.custom(field.value)

        if('boolean' !== typeof customReturn) {
            throw new Error('[express-form-handler] A custom constraint must return a boolean')
        }

        if(false === customReturn) {
            error = ErrorHandler.newError(
                field,
                common.ERROR_TYPE_CONSTRAINT_CUSTOM
            )
        }

        return cb(error)
    }
}

/**
 *
 * @type {Require}
 */
module.exports = Custom