const ParchKey = require('../model/parch-key.js');
const TestResult = require('../utils/test-result.js');

/**
 * A class that contains data for sources and sinks on connections.
 *
 * @since 1.0.0
 */
class Terminal {
    /**
     * The component ID of the component to which this terminal connects.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {string}
     */
    compID;

    /**
     * The port to which this terminal ID connects on the component.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {object}
     */
    port;

    /**
     * @class
     * @since 1.0.0
     *
     * @param {string}  compID  The component ID of the component to which this terminal connects.
     * @param {object}  port    The port to which this terminal connects on the component.
     */
    constructor(compID = ParchKey.DEFAULT_STR_VALUE, port = null) {
        this.compID = compID;
        this.port = port;
    }


    /**
     * Validate the Terminal object.
     * 
     * The component ID must not be empty or the default value.
     *
     * @since 1.0.0
     *
     * @returns {boolean}
     */
    validate() {
        if (ParchKey.testStringValue(this.compID, 'compID', 'Terminal') !== TestResult.VALID) {
            return false;
        }
        
        return true;
    }
}

module.exports = Terminal;