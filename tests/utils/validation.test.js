const Validation = require('../../utils/validation.js');

//Suppress console logs
console.log = jest.fn();

describe('string values', () => {
    describe('invalid', () => {
        test('default', () => {
            expect(Validation.testStringValue(Validation.DEFAULT_STR_VALUE, 'test field', 'Validation Test')).toBe(false);
        });

        test('undefined', () => {
            expect(Validation.testStringValue(undefined, 'test field', 'Validation Test')).toBe(false);
        });

        test('null', () => {
            expect(Validation.testStringValue(null, 'test field', 'Validation Test')).toBe(false);
        });

        test('number', () => {
            expect(Validation.testStringValue(10, 'test field', 'Validation Test')).toBe(false);
        });
    });

    test('valid', () => {
        expect(Validation.testStringValue('valid string', 'test field', 'Validation Test')).toBe(true);
    });
});

describe('span values', () => {
    describe('invalid', () => {
        test('negative', () => {
            expect(Validation.testSpanValue(-123, 'field', 'Validation Test')).toBe(false);
        });

        test('default', () => {
            expect(Validation.testSpanValue(Validation.DEFAULT_SPAN_VALUE, 'field', 'Validation Test')).toBe(false);
        });

        test('string', () => {
            expect(Validation.testSpanValue('nan', 'axis', 'Validation Test')).toBe(false);
        });
    });

    test('valid', () => {
        expect(Validation.testSpanValue(49, 'field', 'Validation Test')).toBe(true);
    });
});

describe('coord values', () => {
    describe('invalid', () => {
        test('negative', () => {
            expect(Validation.testCoordValue(-23, 'field', 'Validation Test')).toBe(false);
        });

        test('default', () => {
            expect(Validation.testCoordValue(Validation.DEFAULT_COORD_VALUE, 'field', 'Validation Test')).toBe(false);
        });

        test('string', () => {
            expect(Validation.testSpanValue('nan', 'field', 'Validation Test')).toBe(false);
        });
    });

    test('valid', () => {
        expect(Validation.testCoordValue(15, 'field', 'Validation Test')).toBe(true);
    });
});

describe('width values', () => {
    test('invalid', () => {
        expect(Validation.testWidthValue(-432, 'field', 'Validation Test')).toBe(false);
    });

    test('default', () => {
        expect(Validation.testWidthValue(Validation.DEFAULT_DIM_VALUE, 'field', 'Validation Test')).toBe(false);
    });

    test('string', () => {
        expect(Validation.testWidthValue('nan', 'field', 'Validation Test')).toBe(false);
    });

    test('valid', () => {
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

   describe('invalid', () => {
       test('string', () => {
           expect(Validation.testDepthValue('nan', 'depth', 'Validation Test')).toBe(false);
       });

       test('null', () => {
           expect(Validation.testDepthValue(null, 'depth', 'Validation Test')).toBe(false);
       });

       test('array', () => {
           expect(Validation.testDepthValue([], 'depth', 'Validation Test')).toBe(false);
       });
   });
});

test('channel value', () => {
    expect(Validation.DEFAULT_CON_TYPE).toBe('channel');
});
