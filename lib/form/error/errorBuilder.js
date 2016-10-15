'use strict';

var requiredir = require("require-dir"),
    common = require('./../common'),
    locales = requiredir('./../../../locales');

/**
 *
 * @param {String} message
 * @param {Object} field
 * @param {String} type
 * @param {String} locale
 *
 * @constructor
 */
class ErrorBuilder {

    constructor(message, field, type, locale) {
        private message = message;
        private field = field;
        private type = type;
        private locale = locale;

        return this.buildError(message);
    }

    /**
     *
     * @param {String} message
     */
    buildError(message) {
        message = this.translateMessage(message);
        return {
            field: field.label,
            message: message,
            type: type
        };
    }

    /**
     *
     * @param {String} message
     *
     * @returns {string}
     */
    translateMessage(message) {
        message = locales[locale][message] || message;
        var translatedMessage = '';
        switch(type) {
            case common.ERROR_TYPE_INTEGRITY:
                translatedMessage = message.replace('%field%', field.label).replace('%type%', field.type);
                break;
            case common.ERROR_TYPE_CONSTRAINT_EQUAL:
                translatedMessage = message.replace('%field%', field.label).replace('%equal.field%', field.equal.label);
                break;
            case common.ERROR_TYPE_CONSTRAINT_REQUIRED:
                translatedMessage = message.replace('%field%', field.label);
                break;
            default:
                translatedMessage = message.replace('%field%', field.label);
                break;
        }

        return translatedMessage;
    }
}

module.exports = ErrorBuilder;
