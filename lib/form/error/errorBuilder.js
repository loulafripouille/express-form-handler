var requiredir = require("require-dir"),
    common = require('./../common');

/**
 *
 * @param message
 * @param field
 * @param type
 * @param locale
 * @constructor
 */
var ErrorBuilder = function (message, field, type, locale) {
    'use strict';

    if(!message || !field || !type || !locale) {

        throw new Error('[express-form-handler] Missing parameters for ErrorBuilder new instance. Expected: message, field, type, locale.')
    }

    this.errorSkeleton = {
        field: field.label,
        message: '',
        type: type
    };

    this.locales = requiredir(__dirname + '/../../../locales');
    this.messages = this.locales[locale];

    /**
     *
     * @param message
     */
    this.buildError = function(message) {
        message = this.translateMessage(message);
        var error = this.errorSkeleton;
        error.message = message;

        return error;
    };

    /**
     *
     * @param message
     * @returns {string}
     */
    this.translateMessage = function(message) {
        message = this.messages[message] || message;
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
    };

    return this.buildError(message);
};

module.exports = ErrorBuilder;
