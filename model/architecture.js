const Layer = require('./layer.js');
const Validation = require('../utils/validation.js');

class Architecture {

    /**
     * The human readable name of this Architecture.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {string}
     */
    name;

    /**
     * The Layers that exist on this Architecture.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {object}
     */
    layers;

    /**
     * The size of this Architecture in the x-direction.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {number}
     */
    xSpan;

    /**
     * The size of this Architecture in the y-direction.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {number}
     */
    ySpan;


    /**
     * Constructs the Architecture object.
     *
     * Determines whether the Architecture has parameters.
     *
     * @since 1.0.0
     * @class
     *
     * @param {string}  name    A human readable name for this Architecture.
     * @param {Array}   layers  The Layers that exist on this Architecture.
     * @param {number}  xSpan   The size of this Architecture in the x-
     *                          direction.
     * @param {number}  ySpan   The size of this Architecture in the y-
     *                          direction.
     */
    constructor(name = Validation.DEFAULT_STR_VALUE, layers = [], xSpan = Validation.DEFAULT_SPAN_VALUE,
                ySpan = Validation.DEFAULT_SPAN_VALUE) {
        this.name = name;
        this.layers = layers;
        this.setParams(xSpan, ySpan);
        this.hasParams = false;
    }

    /**
     * Set the x- and y-span for this Architecture.
     *
     * @since 1.0.0
     *
     * @param {number}  xSpan   The size of this Architecture in the x-
     *                          direction.
     * @param {number}  ySpan   The size of this Architecture in the y-
     *                          direction.
     */
    setParams(xSpan, ySpan) {
        this.xSpan = xSpan;
        this.ySpan = ySpan;
    }

    /**
     * Determine whether this Architecture uses params.
     *
     * Sets the {@link hasParams} to true if both xSpan and ySpan are valid,
     * false otherwise.
     *
     * @since 1.0.0
     * @see Validation.testSpanValue
     *
     * @returns {boolean}   The resulting value of hasParams.
     */
    determineParams() {
        return Validation.testSpanValue(this.xSpan, 'x', 'Architecture (WARNING):') &&
                Validation.testSpanValue(this.ySpan, 'y', 'Architecture (WARNING):');
    }

    /**
     * Validate the Architecture.
     *
     * Validates each Layer, Component, Connection, etc. all the way down.
     *
     * @since 1.0.0
     *
     * @returns {boolean}
     */
    validate() {
        let valid = Validation.testStringValue(this.name, 'name', 'Architecture');
        let hasParams = this.determineParams();

        if (this.layers.length === 0) {
            valid = false;
            console.log('Architecture: Field "layers" cannot have a length of zero.');
        }

        this.layers.forEach((layerValue, layerIndex) => {
            if (!layerValue.validate()) {
                valid = false;
                console.log('Architecture: Field "layers" contains an invalid Layer:\n\tID: ' + layerValue.id + '\n\tIndex: '
                        + layerIndex);
            }

            if (hasParams) {
                layerValue.components.forEach((compValue, compIndex) => {
                    // Check that we have a feature, if we do then compare its location to the given params
                    if (compValue.feature && !this.validateLocation(compValue.feature.location, compValue.xSpan, compValue.ySpan)) {
                        valid = false;
                        console.log('Architecture: Field "layers" contains a Component (ID: ' + compValue.id + ',' +
                                'index: ' + compIndex + ') whose feature exists outside of the params.');
                    }
                });

                layerValue.connections.forEach((connValue, connIndex) => {
                    connValue.segments.forEach((segValue, segIndex) => {
                        if (!this.validateLocation(segValue.sourcePoint)) {
                            valid = false;
                            console.log('Architecture: Field "layers" contains a Connection (ID: ' + connValue.id +
                                    ', index: ' + connIndex + ') whose sourcePoint (index: ' + segIndex + ') exists ' +
                                    'outside of the params.');
                        }
                        if (!this.validateLocation(segValue.sinkPoint)) {
                            valid = false;
                            console.log('Architecture: Field "layers" contains a Connection (ID: ' + connValue.id +
                                    ', index: ' + connIndex + ') whose sinkPoint (index: ' + segIndex + ') exists ' +
                                    'outside of the params.');
                        }
                    });
                });
            }
        });

        return valid;
    }

    /**
     * Validate that the span does not exceed this Architecture's params.
     *
     * @since 1.0.0
     *
     * @param {object}  location    A Coord object representing the location of
     *                              the the span to check.
     * @param {number}  xSpan       The xSpan to check.
     * @param {number}  ySpan       The ySpan to check.
     * @returns {boolean}   true if the location plus the spans is less than
     *                      both params, false otherwise.
     */
    validateLocation(location, xSpan = 0, ySpan = 0) {
        if (location.x + xSpan > this.xSpan || location.y + ySpan > this.ySpan) {
            return false;
        }

        return true;
    }
}

module.exports = Architecture;