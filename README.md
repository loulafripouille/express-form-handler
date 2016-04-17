# express-form-handler
Yet another form-handler for the Node.js framework: Express.
This form-handler allows you to define your forms in separated files and reuse it at any time.
Then, it handles the form validation with an Express route middleware.

>This module doesn't provide a form markup generator! It's just a back-end form-handler.

[![Build Status](https://travis-ci.org/laudeon/express-form-handler.svg?branch=master)](https://travis-ci.org/laudeon/express-form-handler) [![npm version](https://badge.fury.io/js/express-form-handler.svg)](https://badge.fury.io/js/express-form-handler)

# Works & tested with

## Requirements

- Express ~4

## Dependencies

- [node-validator](https://www.npmjs.com/package/validator) for generic validations
- [i18n-2](https://www.npmjs.com/package/i18n-2) for the internationalisation of the error messages

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
        username: {label: 'Username', type: 'text', required: true},
        email: {label: 'Email', type: 'email', required: true},
        password: {label: 'Password', type: 'text', required: true, equal: 'passwordVerif'}
        passwordVerif: {label: 'Password confirmation', type: 'text', required: true}
    }
});
```

By default, the `label` member is set to the fields key value. 
Also, by default, the locale is 'en'. So, error messages are in english if there is no second parameter. But you can pass the locale in second parameter of `create()` method.

### Locales currently integrated: 

- en
- fr

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

## Add the middleware
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

## Get the form errors in the view
```jade
//./views/user/registration.jade

//...

if formErrors
    for error in formErrors
        div(class="alert alert-danger") #{error.message}

//the object error have three members: message, field (the field label), and the error type ('integrity', 'equal constraint', 'require constraint') 

```

# Contribute

All PR are welcome !

# Test

Install mocha if you don't have it: `npm install -g mocha`
Go to the root directory and run test with: `mocha`
