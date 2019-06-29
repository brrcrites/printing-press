
class ParchKey {

    /**
     * The name of the top level key object.
     *
     * @type {string}
     */
    name;
    /**
     * The id of the top level key object.
     *
     * @type {string}
     */
    id;

    /**
     * @class
     *
     * @since 1.0.0
     *
     * @param {string}  name    The name of the top level key object.
     * @param {string}  id      The id of the top level key object.
     */
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
        if (this.name === ParchKey.DEFAULT_STR_VALUE) {
            console.log('ParchKey: Field "name" is set to the default value.');
            return false;
        }
        if (this.id === ParchKey.DEFAULT_STR_VALUE) {
            console.log('ParchKey: Field "id" is set to the default value.');
            return false;
        }
        return true;
    }

    /**
     * The default value of name and id.
     *
     * @returns {string}
     */
    static get DEFAULT_STR_VALUE() {
        return 'unassigned';
    }
}

module.exports = ParchKey;