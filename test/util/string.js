'use strict';

var test = require('unit.js');

describe('util/string::ucfirst()', function() {

    var String = require('./../../lib/util/string');

    it('Must formats the given string into upper case first format', function () {

        test.value(String.ucfirst('test')).is('Test');
        test.value(String.ucfirst('test')).isNot('test');

    });

});