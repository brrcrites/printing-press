const Coord = require('./coord.js');

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
    constructor(label = Port.DEFAULT_STR_VALUE, layer = Port.DEFAULT_STR_VALUE, pos = new Coord()) {
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
        if (this.label == Port.DEFAULT_STR_VALUE) {
            console.log('Port: Field "label is set to the default value');
            return false;
        }
        if (this.layer == Port.DEFAULT_STR_VALUE) {
            console.log('Port: Field "layer" is set to the default value');
            return false;
        }
        if (this.label === '') {
            console.log('Port: Field "label" cannot be empty.');
            return false;
        }
        if (this.layer === '') {
            console.log('Port: Field "layer" cannot be empty.');
            return false;
        }
        if (!this.pos.validate()) {
            console.log('Port: Coord is invalid.');
            return false;
        }

        return true;
    }

    /**
     * The default value for label and layer.
     *
     * @returns {string}
     */
    static get DEFAULT_STR_VALUE() {
        return 'unassigned';
    }
}

module.exports = Port;