const Port = require('../../model/port.js');
const Coord = require('../../model/coord.js');
const Validation = require('../../utils/validation.js');

//Suppress console logs
console.log = jest.fn();


describe('initialization', () => {
    describe('constructor', () => {
        test('parameters', () => {
            let port = new Port('label', new Coord(0, 0));

            expect(port.label).toBe('label');
            expect(port.pos.x).toBe(0);
            expect(port.pos.y).toBe(0);
        });
        
        test('default', () => {
            let port = new Port();
            
            expect(port.label).toBe(Validation.DEFAULT_STR_VALUE);
            expect(port.pos).toEqual(new Coord());
        });
    });

    test('modify fields', () => {
        let port = new Port('', new Coord(0, 0));

        port.label = 'new-label';
        port.pos.setLocation(10, 15);

        expect(port.label).toBe('new-label');
        expect(port.pos.x).toBe(10);
        expect(port.pos.y).toBe(15);
    });
});

describe('validation', () => {
    test('validate port: valid values', () => {
        let goodPort = new Port('label', new Coord(0, 0));

        expect(goodPort.validate()).toBe(true);
    });

    describe('invalid', () => {
        test('all fields', () => {
            let badPort = new Port('', new Coord(-100, -100));

            expect(badPort.validate()).toBe(false);
        });

        test('label', () => {
            let badLabelPort = new Port('', new Coord(1, 1));

            expect(badLabelPort.validate()).toBe(false);
        });

        test('pos', () => {
            let badCoordPort = new Port('label', new Coord(-100, -100));

            expect(badCoordPort.validate()).toBe(false);
        });
    });
            
    describe('defaults', () => {
        test('all fields', () => {
            let defPort = new Port();

            expect(defPort.validate()).toBe(false);
        });

        test('label', () => {
            let defLabelPort = new Port(Validation.DEFAULT_STR_VALUE, new Coord(0, 0));

            expect(defLabelPort.validate()).toBe(false);
        });

        test('pos', () => {
            let defCoordPort = new Port('label');

            expect(defCoordPort.validate()).toBe(false);
        });
        
    });
});
