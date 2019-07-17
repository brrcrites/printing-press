const Component = require('../../model/component.js');
const Port = require('../../model/port.js');
const Coord = require('../../model/coord.js');
const ComponentFeature = require('../../model/component-feature.js');
const Validation = require('../../utils/validation.js');

//Suppress console logs
console.log = jest.fn();

var port00 = new Port('port-1-label', new Coord(0, 0));
var port05 = new Port('port-2-label', new Coord(0, 5));
var feature66 = new ComponentFeature(new Coord(6, 6), 10);
var feature5050 = new ComponentFeature(new Coord(50, 50), 5);

describe('initialization', () => {
    describe('constructor', () => {
        test('parameters', () => {
            let cVal = new Component('name', 'id', 10, 20, 'entity', [port00, port05], [feature66, feature5050]);

            expect(cVal.name).toBe('name');
            expect(cVal.id).toBe('id');
            expect(cVal.xSpan).toBe(10);
            expect(cVal.ySpan).toBe(20);
            expect(cVal.entity).toBe('entity');
            expect(cVal.ports).toEqual([port00, port05]);
            expect(cVal.features).toEqual([feature66, feature5050]);
        });

        test('default', () => {
            let cDef = new Component();

            expect(cDef.name).toBe(Validation.DEFAULT_STR_VALUE);
            expect(cDef.id).toBe(Validation.DEFAULT_STR_VALUE);
            expect(cDef.xSpan).toBe(Validation.DEFAULT_SPAN_VALUE);
            expect(cDef.ySpan).toBe(Validation.DEFAULT_SPAN_VALUE);
            expect(cDef.entity).toBe(Validation.DEFAULT_STR_VALUE);
            expect(cDef.ports).toEqual([]);
            expect(cDef.features).toEqual([]);
        });
    });

    test('modify fields', () => {
        let c = new Component();

        c.name = 'name';
        c.id = 'id';
        c.xSpan = 10;
        c.ySpan = 15;
        c.entity = 'entity';
        c.ports = [new Port(), new Port()];
        c.features = [feature66, feature5050];

        expect(c.name).toBe('name');
        expect(c.id).toBe('id');
        expect(c.xSpan).toBe(10);
        expect(c.ySpan).toBe(15);
        expect(c.entity).toBe('entity');
        expect(c.ports).toEqual([new Port(), new Port()]);
        expect(c.features).toEqual([feature66, feature5050]);
    });
});

describe('validation', () => {
    describe('valid', () => {
        test('all fields', () => {
            let goodComp = new Component('comp-name', 'comp-id', 10, 10, 'comp-entity', [port00, port05],
                    [feature66, feature5050]);

            expect(goodComp.validate()).toBe(true);
        });

        test('empty features', () => {
            let c = new Component('comp-name', 'comp-id', 10, 10, 'comp-entity', [port00, port05]);

            expect(c.validate()).toBe(true);
        });
    });

    describe('invalid', () => {
        test('values', () => {
            let badComp = new Component('', '', -123, 0, '', [new Port(), new Port()],
                    [feature66, feature5050]);

            expect(badComp.validate()).toBe(false);
        });

        test('name value', () => {
            let badNameComp = new Component('', 'comp-id', 10, 10, 'comp-entity', [port00, port05],
                    [feature66, feature5050]);

            expect(badNameComp.validate()).toBe(false);
        });

        test('ID value', () => {
            let badIDComp = new Component('comp-name', '', 10, 10, 'comp-entity', [port00, port05],
                    [feature66, feature5050]);

            expect(badIDComp.validate()).toBe(false);
        });

        test('x-span value', () => {
            let badXSpanComp = new Component('comp-name', 'comp-id', -312423, 10, 'comp-entity', [port00, port05],
                    [feature66, feature5050]);

            expect(badXSpanComp.validate()).toBe(false);
        });

        test('y-span value', () => {
            let badYSpanComp = new Component('comp-name', 'comp-id', 10, 0, 'comp-entity', [port00, port05],
                    [feature66, feature5050]);

            expect(badYSpanComp.validate()).toBe(false);
        });

        test('entity value', () => {
            let badEntityComp = new Component('comp-name', 'comp-id', 10, 10, '', [port00, port05],
                    [feature66, feature5050]);

            expect(badEntityComp.validate()).toBe(false);
        });

        test('port value', () => {
            let badPortComp = new Component('comp-name', 'comp-id', 10, 10, 'comp-entity', [new Port(), new Port()],
                    [feature66, feature5050]);

            expect(badPortComp.validate()).toBe(false);
        });

        test('duplicate port labels', () => {
            let c = new Component('comp-name', 'comp-id', 10, 10, 'comp-entity',
                    [new Port('port-name', new Coord(5, 0)), new Port('port-name', new Coord(0, 5))],
                    [feature66, feature5050]);

            expect(c.validate()).toBe(false);
        });

        test('overlapping port locations', () => {
            let c = new Component('comp-name', 'comp-id', 10, 10, 'comp-entity',
                    [new Port('port-1', new Coord(5, 0)), new Port('port-2', new Coord(5, 0))],
                    [feature66, feature5050]);

            expect(c.validate()).toBe(false);
        });

        test('port locations', () => {
            let c = new Component('comp-name', 'comp-id', 10, 10, 'comp-entity',
                    [new Port('port-1', new Coord())], [feature66, feature5050]);

            c.ports[0].pos.setLocation(0, 0);
            expect(c.validate()).toBe(true);

            c.ports[0].pos.setLocation(4, 10);
            expect(c.validate()).toBe(true);

            c.ports[0].pos.setLocation(3, 6);
            expect(c.validate()).toBe(false);

            c.ports[0].pos.setLocation(0, 456);
            expect(c.validate()).toBe(false);
        });

        test('features', () => {
            let c = new Component('comp-name', 'comp-id', 10, 10, 'comp-entity', [port00, port05],
                    [new ComponentFeature(), new ComponentFeature()]);

            expect(c.validate()).toBe(false);
        });
    });




    describe('defaults', () => {

        test('values', () => {
            let def = new Component();

            expect(def.validate()).toBe(false);
        });

        test('name value', () => {
            let defName = new Component(Validation.DEFAULT_STR_VALUE, 'comp-id', 10, 10, 'comp-entity',
                    [port00, port05], [feature66, feature5050]);

            expect(defName.validate()).toBe(false);
        });

        test('ID value', () => {
            let defID = new Component('comp-name', Validation.DEFAULT_STR_VALUE, 10, 10, 'comp-entity',
                    [port00, port05], [feature66, feature5050]);

            expect(defID.validate()).toBe(false);
        });

        test('x-span value', () => {
            let defXSpan = new Component('comp-name', 'comp-id', Validation.DEFAULT_SPAN_VALUE, 10, 'comp-entity',
                    [port00, port05], [feature66, feature5050]);

            expect(defXSpan.validate()).toBe(false);
        });

        test('y-span value', () => {
            let defYSpan = new Component('comp-name', 'comp-id', 10, Validation.DEFAULT_SPAN_VALUE, 'comp-entity',
                    [port00, port05], [feature66, feature5050]);

            expect(defYSpan.validate()).toBe(false);
        });

        test('entity value', () => {
            let defEntity = new Component('comp-name', 'comp-id', 10, 10, Validation.DEFAULT_STR_VALUE,
                    [port00, port05], [feature66, feature5050]);

            expect(defEntity.validate()).toBe(false);
        });

        test('ports value', () => {
            let defPorts = new Component('comp-name', 'comp-id', 10, 10, 'comp-entity', [], [feature66, feature5050]);

            expect(defPorts.validate()).toBe(false);
        });
    });
});

