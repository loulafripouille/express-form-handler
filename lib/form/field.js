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
            throw new Error('When you add a form field, you must give the form field type at least');
        }

        this.fields[name] = field;
    };
};

module.exports = Field;