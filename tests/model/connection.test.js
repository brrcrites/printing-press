const Connection = require('../../model/connection.js');
const Terminal = require('../../model/terminal.js');
const Port = require('../../model/port.js');
const Coord = require('../../model/coord.js');
const Component = require('../../model/component.js');
const ConnectionSegment = require('../../model/connection-segment.js');
const Validation = require('../../utils/validation.js');

//Suppress console logs
console.log = jest.fn();

var layer1 = 'layer-1';
var layer2 = 'layer-2';
var validPort1 = new Port('port-1', layer1, new Coord(0, 0));
var validPort2 = new Port('port-2', layer2, new Coord(0, 5));
var validPort3 = new Port('port-3', layer1, new Coord(0, 10));
var validPort4 = new Port('port-4', layer2, new Coord(0, 15));
var validPort5 = new Port('port-5', layer1, new Coord(0, 20));
var validPort6 = new Port('port-6', layer2, new Coord(5, 0));
var sourceComponent = new Component('source', 'unique-id-1', [layer1, layer2], 10, 20, 'entity', [validPort1, validPort2]);
var sink1Component = new Component('sink1', 'unique-id-2', [layer1, layer2], 10, 20, 'entity', [validPort3, validPort4]);
var sink2Component = new Component('sink2', 'unique-id-3', [layer1, layer2], 10, 20, 'entity', [validPort5, validPort6]);
var source = new Terminal(sourceComponent, validPort1);
var sink1 = new Terminal(sink1Component, validPort3);
var sink2 = new Terminal(sink2Component, validPort6);

var validAbstractConnection = new Connection('name', 'unique-id', layer1, source, [sink1, sink2]);
var validConnSeg1 = new ConnectionSegment('segment-1', 'segment-id-1', 10, 5, new Coord(0, 0), new Coord(5, 5));
var validConnSeg2 = new ConnectionSegment('segment-2', 'segment-id-2', 20, 40, new Coord(5, 5), new Coord(5, 10));

test('initialize Connection: parameters', () => {
    let c = new Connection('name', 'id', 'layer', source, [sink1, sink2]);

    expect(c.name).toBe('name');
    expect(c.id).toBe('id');
    expect(c.layer).toBe('layer');
    expect(c.source).toEqual(source);
    expect(c.sinks).toEqual([sink1, sink2]);
});

test('initialize Connection: default', () => {
    let c = new Connection();

    expect(c.name).toBe(Validation.DEFAULT_STR_VALUE);
    expect(c.id).toBe(Validation.DEFAULT_STR_VALUE);
    expect(c.layer).toBe(Validation.DEFAULT_STR_VALUE);
    expect(c.source).toBe(null);
    expect(c.sinks).toEqual([]);
});

test('modify Connection', () => {
    let c = new Connection();

    c.name = 'name';
    c.id = 'id';
    c.layer = 'layer';
    c.source = source;
    c.sinks = [sink1, sink2];

    expect(c.name).toBe('name');
    expect(c.id).toBe('id');
    expect(c.layer).toBe('layer');
    expect(c.source).toEqual(source);
    expect(c.sinks).toEqual([sink1, sink2]);
});

test('validate Connection: valid values', () => {
    let c = new Connection('name', 'id', 'layer', source, [sink1, sink2]);

    expect(c.validate()).toBe(true);
});

test('validate Connection: invalid values', () => {
    let badCon = new Connection('', '', '', new Terminal(), [new Terminal(), new Terminal()]);

    expect(badCon.validate()).toBe(false);
});

test('validate Connection: invalid Name value', () => {
    let badNameCon = new Connection('', 'id', 'layer', source, [sink1, sink2]);

    expect(badNameCon.validate()).toBe(false);
});

test('validate Connection: invalid ID value', () => {
    let badIDCon = new Connection('name', '', 'layer', source, [sink1, sink2]);

    expect(badIDCon.validate()).toBe(false);
});

test('validate Connection: invalid Layer value', () => {
    let badLayerCon = new Connection('name', 'id', '', source, [sink1, sink2]);

    expect(badLayerCon.validate()).toBe(false);
});

test('validate Connection: invalid Source value', () => {
    let badSourceCon = new Connection('name', 'id', 'layer', new Terminal(), [sink1, sink2]);

    expect(badSourceCon.validate()).toBe(false);
});

test('validate Connection: invalid Sinks value', () => {
    let badSinksCon = new Connection('name', 'id', 'layer', source, [new Terminal(), sink2]);

    expect(badSinksCon.validate()).toBe(false);
});

test('validate Connection: default values', () => {
    let defCon = new Connection();

    expect(defCon.validate()).toBe(false);
});

test('validate Connection: default name value', () => {
    let defNameCon = new Connection(Validation.DEFAULT_STR_VALUE, 'id', 'layer', source, [sink1, sink2]);

    expect(defNameCon.validate()).toBe(false);
});

test('validate Connection: default ID value', () => {
    let defIDCon = new Connection('name', Validation.DEFAULT_STR_VALUE, 'layer', source, [sink1, sink2]);

    expect(defIDCon.validate()).toBe(false);
});

test('validate Connection: default layer value', () => {
    let defLayerCon = new Connection('name', 'id', Validation.DEFAULT_STR_VALUE, source, [sink1, sink2]);

    expect(defLayerCon.validate()).toBe(false);
});

test('validate Connection: default source value', () => {
    let defSourceCon = new Connection('name', 'id', 'layer', null, [sink1, sink2]);

    expect(defSourceCon.validate()).toBe(false);
});

test('validate Connection: default sinks value', () => {
    let defSinksCon = new Connection('name', 'id', 'layer', source);

    expect(defSinksCon.validate()).toBe(false);
});

describe('Connection Feature', () => {
    describe('initialization', () => {
        test('initFeature', () => {
            let c = new Connection();
            c.initFeature('name', 'unique-id', validAbstractConnection, layer1, [validConnSeg1,
                    validConnSeg2]);

            expect(c.name).toBe('name');
            expect(c.id).toBe('unique-id');
            expect(c.connection).toEqual(validAbstractConnection);
            expect(c.layer).toBe(layer1);
            expect(c.connSegments.length).toBe(2);
            expect(c.connSegments[0]).toEqual(validConnSeg1);
            expect(c.connSegments[1]).toEqual(validConnSeg2);
        });

        test('initFeatureExclusives', () => {
            let c = new Connection();
            c.initFeatureExclusives(validAbstractConnection, [validConnSeg1, validConnSeg2]);

            expect(c.name).toBe(Validation.DEFAULT_STR_VALUE);
            expect(c.id).toBe(Validation.DEFAULT_STR_VALUE);
            expect(c.layer).toBe(Validation.DEFAULT_STR_VALUE);
            expect(c.connSegments.length).toBe(2);
            expect(c.connSegments[0]).toEqual(validConnSeg1);
            expect(c.connSegments[1]).toEqual(validConnSeg2);
            expect(c.connection).toEqual(validAbstractConnection);
        });

        test('modify fields', () => {
            let c = new Connection();

            c.name = 'name';
            c.id = 'unique-id';
            c.layer = layer1;
            c.connection = validAbstractConnection;
            c.connSegments = [validConnSeg2, validConnSeg1];

            expect(c.name).toBe('name');
            expect(c.id).toBe('unique-id');
            expect(c.connection).toEqual(validAbstractConnection);
            expect(c.layer).toBe(layer1);
            expect(c.connSegments.length).toBe(2);
            expect(c.connSegments[1]).toEqual(validConnSeg1);
            expect(c.connSegments[0]).toEqual(validConnSeg2);
        });
    });

    describe('validation', () => {
        test('valid', () => {
            let c = new Connection();
            c.initFeature('name', 'unique-id', validAbstractConnection, layer1, [validConnSeg1,
                validConnSeg2]);

            expect(c.validateFeature()).toBe(true);
        });

        describe('invalid', () => {
            test('all fields', () => {
                let c = new Connection();

                expect(c.validateFeature()).toBe(false);
            });

            test('name', () => {
                let c = new Connection();
                c.initFeature(Validation.DEFAULT_STR_VALUE, 'unique-id', validAbstractConnection, layer1,
                        [validConnSeg1, validConnSeg2]);

                expect(c.validateFeature()).toBe(false);
            });

            test('id', () => {
                let c = new Connection();
                c.initFeature('name', Validation.DEFAULT_STR_VALUE, validAbstractConnection, layer1,
                        [validConnSeg1, validConnSeg2]);

                expect(c.validateFeature()).toBe(false);
            });

            describe('connection', () => {
                test('invalid', () => {
                    let c = new Connection();
                    c.initFeature('name', 'unique-id', new Connection(), layer1,
                            [validConnSeg1, validConnSeg2]);

                    expect(c.validateFeature()).toBe(false);
                });

                test('null', () => {
                    let c = new Connection();
                    c.initFeature('name', 'unique-id', null, layer1,
                            [validConnSeg1, validConnSeg2]);

                    expect(c.validateFeature()).toBe(false);
                });
            });

            describe('layer', () => {
                test('invalid string', () => {
                    let c = new Connection();
                    c.initFeature('name', 'unique-id', validAbstractConnection, Validation.DEFAULT_STR_VALUE,
                            [validConnSeg1, validConnSeg2]);

                    expect(c.validateFeature()).toBe(false);
                });

                test('unmatched layer', () => {
                    let c = new Connection();
                    c.initFeature('name', 'unique-id', validAbstractConnection, 'invalid-layer-id',
                            [validConnSeg1, validConnSeg2]);

                    expect(c.validateFeature()).toBe(false);
                });
            });

            describe('connSegments', () => {
                test('empty array', () => {
                    let c = new Connection();
                    c.initFeature('name', 'unique-id', validAbstractConnection, layer1,
                            []);

                    expect(c.validateFeature()).toBe(false);
                });

                test('invalid ConnectionSegment object', () => {
                    let c = new Connection();
                    c.initFeature('name', 'unique-id', validAbstractConnection, layer1,
                            [new ConnectionSegment(), validConnSeg2]);

                    expect(c.validateFeature()).toBe(false);
                });
            });
        });
    });
});
