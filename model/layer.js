const ParchKey = require('./parch-key.js');
const Validation = require('../utils/validation.js');

class Layer extends ParchKey {

    /**
     * @class
     *
     * @since 1.0.0
     * @augments ParchKey
     *
     * @param {string}  name    The layer name.
     * @param {string}  id      The layer id.
     */
    constructor(name = Validation.DEFAULT_STR_VALUE, id = Validation.DEFAULT_STR_VALUE) {
        super(name, id);
    }

    /**
     * Validate the name and id of the layer.
     *
     * These values can be any string as long as it is not empty.  Layer id
     * uniqueness is validated in the Architecture class.
     *
     * @since 1.0.0
     *
     * @see ParchKey.validate
     *
     * @returns {boolean} true if both name and id are valid, false otherwise.
     */
    validate() {
        return super.validate();
    }
}

module.exports = Layer;