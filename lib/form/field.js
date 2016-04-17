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
     *
     * @param name
     * @param field
     */
    this.add = function(name, field)
    {
        if(!field.hasOwnProperty('type')) {
            throw new Error('[express-form-handler] When you add a form field, you must give the form field type at least');
        }

        if(!field.hasOwnProperty('label')) {
            field.label = name;
        }

        if(field.hasOwnProperty('equal')) {
            if(typeof field.equal !== 'object') {
                var equalField = field.equal;
                field.equal = {
                    label: equalField,
                    to: equalField
                }
            }
        }

        this.fields[name] = field;
    };
};

module.exports = Field;