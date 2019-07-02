const ParchKey = require('../model/parch-key.js');
const Component = require('../model/component.js');
const Port = require('../model/port.js');
const Coord = require('../model/coord.js');

//Suppress console logs
console.log = jest.fn();

var l1 = 'layer-1-id';
var l2 = 'layer-2-id';
var p1 = new Port('port-1-label', l1, new Coord(0, 0));
var p2 = new Port('port-2-label', l2, new Coord(0, 5));

test('initialize Component: parameters', () => {
    let cVal = new Component('name', 'id', [l1, l2], 10, 10, 'entity', [new Port(), new Port()]);

    expect(cVal.name).toBe('name');
    expect(cVal.id).toBe('id');
    expect(cVal.layers).toEqual([l1, l2]);
    expect(cVal.xSpan).toBe(10);
    expect(cVal.ySpan).toBe(10);
    expect(cVal.entity).toBe('entity');
    expect(cVal.ports).toEqual([new Port(), new Port()]);
});

test('initialize Component: default', () => {
    let cDef = new Component();

    expect(cDef.name).toBe(ParchKey.DEFAULT_STR_VALUE);
    expect(cDef.id).toBe(ParchKey.DEFAULT_STR_VALUE);
    expect(cDef.layers).toBe(null);
    expect(cDef.xSpan).toBe(Component.DEFAULT_SPAN_VALUE);
    expect(cDef.ySpan).toBe(Component.DEFAULT_SPAN_VALUE);
    expect(cDef.entity).toBe(ParchKey.DEFAULT_STR_VALUE);
    expect(cDef.ports).toBe(null);
});

test('modify Component', () => {
    let c = new Component();

    c.name = 'name';
    c.id = 'id';
    c.layers = [l1, l2];
    c.xSpan = 10;
    c.ySpan = 15;
    c.entity = 'entity';
    c.ports = [new Port(), new Port()];

    expect(c.name).toBe('name');
    expect(c.id).toBe('id');
    expect(c.layers).toEqual([l1, l2]);
    expect(c.xSpan).toBe(10);
    expect(c.ySpan).toBe(15);
    expect(c.entity).toBe('entity');
    expect(c.ports).toEqual([new Port(), new Port()]);
});

test('validate Component: valid values', () => {
    let goodComp = new Component('comp-name', 'comp-id', [l1, l2], 10, 10, 'comp-entity', [p1, p2]);
    expect(goodComp.validate()).toBe(true);
});

test('validate Component: invalid values', () => {
    let badComp = new Component('', '', [l1, ''], -123, 0, '', [new Port(), new Port()]);
    let badNameComp = new Component('', 'comp-id', [l1, l2], 10, 10, 'comp-entity', [p1, p2]);
    let badIDComp = new Component('comp-name', '', [l1, l2], 10, 10, 'comp-entity', [p1, p2]);
    let badLayerComp = new Component('comp-name', 'comp-id', [l1, ''], 10, 10, 'comp-entity', [p1, p2]);
    let badXSpanComp = new Component('comp-name', 'comp-id', [l1, l2], -312423, 10, 'comp-entity', [p1, p2]);
    let badYSpanComp = new Component('comp-name', 'comp-id', [l1, l2], 10, 0, 'comp-entity', [p1, p2]);
    let badEntityComp = new Component('comp-name', 'comp-id', [l1, l2], 10, 10, '', [p1, p2]);
    let badPortComp = new Component('comp-name', 'comp-id', [l1, l2], 10, 10, 'comp-entity', [new Port(), new Port()]);

    expect(badComp.validate()).toBe(false);
    expect(badNameComp.validate()).toBe(false);
    expect(badIDComp.validate()).toBe(false);
    expect(badLayerComp.validate()).toBe(false);
    expect(badXSpanComp.validate()).toBe(false);
    expect(badYSpanComp.validate()).toBe(false);
    expect(badEntityComp.validate()).toBe(false);
    expect(badPortComp.validate()).toBe(false);
});

test('validate Component: duplicate port labels', () => {
    let c = new Component('comp-name', 'comp-id', [l1, l2], 10, 10, 'comp-entity',
            [new Port('port-name', l1, new Coord(5, 0)), new Port('port-name', l1, new Coord(0, 5))]);

    expect(c.validate()).toBe(false);
});

test('validate Component: invalid port layers', () => {
    let c = new Component('comp-name', 'comp-id', [l1, l2], 10, 10, 'comp-entity',
            [new Port('port-1', 'bad-layer', new Coord(5, 0)), new Port('port-2', l1, new Coord(0, 5))]);

    expect(c.validate()).toBe(false);
});

test('validate Component: overlapping port locations', () => {
    let c = new Component('comp-name', 'comp-id', [l1, l2], 10, 10, 'comp-entity',
            [new Port('port-1', l1, new Coord(5, 0)), new Port('port-2', l1, new Coord(5, 0))]);

    expect(c.validate()).toBe(false);
});

test('validate Component: port locations', () => {
    let c = new Component('comp-name', 'comp-id', [l1, l2], 10, 10, 'comp-entity',
            [new Port('port-1', l1, new Coord())]);

    for (let x = 0; x <= c.xSpan + 1; x++) {
        for (let y = 0; y <= c.ySpan + 1; y++) {
            c.ports[0].pos.setLocation(x, y);

            if (x > c.xSpan || y > c.ySpan) {
                // outside of the component is invalid
                expect(c.validate()).toBe(false);
            } else if ((x === 0 || x === c.xSpan) || (y === 0 || y === c.ySpan)) {
                // edges and corners are valid
                expect(c.validate()).toBe(true);
            } else {
                // anywhere else is invalid
                expect(c.validate()).toBe(false);
            }
        }
    }

    // Spot checks just in case the above logic is off
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
    let defName = new Component(ParchKey.DEFAULT_STR_VALUE, 'comp-id', [l1, l2], 10, 10, 'comp-entity',
            [new Port('port-1', l1, new Coord(0, 0)), new Port('port-2', l1, new Coord(5, 0))]);
    let defID = new Component('comp-name', ParchKey.DEFAULT_STR_VALUE, [l1, l2], 10, 10, 'comp-entity',
            [new Port('port-1', l1, new Coord(0, 0)), new Port('port-2', l1, new Coord(5, 0))]);
    let defLabel = new Component('comp-name', 'comp-id', null, 10, 10, 'comp-entity',
            [new Port('port-1', l1, new Coord(0, 0)), new Port('port-2', l1, new Coord(5, 0))]);
    let defXSpan = new Component('comp-name', 'comp-id', [l1, l2], Component.DEFAULT_SPAN_VALUE, 10, 'comp-entity',
            [new Port('port-1', l1, new Coord(0, 0)), new Port('port-2', l1, new Coord(5, 0))]);
    let defYSpan = new Component('comp-name', 'comp-id', [l1, l2], 10, Component.DEFAULT_SPAN_VALUE, 'comp-entity',
            [new Port('port-1', l1, new Coord(0, 0)), new Port('port-2', l1, new Coord(5, 0))]);
    let defEntity = new Component('comp-name', 'comp-id', [l1, l2], 10, 10, ParchKey.DEFAULT_STR_VALUE,
            [new Port('port-1', l1, new Coord(0, 0)), new Port('port-2', l1, new Coord(5, 0))]);
    let defPorts = new Component('comp-name', 'comp-id', [l1, l2], 10, 10, 'comp-entity', null);

    expect(def.validate()).toBe(false);
    expect(defName.validate()).toBe(false);
    expect(defID.validate()).toBe(false);
    expect(defLabel.validate()).toBe(false);
    expect(defXSpan.validate()).toBe(false);
    expect(defYSpan.validate()).toBe(false);
    expect(defEntity.validate()).toBe(false);
    expect(defPorts.validate()).toBe(false);
});
