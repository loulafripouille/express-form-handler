var validator = require('validator');

/**
 *
 * @param {ErrorHandler} ErrorHandler
 * @constructor
 */
var Equal = function (ErrorHandler) {
    'use strict';

    if(!ErrorHandler || !ErrorHandler instanceof require('./../error/errorHandler')) {

        throw new Error('[express-form-handler] Bad parameter for new Constraint instance. Expected: an ErrorHandler instance');
    }

    /**
     *
     * @param field
     * @param fieldName
     * @param body
     * @returns {*}
     */
    this.validate = function(field, fieldName, body) {
        var valid = false;
        var error = '';

        if(body.hasOwnProperty(field.equal.to)) {
            valid = validator.equals(body[fieldName], body[field.equal.to]);
        } else {
            throw new Error(
                    '[express-form-handler] The form doesn\'t contains the field ' + field.equal.label +
                    '. But there is a reference to this field '+
                    'in the ' + fieldName + ' definition'
            );
        }

        if(!valid) {
            error = ErrorHandler.newError('error.constraints.equal', fieldName, 'equal constraint');
        }

        return error;
    }
};

/**
 *
 * @type {Require}
 */
module.exports = Equal;