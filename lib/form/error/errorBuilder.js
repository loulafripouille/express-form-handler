var i18n = require('i18n');

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

        throw new Error('[express-form-handler] Missing parameters for Error new instance. Expected: message, field, locale.')
    }

    this.errorSkeleton = {
        field: field.label,
        message: '',
        type: type
    };

    i18n.configure({
        locales: ['en', 'fr'],
        extension: '.json',
        directory: __dirname + '/../../../locales'
    });
    i18n.setLocale(locale);

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
        var translatedMessage = '';
        switch(type) {
            case 'integrity':
                translatedMessage = i18n.__(message, field.label, field.type);
                break;
            case 'equal constraint':
                translatedMessage = i18n.__(message, field.label, field.equal.label);
                break;
            case 'required constraint':
                translatedMessage = i18n.__(message, field.label);
                break;
            default:
                translatedMessage = i18n.__(message, field.label);
                break;
        }

        return translatedMessage;
    };

    return this.buildError(message);
};

module.exports = ErrorBuilder;
