
class Port {
    label = 'unassigned';
    layer = 'unassigned';
    pos;

    /**
     * @param label A string representation of the Port's label.
     * @param layer A string representation of which layer the Port is on.
     * @param pos A Coord representing the position of the port relative to the top left corner of the component.
     */
    constructor(label, layer, pos) {
        this.label = label;
        this.layer = layer;
        this.pos = pos;
    }

    /**
     * Validate the port values. Label and layer cannot be empty. See Coord's requirements in coord.js.
     */
    validate() {
        if (this.label === '') {
            console.log('Port: Field "label" cannot be empty.');
            return false;
        }
        if (this.layer === '') {
            console.log('Port: Field "layer" cannot be empty.');
            return false;
        }
        if (!this.pos.validate()) {
            console.log("Port: Coord pos cannot have negative values.");
            return false;
        }

        return true;
    }
}

module.exports = Port;