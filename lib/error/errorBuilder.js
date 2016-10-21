/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const 
    requiredir = require("require-dir"),
    common = require('./../common'),
    locales = requiredir('./../../locales')

/**
 * @class  ErrorBuilder
 *
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
class ErrorBuilder {

    constructor(message, field, type, locale) {
        this.message = message
        this.field = field
        this.type = type
        this.locale = locale

        return this.buildError()
    }

    /**
     *
     */
    buildError() {
        this.message = this.translateMessage()
        return {
            field: this.field.label,
            message: this.message,
            type: this.type
        }
    }

    /**
     *
     * @returns {string}
     */
    translateMessage() {
        this.message = locales[this.locale][this.message] || this.message
        let translatedMessage = ''
        switch(this.type) {
            case common.ERROR_TYPE_INTEGRITY:
                translatedMessage = this.message.replace('%field%', this.field.label).replace('%type%', this.field.type)
                break
            case common.ERROR_TYPE_CONSTRAINT_EQUAL:
                translatedMessage = this.message.replace('%field%', this.field.label).replace('%equal.field%', this.field.equal.label)
                break
            case common.ERROR_TYPE_CONSTRAINT_REQUIRED:
                translatedMessage = this.message.replace('%field%', this.field.label)
                break
            default:
                translatedMessage = this.message.replace('%field%', this.field.label)
                break
        }

        return translatedMessage
    }
}

module.exports = ErrorBuilder
