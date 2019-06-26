const ParchKey = require('./parch-key.js');

class Layer extends ParchKey {

    constructor(name, id) {
        super(name, id);
    }

    /**
     * Validate the name and id of the layer. These values can be any string as long as it is not empty.  Layer id
     * uniqueness is validated in the Architecture class.
     * @returns {boolean} true.
     */
    validate() {
        return super.validate();
    }
}

module.exports = Layer;