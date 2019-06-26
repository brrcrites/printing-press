
class ParchKey {
    name = 'unassigned';
    id = 'unassigned';

    constructor(name, id) {
        // This class is abstract so make sure we cannot instantiate it
        if (this.constructor === ParchKey) {
            throw new TypeError('Abstract class "ParchKey" cannot be instantiated directly.');
        }

        // Make sure the validate function has been defined in subclasses
        if (undefined === this.validate) {
            throw new TypeError('Extending class must implement the "validate" function.');
        }
        this.name = name;
        this.id = id;
    }

    //-- Validation --\\
    /**
     * Validate the name and id fields. Does not validate uniqueness.
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
    }
}

module.exports = ParchKey;