const Validation = require('../utils/validation.js');

class ParchKey {

    /**
     * The name of the top level key object.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {string}
     */
    name;
    /**
     * The id of the top level key object.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {string}
     */
    id;

    /**
     * @class
     *
     * @since 1.0.0
     *
     * @param {string}  name    The name of the top level key object.
     * @param {string}  id      The id of the top level key object.
     */
    constructor(name, id) {
        // This class is abstract so make sure we cannot instantiate it
        if (this.constructor === ParchKey) {
            throw new TypeError('Abstract class "ParchKey" cannot be instantiated directly.');
        }

        this.name = name;
        this.id = id;
    }

    /**
     * Validate the name and id fields.
     *
     * Does not validate uniqueness.
     *
     * @since 1.0.0
     *
     * @returns {boolean} false if either name or id are empty, true otherwise.
     */
    validate() {
        let valid = Validation.testStringValue(this.name, 'name', 'ParchKey');
        valid = Validation.testStringValue(this.id, 'id', 'ParchKey') ? valid : false;

        return valid;
    }
}


module.exports = ParchKey;
