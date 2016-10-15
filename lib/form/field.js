'use strict';

var common = require('./common'),
    validator = require('validator'),
    _ = require('lodash'),
    async = require('async');

/**
 * This class manage form fields
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 * @constructor
 */
class Field {

    constructor() {
        public fields = {};
        public errors = [];
        private Constraint = null;
        private ErrorHandler = null;
    }

    /**
     * Add a new form field in this.fields object
     *
     * @param {String} name
     * @param {Object} field
     */
    this.add = function(name, field)
    {
        if(this.fields.hasOwnProperty(name)) {
            return;
        }
        if(!field.hasOwnProperty('type')) {
            throw new Error('[express-form-handler] When you add a form field, you must give the form field type at least');
        }
        //Forge the label field option
        if(!field.hasOwnProperty('label')) {
            field.label = name;
        }
        // Forge the equal field option
        if(field.hasOwnProperty('equal')) {
            if(typeof field.equal !== 'object') {
                var equalField = field.equal;
                field.equal = {
                    label: equalField,
                    to: equalField
                }
            }
        }

        // Register the new form field
        this.fields[name] = field;
    };

    /**
     *
     * @param {Object} field
     * @param {String} locale, locale for display error messages
     * @param {Function} cb the callback(mixed|null err)
     */
    this.checkField = function(field, locale, cb)
    {
        var self = this;

        self.checkType(field, function(err) {
            if (err) {
                return cb(err);
            }
            self.checkConstraints(field, function(err){
                return cb(err);
            });
        });
    };

    /**
     *
     * @param {Object} body
     * @param {Function} callback
     */
    this.setFieldsValue = function (body, callback) {
        var self = this;
        async.forEachOf(
            self.fields,
            function(field, fieldName, cb) {
                field.value = body[fieldName].trim() || '';
                return cb();
            },
            function(){
                self.Constraint.setFields(self.fields);
                return callback();
            }
        );
    };

    /**
     * Assert that the given field value respect its type (email, string, url...)
     *
     * @param {Object} field
     * @param {Function} cb
     *
     * @returns {Function} the callback(mixed|null err, Boolean errors.length)
     */
    this.checkType = function(field, cb)
    {
        var validatorMethodName = 'is' + _.capitalize(field.type),
            self = this;

        if('string' === field.type || 'text' === field.type) return cb(null);

        //If any validator.js method for the given field type, check it !
        if(validator.hasOwnProperty(validatorMethodName) && typeof validator[validatorMethodName] === 'function') {

            //String cas (input, textarea...)
            if(!_.isArray(field.value)) {
                if(false === validator[validatorMethodName](field.value)) {
                    this.errors.push(
                        this.ErrorHandler.newError(field, common.ERROR_TYPE_INTEGRITY)
                    );
                }

                return cb(null, self.errors.length <= 0);
            }

            //Array case (checkbox, multiple select...)
            async.each(
                field.value,
                function(value, callback){
                    try {
                        if(false === validator[validatorMethodName](value)) {
                            self.errors.push(
                                self.ErrorHandler.newError(field, common.ERROR_TYPE_INTEGRITY)
                            );
                        }

                        return callback(null);
                    } catch(e) {

                        return callback(e);
                    }
                },
                function(err){
                    if (err) cb(err);
                    return cb(null, self.errors.length <= 0);
                }
            );

        }
    };

    /**
     * Check all constrains for the given field
     *
     * @param {Object} field
     * @param {Function} cb, the callback function(null|mixed error)
     *
     * @returns {Function}
     */
    this.checkConstraints = function(field, cb)
    {
        this.Constraint.check(field, function (err) {

            return cb(err);
        });
    };
};

module.exports = Field;