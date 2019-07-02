const Port = require('../model/port.js');
const Coord = require('../model/coord.js');

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

test('validate port: invalid values', () => {
    let goodPort = new Port('label', 'layer', new Coord(0, 0));
    let badPort = new Port('', '', new Coord(-100, -100));
    let badLabelPort = new Port('', 'layer', new Coord(1, 1));
    let badLayerPort = new Port('label', '', new Coord(1, 1));
    let badCoordPort = new Port('label', 'layer', new Coord(-100, -100));

    expect(goodPort.validate()).toBe(true);
    expect(badPort.validate()).toBe(false);
    expect(badLabelPort.validate()).toBe(false);
    expect(badLayerPort.validate()).toBe(false);
    expect(badCoordPort.validate()).toBe(false);
});

test('validate port: default values', () => {
    let defPort = new Port();
    let defLabelPort = new Port(Port.DEFAULT_STR_VALUE, 'layer', new Coord(0, 0));
    let defLayerPort = new Port('label', Port.DEFAULT_STR_VALUE, new Coord(0, 0));
    let defCoordPort = new Port('label', 'layer');

    expect(defPort.validate()).toBe(false);
    expect(defLabelPort.validate()).toBe(false);
    expect(defLayerPort.validate()).toBe(false);
    expect(defCoordPort.validate()).toBe(false);
});