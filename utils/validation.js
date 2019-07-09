
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
        return '';
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
     * The default dimension value.
     *
     * @since 1.0.0
     *
     * @returns {number}
     */
    static get DEFAULT_DIM_VALUE() {
        return -1;
    }

    /**
     * The default type of a Connection Feature.
     *
     * @since 1.0.0
     *
     * @see Connection.type
     *
     * @returns {string}
     */
    static get DEFAULT_CON_TYPE() {
        return 'channel';
    }

    /**
     * Test a string value against the ParchKey name/id rules.
     *
     * Strings cannot be empty.
     *
     * @since 1.0.0
     *
     * @see Validation.DEFAULT_STR_VALUE
     *
     * @param {string}  value   The value to be tested.
     * @param {string}  field   A string representation of the field name for
     *                          the error message.
     * @param {string}  caller  A string representation of the caller's class
     *                          for the error message.
     *
     * @returns {boolean}       true if the string is valid, false otherwise.
     */
    static testStringValue(value, field, caller) {
        if (value === Validation.DEFAULT_STR_VALUE) {
            console.log(caller + ': Field "' + field + '" cannot be empty.');
            return false;
        }

        return true;
    }

    /**
     * Tests the given value against the rules of spans.
     *
     * Cannot be less than 1.
     *
     * @since 1.0.0
     *
     * @param {number}  value   A value to test against the span rules.
     * @param {string}  axis    The axis on which this span lies.
     * @param {string}  caller  A string representation of the caller's class
     *                          for the error message.
     *
     * @returns {boolean}       true if the span is valid, false otherwise.
     */
    static testSpanValue(value, axis, caller) {
        if (value < 1) {
            console.log(caller + ': Field "' + axis + 'Span" cannot be less than 1.');
            return false;
        }

        return true;
    }

    /**
     * Tests the given value against the rules of coords.
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
     * @returns {boolean}       true if the coord value is valid, false
     *                          otherwise.
     */
    static testCoordValue(value, field, caller) {
        if (value < 0) {
            console.log(caller + ': Field "' + field + '" cannot be negative.');
            return false;
        }

        return true;
    }

    /**
     * Tests the given value against the rules of dimensions (depth/width).
     *
     * Dimensions cannot be negative.
     *
     * @since 1.0.0
     *
     * @param {number}  value   A value to test against the span rules.
     * @param {string}  field   A string representation of the field name for
     *                          the error message.
     * @param {string}  caller  A string representation of the caller's class
     *                          for the error message.
     *
     * @returns {boolean}       true if the dimension is valid, false
     *                          otherwise.
     */
    static testDimensionValue(value, field, caller) {
        if (value < 0) {
            console.log(caller + ': Field "' + field + '" cannot be negative.');
            return false;
        }

        return true;
    }
}

module.exports = Validation;