const ParchKey = require('./parch-key.js');
const Validation = require('../utils/validation.js');
const TestResult = require('../utils/test-result.js');

class Connection {
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
    constructor(name = ParchKey.DEFAULT_STR_VALUE, id = ParchKey.DEFAULT_STR_VALUE, layer = ParchKey.DEFAULT_STR_VALUE,
                source = null, sinks = []) {

        this.name = name;
        this.id = id;
        this.layer = layer;
        this.source = source;
        this.sinks = sinks;
    }


    validate() {
        let valid = true;

        if (Validation.testStringValue(this.name, 'name', 'Connection') !== TestResult.VALID ||
                Validation.testStringValue(this.id, 'id', 'Connection') !== TestResult.VALID ||
                Validation.testStringValue(this.layer, 'layer', 'Connection') !== TestResult.VALID) {
            valid = false;
        }

        valid = this.validateSource() ? valid : false;
        valid = this.validateSinks() ? valid : false;

        return valid;
    }

    validateSource() {
        if (this.source === null) {
            console.log('Connection: Field "source" is set to the default value.');
            return false;
        }

        // Make sure the source is not default value before validating it
        if (!this.source.validate()) {
            return false;
            console.log('Connection: Field "source" is invalid.');
        }

        return true;
    }

    validateSinks() {
        if (this.sinks.length === 0) {
            console.log('Connection: Field "sinks" is set to the default value.');
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

}

module.exports = Connection;