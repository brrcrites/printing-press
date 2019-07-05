
/**
 * A class that contains data for sources and sinks on connections.
 *
 * @since 1.0.0
 */
class Terminal {
    /**
     * The component to which this terminal connects.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {object}
     */
    component;

    /**
     * The port to which this terminal ID connects on the component.
     *
     * @since 1.0.0
     * @access public
     *
     * @type {object}
     */
    port;

    /**
     * @class
     * @since 1.0.0
     *
     * @param {string}  compID  The component ID of the component to which this terminal connects.
     * @param {object}  port    The port to which this terminal connects on the component.
     */
    constructor(component = null, port = null) {
        this.component = component;
        this.port = port;
    }


    /**
     * Validate the Terminal object.
     *
     * The component must be a valid Component object. Port can be null, but if
     * it is not, then it must be a valid Port object.
     *
     * @since 1.0.0
     *
     * @returns {boolean}
     */
    validate() {
        let valid = true;

        if (!this.component || !this.component.validate()) {
            console.log('Terminal: Field "component" is invalid.');
            valid = false;
        }

        // Port is allowed to be its default value
        if (this.port) {
            let validPort = this.port.validate();
            valid = validPort ? valid : false;

            // Only check whether the port exists if it is valid and the component is assigned
            if (validPort && this.component && !this.doesPortExist()) {
                valid = false;
                console.log('Terminal: Field "port" does not exist on the given component');
            }
        }

        return valid;
    }

    /**
     * Determine whether port exists on component.
     *
     * @since 1.0.0
     *
     * @returns {boolean}
     */
    doesPortExist() {
        for (let i = 0; i < this.component.ports.length; i++) {
            if (this.component.ports[i] === this.port) {
                return true;
            }
        }

        return false;
    }

}

module.exports = Terminal;