# express-form-handler
A form handler for the Node.js framework Express.js

This module allows you to define your form in separated file, **reuse** and **extend** it at any time.
Then, it process the form through an Express route middleware.

You can attach a model to your form. In this way, a new model instance will be updated with form data. If a params 'id' is present in the `req` object, the model instance will be retrieve from the DB.
This feature is developed with the strategy principle, feel free to use yours. The module propose a mongoose and a sequelize strategy.

>This module doesn't provide a form markup generator! It's just a back-end form-handler (for the moment?).

[![Build Status](https://travis-ci.org/laudeon/express-form-handler.svg?branch=master)](https://travis-ci.org/laudeon/express-form-handler) [![npm version](https://badge.fury.io/js/express-form-handler.svg)](https://badge.fury.io/js/express-form-handler)

- [Get Started](#get-started)
	- [Install via npm](#install-via-npm)
	- [Create a form file](#create-a-form-file)
	- [Use the route middleware](#use-the-route-middleware)
	- [Extend a form](#extend-a-form)
- [Contribute](#contribute)
- [Changelog](#changelog)

# Get Started

## Install via npm
Run `npm install --save express-form-handler`

## Create a form file
```js
//./form/user.js

const formHandler = require('express-form-handler');
const User = require('./../models/user')

formHandler.setModelStrategy(new formHandler.MongooseStrategy(User))
 
module.exports = formHandler.create([
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
Forms must be submitted by POST method. In your routes file, you can call a route with "app.post" or "app.all" like this :
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
