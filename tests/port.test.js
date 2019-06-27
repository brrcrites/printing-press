const Port = require('../port.js');
const Coord = require('../coord.js');

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
    port.pos.setXY(10, 15);

    expect(port.label).toBe('new-label');
    expect(port.layer).toBe('new-layer');
    expect(port.pos.x).toBe(10);
    expect(port.pos.y).toBe(15);
});

test('validate port', () => {
    let goodPort = new Port('label', 'layer', new Coord(0, 0));
    let badPort = new Port('', '', new Coord(-1, -1));
    let badLabelPort = new Port('', 'layer', new Coord(1, 1));
    let badLayerPort = new Port('label', '', new Coord(1, 1));
    let badCoordPort = new Port('label', 'layer', new Coord(-1, -1));

    expect(goodPort.validate()).toBe(true);
    expect(badPort.validate()).toBe(false);
    expect(badLabelPort.validate()).toBe(false);
    expect(badLayerPort.validate()).toBe(false);
    expect(badCoordPort.validate()).toBe(false);
});