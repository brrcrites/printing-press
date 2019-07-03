const TestResult = require('../utils/test-result.js');

class ParchKey {

    /**
     * The name of the top level key object.
     *
     * @type {string}
     */
    name;
    /**
     * The id of the top level key object.
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
        if (ParchKey.testStringValue(this.name, 'name', 'ParchKey') !== TestResult.VALID ||
                ParchKey.testStringValue(this.id, 'id', 'ParchKey') !== TestResult.VALID) {
            return false;
        }

        return true;
    }

    /**
     * Test a string value against the ParchKey name/id rules.
     *
     * Strings cannot be null. Strings cannot equal the default value.
     *
     * @since 1.0.0
     *
     * @see ParchKey.DEFAULT_STR_VALUE
     *
     * @param {string}  value   The value to be tested.
     * @param {string}  field   A string representation of the field name for the error message.
     * @param {string}  caller  A string representation of the caller's class for the error message.
     *
     * @returns {string} A TestResulf
     */
    static testStringValue(value, field, caller) {
        if(value === '') {
            console.log(caller + ': Field "' + field + '" cannot be empty.');
            return TestResult.INVALID;
        }

        if (value === ParchKey.DEFAULT_STR_VALUE) {
            console.log(caller + ': Field "' + field + '" is set to the default value.');
            return TestResult.DEFAULT;
        }

        return TestResult.VALID;
    }

    /**
     * The default value of name and id.
     *
     * @returns {string}
     */
    static get DEFAULT_STR_VALUE() {
        return 'unassigned';
    }
}


module.exports = ParchKey;
