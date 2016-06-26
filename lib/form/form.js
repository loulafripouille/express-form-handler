var Field = require('./field'),
    common = require('./common'),
    async = require('async');

/**
 * This is the main Class for the express form handler lib
 *
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 *
 * @constructor
 */
var Form = function() {
    'use strict';

    /**
     *
     * @type {Field|*|exports|module.exports}
     */
    this.Field = new Field();

    /**
     *
     * @type {null|string}
     */
    this.locale = null;

    /**
     *
     * @type {Array}
     */
    this.errors = [];

    /**
     *
     * @returns {Function} The express route middleware
     */
    this.handleRequest = function()
    {
        var self = this;

        /**
         * The express route middleware
         *
         * @param {{}} req
         * @param {{}} res
         * @param {Function} next
         */
        return function(req, res, next) {
            self.errors = [];

            //Do the form assertion on each field
            async.forEachOf(
                self.Field.fields,
                function(field, fieldName, cb) {
                    try {
                        field.value = req.body[fieldName] || null;
                        self.Field.checkField(field, self.locale, function(err) {
                            if (err) return cb(err);
                        });
                    } catch(e) {
                        return cb(e);
                    }

                    return cb();
                },
                function(err){
                    if (err) return next(err);

                    try {
                        if(self.Field.Constraint.hasErrors()) {
                            self.errors = self.Field.errors.concat(self.Field.Constraint.errors);
                        }
                        res.locals.formErrors = req.form = {};

                        res.locals.formErrors = self.errors;
                        req.form.isValid = self.errors.length === 0;
                    } catch (e) {
                        return next(e);
                    }

                    return next();
                }
            );

        };
    };

    /**
     * Add the given fields in the Field instance
     *
     * @param {{}} fields
     */
    this.addFields = function(fields)
    {
        var self = this;
        for(var field in fields) {
            if(fields.hasOwnProperty(field)) {
                self.Field.add(field, fields[field]);
            }
        }
    };

    /**
     * Extend the (this) form with the given form instance
     *
     * @param {Form} formObject
     *
     * @returns {Form}
     */
    this.extend = function(formObject)
    {
        if(!formObject instanceof Form) {
            throw new Error(
                '[express-form-handler] You can not extend a form with parameter that is not an instance of Form'
            );
        }
        if(!formObject.hasOwnProperty('Field')) {
            throw new Error('[express-form-handler] A form object must have a Field member');
        }
        if(!formObject.Field.hasOwnProperty('fields')) {
            throw new Error('[express-form-handler] A Field object must have a fields member');
        }

        this.addFields(formObject.Field.fields);

        //To chain extend method
        return this;
    };
};

module.exports = {

    /**
     * Public method that is the entry point of the lib
     * @see README to learn more on all usages and features
     *
     * @param {Object} definition
     * @param {String} locale
     *
     * @returns {Form}
     */
    create: function(definition, locale)
    {
        var form = new Form();
        form.locale = locale || 'en';

        if(!definition.hasOwnProperty('fields')) {
            throw new Error('[express-form-handler] When you create a form, you must give the fields definition');
        }

        form.addFields(definition.fields);
        return form;
    }
};