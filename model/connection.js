const ParchKey = require('./parch-key.js');
const Validation = require('../utils/validation.js');

class Connection extends ParchKey {

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
     * The Connection Segments that make up this Connection.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {Array}
     */
    segments;

    /**
     * Construct the Connection object.
     *
     * @class
     *
     * @since 1.0.0
     *
     * @param {string}  name        The name of the Connection.
     * @param {string}  id          The unique id of the Connection.
     * @param {object}  source      A Terminal object representing the source of
     *                              the Connection.
     * @param {object}  sinks       An array of Terminal objects representing
     *                              the sinks of the Connection.
     * @param {object}  segments    An array of Connection Segments that make up
     *                              this Connection.
     */
    constructor(name = Validation.DEFAULT_STR_VALUE, id = Validation.DEFAULT_STR_VALUE, source = null, sinks = [],
                segments = []) {
        super(name, id);
        this.source = source;
        this.sinks = sinks;
        this.segments = segments;
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
        valid = this.validateSource() ? valid : false;
        valid = this.validateSinks() ? valid : false;
        valid = this.validateSegments() ? valid : false;

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
     * Validate the array of ConnectionSegment objects.
     *
     * Each ConnectionSegment object in the array must be valid.
     *
     * @since 1.0.0
     *
     * @returns {boolean}
     */
    validateSegments() {
        let valid = true;

        if (this.segments.length === 0) {
            console.log('Connection (' + this.name + ') (WARNING): Field "segments" has a length of zero.');
        }

        this.segments.forEach((value, index) => {
            if (!value.validate()) {
                valid = false;
                console.log('Connection: Field "segments" contains an invalid ConnectionSegment object' + ' at index ' +
                        + index + '.');
            }
        });

        return valid;
    }

    /**
     * Draw this Connection on the PaperScope's project.
     *
     * @param {PaperScope}  paperScope  The PaperScope to contain this
     *                                  connection.
     */
    print(paperScope) {
        if (this.segments) {
            this.segments.forEach(value => {
                value.print(paperScope);
            });
        }
    }
}

module.exports = Connection;