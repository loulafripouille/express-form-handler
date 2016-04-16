'use strict';

var fs = require('fs');

/**
 * Load `*.js` under current directory as properties
 * i.e., `User.js` will become `exports['User']` or `exports.User`
 */
fs.readdirSync(__dirname + '/').forEach(function(file) {
    if (file.match(/\.js$/) && file !== 'index.js') {
        var name = file.replace('.js', '');
        exports[name] = require('./' + file);
    }
});