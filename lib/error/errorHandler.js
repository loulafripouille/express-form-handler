/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const 
    ErrorBuilder = require('./errorBuilder'),
    common = require('./../common')

/**
 * @class ErrorHandler
 *
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
class ErrorHandler {

    constructor(locale) {
        this.locale = locale
    }

    /**
     * Retrieve the field error message with the error type violation
     * If no custom message is provided, the default one will be return
     *
     * @param {Object} field
     * @param {String} errType
     *
     * @returns {*}
     */
    getErrorMessage(field, errType) {
        if(field.hasOwnProperty('messages') && field.messages.hasOwnProperty(errType)) {
            return field.messages[errType]
        }
        switch(errType) {
            case common.ERROR_TYPE_INTEGRITY:
                return common.ERROR_MESSAGE_INTEGRITY
                break
            case common.ERROR_TYPE_CONSTRAINT_REQUIRED:
                return common.ERROR_MESSAGE_CONSTRAINT_REQUIRED
                break
            case common.ERROR_TYPE_CONSTRAINT_EQUAL:
                return common.ERROR_MESSAGE_CONSTRAINT_EQUAL
                break
            default:
                throw new Error('This code should not be reached!')
        }
    }

    /**
     *
     * @param {Object} field
     * @param {String} type
     *
     * @returns {Error|exports|module.exports}
     */
    newError(field, type) {
        let message = this.getErrorMessage(field, type)
        return new ErrorBuilder(message, field, type, this.locale)
    }
}

module.exports = ErrorHandler