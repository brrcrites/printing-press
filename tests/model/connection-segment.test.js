const ConnectionSegment = require('../../model/connection-segment.js');
const Coord = require('../../model/coord.js');
const Validation = require('../../utils/validation.js');

// Suppress console logs
console.log = jest.fn();

var validSink = new Coord(10, 20);
var validSource = new Coord(20, 30);
describe('initialization', () => {
    describe('constructor', () => {
        test('params', () => {
            let c = new ConnectionSegment(10, 5, validSource, validSink);

            expect(c.width).toBe(10);
            expect(c.depth).toBe(5);
            expect(c.sourcePoint).toEqual(validSource);
            expect(c.sinkPoint).toEqual(validSink);
        });

        test('default', () => {
            let c = new ConnectionSegment();

            expect(c.width).toBe(Validation.DEFAULT_DIM_VALUE);
            expect(c.depth).toBe(Validation.DEFAULT_DIM_VALUE);
            expect(c.sourcePoint).toBe(null);
            expect(c.sinkPoint).toBe(null);
        });
    });

    describe('modify fields', () => {
        let c = new ConnectionSegment();

        c.width = 10;
        c.depth = 5;
        c.sourcePoint = validSource;
        c.sinkPoint = validSink;

        expect(c.width).toBe(10);
        expect(c.depth).toBe(5);
        expect(c.sourcePoint).toEqual(validSource);
        expect(c.sinkPoint).toEqual(validSink);
    });
});

describe('validation', () => {
    test('valid', () => {
        let c = new ConnectionSegment(10, 5, validSource, validSink);

        expect(c.validate()).toBe(true);
    });

    describe('invalid', () => {
        test('all fields', () => {
            let c = new ConnectionSegment();

            expect(c.validate()).toBe(false);
        });

        test('width', () => {
            let c = new ConnectionSegment(-456, 5, validSource, validSink);

            expect(c.validate()).toBe(false);
        });

        test('depth', () => {
            let c = new ConnectionSegment(10, -45, validSource, validSink);

            expect(c.validate()).toBe(false);
        });

        describe('sourcePoint', () => {
            test('invalid Coord', () => {
                let c = new ConnectionSegment(10, 5, new Coord(), validSink);

                expect(c.validate()).toBe(false);
            });

            test('null Coord', () => {
                let c = new ConnectionSegment(10, 5, null, validSink);

                expect(c.validate()).toBe(false);
            });
        });

        describe('sinkPoint', () => {
            test('invalid Coord', () => {
                let c = new ConnectionSegment(10, 5, validSource, new Coord());

                expect(c.validate()).toBe(false);
            });

            test('null Coord', () => {
                let c = new ConnectionSegment(10, 5, validSource, null);

                expect(c.validate()).toBe(false);
            });
        });
    });
});