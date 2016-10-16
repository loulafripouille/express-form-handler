'use strict';

var Field = require('./field'),
    ErrorHandler = require('./error/errorHandler'),
    Constraint = require('./constraint'),
    Model = require('./model'),
    async = require('async'),
    fs = require('fs'),
    path = require('path'),
    locale = 'en';

/**
 * This is the main Class for the express form handler lib
 *
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
class Form {
    /**
     * 
     */
    constructor() {
        this.Field = new Field();
        this.locale = null;
        this.Model = new Model();
        this.model = null;
    }

    /**
     *
     * @returns {Function} The express route middleware
     */
    handleRequest() {
        let self = this;

        /**
         * The express route middleware
         *
         * @param {Object} req
         * @param {Object} res
         * @param {Function} next
         */
        return (req, res, next) => {
            if (req.method !== "POST") {
                return next();
            }

            let errors = self.Field.errors = [];
            res.locals.formErrors = req.form = {};

            self.Field.ErrorHandler = new ErrorHandler(self.locale);
            self.Field.Constraint = new Constraint(self.Field.ErrorHandler);
            self.Model.model = self.model;

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
                        if (err) {
                            return next(err);
                        }
                        let reqId = req.params.id || null;
                        self.Model.persist(self.Field.fields, reqId, (err) => {
                            if(err) return next(err);
                            req.form.model = self.Model.model;

                            if(self.Field.Constraint.hasErrors()) {
                                errors = self.Field.errors.concat(self.Field.Constraint.errors);
                            }

                            res.locals.formErrors = errors;
                            req.form.isValid = errors.length === 0;

                            return next();
                        });
                    }
                );
            });
        };
    }

    /**
     * Add the given fields in the Field instance
     *
     * @param {Array} fields
     */
    addFields(fields) {
        let self = this;
        for(var field in fields) {
            if(fields.hasOwnProperty(field)) {
                self.Field.add(field, fields[field]);
            }
        }
    }

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
    }
}

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
    create: (definition, model) => {
        let form = new Form();
        form.locale = locale;
        form.model = model || null;

        if(!definition.hasOwnProperty('fields')) {
            throw new Error('[express-form-handler] When you create a form, you must give the fields definition');
        }

        form.addFields(definition.fields);
        return form;
    },

    /**
     * Public method that defined a selected locale
     * @see README to learn more on all usages and features
     *
     * @param {String} new_locale
     */
    setLocale: (new_locale) => {
        try {
            fs.statSync(path.join(__dirname, '..', '..', 'locales', new_locale + '.json')).isFile();
            locale = new_locale;
        } catch (err) {
            locale = 'en';
        }
        
        return locale;
    }
};