/**
 * A class that represents a position.
 *
 * The position should be a positive value and will always be relative to the
 * top left corner of the component.
 *
 * @since 1.0.0
 */
class Coord {

    /**
     * The x value.
     *
     * @type {number}
     */
    x = -1;
    /**
     * The y value.
     *
     * @type {number}
     */
    y = -1;

    /**
     * Initialize x and y to their default of -1.
     *
     * @class
     *
     * @since 1.0.0
     */
    constructor() {
        this.setLocation(-1, -1);
    }

    /**
     * @class
     *
     * @since 1.0.0
     *
     * @param {number} x   A value greater than 0.
     * @param {number} y   A value greater than 0.
     */
    constructor(x, y) {
        this.setLocation(x, y);
    }

    /**
     * Set both x and y values.
     *
     * @since 1.0.0
     *
     * @param {number} x   A value greater than 0.
     * @param {number} y   A value greater than 0.
     */
    setLocation(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Validate the x and y values.
     *
     * Both x and y must be positive.
     *
     * @since 1.0.0
     *
     * @returns {boolean} true if x and y are positive, false otherwise.
     */
    validate() {
        // Differentiate between an invalid value and the default value
        let c = new Coord();
        if (this.y === c.y) {
            console.log('Coord: Field "x" is set to the default value.');
            return false;
        }
        if (this.x === c.x) {
            console.log('Coord: Field "y" is set to the default value.');
            return false;
        }
        if (this.x < 0) {
            console.log('Coord: Field "x" cannot be negative.');
            return false;
        }
        if (this.y < 0) {
            console.log('Coord: Field "y" cannot be negative.');
            return false;
        }


        return true;
    }
}

module.exports = Coord;