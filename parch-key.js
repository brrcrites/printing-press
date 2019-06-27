
class ParchKey {
    /**
     * The name of the top level key object.
     *
     * @type {string}
     */
    name = 'unassigned';
    /**
     * The id of the top level key object.
     *
     * @type {string}
     */
    id = 'unassigned';

    /**
     * @class
     *
     * @since 1.0.0
     *
     * @param {string}  name    The name of the top level key object.
     * @param {string}  id      The id of the top level key object.
     */
    name = 'unassigned';
    id = 'unassigned';

    constructor(name, id) {
        // This class is abstract so make sure we cannot instantiate it
        if (this.constructor === ParchKey) {
            throw new TypeError('Abstract class "ParchKey" cannot be instantiated directly.');
        }

        this.name = name;
        this.id = id;
    }

    /**
     * Validate the name and id fields.
     *
     * Does not validate uniqueness.
     *
     * @since 1.0.0
     *
     * @returns {boolean} false if either name or id are empty, true otherwise.
     */
    validate() {
        if (this.name === '') {
            console.log('ParchKey: Field "name" cannot be empty.');
            return false;
        }
        if (this.id === '') {
            console.log('ParchKey: Field "id" cannot be empty.');
            return false;
        }
        return true;
    }
}

module.exports = ParchKey;