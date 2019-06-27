const Layer = require('../layer.js');

test('instantiate Layer', () => {
    let layer = new Layer('layer-name', 'layer-id');

    expect(layer.name).toBe('layer-name');
    expect(layer.id).toBe('layer-id');
});

test('modify Layer fields', () => {
    let layer = new Layer('layer-name', 'layer-id');

    layer.name = 'new-layer-name';
    layer.id = 'new-layer-id';

    expect(layer.name).toBe('new-layer-name');
    expect(layer.id).toBe('new-layer-id');
});

test('validate Layer fields', () => {
    let badNameLayer = new Layer('', 'id');
    let badIDLayer = new Layer('name', '');
    let badBothLayer = new Layer('', '');
    let goodLayer = new Layer('good-name', 'good-id');

    expect(badNameLayer.validate()).toBe(false);
    expect(badIDLayer.validate()).toBe(false);
    expect(badBothLayer.validate()).toBe(false);
    expect(goodLayer.validate()).toBe(true);
});