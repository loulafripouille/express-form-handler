'use strict';

module.exports = Object.freeze({

    //Error handling constants
    ERROR_TYPE_INTEGRITY: 'integrity',
    ERROR_TYPE_CONSTRAINT_EQUAL: 'equal',
    ERROR_TYPE_CONSTRAINT_REQUIRED: 'required',
    ERROR_TYPE_CONSTRAINT_CUSTOM: 'custom',

    //Translation messages constants
    ERROR_MESSAGE_INTEGRITY: 'error.integrity',
    ERROR_MESSAGE_CONSTRAINT_EQUAL: 'error.constraints.equal',
    ERROR_MESSAGE_CONSTRAINT_REQUIRED: 'error.constraints.required',
    ERROR_MESSAGE_CONSTRAINT_CUSTOM: 'error.constraints.custom'
});
