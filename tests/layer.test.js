const Layer = require('../model/layer.js');
const ParchKey = require('../model/parch-key.js');

// Suppress console logs
console.log = jest.fn();


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

test('validate Layer: invalid values', () => {
    let badNameLayer = new Layer('', 'id');
    let badIDLayer = new Layer('name', '');
    let badBothLayer = new Layer('', '');
    let goodLayer = new Layer('good-name', 'good-id');

    expect(badNameLayer.validate()).toBe(false);
    expect(badIDLayer.validate()).toBe(false);
    expect(badBothLayer.validate()).toBe(false);
    expect(goodLayer.validate()).toBe(true);
});

test('validate Layer: default values', () => {
    let defLayer = new Layer();
    let defNameLayer = new Layer(ParchKey.DEFAULT_STR_VALUE, 'layer-id');
    let defIDLayer = new Layer('layer-name');

    expect(defLayer.validate()).toBe(false);
    expect(defNameLayer.validate()).toBe(false);
    expect(defIDLayer.validate()).toBe(false);
});