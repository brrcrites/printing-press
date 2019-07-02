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
     * @since   1.0.0
     * @access  private
     *
     * @type    {number}
     */
    x;
    /**
     * The y value.
     *
     * @since   1.0.0
     * @access  private
     *
     * @type    {number}
     */
    y;

    /**
     * @class
     *
     * @since 1.0.0
     *
     * @param {number} x   A value greater than 0.
     * @param {number} y   A value greater than 0.
     */
    constructor(x = Coord.DEFAULT_VALUE, y = Coord.DEFAULT_VALUE) {
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
        if (this.y === Coord.DEFAULT_VALUE) {
            console.log('Coord: Field "x" is set to the default value.');
            return false;
        }
        if (this.x === Coord.DEFAULT_VALUE) {
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

    /**
     * @since 1.0.0
     *
     * @returns {string} A string representing the Coord in an ordered pair form (x, y).
     */
    toString() {
        return '(' + this.x + ', ' + this.y + ')';
    }

    /**
     * Compare values to another Coord object.
     *
     * @since 1.0.0
     *
     * @param {object}  coord   The object to be compared.
     * @returns {boolean} true iff coord is an instance of Coord, the x values of both are equal, and the y values of
     * both are equal, false otherwise.
     */
    is(coord) {
        if (!(coord instanceof Coord)) {
            return false;
        }

        if (coord.x !== this.x) {
            return false;
        }

        if (coord.y !== this.y) {
            return false;
        }

        return true;
    }

    /**
     * The default value of x and y.
     *
     * @returns {number}
     */
    static get DEFAULT_VALUE() {
        return -1;
    }
}

module.exports = Coord;