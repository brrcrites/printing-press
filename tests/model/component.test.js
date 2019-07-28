const Component = require('../../model/component.js');
const Port = require('../../model/port.js');
const Coord = require('../../model/coord.js');
const ComponentFeature = require('../../model/component-feature.js');
const Validation = require('../../utils/validation.js');

//Suppress console logs
console.log = jest.fn();

var port10_0 = new Port('port-1-label', new Coord(10, 0));
var port0_5 = new Port('port-2-label', new Coord(0, 5));
var feature6_60 = new ComponentFeature('comp-name', 'layer', 10, 20, new Coord(6, 60), 11);

describe('initialization', () => {
    describe('constructor', () => {
        test('parameters', () => {
            let cVal = new Component('comp-name', 'id', 10, 20, 'entity', [port10_0, port0_5], feature6_60);

            expect(cVal.name).toBe('comp-name');
            expect(cVal.id).toBe('id');
            expect(cVal.xSpan).toBe(10);
            expect(cVal.ySpan).toBe(20);
            expect(cVal.entity).toBe('entity');
            expect(cVal.ports).toEqual([port10_0, port0_5]);
            expect(cVal.feature).toEqual(feature6_60);
        });

        test('default', () => {
            let cDef = new Component();

            expect(cDef.name).toBe(Validation.DEFAULT_STR_VALUE);
            expect(cDef.id).toBe(Validation.DEFAULT_STR_VALUE);
            expect(cDef.xSpan).toBe(Validation.DEFAULT_SPAN_VALUE);
            expect(cDef.ySpan).toBe(Validation.DEFAULT_SPAN_VALUE);
            expect(cDef.entity).toBe(Validation.DEFAULT_STR_VALUE);
            expect(cDef.ports).toEqual([]);
            expect(cDef.feature).toEqual(null);
        });
    });

    test('modify fields', () => {
        let c = new Component();

        c.name = 'comp-name';
        c.id = 'id';
        c.xSpan = 10;
        c.ySpan = 20;
        c.entity = 'entity';
        c.ports = [new Port(), new Port()];
        c.feature = feature6_60;

        expect(c.name).toBe('comp-name');
        expect(c.id).toBe('id');
        expect(c.xSpan).toBe(10);
        expect(c.ySpan).toBe(20);
        expect(c.entity).toBe('entity');
        expect(c.ports).toEqual([new Port(), new Port()]);
        expect(c.feature).toEqual(feature6_60);
    });
});

describe('validation', () => {
    describe('valid', () => {
        test('all fields', () => {
            let goodComp = new Component('comp-name', 'comp-id', 10, 20, 'comp-entity', [port10_0, port0_5],
                    feature6_60);

            expect(goodComp.validate()).toBe(true);
        });

        test('unset feature', () => {
            let c = new Component('comp-name', 'comp-id', 10, 10, 'comp-entity', [port10_0, port0_5]);

            expect(c.validate()).toBe(true);
        });
    });

    describe('invalid', () => {
        test('values', () => {
            let badComp = new Component('', '', -123, 0, '', [new Port(), new Port()],
                    feature6_60);

            expect(badComp.validate()).toBe(false);
        });

        describe('name value', () => {
            test('invalid', () => {
                let badNameComp = new Component('', 'comp-id', 10, 20, 'comp-entity', [port10_0, port0_5],
                        feature6_60);

                expect(badNameComp.validate()).toBe(false);
            });

            test('non matching feature', () => {
                let badNameComp = new Component('doesn\'t-match', 'comp-id', 10, 20, 'comp-entity', [port10_0, port0_5],
                        feature6_60);

                expect(badNameComp.validate()).toBe(false);
            });
        });

        test('ID value', () => {
            let badIDComp = new Component('comp-name', '', 10, 20, 'comp-entity', [port10_0, port0_5],
                    feature6_60);

            expect(badIDComp.validate()).toBe(false);
        });

        describe('x-span value', () => {
            test('negative', () => {
                let badXSpanComp = new Component('comp-name', 'comp-id', -312423, 20, 'comp-entity', [port10_0, port0_5],
                        feature6_60);

                expect(badXSpanComp.validate()).toBe(false);
            });

            test('non matching feature', () => {
                let badXSpanComp = new Component('comp-name', 'comp-id', 40, 20, 'comp-entity', [port10_0, port0_5],
                        feature6_60);

                expect(badXSpanComp.validate()).toBe(false);
            });
        });

        describe('y-span value', () => {
            test('negative', () => {
                let badYSpanComp = new Component('comp-name', 'comp-id', 10, -23, 'comp-entity', [port10_0, port0_5],
                        feature6_60);

                expect(badYSpanComp.validate()).toBe(false);
            });

            test('non matching feature', () => {
                let badYSpanComp = new Component('comp-name', 'comp-id', 10, 23, 'comp-entity', [port10_0, port0_5],
                        feature6_60);

                expect(badYSpanComp.validate()).toBe(false);
            });
        });

        test('entity value', () => {
            let badEntityComp = new Component('comp-name', 'comp-id', 10, 20, '', [port10_0, port0_5],
                    feature6_60);

            expect(badEntityComp.validate()).toBe(false);
        });

        test('port value', () => {
            let badPortComp = new Component('comp-name', 'comp-id', 10, 20, 'comp-entity', [new Port(), new Port()],
                    feature6_60);

            expect(badPortComp.validate()).toBe(false);
        });

        test('duplicate port labels', () => {
            let c = new Component('comp-name', 'comp-id', 10, 20, 'comp-entity',
                    [new Port('port-name', new Coord(5, 0)), new Port('port-name', new Coord(0, 5))],
                    feature6_60);

            expect(c.validate()).toBe(false);
        });

        /* TODO: Add this back in after layers has been fixed in Port
        test('port layers', () => {
            let c = new Component('comp-name', 'comp-id', 10, 10, 'comp-entity',
                    [new Port('port-1', 'bad-layer', new Coord(5, 0)), new Port('port-2', layer1, new Coord(0, 5))],
                    [feature66, feature5050]);

            expect(c.validate()).toBe(false);
        });
        */

        test('overlapping port locations', () => {
            let c = new Component('comp-name', 'comp-id', 10, 20, 'comp-entity',
                    [new Port('port-1', new Coord(5, 0)), new Port('port-2', new Coord(5, 0))],
                    feature6_60);

            expect(c.validate()).toBe(false);
        });

        test('port locations', () => {
            let c = new Component('comp-name', 'comp-id', 10, 20, 'comp-entity',
                    [new Port('port-1', new Coord())], feature6_60);

            c.ports[0].pos.setLocation(0, 0);
            expect(c.validate()).toBe(true);

            c.ports[0].pos.setLocation(4, 20);
            expect(c.validate()).toBe(true);

            c.ports[0].pos.setLocation(3, 6);
            expect(c.validate()).toBe(false);

            c.ports[0].pos.setLocation(0, 456);
            expect(c.validate()).toBe(false);
        });

        test('features', () => {
            let c = new Component('comp-name', 'comp-id', 10, 20, 'comp-entity', [port10_0, port0_5],
                    new ComponentFeature());

            expect(c.validate()).toBe(false);
        });
    });




    describe('defaults', () => {

        test('values', () => {
            let def = new Component();

            expect(def.validate()).toBe(false);
        });

        test('name value', () => {
            let defName = new Component(Validation.DEFAULT_STR_VALUE, 'comp-id', 10, 20, 'comp-entity',
                    [port10_0, port0_5], feature6_60);

            expect(defName.validate()).toBe(false);
        });

        test('ID value', () => {
            let defID = new Component('comp-name', Validation.DEFAULT_STR_VALUE, 10, 20, 'comp-entity',
                    [port10_0, port0_5], feature6_60);

            expect(defID.validate()).toBe(false);
        });

        test('x-span value', () => {
            let defXSpan = new Component('comp-name', 'comp-id', Validation.DEFAULT_SPAN_VALUE, 20, 'comp-entity',
                    [port10_0, port0_5], feature6_60);

            expect(defXSpan.validate()).toBe(false);
        });

        test('y-span value', () => {
            let defYSpan = new Component('comp-name', 'comp-id', 10, Validation.DEFAULT_SPAN_VALUE, 'comp-entity',
                    [port10_0, port0_5], feature6_60);

            expect(defYSpan.validate()).toBe(false);
        });

        test('entity value', () => {
            let defEntity = new Component('comp-name', 'comp-id', 10, 20, Validation.DEFAULT_STR_VALUE,
                    [port10_0, port0_5], feature6_60);

            expect(defEntity.validate()).toBe(false);
        });

        test('ports value', () => {
            let defPorts = new Component('comp-name', 'comp-id', 10, 20, 'comp-entity', [], feature6_60);

            expect(defPorts.validate()).toBe(false);
        });
    });
});

