const Config = require('../../utils/config.js');
const Validation = require('../../utils/validation.js');

describe('accessing', () => {
    describe('svg_drawing', () => {
        test('color', () => {
            expect(Config.svg_drawing.color).toBe('black');
        });

        test('maxX', () => {
            expect(Config.svg_drawing.maxX).toBe(Validation.DEFAULT_SPAN_VALUE);
        });

        test('maxY', () => {
            expect(Config.svg_drawing.maxY).toBe(Validation.DEFAULT_SPAN_VALUE);
        });
    });
});

describe('mutating', () => {
    describe('svg_drawing', () => {
        test('color', () => {
            Config.svg_drawing.color = 'red';

            expect(Config.svg_drawing.color).toBe('red');
        });

        test('maxX', () => {
            Config.svg_drawing.maxX = 15000;

            expect(Config.svg_drawing.maxX).toBe(15000);
        });

        test('maxY', () => {
            Config.svg_drawing.maxY = 10;

            expect(Config.svg_drawing.maxY).toBe(10);
        });
    });
});