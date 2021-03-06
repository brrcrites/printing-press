const Terminal = require('../../model/terminal.js');
const Port = require('../../model/port.js');
const Component = require('../../model/component.js');
const Coord = require('../../model/coord.js');
const ComponentFeature = require('../../model/component-feature.js');

// Suppress console logs
console.log = jest.fn();
console.warn = jest.fn();

var validPort1 = new Port('port-1', new Coord(0, 0));
var validPort2 = new Port('port-2', new Coord(0, 5));
var validPort3 = new Port('port-3', new Coord(0, 10));
var invalidPort = new Port('invalid-port-1', new Coord(-1, -10));
var feature10_7 = new ComponentFeature('name', 'layer', 10, 20, new Coord(10, 7), 5);
var validComponent = new Component('name', 'unique-id', 10, 20, 'entity', [validPort1, validPort2], feature10_7);
var invalidComponent = new Component('', '', 0, 0, '', [new Port(), new Port()], new ComponentFeature());

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

