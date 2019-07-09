const Validation = require('../utils/validation.js');
const Layer = require('../model/layer.js');


class ParchmintParser {

    /**
     * The ParchMint file text.
     *
     * @type {string}
     */
    parchmint;

    /**
     * Construct the ParchmintParser object.
     *
     * @class
     *
     * @since 1.0.0
     *
     * @param {string} parchmint
     */
    constructor(parchmint = Validation.DEFAULT_STR_VALUE) {
        this.parchmint = parchmint;
    }

    /**
     * Initialize the name and id fields of a ParchKey object from a JSON
     * object.
     *
     * This method is intended for use on any subclass of ParchKey.
     *
     * @since 1.0.0
     *
     * @param {object}  parchKeyObj The ParchKey object to initialize.
     * @param {object}  jsonObj     The JSON object with which to initialize.
     */
    initParchKey(parchKeyObj, jsonObj) {
        parchKeyObj.name = jsonObj.name;
        parchKeyObj.id = jsonObj.id;
    }

    /**
     * Parse a JSON object for the layers key.
     *
     * @since 1.0.0
     *
     * @param {object} jsonObj  A parsed JSON object representing the Parchmint file.
     *
     * @returns {Array} An array of Layer object containing the data from the layers key in the Parchmint file.
     */
    parseLayersArray(jsonObj) {
        let layers = [];
        for (let i = 0; i < jsonObj.layers.length; i++) {
            let tempLayer = new Layer();
            this.initParchKey(tempLayer, jsonObj.layers[i]);
            layers.push(tempLayer);
        }

        return layers;
    }
}

module.exports = ParchmintParser;