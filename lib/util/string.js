'use strict';

/**
 *
 * @type {{}}
 */
module.exports = {

    /**
     *
     * @param string
     * @returns {string}
     */
    ucfirst: function (string) {

        return string.charAt(0).toUpperCase() + string.slice(1);
    }
};