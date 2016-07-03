var requiredir = require("require-dir"),
    constraints = requiredir('./constraints'),
    async = require('async');

/**
 *
 * @param {ErrorHandler} ErrorHandler
 * @param {Array} fields
 *
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
     * @type {Array}
     */
    this.errors = [];

    /**
     *
     * @type {Array}
     */
    this.fields = [];

    /**
     * Check field constraints (required, custom...)
     *
     * @param {Object} field
     * @param {Function} cb, the callback function(null|mixed error)
     *
     * @returns {*}
     */
    this.check = function (field, cb) {
        var self = this, constraint;

        async.forEachOf(
            self.constraints,
            function (item, key, callback) {
                //if any constraints exist with that field key
                if(field.hasOwnProperty(key)) {
                    constraint = new self.constraints[key](ErrorHandler);
                    constraint.validate(field, self.fields, function(error) {
                        if(error) {
                            self.errors.push(error);
                        }
                        return callback();
                    });
                } else {

                    return callback();
                }
            },
            function(err) {
                if (err) return cb(err);
                return cb();
            }
        );
    };

    /**
     * Just a shortcut
     *
     * @returns {boolean}
     */
    this.hasErrors = function () {
        return this.errors.length > 0;
    };

    /**
     *
     * @param {Array} fields
     */
    this.setFields = function(fields) {
        this.fields = fields;
    }
};

/**
 *
 * @type {Constraint}
 */
module.exports = Constraint;