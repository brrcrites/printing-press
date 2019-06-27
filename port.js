
class Port {
    /**
     * The label of the Port.
     *
     * @type {string}
     */
    label = 'unassigned';
    /**
     * The layer the Port is on.
     * @type {string}
     */
    layer = 'unassigned';
    /**
     * The position of the port relative to the top left corner of the
     * component.
     * @type {Coord}
     */
    pos = new Coord();

    /**
     * Initialize all values to default.
     *
     * @class
     *
     * @since 1.0.0
     */
    constructor() {}

    /**
     * @class
     *
     * @since 1.0.0
     *
     * @param {string}  label   The Port's label.
     * @param {string}  layer   The layer the Port is on.
     * @param {Coord}   pos     The position of the port relative to the top
     *                          left corner of the component.
     */
    constructor(label, layer, pos) {
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