const ParchmintParser = require('../../parsing/parchmint-parser.js');
const Coord = require('../../model/coord.js');
const Terminal = require('../../model/terminal.js');
const Validation = require('../../utils/validation.js');

// Suppress console logs
console.log = jest.fn();

const flowLayerID = 'unique-flow-layer-id-string';
const controlLayerID = 'unique-control-layer-id-string';
const invalidLayerID = 'non-existent-layer-id-string';

const componentID = 'unique-mixer-id-string';
const connectionID = 'unique-mixer-flow-connection-id';
const connFeatID = 'unique-channel-segment-id';


function parseJSONObj(str) {
    return JSON.parse('{' + str + '}');
}

test('initialization', () => {
    let pp = new ParchmintParser();
    let arch = pp.parse(validParchmintArchBareBones);

    expect(pp.valid).toBe(true);
    expect(arch.name).toBe('bare-bones-architecture-name');
    expect(arch.layers.length).toBe(1);
});

test('architecture field access', () => {
        let pp = new ParchmintParser();
        pp.parse(readme_parchmint);

        expect(pp.valid).toBe(true);
        expect(pp.architecture).toBeTruthy();
        expect(pp.architecture.layers.length).toBe(2);
});

test('valid parse', () => {
    let pp = new ParchmintParser();
    pp.parse(readme_parchmint);

    expect(pp.valid).toBe(true);
});

describe('architecture', () => {
    describe('benchmarks', () => {
        test('planar synthetic 1', () => {
            let pp = new ParchmintParser();
            let arch = pp.parse(planar_synthetic_1);

            expect(pp.valid).toBe(true);
            expect(arch.name).toBe('Planar_Synthetic_1');
            expect(arch.layers.length).toBe(1);
        });

        test('readme parchmint', () => {
            let pp = new ParchmintParser();
            let arch = pp.parse(readme_parchmint);

            expect(pp.valid).toBe(true);
            expect(arch.name).toBe('readme_parchmint');
            expect(arch.layers.length).toBe(2);
            expect(arch.layers[0].id).toBe(flowLayerID);
            expect(arch.layers[1].id).toBe(controlLayerID);
        });
    });
});

describe('layers', () => {
    describe('valid', () => {
        test('no components/features', () => {
            let pp = new ParchmintParser();
            let layer;

            pp.parseComponents(parseJSONObj(validParchmintLayersNoCompConn));
            pp.parseConnections(parseJSONObj(validParchmintLayersNoCompConn));
            pp.parseLayers(parseJSONObj(validParchmintLayersNoCompConn));

            expect(pp.valid).toBe(true);
            expect(pp.layers.length).toBe(2);
            expect(pp.components.size).toBe(0);
            expect(pp.connections.size).toBe(0);

            layer = pp.layers[0];
            expect(layer.name).toBe('flow-layer');
            expect(layer.connections).toEqual([]);

            layer = pp.layers[1];
            expect(layer.name).toBe('control-layer');
            expect(layer.connections).toEqual([]);
        });
    });
    test('planar_synthetic_1', () => {
        let pp = new ParchmintParser();
        let layer;

        pp.parseComponents(JSON.parse(planar_synthetic_1));
        pp.parseConnections(JSON.parse(planar_synthetic_1));
        pp.parseLayers(JSON.parse(planar_synthetic_1));

        expect(pp.valid).toBe(true);
        expect(pp.layers.length).toBe(1);
        expect(pp.components.has('8a5a3c06-dff7-48fc-8242-0f8dcf35885e')).toBe(true);
        expect(pp.components.size).toBe(1);

        layer = pp.layers[0];
        expect(layer.components.length).toBe(21);
        expect(layer.connections.length).toBe(21);
    });

    describe('invalid', () => {
        test('components', () => {
            let pp = new ParchmintParser();
            let layer;

            pp.parseComponents(parseJSONObj(invalidParchmintLayersBadComponentLayer));
            pp.parseConnections(parseJSONObj(invalidParchmintLayersBadComponentLayer));
            pp.parseLayers(parseJSONObj(invalidParchmintLayersBadComponentLayer));

            expect(pp.valid).toBe(false);
            expect(pp.layers.length).toBe(1);
            expect(pp.components.size).toBe(2);
            expect(pp.components.has(flowLayerID)).toBe(true);
            expect(pp.components.has(invalidLayerID)).toBe(true);
            expect(pp.connections.size).toBe(0);

            layer = pp.layers[0];
            expect(layer.components.length).toBe(1);
            expect(layer.connections).toEqual([]);
        });

        test('connections', () => {
            let pp = new ParchmintParser();
            let layer;

            pp.parseComponents(parseJSONObj(invalidParchmintLayersBadConnectionLayer));
            pp.parseConnections(parseJSONObj(invalidParchmintLayersBadConnectionLayer));
            pp.parseLayers(parseJSONObj(invalidParchmintLayersBadConnectionLayer));

            expect(pp.valid).toBe(false);
            expect(pp.layers.length).toBe(1);
            expect(pp.components.size).toBe(0);
            expect(pp.connections.size).toBe(1);
            expect(pp.connections.has(invalidLayerID)).toBe(true);

            layer = pp.layers[0];
            expect(layer.components).toEqual([]);
            expect(layer.connections.length).toBe(0);
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

    describe('non-matching layers', () => {
        test('port', () => { // The port has layers that do not exist in the component's layer list
            let pp = new ParchmintParser();
            pp.parseComponents(parseJSONObj(nonMatchingPortLayerParchmintComponents));
            expect(pp.valid).toBe(true);
            expect(pp.components.size).toBe(1);
            expect(pp.components.has(flowLayerID)).toBe(true);
        });

        test('component', () => { // The component has layers that do not exist in the port list
            let pp = new ParchmintParser();
            pp.parseComponents(parseJSONObj(extraLayerParchmintComponents));

            expect(pp.valid).toBe(true);
            expect(pp.components.size).toBe(2);
            expect(pp.components.has(flowLayerID)).toBe(true);
            expect(pp.components.has(controlLayerID)).toBe(true);
        });
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
            let p = ParchmintParser.getParsedPort(parseJSONObj(validSinglePort).port);

            expect(p.label).toBe('input-port');
            expect(p.pos).toEqual(new Coord(0, 750));
        });

        test('array', () => {
            let pp = new ParchmintParser();
            let ports = pp.getParsedPorts(parseJSONObj(validPorts).ports);
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
            let ports = pp.getParsedPorts(parseJSONObj(duplicateLabelPorts).ports);
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
            term = pp.getParsedTerminal(parseJSONObj(parch).terminal, flowLayerID);
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
                terms = pp.getParsedTerminals(parseJSONObj(parch).terminals, flowLayerID);
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
                terms = pp.getParsedTerminals(parseJSONObj(parch).terminals, flowLayerID);
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
            term = pp.getParsedTerminal(parseJSONObj(parch).terminal, flowLayerID);

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
            term = pp.getParsedTerminal(parseJSONObj(parch).terminal, flowLayerID);

            expect(pp.valid).toBe(false);
            expect(term.component).toBeTruthy();
            expect(term.port).toBeFalsy();
        });

        test('layer', () => {
            let pp = new ParchmintParser();
            let parch = validSingleTerminal + ', ' + validParchmintComponents;
            let term;

            pp.parseComponents(parseJSONObj(parch));
            term = pp.getParsedTerminal(parseJSONObj(parch), invalidLayerID);

            expect(pp.valid).toBe(false);
            expect(term.component).toBeFalsy();
            expect(term.port).toBeFalsy();
        });
    });
});

//-- Begin Parchmint JSON strings --\\
const readme_parchmint = `{
    "name": "readme_parchmint",
    "layers": [
        {
            "id": "unique-flow-layer-id-string",
            "name": "flow-layer"
        },
        {
            "id": "unique-control-layer-id-string",
            "name": "control-layer"
        }
    ],
    "components": [
        {
            "id": "unique-mixer-id-string",
            "name": "mixer-001",
            "layers": [
                "unique-flow-layer-id-string",
                "unique-control-layer-id-string"
            ],
            "x-span": 4500,
            "y-span": 1500,
            "entity": "rotary-mixer",
            "ports": [
                {
                    "label": "input-port",
                    "layer": "unique-flow-layer-id-string",
                    "x": 0,
                    "y": 750
                },
                {
                    "label": "output-port",
                    "layer": "unique-flow-layer-id-string",
                    "x": 4500,
                    "y": 750
                },
                {
                    "label": "rotary-control-port",
                    "layer": "unique-control-layer-id-string",
                    "x": 2250,
                    "y": 0
                }
            ]
        },
        {
            "id": "unique-output-id-string",
            "name": "output",
            "layers": [
                "unique-flow-layer-id-string"
            ],
            "x-span": 200,
            "y-span": 200,
            "entity": "output-component",
            "ports": [
                {
                    "label": "io-port",
                    "layer": "unique-flow-layer-id-string",
                    "x": 0,
                    "y": 100
                }
            ]
        }
    ],
    "connections": [
        {
            "id": "unique-mixer-flow-connection-id",
            "name": "mixer-flow-connection",
            "layer": "unique-flow-layer-id-string",
            "source": {
                "component": "unique-mixer-id-string",
                "port": "input-port"
            },
            "sinks": [
                {
                    "component": "unique-output-id-string",
                    "port": "io-port"
                }
            ]
        }
    ],
    "features": [
        {
            "name": "mixer-001",
            "id": "unique-mixer-id-string",
            "layer": "unique-flow-layer-id-string",
            "location": {
                "x": 500,
                "y": 2000
            },
            "x-span": 4500,
            "y-span": 1500,
            "depth": 10
        },
        {
            "name": "output",
            "id": "unique-output-id-string",
            "layer": "unique-flow-layer-id-string",
            "location": {
                "x": 0,
                "y": 0
            },
            "x-span": 200,
            "y-span": 200,
            "depth": 15
        },
        {
            "name": "mixer-flow-connection-segment-001",
            "id": "unique-channel-segment-id",
            "connection": "unique-mixer-flow-connection-id",
            "layer": "unique-flow-layer-id-string",
            "width": 5,
            "depth": 10,
            "source": {
                "x": 500,
                "y": 2750
            },
            "sink": {
                "x": 50,
                "y": 2750
            },
            "type": "channel"
        }
    ]
}`;

const validParchmintArchBareBones = `{
        "name": "bare-bones-architecture-name",
        "layers": [{
           "name": "layer",
           "id":   "layer-id"
        }]
        }`;

const validParchmintArchWithComponents = `{
        "name": "bare-bones-architecture-name",
        "layers": [
           {
               "name": "flow-layer",
               "id":   "unique-flow-layer-id-string"
           },
           {
               "name": "control-layer",
               "id":   "unique-control-layer-id-string"
           }
        ],
        "components": [
            {
                "id": "unique-mixer-id-string",
                "name": "mixer-001",
                "layers": [
                    "unique-flow-layer-id-string",
                    "unique-control-layer-id-string"
                ],
                "x-span": 4500,
                "y-span": 1500,
                "entity": "rotary-mixer",
                "ports": [
                    {
                        "label": "input-port",
                        "layer": "unique-flow-layer-id-string",
                        "x": 0,
                        "y": 750
                    },
                    {
                        "label": "output-port",
                        "layer": "unique-flow-layer-id-string",
                        "x": 4500,
                        "y": 750
                    },
                    {
                        "label": "rotary-control-port",
                        "layer": "unique-control-layer-id-string",
                        "x": 2250,
                        "y": 0
                    }
                ]
            }
        ]
        }`;

const validParchmintArchWithConnections = `{
        "name": "bare-bones-architecture-name",
        "layers": [
           {
               "name": "flow-layer",
               "id":   "unique-flow-layer-id-string"
           },
           {
               "name": "control-layer",
               "id":   "unique-control-layer-id-string"
           }
        ],
        "connections": [
            {
                "id": "unique-mixer-flow-connection-id",
                "name": "mixer-flow-connection",
                "layer": "unique-flow-layer-id-string",
                "source": {
                    "component": "unique-mixer-id-string",
                    "port": "output-port"
                },
                "sinks": [
                    {
                       "component": "unique-mixer-id-string",
                       "port": "input-port"
                    }
                ]
            }
        ]}`;

const validParchmintLayersNoCompConn = `"layers": [
            {
                "id": "unique-flow-layer-id-string",
                "name": "flow-layer"
            },
            {
                "id": "unique-control-layer-id-string",
                "name": "control-layer"
            }
        ],
        "components": [],
        "connections": []`;

const invalidParchmintLayersBadComponentLayer = `"layers": [
            {
                "id": "unique-flow-layer-id-string",
                "name": "flow-layer"
            }
        ],
        "components": [
            {
                "id": "unique-mixer-id-string",
                "name": "mixer-001",
                "layers": [
                    "non-existent-layer-id-string",
                    "unique-flow-layer-id-string"
                ],
                "x-span": 4500,
                "y-span": 1500,
                "entity": "rotary-mixer",
                "ports": [
                    {
                        "label": "input-port",
                        "layer": "unique-flow-layer-id-string",
                        "x": 0,
                        "y": 750
                    },
                    {
                        "label": "output-port",
                        "layer": "unique-flow-layer-id-string",
                        "x": 4500,
                        "y": 750
                    },
                    {
                        "label": "rotary-control-port",
                        "layer": "unique-control-layer-id-string",
                        "x": 2250,
                        "y": 0
                    }
                ]
            }
        ],
        "connections": []`;

const invalidParchmintLayersBadConnectionLayer = `"layers": [
            {
                "id": "unique-flow-layer-id-string",
                "name": "flow-layer"
            }
        ],
        "components": [],
        "connections": [
            {
                "id": "unique-mixer-flow-connection-id",
                "name": "mixer-flow-connection",
                "layer": "non-existent-layer-id-string",
                "source": {
                    "component": "unique-mixer-id-string",
                    "port": "output-port"
                },
                "sinks": [
                    {
                       "component": "unique-mixer-id-string",
                       "port": "input-port"
                    }
                ]
            }
        ]`;

const validParchmintComponents = `"components": [
            {
                "id": "unique-mixer-id-string",
                "name": "mixer-001",
                "layers": [
                    "unique-flow-layer-id-string",
                    "unique-control-layer-id-string"
                ],
                "x-span": 4500,
                "y-span": 1500,
                "entity": "rotary-mixer",
                "ports": [
                    {
                        "label": "input-port",
                        "layer": "unique-flow-layer-id-string",
                        "x": 0,
                        "y": 750
                    },
                    {
                        "label": "output-port",
                        "layer": "unique-flow-layer-id-string",
                        "x": 4500,
                        "y": 750
                    },
                    {
                        "label": "rotary-control-port",
                        "layer": "unique-control-layer-id-string",
                        "x": 2250,
                        "y": 0
                    }
                ]
            }
        ]`;

const validParchmintMultipleComponents = `"components": [
            {
                "id": "unique-mixer-id-string-1",
                "name": "mixer-001",
                "layers": [
                    "unique-flow-layer-id-string",
                    "unique-control-layer-id-string"
                ],
                "x-span": 4500,
                "y-span": 1500,
                "entity": "rotary-mixer",
                "ports": [
                    {
                        "label": "input-port",
                        "layer": "unique-flow-layer-id-string",
                        "x": 0,
                        "y": 750
                    },
                    {
                        "label": "output-port",
                        "layer": "unique-flow-layer-id-string",
                        "x": 4500,
                        "y": 750
                    },
                    {
                        "label": "rotary-control-port",
                        "layer": "unique-control-layer-id-string",
                        "x": 2250,
                        "y": 0
                    }
                ]
            },
            {
                "id": "unique-mixer-id-string-2",
                "name": "mixer-002",
                "layers": [
                    "unique-flow-layer-id-string",
                    "unique-control-layer-id-string"
                ],
                "x-span": 5500,
                "y-span": 2500,
                "entity": "rotary-mixer",
                "ports": [
                    {
                        "label": "input-port",
                        "layer": "unique-flow-layer-id-string",
                        "x": 10,
                        "y": 2500
                    },
                    {
                        "label": "output-port",
                        "layer": "unique-flow-layer-id-string",
                        "x": 5500,
                        "y": 1750
                    },
                    {
                        "label": "rotary-control-port",
                        "layer": "unique-control-layer-id-string",
                        "x": 10,
                        "y": 2500
                    }
                ]
            }
        ]`;

const duplicateIDParchmintComponents = `"components": [
            {
                "id": "unique-mixer-id-string",
                "name": "mixer-001",
                "layers": [
                    "unique-flow-layer-id-string",
                    "unique-control-layer-id-string"
                ],
                "x-span": 4500,
                "y-span": 1500,
                "entity": "rotary-mixer",
                "ports": [
                    {
                        "label": "input-port",
                        "layer": "unique-flow-layer-id-string",
                        "x": 0,
                        "y": 750
                    },
                    {
                        "label": "output-port",
                        "layer": "unique-flow-layer-id-string",
                        "x": 4500,
                        "y": 750
                    },
                    {
                        "label": "rotary-control-port",
                        "layer": "unique-control-layer-id-string",
                        "x": 2250,
                        "y": 0
                    }
                ]
            },
            {
                "id": "unique-mixer-id-string",
                "name": "mixer-002",
                "layers": [
                    "unique-flow-layer-id-string",
                    "unique-control-layer-id-string"
                ],
                "x-span": 5500,
                "y-span": 2500,
                "entity": "rotary-mixer",
                "ports": [
                    {
                        "label": "input-port",
                        "layer": "unique-flow-layer-id-string",
                        "x": 10,
                        "y": 2500
                    },
                    {
                        "label": "output-port",
                        "layer": "unique-flow-layer-id-string",
                        "x": 5500,
                        "y": 1750
                    },
                    {
                        "label": "rotary-control-port",
                        "layer": "unique-control-layer-id-string",
                        "x": 10,
                        "y": 2500
                    }
                ]
            }
        ]`;

const nonMatchingPortLayerParchmintComponents = `"components": [
            {
                "id": "unique-mixer-id-string",
                "name": "mixer-001",
                "layers": [
                    "unique-flow-layer-id-string"
                ],
                "x-span": 4500,
                "y-span": 1500,
                "entity": "rotary-mixer",
                "ports": [
                    {
                        "label": "input-port",
                        "layer": "non-existent-layer-id-string",
                        "x": 0,
                        "y": 750
                    },
                    {
                        "label": "output-port",
                        "layer": "unique-flow-layer-id-string",
                        "x": 4500,
                        "y": 750
                    }
                ]
            }
        ]`;

const extraLayerParchmintComponents = `"components": [
            {
                "id": "unique-mixer-id-string",
                "name": "mixer-001",
                "layers": [
                    "unique-flow-layer-id-string",
                    "unique-control-layer-id-string"
                ],
                "x-span": 4500,
                "y-span": 1500,
                "entity": "rotary-mixer",
                "ports": [
                    {
                        "label": "input-port",
                        "layer": "non-existent-layer-id-string",
                        "x": 0,
                        "y": 750
                    },
                    {
                        "label": "output-port",
                        "layer": "unique-flow-layer-id-string",
                        "x": 4500,
                        "y": 750
                    }
                ]
            }
        ]`;

const validParchmintConnections = `"connections": [
            {
                "id": "unique-mixer-flow-connection-id",
                "name": "mixer-flow-connection",
                "layer": "unique-flow-layer-id-string",
                "source": {
                    "component": "unique-mixer-id-string",
                    "port": "output-port"
                },
                "sinks": [
                    {
                       "component": "unique-mixer-id-string",
                       "port": "input-port"
                    }
                ]
            }
        ]`;

const validParchmintMultipleConnectionsSameLayer = `"connections": [
            {
                "id": "unique-mixer-flow-connection-id-1",
                "name": "mixer-flow-connection-1",
                "layer": "unique-flow-layer-id-string",
                "source": {
                    "component": "unique-mixer-id-string-1",
                    "port": "output-port"
                },
                "sinks": [
                    {
                       "component": "unique-mixer-id-string-2",
                       "port": "input-port"
                    }
                ]
            },
            {
                "id": "unique-mixer-flow-connection-id-2",
                "name": "mixer-flow-connection-2",
                "layer": "unique-flow-layer-id-string",
                "source": {
                    "component": "unique-mixer-id-string-2",
                    "port": "output-port"
                },
                "sinks": [
                    {
                        "component": "unique-mixer-id-string-1",
                        "port": "input-port"
                    }
                ]
            }
        ]`;

const validParchmintMultipleConnectionsDiffLayer = `"connections": [
            {
                "id": "unique-mixer-flow-connection-id-1",
                "name": "mixer-flow-connection-1",
                "layer": "unique-flow-layer-id-string",
                "source": {
                    "component": "unique-mixer-id-string-1",
                    "port": "output-port"
                },
                "sinks": [
                    {
                       "component": "unique-mixer-id-string-2",
                       "port": "input-port"
                    }
                ]
            },
            {
                "id": "unique-mixer-flow-connection-id-2",
                "name": "mixer-flow-connection-2",
                "layer": "unique-control-layer-id-string",
                "source": {
                    "component": "unique-mixer-id-string-1",
                    "port": "rotary-control-port"
                },
                "sinks": [
                    {
                        "component": "unique-mixer-id-string-2",
                        "port": "rotary-control-port"
                    }
                ]
            }
        ]`;

const duplicateIDParchmintConnections = `"connections": [
            {
                "id": "unique-mixer-flow-connection-id",
                "name": "mixer-flow-connection-1",
                "layer": "unique-flow-layer-id-string",
                "source": {
                    "component": "unique-mixer-id-string-1",
                    "port": "output-port"
                },
                "sinks": [
                    {
                       "component": "unique-mixer-id-string-2",
                       "port": "input-port"
                    }
                ]
            },
            {
                "id": "unique-mixer-flow-connection-id",
                "name": "mixer-flow-connection-2",
                "layer": "unique-flow-layer-id-string",
                "source": {
                    "component": "unique-mixer-id-string-2",
                    "port": "output-port"
                },
                "sinks": [
                    {
                        "component": "unique-mixer-id-string-1",
                        "port": "input-port"
                    }
                ]
            }
        ]`;

const validParchmintComponentFeatures = `"features": [
            {
                "name": "mixer-001",
                "id": "unique-mixer-id-string",
                "layer": "unique-flow-layer-id-string",
                "location": {
                    "x": 500,
                    "y": 2000
                },
                "x-span": 4500,
                "y-span": 1500,
                "depth": 10
            }
        ]`;

const validParchmintMultipleComponentFeaturesDiffComp = `"features": [
            {
                "name": "mixer-001",
                "id": "unique-mixer-id-string-1",
                "layer": "unique-flow-layer-id-string",
                "location": {
                    "x": 500,
                    "y": 2000
                },
                "x-span": 4500,
                "y-span": 1500,
                "depth": 10
            },
            {
                "name": "mixer-002",
                "id": "unique-mixer-id-string-2",
                "layer": "unique-flow-layer-id-string",
                "location": {
                    "x": 600,
                    "y": 3000
                },
                "x-span": 5500,
                "y-span": 2500,
                "depth": 20
            }
        ]`;

const validParchmintMultipleComponentFeaturesSameCompDiffLayer = `"features": [
            {
                "name": "mixer-001",
                "id": "unique-mixer-id-string",
                "layer": "unique-flow-layer-id-string",
                "location": {
                    "x": 500,
                    "y": 2000
                },
                "x-span": 4500,
                "y-span": 1500,
                "depth": 10
            },
            {
                "name": "mixer-001",
                "id": "unique-mixer-id-string",
                "layer": "unique-control-layer-id-string",
                "location": {
                    "x": 600,
                    "y": 3000
                },
                "x-span": 5500,
                "y-span": 2500,
                "depth": 20
            }
        ]`;

const validParchmintEmptyFeatures = `"features": []`;

const invalidParchmintComponentFeatures = `"features": [
            {
                "name": "",
                "id": "unique-mixer-id-string",
                "layer": "unique-flow-layer-id-string",
                "location": {
                    "x": -500,
                    "y": 2000
                },
                "x-span": 0,
                "y-span": 1500,
                "depth": 10
            }
        ]`;

const duplicateParchmintComponentFeature = `"features": [
            {
                "name": "mixer-001",
                "id": "unique-mixer-id-string",
                "layer": "unique-flow-layer-id-string",
                "location": {
                    "x": 500,
                    "y": 2000
                },
                "x-span": 4500,
                "y-span": 1500,
                "depth": 10
            },
            {
                "name": "mixer-002",
                "id": "unique-mixer-id-string",
                "layer": "unique-flow-layer-id-string",
                "location": {
                    "x": 1000,
                    "y": 2500
                },
                "x-span": 4000,
                "y-span": 1000,
                "depth": 5
            }
        ]`;

const validParchmintConnectionFeatures = `"features": [
            {
                "name": "mixer-flow-connection-segment-001",
                "id": "unique-channel-segment-id",
                "connection": "unique-mixer-flow-connection-id",
                "layer": "unique-flow-layer-id-string",
                "width": 5,
                "depth": 10,
                "source": {
                    "x": 500,
                    "y": 2750
                },
                "sink": {
                    "x": 50,
                    "y": 2750
                },
                "type": "channel"
            }
        ]`;

const validParchmintMultipleConnectionFeaturesOneConnection = `"features": [
            {
                "name": "mixer-flow-connection-segment-001",
                "id": "unique-channel-segment-id-1",
                "connection": "unique-mixer-flow-connection-id",
                "layer": "unique-flow-layer-id-string",
                "width": 5,
                "depth": 10,
                "source": {
                    "x": 500,
                    "y": 2750
                },
                "sink": {
                    "x": 50,
                    "y": 2750
                },
                "type": "channel"
            },
            {
                "name": "mixer-flow-connection-segment-002",
                "id": "unique-channel-segment-id-2",
                "connection": "unique-mixer-flow-connection-id",
                "layer": "unique-flow-layer-id-string",
                "width": 15,
                "depth": 20,
                "source": {
                    "x": 50,
                    "y": 2750
                },
                "sink": {
                    "x": 60,
                    "y": 3750
                },
                "type": "channel"
            }
        ]`;

const validParchmintMultipleConnectionFeaturesTwoConnections = `"features": [
            {
                "name": "mixer-flow-connection-segment-001",
                "id": "unique-channel-segment-id-1",
                "connection": "unique-mixer-flow-connection-id-1",
                "layer": "unique-flow-layer-id-string",
                "width": 5,
                "depth": 10,
                "source": {
                    "x": 500,
                    "y": 2750
                },
                "sink": {
                    "x": 50,
                    "y": 2750
                },
                "type": "channel"
            },
            {
                "name": "mixer-flow-connection-segment-002",
                "id": "unique-channel-segment-id-2",
                "connection": "unique-mixer-flow-connection-id-2",
                "layer": "unique-flow-layer-id-string",
                "width": 15,
                "depth": 20,
                "source": {
                    "x": 50,
                    "y": 2750
                },
                "sink": {
                    "x": 60,
                    "y": 3750
                },
                "type": "channel"
            }
        ]`;

const duplicateIDParchmintConnectionFeatures = `"features": [
            {
                "name": "mixer-flow-connection-segment-001",
                "id": "unique-channel-segment-id",
                "connection": "unique-mixer-flow-connection-id",
                "layer": "unique-flow-layer-id-string",
                "width": 5,
                "depth": 10,
                "source": {
                    "x": 500,
                    "y": 2750
                },
                "sink": {
                    "x": 50,
                    "y": 2750
                },
                "type": "channel"
            },
            {
                "name": "mixer-flow-connection-segment-002",
                "id": "unique-channel-segment-id",
                "connection": "unique-mixer-flow-connection-id",
                "layer": "unique-flow-layer-id-string",
                "width": 15,
                "depth": 20,
                "source": {
                    "x": 50,
                    "y": 2750
                },
                "sink": {
                    "x": 60,
                    "y": 3750
                },
                "type": "channel"
            }
        ]`;

const validParchmintComboFeatures = `"features": [
            {
                "name": "mixer-001",
                "id": "unique-mixer-id-string",
                "layer": "unique-flow-layer-id-string",
                "location": {
                    "x": 500,
                    "y": 2000
                },
                "x-span": 4500,
                "y-span": 1500,
                "depth": 10
            },
            {
                "name": "mixer-flow-connection-segment-001",
                "id": "unique-channel-segment-id",
                "connection": "unique-mixer-flow-connection-id",
                "layer": "unique-flow-layer-id-string",
                "width": 5,
                "depth": 10,
                "source": {
                    "x": 500,
                    "y": 2750
                },
                "sink": {
                    "x": 50,
                    "y": 2750
                },
                "type": "channel"
            }
        ]`;

const validSinglePort = `"port":
                    {
                        "label": "input-port",
                        "layer": "unique-flow-layer-id-string",
                        "x": 0,
                        "y": 750
                    }`;

const validPorts = `"ports": [
                    {
                        "label": "input-port",
                        "layer": "unique-flow-layer-id-string",
                        "x": 0,
                        "y": 750
                    },
                    {
                        "label": "output-port",
                        "layer": "unique-flow-layer-id-string",
                        "x": 4500,
                        "y": 750
                    },
                    {
                        "label": "rotary-control-port",
                        "layer": "unique-control-layer-id-string",
                        "x": 2250,
                        "y": 0
                    }
                ]`;

const duplicateLabelPorts = `"ports": [
                    {
                        "label": "input-port",
                        "layer": "unique-flow-layer-id-string",
                        "x": 0,
                        "y": 750
                    },
                    {
                        "label": "input-port",
                        "layer": "unique-flow-layer-id-string",
                        "x": 4500,
                        "y": 750
                    },
                    {
                        "label": "rotary-control-port",
                        "layer": "unique-control-layer-id-string",
                        "x": 2250,
                        "y": 0
                    }
                ]`;

const validSingleTerminal = `"terminal": {
                    "component": "unique-mixer-id-string",
                    "port": "input-port"
                }`;

const validMultipleTerminalsOneComponent = `"terminals": [
                    {
                        "component": "unique-mixer-id-string",
                        "port": "input-port"
                    },
                    {
                        "component": "unique-mixer-id-string",
                        "port": "output-port"
                    }
                ]`;

const validMultipleTerminalsTwoComponents = `"terminals": [
                    {
                        "component": "unique-mixer-id-string-1",
                        "port": "input-port"
                    },
                    {
                        "component": "unique-mixer-id-string-2",
                        "port": "output-port"
                    }
                ]`;

const invalidComponentTerminal = `"terminal": {
                        "component": "unique-output-id-string",
                        "port": "output-port"
                    }`;

const invalidPortTerminal = `"terminal": {
                        "component": "unique-mixer-id-string",
                        "port": "io-port"
                    }`;

//-- Complete Parchmints --\\
const planar_synthetic_1 = `{
            "components": [
                {
                    "entity": "Input", 
                    "id": "d64e9260-f42f-4b1c-886f-41828f4899af", 
                    "layers": [
                        "8a5a3c06-dff7-48fc-8242-0f8dcf35885e"
                    ], 
                    "name": "Source1", 
                    "ports": [
                        {
                            "label": "port0", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 10, 
                            "y": 20
                        }
                    ], 
                    "x-span": 20, 
                    "y-span": 20
                }, 
                {
                    "entity": "Input", 
                    "id": "174b0fe7-f44d-4fc5-a657-b1cacffa98af", 
                    "layers": [
                        "8a5a3c06-dff7-48fc-8242-0f8dcf35885e"
                    ], 
                    "name": "Source2", 
                    "ports": [
                        {
                            "label": "port0", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 10, 
                            "y": 20
                        }
                    ], 
                    "x-span": 20, 
                    "y-span": 20
                }, 
                {
                    "entity": "Output", 
                    "id": "1fd596b1-a033-455a-a384-bf0fa1eda437", 
                    "layers": [
                        "8a5a3c06-dff7-48fc-8242-0f8dcf35885e"
                    ], 
                    "name": "Out1", 
                    "ports": [
                        {
                            "label": "port0", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 10, 
                            "y": 0
                        }
                    ], 
                    "x-span": 20, 
                    "y-span": 20
                }, 
                {
                    "entity": "Mixer", 
                    "id": "605959bc-808a-46db-a838-0e3d77868fab", 
                    "layers": [
                        "8a5a3c06-dff7-48fc-8242-0f8dcf35885e"
                    ], 
                    "name": "Mixer1", 
                    "ports": [
                        {
                            "label": "port0", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 200, 
                            "y": 100
                        }, 
                        {
                            "label": "port1", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 0, 
                            "y": 100
                        }
                    ], 
                    "x-span": 200, 
                    "y-span": 200
                }, 
                {
                    "entity": "Mixer", 
                    "id": "9397efb3-2884-4ce6-a1df-096811c23390", 
                    "layers": [
                        "8a5a3c06-dff7-48fc-8242-0f8dcf35885e"
                    ], 
                    "name": "Mixer2", 
                    "ports": [
                        {
                            "label": "port0", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 200, 
                            "y": 100
                        }, 
                        {
                            "label": "port1", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 0, 
                            "y": 100
                        }
                    ], 
                    "x-span": 200, 
                    "y-span": 200
                }, 
                {
                    "entity": "Mixer", 
                    "id": "5e0121f2-a861-48fa-bd1b-9841fe23e0f2", 
                    "layers": [
                        "8a5a3c06-dff7-48fc-8242-0f8dcf35885e"
                    ], 
                    "name": "Mixer3", 
                    "ports": [
                        {
                            "label": "port0", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 200, 
                            "y": 100
                        }, 
                        {
                            "label": "port1", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 0, 
                            "y": 100
                        }
                    ], 
                    "x-span": 200, 
                    "y-span": 200
                }, 
                {
                    "entity": "Mixer", 
                    "id": "10d216d9-1564-47d1-bf13-c98dc9b5e65e", 
                    "layers": [
                        "8a5a3c06-dff7-48fc-8242-0f8dcf35885e"
                    ], 
                    "name": "Mixer4", 
                    "ports": [
                        {
                            "label": "port0", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 200, 
                            "y": 100
                        }, 
                        {
                            "label": "port1", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 0, 
                            "y": 100
                        }
                    ], 
                    "x-span": 200, 
                    "y-span": 200
                }, 
                {
                    "entity": "Heater", 
                    "id": "ba3435cd-1c9b-42b1-ae49-0cd09fbeaa44", 
                    "layers": [
                        "8a5a3c06-dff7-48fc-8242-0f8dcf35885e"
                    ], 
                    "name": "Heater1", 
                    "ports": [
                        {
                            "label": "port0", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 0, 
                            "y": 25
                        }, 
                        {
                            "label": "port1", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 100, 
                            "y": 25
                        }
                    ], 
                    "x-span": 100, 
                    "y-span": 50
                }, 
                {
                    "entity": "Heater", 
                    "id": "df5f5be1-ae6d-4650-8e7a-47929867b17e", 
                    "layers": [
                        "8a5a3c06-dff7-48fc-8242-0f8dcf35885e"
                    ], 
                    "name": "Heater2", 
                    "ports": [
                        {
                            "label": "port0", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 0, 
                            "y": 25
                        }, 
                        {
                            "label": "port1", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 100, 
                            "y": 25
                        }
                    ], 
                    "x-span": 100, 
                    "y-span": 50
                }, 
                {
                    "entity": "Heater", 
                    "id": "9053a293-8ab2-4a75-ab9d-5c95a7a91980", 
                    "layers": [
                        "8a5a3c06-dff7-48fc-8242-0f8dcf35885e"
                    ], 
                    "name": "Heater3", 
                    "ports": [
                        {
                            "label": "port0", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 0, 
                            "y": 25
                        }, 
                        {
                            "label": "port1", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 100, 
                            "y": 25
                        }
                    ], 
                    "x-span": 100, 
                    "y-span": 50
                }, 
                {
                    "entity": "Heater", 
                    "id": "f6d95479-3122-4909-a056-33cc2601a45c", 
                    "layers": [
                        "8a5a3c06-dff7-48fc-8242-0f8dcf35885e"
                    ], 
                    "name": "Heater4", 
                    "ports": [
                        {
                            "label": "port0", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 0, 
                            "y": 25
                        }, 
                        {
                            "label": "port1", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 100, 
                            "y": 25
                        }
                    ], 
                    "x-span": 100, 
                    "y-span": 50
                }, 
                {
                    "entity": "Filter", 
                    "id": "43f9c20d-a2e2-4eb1-a6b3-fe34de4e58e0", 
                    "layers": [
                        "8a5a3c06-dff7-48fc-8242-0f8dcf35885e"
                    ], 
                    "name": "Filter1", 
                    "ports": [
                        {
                            "label": "port0", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 25, 
                            "y": 0
                        }, 
                        {
                            "label": "port1", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 25, 
                            "y": 50
                        }
                    ], 
                    "x-span": 50, 
                    "y-span": 50
                }, 
                {
                    "entity": "Filter", 
                    "id": "d98ba8c0-e9e9-4265-b0d9-def5ca90e6d1", 
                    "layers": [
                        "8a5a3c06-dff7-48fc-8242-0f8dcf35885e"
                    ], 
                    "name": "Filter2", 
                    "ports": [
                        {
                            "label": "port0", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 25, 
                            "y": 0
                        }, 
                        {
                            "label": "port1", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 25, 
                            "y": 50
                        }
                    ], 
                    "x-span": 50, 
                    "y-span": 50
                }, 
                {
                    "entity": "Switch", 
                    "id": "df104300-c745-4b92-8d6a-d18c84ab66d7", 
                    "layers": [
                        "8a5a3c06-dff7-48fc-8242-0f8dcf35885e"
                    ], 
                    "name": "flow_switch3_0", 
                    "ports": [
                        {
                            "label": "port0", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 5, 
                            "y": 0
                        }, 
                        {
                            "label": "port1", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 5, 
                            "y": 10
                        }, 
                        {
                            "label": "port2", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 0, 
                            "y": 5
                        }, 
                        {
                            "label": "port3", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 10, 
                            "y": 5
                        }
                    ], 
                    "x-span": 10, 
                    "y-span": 10
                }, 
                {
                    "entity": "Switch", 
                    "id": "755fbbc3-d01f-4092-812b-400b2308cbfe", 
                    "layers": [
                        "8a5a3c06-dff7-48fc-8242-0f8dcf35885e"
                    ], 
                    "name": "flow_switch4_1", 
                    "ports": [
                        {
                            "label": "port0", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 5, 
                            "y": 0
                        }, 
                        {
                            "label": "port1", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 5, 
                            "y": 10
                        }, 
                        {
                            "label": "port2", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 0, 
                            "y": 5
                        }, 
                        {
                            "label": "port3", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 10, 
                            "y": 5
                        }
                    ], 
                    "x-span": 10, 
                    "y-span": 10
                }, 
                {
                    "entity": "Switch", 
                    "id": "3d1b7f34-be57-4c5c-b902-cd6411f67879", 
                    "layers": [
                        "8a5a3c06-dff7-48fc-8242-0f8dcf35885e"
                    ], 
                    "name": "flow_switch4_2", 
                    "ports": [
                        {
                            "label": "port0", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 5, 
                            "y": 0
                        }, 
                        {
                            "label": "port1", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 5, 
                            "y": 10
                        }, 
                        {
                            "label": "port2", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 0, 
                            "y": 5
                        }, 
                        {
                            "label": "port3", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 10, 
                            "y": 5
                        }
                    ], 
                    "x-span": 10, 
                    "y-span": 10
                }, 
                {
                    "entity": "Switch", 
                    "id": "27dc1d70-8aab-4c71-bb3a-895aed1e89cc", 
                    "layers": [
                        "8a5a3c06-dff7-48fc-8242-0f8dcf35885e"
                    ], 
                    "name": "flow_switch4_4", 
                    "ports": [
                        {
                            "label": "port0", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 5, 
                            "y": 0
                        }, 
                        {
                            "label": "port1", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 5, 
                            "y": 10
                        }, 
                        {
                            "label": "port2", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 0, 
                            "y": 5
                        }, 
                        {
                            "label": "port3", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 10, 
                            "y": 5
                        }
                    ], 
                    "x-span": 10, 
                    "y-span": 10
                }, 
                {
                    "entity": "Switch", 
                    "id": "7750e447-f6d7-47bd-b635-0c9abfe671e8", 
                    "layers": [
                        "8a5a3c06-dff7-48fc-8242-0f8dcf35885e"
                    ], 
                    "name": "flow_switch4_5", 
                    "ports": [
                        {
                            "label": "port0", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 5, 
                            "y": 0
                        }, 
                        {
                            "label": "port1", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 5, 
                            "y": 10
                        }, 
                        {
                            "label": "port2", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 0, 
                            "y": 5
                        }, 
                        {
                            "label": "port3", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 10, 
                            "y": 5
                        }
                    ], 
                    "x-span": 10, 
                    "y-span": 10
                }, 
                {
                    "entity": "Switch", 
                    "id": "ba1ab8a2-ad85-48ac-bfb2-b0c1ab53b97a", 
                    "layers": [
                        "8a5a3c06-dff7-48fc-8242-0f8dcf35885e"
                    ], 
                    "name": "flow_switch4_7", 
                    "ports": [
                        {
                            "label": "port0", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 5, 
                            "y": 0
                        }, 
                        {
                            "label": "port1", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 5, 
                            "y": 10
                        }, 
                        {
                            "label": "port2", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 0, 
                            "y": 5
                        }, 
                        {
                            "label": "port3", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 10, 
                            "y": 5
                        }
                    ], 
                    "x-span": 10, 
                    "y-span": 10
                }, 
                {
                    "entity": "Switch", 
                    "id": "5cbccf62-0509-47f3-b11e-cda4be7c275a", 
                    "layers": [
                        "8a5a3c06-dff7-48fc-8242-0f8dcf35885e"
                    ], 
                    "name": "flow_switch4_8", 
                    "ports": [
                        {
                            "label": "port0", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 5, 
                            "y": 0
                        }, 
                        {
                            "label": "port1", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 5, 
                            "y": 10
                        }, 
                        {
                            "label": "port2", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 0, 
                            "y": 5
                        }, 
                        {
                            "label": "port3", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 10, 
                            "y": 5
                        }
                    ], 
                    "x-span": 10, 
                    "y-span": 10
                }, 
                {
                    "entity": "Switch", 
                    "id": "18470007-8678-4bab-8bcd-850871c71542", 
                    "layers": [
                        "8a5a3c06-dff7-48fc-8242-0f8dcf35885e"
                    ], 
                    "name": "flow_switch4_9", 
                    "ports": [
                        {
                            "label": "port0", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 5, 
                            "y": 0
                        }, 
                        {
                            "label": "port1", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 5, 
                            "y": 10
                        }, 
                        {
                            "label": "port2", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 0, 
                            "y": 5
                        }, 
                        {
                            "label": "port3", 
                            "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                            "x": 10, 
                            "y": 5
                        }
                    ], 
                    "x-span": 10, 
                    "y-span": 10
                }
            ], 
            "connections": [
                {
                    "id": "273a695d-7503-4052-8435-1753a2fc751d", 
                    "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                    "name": "flow_switch3_0-Source1", 
                    "sinks": [
                        {
                            "component": "d64e9260-f42f-4b1c-886f-41828f4899af", 
                            "port": "port0"
                        }
                    ], 
                    "source": {
                        "component": "df104300-c745-4b92-8d6a-d18c84ab66d7", 
                        "port": "port2"
                    }
                }, 
                {
                    "id": "9c2b1d52-fdeb-462e-8aed-336b0cbf54e9", 
                    "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                    "name": "flow_switch3_0-Source2", 
                    "sinks": [
                        {
                            "component": "174b0fe7-f44d-4fc5-a657-b1cacffa98af", 
                            "port": "port0"
                        }
                    ], 
                    "source": {
                        "component": "df104300-c745-4b92-8d6a-d18c84ab66d7", 
                        "port": "port1"
                    }
                }, 
                {
                    "id": "35e9ee35-80f2-4c93-9ad7-35e680f8f3a5", 
                    "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                    "name": "flow_switch3_0-flow_switch4_1", 
                    "sinks": [
                        {
                            "component": "755fbbc3-d01f-4092-812b-400b2308cbfe", 
                            "port": "port2"
                        }
                    ], 
                    "source": {
                        "component": "df104300-c745-4b92-8d6a-d18c84ab66d7", 
                        "port": "port3"
                    }
                }, 
                {
                    "id": "cc292d91-5918-497b-ae7b-044748d85208", 
                    "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                    "name": "flow_switch4_1-flow_switch4_2", 
                    "sinks": [
                        {
                            "component": "3d1b7f34-be57-4c5c-b902-cd6411f67879", 
                            "port": "port2"
                        }
                    ], 
                    "source": {
                        "component": "755fbbc3-d01f-4092-812b-400b2308cbfe", 
                        "port": "port1"
                    }
                }, 
                {
                    "id": "f619a6d5-4cca-4965-b751-bd70aeefe56c", 
                    "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                    "name": "flow_switch4_1-flow_switch4_4", 
                    "sinks": [
                        {
                            "component": "27dc1d70-8aab-4c71-bb3a-895aed1e89cc", 
                            "port": "port1"
                        }
                    ], 
                    "source": {
                        "component": "755fbbc3-d01f-4092-812b-400b2308cbfe", 
                        "port": "port0"
                    }
                }, 
                {
                    "id": "b3781a75-0dcb-4aec-a007-5e1074f61e1d", 
                    "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                    "name": "flow_switch4_2-flow_switch4_5", 
                    "sinks": [
                        {
                            "component": "7750e447-f6d7-47bd-b635-0c9abfe671e8", 
                            "port": "port1"
                        }
                    ], 
                    "source": {
                        "component": "3d1b7f34-be57-4c5c-b902-cd6411f67879", 
                        "port": "port1"
                    }
                }, 
                {
                    "id": "d600c466-91a5-4d53-900a-d9acdd43baf4", 
                    "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                    "name": "flow_switch4_2-Mixer1", 
                    "sinks": [
                        {
                            "component": "605959bc-808a-46db-a838-0e3d77868fab", 
                            "port": "port1"
                        }
                    ], 
                    "source": {
                        "component": "3d1b7f34-be57-4c5c-b902-cd6411f67879", 
                        "port": "port3"
                    }
                }, 
                {
                    "id": "c6d59b97-3404-4587-9370-bd36ccc3b680", 
                    "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                    "name": "flow_switch4_2-Mixer2", 
                    "sinks": [
                        {
                            "component": "9397efb3-2884-4ce6-a1df-096811c23390", 
                            "port": "port1"
                        }
                    ], 
                    "source": {
                        "component": "3d1b7f34-be57-4c5c-b902-cd6411f67879", 
                        "port": "port0"
                    }
                }, 
                {
                    "id": "f17688bc-1660-4c9f-9da6-6f22dd1c5985", 
                    "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                    "name": "flow_switch4_4-flow_switch4_7", 
                    "sinks": [
                        {
                            "component": "ba1ab8a2-ad85-48ac-bfb2-b0c1ab53b97a", 
                            "port": "port2"
                        }
                    ], 
                    "source": {
                        "component": "27dc1d70-8aab-4c71-bb3a-895aed1e89cc", 
                        "port": "port0"
                    }
                }, 
                {
                    "id": "998bf0cb-14ef-4a00-bb89-5fbaba3afffe", 
                    "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                    "name": "flow_switch4_4-Mixer3", 
                    "sinks": [
                        {
                            "component": "5e0121f2-a861-48fa-bd1b-9841fe23e0f2", 
                            "port": "port0"
                        }
                    ], 
                    "source": {
                        "component": "27dc1d70-8aab-4c71-bb3a-895aed1e89cc", 
                        "port": "port2"
                    }
                }, 
                {
                    "id": "4f11f993-c241-435d-9160-7b7235ba880b", 
                    "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                    "name": "flow_switch4_4-Mixer4", 
                    "sinks": [
                        {
                            "component": "10d216d9-1564-47d1-bf13-c98dc9b5e65e", 
                            "port": "port1"
                        }
                    ], 
                    "source": {
                        "component": "27dc1d70-8aab-4c71-bb3a-895aed1e89cc", 
                        "port": "port3"
                    }
                }, 
                {
                    "id": "b52feb9d-881f-4f02-8a13-beae560dfe41", 
                    "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                    "name": "flow_switch4_5-flow_switch4_8", 
                    "sinks": [
                        {
                            "component": "5cbccf62-0509-47f3-b11e-cda4be7c275a", 
                            "port": "port3"
                        }
                    ], 
                    "source": {
                        "component": "7750e447-f6d7-47bd-b635-0c9abfe671e8", 
                        "port": "port2"
                    }
                }, 
                {
                    "id": "29b37e16-0c83-406e-8fbf-1bca0f150bf6", 
                    "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                    "name": "flow_switch4_5-Heater1", 
                    "sinks": [
                        {
                            "component": "ba3435cd-1c9b-42b1-ae49-0cd09fbeaa44", 
                            "port": "port0"
                        }
                    ], 
                    "source": {
                        "component": "7750e447-f6d7-47bd-b635-0c9abfe671e8", 
                        "port": "port3"
                    }
                }, 
                {
                    "id": "feebd246-58eb-4afe-b142-aa1b68a49d07", 
                    "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                    "name": "flow_switch4_5-Heater2", 
                    "sinks": [
                        {
                            "component": "df5f5be1-ae6d-4650-8e7a-47929867b17e", 
                            "port": "port0"
                        }
                    ], 
                    "source": {
                        "component": "7750e447-f6d7-47bd-b635-0c9abfe671e8", 
                        "port": "port0"
                    }
                }, 
                {
                    "id": "746c88b3-5640-401d-96b4-f84fb9769524", 
                    "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                    "name": "flow_switch4_7-flow_switch4_8", 
                    "sinks": [
                        {
                            "component": "5cbccf62-0509-47f3-b11e-cda4be7c275a", 
                            "port": "port2"
                        }
                    ], 
                    "source": {
                        "component": "ba1ab8a2-ad85-48ac-bfb2-b0c1ab53b97a", 
                        "port": "port1"
                    }
                }, 
                {
                    "id": "547b0e65-5752-43a3-b7ee-86c5697d5c84", 
                    "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                    "name": "flow_switch4_7-Heater3", 
                    "sinks": [
                        {
                            "component": "9053a293-8ab2-4a75-ab9d-5c95a7a91980", 
                            "port": "port0"
                        }
                    ], 
                    "source": {
                        "component": "ba1ab8a2-ad85-48ac-bfb2-b0c1ab53b97a", 
                        "port": "port3"
                    }
                }, 
                {
                    "id": "8e53fe73-00d1-4dda-9cd8-3ee5b0e9fc8c", 
                    "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                    "name": "flow_switch4_7-Heater4", 
                    "sinks": [
                        {
                            "component": "f6d95479-3122-4909-a056-33cc2601a45c", 
                            "port": "port0"
                        }
                    ], 
                    "source": {
                        "component": "ba1ab8a2-ad85-48ac-bfb2-b0c1ab53b97a", 
                        "port": "port0"
                    }
                }, 
                {
                    "id": "f101048d-bc89-45e1-b1d2-3d652d1c0cd9", 
                    "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                    "name": "flow_switch4_8-flow_switch4_9", 
                    "sinks": [
                        {
                            "component": "18470007-8678-4bab-8bcd-850871c71542", 
                            "port": "port1"
                        }
                    ], 
                    "source": {
                        "component": "5cbccf62-0509-47f3-b11e-cda4be7c275a", 
                        "port": "port0"
                    }
                }, 
                {
                    "id": "38593bf0-034c-46ad-b601-e4b2e918858e", 
                    "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                    "name": "flow_switch4_9-Filter1", 
                    "sinks": [
                        {
                            "component": "43f9c20d-a2e2-4eb1-a6b3-fe34de4e58e0", 
                            "port": "port1"
                        }
                    ], 
                    "source": {
                        "component": "18470007-8678-4bab-8bcd-850871c71542", 
                        "port": "port3"
                    }
                }, 
                {
                    "id": "5a9bf474-d0b0-496a-965e-7758339d96b6", 
                    "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                    "name": "flow_switch4_9-Filter2", 
                    "sinks": [
                        {
                            "component": "d98ba8c0-e9e9-4265-b0d9-def5ca90e6d1", 
                            "port": "port1"
                        }
                    ], 
                    "source": {
                        "component": "18470007-8678-4bab-8bcd-850871c71542", 
                        "port": "port0"
                    }
                }, 
                {
                    "id": "68663961-3315-4915-8b13-e148d7210c8f", 
                    "layer": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                    "name": "flow_switch4_9-Out1", 
                    "sinks": [
                        {
                            "component": "1fd596b1-a033-455a-a384-bf0fa1eda437", 
                            "port": "port0"
                        }
                    ], 
                    "source": {
                        "component": "18470007-8678-4bab-8bcd-850871c71542", 
                        "port": "port2"
                    }
                }
            ], 
            "layers": [
                {
                    "id": "8a5a3c06-dff7-48fc-8242-0f8dcf35885e", 
                    "name": "flow"
                }
            ], 
            "name": "Planar_Synthetic_1"
        }`;
