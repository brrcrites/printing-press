const Terminal = require('../../model/terminal.js');
const Port = require('../../model/port.js');
const Component = require('../../model/component.js');
const Coord = require('../../model/coord.js');

// Suppress console logs
console.log = jest.fn();

var layer1 = 'layer-1';
var layer2 = 'layer-2';
var validPort1 = new Port('port-1', layer1, new Coord(0, 0));
var validPort2 = new Port('port-2', layer2, new Coord(0, 5));
var validPort3 = new Port('port-3', 'layer-3', new Coord(0, 10));
var invalidPort = new Port('invalid-port-1', '', new Coord(0, 0));
var validComponent = new Component('name', 'unique-id', [layer1, layer2], 10, 20, 'entity', [validPort1, validPort2]);
var invalidComponent = new Component('', '', [layer1, layer1], 0, 0, '', [new Port(), new Port()]);

describe('initialization', () => {
    describe('constructor', () => {
        test('parameters', () => {
            let t = new Terminal(new Component(), new Port());

            expect(t.component).toEqual(new Component());
            expect(t.port).toEqual(new Port());
        });

        test('default', () => {
            let t = new Terminal();

            expect(t.component).toBe(null);
            expect(t.port).toBe(null);
        });
    });

    test('modify fields', () => {
        let t = new Terminal();

        t.component = new Component();
        t.port = new Port();

        expect(t.component).toEqual(new Component());
        expect(t.port).toEqual(new Port());
    });
});

describe('validation', () => {
    describe('invalid', () => {
        test('modified Terminal', () => {
            let t = new Terminal();

            t.component = new Component();
            t.port = new Port();

            expect(t.validate()).toBe(false);
        });

        test('values', () => {
            let t = new Terminal(invalidComponent, invalidPort);

            expect(t.validate()).toBe(false);
        });

        test('port', () => {
            let t = new Terminal(validComponent, validPort3);

            expect(t.validate()).toBe(false);
        });

        test('default values', () => {
            let t = new Terminal();

            expect(t.validate()).toBe(false);
        });
    });

    describe('valid', () => {
        test('modified Terminal', () => {
            let t = new Terminal();

            t.component = validComponent;
            t.port = validPort1;

            expect(t.validate()).toBe(true);
        });

        test('given values', () => {
            let t = new Terminal(validComponent, validPort1);

            expect(t.validate()).toBe(true);
        });

        test('default values', () => {
            let t = new Terminal(validComponent);

            expect(t.validate()).toBe(true);
        });
    });
});

