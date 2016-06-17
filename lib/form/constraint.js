var requiredir = require("require-dir"),
    constraints = requiredir('./constraints'),
    async = require('async');

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
     * @param cb
     * @returns {*}
     */
    this.check = function (field, fieldName, body, cb) {
        var self = this;
        async.forEachOf(field, function(item, key, callback){
            if(self.constraints.hasOwnProperty(key)) {
                try {
                    var constraint = new self.constraints[key](ErrorHandler);
                    constraint.validate(field, fieldName, body, function(error) {
                        if(error) {
                            self.errors.push(error);
                        }
                        return callback();
                    });
                } catch(e) {
                    return callback(e);
                }
            }
        }, function(err) {
            if (err) return cb(err);
            return cb();
        });
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