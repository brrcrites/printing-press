const ParchKey = require('./parch-key.js');
const Validation = require('../utils/validation.js');

class Component extends ParchKey {

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
     * The layer on which the Feature Component exists.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {string}
     */
    layer;

    /**
     * The Component Features to be placed on the Architecture.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {Array}
     */
    features;

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
     * @see Validation.DEFAULT_STR_VALUE
     *
     * @param {string}  name        The name of the component.
     * @param {string}  id          The unique id of the component.
     * @param {number}  xSpan       How much space this component takes up in
     *                              the x direction.
     * @param {number}  ySpan       How much space this component takes up in
     *                              the y direction.
     * @param {string}  entity      The type of component this component object
     *                              represents.
     * @param {Array}   ports       The ports on this component.
     * @param {Array}   features    The Component Features to be placed on the
     *                              Architecture that reference this abstract
     *                              Component.
     */
    constructor(name = Validation.DEFAULT_STR_VALUE, id = Validation.DEFAULT_STR_VALUE,
                xSpan = Validation.DEFAULT_SPAN_VALUE, ySpan = Validation.DEFAULT_SPAN_VALUE,
                entity = Validation.DEFAULT_STR_VALUE, ports = [], features = []) {

        super(name, id);
        this.xSpan = xSpan;
        this.ySpan = ySpan;
        this.entity = entity;
        this.ports = ports;
        this.features = features;
    }

    /**
     * Validate the Component object.
     *
     * Entity must not be set to the default string value. See other fields'
     * validate functions for their requirements.
     *
     * @since 1.0.0
     *
     * @see validateSpans
     * @see validatePorts
     * @see validateFeatures
     * @see Validation.testStringValue
     *
     * @returns {boolean}
     */
    validate() {
        let valid = super.validate();

        valid = this.validateSpans() ? valid : false;
        valid = Validation.testStringValue(this.entity, 'entity', 'Component') ? valid : false;
        valid = this.validatePorts() ? valid : false;
        valid = this.validateFeatures() ? valid : false;

        return valid;
    }

    /**
     * Validate the x/y-span fields
     *
     * Spans must be greater than 0.
     *
     * @returns {boolean}
     */
    validateSpans() {
        let valid = Validation.testSpanValue(this.xSpan, 'x', 'Component');
        valid = Validation.testSpanValue(this.ySpan, 'y', 'Component') ? valid : false;

        return valid;
    }

    /**
     * Validate the ports field.
     *
     * Calls the Port validation function on each port in the array. The ports
     * array cannot have a length of zero.
     *
     * @since 1.0.0
     *
     * @returns {boolean}
     */
    validatePorts() {
        let valid = true;

        if (this.ports.length === 0) {
            console.log('Component: Field "ports" contains no Port objects.');
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

            // Make sure the port exists on an edge
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
            // And make sure that the port's layer exists in the component's layer list
            if (this.layers && !this.layers.includes(this.ports[i].layer)) {
                valid = false;
                console.log('Component: Field "ports" contains a port with an invalid layer (' + this.ports[i].layer +
                        ') at index ' + i + '.');
            }
        }

        return valid;
    }

    validateFeatures() {
        let valid = true;

        if (this.features.length === 0) {
            console.log('Component (WARNING): Field "features" has a length of zero.');
        }

        this.features.forEach((value, index) => {
            if (!value.validate()) {
                valid = false;
                console.log('Component: Field "features" contains an invalid Component Feature at index ' + index + '.');
            }
        });

        return valid;
    }

}

module.exports = Component;