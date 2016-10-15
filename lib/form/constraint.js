'use strict';

var requiredir = require("require-dir"),
    constraints = requiredir('./constraints'),
    async = require('async');

/**
 * @class Constraint
 */
class Constraint {

    constructor(ErrorHandler) {
        this.constraints = constraints;
        this.errors = [];
        this.fields = [];
        this.ErrorHandler = ErrorHandler;
    }

    /**
     * Check field constraints (required, custom...)
     *
     * @param {Object} field
     * @param {Function} cb, the callback function(null|mixed error)
     *
     * @returns {*}
     */
    check(field, cb) {
        var self = this, constraint;

        async.forEachOf(
            self.constraints,
            (item, key, callback) => {
                //if any constraints exist with that field key
                if(field.hasOwnProperty(key)) {
                    constraint = new self.constraints[key](this.ErrorHandler);
                    constraint.validate(field, self.fields, (error) => {
                        if(error) {
                            self.errors.push(error);
                        }
                        return callback();
                    });
                } else {

                    return callback();
                }
            },
            (err) => {
                if (err) return cb(err);
                return cb();
            }
        );
    }

    /**
     * Just a shortcut
     *
     * @returns {boolean}
     */
    hasErrors() {
        return this.errors.length > 0;
    }

    /**
     *
     * @param {Array} fields
     */
    setFields(fields) {
        this.fields = fields;
    }
}

/**
 *
 * @type {Constraint}
 */
module.exports = Constraint;