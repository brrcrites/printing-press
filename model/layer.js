const ParchKey = require('./parch-key.js');
const Validation = require('../utils/validation.js');
const paper = require('paper');

class Layer extends ParchKey {

    /**
     * The Abstract components that can exist on this Layer.
     *
     * Represented as an array of Component objects.
     *
     * @since 1.0.0
     *
     * @type {Array}
     */
    components;

    /**
     * The Connections that exist on this Layer.
     *
     * Represented as a array of Connection objects.
     *
     * @since 1.0.0
     *
     * @type {Array}
     */
    connections;

    /**
     * The PaperScope object which will contain the project that holds all SVG
     * components for this Layer.
     *
     * @see {@link http://paperjs.org/reference/paperscope/|PaperScope}
     *
     * @since 1.0.0
     * @access public
     *
     * @type {PaperScope}
     */
    paperScope;



    /**
     * @class
     *
     * @since 1.0.0
     * @augments ParchKey
     *
     * @param {string}  name        The Layer name.
     * @param {string}  id          The Layer id.
     * @param {Array}   components  An array of Components that exist on this
     *                              Layer.
     * @param {Array}   connections An array of Connections that exist on this
     *                              Layer.
     */
    constructor(name = Validation.DEFAULT_STR_VALUE, id = Validation.DEFAULT_STR_VALUE, components = [],
                connections = []) {
        super(name, id);

        this.components = components;
        this.connections = connections;
        this.paperScope = paper.PaperScope();
    }

    /**
     * Validate the Layer object.
     *
     * Name and ID follow Validation's string rules. Components and connections
     * must not evaluate to falsey and all be valid.
     *
     * @since 1.0.0
     *
     * @see ParchKey.validate
     *
     * @returns {boolean} true if both name and id are valid, false otherwise.
     */
    validate() {
        let valid = super.validate();

        if (this.components.length === 0 && this.connections.length === 0) {
            console.log('Layer (' + this.id + ') (WARNING): contains no component and no connections');
        }
        else if (this.components.length === 0) {
            console.log('Layer (' + this.id + ') (WARNING): contains no components.');
        }
        else if (this.connections.length === 0) {
            console.log('Layer (' + this.id + ') (WARNING): contains no connections.');
        }

        // Components
        this.components.forEach((value, index) => {
            if (!value.validate()) {
                valid = false;
                console.log('Layer (' + this.id + '): Field "components" contains an invalid Component object:\n\tID: '
                        + value.id + '\n\tIndex: ' + index);
            }
        });


        // Connections
        this.connections.forEach((conValue, conIndex) => {
            if (!conValue.validate()) {
                valid = false;
                console.log('Layer (' + this.id + '): Field "connections" contains an invalid Connection object:\n\t' +
                        'ID:' + conValue.id + '\n\tIndex: ' + conIndex);
            }

            if (conValue.source) {
                // Check that the Connection's source reference a Component on this Layer
                if (this.components.indexOf(conValue.source.component) === -1) {
                    valid = false;
                    console.log('Layer (' + this.id + '): Field "connections" contains a Connection object (' + conValue.id +
                            ') with a source that does not reference a Component on this Layer.');
                }
            }

            // Check that the Connection's sinks reference a Component on this Layer
            if (conValue.sinks) {
                conValue.sinks.forEach((sinkValue, sinkIndex) => {
                    if (this.components.indexOf(sinkValue.component) === -1) {
                        valid = false;
                        console.log('Layer (' + this.id + '): Field "connections" contains a Connection object ('
                                + conValue.id + ') with a sink at index ' + sinkIndex + ' that does not reference a' +
                                ' Component on this Layer.');
                    }
                });
            }
        });

        return valid;
    }

    /**
     * Call print on each Component and Connection in this Layer thereby
     * generating the SVG.
     *
     * Calling this function sets up a new project, guaranteeing that we won't
     * have any artifacts from a previous print.
     *
     * @param {number}  xSpan   The xSpan of the canvas.
     * @param {number}  ySpan   The ySpan of the canvas.
     *
     * @since 1.0.0
     *
     * @see Component.print
     * @see Connection.print
     *
     * @returns {string} A string representation of the SVG image generated.
     */
    print(xSpan, ySpan) {
        this.paperScope.setup(new paper.Size(xSpan, ySpan));
        this.connections.forEach(conn => { conn.print(this.paperScope); });
        this.components.forEach(comp => {comp.print(this.paperScope); });
        return this.paperScope.project.exportSVG( { asString:true });
    }
}

module.exports = Layer;