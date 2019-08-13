const Message = require('../../utils/message.js');
const MessageType = require('../../utils/message-type.js');
const Validation = require('../../utils/validation.js');

describe('initialization', () => {
    describe('constructor', () => {
        test('default', () => {
            let m = new Message(MessageType.ERR);

            expect(m.msgType).toBe(MessageType.ERR);
            expect(m.msgTypeText).toBe(Validation.DEFAULT_STR_VALUE);
            expect(m.text).toBe(Validation.DEFAULT_STR_VALUE);
            expect(m.additionalInfo).toEqual([]);
            expect(m.tabs).toBe(Validation.DEFAULT_LOG_TABS);
        });

        test('all parameters', () => {
            let m = new Message(MessageType.OTHER, 'message body', 1, 'TEST MSG',
                    'additional info 0', 'additional info 1');

            expect(m.msgType).toBe(MessageType.OTHER);
            expect(m.msgTypeText).toBe('TEST MSG');
            expect(m.text).toBe('message body');
            expect(m.additionalInfo.length).toBe(2);
            expect(m.additionalInfo).toEqual(['additional info 0', 'additional info 1']);
            expect(m.tabs).toBe(1);
        });
    });

    test('modify fields', () => {
        let m = new Message(MessageType.WARN);

        m.msgTypeText = 'MESSAGE TYPE';
        m.text = 'the message';
        m.additionalInfo = ['add info 0', 'add info 1', 'add info 2'];
        m.tabs = 5;

        expect(m.msgType).toBe(MessageType.WARN);
        expect(m.msgTypeText).toBe('MESSAGE TYPE');
        expect(m.additionalInfo.length).toBe(3);
        expect(m.additionalInfo).toEqual(['add info 0', 'add info 1', 'add info 2']);
        expect(m.tabs).toBe(5);
    });
});

describe('toString method', () => {
    describe('no additional info', () => {
        test('non-other type', () => {
            let m = new Message(MessageType.ERR, 'There was an error.');

            expect(m.toString()).toBe('[' + MessageType.ERR + '] There was an error.\n');
        });

        test('other type', () => {
            let m = new Message(MessageType.OTHER, 'This is an other type message', 0, 'NOTIFY');

            expect(m.toString()).toBe('[NOTIFY] This is an other type message\n');
        });
    });

    describe('with additional info', () => {
        test('with tabs', () => {
            let m = new Message(MessageType.WARN, 'This is merely a warning message.', 3,
                    'TYPE', 'This is not an error!');

            expect(m.toString()).toBe('\t\t\t[' + MessageType.WARN + '] This is merely a warning' +
            ' message.\n\t\t\t\tThis is not an error!\n');
        });

        test('without tabs', () => {
            let m = new Message(MessageType.ERR, 'The main message text');
            m.additionalInfo = ['Woah this must have been bad.', 'I mean really bad.'];

            expect(m.toString()).toBe('[' + MessageType.ERR + '] The main message text\n\tWoah this must have been' +
                    ' bad.\n\tI mean really bad.\n');
        });
    });
});