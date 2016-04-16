var validator = require('validator');

/**
 *
 * @constructor
 */
var Equal = function () {
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
     * @returns {*}
     */
    this.validate = function(field, fieldName, body) {
        var valid = false;
        if(body.hasOwnProperty(field.equal)) {
            valid = validator.equals(body[fieldName], body[field.equal]);
        } else {
            throw new Error(
                    'The form doesn\'t contains the field ' + field.equal +
                    '. But there is a reference to this field '+
                    'in the ' + fieldName + ' definition'
            );
        }

        if(!valid) {
            this.error = "The field " + fieldName + " must be equal to the field " + field.equal;
        }

        return this.error;
    }
};

/**
 *
 * @type {Require}
 */
module.exports = Equal;