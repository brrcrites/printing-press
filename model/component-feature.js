const Coord = require('./coord.js');
const Validation = require('../utils/validation.js');
const Config = require('../utils/config.js');
const paper = require('paper');


class ComponentFeature {

    /**
     * The name of the Component of which this is a feature.
     *
     * The name should match the Component's name exactly.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {string}
     */
    name;

    /**
     * The layer of this Component Feature.
     *
     *
     * @since 1.0.0
     * @access public
     *
     * @type {string}
     */
    layer;

    /**
     * The size of the component in the x-direction
     *
     * @since 1.0.0
     * @access public
     *
     * @type {number}
     */
    xSpan;

    /**
     * The size of the component in the y-direction
     *
     * @since 1.0.0
     * @access public
     *
     * @type {number}
     */
    ySpan;

    /**
     * The location at which the Component will be placed.
     *
     * The location represents the upper left corner of the bounding box of the
     * component.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {object}
     */
    location;

    /**
     * How deep the component should be.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {number}
     */
    depth;


    constructor(name = Validation.DEFAULT_STR_VALUE, layer = Validation.DEFAULT_STR_VALUE,
                xSpan = Validation.DEFAULT_SPAN_VALUE, ySpan = Validation.DEFAULT_SPAN_VALUE, location = null,
                depth = Validation.DEFAULT_DIM_VALUE) {
        this.name = name;
        this.layer = layer;
        this.xSpan = xSpan;
        this.ySpan = ySpan;
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
        let valid = Validation.testStringValue(this.name, 'name', 'Component Feature');

        valid = Validation.testStringValue(this.layer, 'layer', 'Component Feature') ? valid : false;
        valid = Validation.testSpanValue(this.xSpan, 'x', 'Component Feature') ? valid : false;
        valid = Validation.testSpanValue(this.ySpan, 'y', 'Component Feature') ? valid : false;

        if (!this.location || !this.location.validate()) {
            valid = false;
            console.log('Component Feature: Field "location" is invalid.');
        }

        valid = Validation.testDepthValue(this.depth, 'depth', 'Component Feature') ? valid : false;

        return valid;
    }

    /**
     * Draw this Component Feature on the specified PaperScope.
     *
     * @param {PaperScope}  paperScope  The PaperScope object on which to draw
     *                                  the Component Feature.
     * @returns {paper.Path.Rectangle}  The bounding box that was just drawn represented as a
     *                                  Path object.
     */
    print(paperScope) {
        // First we need to create an "abstract" Rectangle object that will define our bounding box
        let rect = new paper.Rectangle(0, 0, this.xSpan, this.ySpan);
        rect.topLeft = new paper.Point(this.location.x, this.location.y);
        // Next we have to draw the rectangle on the PaperScope project
        let boundingBox = new paperScope.Path.Rectangle(rect);
        boundingBox.fillColor = Config.svg_drawing.color;
        // Finally let's name the Component Feature so it is easy to access
        boundingBox.name = this.name;

        return boundingBox;
    }
}

module.exports = ComponentFeature;