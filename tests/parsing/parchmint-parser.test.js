const ParchmintParser = require('../../parsing/parchmint-parser.js');
const Layer = require('../../model/layer.js');
const Coord = require('../../model/coord.js');

// Suppress console logs
console.log = jest.fn();

const validParchmintLayers = '"layers": [\n' +
        '    {\n' +
        '        "id": "unique-flow-layer-id-string",\n' +
        '        "name": "flow-layer"\n' +
        '    },\n' +
        '    {\n' +
        '        "id": "unique-control-layer-id-string",\n' +
        '        "name": "control-layer"\n' +
        '    }\n' +
        ']';

const invalidParchmintLayers = '"layers": [\n' +
        '    {\n' +
        '        "id": "unique-flow-layer-id-string",\n' +
        '        "name": ""\n' +
        '    },\n' +
        '    {\n' +
        '        "id": "",\n' +
        '        "name": "control-layer"\n' +
        '    }\n' +
        ']';

const validParchmintComponentFeatures = '"features": [\n' +
        '    {\n' +
        '        "name": "mixer-001",\n' +
        '        "id": "unique-mixer-id-string",\n' +
        '        "layer": "unique-flow-layer-id-string",\n' +
        '        "location": {\n' +
        '            "x": 500,\n' +
        '            "y": 2000\n' +
        '        },\n' +
        '        "x-span": 4500,\n' +
        '        "y-span": 1500,\n' +
        '        "depth": 10\n' +
        '    }\n' +
        ']';

const validParchmintMultipleComponentFeatures = '"features": [\n' +
        '    {\n' +
        '        "name": "mixer-001",\n' +
        '        "id": "unique-mixer-id-string-1",\n' +
        '        "layer": "unique-flow-layer-id-string",\n' +
        '        "location": {\n' +
        '            "x": 500,\n' +
        '            "y": 2000\n' +
        '        },\n' +
        '        "x-span": 4500,\n' +
        '        "y-span": 1500,\n' +
        '        "depth": 10\n' +
        '    },\n' +
        '    {\n' +
        '        "name": "mixer-002",\n' +
        '        "id": "unique-mixer-id-string-2",\n' +
        '        "layer": "unique-flow-layer-id-string",\n' +
        '        "location": {\n' +
        '            "x": 600,\n' +
        '            "y": 3000\n' +
        '        },\n' +
        '        "x-span": 5500,\n' +
        '        "y-span": 2500,\n' +
        '        "depth": 20\n' +
        '    }\n' +
        ']';

const invalidParchmintComponentFeatures = '"features": [\n' +
        '    {\n' +
        '        "name": "",\n' +
        '        "id": "unique-mixer-id-string",\n' +
        '        "layer": "unique-flow-layer-id-string",\n' +
        '        "location": {\n' +
        '            "x": -500,\n' +
        '            "y": 2000\n' +
        '        },\n' +
        '        "x-span": 0,\n' +
        '        "y-span": 1500,\n' +
        '        "depth": 10\n' +
        '    }\n' +
        ']';

const duplicateParchmintComponentFeature = '"features": [\n' +
        '    {\n' +
        '        "name": "mixer-001",\n' +
        '        "id": "unique-mixer-id-string",\n' +
        '        "layer": "unique-flow-layer-id-string",\n' +
        '        "location": {\n' +
        '            "x": 500,\n' +
        '            "y": 2000\n' +
        '        },\n' +
        '        "x-span": 4500,\n' +
        '        "y-span": 1500,\n' +
        '        "depth": 10\n' +
        '    },\n' +
        '    {\n' +
        '        "name": "mixer-002",\n' +
        '        "id": "unique-mixer-id-string",\n' +
        '        "layer": "unique-flow-layer-id-string",\n' +
        '        "location": {\n' +
        '            "x": 1000,\n' +
        '            "y": 2500\n' +
        '        },\n' +
        '        "x-span": 4000,\n' +
        '        "y-span": 1000,\n' +
        '        "depth": 5\n' +
        '    }\n' +
        ']';

const validParchmintComboFeatures = '"features": [\n' +
        '    {\n' +
        '        "name": "mixer-001",\n' +
        '        "id": "unique-mixer-id-string",\n' +
        '        "layer": "unique-flow-layer-id-string",\n' +
        '        "location": {\n' +
        '            "x": 500,\n' +
        '            "y": 2000\n' +
        '        },\n' +
        '        "x-span": 4500,\n' +
        '        "y-span": 1500,\n' +
        '        "depth": 10\n' +
        '    },\n' +
        '    {\n' +
        '        "name": "mixer-flow-connection-segment-001",\n' +
        '        "id": "unique-channel-segment-id",\n' +
        '        "connection": "unique-mixer-flow-connection-id",\n' +
        '        "layer": "unique-flow-layer-id-string",\n' +
        '        "width": 5,\n' +
        '        "depth": 10,\n' +
        '        "source": {\n' +
        '            "x": 500,\n' +
        '            "y": 2750\n' +
        '        },\n' +
        '        "sink": {\n' +
        '            "x": 50,\n' +
        '            "y": 2750\n' +
        '        },\n' +
        '        "type": "channel"\n' +
        '    }\n' +
        ']';

const validSinglePort = '"port":\n' +
        '            {\n' +
        '                "label": "input-port",\n' +
        '                "layer": "unique-flow-layer-id-string",\n' +
        '                "x": 0,\n' +
        '                "y": 750\n' +
        '            }';

const validPorts = '"ports": [\n' +
        '            {\n' +
        '                "label": "input-port",\n' +
        '                "layer": "unique-flow-layer-id-string",\n' +
        '                "x": 0,\n' +
        '                "y": 750\n' +
        '            },\n' +
        '            {\n' +
        '                "label": "output-port",\n' +
        '                "layer": "unique-flow-layer-id-string",\n' +
        '                "x": 4500,\n' +
        '                "y": 750\n' +
        '            },\n' +
        '            {\n' +
        '                "label": "rotary-control-port",\n' +
        '                "layer": "unique-control-layer-id-string",\n' +
        '                "x": 2250,\n' +
        '                "y": 0\n' +
        '            }\n' +
        '        ]';

const duplicateLabelPorts = '"ports": [\n' +
        '            {\n' +
        '                "label": "input-port",\n' +
        '                "layer": "unique-flow-layer-id-string",\n' +
        '                "x": 0,\n' +
        '                "y": 750\n' +
        '            },\n' +
        '            {\n' +
        '                "label": "input-port",\n' +
        '                "layer": "unique-flow-layer-id-string",\n' +
        '                "x": 4500,\n' +
        '                "y": 750\n' +
        '            },\n' +
        '            {\n' +
        '                "label": "rotary-control-port",\n' +
        '                "layer": "unique-control-layer-id-string",\n' +
        '                "x": 2250,\n' +
        '                "y": 0\n' +
        '            }\n' +
        '        ]';

function parseJSONObj(str) {
    return JSON.parse('{' + str + '}');
}

describe('layers', () => {
    test('initialize with initParchKey', () => {
        let pp = new ParchmintParser();
        let l = new Layer();
        let layers = parseJSONObj(validParchmintLayers).layers;

        expect(layers.length).toBe(2);

        pp.initParchKey(l, layers[0]);

        expect(l.name).toBe('flow-layer');
        expect(l.id).toBe('unique-flow-layer-id-string');
    });

    test('valid JSON array obj', () => {
        let pp = new ParchmintParser();
        let l = pp.parseLayersArray(parseJSONObj(validParchmintLayers));

        expect(l.length).toBe(2);

        expect(l[0].name).toBe('flow-layer');
        expect(l[0].id).toBe('unique-flow-layer-id-string');
        expect(l[1].name).toBe('control-layer');
        expect(l[1].id).toBe('unique-control-layer-id-string');
    });

    describe('validation', () => {
        test('invalid name', () => {
            let pp = new ParchmintParser();
            let l = pp.parseLayersArray(parseJSONObj(invalidParchmintLayers));

            expect(l.length).toBe(2);

            expect(l[0].validate()).toBe(false);
        });

        test('invalid id', () => {
            let pp = new ParchmintParser();
            let l = pp.parseLayersArray(parseJSONObj(invalidParchmintLayers));

            expect(l.length).toBe(2);

            expect(l[1].validate()).toBe(false);
        });
    });
});

describe('component features', () => {
    describe('parsing', () => {
        describe('valid', () => {
            describe('only one', () => {
                test ('Component Feature', () => {
                    let pp = new ParchmintParser();
                    let cf;
                    pp.parseComponentFeatures(parseJSONObj(validParchmintComponentFeatures));

                    expect(pp.compFeatures.size).toBe(1);
                    expect(pp.compFeatures.has('unique-mixer-id-string')).toBe(true);
                    expect(pp.valid).toBe(true);

                    cf = pp.compFeatures.get('unique-mixer-id-string');
                    expect(cf.name).toBe('mixer-001');
                    expect(cf.layer).toBe('unique-flow-layer-id-string');
                    expect(cf.xSpan).toBe(4500);
                    expect(cf.ySpan).toBe(1500);
                    expect(cf.location).toEqual(new Coord(500, 2000));
                    expect(cf.depth).toBe(10);
                });
            });

            test('of each Component Feature and Connection Feature', () => {
                let pp = new ParchmintParser();
                let cf;
                pp.parseComponentFeatures(parseJSONObj(validParchmintComboFeatures));

                expect(pp.compFeatures.size).toBe(1);
                expect(pp.compFeatures.has('unique-mixer-id-string')).toBe(true);
                expect(pp.valid).toBe(true);

                cf = pp.compFeatures.get('unique-mixer-id-string');
                expect(cf.name).toBe('mixer-001');
                expect(cf.layer).toBe('unique-flow-layer-id-string');
                expect(cf.xSpan).toBe(4500);
                expect(cf.ySpan).toBe(1500);
                expect(cf.location).toEqual(new Coord(500, 2000));
                expect(cf.depth).toBe(10);
            });
        });

        describe('multiple', () => {
            test('Component Features', () => {
                let pp = new ParchmintParser();
                let cf;
                pp.parseComponentFeatures(parseJSONObj(validParchmintMultipleComponentFeatures));

                expect(pp.compFeatures.size).toBe(2);
                expect(pp.compFeatures.has('unique-mixer-id-string-1')).toBe(true);
                expect(pp.compFeatures.has('unique-mixer-id-string-2')).toBe(true);
                expect(pp.valid).toBe(true);

                cf = pp.compFeatures.get('unique-mixer-id-string-1');
                expect(cf.name).toBe('mixer-001');
                expect(cf.layer).toBe('unique-flow-layer-id-string');
                expect(cf.xSpan).toBe(4500);
                expect(cf.ySpan).toBe(1500);
                expect(cf.location).toEqual(new Coord(500, 2000));
                expect(cf.depth).toBe(10);

                cf = pp.compFeatures.get('unique-mixer-id-string-2');
                expect(cf.name).toBe('mixer-002');
                expect(cf.layer).toBe('unique-flow-layer-id-string');
                expect(cf.xSpan).toBe(5500);
                expect(cf.ySpan).toBe(2500);
                expect(cf.location).toEqual(new Coord(600, 3000));
                expect(cf.depth).toBe(20);
            });
        });

        describe('invalid', () => {
            test('Duplicate Component ID', () => {
                let pp = new ParchmintParser();
                pp.parseComponentFeatures(parseJSONObj(duplicateParchmintComponentFeature));

                expect(pp.compFeatures.size).toBe(1);
                expect(pp.valid).toBe(false);
            });
        });
    });

    describe('validation', () => {
        describe('valid', () => {
            test('single', () => {
                let pp = new ParchmintParser();
                pp.parseComponentFeatures(parseJSONObj(validParchmintComponentFeatures));

                expect(pp.compFeatures.size).toBe(1);
                for (let value of pp.compFeatures.values()) {
                    expect(value.validate()).toBe(true);
                }
            });

            test('multiple', () => {
                let pp = new ParchmintParser();
                pp.parseComponentFeatures(parseJSONObj(validParchmintMultipleComponentFeatures));

                expect(pp.compFeatures.size).toBe(2);
                for (let value of pp.compFeatures.values()) {
                    expect(value.validate()).toBe(true);
                }
            });
        });

        test('invalid', () => {
            let pp = new ParchmintParser();
            pp.parseComponentFeatures(parseJSONObj(invalidParchmintComponentFeatures));

            expect(pp.compFeatures.size).toBe(1);
            for (let value of pp.compFeatures.values()) {
                expect(value.validate()).toBe(false);
            }
        });
    });
});

describe('ports', () => {
    describe('parsing', () => {
        test('single', () => {
            let p = ParchmintParser.parsePort(parseJSONObj(validSinglePort).port);

            expect(p.label).toBe('input-port');
            expect(p.pos).toEqual(new Coord(0, 750));
        });

        test('array', () => {
            let pp = new ParchmintParser();
            let ports = pp.parsePorts(parseJSONObj(validPorts).ports);
            let flow, control;

            expect(pp.valid).toBe(true);
            expect(ports.size).toBe(2);
            expect(ports.has('unique-flow-layer-id-string')).toBe(true);
            expect(ports.has('unique-control-layer-id-string')).toBe(true);

            flow = ports.get('unique-flow-layer-id-string');
            expect(flow.length).toBe(2);
            expect(flow[0].label).toBe('input-port');
            expect(flow[0].pos).toEqual(new Coord(0, 750));
            expect(flow[1].label).toBe('output-port');
            expect(flow[1].pos).toEqual(new Coord(4500, 750));

            control = ports.get('unique-control-layer-id-string');
            expect(control.length).toBe(1);
            expect(control[0].label).toBe('rotary-control-port');
            expect(control[0].pos).toEqual(new Coord(2250, 0));
        });

        test('duplicate labels', () => {
            let pp = new ParchmintParser();
            let ports = pp.parsePorts(parseJSONObj(duplicateLabelPorts).ports);
            let flow, control;

            expect(pp.valid).toBe(false);
            expect(ports.size).toBe(2);
            expect(ports.has('unique-flow-layer-id-string')).toBe(true);
            expect(ports.has('unique-control-layer-id-string')).toBe(true);

            flow = ports.get('unique-flow-layer-id-string');
            expect(flow.length).toBe(2);
            expect(flow[0].label).toBe('input-port');
            expect(flow[0].pos).toEqual(new Coord(0, 750));
            expect(flow[1].label).toBe('input-port');
            expect(flow[1].pos).toEqual(new Coord(4500, 750));

            control = ports.get('unique-control-layer-id-string');
            expect(control.length).toBe(1);
            expect(control[0].label).toBe('rotary-control-port');
            expect(control[0].pos).toEqual(new Coord(2250, 0));
        });
    });
});