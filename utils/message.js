const MessageType = require('./message-type.js');
const Validation = require('./validation.js');

class Message {

    /**
     * The type of message this is.
     *
     * The type is displayed in brackets ahead of the message.
     *
     * @access public
     * @since 1.0.0
     *
     * @type {object}
     */
    msgType;

    /**
     * The message type text.
     *
     * This is only used if the message type is set to other.
     *
     * @see MessageType.OTHER
     *
     * @access public
     * @since 1.0.0
     *
     * @type {string}
     */
    msgTypeText;

    /**
     * The text of the message itself.
     *
     * The text is displayed after the message type.
     *
     * @access public
     * @since 1.0.0
     *
     * @type {string}
     */
    text;

    /**
     * Any additional information less important than the main message.
     *
     * The additional information is outputted with one extra tab.
     *
     * @access public
     * @since 1.0.0
     *
     * @type {Array}
     */
    additionalInfo;

    /**
     * How many times to indent this message.
     *
     * The number corresponds to the number of tabs outputted before each line
     * of the message.
     *
     * @access public
     * @since 1.0.0
     *
     * @type {number}
     */
    tabs;


    /**
     * Constructs the message object.
     *
     * @class
     * @since 1.0.0
     *
     * @param {object}  msgType         The type of message.
     * @param {string}  text            The message body.
     * @param {number}  tabs            The number of indents to apply to this
     *                                  message.
     * @param {string}  msgTypeText     Alternate message type used only if the
     *                                  message type is other.
     * @param {Array}   additionalInfo  Any additional information to append to
     *                                  the message.
     */
    constructor(msgType, text = Validation.DEFAULT_STR_VALUE, tabs = Validation.DEFAULT_LOG_TABS,
                msgTypeText = Validation.DEFAULT_STR_VALUE, ...additionalInfo) {
        this.msgType = msgType;
        this.text = text;
        this.tabs = tabs;
        this.msgTypeText = msgTypeText;
        this.additionalInfo = additionalInfo;
    }

    /**
     * Returns the stringified message.
     *
     * The format is:
     * [TYPE] message body
     *     additional info 0
     *     additional info 1
     *           •
     *           •
     *           •
     *     additional info n
     *
     * @since 1.0.0
     *
     * @returns {string}
     */
    toString() {
        let mType = this.msgType === MessageType.OTHER ? this.msgTypeText : this.msgType;
        let ret = '\t'.repeat(this.tabs) + '[' + mType + '] ' + this.text + '\n';
        for (let s of this.additionalInfo) {
            ret += '\t'.repeat(this.tabs + 1) + s + '\n';
        }

        return ret;
    }
}

module.exports = Message;