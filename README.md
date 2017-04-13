# express-form-handler

A form handler for the Node.js framework: Express.js

[![Build Status](https://travis-ci.org/laudeon/express-form-handler.svg?branch=master)](https://travis-ci.org/laudeon/express-form-handler) [![npm version](https://badge.fury.io/js/express-form-handler.svg)](https://badge.fury.io/js/express-form-handler)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

- [Why?](#why)
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

**Make the form hanlding easier by avoiding repetitive tasks such as fields validation or find the one element to update according to the id route parameter.**

**Define a form** (fields, field format & validation rules, ...), process the form validation with a route middleware then use the `req.form` object into the next route middleware to check the form validity or get form values.

**Extend a form** with other forms.

**Create your own formats and rules.**

**Attach a model** to a form through a **model strategy** in order to automate data binding to it. When a `:id` parameter is present in the `req.params` object, form-handler will try to find the corresponding document into the database before update it.

Create a custom model strategy corresponding to your ODM / ORM.

Chose the way you want to process the validation: by the defined form's fields format and rules or by the model strategy `validate()` method.

# Get Started

## Install via npm

Run `npm install --save express-form-handler@2.0.0-beta.5`

## Create a form file

```js
const formHandler = require('express-form-handler');
const User = require('./models/user')
 
let form = formHandler.create([
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

form.config({
  modelStrategy: new formHandler.MongooseStrategy(User),
  validationByModel: false
})

module.exports = exports = form

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
const userForm = require('./user-form');

//...

app.post('/registration', userForm.process, function(req, res, next) {
    if(!req.form.isValid) {
        return next({ error: { status:400 } });
    }
    
    //else...
    console.log(req.form.username);
    console.log(req.form.password);
    console.log(req.form.model);
});
```

## Extend a form

```js
const formHandler = require('express-form-handler');
const userForm = require('./user-form');

module.exports = formHandler.create([
    //...
]).extends(userForm);
```

# Go further

## Configuration

```js
form.config({
  modelStrategy: new formHandler.MongooseStrategy(User),
  validationByModel: false // true if you want to use the validate() method from the model if it has one.
})
```
## Model Strategy

You can create your own model strategy by creating an object which extends the main strategy provided by this module: `formHandler.Strategy`.

## Rules & Formats

You can create your own field rule or field format by creating an object which extends the main rule or format object provided by this module: `formHandler.FieldRule` - `formHandler.FieldFormat`.

### Create a new field rule

```js
const Fieldrule = require('express-form-handler').FieldRule

class YourRule extends Fieldrule {
  constructor (something) {
    this.name = 'myRule' // Optional...
    this.something = something
  }

  check (field) {
    if (field.value !== this.something) {
      this.error = `The field ${field.label} ...`
      return false
    }

    return true
  }
}
module.exports = exports = YourRule
```

### Use your own field rule

```js
const formHandler = require('express-form-handler');
const YourRule = require('./yourule')

let form = formHandler.create([
  {
    name: 'username',
    label: 'Username',
    format: formHandler.format.string(),
    rules: [
      formHandler.rule.required(), 
      formHandler.rule.minlength(4),
      new YourRule(something)
    ]
  }, 
  // ...
])

// ...

```

### Create a new field format

```js
const validator = require('validator')
const Fieldformat = require('express-form-handler').FieldFormat

class YourFormat extends FieldFormat {
  constructor () {
    this.name = 'myFormat' // Optional...
  }

  check (field) {
    if (!validator.isBase64(field.value)) {
      this.error = `The field ${field.label} ...`
      return false
    }

    return true
  }
}
module.exports = exports = YourFormat
```

### Use your own field format

```js
const formHandler = require('express-form-handler');
const YourFormat = require('./yourformat')

let form = formHandler.create([
  {
    name: 'username',
    label: 'Username',
    format: new YourFormat(),
    rules: [
      formHandler.rule.required(), 
      formHandler.rule.minlength(4)
    ]
  }, 
  // ...
])

// ...

```

# Contribute

All PR are welcome !  
Feel free to open an issue if you found a bug or if you have an idea that can improve this package (new features, performance issues...).

# Changelog


## v2.0.0-beta
- Remove external stateless configuration to let form object handle it. It makes more sens to have a stateful configuration, and its easier to understand.
- fix bugs

## v2.0.0-alpha.x

Rewrite the module in order to have a more flexible way to personalized its behaviors with:
  - model strategies
  - formats/rules strategies. 

That means, if something is missing for you in this package, you can create a new model strategy or create a new field format or rule. juste inherit your object with the corresponding strategy object which are exposed at the entry point of the module. 

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
