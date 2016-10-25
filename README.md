# express-form-handler
Yet another form-handler for the Node.js framework: Express.
This form-handler allows you to define your form in separated file and **reuse** and **extend** it at any time.
Then, it handles the form validation with an Express route middleware.

>This module doesn't provide a form markup generator! It's just a back-end form-handler.

[![Build Status](https://travis-ci.org/laudeon/express-form-handler.svg?branch=master)](https://travis-ci.org/laudeon/express-form-handler) [![npm version](https://badge.fury.io/js/express-form-handler.svg)](https://badge.fury.io/js/express-form-handler)

# Get Started

## Install via npm
Run `npm install --save express-form-handler`

## Create a form file:
```js
//./form/user.js

const FormHandler = require('express-form-handler');

module.exports = FormHandler.create({
    fields: {
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
        },
        passwordVerif: {
            label: 'Password confirmation', 
            type: 'text', 
            required: true
        }
    }
});
```

### Default values

 - **`label`** field member is set with the fields key value (e.g  email: {...} has, by default, the label value: 'email'). 
 - **`messages`** if no messages are provided, the default error messages will be used (see `./locales`).

The default locale is 'en'. But you can choose the locale with the "setLocale" method.
```js
var FormHandler = require('express-form-handler');
FormHandler.setLocale("fr");
```
#### Locales currently integrated: 

- en
- fr

#### Error messages

You can customize error messages. This module provides three placeholders to help you in that task:
 - `%field%` the field label
 - `%field.type%` the field type
 - `%equal.field%` the field (label) that the current field must match

See how you can do this :
```js
//./form/user.js

const FormHandler = require('express-form-handler');

module.exports = FormHandler.create({
    fields: {
        username: {
            label: 'Username', 
            type: 'text', 
            required: true,
            custom: (value) => {
                if(value.length < 3) return false;
                return true;
            },
            messages: {
                custom: 'The field %field% minimum length is 3 chars.',
                required: 'The field %field% is required'
            }
        },
        email: {
            label: 'Email', 
            type: 'email', 
            required: true,
            messages: {
                required: 'The field %field% is required',
                integrity: 'The field %field% must respect the %field.type% format' //integrity = type
            }
        }
        //...
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
- **custom** - a custom function that must return a boolean and accept the field value as first argument

#### Coming soon (~ v1.3.x)

- **minLength**
- **maxLength**
- **eqLength**
- **gtThan** (digit field)
- **ltThan** (digit field)

## use the route middleware
Forms must be submitted by POST method. In your routes file, you can call a route with "app.post" or "app.all" like this :
```js
//./routes/user.js

const userForm = require('./../form/user');

//...

app.post('/registration', userForm.handleRequest, function(req, res, next) {
    if(!req.form.isValid) {

        return res.render('user/registration', {});
    }
    
    //else...
    console.log(req.form.username);
    console.log(req.form.password);
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

## Extend a form

```js
//./form/userAddress.js

const FormHandler = require('express-form-handler'),
      userForm = require('./user');

module.exports = FormHandler.create({
    fields: {
        address: {
            type: 'text',
            required: true,
            label: 'Address'
        },
        city: {
            type: 'text',
            required: true,
            label: 'City'
        }
        //..
    }
}).extend(userForm);
```

# Model persitence

- When you add or update a model throught a form, you can specify which model is related to the form. Then form data will be populated in the given model.
- At this time, just the mongoose model system is implemented. But, is really simple to add one by creating the right 'adapter'.

Set the form's model by passing it in the second argument of the `create()` function. Set the adapter with the `setAdapter()` method.

```js
const 
    FormHandler = require('express-form-handler'),
    loginForm = require('./login'),
    User = require('./../models/user')

FormHandler.setLocale('fr')
FormHandler.setAdapter('mongoose')

module.exports = FormHandler.create({
    fields: {
        email: {
            label: 'email',
            type: 'email',
            required: true
        },
        passconfirm: {
            label: 'Confirmer le mot de passe',
            type: 'text',
            required: true,
            equal: {
                to: 'password',
                label: 'Mot de passe'
            },
            messages: {
                equal: 'La confirmation doit être identique au mot de passe'
            }
        }
    }
}, User).extend(loginForm)
```

# Dependencies

- [node-validator](https://www.npmjs.com/package/validator) for generic validations
- [require-dir](https://www.npmjs.com/package/require-dir) Helper to require() directories
- [async](https://www.npmjs.com/package/async) for some async actions (loops, ...)

# Contribute

All PR are welcome !  
Feel free to open an issue if you found a bug or if you have an idea that can improve this package (new features, performance issues...).

# Test

Install mocha if you don't have it: `npm install -g mocha`
Go to the root directory and run test with: `mocha`

# Changelog

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


# I'm working on...

- **Model persistence** a form can be related to a model (mongoDB for exemple), so, on a post request, if form is valid, the form data will be persisted in the given model.
