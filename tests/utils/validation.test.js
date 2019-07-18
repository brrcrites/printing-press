const Validation = require('../../utils/validation.js');
const Layer = require('../../model/layer.js');

//Suppress console logs
console.log = jest.fn();

describe('string values', () => {
    test('test string value: invalid', () => {
        expect(Validation.testStringValue(Validation.DEFAULT_STR_VALUE, 'test field', 'Validation Test')).toBe(false);
    });

    test('test string value: undefined', () => {
        expect(Validation.testStringValue(undefined, 'test field', 'Validation Test')).toBe(false);
    });

    test('test string value: null', () => {
        expect(Validation.testStringValue(null, 'test field', 'Validation Test')).toBe(false);
    });

    test('test string value number', () => {
        expect(Validation.testStringValue(10, 'test field', 'Validation Test')).toBe(false);
    });

    test('test string value: valid', () => {
        expect(Validation.testStringValue('valid string', 'test field', 'Validation Test')).toBe(true);
    });
});

describe('span values', () => {
    test('test span value: invalid', () => {
        expect(Validation.testSpanValue(-123, 'field', 'Validation Test')).toBe(false);
    });

    test('test span value: default', () => {
        expect(Validation.testSpanValue(Validation.DEFAULT_SPAN_VALUE, 'field', 'Validation Test')).toBe(false);
    });

    test('test span value: string', () => {
        expect(Validation.testSpanValue('nan', 'axis', 'Validation Test')).toBe(false);
    });

    test('test span value: valid', () => {
        expect(Validation.testSpanValue(49, 'field', 'Validation Test')).toBe(true);
    });
});

describe('coord values', () => {
    test('test coord value: invalid', () => {
        expect(Validation.testCoordValue(-23, 'field', 'Validation Test')).toBe(false);
    });

    test('test coord value: default', () => {
        expect(Validation.testCoordValue(Validation.DEFAULT_COORD_VALUE, 'field', 'Validation Test')).toBe(false);
    });

    test('test coord value: string', () => {
        expect(Validation.testSpanValue('nan', 'field', 'Validation Test')).toBe(false);
    });

    test('test coord value: valid', () => {
        expect(Validation.testCoordValue(15, 'field', 'Validation Test')).toBe(true);
    });
});

describe('width values', () => {
    test('test width value: invalid', () => {
        expect(Validation.testWidthValue(-432, 'field', 'Validation Test')).toBe(false);
    });

    test('test width value: default', () => {
        expect(Validation.testWidthValue(Validation.DEFAULT_DIM_VALUE, 'field', 'Validation Test')).toBe(false);
    });

    test('test width value: string', () => {
        expect(Validation.testWidthValue('nan', 'field', 'Validation Test')).toBe(false);
    });

    test('test width value: valid', () => {
        expect(Validation.testWidthValue(42, 'field', 'Validation Test')).toBe(true);
    });
});

describe('depth values', () => {
   describe('valid', () => {
       test('positive', () => {
           expect(Validation.testDepthValue(12, 'depth', 'Validation Test')).toBe(true);
       });

       test('negative', () => {
           expect(Validation.testDepthValue(-12, 'depth', 'Validation Test')).toBe(true);
       });
   });

   describe('string', () => {
       expect(Validation.testDepthValue('nan', 'depth', 'Validation Test')).toBe(false);
   });

   describe('null', () => {
      expect(Validation.testDepthValue(null, 'depth', 'Validation Test')).toBe(false);
   });
});

test('channel value', () => {
    expect(Validation.DEFAULT_CON_TYPE).toBe('channel');
});

test('validate map: valid', () => {
    let layers = new Map([['layer-1', new Layer('name-1', 'layer-1')], ['layer-2', new Layer('name-2', 'layer-2')],
        ['layer-3', new Layer('name-3', 'layer-3')]]);

    expect(Validation.validateMap(layers, 'field', 'Validation Test')).toBe(true);
});

test('validate map: invalid: no elements', () => {
    let layers = new Map([]);

    expect(Validation.validateMap(layers, 'field', 'Validation Test')).toBe(false);
});

test('validate map: invalid: invalid elements', () => {
    let layers = new Map([['layer-1', new Layer('', 'layer-1')], ['layer-2', new Layer('name-2', '')],
        ['layer-3', new Layer('name-3', 'layer-3')]]);

    expect(Validation.validateMap(layers, 'field', 'Validation Test')).toBe(false);
});
