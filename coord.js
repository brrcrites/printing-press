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
     * The default x and y value.
     *
     * This field is to be treated as a constant and remain unchanged.
     *
     * @since   1.0.0
     * @access  private
     *
     * @type    {number}
     */
    DEFAULT_VALUE = -1;

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
    constructor(x = this.DEFAULT_VALUE, y = this.DEFAULT_VALUE) {
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