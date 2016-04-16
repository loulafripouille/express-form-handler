# express-form-handler

Yet another form handler for the Node.js framework: Express.
This form handler allow you to define your forms in separated files and reuse it at any time.
Then, handle the form validation with an Express route middleware.

This module doesn't provide a form markup generator! It's just a back-end form handler.

[![Build Status](https://travis-ci.org/laudeon/express-form-handler.svg?branch=master)](https://travis-ci.org/laudeon/express-form-handler) [![npm version](https://badge.fury.io/js/express-form-handler.svg)](https://badge.fury.io/js/express-form-handler)

#Get Started

##Requirements & dependencies

- Express ~4
- [node-validator](https://www.npmjs.com/package/validator)

##Install via npm
Run `npm install --save express-form-handler`

##Create a form file:
```js
//./form/user.js

var FormHandler = require('express-form-handler');
var form = new FormHandler();

module.exports = form.create({
    fields: {
        username: {type: 'text', required: true},
        email: {type: 'email', required: true},
        password: {type: 'text', required: true, equal: 'passwordVerif'}
        passwordVerif: {type: 'text', required: true}
    }
});
```

##Add the middleware
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

##Get the form errors in the view
```jade
//./views/user/registration.jade

//...

if formErrors
    for error in formErrors
        div(class="alert alert-danger") #{error.<fieldName>}

//...

```

#Contribute

All PR are welcome !

#Test

Install mocha if you don't have it: `npm install -g mocha`
Go to the root directory and run test with: `mocha`
