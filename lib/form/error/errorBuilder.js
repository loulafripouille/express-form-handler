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
var ErrorBuilder = function (message, field, type, locale) {
    'use strict';

    /**
     *
     * @param {String} message
     */
    this.buildError = function(message) {
        message = this.translateMessage(message);
        return {
            field: field.label,
            message: message,
            type: type
        };
    };

    /**
     *
     * @param {String} message
     *
     * @returns {string}
     */
    this.translateMessage = function(message) {
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
    };

    return this.buildError(message);
};

module.exports = ErrorBuilder;
