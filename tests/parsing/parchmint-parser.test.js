const ParchmintParser = require('../../parsing/parchmint-parser.js');
const Layer = require('../../model/layer.js');

const validParchmintLayers = '"layers": [\n' +
        '    {\n' +
        '        "id": "unique-flow-layer-id-string",\n' +
        '        "name": "flow-layer"\n' +
        '    },\n' +
        '    {\n' +
        '        "id": "unique-control-layer-id-string",\n' +
        '        "name": "control-layer"\n' +
        '    }\n' +
        ']';

const invalidParchmintLayers = '"layers": [\n' +
        '    {\n' +
        '        "id": "unique-flow-layer-id-string",\n' +
        '        "name": ""\n' +
        '    },\n' +
        '    {\n' +
        '        "id": "",\n' +
        '        "name": "control-layer"\n' +
        '    }\n' +
        ']';

function parseJSONObj(str) {
    return JSON.parse('{' + str + '}');
}

describe('layers', () => {
    test('initialize with initParchKey', () => {
        let pp = new ParchmintParser();
        let l = new Layer();

        pp.initParchKey(l, parseJSONObj(validParchmintLayers).layers[0]);

        expect(l.name).toBe('flow-layer');
        expect(l.id).toBe('unique-flow-layer-id-string');
    });

    test('valid JSON array obj', () => {
        let pp = new ParchmintParser();
        let l = pp.parseLayersArray(parseJSONObj(validParchmintLayers));

        expect(l[0].name).toBe('flow-layer');
        expect(l[0].id).toBe('unique-flow-layer-id-string');
        expect(l[1].name).toBe('control-layer');
        expect(l[1].id).toBe('unique-control-layer-id-string');
    });

    describe('validation', () => {
        test('invalid name', () => {
            let pp = new ParchmintParser();
            let l = pp.parseLayersArray(parseJSONObj(invalidParchmintLayers));

            expect(l[0].validate()).toBe(false);
        });

        test('invalid id', () => {
            let pp = new ParchmintParser();
            let l = pp.parseLayersArray(parseJSONObj(invalidParchmintLayers));

            expect(l[1].validate()).toBe(false);
        });

        test('valid', () => {
            let pp = new ParchmintParser();
            let l = pp.parseLayersArray(parseJSONObj(validParchmintLayers));

            expect(l[0].validate()).toBe(true);
            expect(l[1].validate()).toBe(true);
        });
    });
});