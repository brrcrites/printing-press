const Architecture = require('../model/architecture.js');
const Layer = require('../model/layer.js');
const Component = require('../model/component.js');
const Connection = require('../model/connection.js');
const ComponentFeature = require('../model/component-feature.js');
const ConnectionSegment = require('../model/connection-segment.js');
const Coord = require('../model/coord.js');
const Port = require('../model/port.js');
const Terminal = require('../model/terminal.js');

const Config = require('../utils/config.js');
const Validation = require('../utils/validation.js');

const Ajv = require('ajv');
const schema = require('./schema.json');
var ajv = new Ajv({allErrors: true});

class ParchmintParser {

    /**
     * The compiled JSON schema validator.
     *
     * @see Ajv
     *
     * @since 1.0.0
     * @access public
     *
     * type {object}
     */
    schemaValidator;

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
     * The Architecture defined by the given Parchmint file.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {object}
     */
    architecture;

    /**
     * An array containing all of the Layers that have been parsed.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {Array}
     */
    layers;

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
     * The max x-span of a placed or routed component or channel.
     *
     * This value is set, during parsing, to the max x value of a component or
     * channel. It is only utilized if nothing has been set in the Config
     * object.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {number}
     */
    maxX;

    /**
     * The max y-span of a placed or routed component or channel.
     *
     * This value is set, during parsing, to the max y value of a component or
     * channel. It is only utilized if nothing has been set in the Config
     * object.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {number}
     */
    maxY;

    /**
     * Construct the ParchmintParser object.
     *
     * @class
     *
     * @since 1.0.0
     */
    constructor() {
        this.valid = true;
        this.idSet = new Set();

        this.architecture = null;
        this.layers = [];
        this.components = new Map();
        this.connections = new Map();
        this.compFeatures = new Map();
        this.connFeatures = new Map();

        this.schemaValidator = ajv.compile(schema);

        this.maxX = 0;
        this.maxY = 0;
    }

    /**
     * Parses, builds, and validates the Architecture from the given Parchmint.
     *
     * Sets the parser invalid if the Architecture is invalid.
     *
     * @since 1.0.0
     *
     * @param {string|object}   parchmint   A Parchmint file. If the parameter
     *                                      is of type string, it will be parsed
     *                                      by {@link JSON.parse} before
     *                                      continuing. If this parameter if
     *                                      left as its default, the parser's
     *                                      parchmint field will be used.
     * @returns {object}    An Architecture object representing this Parchmint
     *                      file, or null if the Parchmint itself is invalid.
     */
    parse(parchmint) {
        let obj;
        let xSpan, ySpan;

        if (typeof parchmint === 'string') {
            obj = JSON.parse(parchmint);
        } else if (typeof parchmint === 'object') {
            obj = parchmint;
        } else {
            this.valid = false;
            console.error('Parser (FATAL ERROR): Parchmint file was not represented as a string, nor an' +
                    ' object.\nAborting.');
            return null;
        }

        if (!this.schemaValidator(obj)) {
            this.valid = false;
            console.error('Parser (FATAL ERROR): ' + ajv.errorsText(this.schemaValidator.errors) + '\nAborting.');
            return null;
        }

        // The only required keys are "layers" and "name", so we need to check whether these keys exist before
        // trying to parse them.
        if (obj['features']) {
            this.parseComponentFeatures(obj);
        }
        if (obj['components']) {
            this.parseComponents(obj);
        }
        if (obj['features']) {
            this.parseConnectionFeatures(obj);
        }
        if (obj['connections']) {
            this.parseConnections(obj);
        }

        // We are guaranteed to always have a "layers" key
        this.parseLayers(obj);

        // Determine whether we should use the Config or Parser's max values
        xSpan = Config.svg_drawing.maxX === Validation.DEFAULT_SPAN_VALUE ? this.maxX : Config.svg_drawing.maxX;
        ySpan = Config.svg_drawing.maxY === Validation.DEFAULT_SPAN_VALUE ? this.maxY : Config.svg_drawing.maxY;

        // Until we are able to accept sizes from the Parchmint file itself, we will use the max values plus a little
        // extra.
        this.architecture = new Architecture(obj['name'], this.layers, xSpan, ySpan);
        this.valid = this.architecture.validate() ? this.valid : false;

        return this.architecture;
    }

    /**
     * Parse a JSON object for the layers key.
     *
     * Fills the layers array with Layer objects. If Components or Connections
     * exist in their respective maps, under Layer IDs that do not exist in the
     * "layers" key in the Parchmint, then the parser is set invalid.
     *
     * @since 1.0.0
     *
     * @param {object} jsonObj  A parsed JSON object representing the Parchmint
     *                          file.
     */
    parseLayers(jsonObj) {
        // First make sure that neither components nor connections has extra/invalid layers
        for (let layerID of this.components.keys()) {
            if (!jsonObj['layers'].map(x => x.id).includes(layerID)) {
                this.valid = false;
                console.log('Parser: The Components list contains an invalid Layer (' + layerID + ').');
            }
        }

        for (let layerID of this.connections.keys()) {
            if (!jsonObj['layers'].map(x => x.id).includes(layerID)) {
                this.valid = false;
                console.log('Parser: The Connections list contains an invalid Layer (' + layerID + ').');
            }
        }

        // Now we can move on to the actual parsing.
        jsonObj['layers'].forEach((value, index) => {
            if (this.isUniqueID(value['id'])) {
                this.layers.push(this.getParsedLayer(value));
            } else {
                this.valid = false;
                console.log('Parser: Duplicate IDs (' + value['id'] + ') found in the layers array. Skipping Layer' +
                        ' with name "' + value['name'] + '" at index ' + index + '.');
            }
        });
    }

    getParsedLayer(layerObj) {
        let layerID = layerObj['id'];
        return new Layer(layerObj['name'], layerID, this.components.get(layerID),
                this.connections.get(layerID));
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
            let ports = this.getParsedPorts(compValue['ports']);

            // Next check whether this ID of this Component is a duplicate
            if (this.isUniqueID(compValue['id'])) {
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
                    let tempPorts = ports.get(layerValue);
                    let tempComp = ParchmintParser.getParsedComponent(compValue, tempPorts);
                    let tempFeat = this.compFeatures.get(compValue['id'] + '_' + layerValue);

                    if (!tempPorts) {
                        console.log('Parser (WARNING): The Component with ID "' + compValue['id'] + '" and name "'
                                + compValue['name'] + '" exists on a Layer  (' + layerValue + '), but has no Ports' +
                                ' on that layer.');
                    }

                    // Component Features are not required, so only add it if we have one, otherwise leave it as the
                    // default value
                    if (tempFeat) {
                        tempComp.feature = tempFeat;
                    }

                    ParchmintParser.addToMap(this.components, layerValue, tempComp);
                });
            } else {
                this.valid = false;
                console.log('Parser: Duplicate ID (' + compValue['id'] + ') found in Components array. Skipping' +
                        ' Component with name ' + compValue['name'] + ' at index ' + index + '.');
            }
        });
    }

    /**
     * Parse a Component from the given JSON object.
     *
     * No error checking is done to verify whether the fields exist in the
     * compFeatObj.
     *
     * @param {object}  compObj     An object with the fields name, id,
     *                              x-span, y-span, and entity.
     * @param {Array}   ports       The list of ports this Component
     *                              references in the form of a map.
     *
     * @returns {Component} The resulting Component object.
     */
    static getParsedComponent(compObj, ports) {
        return new Component(compObj['name'], compObj['id'], compObj['x-span'], compObj['y-span'],
                compObj['entity'], ports);
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
                console.log('Parser: Duplicate ID (' + connValue['id'] + ') found in Connections array. Skipping' +
                        ' Connection with name ' + connValue['name'] + ' at index ' + index + '.');
            } else {
                ParchmintParser.addToMap(this.connections, connValue['layer'], this.getParsedConnection(connValue));
            }
        });
    }

    /**
     * Parse a Connection from the given JSON object.
     *
     * No error checking is  done to verify whether the fields exist in the
     * connObj.
     *
     * @param {object}  connObj An object with the fields name, id, source,
     *                          layer, and sinks.
     * @returns {Connection}    The resulting Connection object.
     */
    getParsedConnection(connObj) {
        return new Connection(connObj['name'], connObj['id'], this.getParsedTerminal(connObj['source'],
                connObj['layer']), this.getParsedTerminals(connObj['sinks'], connObj['layer']),
                this.connFeatures.get(connObj['id']));
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
                    this.compFeatures.set(key, ParchmintParser.getParsedComponentFeature(value));
                }

                if (this.maxX < value['location'].x + value['x-span']) {
                    this.maxX = value['location'].x + value['x-span'];
                }

                if (this.maxY < value['location'].y + value['y-span']) {
                    this.maxY = value['location'].y + value['y-span'];
                }
            }
        });
    }

    /**
     * Parse a Component Feature from the given JSON object.
     *
     * No error checking is done to verify whether the fields exist in the
     * compFeatObj.
     *
     * @param {object}  compFeatObj An object with the fields name, layer,
     *                              x-span, y-span, location, and depth.
     * @returns {ComponentFeature}  The resulting ComponentFeature object.
     */
    static getParsedComponentFeature(compFeatObj) {
        return new ComponentFeature(compFeatObj['name'], compFeatObj['layer'], compFeatObj['x-span'],
                compFeatObj['y-span'], ParchmintParser.getParsedCoord(compFeatObj['location']), compFeatObj['depth']);
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
                    ParchmintParser.addToMap(this.connFeatures, value['connection'],
                            ParchmintParser.getParsedConnectionFeature(value));
               } else {
                    this.valid = false;
                    console.log('Parser: Duplicate IDs (' + value['id'] + ') exist for the Connection Features list.' +
                            ' Skipping Connection Feature with name "' + value['name'] + '" at index ' + index + '.');
                }

                if (this.maxX < value['source'].x) {
                    this.maxX = value['source'].x;
                }

                if (this.maxX < value['sink'].x) {
                    this.maxX = value['sink'].x;
                }

                if (this.maxY < value['source'].y) {
                    this.maxY = value['source'].y;
                }

                if (this.maxY < value['sink'].y) {
                    this.maxY = value['sink'].y;
                }
            }
        });
    }

    /**
     * Parse a Connection Feature from the given JSON object.
     *
     * No error checking is done to verify whether the fields exist in the
     * connFeatObj.
     *
     * @param {object}  connFeatObj An object with fields name, id, width, depth
     *                              source, and sink.
     *
     * @returns {ConnectionSegment} The resulting ConnectionSegment object.
     */
    static getParsedConnectionFeature(connFeatObj) {
        return new ConnectionSegment(connFeatObj['name'], connFeatObj['id'], connFeatObj['width'], connFeatObj['depth'],
                ParchmintParser.getParsedCoord(connFeatObj['source']),
                ParchmintParser.getParsedCoord(connFeatObj['sink']));
    }

    /**
     * Parse a Coord object from the given JSON object.
     *
     * @since 1.0.0
     *
     * @param {object}  coordObj    A JSON object with field x and y.
     * @returns {Coord} The resulting Coord object.
     */
    static getParsedCoord(coordObj) {
        return new Coord(coordObj['x'], coordObj['y']);
    }

    /**
     * Parse a single Port object from the given JSON object.
     *
     * @since 1.0.0
     *
     * @param {object}  portObj A JSON object with fields layer, label, x, and y.
     * @returns {Port}  The resulting Port object.
     */
    static getParsedPort(portObj) {
        return new Port(portObj['label'], this.getParsedCoord(portObj));
    }

    /**
     * Parse Ports from the given JSON array.
     *
     * Checks uniqueness of labels within the given port array and sets the
     * parser invalid if they are not.
     *
     * @since 1.0.0
     *
     * @see getParsedPort
     *
     * @param {Array}  portsArr    A JSON array with Port fields.
     * @returns {Map<string, Array>} A map containing all ports that have been
     * parsed. The key is the ID of the layer on which the Port exists. The
     * value is an Array of Port objects that exist on that layer.
     */
    getParsedPorts(portsArr) {
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
            ParchmintParser.addToMap(portMap, value['layer'], ParchmintParser.getParsedPort(value));
        });

        return portMap;
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
    getParsedTerminal(termObj, layer) {
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
     * @see getParsedTerminal
     *
     * @param {Array}   termArr An array of JSON objects with the fields
     *                          "component" and "port".
     * @param {string}  layer   The ID of the Layer on which to search for the
     *                          Component;
     * @returns {Array} An array of Terminal objects as parsed by the
     *                  getParsedTerminal method.
     */
    getParsedTerminals(termArr, layer) {
        let terms = [];

        termArr.forEach(value => {
            terms.push(this.getParsedTerminal(value, layer));
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

    /**
     * Put a value into a Map at the specified key.
     *
     * @param {Map<string, Array>}  map     The map must have a value with a
     *                                      push function.
     * @param {string}              key     The key at which to put the value.
     * @param {object}              value   The value to put in the map.
     */
    static addToMap(map, key, value) {
        if (map.has(key)) {
            map.get(key).push(value);
        } else {
            map.set(key, [value]);
        }
    }
}

module.exports = ParchmintParser;