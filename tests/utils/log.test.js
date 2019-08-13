const Log = require('../../utils/log.js');
const Message = require('../../utils/message.js');
const MessageType = require('../../utils/message-type.js');
const Validation = require('../../utils/validation.js');

test('initialization', () => {
    let l = new Log();

    expect(l.messages).toEqual([]);
});

describe('size method', () => {
    test('initial', () => {
        let l = new Log();

        expect(l.size()).toBe(0);
    });

    test('after notify', () => {
        let l = new Log();

        l.notify(MessageType.WARN);
        l.notify(MessageType.ERR);

        expect(l.size()).toBe(2);
    });
});

describe('peek method', () => {
    test('initial', () => {
        let l = new Log();

        expect(l.peek()).toBe(undefined);
    });

    test('after notify', () => {
        let l = new Log();

        l.notify(MessageType.ERR);

        expect(l.peek()).toBeTruthy();
    });

    test('specifics', () => {
        let l = new Log();
        let m;

        l.notify(MessageType.ERR);
        l.notify(MessageType.OTHER, 'This is the specific msg', 4, 'OOOO');

        m = l.peek();
        expect(m.msgType).toBe(MessageType.OTHER);
        expect(m.text).toBe('This is the specific msg');
        expect(m.tabs).toBe(4);
        expect(m.msgTypeText).toBe('OOOO');
    });

    describe('multiple peeks', () => {
        test('same message', () => {
            let l = new Log();
            let m;

            l.notify(MessageType.ERR);
            l.notify(MessageType.OTHER, 'This is the specific msg', 4, 'OOOO');

            m = l.peek();
            expect(m.msgType).toBe(MessageType.OTHER);
            expect(m.text).toBe('This is the specific msg');
            expect(m.tabs).toBe(4);
            expect(m.msgTypeText).toBe('OOOO');
            m = l.peek();
            expect(m.msgType).toBe(MessageType.OTHER);
            expect(m.text).toBe('This is the specific msg');
            expect(m.tabs).toBe(4);
            expect(m.msgTypeText).toBe('OOOO');
        });

        test('different messages', () => {
            let l = new Log();
            let m;

            l.notify(MessageType.ERR);
            l.notify(MessageType.OTHER, 'This is the specific msg', 4, 'OOOO');

            m = l.peek();
            expect(m.msgType).toBe(MessageType.OTHER);
            expect(m.text).toBe('This is the specific msg');
            expect(m.tabs).toBe(4);
            expect(m.msgTypeText).toBe('OOOO');

            l.messages.pop();
            m = l.peek();
            expect(m.msgType).toBe(MessageType.ERR);
            expect(m.text).toBe(Validation.DEFAULT_STR_VALUE);
            expect(m.tabs).toBe(Validation.DEFAULT_LOG_TABS);
            expect(m.msgTypeText).toBe(Validation.DEFAULT_STR_VALUE);
            expect(m.additionalInfo).toEqual([]);
        });
    });
});

describe('notify method', () => {
    test('all parameters', () => {
        let l = new Log();
        let m;
        l.notify(MessageType.WARN, 'warning message', 2, 'test msg',
                'add info 0', 'add info 1');

        expect(l.size()).toBe(1);

        m = l.peek();
        expect(m.msgType).toBe(MessageType.WARN);
        expect(m.text).toBe('warning message');
        expect(m.tabs).toBe(2);
        expect(m.msgTypeText).toBe('test msg');
        expect(m.additionalInfo.length).toBe(2);
        expect(m.additionalInfo).toEqual(['add info 0', 'add info 1']);
    });

    test('default', () => {
        let l = new Log();
        let m;

        l.notify(MessageType.ERR);
        expect(l.size()).toBe(1);

        m = l.peek();
        expect(MessageType.ERR);
        expect(m.text).toBe(Validation.DEFAULT_STR_VALUE);
        expect(m.tabs).toBe(Validation.DEFAULT_LOG_TABS);
        expect(m.msgTypeText).toBe(Validation.DEFAULT_STR_VALUE);
        expect(m.additionalInfo).toEqual([]);
    });
});

describe('clear method', () => {
    test('initial', () => {
        let l = new Log();

        expect(l.size()).toBe(0);
        expect(l.messages).toEqual([]);

        l.clear();
        expect(l.size()).toBe(0);
        expect(l.messages).toEqual([]);
    });

    test('after notify', () => {
        let l = new Log();

        l.notify(MessageType.ERR);
        l.notify(MessageType.WARN);

        expect(l.size()).toBe(2);

        l.clear();
        expect(l.size()).toBe(0);
    });
});

describe('toString method', () => {
    describe('single message', () => {
        describe('no additional info', () => {
            test('no tabs', () => {
                let l = new Log();

                l.notify(MessageType.ERR, 'Big bad error.');

                expect(l.toString()).toBe('[' + MessageType.ERR + '] Big bad error.\n');
            });

            test('with tabs', () => {
                let l = new Log();

                l.notify(MessageType.WARN, 'Ignorable warning.', 2);

                expect(l.toString()).toBe('\t\t[' + MessageType.WARN + '] Ignorable warning.\n');
            });
        });

        describe('with additional info', () => {
            test('no tabs', () => {
                let l = new Log();

                l.notify(MessageType.ERR, 'The erroneous message.');
                l.peek().additionalInfo = ['add info'];

                expect(l.toString()).toBe('[' + MessageType.ERR + '] The erroneous message.\n\tadd info\n');
            });

            test('with tabs', () => {
                let l = new Log();

                l.notify(MessageType.OTHER, 'A simple other message', 1, 'SEVERE',
                        'Turns out bad', 'Really bad');

                expect(l.toString()).toBe('\t[SEVERE] A simple other message\n\t\tTurns out bad\n\t\tReally bad\n');
            });
        });
    });

    describe('multiple messages', () => {
        test('one call', () => {
            let l = new Log();

            l.notify(MessageType.ERR, 'Sub error message', 2);
            l.notify(MessageType.ERR, 'Super error message');

            expect(l.toString()).toBe('[' + MessageType.ERR + '] Super error message\n\t\t[' + MessageType.ERR + '] Sub' +
                    ' error message\n');
        });

        describe('two calls', () => {
            test('no change', () => {
                let l = new Log();

                l.notify(MessageType.WARN, 'Sub warning message', 1);
                l.notify(MessageType.WARN, 'Super warning message');

                expect(l.toString()).toBe('[' + MessageType.WARN + '] Super warning message\n\t[' + MessageType.WARN +
                        '] Sub warning message\n');
                expect(l.toString()).toBe('[' + MessageType.WARN + '] Super warning message\n\t[' + MessageType.WARN +
                        '] Sub warning message\n');
            });

            test('notify between', () => {
                let l = new Log();

                l.notify(MessageType.WARN, 'Sub warning message', 1);
                l.notify(MessageType.WARN, 'Super warning message');

                expect(l.toString()).toBe('[' + MessageType.WARN + '] Super warning message\n\t[' + MessageType.WARN +
                        '] Sub warning message\n');

                l.notify(MessageType.OTHER, 'world!', 0, 'Hello',
                        'what a fine day to be alive.');

                expect(l.toString()).toBe('[Hello] world!\n\twhat a fine day to be alive.\n[' + MessageType.WARN + ']' +
                        ' Super warning message\n\t[' + MessageType.WARN + '] Sub warning message\n');
            });
        });
    });
});
