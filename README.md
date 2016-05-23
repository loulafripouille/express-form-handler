# express-form-handler
Yet another form-handler for the Node.js framework: Express.
This form-handler allows you to define your forms in separated files and reuse it at any time.
Then, it handles the form validation with an Express route middleware.

>This module doesn't provide a form markup generator! It's just a back-end form-handler.

[![Build Status](https://travis-ci.org/laudeon/express-form-handler.svg?branch=master)](https://travis-ci.org/laudeon/express-form-handler) [![npm version](https://badge.fury.io/js/express-form-handler.svg)](https://badge.fury.io/js/express-form-handler)

# Get Started

## Install via npm
Run `npm install --save express-form-handler`

## Create a form file:
```js
//./form/user.js

var FormHandler = require('express-form-handler');
var form = new FormHandler();

module.exports = form.create({
    fields: {
        username: {
            label: 'Username', 
            type: 'text', 
            required: true
        },
        email: {
            label: 'Email', 
            type: 'email', 
            required: true
        },
        password: {
            label: 'Password', 
            type: 'text', 
            required: true, 
            equal: {
                label: 'Password confirmation', 
                to: 'passwordVerif' 
            }
        }
        passwordVerif: {
            label: 'Password confirmation', 
            type: 'text', 
            required: true
        }
    }
});
```

### Default values

 - **`label`** field member is set with the fields key value.
 - **`messages`** field member contains the default error messages (@see ./locales)

by default, the locale is 'en'. So, error messages are in english if there is no second parameter. But you can pass the locale in second parameter of `create()` method.

#### Locales currently integrated: 

- en
- fr

#### Error messages

You can customize error messages. This module provides three placeholder to help you in that task:
 - `%field%` the field label
 - `%field.type%` the field type
 - `%equal.field%` the field (label) that the current field must match

See how you can do this :
```js
//./form/user.js

var FormHandler = require('express-form-handler');
var form = new FormHandler();

module.exports = form.create({
    fields: {
        username: {
            label: 'Username', 
            type: 'text', 
            required: true
        },
        email: {
            label: 'Email', 
            type: 'email', 
            required: true,
            messages: {
                required: 'The field %field% is required',
                integrity: 'The field %field% must respect the %field.type% format' //integrity = type
            }
        },
        password: {
            label: 'Password', 
            type: 'text', 
            required: true, 
            equal: {
                label: 'Password confirmation', 
                to: 'passwordVerif' 
            },
            messages: {
                equal: 'The field %field% must be equal to the field %equal.field%'
            }
        }
        passwordVerif: {
            label: 'Password confirmation', 
            type: 'text', 
            required: true
        }
    }
});
```

### Form type supported (with node-validator help!)

- **alpha** - check if the string contains only letters (a-zA-Z).
- **alphanumeric** - check if the string contains only letters and numbers.
- **ascii** - check if the string contains ASCII chars only.
- **base64** - check if a string is base64 encoded.
- **boolean** - check if a string is a boolean.
- **creditCard** - check if the string is a credit card.
- **dataURI** - check if the string is a [data uri format](https://developer.mozilla.org/en-US/docs/Web/HTTP/data_URIs).
- **date** - check if the string is a date.
- **decimal** - check if the string represents a decimal number, such as 0.1, .3, 1.1, 1.00003, 4.0, etc.
- **email** - check if the string is an email.
- **FQDN** - check if the string is a fully qualified domain name (e.g. domain.com).
- **float** - check if the string is a float.
- **hexColor** - check if the string is a hexadecimal color.
- **hexadecimal** - check if the string is a hexadecimal number.
- **IP** - check if the string is an IP (version 4 or 6).
- **ISBN** - check if the string is an ISBN (version 10 or 13).
- **int** - check if the string is an integer.
- **JSON** - check if the string is valid JSON (note: uses JSON.parse).
- **lowercase** - check if the string is lowercase.
- **MACAddress** - check if the string is a MAC address.
- **mobilePhone** - check if the string is a mobile phone number.
- **null** - check if the string is null (has a length of zero).
- **numeric** - check if the string contains only numbers.
- **URL** - check if the string is an URL.
- **UUID** - check if the string is a UUID (version 3, 4 or 5).
- **uppercase** - check if the string is uppercase.

### Form constraints supported

- **equal** - check if the field value match with the given field value.
- **required** - check if the field value exist and is not empty|false|null.

#### Coming soon

- **minLength**
- **maxLength**
- **eqLength**
- **gtThan** (digit field)
- **ltThan** (digit field)

## Add the route middleware
```js
//./routes/user.js

var userForm = require('./../form/user');

//...

app.post('/registration', userForm.handleRequest(), function(req, res, next) {
    if(!req.form.isValid) {

        res.render('user/registration', {});
    }
});
```

## Show form errors from view
```jade
//./views/user/registration.jade

//...

if formErrors
    for error in formErrors
        div(class="alert alert-danger") #{error.message}

//the object error have three members: message, field (the field label), and the error type ('integrity', 'equal constraint', 'require constraint') 

```

# Dependencies

- [node-validator](https://www.npmjs.com/package/validator) for generic validations
- [require-dir](https://www.npmjs.com/package/require-dir) Helper to require() directories

# Contribute

All PR are welcome !  
Feel free to open an issue if you found a bug or if you have an idea that can improve this package (new features, performance issues...).

# Test

Install mocha if you don't have it: `npm install -g mocha`
Go to the root directory and run test with: `mocha`

# Changelog

## v0.3.1

- Fix custom error messages for constraint errors (equals to, required). I forgot to implement that :).
- Add tests for this.

## v0.3.0

- Add custom error messages feature.
- Fix i18n error. 
  - If the i18n error was already used by your project and configured, on showing translated error messages, that overwrite your i18n configuration settings.  
  - Then, I removed i18n dependency for a simple require-dir on json files.
- Add common.js file to handle some 'magic values' through constants system.


# I'm working on...

- **Inheritance** that allow you to extend form (DRY principle)
- **Model persistence** a form can be related to a model (mongoDB for exemple), so, on a post request, if form is valid, the form data will be persisted in the given model.
