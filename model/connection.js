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
     * The id of the abstract connection this connection is segment of.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {string}
     */
    connection;

    /**
     * The width of the channel tangentially to its direction of travel.
     *
     * For validation purposes this is a dimension.
     *
     * @see Validation.testDimensionValue
     *
     * @since 1.0.0
     * @access public
     *
     * @type {number}
     */
    width;


    /**
     * The channel depth.
     *
     * For validation purposes this is a dimension.
     *
     * @see Validation.testDimensionValue
     *
     * @since 1.0.0
     * @access public
     *
     * @type {number}
     */
    depth;

    /**
     * The starting point of this line segment.
     *
     * Represented as a Coord object.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {object}
     */
    sourcePoint;

    /**
     * The ending point of this line segment.
     *
     * Represented as a Coord object.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {object}
     */
    sinkPoint;

    /**
     * The type of connection.
     *
     * Currently always set to "channel". Treat this as a constant and do not
     * change it.
     *
     * @since 1.0.0
     * @acess public
     *
     * @type {string}
     */
    type;


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
        this.connection = Validation.DEFAULT_STR_VALUE;
        this.width = Validation.DEFAULT_DIM_VALUE;
        this.depth = Validation.DEFAULT_DIM_VALUE;
        this.sourcePoint = null;
        this.sinkPoint = null;
        this.type = Validation.DEFAULT_CON_TYPE;
    }

    /**
     * Initialize all the fields of a Connection Feature.
     *
     * @since 1.0.0
     *
     * @param {string}  name        The name of the connection feature.
     * @param {string}  id          The unique id of this connection feature
     *                              segment.
     * @param {string}  connection  The id of the connection this connection
     *                              is a segment of.
     * @param {string}  layer       The layer on which this connection feature
     *                              exists.
     * @param {number}  width       The width of the channel tangentially to
     *                              its direction of travel.
     * @param {number}  depth       The depth of the channel.
     * @param {object}  sourcePoint The source point of this connection
     *                              feature.
     * @param {object}  sinkPoint   The sink point of this connection feature.
     */
    initFeature(name, id, connection, layer, width, depth, sourcePoint, sinkPoint) {
        this.name = name;
        this.id = id;
        this.connection = connection;
        this.layer = layer;
        this.width = width;
        this.depth = depth;
        this.sourcePoint = sourcePoint;
        this.sinkPoint = sinkPoint;
    }

    /**
     * Initialize the fields that are exclusive to a Connection Feature.
     *
     * This is meant to ease the parsing and object generation.
     *
     * @since 1.0.0
     *
     * @param {string}  connection  The id of the connection this connection
     *                              is a segment of.
     * @param {number}  width       The width of the channel tangentially to
     *                              its direction of travel.
     * @param {number}  depth       The depth of the channel.
     * @param {object}  sourcePoint The source point of this connection
     *                              feature.
     * @param {object}  sinkPoint   The sink point of this connection feature.
     */
    initFeatureExclusives(connection, width, depth, sourcePoint, sinkPoint) {
        this.connection = connection;
        this.sourcePoint = sourcePoint;
        this.width = width;
        this.depth = depth;
        this.sinkPoint = sinkPoint;
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
        valid = Validation.testStringValue(this.connection, 'connection', 'Connection') ? valid : false;
        valid = Validation.testStringValue(this.layer, 'layer', 'Connection') ? valid : false;
        valid = Validation.testDimensionValue(this.width, 'width', 'Connection') ? valid : false;
        valid = Validation.testDimensionValue(this.depth, 'depth', 'Connection') ? valid : false;
        valid = this.validateSinkSourcePoints() ? valid : false;
        if (this.type !== Validation.DEFAULT_CON_TYPE) {
            valid = false;
            console.log('Connection: Field "type" is invalid. It must be "' + Validation.DEFAULT_CON_TYPE + '", but' +
                    ' it is "' + this.type + '".');
        }

        return valid;
    }

    /**
     * Validate the sinkPoint and sourcePoint objects.
     *
     * The line between sinkPoint and sourcePoint must be straight and cannot
     * have the same x and y values. Both must not evaluate to falsey and be
     * valid Coord objects.
     *
     * @since 1.0.0
     *
     * @see validateEndpoint
     *
     * @returns {boolean}
     */
    validateSinkSourcePoints() {
        let valid = true;

        if (!this.sourcePoint || !this.sourcePoint.validate()) {
            console.log('Connection: Fields "sourcePoint" is invalid.');
            return false;
        }

        if (!this.sinkPoint || !this.sinkPoint.validate()) {
            console.log('Connection: Fields "sinkPoint" is invalid.');
            return false;
        }

        // Check that this connection is a straight line
        if ((this.sinkPoint.x !== this.sourcePoint.x) && (this.sinkPoint.y !== this.sourcePoint.y)) {
            valid = false;
            console.log('Connection: Fields "sinkPoint" and "sourcePoint" are invalid. They must be a straight line.');
        }

        // Check that this connection is not a single point
        if (this.sourcePoint.is(this.sinkPoint)) {
            valid = false;
            console.log('Connection: Fields "sinkPoint" and "sourcePoint" are invalid. They cannot have the same x/y' +
                    ' values.');
        }

        return valid;
    }
}

module.exports = Connection;