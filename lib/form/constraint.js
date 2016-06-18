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
var Constraint = function(ErrorHandler, fields) {
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
            field,
            function (item, key, callback) {
                //if any constraints exist with that field key
                if(self.constraints.hasOwnProperty(key)) {
                    try {
                        constraint = new self.constraints[key](ErrorHandler);
                        constraint.validate(field, fields, function(error) {
                            if(error) {
                                self.errors.push(error);
                            }
                        });
                    } catch(e) {

                        return callback(e);
                    }

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