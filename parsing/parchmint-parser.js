const Validation = require('../utils/validation.js');
const Layer = require('../model/layer.js');
const Component = require('../model/component.js');
const Connection = require('../model/connection.js');
const ComponentFeature = require('../model/component-feature.js');
const ConnectionSegment = require('../model/connection-segment.js');
const Coord = require('../model/coord.js');
const Port = require('../model/port.js');
const Terminal = require('../model/terminal.js');


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
     * A set of all the IDs that exist in the Parchmint file.
     *
     * Used to validate ID uniqueness.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {Set<string>}
     */
    idSet;

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
     * A map containing all of the Components that have been parsed.
     *
     * The key is the ID of a Layer, and the value is an array of Components
     * that exist on that layer.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {Map<string, Array>}
     */
    components;

    /**
     * A map containing all of the Connections that have been parsed.
     *
     * The key is the ID of a Layer, and the value is an array of Connections
     * that exist on that layer.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {Map<string, Array>}
     */
    connections;

    /**
     * A map containing all of the component features that have been parsed.
     *
     * The key is a combination of the IDs of the Component and the Layer it
     * exists on in the form [component-id]_[layer-id]. The value is the
     * Component Feature of that Component.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {Map<string, ComponentFeature>}
     */
    compFeatures;

    /**
     * A map containing all of the Connection Segments that have been parsed.
     *
     * The key is the ID of a Connection, and the value is an array of
     * Connection Segment objects that correspond to that Connection.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {Map<string, Array>}
     */
    connFeatures;


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
        this.idSet = new Set();

        this.components = new Map();
        this.connections = new Map();
        this.compFeatures = new Map();
        this.connFeatures = new Map();
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
        parchKeyObj.name = jsonObj['name'];
        parchKeyObj.id = jsonObj['id'];
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
        for (let i = 0; i < jsonObj['layers'].length; i++) {
            let tempLayer = new Layer();
            this.initParchKey(tempLayer, jsonObj['layers'][i]);
            layers.push(tempLayer);
        }

        return layers;
    }

    /**
     * Parse a JSON object for the Components.
     *
     * Fills the components map with Components where the keys are Layer IDs,
     * and the values are arrays of Components that exist on that Layer. Sets
     * the parser invalid if a duplicate ID is found.
     * @since 1.0.0
     *
     * @param {object}  jsonObj A parsed JSON object representing the Parchmint
     * file.
     */
    parseComponents(jsonObj) {
        jsonObj['components'].forEach((compValue, index) => {
            // First get the port list for this Component
            let ports = this.parsePorts(compValue['ports']);

            // Next check whether this ID of this Component is a duplicate
            if (this.idSet.has(compValue['id'])) {
                this.valid = false;
                console.log('Parser: Duplicate ID (' + compValue['id'] + ') found in "components" key. Skipping' +
                        ' Component with name ' + compValue['name'] + ' at index ' + index + '.');
            } else {
                this.idSet.add(compValue['id']);

                // Now compare the port map layers to the component's layers
                for (let layer of ports.keys()) {
                    if (compValue['layers'].indexOf(layer) === -1) {
                        console.log('Parser (WARNING): The Component with ID "' + compValue['id'] + '" and name "'
                                + compValue['name'] + '" contains a Port with a Layer ID (' + layer + ') that does' +
                                ' not exist in the Component\'s Layer list.');
                    }
                }

                // Finally add this component to each Layer it exists on with only the ports on that Layer
                compValue['layers'].forEach(layerValue => {
                    let tempComp = new Component(compValue['name'], compValue['id'], compValue['x-span'], compValue['y-span'],
                            compValue['entity']);
                    let tempPorts = ports.get(layerValue);
                    let tempFeat = this.compFeatures.get(compValue['id'] + '_' + layerValue);

                    // There might not be any ports on the layer, so only add it if we have one, otherwise leave it
                    // as the deafault value
                    if (tempPorts) {
                        tempComp.ports = tempPorts;
                        console.log('Parser (WARNING): The Component with ID "' + compValue['id'] + '" and name "'
                                + compValue['name'] + '" exists on a Layer  (' + layerValue + '), but has no Ports' +
                                ' on that layer.');
                    }

                    // Component Features are not required, so only add it if we have one, otherwise leave it as the
                    // default value
                    if (tempFeat) {
                        tempComp.feature = tempFeat;
                    }

                    if (this.components.has(layerValue)) {
                        this.components.get(layerValue).push(tempComp);
                    } else {
                        this.components.set(layerValue, [tempComp]);
                    }
                });
            }
        });
    }

    /**
     * Parse a JSON object for the Connections.
     *
     * Fills the connections map with Connections where the keys are Layer IDs,
     * and the values are arrays of Connections that exist on that Layer. Sets
     * the parser invalid if a duplicate ID is found.
     *
     * @since 1.0.0
     *
     * @param {object} jsonObj  A parsed JSON object representing the Parchmint
     *                          file.
     */
    parseConnections(jsonObj) {
        jsonObj['connections'].forEach((connValue, index) => {
            if (!this.isUniqueID(connValue['id'])) {
                this.valid = false;
                console.log('Parser: Duplicate ID (' + connValue['id'] + ') found in "connections" key. Skipping' +
                        ' Connection with name ' + connValue['name'] + ' at index ' + index + '.');
            } else {
                let tempConn = new Connection(connValue['name'], connValue['id'],
                        this.parseTerminal(connValue['source'], connValue['layer']),
                        this.parseTerminals(connValue['sinks'], connValue['layer']));
                let tempFeat = this.connFeatures.get(connValue['layer']);

                // Connection Features are not required, so we only add them to the Connection if we parsed some,
                // otherwise we'll leave it null.
                if (tempFeat) {
                    tempConn.segments = tempFeat;
                }

                if (this.connections.has(connValue['layer'])) {
                    this.connections.get(connValue['layer']).push(tempConn);
                } else {
                    this.connections.set(connValue['layer'], [tempConn]);
                }
            }
        });
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
        jsonObj['features'].forEach((value, index) => {
            // Check whether this is a Component feature
            if (!value['type']) {
                let key = value['id'] + '_' + value['layer'];
                if (this.compFeatures.has(key)) {
                    this.valid = false;
                    console.log('Parser: Duplicate IDs (' + value['id'] + ') exist on the same Layer (' + value['layer']
                           + ') for the Component Features list. Skipping Component Feature with name "' + value['name']
                           + '" at index ' + index + '.');
                } else {
                    this.compFeatures.set(key, new ComponentFeature(value['name'], value['layer'], value['x-span'],
                           value['y-span'], ParchmintParser.parseCoord(value['location']), value['depth']));
                }
            }
        });
    }

    /**
     * Parse a JSON object for the Connection Features.
     *
     * Fills the connFeatures map with Connection Features where the keys are
     * Connection IDs, and the values are Arrays of Connection Segment objects
     * that correspond to that Connection. Sets the parser invalid if duplicate
     * IDs are found.
     *
     * @since 1.0.0
     *
     * @see connFeatures
     *
     * @param {object}  jsonObj A parsed JSON object representing the Parchmint
     *                          file.
     */
    parseConnectionFeatures(jsonObj) {
        jsonObj['features'].forEach((value, index) => {
            // First check whether this is a Connection Feature
            if (value['type']) {
                // Next check that the ID of this segment is unique
                if (this.isUniqueID(value['id'])) {
                    // Finally add the Connection Feature to the map
                    let tempFeat = new ConnectionSegment(value['name'], value['id'], value['width'], value['depth'],
                            ParchmintParser.parseCoord(value['source']), ParchmintParser.parseCoord(value['sink']));
                    if (this.connFeatures.has(value['connection'])) {
                        this.connFeatures.get(value['connection']).push(tempFeat);
                    } else {
                        this.connFeatures.set(value['connection'], [tempFeat]);
                    }
                } else {
                    this.valid = false;
                    console.log('Parser: Duplicate IDs (' + value['id'] + ') exist for the Connection Features list.' +
                            ' Skipping Connection Feature with name "' + value['name'] + '" at index ' + index + '.');
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
        return new Coord(coordObj['x'], coordObj['y']);
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
            if (idSet.has(value['label'])) {
                this.valid = false;
                console.log('Parser: Duplicate labels (' + value['id'] + ') exist in the Port list.')
            } else {
                idSet.add(value['label']);
            }

            // Parse port
            if (!portMap.has(value['layer'])) {
                portMap.set(value['layer'], [ParchmintParser.parsePort(value)]);
            } else {
                portMap.get(value['layer']).push(ParchmintParser.parsePort(value));
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

    /**
     * Parse a Terminal object from the given JSON object.
     *
     * The component is only searched for on the given layer, so as to get the
     * correct Port object. If no component exists on the given layer, the
     * parser is set invalid.
     *
     * @since 1.0.0
     *
     * @param {object}  termObj A JSON object with fields "component" and
     *                          "port".
     * @param {string}  layer   The ID of the Layer on which to search for the
     *                          Component.
     * @returns {Terminal}  A Terminal object with the Component and Port if
     *                      they could both be found, a Terminal object with
     *                      only a Component if only the Component was found,
     *                      or a default Terminal object otherwise.
     */
    parseTerminal(termObj, layer) {
        let comp = null;

        // First let's see if the given layer is valid
        if (!this.components.has(layer)) {
            this.valid = false;
            return new Terminal();
        }

        // Next let's find the Component we need
        this.components.get(layer).forEach(value => {
            if (value.id === termObj['component']) {
                comp = value;
            }
        });

        if (comp) {
            // If we found a component lets get the Port we need from it
            for (let value of comp.ports) {
                if (value.label === termObj['port']) {
                    return new Terminal(comp, value);
                }
            }
        } else {
            // We didn't find a component which means the Parchmint is invalid
            this.valid = false;
            console.log('Parser: Unable to find Component with ID "' + termObj['component'] + '" on Layer with ID "' +
                    layer + '". Parsing will continue, using a default Terminal object.');
            return new Terminal();
        }

        // We didn't find the a Port so the Parchmint is invalid, but at the very least we can put the Component in.
        this.valid = false;
        console.log('Parser: Unable to find Port with label "' + termObj['port'] + '" on Component with ID "' +
                termObj['component'] + '". Parsing will continue using a Terminal object with a null Port.');
        return new Terminal(comp);
    }

    /**
     * Parse an array of Terminal objects.
     *
     * @since 1.0.0
     *
     * @see parseTerminal
     *
     * @param {Array}   termArr An array of JSON objects with the fields
     *                          "component" and "port".
     * @param {string}  layer   The ID of the Layer on which to search for the
     *                          Component;
     * @returns {Array} An array of Terminal objects as parsed by the
     *                  parseTerminal method.
     */
    parseTerminals(termArr, layer) {
        let terms = [];

        termArr.forEach(value => {
            terms.push(this.parseTerminal(value, layer));
        });

        return terms;
    }

    /**
     * Determine whether the given ID is unique.
     *
     * If the ID is unique it is added to the ID set.
     *
     * @since 1.0.0
     *
     * @see idSet
     * @param {string}  id  The ID to verify.
     * @returns {boolean}   true if the ID is unique, false otherwise.
     */
    isUniqueID(id) {
        if (this.idSet.has(id)) {
            return false;
        }

        this.idSet.add(id);
        return true;
    }
}

module.exports = ParchmintParser;