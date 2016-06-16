var validator = require('validator'),
    Field = require('./field'),
    String = require('./../util/string'),
    ErrorHandler = require('./error/errorHandler'),
    common = require('./common'),
    Constraint = require('./constraint'),
    _ = require('lodash/string');

/**
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
     * @type {Constraint|null}
     */
    this.Constraint = null;

    /**
     *
     * @type {ErrorHandler|null}
     */
    this.ErrorHandler = null;

    /**
     *
     * @type {Array}
     */
    this.errors = [];

    /**
     *
     * @param formObject
     * @returns {Form}
     */
    this.extend = function(formObject)
    {
        if(!formObject instanceof Form) throw new Error('[express-form-handler] You can not extend a form with parameter that is not an instance of Form');
        if(!formObject.hasOwnProperty('Field')) throw new Error('[express-form-handler] A form object must have a Field member');
        if(!formObject.Field.hasOwnProperty('fields')) throw new Error('[express-form-handler] A Field object must have a fields member');

        this.addFields(formObject.Field.fields);

        return this;
    };

    /**
     *
     * @param fields
     */
    this.addFields = function(fields)
    {
        for(var field in fields) {
            if(fields.hasOwnProperty(field)) {
                this.Field.add(field, fields[field]);
            }
        }
    };

    /**
     *
     * @returns {Function} The express route middleware
     */
    this.handleRequest = function()
    {
        var self = this;

        /**
         *
         */
        return function(req, res, next) {
            self.body = req.body;
            self.Constraint = new Constraint(self.ErrorHandler);
            self.errors = [];

            try {
                for(var field in self.Field.fields) {
                    if(!self.Field.fields.hasOwnProperty(field)) continue;
                    self.checkField(self.Field.fields[field], field)
                }
                if(self.Constraint.hasErrors()) {
                    self.errors = self.errors.concat(self.Constraint.errors);
                }
            } catch(err) {

                next(err); return;
            }

            req.form = {};
            res.locals.formErrors = {};

            res.locals.formErrors = self.errors;
            req.form.isValid = self.errors.length === 0;
            next();
        };
    };

    /**
     *
     * @param field
     * @param fieldName
     */
    this.checkField = function(field, fieldName)
    {
        if(this.body.hasOwnProperty(fieldName)) {
            this.checkTypeIntegrity(field, fieldName);
            this.checkConstraints(field, fieldName);
        }
    };

    /**
     *
     * @param field
     * @param fieldName
     * @returns {boolean}
     */
    this.checkTypeIntegrity = function(field, fieldName)
    {
        var fieldType = field.type,
            validatorMethodName = 'is' + _.capitalize(fieldType),
            self = this;

        if('string' === fieldType || 'text' === fieldType) return;

        if(validator.hasOwnProperty(validatorMethodName) && typeof validator[validatorMethodName] === 'function') {

            if(!Array.isArray(this.body[fieldName])) {
                if(false === validator[validatorMethodName](this.body[fieldName])) {
                    this.errors.push(this.ErrorHandler.newError(this.Field.getErrorMessage(field, common.ERROR_TYPE_INTEGRITY), fieldName, common.ERROR_TYPE_INTEGRITY));
                }

                return self.errors.length <= 0;
            }

            this.body[fieldName].forEach(function(value){
                if(false === validator[validatorMethodName](value)) {
                    self.errors.push(self.ErrorHandler.newError(self.Field.getErrorMessage(field, common.ERROR_TYPE_INTEGRITY), fieldName, common.ERROR_TYPE_INTEGRITY));
                }
            });

        }

        return self.errors.length <= 0;
    };

    /**
     *
     * @param field
     * @param fieldName
     * @returns {boolean}
     */
    this.checkConstraints = function(field, fieldName)
    {
        this.Constraint.check(field, fieldName, this.body);
    };
};

module.exports = {

    /**
     *
     * @param definition
     * @param locale
     * @returns {Form}
     */
    create: function(definition, locale)
    {
        var form = new Form();
        locale = locale || 'en';

        if(!definition.hasOwnProperty('fields')) {
            throw new Error('[express-form-handler] When you create a form, you must give the fields definition');
        }
        form.addFields(definition.fields);
        form.ErrorHandler = new ErrorHandler(form.Field.fields, locale);

        return form;
    }
};