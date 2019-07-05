const Component = require('../model/component.js');
const Port = require('../model/port.js');
const Coord = require('../model/coord.js');
const Validation = require('../utils/validation.js');

//Suppress console logs
console.log = jest.fn();

var layer1 = 'layer-1-id';
var layer2 = 'layer-2-id';
var port00 = new Port('port-1-label', layer1, new Coord(0, 0));
var port05 = new Port('port-2-label', layer2, new Coord(0, 5));

test('initialize Component: parameters', () => {
    let cVal = new Component('name', 'id', [layer1, layer2], 10, 20, 'entity', [port00, port05]);

    expect(cVal.name).toBe('name');
    expect(cVal.id).toBe('id');
    expect(cVal.layers).toEqual([layer1, layer2]);
    expect(cVal.xSpan).toBe(10);
    expect(cVal.ySpan).toBe(20);
    expect(cVal.entity).toBe('entity');
    expect(cVal.ports).toEqual([port00, port05]);
});

test('initialize Component: default', () => {
    let cDef = new Component();

    expect(cDef.name).toBe(Validation.DEFAULT_STR_VALUE);
    expect(cDef.id).toBe(Validation.DEFAULT_STR_VALUE);
    expect(cDef.layers).toEqual([]);
    expect(cDef.xSpan).toBe(Validation.DEFAULT_SPAN_VALUE);
    expect(cDef.ySpan).toBe(Validation.DEFAULT_SPAN_VALUE);
    expect(cDef.entity).toBe(Validation.DEFAULT_STR_VALUE);
    expect(cDef.ports).toEqual([]);
});

test('modify Component', () => {
    let c = new Component();

    c.name = 'name';
    c.id = 'id';
    c.layers = [layer1, layer2];
    c.xSpan = 10;
    c.ySpan = 15;
    c.entity = 'entity';
    c.ports = [new Port(), new Port()];

    expect(c.name).toBe('name');
    expect(c.id).toBe('id');
    expect(c.layers).toEqual([layer1, layer2]);
    expect(c.xSpan).toBe(10);
    expect(c.ySpan).toBe(15);
    expect(c.entity).toBe('entity');
    expect(c.ports).toEqual([new Port(), new Port()]);
});

test('validate Component: valid values', () => {
    let goodComp = new Component('comp-name', 'comp-id', [layer1, layer2], 10, 10, 'comp-entity', [port00, port05]);

    expect(goodComp.validate()).toBe(true);
});

test('validate Component: invalid values', () => {
    let badComp = new Component('', '', [layer1, ''], -123, 0, '', [new Port(), new Port()]);

    expect(badComp.validate()).toBe(false);
});

test('validate Component: invalid name value', () => {
    let badNameComp = new Component('', 'comp-id', [layer1, layer2], 10, 10, 'comp-entity', [port00, port05]);

    expect(badNameComp.validate()).toBe(false);
});

test('validate Component: invalid ID value', () => {
    let badIDComp = new Component('comp-name', '', [layer1, layer2], 10, 10, 'comp-entity', [port00, port05]);

    expect(badIDComp.validate()).toBe(false);
});

test('validate Component: invalid layer value', () => {
    let badLayerComp = new Component('comp-name', 'comp-id', [layer1, ''], 10, 10, 'comp-entity', [port00, port05]);

    expect(badLayerComp.validate()).toBe(false);
});

test('validate Component: invalid x-span value', () => {
    let badXSpanComp = new Component('comp-name', 'comp-id', [layer1, layer2], -312423, 10, 'comp-entity', [port00, port05]);

    expect(badXSpanComp.validate()).toBe(false);
});

test('validate Component: invalid y-span value', () => {
    let badYSpanComp = new Component('comp-name', 'comp-id', [layer1, layer2], 10, 0, 'comp-entity', [port00, port05]);

    expect(badYSpanComp.validate()).toBe(false);
});

test('validate Component: invalid entity value', () => {
    let badEntityComp = new Component('comp-name', 'comp-id', [layer1, layer2], 10, 10, '', [port00, port05]);

    expect(badEntityComp.validate()).toBe(false);
});

test('validate Component: invalid port value', () => {
    let badPortComp = new Component('comp-name', 'comp-id', [layer1, layer2], 10, 10, 'comp-entity', [new Port(), new Port()]);

    expect(badPortComp.validate()).toBe(false);
});

test('validate Component: duplicate port labels', () => {
    let c = new Component('comp-name', 'comp-id', [layer1, layer2], 10, 10, 'comp-entity',
            [new Port('port-name', layer1, new Coord(5, 0)), new Port('port-name', layer1, new Coord(0, 5))]);

    expect(c.validate()).toBe(false);
});

test('validate Component: invalid port layers', () => {
    let c = new Component('comp-name', 'comp-id', [layer1, layer2], 10, 10, 'comp-entity',
            [new Port('port-1', 'bad-layer', new Coord(5, 0)), new Port('port-2', layer1, new Coord(0, 5))]);

    expect(c.validate()).toBe(false);
});

test('validate Component: overlapping port locations', () => {
    let c = new Component('comp-name', 'comp-id', [layer1, layer2], 10, 10, 'comp-entity',
            [new Port('port-1', layer1, new Coord(5, 0)), new Port('port-2', layer1, new Coord(5, 0))]);

    expect(c.validate()).toBe(false);
});

test('validate Component: port locations', () => {
    let c = new Component('comp-name', 'comp-id', [layer1, layer2], 10, 10, 'comp-entity',
            [new Port('port-1', layer1, new Coord())]);

    c.ports[0].pos.setLocation(0, 0);
    expect(c.validate()).toBe(true);

    c.ports[0].pos.setLocation(4, 10);
    expect(c.validate()).toBe(true);

    c.ports[0].pos.setLocation(3, 6);
    expect(c.validate()).toBe(false);

    c.ports[0].pos.setLocation(0, 456);
    expect(c.validate()).toBe(false);
});

test('validate Component: default values', () => {
    let def = new Component();

    expect(def.validate()).toBe(false);
});

test('validate Component: default name value', () => {
    let defName = new Component(Validation.DEFAULT_STR_VALUE, 'comp-id', [layer1, layer2], 10, 10, 'comp-entity',
            [port00, port05]);

    expect(defName.validate()).toBe(false);
});

test('validate Component: default ID value', () => {
    let defID = new Component('comp-name', Validation.DEFAULT_STR_VALUE, [layer1, layer2], 10, 10, 'comp-entity',
            [port00, port05]);

    expect(defID.validate()).toBe(false);
});

test('validate Component: default layers value', () => {
    let defLabel = new Component('comp-name', 'comp-id', [], 10, 10, 'comp-entity',
            [port00, port05]);

    expect(defLabel.validate()).toBe(false);
});

test('validate Component: default x-span value', () => {
    let defXSpan = new Component('comp-name', 'comp-id', [layer1, layer2], Validation.DEFAULT_SPAN_VALUE, 10, 'comp-entity',
            [port00, port05]);

    expect(defXSpan.validate()).toBe(false);
});

test('validate Component: default y-span value', () => {
    let defYSpan = new Component('comp-name', 'comp-id', [layer1, layer2], 10, Validation.DEFAULT_SPAN_VALUE, 'comp-entity',
            [port00, port05]);

    expect(defYSpan.validate()).toBe(false);
});

test('validate Component: default entity value', () => {
    let defEntity = new Component('comp-name', 'comp-id', [layer1, layer2], 10, 10, Validation.DEFAULT_STR_VALUE,
            [port00, port05]);

    expect(defEntity.validate()).toBe(false);
});

test('validate Component: default ports value', () => {
    let defPorts = new Component('comp-name', 'comp-id', [layer1, layer2], 10, 10, 'comp-entity');

    expect(defPorts.validate()).toBe(false);
});
