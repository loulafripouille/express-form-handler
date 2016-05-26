var common = require('./common');

/**
 *
 * @constructor
 */
var Field = function() {
    'use strict';

    /**
     *
     * @type {Array}
     */
    this.fields = {};

    /**
     * Add a new form field in this.fields object
     *
     * @param name
     * @param field
     */
    this.add = function(name, field)
    {
        if(this.fields.hasOwnProperty(name)) {
            return;
        }
        if(!field.hasOwnProperty('type')) {
            throw new Error('[express-form-handler] When you add a form field, you must give the form field type at least');
        }
        //Forge the label field option
        if(!field.hasOwnProperty('label')) {
            field.label = name;
        }
        // Forge the equal field option
        if(field.hasOwnProperty('equal')) {
            if(typeof field.equal !== 'object') {
                var equalField = field.equal;
                field.equal = {
                    label: equalField,
                    to: equalField
                }
            }
        }

        // Register the new form field
        this.fields[name] = field;
    };

    /**
     * Retrieve the field error message with the error type violation
     * If no custom message is provided, the default one will be return
     *
     * @param field
     * @param errType
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
    }
};

module.exports = Field;