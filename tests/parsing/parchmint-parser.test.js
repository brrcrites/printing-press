const ParchmintParser = require('../../parsing/parchmint-parser.js');
const Layer = require('../../model/layer.js');
const Coord = require('../../model/coord.js');
const Terminal = require('../../model/terminal.js');
const Validation = require('../../utils/validation.js');

// Suppress console logs
console.log = jest.fn();

const flowLayerID = 'unique-flow-layer-id-string';
const controlLayerID = 'unique-control-layer-id-string';
const componentID = 'unique-mixer-id-string';
const connectionID = 'unique-mixer-flow-connection-id';
const connFeatID = 'unique-channel-segment-id';

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
        expect(l.id).toBe(flowLayerID);
    });

    test('valid JSON array obj', () => {
        let pp = new ParchmintParser();
        let l = pp.parseLayersArray(parseJSONObj(validParchmintLayers));

        expect(l.length).toBe(2);

        expect(l[0].name).toBe('flow-layer');
        expect(l[0].id).toBe(flowLayerID);
        expect(l[1].name).toBe('control-layer');
        expect(l[1].id).toBe(controlLayerID);
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

describe('components', () => {
    describe('single', () => {
        test('with features', () => {
            let pp = new ParchmintParser();
            let comps, flow, control;
            let parch = validParchmintComponents + ', ' + validParchmintMultipleComponentFeaturesSameCompDiffLayer;

            pp.parseComponentFeatures(parseJSONObj(parch));
            pp.parseComponents(parseJSONObj(parch));
            comps = pp.components;

            expect(pp.valid).toBe(true);
            // Ensure the Components were placed where they should be
            expect(comps.size).toBe(2);
            expect(comps.has(flowLayerID)).toBe(true);
            expect(comps.has(controlLayerID)).toBe(true);

            // Ensure we got the component features too
            expect(pp.compFeatures.size).toBe(2);
            expect(pp.compFeatures.has(componentID + '_' + flowLayerID)).toBe(true);
            expect(pp.compFeatures.has(componentID + '_' + controlLayerID)).toBe(true);

            // Ensure all values were set correctly
            flow = comps.get(flowLayerID);
            expect(flow.length).toBe(1);
            expect(flow[0].name).toBe('mixer-001');
            expect(flow[0].id).toBe(componentID);
            expect(flow[0].xSpan).toBe(4500);
            expect(flow[0].ySpan).toBe(1500);
            expect(flow[0].entity).toBe('rotary-mixer');
            expect(flow[0].ports.length).toBe(2);
            expect(flow[0].feature).toBeTruthy();

            control = comps.get(controlLayerID);
            expect(control.length).toBe(1);
            expect(control[0].name).toBe('mixer-001');
            expect(control[0].id).toBe(componentID);
            expect(control[0].xSpan).toBe(4500);
            expect(control[0].ySpan).toBe(1500);
            expect(control[0].entity).toBe('rotary-mixer');
            expect(control[0].ports.length).toBe(1);
            expect(control[0].feature).toBeTruthy();
        });

        test('without features', () => {
            let pp = new ParchmintParser();
            let comps, flow, control;
            let parch = validParchmintComponents + ',' + validParchmintEmptyFeatures;

            pp.parseComponentFeatures(parseJSONObj(parch));
            pp.parseComponents(parseJSONObj(parch));
            comps = pp.components;

            // Ensure the parser is as we expect
            expect(pp.valid).toBe(true);
            expect(comps.size).toBe(2);
            expect(comps.has(flowLayerID)).toBe(true);
            expect(comps.has(controlLayerID)).toBe(true);

            // Ensure we got no features
            expect(pp.compFeatures.size).toBe(0);
            expect(pp.compFeatures.has(componentID + '_' + flowLayerID)).toBe(false);

            // Ensure all values were set correctly
            flow = comps.get(flowLayerID);
            expect(flow.length).toBe(1);
            expect(flow[0].name).toBe('mixer-001');
            expect(flow[0].id).toBe(componentID);
            expect(flow[0].xSpan).toBe(4500);
            expect(flow[0].ySpan).toBe(1500);
            expect(flow[0].entity).toBe('rotary-mixer');
            expect(flow[0].ports.length).toBe(2);
            expect(flow[0].feature).toBeFalsy();

            control = comps.get(controlLayerID);
            expect(control.length).toBe(1);
            expect(control[0].name).toBe('mixer-001');
            expect(control[0].id).toBe(componentID);
            expect(control[0].xSpan).toBe(4500);
            expect(control[0].ySpan).toBe(1500);
            expect(control[0].entity).toBe('rotary-mixer');
            expect(control[0].ports.length).toBe(1);
            expect(control[0].feature).toBeFalsy();
        });
    });

    test('multiple', () => {
        let pp = new ParchmintParser();
        let comps;
        let parch = validParchmintMultipleComponentFeaturesDiffComp + ', ' + validParchmintMultipleComponents;

        pp.parseComponentFeatures(parseJSONObj(parch));
        pp.parseComponents(parseJSONObj(parch));
        comps = pp.components;

        // Ensure parsing went the way it should: valid, correct components in correct layers, etc.
        expect(pp.valid).toBe(true);
        expect(comps.size).toBe(2);
        expect(comps.has(flowLayerID)).toBe(true);
        expect(comps.has(controlLayerID)).toBe(true);

        // Ensure all comp features are as we expect
        expect(pp.compFeatures.size).toBe(2);
        expect(pp.compFeatures.has(componentID + '-1_' + flowLayerID)).toBe(true);
        expect(pp.compFeatures.has(componentID + '-2_' + flowLayerID)).toBe(true);

        // Ensure all components are as we expect
        expect(comps.get(flowLayerID).length).toBe(2);
        expect(comps.get(controlLayerID).length).toBe(2);
    });

    test('duplicate IDs', () => {
        let pp = new ParchmintParser();
        pp.parseComponents(parseJSONObj(duplicateIDParchmintComponents));

        // Ensure our parser is the way we expect it: invalid, no features, etc.
        expect(pp.valid).toBe(false);
        expect(pp.components.size).toBe(2);
        expect(pp.components.has(flowLayerID));
        expect(pp.components.has(controlLayerID));
        expect(pp.compFeatures.size).toBe(0);

        // Even though duplicate IDs are invalid, we still parse them just in case, so we need to check whether they
        // were actually added to the arrays.
        expect(pp.components.get(flowLayerID).length).toBe(1);
        expect(pp.components.get(controlLayerID).length).toBe(1);

    });
});

describe('connections', () => {
    describe('valid', () => {
        test('single', () => {
            let pp = new ParchmintParser();
            let parch = validParchmintConnections + ', ' + validParchmintComponents + ', ' +
                    validParchmintConnectionFeatures;
            let con;
            pp.parseComponentFeatures(parseJSONObj(parch));
            pp.parseComponents(parseJSONObj(parch));
            pp.parseConnectionFeatures(parseJSONObj(parch));
            pp.parseConnections(parseJSONObj(parch));

            expect(pp.valid).toBe(true);
            expect(pp.connections.size).toBe(1);
            expect(pp.connections.has(flowLayerID)).toBe(true);
            expect(pp.connections.get(flowLayerID).length).toBe(1);

            con = pp.connections.get(flowLayerID)[0];

            expect(con.name).toBe('mixer-flow-connection');
            expect(con.id).toBe(connectionID);
            expect(con.source).not.toEqual(new Terminal());
            expect(con.source.component.id).toBe(componentID);
            expect(con.source.port.label).toBe('output-port');
            expect(con.sinks.length).toBe(1);
            expect(con.sinks[0]).not.toEqual(new Terminal());
            expect(con.sinks[0].component.id).toBe(componentID);
            expect(con.sinks[0].port.label).toBe('input-port');
        });

        describe('multiple', () => {
            test('same layer', () => {
                let pp = new ParchmintParser();
                let parch = validParchmintMultipleConnectionsSameLayer + ', ' + validParchmintMultipleComponents + ', '
                        + validParchmintConnectionFeatures;
                let con;
                pp.parseComponents(parseJSONObj(parch));
                pp.parseConnectionFeatures(parseJSONObj(parch));
                pp.parseConnections(parseJSONObj(parch));

                expect(pp.valid).toBe(true);
                expect(pp.connections.size).toBe(1);
                expect(pp.connections.has(flowLayerID)).toBe(true);
                expect(pp.connections.get(flowLayerID).length).toBe(2);

                con = pp.connections.get(flowLayerID);

                expect(con[0].name).toBe('mixer-flow-connection-1');
                expect(con[0].id).toBe(connectionID + '-1');
                expect(con[0].source).not.toEqual(new Terminal());
                expect(con[0].source.component.id).toBe(componentID + '-1');
                expect(con[0].source.port.label).toBe('output-port');
                expect(con[0].sinks.length).toBe(1);
                expect(con[0].sinks[0]).not.toEqual(new Terminal());
                expect(con[0].sinks[0].component.id).toBe(componentID + '-2');
                expect(con[0].sinks[0].port.label).toBe('input-port');

                expect(con[1].name).toBe('mixer-flow-connection-2');
                expect(con[1].id).toBe(connectionID + '-2');
                expect(con[1].source).not.toEqual(new Terminal());
                expect(con[1].source.component.id).toBe(componentID + '-2');
                expect(con[1].source.port.label).toBe('output-port');
                expect(con[1].sinks.length).toBe(1);
                expect(con[1].sinks[0]).not.toEqual(new Terminal());
                expect(con[1].sinks[0].component.id).toBe(componentID + '-1');
                expect(con[1].sinks[0].port.label).toBe('input-port');
            });
        });

        test('different layer', () => {
            let pp = new ParchmintParser();
            let parch = validParchmintConnectionFeatures + ', ' + validParchmintMultipleConnectionsDiffLayer + ', ' +
                    validParchmintMultipleComponents;
            let con;
            pp.parseComponents(parseJSONObj(parch));
            pp.parseConnectionFeatures(parseJSONObj(parch));
            pp.parseConnections(parseJSONObj(parch));

            expect(pp.valid).toBe(true);
            expect(pp.connections.size).toBe(2);
            expect(pp.connections.has(flowLayerID)).toBe(true);
            expect(pp.connections.has(controlLayerID)).toBe(true);

            con = pp.connections.get(flowLayerID);
            expect(con.length).toBe(1);

            expect(con[0].name).toBe('mixer-flow-connection-1');
            expect(con[0].id).toBe(connectionID + '-1');
            expect(con[0].source).not.toEqual(new Terminal());
            expect(con[0].source.component.id).toBe(componentID + '-1');
            expect(con[0].source.port.label).toBe('output-port');
            expect(con[0].sinks.length).toBe(1);
            expect(con[0].sinks[0]).not.toEqual(new Terminal());
            expect(con[0].sinks[0].component.id).toBe(componentID + '-2');
            expect(con[0].sinks[0].port.label).toBe('input-port');

            con = pp.connections.get(controlLayerID);
            expect(con.length).toBe(1);

            expect(con[0].name).toBe('mixer-flow-connection-2');
            expect(con[0].id).toBe(connectionID + '-2');
            expect(con[0].source).not.toEqual(new Terminal());
            expect(con[0].source.component.id).toBe(componentID + '-1');
            expect(con[0].source.port.label).toBe('rotary-control-port');
            expect(con[0].sinks.length).toBe(1);
            expect(con[0].sinks[0]).not.toEqual(new Terminal());
            expect(con[0].sinks[0].component.id).toBe(componentID + '-2');
            expect(con[0].sinks[0].port.label).toBe('rotary-control-port');
        });
    });

    test('duplicate IDs', () => {
        let pp = new ParchmintParser();
        let parch = duplicateIDParchmintConnections + ', ' + validParchmintMultipleComponents + ', ' +
                validParchmintConnectionFeatures;

        pp.parseComponents(parseJSONObj(parch));
        pp.parseConnectionFeatures(parseJSONObj(parch));
        pp.parseConnections(parseJSONObj(parch));

        expect(pp.valid).toBe(false);
        expect(pp.connections.has(flowLayerID)).toBe(true);
        expect(pp.connections.get(flowLayerID).length).toBe(1);
    });
});

describe('component features', () => {
    describe('parsing', () => {
        describe('valid', () => {
            describe('only one', () => {
                test ('Component Feature', () => {
                    let pp = new ParchmintParser();
                    let cf;
                    let key = componentID + '_' + flowLayerID;
                    pp.parseComponentFeatures(parseJSONObj(validParchmintComponentFeatures));

                    expect(pp.compFeatures.size).toBe(1);
                    expect(pp.compFeatures.has(key)).toBe(true);
                    expect(pp.valid).toBe(true);

                    cf = pp.compFeatures.get(key);
                    expect(cf.name).toBe('mixer-001');
                    expect(cf.layer).toBe(flowLayerID);
                    expect(cf.xSpan).toBe(4500);
                    expect(cf.ySpan).toBe(1500);
                    expect(cf.location).toEqual(new Coord(500, 2000));
                    expect(cf.depth).toBe(10);
                });
            });

            test('of each Component Feature and Connection Feature', () => {
                let pp = new ParchmintParser();
                let cf;
                let key = componentID + '_' + flowLayerID;
                pp.parseComponentFeatures(parseJSONObj(validParchmintComboFeatures));

                expect(pp.compFeatures.size).toBe(1);
                expect(pp.compFeatures.has(key)).toBe(true);
                expect(pp.valid).toBe(true);

                cf = pp.compFeatures.get(key);
                expect(cf.name).toBe('mixer-001');
                expect(cf.layer).toBe(flowLayerID);
                expect(cf.xSpan).toBe(4500);
                expect(cf.ySpan).toBe(1500);
                expect(cf.location).toEqual(new Coord(500, 2000));
                expect(cf.depth).toBe(10);
            });
        });

        describe('multiple', () => {
            test('different components', () => {
                let pp = new ParchmintParser();
                let cf;
                pp.parseComponentFeatures(parseJSONObj(validParchmintMultipleComponentFeaturesDiffComp));

                expect(pp.compFeatures.size).toBe(2);
                expect(pp.compFeatures.has(componentID + '-1_' + flowLayerID)).toBe(true);
                expect(pp.compFeatures.has(componentID + '-2_' + flowLayerID)).toBe(true);
                expect(pp.valid).toBe(true);

                cf = pp.compFeatures.get(componentID + '-1_' + flowLayerID);
                expect(cf.name).toBe('mixer-001');
                expect(cf.layer).toBe(flowLayerID);
                expect(cf.xSpan).toBe(4500);
                expect(cf.ySpan).toBe(1500);
                expect(cf.location).toEqual(new Coord(500, 2000));
                expect(cf.depth).toBe(10);

                cf = pp.compFeatures.get(componentID + '-2_' + flowLayerID);
                expect(cf.name).toBe('mixer-002');
                expect(cf.layer).toBe(flowLayerID);
                expect(cf.xSpan).toBe(5500);
                expect(cf.ySpan).toBe(2500);
                expect(cf.location).toEqual(new Coord(600, 3000));
                expect(cf.depth).toBe(20);
            });

            test('same component different layers', () => {
                let pp = new ParchmintParser();
                let cf;
                pp.parseComponentFeatures(parseJSONObj(validParchmintMultipleComponentFeaturesSameCompDiffLayer));

                expect(pp.compFeatures.size).toBe(2);
                expect(pp.compFeatures.has(componentID + '_' + flowLayerID)).toBe(true);
                expect(pp.compFeatures.has(componentID + '_' + controlLayerID)).toBe(true);
                expect(pp.valid).toBe(true);

                cf = pp.compFeatures.get(componentID + '_' + flowLayerID);
                expect(cf.name).toBe('mixer-001');
                expect(cf.layer).toBe('unique-flow-layer-id-string');
                expect(cf.xSpan).toBe(4500);
                expect(cf.ySpan).toBe(1500);
                expect(cf.location).toEqual(new Coord(500, 2000));
                expect(cf.depth).toBe(10);

                cf = pp.compFeatures.get(componentID + '_' + controlLayerID);
                expect(cf.name).toBe('mixer-001');
                expect(cf.layer).toBe('unique-control-layer-id-string');
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
                pp.parseComponentFeatures(parseJSONObj(validParchmintMultipleComponentFeaturesDiffComp));

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

describe('connection-features', () => {
    describe('one Connection', () => {
        test('single', () => {
            let pp = new ParchmintParser();
            let conn, feat;
            pp.parseConnectionFeatures(parseJSONObj(validParchmintConnectionFeatures));
            conn = pp.connFeatures;

            // Ensure the Parser is the way we expect it: valid, connection feature map has 1, etc.
            expect(pp.valid).toBe(true);
            expect(conn.size).toBe(1);
            expect(conn.has(connectionID)).toBe(true);
            expect(conn.get(connectionID).length).toBe(1);

            // Ensure the connection feature is generated correctly
            feat = conn.get(connectionID)[0];
            expect(feat.name).toBe('mixer-flow-connection-segment-001');
            expect(feat.id).toBe(connFeatID);
            expect(feat.width).toBe(5);
            expect(feat.depth).toBe(10);
            expect(feat.sourcePoint).toEqual(new Coord(500, 2750));
            expect(feat.sinkPoint).toEqual(new Coord(50, 2750));
            expect(feat.connectionType).toBe(Validation.DEFAULT_CON_TYPE);  // We don't ever touch this, but it can't
                                                                            // hurt to check it anyway.
        });

        test('multiple', () => {
            let pp = new ParchmintParser();
            let conn, feat;
            pp.parseConnectionFeatures(parseJSONObj(validParchmintMultipleConnectionFeaturesOneConnection));
            conn = pp.connFeatures;

            // Ensure the Parser is in order: valid, 1 key-value pair in the connection feature map, etc.
            expect(pp.valid).toBe(true);
            expect(conn.size).toBe(1);
            expect(conn.has(connectionID));
            expect(conn.get(connectionID).length).toBe(2);

            // Now ensure the values were added correctly to the Conn Feat map
            feat = conn.get(connectionID);
            expect(feat[0].name).toBe('mixer-flow-connection-segment-001');
            expect(feat[0].id).toBe(connFeatID + '-1');
            expect(feat[0].width).toBe(5);
            expect(feat[0].depth).toBe(10);
            expect(feat[0].sourcePoint).toEqual(new Coord(500, 2750));
            expect(feat[0].sinkPoint).toEqual(new Coord(50, 2750));
            expect(feat[0].connectionType).toBe(Validation.DEFAULT_CON_TYPE);

            expect(feat[1].name).toBe('mixer-flow-connection-segment-002');
            expect(feat[1].id).toBe(connFeatID + '-2');
            expect(feat[1].width).toBe(15);
            expect(feat[1].depth).toBe(20);
            expect(feat[1].sourcePoint).toEqual(new Coord(50, 2750));
            expect(feat[1].sinkPoint).toEqual(new Coord(60, 3750));
            expect(feat[1].connectionType).toBe(Validation.DEFAULT_CON_TYPE);
        });
    });

    test('multiple connections', () => {
        let pp = new ParchmintParser();
        let conn;
        pp.parseConnectionFeatures(parseJSONObj(validParchmintMultipleConnectionFeaturesTwoConnections));
        conn = pp.connFeatures;

        // We've already tested that the values are correct, so let's just make sure that we've got two key-value
        // pairs and that they're the ones we expect.
        expect(pp.valid).toBe(true);
        expect(conn.size).toBe(2);
        expect(conn.has(connectionID + '-1'));
        expect(conn.has(connectionID + '-2'));
    });

    test('duplicate IDs', () => {
        let pp = new ParchmintParser();
        let conn;
        pp.parseConnectionFeatures(parseJSONObj(duplicateIDParchmintConnectionFeatures));
        conn = pp.connFeatures;

        expect(pp.valid).toBe(false);
        expect(conn.size).toBe(1);
        expect(conn.has(connectionID));
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
            expect(ports.has(flowLayerID)).toBe(true);
            expect(ports.has(controlLayerID)).toBe(true);

            flow = ports.get(flowLayerID);
            expect(flow.length).toBe(2);
            expect(flow[0].label).toBe('input-port');
            expect(flow[0].pos).toEqual(new Coord(0, 750));
            expect(flow[1].label).toBe('output-port');
            expect(flow[1].pos).toEqual(new Coord(4500, 750));

            control = ports.get(controlLayerID);
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
            expect(ports.has(flowLayerID)).toBe(true);
            expect(ports.has(controlLayerID)).toBe(true);

            flow = ports.get(flowLayerID);
            expect(flow.length).toBe(2);
            expect(flow[0].label).toBe('input-port');
            expect(flow[0].pos).toEqual(new Coord(0, 750));
            expect(flow[1].label).toBe('input-port');
            expect(flow[1].pos).toEqual(new Coord(4500, 750));

            control = ports.get(controlLayerID);
            expect(control.length).toBe(1);
            expect(control[0].label).toBe('rotary-control-port');
            expect(control[0].pos).toEqual(new Coord(2250, 0));
        });
    });
});

describe('terminals', () => {
    describe('valid', () => {
        test('single', () => {
            let pp = new ParchmintParser();
            let parch = validSingleTerminal + ', ' + validParchmintComponentFeatures + ', ' + validParchmintComponents;
            let term, comp;

            pp.parseComponentFeatures(parseJSONObj(parch));
            pp.parseComponents(parseJSONObj(parch));
            term = pp.parseTerminal(parseJSONObj(parch).terminal, flowLayerID);
            comp = pp.components.get(flowLayerID)[0];

            expect(pp.valid).toBe(true);
            expect(term.component).toBeTruthy();
            expect(term.component).toEqual(comp);
            expect(term.port).toBeTruthy();
            expect(term.port).toEqual(comp.ports[0]);
        });

        describe('multiple', () => {
            test('one component', () => {
                let pp = new ParchmintParser();
                let parch = validMultipleTerminalsOneComponent + ', ' + validParchmintComponents + ', '
                        + validParchmintComponentFeatures;
                let terms, comp;
                pp.parseComponentFeatures(parseJSONObj(parch));
                pp.parseComponents(parseJSONObj(parch));
                terms = pp.parseTerminals(parseJSONObj(parch).terminals, flowLayerID);
                comp = pp.components.get(flowLayerID)[0];

                expect(pp.valid).toBe(true);
                expect(terms.length).toBe(2);

                expect(terms[0].component).toBeTruthy();
                expect(terms[0].component).toEqual(comp);
                expect(terms[0].port).toBeTruthy();
                expect(terms[0].port).toEqual(comp.ports[0]);

                expect(terms[1].component).toBeTruthy();
                expect(terms[1].component).toEqual(comp);
                expect(terms[1].port).toBeTruthy();
                expect(terms[1].port).toEqual(comp.ports[1]);
            });

            test('two components', () => {
                let pp = new ParchmintParser();
                let parch = validMultipleTerminalsTwoComponents + ', ' + validParchmintMultipleComponents
                        + ', ' + validParchmintMultipleComponentFeaturesDiffComp;
                let terms, comps;

                pp.parseComponentFeatures(parseJSONObj(parch));
                pp.parseComponents(parseJSONObj(parch));
                terms = pp.parseTerminals(parseJSONObj(parch).terminals, flowLayerID);
                comps = pp.components.get(flowLayerID);

                expect(pp.valid).toBe(true);
                expect(terms.length).toBe(2);

                expect(terms[0].component).toBeTruthy();
                expect(terms[0].component).toEqual(comps[0]);
                expect(terms[0].port).toBeTruthy();
                expect(terms[0].port).toEqual(comps[0].ports[0]);

                expect(terms[1].component).toBeTruthy();
                expect(terms[1].component).toEqual(comps[1]);
                expect(terms[1].port).toBeTruthy();
                expect(terms[1].port).toEqual(comps[1].ports[1]);
            });
        });
    });

    describe('invalid', () => {
        test('component', () => {
            let pp = new ParchmintParser();
            let parch = invalidComponentTerminal + ', ' + validParchmintComponents
                    + ', ' + validParchmintComponentFeatures;
            let term;

            pp.parseComponentFeatures(parseJSONObj(parch));
            pp.parseComponents(parseJSONObj(parch));
            term = pp.parseTerminal(parseJSONObj(parch).terminal, flowLayerID);

            expect(pp.valid).toBe(false);
            expect(term.component).toBeFalsy();
            expect(term.port).toBeFalsy();
        });

        test('port', () => {
            let pp = new ParchmintParser();
            let parch = invalidPortTerminal + ', ' + validParchmintComponents
                    + ', ' + validParchmintComponentFeatures;
            let term;

            pp.parseComponentFeatures(parseJSONObj(parch));
            pp.parseComponents(parseJSONObj(parch));
            term = pp.parseTerminal(parseJSONObj(parch).terminal, flowLayerID);

            expect(pp.valid).toBe(false);
            expect(term.component).toBeTruthy();
            expect(term.port).toBeFalsy();
        });
    });
});

//-- Begin Parchmint JSON strings --\\
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

const validParchmintComponents = '"components": [\n' +
        '    {\n' +
        '        "id": "unique-mixer-id-string",\n' +
        '        "name": "mixer-001",\n' +
        '        "layers": [\n' +
        '            "unique-flow-layer-id-string",\n' +
        '            "unique-control-layer-id-string"\n' +
        '        ],\n' +
        '        "x-span": 4500,\n' +
        '        "y-span": 1500,\n' +
        '        "entity": "rotary-mixer",\n' +
        '        "ports": [\n' +
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
        '        ]\n' +
        '    }\n' +
        ']';

const validParchmintMultipleComponents = '"components": [\n' +
        '    {\n' +
        '        "id": "unique-mixer-id-string-1",\n' +
        '        "name": "mixer-001",\n' +
        '        "layers": [\n' +
        '            "unique-flow-layer-id-string",\n' +
        '            "unique-control-layer-id-string"\n' +
        '        ],\n' +
        '        "x-span": 4500,\n' +
        '        "y-span": 1500,\n' +
        '        "entity": "rotary-mixer",\n' +
        '        "ports": [\n' +
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
        '        ]\n' +
        '    },\n' +
        '    {\n' +
        '        "id": "unique-mixer-id-string-2",\n' +
        '        "name": "mixer-002",\n' +
        '        "layers": [\n' +
        '            "unique-flow-layer-id-string",\n' +
        '            "unique-control-layer-id-string"\n' +
        '        ],\n' +
        '        "x-span": 5500,\n' +
        '        "y-span": 2500,\n' +
        '        "entity": "rotary-mixer",\n' +
        '        "ports": [\n' +
        '            {\n' +
        '                "label": "input-port",\n' +
        '                "layer": "unique-flow-layer-id-string",\n' +
        '                "x": 10,\n' +
        '                "y": 2500\n' +
        '            },\n' +
        '            {\n' +
        '                "label": "output-port",\n' +
        '                "layer": "unique-flow-layer-id-string",\n' +
        '                "x": 5500,\n' +
        '                "y": 1750\n' +
        '            },\n' +
        '            {\n' +
        '                "label": "rotary-control-port",\n' +
        '                "layer": "unique-control-layer-id-string",\n' +
        '                "x": 10,\n' +
        '                "y": 2500\n' +
        '            }\n' +
        '        ]\n' +
        '    }\n' +
        ']';

const duplicateIDParchmintComponents = '"components": [\n' +
        '    {\n' +
        '        "id": "unique-mixer-id-string",\n' +
        '        "name": "mixer-001",\n' +
        '        "layers": [\n' +
        '            "unique-flow-layer-id-string",\n' +
        '            "unique-control-layer-id-string"\n' +
        '        ],\n' +
        '        "x-span": 4500,\n' +
        '        "y-span": 1500,\n' +
        '        "entity": "rotary-mixer",\n' +
        '        "ports": [\n' +
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
        '        ]\n' +
        '    },\n' +
        '    {\n' +
        '        "id": "unique-mixer-id-string",\n' +
        '        "name": "mixer-002",\n' +
        '        "layers": [\n' +
        '            "unique-flow-layer-id-string",\n' +
        '            "unique-control-layer-id-string"\n' +
        '        ],\n' +
        '        "x-span": 5500,\n' +
        '        "y-span": 2500,\n' +
        '        "entity": "rotary-mixer",\n' +
        '        "ports": [\n' +
        '            {\n' +
        '                "label": "input-port",\n' +
        '                "layer": "unique-flow-layer-id-string",\n' +
        '                "x": 10,\n' +
        '                "y": 2500\n' +
        '            },\n' +
        '            {\n' +
        '                "label": "output-port",\n' +
        '                "layer": "unique-flow-layer-id-string",\n' +
        '                "x": 5500,\n' +
        '                "y": 1750\n' +
        '            },\n' +
        '            {\n' +
        '                "label": "rotary-control-port",\n' +
        '                "layer": "unique-control-layer-id-string",\n' +
        '                "x": 10,\n' +
        '                "y": 2500\n' +
        '            }\n' +
        '        ]\n' +
        '    }\n' +
        ']';

const validParchmintConnections = '"connections": [\n' +
        '    {\n' +
        '        "id": "unique-mixer-flow-connection-id",\n' +
        '        "name": "mixer-flow-connection",\n' +
        '        "layer": "unique-flow-layer-id-string",\n' +
        '        "source": {\n' +
        '            "component": "unique-mixer-id-string",\n' +
        '            "port": "output-port"\n' +
        '        },\n' +
        '        "sinks": [\n' +
        '            {\n' +
        '               "component": "unique-mixer-id-string",\n' +
        '               "port": "input-port"\n' +
        '            }\n' +
        '        ]\n' +
        '    }\n' +
        ']';

const validParchmintMultipleConnectionsSameLayer = '"connections": [\n' +
        '    {\n' +
        '        "id": "unique-mixer-flow-connection-id-1",\n' +
        '        "name": "mixer-flow-connection-1",\n' +
        '        "layer": "unique-flow-layer-id-string",\n' +
        '        "source": {\n' +
        '            "component": "unique-mixer-id-string-1",\n' +
        '            "port": "output-port"\n' +
        '        },\n' +
        '        "sinks": [\n' +
        '            {\n' +
        '               "component": "unique-mixer-id-string-2",\n' +
        '               "port": "input-port"\n' +
        '            }\n' +
        '        ]\n' +
        '    },\n' +
        '    {\n' +
        '        "id": "unique-mixer-flow-connection-id-2",\n' +
        '        "name": "mixer-flow-connection-2",\n' +
        '        "layer": "unique-flow-layer-id-string",\n' +
        '        "source": {\n' +
        '            "component": "unique-mixer-id-string-2",\n' +
        '            "port": "output-port"\n' +
        '        },\n' +
        '        "sinks": [\n' +
        '            {\n' +
        '                "component": "unique-mixer-id-string-1",\n' +
        '                "port": "input-port"\n' +
        '            }\n' +
        '        ]\n' +
        '    }\n' +
        ']';

const validParchmintMultipleConnectionsDiffLayer = '"connections": [\n' +
        '    {\n' +
        '        "id": "unique-mixer-flow-connection-id-1",\n' +
        '        "name": "mixer-flow-connection-1",\n' +
        '        "layer": "unique-flow-layer-id-string",\n' +
        '        "source": {\n' +
        '            "component": "unique-mixer-id-string-1",\n' +
        '            "port": "output-port"\n' +
        '        },\n' +
        '        "sinks": [\n' +
        '            {\n' +
        '               "component": "unique-mixer-id-string-2",\n' +
        '               "port": "input-port"\n' +
        '            }\n' +
        '        ]\n' +
        '    },\n' +
        '    {\n' +
        '        "id": "unique-mixer-flow-connection-id-2",\n' +
        '        "name": "mixer-flow-connection-2",\n' +
        '        "layer": "unique-control-layer-id-string",\n' +
        '        "source": {\n' +
        '            "component": "unique-mixer-id-string-1",\n' +
        '            "port": "rotary-control-port"\n' +
        '        },\n' +
        '        "sinks": [\n' +
        '            {\n' +
        '                "component": "unique-mixer-id-string-2",\n' +
        '                "port": "rotary-control-port"\n' +
        '            }\n' +
        '        ]\n' +
        '    }\n' +
        ']';

const duplicateIDParchmintConnections = '"connections": [\n' +
        '    {\n' +
        '        "id": "unique-mixer-flow-connection-id",\n' +
        '        "name": "mixer-flow-connection-1",\n' +
        '        "layer": "unique-flow-layer-id-string",\n' +
        '        "source": {\n' +
        '            "component": "unique-mixer-id-string-1",\n' +
        '            "port": "output-port"\n' +
        '        },\n' +
        '        "sinks": [\n' +
        '            {\n' +
        '               "component": "unique-mixer-id-string-2",\n' +
        '               "port": "input-port"\n' +
        '            }\n' +
        '        ]\n' +
        '    },\n' +
        '    {\n' +
        '        "id": "unique-mixer-flow-connection-id",\n' +
        '        "name": "mixer-flow-connection-2",\n' +
        '        "layer": "unique-flow-layer-id-string",\n' +
        '        "source": {\n' +
        '            "component": "unique-mixer-id-string-2",\n' +
        '            "port": "output-port"\n' +
        '        },\n' +
        '        "sinks": [\n' +
        '            {\n' +
        '                "component": "unique-mixer-id-string-1",\n' +
        '                "port": "input-port"\n' +
        '            }\n' +
        '        ]\n' +
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

const validParchmintMultipleComponentFeaturesDiffComp = '"features": [\n' +
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

const validParchmintMultipleComponentFeaturesSameCompDiffLayer = '"features": [\n' +
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
        '        "name": "mixer-001",\n' +
        '        "id": "unique-mixer-id-string",\n' +
        '        "layer": "unique-control-layer-id-string",\n' +
        '        "location": {\n' +
        '            "x": 600,\n' +
        '            "y": 3000\n' +
        '        },\n' +
        '        "x-span": 5500,\n' +
        '        "y-span": 2500,\n' +
        '        "depth": 20\n' +
        '    }\n' +
        ']';

const validParchmintEmptyFeatures = '"features": []';

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

const validParchmintConnectionFeatures = '"features": [\n' +
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

const validParchmintMultipleConnectionFeaturesOneConnection = '"features": [\n' +
        '    {\n' +
        '        "name": "mixer-flow-connection-segment-001",\n' +
        '        "id": "unique-channel-segment-id-1",\n' +
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
        '    },\n' +
        '    {\n' +
        '        "name": "mixer-flow-connection-segment-002",\n' +
        '        "id": "unique-channel-segment-id-2",\n' +
        '        "connection": "unique-mixer-flow-connection-id",\n' +
        '        "layer": "unique-flow-layer-id-string",\n' +
        '        "width": 15,\n' +
        '        "depth": 20,\n' +
        '        "source": {\n' +
        '            "x": 50,\n' +
        '            "y": 2750\n' +
        '        },\n' +
        '        "sink": {\n' +
        '            "x": 60,\n' +
        '            "y": 3750\n' +
        '        },\n' +
        '        "type": "channel"\n' +
        '    }\n' +
        ']';

const validParchmintMultipleConnectionFeaturesTwoConnections = '"features": [\n' +
        '    {\n' +
        '        "name": "mixer-flow-connection-segment-001",\n' +
        '        "id": "unique-channel-segment-id-1",\n' +
        '        "connection": "unique-mixer-flow-connection-id-1",\n' +
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
        '    },\n' +
        '    {\n' +
        '        "name": "mixer-flow-connection-segment-002",\n' +
        '        "id": "unique-channel-segment-id-2",\n' +
        '        "connection": "unique-mixer-flow-connection-id-2",\n' +
        '        "layer": "unique-flow-layer-id-string",\n' +
        '        "width": 15,\n' +
        '        "depth": 20,\n' +
        '        "source": {\n' +
        '            "x": 50,\n' +
        '            "y": 2750\n' +
        '        },\n' +
        '        "sink": {\n' +
        '            "x": 60,\n' +
        '            "y": 3750\n' +
        '        },\n' +
        '        "type": "channel"\n' +
        '    }\n' +
        ']';

const duplicateIDParchmintConnectionFeatures = '"features": [\n' +
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
        '    },\n' +
        '    {\n' +
        '        "name": "mixer-flow-connection-segment-002",\n' +
        '        "id": "unique-channel-segment-id",\n' +
        '        "connection": "unique-mixer-flow-connection-id",\n' +
        '        "layer": "unique-flow-layer-id-string",\n' +
        '        "width": 15,\n' +
        '        "depth": 20,\n' +
        '        "source": {\n' +
        '            "x": 50,\n' +
        '            "y": 2750\n' +
        '        },\n' +
        '        "sink": {\n' +
        '            "x": 60,\n' +
        '            "y": 3750\n' +
        '        },\n' +
        '        "type": "channel"\n' +
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

const validSingleTerminal = '"terminal": {\n' +
        '            "component": "unique-mixer-id-string",\n' +
        '            "port": "input-port"\n' +
        '        }';

const validMultipleTerminalsOneComponent = '"terminals": [\n' +
        '            {\n' +
        '                "component": "unique-mixer-id-string",\n' +
        '                "port": "input-port"\n' +
        '            },\n' +
        '            {\n' +
        '                "component": "unique-mixer-id-string",\n' +
        '                "port": "output-port"\n' +
        '            }\n' +
        '        ]';

const validMultipleTerminalsTwoComponents = '"terminals": [\n' +
        '            {\n' +
        '                "component": "unique-mixer-id-string-1",\n' +
        '                "port": "input-port"\n' +
        '            },\n' +
        '            {\n' +
        '                "component": "unique-mixer-id-string-2",\n' +
        '                "port": "output-port"\n' +
        '            }\n' +
        '        ]';

const invalidComponentTerminal = '"terminal": {\n' +
        '                "component": "unique-output-id-string",\n' +
        '                "port": "output-port"\n' +
        '            }';

const invalidPortTerminal = '"terminal": {\n' +
        '                "component": "unique-mixer-id-string",\n' +
        '                "port": "io-port"\n' +
        '            }';

