const ParchKey = require('./parch-key.js');
const Validation = require('../utils/validation.js');

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
     * The layer on which the Feature Component exists.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {string}
     */
    layer;

    /**
     * The location of this component in the Architecture.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {object}
     */
    location;

    /**
     * How deep the component should be.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {number}
     */
    depth;

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
     * @param {string}  name    The name of the component.
     * @param {string}  id      The unique id of the component.
     * @param {Layer[]} layers  The Layers on which this component exists.
     * @param {number}  xSpan   How much space this component takes up in the x direction.
     * @param {number}  ySpan   How much space this component takes up in the y direction.
     * @param {string}  entity  The type of component this component object represents.
     * @param {Port[]}  ports   The ports on this component.
     */
    constructor(name = Validation.DEFAULT_STR_VALUE, id = Validation.DEFAULT_STR_VALUE, layers = [],
                xSpan = Validation.DEFAULT_SPAN_VALUE, ySpan = Validation.DEFAULT_SPAN_VALUE,
                entity = Validation.DEFAULT_STR_VALUE, ports = []) {

        super(name, id);
        this.layers = layers;
        this.xSpan = xSpan;
        this.ySpan = ySpan;
        this.entity = entity;
        this.ports = ports;

        // Component Feature Fields
        this.layer = Validation.DEFAULT_STR_VALUE;
        this.depth = Validation.DEFAULT_DIM_VALUE;
        this.location = null;
    }

    /**
     * Initialize all the fields of a Connection Feature.
     *
     * @since 1.0.0
     *
     * @param {string}  name    The name of the component.
     * @param {string}  id      The unique id of the component.
     * @param {string}  layer   The layer on which this component exists.
     * @param {number}  xSpan   How much space this component takes up in the x
     *                          direction.
     * @param {number}  ySpan   How much space this component takes up in the y
     *                          direction.
     * @param {number}  depth   How deep the component should be.
     */
    initFeature(name, id, layer, location, xSpan, ySpan, depth) {
        this.name = name;
        this.id = id;
        this.layer = layer;
        this.location = location;
        this.xSpan = xSpan;
        this.ySpan = ySpan;
        this.depth = depth;
    }

    /**
     * Initialize the fields exclusive to a Connection Feature.
     *
     * This excludes the name, id, and spans to ease parsing.
     *
     * @since 1.0.0
     *
     * @param {string}  layer   The layer on which this component exists.
     * @param {number}  depth   How deep the component should be.
     */
    initFeatureExclusives(layer, location, depth) {
        this.layer = layer;
        this.location = location;
        this.depth = depth;
    }

    validate() {
        let valid = super.validate();

        valid = this.validateLayers() ? valid : false;
        valid = this.validateSpans() ? valid : false;
        valid = Validation.testStringValue(this.entity, 'entity', 'Component') ? valid : false;
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

        if (this.layers === 0) {
            console.log('Component: Field "layers" is contains no Layers.');
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
     * Calls the Port validation function on each port in the array. The ports field cannot be null.
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

    /**
     * Validate the Component object as a Feature Component.
     *
     * All rules are listed in the Validation class. Depth is considered a dimension.
     *
     * @see Validation
     *
     * @since 1.0.0
     *
     * @return {boolean}
     */
    validateFeature() {
        let valid = super.validate();
        valid = Validation.testStringValue(this.layer, 'layer', 'Component') ? valid : false;
        if (!this.location) {
            valid = false;
            console.log('Component: Field "location" is invalid.');
        } else {
            valid = this.location.validate() ? valid : false;
        }
        valid = this.validateSpans() ? valid : false;
        valid = Validation.testDimensionValue(this.depth, 'depth', 'Component') ? valid : false;

        return valid;
    }

}

module.exports = Component;