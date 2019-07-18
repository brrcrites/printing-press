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
            let c = new ConnectionSegment('name', 'unique-id', 10, 5, validSource, validSink);

            expect(c.name).toBe('name');
            expect(c.id).toBe('unique-id');
            expect(c.width).toBe(10);
            expect(c.depth).toBe(5);
            expect(c.sourcePoint).toEqual(validSource);
            expect(c.sinkPoint).toEqual(validSink);
        });

        test('default', () => {
            let c = new ConnectionSegment();

            expect(c.name).toBe(Validation.DEFAULT_STR_VALUE);
            expect(c.id).toBe(Validation.DEFAULT_STR_VALUE);
            expect(c.width).toBe(Validation.DEFAULT_DIM_VALUE);
            expect(c.depth).toBe(Validation.DEFAULT_DIM_VALUE);
            expect(c.sourcePoint).toBe(null);
            expect(c.sinkPoint).toBe(null);
        });
    });

    describe('modify fields', () => {
        let c = new ConnectionSegment();

        c.name = 'name';
        c.id = 'unique-id';
        c.width = 10;
        c.depth = 5;
        c.sourcePoint = validSource;
        c.sinkPoint = validSink;

        expect(c.name).toBe('name');
        expect(c.id).toBe('unique-id');
        expect(c.width).toBe(10);
        expect(c.depth).toBe(5);
        expect(c.sourcePoint).toEqual(validSource);
        expect(c.sinkPoint).toEqual(validSink);
    });
});

describe('validation', () => {
    describe('valid', () => {
        test('positive depth', () => {
            let c = new ConnectionSegment('name', 'unique-id', 10, 5, validSource, validSink);

            expect(c.validate()).toBe(true);
        });

        test('negative depth', () => {
            let c = new ConnectionSegment('name', 'unique-id', 10, -5, validSource, validSink);

            expect(c.validate()).toBe(true);
        });
    });

    describe('invalid', () => {
        test('all fields', () => {
            let c = new ConnectionSegment();
            c.connectionType = Validation.DEFAULT_STR_VALUE;

            expect(c.validate()).toBe(false);
        });

        test('name', () => {
            let c = new ConnectionSegment(Validation.DEFAULT_STR_VALUE, 'unique-id', 25, validSource, validSink);

            expect(c.validate()).toBe(false);
        });

        test('id', () => {
            let c = new ConnectionSegment('name', Validation.DEFAULT_STR_VALUE, 456, 5, validSource, validSink);

            expect(c.validate()).toBe(false);
        });

        test('width', () => {
            let c = new ConnectionSegment('name', 'unique-id', -456, 5, validSource, validSink);

            expect(c.validate()).toBe(false);
        });

        test('depth', () => {
            let c = new ConnectionSegment('name', 'unique-id', 10, 'nan', validSource, validSink);

            expect(c.validate()).toBe(false);
        });

        describe('sourcePoint', () => {
            test('invalid Coord', () => {
                let c = new ConnectionSegment('name', 'unique-id', 10, 5, new Coord(), validSink);

                expect(c.validate()).toBe(false);
            });

            test('null Coord', () => {
                let c = new ConnectionSegment('name', 'unique-id', 10, 5, null, validSink);

                expect(c.validate()).toBe(false);
            });
        });

        describe('sinkPoint', () => {
            test('invalid Coord', () => {
                let c = new ConnectionSegment('name', 'unique-id', 10, 5, validSource, new Coord());

                expect(c.validate()).toBe(false);
            });

            test('null Coord', () => {
                let c = new ConnectionSegment('name', 'unique-id', 10, 5, validSource, null);

                expect(c.validate()).toBe(false);
            });
        });

        test('connectionType', () => {
            let c = new ConnectionSegment('name', 'unique-id', 10, 5, validSource, validSink);
            c.connectionType = 'not-a-channel';

            expect(c.validate()).toBe(false);
        });
    });
});