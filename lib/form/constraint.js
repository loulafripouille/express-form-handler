var constraints = require('./constraints');

/**
 *
 * @constructor
 */
var Constraint = function() {
    'use strict';

    /**
     *
     * @type {exports|module.exports}
     */
    this.constraints = constraints;

    /**
     *
     * @type {{}}
     */
    this.errors = {};

    /**
     *
     * @param field
     * @param fieldName
     * @param body
     * @returns {*}
     */
    this.check = function (field, fieldName, body) {
        for(var member in field) {
            if(field.hasOwnProperty(member) && 'type' !== member && this.constraints.hasOwnProperty(member)) {
                var constraint = new this.constraints[member]();
                var error = constraint.validate(field, fieldName, body);
                if(error) {
                    this.errors[fieldName] = error;
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
        return Object.keys(this.errors).length > 0;
    };
};

/**
 *
 * @type {Constraint}
 */
module.exports = Constraint;