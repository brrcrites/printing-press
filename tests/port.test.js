const Port = require('../model/port.js');
const Coord = require('../model/coord.js');
const Validation = require('../utils/validation.js');

//Suppress console logs
console.log = jest.fn();


test('initialize port', () => {
    let port = new Port('label', 'layer', new Coord(0, 0));

    expect(port.label).toBe('label');
    expect(port.layer).toBe('layer');
    expect(port.pos.x).toBe(0);
    expect(port.pos.y).toBe(0);
});

test('modify port', () => {
    let port = new Port('', '', new Coord(0, 0));

    port.label = 'new-label';
    port.layer = 'new-layer';
    port.pos.setLocation(10, 15);

    expect(port.label).toBe('new-label');
    expect(port.layer).toBe('new-layer');
    expect(port.pos.x).toBe(10);
    expect(port.pos.y).toBe(15);
});

test('validate port: valid values', () => {
    let goodPort = new Port('label', 'layer', new Coord(0, 0));

    expect(goodPort.validate()).toBe(true);
});

test('validate port: invalid values', () => {
    let badPort = new Port('', '', new Coord(-100, -100));

    expect(badPort.validate()).toBe(false);
});

test('validate port: invalid label value', () => {
    let badLabelPort = new Port('', 'layer', new Coord(1, 1));

    expect(badLabelPort.validate()).toBe(false);
});

test('validate port: invalid layer value', () => {
    let badLayerPort = new Port('label', '', new Coord(1, 1));

    expect(badLayerPort.validate()).toBe(false);
});

test('validate port: invalid Coord value', () => {
    let badCoordPort = new Port('label', 'layer', new Coord(-100, -100));

    expect(badCoordPort.validate()).toBe(false);
});

test('validate port: default values', () => {
    let defPort = new Port();

    expect(defPort.validate()).toBe(false);
});

test('validate port: default  value', () => {
    let defLabelPort = new Port(Validation.DEFAULT_STR_VALUE, 'layer', new Coord(0, 0));

    expect(defLabelPort.validate()).toBe(false);
});

test('validate port: default  value', () => {
    let defLayerPort = new Port('label', Validation.DEFAULT_STR_VALUE, new Coord(0, 0));

    expect(defLayerPort.validate()).toBe(false);
});

test('validate port: default  value', () => {
    let defCoordPort = new Port('label', 'layer');

    expect(defCoordPort.validate()).toBe(false);
});
