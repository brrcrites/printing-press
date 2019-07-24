const Validation = require('../utils/validation.js');
const Layer = require('../model/layer.js');
const ComponentFeature = require('../model/component-feature.js');
const Coord = require('../model/coord.js');
const Port = require('../model/port.js');


class ParchmintParser {

    /**
     * Whether the Parchmint was valid.
     *
     * Starts as true when the ParchmintParser is instantiated and will be set
     * to false if any invalid data is encountered so as not to halt the parsing
     * process.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {boolean}
     */
    valid;

    /**
     * The ParchMint file text.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {string}
     */
    parchmint;

    /**
     * A map containing all of the component features that have been parsed.
     *
     * The key is the ID of the Component, the value is the Component Feature
     * of that Component.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {Map}
     */
    compFeatures;

    
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

        this.valid = true;
        this.compFeatures = new Map();
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

    /**
     * Parse a JSON object for the Component Features map.
     *
     * Fills the compFeatures map with Component Features with Component IDs as
     * keys. Sets the parser invalid if two Component Features exist with the
     * same Component ID.
     *
     * @since 1.0.0
     *
     * @param {object}  jsonObj A parsed JSON object representing the Parchmint
     *                          file.
     */
    parseComponentFeatures(jsonObj) {
        jsonObj.features.forEach((value, index) => {
            // Check whether this is a Component feature
            if (value['x-span'] || value['y-span']) {
               if (this.compFeatures.has(value.id)) {
                   this.valid = false;
                   console.log('Parser: Duplicate IDs (' + value.id + ') exist for the Component Features list.' +
                           ' Skipping Component Feature with name "' + value.name + '" at index ' + index + '.');
               } else {
                   this.compFeatures.set(value.id, new ComponentFeature(value.name, value.layer, value['x-span'],
                           value['y-span'], ParchmintParser.parseCoord(value.location), value.depth));
               }
            }
        });
    }

    /**
     * Parse a Coord object from the given JSON object.
     *
     * @since 1.0.0
     *
     * @param {object}  coordObj    A JSON object with field x and y.
     * @returns {Coord} The resulting Coord object.
     */
    static parseCoord(coordObj) {
        return new Coord(coordObj.x, coordObj.y);
    }

    /**
     * Parse Ports from the given JSON array.
     *
     * Checks uniqueness of labels within the given port array and sets the
     * parser invalid if they are not.
     *
     * @since 1.0.0
     *
     * @see parsePort
     *
     * @param {Array}  portsArr    A JSON array with Port fields.
     * @returns {Map<string, Array>} A map containing all ports that have been
     * parsed. The key is the ID of the layer on which the Port exists. The
     * value is an Array of Port objects that exist on that layer.
     */
    parsePorts(portsArr) {
        let portMap = new Map();
        let idSet = new Set();

        portsArr.forEach(value => {
            // Check label uniqueness
            if (idSet.has(value.label)) {
                this.valid = false;
                console.log('Parser: Duplicate labels (' + value.id + ') exist in the Port list.')
            } else {
                idSet.add(value.label);
            }

            // Parse port
            if (!portMap.has(value.layer)) {
                portMap.set(value.layer, [ParchmintParser.parsePort(value)]);
            } else {
                portMap.get(value.layer).push(ParchmintParser.parsePort(value));
            }
        });

        return portMap;
    }

    /**
     * Parse a single Port object from the given JSON object.
     *
     * @since 1.0.0
     *
     * @param {object}  portObj A JSON object with fields layer, label, x, and y.
     * @returns {Port}  The resulting Port object.
     */
    static parsePort(portObj) {
        return new Port(portObj.label, this.parseCoord(portObj));
    }

}

module.exports = ParchmintParser;