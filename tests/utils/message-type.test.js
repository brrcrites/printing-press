const MessageType = require('../../utils/message-type.js');

describe('values', () => {
    test('error', () => {
        expect(MessageType.ERR).toBe('ERROR');
    });

    test('warning', () => {
        expect(MessageType.WARN).toBe('WARNING');
    });

    test('other', () => {
        expect(MessageType.OTHER).toBe('OTHER');
    });
});