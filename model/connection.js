const ParchKey = require('./parch-key.js');
const Validation = require('../utils/validation.js');

class Connection extends ParchKey {
    /**
     * The layer on which the connection exists.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {string}
     */
    layer;

    /**
     * The source of the the connection.
     *
     * Represented by a Terminal object.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {object}
     */
    source;

    /**
     * The sinks of the connection.
     *
     * Represented by an array of Terminal objects.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {object}
     */
    sinks;


    /**
     * The abstract Connection this Connection Feature represents.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {object}
     */
    connection;

    /**
     * The Connection Segments that make up a Connection Feature
     *
     * @since 1.0.0
     * @access public
     *
     * @type {Array}
     */
    connSegments;

    /**
     * Construct the Connection object.
     *
     * @class
     *
     * @since 1.0.0
     *
     * @param {string}  name    The name of the connection.
     * @param {string}  id      The unique id of the connection.
     * @param {string}  layer   The layer on which the connection exists.
     * @param {object}  source  A Terminal object representing the source of
     *                          the connection.
     * @param {object}  sinks   An array of Terminal objects representing the
     *                          sinks of the connection.
     */
    constructor(name = Validation.DEFAULT_STR_VALUE, id = Validation.DEFAULT_STR_VALUE, layer = Validation.DEFAULT_STR_VALUE,
                source = null, sinks = []) {
        super(name, id);
        this.layer = layer;
        this.source = source;
        this.sinks = sinks;

        // Connection Feature fields
        this.connection = null;
        this.connSegments = [];
    }

    /**
     * Initialize all the fields of a Connection Feature.
     *
     * @since 1.0.0
     *
     * @param {string}  name            The name of the Connection Feature.
     * @param {string}  id              The unique id of this Connection Feature
     *                                  segment.
     * @param {object}  connection      The abstract Connection this Connection
     *                                  Feature represents.
     * @param {string}  layer           The layer on which this Connection
     *                                  Feature exists.
     * @param {Array}   connSegments    An array of Connection Segment objects
     *                                  that make up this Connection Feature.
     */
    initFeature(name, id, connection, layer, connSegments) {
        this.name = name;
        this.id = id;
        this.connection = connection;
        this.layer = layer;
        this.connSegments = connSegments;
    }

    /**
     * Initialize the fields that are exclusive to a Connection Feature.
     *
     * This is meant to ease the parsing and object generation.
     *
     * @since 1.0.0
     *
     * @param {object}  connection      The abstract Connection this Connection
     *                                  Feature represents.
     * @param {Array}   connSegments    An array of ConnectionSegment objects
     *                                  that make up this Connection Feature.
     */
    initFeatureExclusives(connection, connSegments) {
        this.connection = connection;
        this.connSegments = connSegments;
    }

    /**
     * Validate the connection object.
     *
     * Name, id, and layer follow {@link Validation.testStringValue}.
     *
     * @since 1.0.0
     *
     * @see validateSource
     * @see validateSinks
     *
     * @returns {boolean} true if this is a valid Connection, false otherwise.
     */
    validate() {
        let valid = super.validate();
        valid = Validation.testStringValue(this.layer, 'layer', 'Connection') ? valid : false;
        valid = this.validateSource() ? valid : false;
        valid = this.validateSinks() ? valid : false;

        return valid;
    }

    /**
     * Validate the source Terminal object.
     *
     * Source must not be falsey and a valid Terminal object.
     *
     * @since 1.0.0
     *
     * @see Terminal.validate
     *
     * @returns {boolean}
     */
    validateSource() {
        // Make sure the source is not default value before validating it
        if (!this.source || !this.source.validate()) {
            console.log('Connection: Field "source" is invalid.');
            return false;
        }

        return true;
    }

    /**
     * Validate the sinks Terminal array.
     *
     * Sinks must have a length greater than zero and each Terminal object in
     * the array must be valid.
     *
     * @since 1.0.0
     *
     * @see Terminal.validate
     *
     * @returns {boolean}
     */
    validateSinks() {
        if (this.sinks.length === 0) {
            console.log('Connection: Field "sinks" is invalid.');
            return false;
        }

        for (let i = 0; i < this.sinks.length; i++) {
            if (!this.sinks[i].validate()) {
                console.log('Connection: Field "sinks" contains an invalid Terminal object at index ' + i + '.');
                return false;
            }
        }

        return true;
    }

    /**
     * Validate the Connection Feature.
     *
     * Name, id, connection and layer follow Validation's string rules.
     * objects.
     *
     * @since 1.0.0
     *
     * @see validateSinkSourcePoints
     *
     * @returns {boolean}
     */
    validateFeature() {
        let valid = super.validate();

        if (!this.connection || !this.connection.validate()) {
            valid = false;
            console.log('Connection Feature: Field "connection" is invalid.');
        }

        valid = this.validateFeatureLayer() ? valid : false;
        valid = this.validateFeatureConnSegments() ? valid : false;

        return valid;
    }

    /**
     * Validate the Connection Feature's layer.
     *
     * The layer must be a valid string. The Connection Feature reference must
     * be valid. The layer must match the referenced Connection Feature's
     * layer.
     *
     * @since 1.0.0
     *
     * @returns {boolean}
     */
    validateFeatureLayer() {
        if (Validation.testStringValue(this.layer, 'layer', 'Connection Feature')) {
            if (!this.connection) {
                console.log('Connection Feature: Field "connection" is invalid.');
                return false;
            }

            if (this.connection.layer !== this.layer) {
                console.log('Connection Feature: Field "layer" (' + this.layer + 'does not match the layer in the' +
                        ' referenced abstract Connection (' + this.connection.layer + ').');
                return false;
            }
        } else {
            return false;
        }

        return true;
    }

    /**
     * Validate the array of ConnectionSegment objects.
     *
     * The length of the array must not be zero. Each ConnectionSegment object
     * in the array must be valid.
     *
     * @since 1.0.0
     *
     * @returns {boolean}
     */
    validateFeatureConnSegments() {
        let valid = true;

        if (this.connSegments.length === 0) {
            console.log('Connection Feature: Field "connSegments" cannot be an empty array.');
            return false;
        }

        this.connSegments.forEach((value, index) => {
            if (!value.validate()) {
                valid = false;
                console.log('Connection Feature: Field "connSegments" contains an invalid ConnectionSegment object' +
                        ' at index ' + index + '.');
            }
        });

        return valid;
    }
}

module.exports = Connection;