'use strict';

/**
 *
 * @type {{}}
 */
module.exports = {

    /**
     * @description
     * test is the needle is in the array given
     *
     * @param {Array} array
     * @param {string|Array} needle
     * @returns {boolean}
     */
    contains: function (array, needle)
    {
        return array.indexOf(needle) > -1;
    }

};