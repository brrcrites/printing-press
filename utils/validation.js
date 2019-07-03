const TestResult = require('./test-result.js');

/**
 * A class that holds generic validation functions
 */
class Validation {

    /**
     * The default value of name and id.
     *
     * @returns {string}
     */
    static get DEFAULT_STR_VALUE() {
        return 'unassigned';
    }

    /**
     * The default x-/y-span values.
     *
     * @since 1.0.0
     *
     * @returns {number}
     */
    static get DEFAULT_SPAN_VALUE() {
        return -1;
    }


    /**
     * The default value of x/y values of a Coord object.
     *
     * @since 1.0.0
     *
     * @returns {number}
     */
    static get DEFAULT_COORD_VALUE() {
        return -1;
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
     * @param {string}  field   A string representation of the field name for
     *                          the error message.
     * @param {string}  caller  A string representation of the caller's class
     *                          for the error message.
     *
     * @returns {string}    A TestResult depending on whether the string was
     *                      default, invalid or valid.
     */
    static testStringValue(value, field, caller) {
        if(value === '') {
            console.log(caller + ': Field "' + field + '" cannot be empty.');
            return TestResult.INVALID;
        }

        if (value === Validation.DEFAULT_STR_VALUE) {
            console.log(caller + ': Field "' + field + '" is set to the default value.');
            return TestResult.DEFAULT;
        }

        return TestResult.VALID;
    }

    /**
     * Tests the given value against the rules of spans.
     *
     * Cannot be less than 1. Cannot equal the default span value.
     *
     * @since 1.0.0
     *
     * @param {number}  value   A value to test against the span rules.
     * @param {string}  axis    The axis on which this span lies.
     * @param {string}  caller  A string representation of the caller's class
     *                          for the error message.
     *
     * @returns {string}    A TestResult value depending on whether the spa was
     *                      default, invalid or valid.
     */
    static testSpanValue(value, axis, caller) {
        if (value === Validation.DEFAULT_SPAN_VALUE) {
            console.log(caller + ': Field "' + axis + 'Span" is set to the default value.');
            return TestResult.DEFAULT;
        }

        if (value < 1) {
            console.log(caller + ': Field "' + axis + 'Span" cannot be less than 1.');
            return TestResult.INVALID;
        }

        return TestResult.VALID;
    }

    /**
     * Tests the given value agains the rules of coords.
     *
     * Cannot be negative. Cannot equal the default value.
     *
     * @since 1.0.0
     *
     * @param {number}  value   A value to test against the span rules.
     * @param {string}  field   A string representation of the field name for
     *                          the error message.
     * @param {string}  caller  A string representation of the caller's class
     *                          for the error message.
     *
     * @returns {string}    A TestResult value depending on whether the spa was
     *                      default, invalid or valid.
     */
    static testCoordValue(value, field, caller) {
        if (value === Validation.DEFAULT_COORD_VALUE) {
            console.log(caller + ': Field "' + field + '" is set to the default value.');
            return TestResult.DEFAULT;
        }

        if (value < 0) {
            console.log(caller + ': Field "' + field + '" cannot be negative.');
            return TestResult.INVALID;
        }

        return TestResult.VALID;
    }
}

module.exports = Validation;