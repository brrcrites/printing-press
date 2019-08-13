const Message = require('./message.js');
const MessageType = require('./message-type.js');
const Validation = require('./validation.js');

class Log {
    /**
     * The list of messages that will be displayed to the user.
     *
     * The messages are represented as an array and used as a stack.
     *
     * @access public
     * @since 1.0.0
     *
     * @type {Array}
     */
    messages;

    /**
     * Constructs the Log.
     *
     * @since 1.0.0
     * @class
     */
    constructor() {
        this.messages = [];
    }

    /**
     * Get all of the messages as a single string.
     *
     * Does not delete the messages.
     *
     * @since 1.0.0
     *
     * @returns {string} A string representing all of the messages.
     */
    toString() {
        let tempMessages = []; // We don't want to lose the messages in case we want to display them again.
        let ret = "";         // We're going to append strings to this, so I think it needs to be initialized.

        while(this.messages.length) {
            // Save the message so we can add it to tempMessages
            let s = this.messages.pop();
            // Messages always end with a newline so no need to add one
            ret += s.toString();
            tempMessages.push(s);
        }

        // Put all the messages back in the correct order.
        while (tempMessages.length) {
            this.messages.push(tempMessages.pop());
        }

        return ret;
    }

    /**
     * Clear out all messages from the log.
     */
    clear() {
        this.messages = [];
    }

    /**
     * Add a message to the log.
     *
     * Because the log is a stack, the later this function is called the sooner
     * it will be printed.
     *
     * @since 1.0.0
     *
     * @param {object}  msgType         The type of message.
     * @param {string}  msgText            The message body.
     * @param {number}  tabs            The number of indents to apply to this
     *                                  message.
     * @param {string}  msgTypeText     Alternate message type used only if the
     *                                  message type is other.
     * @param {$Rest}   additionalInfo  Any additional information to append to
     *                                  the message.
     */
    notify(msgType, msgText = Validation.DEFAULT_STR_VALUE, tabs = Validation.DEFAULT_LOG_TABS,
           msgTypeText = Validation.DEFAULT_STR_VALUE, ...additionalInfo) {
        // Can't assign a rest parameter to a rest parameter, so we set it manually
        let m = new Message(msgType, msgText, tabs, msgTypeText);
        m.additionalInfo = additionalInfo;
        this.messages.push(m);
    }

    /**
     * @since 1.0.0
     *
     * @returns {object}    A reference to the last added message.
     */
    peek() {
        return this.messages[this.size() - 1];
    }

    /**
     * @since 1.0.0
     *
     * @returns {number}    The length of the messages array.
     */
    size() {
        return this.messages.length;
    }
}

module.exports = Log;