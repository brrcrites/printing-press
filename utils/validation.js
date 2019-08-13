
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
     * @see Connection.connectionType
     *
     * @returns {string}
     */
    static get DEFAULT_CON_TYPE() {
        return 'channel';
    }

    /**
     * The default number of tabs for a Message.
     *
     * @see Message.tabs
     * @since 1.0.0
     *
     * @returns {number}
     */
    static get DEFAULT_LOG_TABS() {
        return 0;
    }

    /**
     * Test a string value against the ParchKey name/id rules.
     *
     * Strings cannot be empty. Must be a string. Must not evaluate to falsey.
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
        if (!value) {
            console.log(caller + ': Field "' + field + '" equates to falsey.');
            return false;
        }
        if (typeof value !== 'string') {
            console.log(caller + ': Field "' + field + '" is not a string.');
            return false;
        }
        if (value === Validation.DEFAULT_STR_VALUE) {
            console.log(caller + ': Field "' + field + '" cannot be empty.');
            return false;
        }

        return true;
    }

    /**
     * Tests the given value against the rules of spans.
     *
     * Cannot be less than 1. Must be a number.
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
        if (typeof value !== 'number') {
            console.log(caller + ': Field "' + axis + '" is not a number.');
            return false;
        }
        if (value < 1) {
            console.log(caller + ': Field "' + axis + 'Span" cannot be less than 1.');
            return false;
        }

        return true;
    }

    /**
     * Tests the given value against the rules of coords.
     *
     * Cannot be negative. Cannot equal the default value. Must be a number.
     *
     * @since 1.0.0
     *
     * @param {number}  value   A value to test against the Coord rules.
     * @param {string}  field   A string representation of the field name for
     *                          the error message.
     * @param {string}  caller  A string representation of the caller's class
     *                          for the error message.
     *
     * @returns {boolean}       true if the coord value is valid, false
     *                          otherwise.
     */
    static testCoordValue(value, field, caller) {
        if (typeof value !== 'number') {
            console.log(caller + ': Field "' + field + '" is not a number.');
            return false;
        }
        if (value < 0) {
            console.log(caller + ': Field "' + field + '" cannot be negative.');
            return false;
        }

        return true;
    }

    /**
     * Tests the given value against the rules of dimensions.
     *
     * Widths cannot be negative.
     *
     * @since 1.0.0
     *
     * @see ConnectionSegment.width
     *
     * @param {number}  value   A value to test against the dimension rules.
     * @param {string}  field   A string representation of the field name for
     *                          the error message.
     * @param {string}  caller  A string representation of the caller's class
     *                          for the error message.
     *
     * @returns {boolean}       true if the dimension is valid, false
     *                          otherwise.
     */
    static testWidthValue(value, field, caller) {
        if (typeof value !== 'number') {
            console.log(caller + ': Field "' + field + '" is not a number.');
            return false;
        }
        if (value < 0) {
            console.log(caller + ': Field "' + field + '" cannot be negative.');
            return false;
        }

        return true;
    }

    /**
     * Tests the given value against the rules of depth.
     *
     * Depth must be a number.
     *
     * @since 1.0.0
     *
     * @see ConnectionSegment.depth
     * @see ComponentFeature.depth
     *
     * @param {number}  value   A value to test against the depth rules.
     * @param {string}  field   A string representation of the field name for
     *                          the error message.
     * @param {string}  caller  A string representation of the caller's class
     *                          for the error message.
     * @returns {boolean}
     */
    static testDepthValue(value, field, caller) {
        if (typeof value !== 'number') {
            console.log(caller + ': Field "' + field + '" is not a number.');
            return false;
        }

        return true;
    }
}

module.exports = Validation;