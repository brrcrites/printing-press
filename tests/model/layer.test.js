const Layer = require('../../model/layer.js');
const ParchKey = require('../../model/parch-key.js');

// Suppress console logs
console.log = jest.fn();

//TODO: write more tests. Just because this is formatted nicely doesn't mean it's finished.

describe('initialization', () => {
    test('constructor', () => {
        let layer = new Layer('layer-name', 'layer-id');

        expect(layer.name).toBe('layer-name');
        expect(layer.id).toBe('layer-id');
    });

    test('modify fields', () => {
        let layer = new Layer('layer-name', 'layer-id');

        layer.name = 'new-layer-name';
        layer.id = 'new-layer-id';

        expect(layer.name).toBe('new-layer-name');
        expect(layer.id).toBe('new-layer-id');
    });
});

describe('validation', () => {
    describe('invalid', () => {
        test(' name value', () => {
            let badNameLayer = new Layer('', 'id');

            expect(badNameLayer.validate()).toBe(false);
        });

        test('id value', () => {
            let badIDLayer = new Layer('name', '');

            expect(badIDLayer.validate()).toBe(false);
        });

        test('name and id values', () => {
            let badBothLayer = new Layer('', '');

            expect(badBothLayer.validate()).toBe(false);
        });

        test('values', () => {
            let defLayer = new Layer();

            expect(defLayer.validate()).toBe(false);
        });

        test('name value', () => {
            let defNameLayer = new Layer(ParchKey.DEFAULT_STR_VALUE, 'layer-id');

            expect(defNameLayer.validate()).toBe(false);
        });

        test('id value', () => {
            let defIDLayer = new Layer('layer-name');

            expect(defIDLayer.validate()).toBe(false);
        });
    });

    test('validate Layer: valid values', () => {
        let goodLayer = new Layer('good-name', 'good-id');

        expect(goodLayer.validate()).toBe(true);
    });
});
