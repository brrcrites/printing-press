
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

    //-- Accessors and Mutators --\\
    get name() {
        return this.name;
    }

    set name(value) {
        this.name = value;
    }

    get id() {
        return this.id;
    }

    set id(value) {
        this.id = value;
    }

    //-- Validation --\\
    validate() {
        // We want to treat this like an abstract function.
        throw new Error('Validate function has not been implemented.');
    }
}

module.exports = ParchKey;