const Architecture = require('../../model/architecture.js');
const Layer = require('../../model/layer.js');
const Component = require('../../model/component.js');
const Connection = require('../../model/connection.js');
const Port = require('../../model/port.js');
const Coord = require('../../model/coord.js');
const Terminal = require('../../model/terminal.js');
const ConnectionSegment = require('../../model/connection-segment.js');
const ComponentFeature = require('../../model/component-feature.js');
const Validation = require('../../utils/validation.js');

// Suppress console logs
console.log = jest.fn();


var port0_0 = new Port('port-0_0-label', new Coord(0, 0));
var port0_5 = new Port('port-0_5-label', new Coord(0, 5));
var port5_0 = new Port('port-5_0-label', new Coord(5, 0));
var port10_0 = new Port('port-10_0-label', new Coord(10, 0));
var port1_5 = new Port('port-1_5-label', new Coord(1, 5));
var port10_10 = new Port('port-10_10-label', new Coord(10, 10));

var compFeat0_0 = new ComponentFeature(new Coord(0, 0), 10);
var compFeat90_90 = new ComponentFeature(new Coord(90, 90), 2);

var component1 = new Component('comp-1-name', 'unique-id-comp-1', 20, 25, 'entity-1',
        [port0_0, port0_5], compFeat0_0);
var component2 = new Component('comp-2-name', 'unique-id-comp-2', 30, 35, 'entity-2',
        [port5_0, port10_0], compFeat90_90);
var component3 = new Component('comp-3-name', 'unique-id-comp-3', 5, 5, 'entity-3',
        [port1_5]);
var component4 = new Component('comp-4-name', 'unique-id-comp-4', 10, 10, 'entity-4',
        [port10_10]);

var sourceTerm1 = new Terminal(component1, port0_0);
var sourceTerm2 = new Terminal(component2, port5_0);
var sourceTerm3 = new Terminal(component3, port1_5);
var sinkTerm1 = new Terminal(component2, port10_0);
var sinkTerm2 = new Terminal(component1, port0_5);
var sinkTerm3 = new Terminal(component4, port10_10);
var segment1 = new ConnectionSegment('name-1', 'unique-id-seg-1', 5, 10, new Coord(6, 7), new Coord(6, 14));
var segment2 = new ConnectionSegment('name-2', 'unique-id-seg-2', 5, 10, new Coord(6, 14), new Coord(3, 14));
var segment3 = new ConnectionSegment('name-3', 'unique-id-seg-3', 5, 10, new Coord(0, 0), new Coord(1, 1));
var segment4 = new ConnectionSegment('name-4', 'unique-id-seg-4', 5, 10, new Coord(1, 1), new Coord(2, 2));

var connection1 = new Connection('conn-1-name', 'unique-id-conn-1', sourceTerm1, [sinkTerm1],
        [segment1, segment2]);
var connection2 = new Connection('conn-2-name', 'unique-id-conn-2', sourceTerm2, [sinkTerm2],
        [segment3, segment4]);
var connection3 = new Connection('conn-3-name', 'unique-id-conn-3', sourceTerm3, [sinkTerm3]);

var topLayer = new Layer('top-layer', 'unique-top-layer-id', [component1, component2], [connection1, connection2]);
var botLayer = new Layer('bot-layer', 'unique-bot-layer-id', [component3, component4], [connection3]);

describe('initialization', () => {
    describe('constructor', () => {
        test('parameters', () => {
            let a = new Architecture('arch', [topLayer, botLayer], 5, 51);

            expect(a.name).toBe('arch');
            expect(a.layers).toEqual([topLayer, botLayer]);
            expect(a.xSpan).toBe(5);
            expect(a.ySpan).toBe(51);
            expect(a.hasParams).toBe(false);
        });

        test('default', () => {
            let a = new Architecture();

            expect(a.name).toBe(Validation.DEFAULT_STR_VALUE);
            expect(a.layers).toEqual([]);
            expect(a.xSpan).toBe(Validation.DEFAULT_SPAN_VALUE);
            expect(a.ySpan).toBe(Validation.DEFAULT_SPAN_VALUE);
            expect(a.hasParams).toBe(false);
        });
    });

    test('modify fields', () => {
        let a = new Architecture();

        a.name = 'arch';
        a.layers = [topLayer, botLayer];
        a.xSpan = 10;
        a.ySpan = 15;
        a.hasParams = true;

        expect(a.name).toBe('arch');
        expect(a.layers).toEqual([topLayer, botLayer]);
        expect(a.xSpan).toBe(10);
        expect(a.ySpan).toBe(15);
        expect(a.hasParams).toBe(true);
    });
});

describe('determineParams', () => {
    test('does have params', () => {
        let a = new Architecture();

        a.xSpan = 10;
        a.ySpan = 15;
        expect(a.determineParams()).toBe(true);

        expect(a.hasParams).toBe(true);
    });

    test('does not have params', () => {
        let a = new Architecture();

        a.xSpan = -14;
        a.ySpan = -9876543;
        expect(a.determineParams()).toBe(false);

        expect(a.hasParams).toBe(false);
    });
});

describe('validation', () => {
    describe('valid', () => {
        test('with params', () => {
            let a = new Architecture('arch', [topLayer, botLayer], 1000, 1000);

            expect(a.validate()).toBe(true);
        });

        test('without params', () => {
            let a = new Architecture('arch', [topLayer, botLayer]);

            expect(a.validate()).toBe(true);
        });
    });

    describe('invalid', () => {
        test('all fields', () => {
            let a = new Architecture();

            expect(a.validate()).toBe(false);
        });

        test('name', () => {
            let a = new Architecture(Validation.DEFAULT_STR_VALUE, [topLayer, botLayer]);

            expect(a.validate()).toBe(false);
        });

        describe('layers', () => {
            test('empty', () => {
                let a = new Architecture('arch', []);

                expect(a.validate()).toBe(false);
            });

            test('invalid component', () => {
                let a = new Architecture('arch', [new Layer('bad-layer', 'unique-bad-layer-id', [new Component()],
                        [connection1]), botLayer]);

                expect(a.validate()).toBe(false);
            });

            test('invalid connection', () => {
                let a = new Architecture('arch', [topLayer, new Layer('bad-layer', 'unique-bad-layer-id', [component1],
                        [new Connection()])]);

                expect(a.validate()).toBe(false);
            });
        });

        describe('locations', () => {
            test('Component Features', () => {
                let a = new Architecture('tiny-arch', [topLayer, botLayer], 5, 5);

                expect(a.validate()).toBe(false);
            });

            test('Connection Segments', () => {
                let port1_1 = new Port('port', new Coord(1, 1));
                let comp1 = new Component('tiny-component-1', 'unique-tiny-component-id-1', 1, 1, 'entity', [port0_0]);
                let comp2 = new Component('tiny-component-2', 'unique-tiny-component-id-2', 1, 1, 'entity', [port1_1]);
                let source = new Terminal(comp1, port0_0);
                let sink = new Terminal(comp2, port1_1);
                let conn = new Connection('connection', 'unique-connection-id', source, [sink],
                        [new ConnectionSegment('con-seg-name', 'unique-con-seg-id', 5, 10, new Coord(0, 0),
                        new Coord(50, 50))]);
                let a = new Architecture('tiny-arch', [topLayer, new Layer('layer', 'unique-layer-id', [comp1, comp2],
                        [conn])], 5, 5);

                expect(a.validate()).toBe(false);
            });
        });
    });
});
