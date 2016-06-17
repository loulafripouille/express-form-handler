var validator = require('validator'),
    common = require('./../common'),
    Field = require('./../field'),
    ErrorHandlerObject = require('./../error/errorHandler'),
    _ = require('lodash');

/**
 *
 * @param {ErrorHandler} ErrorHandler
 * @constructor
 */
var Equal = function (ErrorHandler) {
    'use strict';

    if(!ErrorHandler || !ErrorHandler instanceof ErrorHandlerObject) {

        throw new Error('[express-form-handler] Bad parameter for new Require instance. Expected: an ErrorHandler instance');
    }

    /**
     *
     * @param field
     * @param fieldName
     * @param body
     * @param cb
     * @returns {*}
     */
    this.validate = function(field, fieldName, body, cb) {
        var valid,
            error = '',
            fieldsHelper = new Field();

        if(!body.hasOwnProperty(field.equal.to)) throw new Error(
            '[express-form-handler] The form doesn\'t contains the field ' + field.equal.to +
            '. But there is a reference to this field '+
            'in the ' + fieldName + ' field declaration'
        );

        if(!_.isArray(body[fieldName])) {
            valid = validator.equals(body[fieldName], body[field.equal.to]);
        } else {
            valid = _.isEqual(body[fieldName], body[field.equal.to]);
        }

        if(!valid) {
            error = ErrorHandler.newError(fieldsHelper.getErrorMessage(field, common.ERROR_TYPE_CONSTRAINT_EQUAL), fieldName, common.ERROR_TYPE_CONSTRAINT_EQUAL);
        }

        if('function' === typeof cb) return cb(error);
        return error;
    }
};

/**
 *
 * @type {Require}
 */
module.exports = Equal;