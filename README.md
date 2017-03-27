# express-form-handler

A form handler for the Node.js framework: Express.js

[![Build Status](https://travis-ci.org/laudeon/express-form-handler.svg?branch=master)](https://travis-ci.org/laudeon/express-form-handler) [![npm version](https://badge.fury.io/js/express-form-handler.svg)](https://badge.fury.io/js/express-form-handler)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

- [Why?](#why?)
- [Get Started](#get-started)
  - [Install](#install-via-npm)
  - [Create a form](#create-a-form-file)
  - [The middleware](#use-the-route-middleware)
  - [Extend a form](#extend-a-form)
- [Go further](#go-further)
  - [Configuration](#configuration)
  - [Model Strategy](#model-strategy)
  - [Rules & Formats](#rules-and-formats)
- [Contribute](#contribute)
- [Changelog](#changelog)

# Why?

Define a form (fields, field format & validation rules, ...), process the form validation with a route middleware then use the `req.form` object into the next route middleware.

Attach a model to a form in order to automate data binding to it.

Chose the way you want to process the validation: by the defined form's fields format and rules or by the model validate method provide by mongoose, sequelize, etc.

Extend your forms with other forms.

Create and integrate your own model strategy for your favourite ODM / ORM.

Create your own formats and rules.

# Get Started

## Install via npm
Run `npm install --save express-form-handler@2.0.0-beta.1`

## Create a form file
```js
//./form/user.js

const formHandler = require('express-form-handler');
const User = require('./../models/user')
 
form = formHandler.create([
  {
    name: 'username',
    label: 'Username',
    format: formHandler.format.string(),
    rules: [
      formHandler.rule.required(), 
      formHandler.rule.minlength(4)
    ]
  }, 
  {
    name: 'password',
    label: 'Password',
    format: formHandler.format.string(),
    rules: [
      formHandler.rule.required(), 
      formHandler.rule.minlength(6)
    ]
  },
  {
    name: 'passwordConfirm',
    label: 'Confirm password',
    format: formHandler.format.string(),
    rules: [
      formHandler.rule.required(),
      formHandler.rule.equalsto('password')
    ]
  }
])

form.configure({
  modelStrategy: new formHandler.MongooseStrategy(User),
  validationByModel: false
})

module.exports = form

```
### formats supported (with node-validator help!)

- **alpha** - check if the string contains only letters (a-zA-Z).
- **alphanumeric** - check if the string contains only letters and numbers.
- **date** - check if the string is a date.
- **email** - check if the string is an email.
- **float** - check if the string is a float.
- **int** - check if the string is an integer.
- **numeric** - check if the string contains only numbers.
- **url** - check if the string is an URL.

### Form constraints supported

- **equalsto** - check if the field value match with the given field's label value.
- **required** - check if the field value exist and is not empty|false|null.
- **custom** - a custom function that must return a boolean and accept the field value as first argument
- **minlength**
- **maxlength**

## Use the route middleware

*Forms must be submitted by POST, PUT or PATCH method.*

```js
//./routes/user.js

const userForm = require('./../form/user');

//...

app.post('/registration', userForm.process, function(req, res, next) {
    if(!req.form.isValid) {
        return next({ error: { status:400 } });
    }
    
    //else...
    console.log(req.form.username);
    console.log(req.form.password);
});
```

## Extend a form

```js
//./form/userAddress.js

const formHandler = require('express-form-handler');
const userForm = require('./user');

module.exports = formHandler.create([
    //...
]).extends(userForm);
```

# Contribute

All PR are welcome !  
Feel free to open an issue if you found a bug or if you have an idea that can improve this package (new features, performance issues...).

# Changelog

## v2.0.0-alpha.x
- Rewrite the module in order to have a more flexible way to personalized its behavior with model strategies and formats / rules strategies. That means, if something is missing for you, you can create a new strategy to create a new format, or a new rule or even a new model handler. juste herit your object with the corresponding strategy object which are exposed at the entry point of the module.

## v1.2.x

- Add model persitence

## v1.1.3

- Minor fix: readme, error in test...

## v1.1.1 & v1.1.2

- Important fix bug: no constraints checked in 1.1.0

## v1.1.0

- Add the custom constraint
- Add support for array field value (checkbox, select (multiple)...)
- Add async dependencies

## v1.0.0

- Remove the duty to create a new Form instance.
- Add inheritance feature with `extend()` method.

## v0.3.1

- Fix custom error messages for constraint errors (equals to, required). I forgot to implement that :).
- Add tests for this.

## v0.3.0

- Add custom error messages feature.
- Fix i18n error. 
  - If the i18n error was already used by your project and configured, on showing translated error messages, that overwrite your i18n configuration settings.  
  - Then, I removed i18n dependency for a simple require-dir on json files.
- Add common.js file to handle some 'magic values' through constants system.
