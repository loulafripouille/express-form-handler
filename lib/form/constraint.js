var requiredir = require("require-dir"),
    constraints = requiredir('./constraints');

/**
 *
 * @param {ErrorHandler} ErrorHandler
 * @constructor
 */
var Constraint = function(ErrorHandler) {
    'use strict';

    /**
     *
     * @type {array|exports|module.exports}
     */
    this.constraints = constraints;

    /**
     *
     * @type {{}}
     */
    this.errors = [];

    /**
     *
     * @param field
     * @param fieldName
     * @param body
     * @returns {*}
     */
    this.check = function (field, fieldName, body) {
        for(var member in field) {
            if(!field.hasOwnProperty(member)) continue;
            if('type' !== member && this.constraints.hasOwnProperty(member)) {
                var constraint = new this.constraints[member](ErrorHandler);
                var error = constraint.validate(field, fieldName, body);

                if(error) {
                    this.errors.push(error);
                }
            }
        }
    };

    /**
     *
     * @returns {boolean}
     */
    this.hasErrors = function ()
    {
        return this.errors.length > 0;
    };
};

/**
 *
 * @type {Constraint}
 */
module.exports = Constraint;