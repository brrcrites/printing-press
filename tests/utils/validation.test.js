const Validation = require('../../utils/validation.js');

//Suppress console logs
console.log = jest.fn();

test('test string value: invalid', () => {
    expect(Validation.testStringValue('', 'test field', 'Validation Test')).toBe(false);
});

test('test string value: default', () => {
    expect(Validation.testStringValue(Validation.DEFAULT_STR_VALUE, 'test field', 'Validation Test')).toBe(false);
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

test('test span value: valid', () => {
    expect(Validation.testSpanValue(49, 'field', 'Validation Test')).toBe(true);
});

test('test coord value: invalid', () => {
    expect(Validation.testCoordValue(-23, 'field', 'Validation Test')).toBe(false);
});

test('test coord value: default', () => {
    expect(Validation.testCoordValue(Validation.DEFAULT_COORD_VALUE, 'field', 'Validation Test')).toBe(false);
});

test('test coord value: valid', () => {
    expect(Validation.testCoordValue(15, 'field', 'Validation Test')).toBe(true);
});