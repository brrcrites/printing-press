/**
 * A class meant to condense and ease the parsing of x, y pairs.
 *
 * There is no specific meaning attached to x and y. I.e. they have no units,
 * and can be used for distance, position, etc.
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
     * @class
     *
     * @since 1.0.0
     *
     * @param {int} x   A value greater than 0.
     * @param {int} y   A value greater than 0.
     */
    constructor(x, y) {
        this.setXY(x, y);
    }

    /**
     * Set both x and y values.
     *
     * @since 1.0.0
     *
     * @param {int} x   A value greater than 0.
     * @param {int} y   A value greater than 0.
     */
    setXY(x, y) {
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
        if (this.x < 0) {
            return false;
        }
        if (this.y < 0) {
            return false;
        }

        return true;
    }
}

module.exports = Coord;