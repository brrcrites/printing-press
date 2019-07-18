const Coord = require('./coord.js');
const Validation = require('../utils/validation.js');


class ComponentFeature {

    /**
     * The location at which the Component will be placed.
     *
     * The location represents the upper left corner of the bounding box of the
     * component.
     *
     * @since 1.0.0
     *
     * @type{object}
     */
    location;

    /**
     * How deep the component should be.
     *
     * @since 1.0.0
     *
     * @type {number}
     */
    depth;


    constructor(location = null, depth = Validation.DEFAULT_DIM_VALUE) {
        this.location = location;
        this.depth = depth;
    }

    /**
     * Validate the Component Feature.
     *
     * Location must not evaluate to falsey and be a valid Coord object. Depth
     * must be a valid dimension.
     *
     * @see Validation.testDepthValue
     *
     * @since 1.0.0
     *
     * @returns {boolean}
     */
    validate() {
        let valid = true;

        if (!this.location || !this.location.validate()) {
            valid = false;
            console.log('Component Feature: Field "location" is invalid.');
        }

        valid = Validation.testDepthValue(this.depth, 'depth', 'Component Feature') ? valid : false;

        return valid;
    }
}

module.exports = ComponentFeature;