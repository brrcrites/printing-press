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
     * The abstract Component object that this Component Feature represents.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {object}
     */
    component;

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
        this.component = null;
    }

    /**
     * Initialize all the fields of a Connection Feature.
     *
     * @since 1.0.0
     *
     * @param {object}  component   The abstract Component that this Component
     *                              Feature represents.
     * @param {string}  layer       The layer on which this component exists.
     * @param {object}  location    The location of the Component Feature on the
     * @param {number}  xSpan       How much space this component takes up in
     *                              the x direction.
     * @param {number}  ySpan       How much space this component takes up in
     *                              the y direction.
     * @param {number}  depth       How deep the component should be.
     */
    initFeature(component, layer, location, xSpan, ySpan, depth) {
        this.component = component;
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
     * @param {object}  component   The abstract component that this Component
     *                              Feature represents.
     * @param {string}  layer       The layer on which this component exists.
     * @param {object}  location    The location of the Component Feature on
     *                              the Architecture.
     * @param {number}  depth       How deep the component should be.
     */
    initFeatureExclusives(component, layer, location, depth) {
        this.component = component;
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
        let valid = true;

        if (!this.component || !this.component.validate()) {
            valid = false;
            console.log('Component Feature: Field "component" is invalid.');
        }

        valid = this.validateFeatureLayer() ? valid : false;

        if (!this.location) {
            valid = false;
            console.log('Component Feature: Field "location" is invalid.');
        } else {
            valid = this.location.validate() ? valid : false;
        }

        valid = this.validateFeatureSpans() ? valid : false;
        valid = Validation.testWidthValue(this.depth, 'depth', 'Component Feature') ? valid : false;

        return valid;
    }

    /**
     * Validate the x/y-spans in the scope of a Component Feature.
     *
     * Both x- and y-spans must be valid. Both x- and y- spans must match the
     * abstract Component's spans.
     *
     * @since 1.0.0
     *
     * @see Validation.testSpanValue
     *
     * @returns {boolean}
     */
    validateFeatureSpans() {
        let valid = this.validateSpans();
        
        valid = Validation.testSpanValue(this.xSpan, 'x', 'Component Feature') ? valid : false;
        valid = Validation.testSpanValue(this.ySpan, 'y', 'Component Feature') ? valid : false;

        // Only compare spans if the component is referenced
        if (this.component) {
            if (this.xSpan !== this.component.xSpan) {
                valid = false;
                console.log('Component Feature: Field "xSpan" (' + this.xSpan + 'does not match the abstract' +
                        ' Component\'s xSpan (' + this.component.xSpan + '.');
            }
            if (this.ySpan !== this.component.ySpan) {
                valid = false;
                console.log('Component Feature: Field "ySpan" (' + this.ySpan + 'does not match the abstract' +
                        ' Component\'s ySpan (' + this.component.ySpan + '.');
            }
        }

        return valid;
    }

    /**
     * Validate the layer of a Component Feature.
     *
     * The layer must match one of the layers in the referenced abstract
     * Component's layer list. The abstract Component must not evaluate to
     * falsey.
     *
     * @since 1.0.0
     *
     * @returns {boolean}
     */
    validateFeatureLayer() {
        if (Validation.testStringValue(this.layer, 'layer', 'Component Feature')) {
            if (!this.component) {
                console.log('Component Feature: Field "component" is invalid.');
                return false;
            }
            // If the layer is a valid string, test whether it exists in the referenced abstract Component's layers
            // list.
            if (this.component.layers.indexOf(this.layer) === -1) {
                console.log('Component Feature: Field "layer" (' + this.layer + ') does not match any layer listed' +
                        ' in the abstract Component\'s layer list.');
                return false;
            }
        } else {
            return false;
        }

        return true;
    }

}

module.exports = Component;