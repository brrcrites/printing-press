const Coord = require('./coord.js');
const TestResult = require('../utils/test-result.js');
const Validation = require('../utils/validation.js');

class Port {

    /**
     * The label of the Port.
     *
     * @since   1.0.0
     * @access  public
     *
     * @type    {string}
     */
    label;
    /**
     * The layer the Port is on.
     *
     * @since   1.0.0
     * @access  public
     *
     * @type    {string}
     */
    layer;
    /**
     * The position of the port relative to the top left corner of the
     * component.
     *
     * @since   1.0.0
     * @access  public
     *
     * @type    {Coord}
     */
    pos;


    /**
     * Constructs the Port object.
     *
     * All parameters are optional and will default to their respective values.
     * @class
     *
     * @since 1.0.0
     *
     * @param {string}  label   The Port's label.
     * @param {string}  layer   The layer the Port is on.
     * @param {Coord}   pos     The position of the port relative to the top
     *                          left corner of the component.
     */
    constructor(label = Validation.DEFAULT_STR_VALUE, layer = Validation.DEFAULT_STR_VALUE, pos = new Coord()) {
        this.label = label;
        this.layer = layer;
        this.pos = pos;
    }

    /**
     * Validate the port values.
     *
     * Label and layer cannot be empty. Calls pos.validate.
     *
     * @since 1.0.0
     *
     * @see Coord.validate
     */
    validate() {
        if (Validation.testStringValue(this.label, 'label', 'Port') !== TestResult.VALID ||
                Validation.testStringValue(this.layer, 'layer', 'Port') !== TestResult.VALID) {
            return false;
        }

        if (!this.pos.validate()) {
            console.log('Port: Field "pos" is invalid.');
            return false;
        }

        return true;
    }
}

module.exports = Port;