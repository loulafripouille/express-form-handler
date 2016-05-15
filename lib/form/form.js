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
     * @param definition
     * @param locale
     * @returns {Form}
     */
    this.create = function(definition, locale)
    {
        locale = locale || 'en';

        if(!definition.hasOwnProperty('fields')) {
            throw new Error('[express-form-handler] When you create a form, you must give the fields definition');
        }
        this.addFields(definition.fields);
        this.ErrorHandler = new ErrorHandler(this.Field.fields, locale);

        return this;
    };

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
        var _this = this;

        /**
         *
         */
        return function(req, res, next) {
            _this.body = req.body;
            _this.Constraint = new Constraint(_this.ErrorHandler);
            _this.errors = [];

            for(var field in _this.Field.fields) {
                if(_this.Field.fields.hasOwnProperty(field)) {
                    _this.checkField(_this.Field.fields[field], field)
                }
            }

            if(_this.Constraint.hasErrors()) {
                _this.errors = _this.errors.concat(_this.Constraint.errors);
            }

            req.form = {};
            res.locals.formErrors = {};

            res.locals.formErrors = _this.errors;
            req.form.isValid = _this.errors.length === 0;
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
            this.body[fieldName] = this.body[fieldName].trim();
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
        if('string' === fieldType || 'text' === fieldType) {

            return true;
        }

        var validatorMethodName = 'is' + String.ucfirst(fieldType);
        //This field type can be checked
        if(validator.hasOwnProperty(validatorMethodName) && typeof validator[validatorMethodName] === 'function') {
            //Error
            if(false === validator[validatorMethodName](this.body[fieldName])) {
                var errMesssage = this.Field.getErrorMessage(field, common.ERROR_TYPE_INTEGRITY);
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

module.exports = Form;