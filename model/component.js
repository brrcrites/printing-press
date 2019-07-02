const ParchKey = require('./parch-key.js');
const TestResult = require('../utils/test-result.js');

class Component extends ParchKey {

    /**
     * An array containing all of the Layers that this component exists on.
     *
     * @since   1.0.0
     * @access  public
     *
     * @type    {Layer[]}
     */
    layers;

    /**
     * The amount of space this component takes up in the x direction.
     *
     * @since   1.0.0
     * @access  public
     *
     * @type    {number}
     */
    xSpan;

    /**
     * The amount of space this component takes up in the y direction.
     *
     * @since   1.0.0
     * @access  public
     *
     * @type    {number}
     */
    ySpan;

    /**
     * The type of component this component object represents.
     *
     * @since   1.0.0
     * @access  public
     *
     * @type    {string}
     */
    entity;

    /**
     * An array containing all of the Ports on this component.
     *
     * @since   1.0.0
     * @access  public
     *
     * @type    {Port[]}
     */
    ports;

    /**
     *
     * Constructs the Component object.
     *
     * All parameters are optional. Strings default to ParchKey's default
     * string. Spans default to DEFAULT_SPAN_VALUE. Arrays default to null.
     *
     * @class
     * @augments ParchKey
     *
     * @since   1.0.0
     *
     * @see ParchKey.DEFAULT_STR_VALUE
     *
     * @param {string}  name    The name of the component.
     * @param {string}  id      The unique id of the component.
     * @param {Layer[]} layers  The Layers on which this component exists.
     * @param {number}  xSpan   How much space this component takes up in the x direction.
     * @param {number}  ySpan   How much space this component takes up in the y direction.
     * @param {string}  entity  The type of component this component object represents.
     * @param {Port[]}  ports   The ports on this component.
     */
    constructor(name = ParchKey.DEFAULT_STR_VALUE, id = ParchKey.DEFAULT_STR_VALUE, layers = null,
                xSpan = Component.DEFAULT_SPAN_VALUE, ySpan = Component.DEFAULT_SPAN_VALUE,
                entity = ParchKey.DEFAULT_STR_VALUE, ports = null) {

        super(name, id);
        this.layers = layers;
        this.xSpan = xSpan;
        this.ySpan = ySpan;
        this.entity = entity;
        this.ports = ports;

    }

    validate() {
        let valid = super.validate();

        valid = this.validateLayers() ? valid : false;
        valid = this.validateSpan(this.xSpan, 'x') ? valid : false;
        valid = this.validateSpan(this.ySpan, 'y') ? valid : false;
        valid = this.validateEntity() ? valid : false;
        valid = this.validatePorts() ? valid : false;

        return valid;
    }

    /**
     * Validates the layers field.
     *
     * No layer string can be empty. The layers field itself cannot be null.
     *
     * @since 1.0.0
     *
     * @returns {boolean}
     */
    validateLayers() {
        let valid = true;

        if (!this.layers) {
            console.log('Component: Field "layers" is set to the default value.');
            return false;
        }

        this.layers.forEach(function (value, index, array) {
            if (value === '') {
                valid = false;
                console.log('Component: Field "layers" cannot have any empty strings. See layers[${index}].');
            }
        });

        return valid;
    }


    /**
     * Validates the given span value.
     *
     * Spans must not equal the default value. Spans must not be less than 1.
     *
     * @since 1.0.0
     *
     * @param {number}  value   The span value to validate.
     * @param {string}  axis    The axis on which this span lies.
     * @returns {boolean}
     */
    validateSpan(value, axis) {
        switch (Component.testSpan(value)) {
            case TestResult.DEFAULT:
                console.log('Component: Field "' + axis + 'Span" is set to the default value.');
                return false;

            case TestResult.INVALID:
                console.log('Component: Field "' + axis + 'Span" cannot be less than 1.');
                return false;
        }

        return true;
    }

    /**
     * Validates the entity field.
     *
     * Follows the rules of ParchKey's test string function.
     *
     * @since 1.0.0
     *
     * @see ParchKey.testStringValue
     *
     * @returns {boolean}
     */
    validateEntity() {
        return ParchKey.testStringValue(this.entity, 'entity', 'Component') === TestResult.VALID;
    }

    /**
     * Validate the ports field.
     *
     * Calls the Port validation function on each port in the array. The ports field cannot be null.
     *
     * @since 1.0.0
     *
     * @returns {boolean}
     */
    validatePorts() {
        let valid = true;

        if (!this.ports) {
            console.log('Component: Field "ports" is set to the default value.');
            return false;
        }

        this.ports.forEach(function(value, index, array) {
            valid = value.validate() ? valid : false;

            for (let i = index + 1; i < array.length; i++) {
                // Check duplicate port labels
                if (value.label === array[i].label) {
                    valid = false;
                    console.log('Component: Field "ports" has duplicate labels (' + value.label + ') at indices ' +
                            index + ' and ' + i + '.');
                }

                // Check overlapping port locations
                if (value.pos.is(array[i].pos)) {
                    valid = false;
                    console.log('Component: Field "ports" has overlapping ports at location ' + value.pos + ' at' +
                            ' indices ' + index + ' and ' + i + '.');
                }
            }


        });

        // Check invalid port locations
        for (let i = 0; i < this.ports.length; i++) {
            // The coord validation checks for negative #s so we only need to check for greater than spans here.
            if (this.ports[i].pos.x > this.xSpan || this.ports[i].pos.y > this.ySpan) {
                valid = false;
                console.log('Component: Field "ports" contains a port that exists outside of the component at ' +
                        this.ports[i].pos + ' at index ' + i + '.');

            } else if (!((this.ports[i].pos.x === 0 || this.ports[i].pos.x === this.xSpan) ||
                    (this.ports[i].pos.y === 0 || this.ports[i].pos.y === this.ySpan))) {

                valid = false;
                console.log('Component: Field "ports" contains a port in an invalid location ' + this.ports[i].pos + ' at' +
                        'index ' + i + '.');
            }
        }

        // Check invalid port layers
        for (let i = 0; i < this.ports.length; i++) {
            // Make sure we don't search layers if it still has the default value
            if (this.layers && !this.layers.includes(this.ports[i].layer)) {
                valid = false;
                console.log('Component: Field "ports" contains a port with an invalid layer (' + this.ports[i].layer +
                        ') at index ' + i + '.');
            }
        }

        return valid;
    }

    /**
     * Tests the given value against the rules of spans.
     *
     * Cannot be less than 1. Cannot equal the default span value.
     *
     * @since 1.0.0
     *
     * @param {number}  value A value to test against the span rules.
     *
     * @returns {string} A TestResult value depending on whether the the
     *                   was default, invalid or valid.
     */
    static testSpan(value) {
        if (value === Component.DEFAULT_SPAN_VALUE) {
            return TestResult.DEFAULT;
        }

        if (value < 1) {
            return TestResult.INVALID;
        }

        return TestResult.VALID;
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
}

module.exports = Component;