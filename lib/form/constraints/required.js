/**
 *
 * @constructor
 */
var Require = function () {
    'use strict';

    /**
     *
     * @type {string}
     */
    this.error = "";

    /**
     *
     * @param field
     * @param fieldName
     * @param body
     */
    this.validate = function(field, fieldName, body) {
        if(!body[fieldName]) {
            this.error = 'The field ' + fieldName + ' is required';
        }

        return this.error;
    }
};

/**
 *
 * @type {Require}
 */
module.exports = Require;