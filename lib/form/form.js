var validator = require('validator'),
    Field = require('./field'),
    String = require('./../util/string'),
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
     * @type {Constraint|*|exports|module.exports}
     */
    this.Constraint = new Constraint();

    /**
     *
     * @type {*|exports|module.exports}
     */
    this.validator = validator;

    /**
     *
     * @type {Array}
     */
    this.errors = [];

    /**
     *
     * @param definition
     * @returns {Form}
     */
    this.create = function(definition)
    {
        if(!definition.hasOwnProperty('fields')) {
            throw new Error('When you create a form, you must give the fields definition');
        }
        this.addFields(definition.fields);

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

            for(var field in _this.Field.fields) {
                if(_this.Field.fields.hasOwnProperty(field)) {
                    _this.checkField(_this.Field.fields[field], field)
                }
            }

            if(_this.Constraint.hasErrors()) {
                _this.errors.push(_this.Constraint.errors);
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
        if('string' === fieldType) {

            return true;
        }

        var validatorMethodName = 'is' + String.ucfirst(fieldType);
        //This field type can be checked
        if(this.validator.hasOwnProperty(validatorMethodName) && typeof this.validator[validatorMethodName] === 'function') {
            //Error
            if(false === this.validator[validatorMethodName](this.body[fieldName])) {
                this.errors.push({fieldName: fieldName, reason: validatorMethodName, message: field.type.message || 'This field must respect the ' + fieldType + ' format'});

                return false;
            }

            return true;
        }

        throw new Error('No field type found for the given fieldType ' + fieldType);
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