
class Coord {
    x = -1;
    y = -1;

    constructor(x, y) {
        this.setXY(x, y);
    }

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