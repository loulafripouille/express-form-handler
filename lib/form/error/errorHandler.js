var ErrorBuilder = require('./errorBuilder');

/**
 *
 * @param fields
 * @param locale
 * @constructor
 */
var ErrorHandler = function(fields, locale) {

    if(!fields || !locale) {

        throw new Error('[express-form-handler] Missing parameters for new ErrorHandler instance. Expected: fields [Field#fields member], locale (the locale to use for error messages ; available: fr, en)');
    }

    /**
     *
     * @param message
     * @param field
     * @param type
     * @returns {Error|exports|module.exports}
     */
    this.newError = function(message, field, type) {
        if(!fields[field]) {

            throw new Error('[express-form-handler] You tried to make a form error with an unknown field: ' + field);
        }

        return new ErrorBuilder(message, fields[field], type, locale);
    };
};

module.exports = ErrorHandler;