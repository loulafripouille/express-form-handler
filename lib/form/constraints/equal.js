var validator = require('validator'),
    common = require('./../common'),
    Field = require('./../field');

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
        var fieldsHelper = new Field();

        if(body.hasOwnProperty(field.equal.to)) {
            valid = validator.equals(body[fieldName], body[field.equal.to]);
        } else {
            throw new Error(
                    '[express-form-handler] The form doesn\'t contains the field ' + field.equal.label +
                    '. But there is a reference to this field '+
                    'in the ' + fieldName + ' field declaration'
            );
        }

        if(!valid) {
            error = ErrorHandler.newError(fieldsHelper.getErrorMessage(field, common.ERROR_TYPE_CONSTRAINT_EQUAL), fieldName, common.ERROR_TYPE_CONSTRAINT_EQUAL);
        }

        return error;
    }
};

/**
 *
 * @type {Require}
 */
module.exports = Equal;