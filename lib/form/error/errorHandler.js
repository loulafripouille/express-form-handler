var ErrorBuilder = require('./errorBuilder'),
    common = require('./../common');

/**
 *
 * @param {String} locale
 *
 * @constructor
 */
var ErrorHandler = function(locale) {

    var localesAvailable = {en: true, fr: true};
    if(!localesAvailable.hasOwnProperty(locale)) {
        throw new Error('[express-form-handler] Unavailable given locale. Locales available: fr, en');
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
    this.getErrorMessage = function(field, errType) {
        if(field.hasOwnProperty('messages') && field.messages.hasOwnProperty(errType)) {
            return field.messages[errType];
        }
        switch(errType) {
            case common.ERROR_TYPE_INTEGRITY:
                return common.ERROR_MESSAGE_INTEGRITY;
                break;
            case common.ERROR_TYPE_CONSTRAINT_REQUIRED:
                return common.ERROR_MESSAGE_CONSTRAINT_REQUIRED;
                break;
            case common.ERROR_TYPE_CONSTRAINT_EQUAL:
                return common.ERROR_MESSAGE_CONSTRAINT_EQUAL;
                break;
            default:
                throw new Error('This code should not be reached!');
        }
    };

    /**
     *
     * @param {Object} field
     * @param {String} type
     *
     * @returns {Error|exports|module.exports}
     */
    this.newError = function(field, type) {
        var message = this.getErrorMessage(field, type);
        return new ErrorBuilder(message, field, type, locale);
    };
};

module.exports = ErrorHandler;