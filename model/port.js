const Coord = require('./coord.js');
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
     * @param {Coord}   pos     The position of the port relative to the top
     *                          left corner of the component.
     */
    constructor(label = Validation.DEFAULT_STR_VALUE, pos = new Coord()) {
        this.label = label;
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
        let valid = Validation.testStringValue(this.label, 'label', 'Port');

        if (!this.pos.validate()) {
            console.log('Port: Field "pos" is invalid.');
            valid = false;
        }

        return valid;
    }
}

module.exports = Port;