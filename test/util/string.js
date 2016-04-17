'use strict';

var test = require('unit.js');

describe('util/String', function() {

    var String = require('./../../lib/util/string');

    it('String::ucfirst()', function () {

        test.value(String.ucfirst('test')).is('Test');
        test.value(String.ucfirst('test')).isNot('test');

    });

});