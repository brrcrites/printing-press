const Coord = require('./coord.js');

class Port {
    /**
     * The default label and layer value for port.
     *
     * This field is to be treated as a constant and remain unchanged.
     *
     * @since   1.0.0
     * @access  public
     *
     * @type    {string}
     */
    DEFAULT_STR_VALUE = 'unassigned';

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
    constructor(label = this.DEFAULT_STR_VALUE, layer = this.DEFAULT_STR_VALUE, pos = new Coord()) {
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
        let p = new Port();

        if (this.label === p.label) {
            console.log('Port: Field "label is set to the default value');
            return false;
        }
        if (this.layer === p.layer) {
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
}

module.exports = Port;