const Connection = require('../../model/connection.js');
const Terminal = require('../../model/terminal.js');
const Port = require('../../model/port.js');
const Coord = require('../../model/coord.js');
const Component = require('../../model/component.js');
const ConnectionSegment = require('../../model/connection-segment.js');
const Validation = require('../../utils/validation.js');

//Suppress console logs
console.log = jest.fn();

var validPort1 = new Port('port-1', new Coord(0, 0));
var validPort2 = new Port('port-2', new Coord(0, 5));
var validPort3 = new Port('port-3', new Coord(0, 10));
var validPort4 = new Port('port-4', new Coord(0, 15));
var validPort5 = new Port('port-5', new Coord(0, 20));
var validPort6 = new Port('port-6', new Coord(5, 0));
var sourceComponent = new Component('source', 'unique-id-1', 10, 20, 'entity', [validPort1, validPort2]);
var sink1Component = new Component('sink1', 'unique-id-2', 10, 20, 'entity', [validPort3, validPort4]);
var sink2Component = new Component('sink2', 'unique-id-3', 10, 20, 'entity', [validPort5, validPort6]);
var source = new Terminal(sourceComponent, validPort1);
var sink1 = new Terminal(sink1Component, validPort3);
var sink2 = new Terminal(sink2Component, validPort6);
var segment1 = new ConnectionSegment('segment-2', 'segment-id-1', 10, 5, new Coord(0, 0), new Coord(5, 5));
var segment2 = new ConnectionSegment('segment-1', 'segment-id-2', 20, 40, new Coord(5, 5), new Coord(5, 10));

describe('initialization', () => {
    describe('construction', () => {
        test('parameters', () => {
            let c = new Connection('name', 'id', source, [sink1, sink2], [segment1, segment2]);

            expect(c.name).toBe('name');
            expect(c.id).toBe('id');
            expect(c.source).toEqual(source);
            expect(c.sinks).toEqual([sink1, sink2]);
            expect(c.segments).toEqual([segment1, segment2]);
        });

        test('initialize Connection: default', () => {
            let c = new Connection();

            expect(c.name).toBe(Validation.DEFAULT_STR_VALUE);
            expect(c.id).toBe(Validation.DEFAULT_STR_VALUE);
            expect(c.source).toBe(null);
            expect(c.sinks).toEqual([]);
            expect(c.segments).toEqual([])
        });
    });

    test('modify Connection', () => {
        let c = new Connection();

        c.name = 'name';
        c.id = 'id';
        c.source = source;
        c.sinks = [sink1, sink2];
        c.segments = [segment1, segment2];

        expect(c.name).toBe('name');
        expect(c.id).toBe('id');
        expect(c.source).toEqual(source);
        expect(c.sinks).toEqual([sink1, sink2]);
        expect(c.segments).toEqual([segment1, segment2]);
    });
});

describe('validation', () => {
    describe('valid', () => {
        test('all fields', () => {
            let c = new Connection('name', 'id', source, [sink1, sink2], [segment1, segment2]);

            expect(c.validate()).toBe(true);
        });
        
        test('empty segments', () => {
            let c = new Connection('name', 'id', source, [sink1, sink2]);

            expect(c.validate()).toBe(true);
        });
    });
    
    describe('invalid', () => {
        test('all fields', () => {
            let badCon = new Connection('', '', new Terminal(), [new Terminal(), new Terminal()]);

            expect(badCon.validate()).toBe(false);
        });

        test('name', () => {
            let badNameCon = new Connection('', 'id', source, [sink1, sink2], [segment1, segment2]) ;

            expect(badNameCon.validate()).toBe(false);
        });

        test('ID', () => {
            let badIDCon = new Connection('name', '', source, [sink1, sink2], [segment1, segment2]);

            expect(badIDCon.validate()).toBe(false);
        });

        test('source', () => {
            let badSourceCon = new Connection('name', 'id', new Terminal(), [sink1, sink2], [segment1, segment2]);

            expect(badSourceCon.validate()).toBe(false);
        });

        test('sinks', () => {
            let badSinksCon = new Connection('name', 'id', source, [new Terminal(), sink2], [segment1, segment2]);

            expect(badSinksCon.validate()).toBe(false);
        });

    });

    describe('defaults', () => {
        test('all fields', () => {
            let defCon = new Connection();

            expect(defCon.validate()).toBe(false);
        });

        test('name', () => {
            let defNameCon = new Connection(Validation.DEFAULT_STR_VALUE, 'id', source, [sink1, sink2], [segment1, segment2]);

            expect(defNameCon.validate()).toBe(false);
        });

        test('ID', () => {
            let defIDCon = new Connection('name', Validation.DEFAULT_STR_VALUE, source, [sink1, sink2], [segment1, segment2]);

            expect(defIDCon.validate()).toBe(false);
        });

        test('source', () => {
            let defSourceCon = new Connection('name', 'id', null, [sink1, sink2], [segment1, segment2]);

            expect(defSourceCon.validate()).toBe(false);
        });

        test('sinks', () => {
            let defSinksCon = new Connection('name', 'id', source, [], [segment1, segment2]);

            expect(defSinksCon.validate()).toBe(false);
        });
    });
});

