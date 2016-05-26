var validator = require('validator'),
    Field = require('./field'),
    String = require('./../util/string'),
    ErrorHandler = require('./error/errorHandler'),
    common = require('./common'),
    Constraint = require('./constraint');

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
        if(!formObject instanceof Form) {

            throw new Error('[express-form-handler] You can not extend a form with a value that is not an instance of Form');
        }
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
                    if(self.Field.fields.hasOwnProperty(field)) {
                        self.checkField(self.Field.fields[field], field)
                    }
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
        var fieldType = field.type;
        var validatorMethodName = 'is' + String.ucfirst(fieldType);
        var errMesssage;

        if('string' === fieldType || 'text' === fieldType) {

            return true;
        }

        //This field type can be checked
        if(validator.hasOwnProperty(validatorMethodName) && typeof validator[validatorMethodName] === 'function') {
            //Error
            if(false === validator[validatorMethodName](this.body[fieldName])) {
                errMesssage = this.Field.getErrorMessage(field, common.ERROR_TYPE_INTEGRITY);
                this.errors.push(this.ErrorHandler.newError(errMesssage, fieldName, common.ERROR_TYPE_INTEGRITY));

                return false;
            }

            return true;
        }

        throw new Error('[express-form-handler] No field-type found for the given field-type ' + fieldType);
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