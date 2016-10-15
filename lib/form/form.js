'use strict';

var Field = require('./field'),
    ErrorHandler = require('./error/errorHandler'),
    Constraint = require('./constraint'),
    async = require('async');

/**
 * This is the main Class for the express form handler lib
 *
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 *
 */
class Form {

    /**
     * 
     */
    constructor() {
        private Field = new Field();
        private locale = null;
        private errors = [];
    }

    

    /**
     *
     * @returns {Function} The express route middleware
     */
    handleRequest() {
        var self = this;

        /**
         * The express route middleware
         *
         * @param {Object} req
         * @param {Object} res
         * @param {Function} next
         */
        return (req, res, next) => {
            self.errors = [];
            res.locals.formErrors = req.form = {};

            self.Field.ErrorHandler = new ErrorHandler(self.locale);
            self.Field.Constraint = new Constraint(self.Field.ErrorHandler);

            self.Field.setFieldsValue(req.body, () => {
                //Do the form assertion on each field
                async.forEachOf(
                    self.Field.fields,
                    (field, fieldName, cb) => {
                        self.Field.checkField(field, self.locale, (err) => {
                            if (err) {
                                return cb(err);
                            }
                            req.form[fieldName] = field.value;
                            return cb();
                        });
                    },
                    (err) => {
                        if (err) return next(err);

                        if(self.Field.Constraint.hasErrors()) {
                            self.errors = self.Field.errors.concat(self.Field.Constraint.errors);
                        }

                        res.locals.formErrors = self.errors;
                        req.form.isValid = self.errors.length === 0;

                        return next();
                    }
                );
            });
        };
    };

    /**
     * Add the given fields in the Field instance
     *
     * @param {Array} fields
     */
    addFields(fields) {
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
    extend(formObject) {
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
    create: (definition, locale) => {
        var form = new Form();
        form.locale = locale || 'en';

        if(!definition.hasOwnProperty('fields')) {
            throw new Error('[express-form-handler] When you create a form, you must give the fields definition');
        }

        form.addFields(definition.fields);
        return form;
    }
};