/**
 * A class meant to condense and ease the parsing of x, y pairs.
 * There is no specific meaning attached to x and y. I.e. they have no units, and can be used for distance,
 * position, etc.
 */
class Coord {
    x = -1;
    y = -1;

    /**
     * @param x An integer value
     * @param y An integer value
     */
    constructor(x, y) {
        this.setXY(x, y);
    }

    /**
     * Set both x and y values.
     * @param x An integer value
     * @param y An integer value
     */
    setXY(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Validate the x and y values. Both x and y must be positive.
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