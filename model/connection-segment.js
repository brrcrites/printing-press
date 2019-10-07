const ParchKey = require('./parch-key.js');
const Validation = require('../utils/validation.js');
const paper = require('paper');

class ConnectionSegment extends ParchKey {
    /**
     * The width of the ConnectionSegment tangentially to its direction of travel.
     *
     * For validation purposes this is a dimension.
     *
     * @see Validation.testWidthValue
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
     * @see Validation.testWidthValue
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
     * @access public
     *
     * @type {string}
     */
    connectionType;


    /**
     * Construct the ConnectionSegment object.
     *
     * @class
     *
     * @since 1.0.0
     *
     * @param {string}  name        A human readable name of this channel
     *                              segment.
     * @param {string}  id          A unique ID string.
     * @param {number}  width       The width of the channel tangentially to
     *                              its direction of travel.
     * @param {number}  depth       The depth of the channel.
     * @param {object}  sourcePoint The source point of this connection
     *                              feature.
     * @param {object}  sinkPoint   The sink point of this connection feature.
     */
    constructor(name = Validation.DEFAULT_STR_VALUE, id = Validation.DEFAULT_STR_VALUE,
                width = Validation.DEFAULT_DIM_VALUE, depth = Validation.DEFAULT_DIM_VALUE, sourcePoint = null,
                sinkPoint = null) {
        super(name, id);

        this.width = width;
        this.depth = depth;
        this.sourcePoint = sourcePoint;
        this.sinkPoint = sinkPoint;
        this.connectionType = Validation.DEFAULT_CON_TYPE;
    }

    /**
     * Validate the Connection Segment.
     *
     * Both depth and width must be valid dimensions. SourcePoint and sinkPoint
     * follow the rules from their validation function.
     *
     * @since 1.0.0
     *
     * @see validateSinkSourcePoints
     *
     * @returns {boolean}
     */
    validate() {
        let valid = super.validate();
        valid = Validation.testWidthValue(this.width, 'width', 'Connection') ? valid : false;
        valid = Validation.testDepthValue(this.depth, 'depth', 'Connection') ? valid : false;
        valid = this.validateSinkSourcePoints() ? valid : false;

        if (this.connectionType !== Validation.DEFAULT_CON_TYPE) {
            valid = false;
            console.log('Connection Feature: Field "connectionType" is invalid. It must be "'
                    + Validation.DEFAULT_CON_TYPE + '", but it is "' + this.connectionType + '".');
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

        // Check that this connection is not a single point
        if (this.sourcePoint.is(this.sinkPoint)) {
            valid = false;
            console.log('Connection: Fields "sinkPoint" and "sourcePoint" are invalid. They cannot have the same x/y' +
                    ' values.');
        }

        return valid;
    }

    /**
     * Draw the Connection Segment on the specified PaperScope's project.
     *
     * @param {PaperScope}  paperScope  The PaperScope object on which to draw
     *                                  the Connection Segment.
     * @returns {paper.Path.Line}   The channel segment that was just drawn
     *                              represented by a Path object.
     */
    print(paperScope) {
        let segment = new paperScope.Path.Line(new paper.Point(this.sourcePoint.x, this.sourcePoint.y),
                new paper.Point(this.sinkPoint.x, this.sinkPoint.y));
        segment.strokeColor = 'black';
        segment.strokeWidth = this.width;
        segment.name = this.name;

        return segment;
    }

}

module.exports = ConnectionSegment;