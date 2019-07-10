const Validation = require('../../utils/validation.js');

//Suppress console logs
console.log = jest.fn();

test('test string value: invalid', () => {
    expect(Validation.testStringValue('', 'test field', 'Validation Test')).toBe(false);
});

test('test string value: default', () => {
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

test('test dimension value: invalid', () => {
    expect(Validation.testDimensionValue(-432, 'field', 'Validation Test')).toBe(false);
});

test('test dimension value: default', () => {
    expect(Validation.testDimensionValue(Validation.DEFAULT_DIM_VALUE, 'field', 'Validation Test')).toBe(false);
});

test('test dimension value: string', () => {
    expect(Validation.testSpanValue('nan', 'field', 'Validation Test')).toBe(false);
});

test('test dimension value: valid', () => {
    expect(Validation.testDimensionValue(42, 'field', 'Validation Test')).toBe(true);
});

test('test channel value', () => {
    expect(Validation.DEFAULT_CON_TYPE).toBe('channel');
});
