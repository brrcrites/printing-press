const ComponentFeature = require('../../model/component-feature.js');
const Coord = require('../../model/coord.js');
const Validation = require('../../utils/validation.js');
// Suppress console logs
console.log = jest.fn();

describe('initialization', () => {
    describe('constructor', () => {
        test('parameters', () => {
            let c = new ComponentFeature('feature-name', 'layer', 15, 20, new Coord(5, 15), 10);

            expect(c.name).toBe('feature-name');
            expect(c.layer).toBe('layer');
            expect(c.xSpan).toBe(15);
            expect(c.ySpan).toBe(20);
            expect(c.location).toEqual(new Coord(5, 15));
            expect(c.depth).toBe(10);
        });

        test('defaults', () => {
            let c = new ComponentFeature();

            expect(c.name).toBe(Validation.DEFAULT_STR_VALUE);
            expect(c.layer).toBe(Validation.DEFAULT_STR_VALUE);
            expect(c.xSpan).toBe(Validation.DEFAULT_SPAN_VALUE);
            expect(c.ySpan).toBe(Validation.DEFAULT_SPAN_VALUE);
            expect(c.location).toBe(null);
            expect(c.depth).toBe(Validation.DEFAULT_DIM_VALUE);
        });
    });

    test('modify fields', () => {
        let c = new ComponentFeature();
        c.name = 'named-feature';
        c.layer = 'layer';
        c.xSpan = 32;
        c.ySpan = 48;
        c.location = new Coord(10, 20);
        c.depth = 12;

        expect(c.name).toBe('named-feature');
        expect(c.layer).toBe('layer');
        expect(c.xSpan).toBe(32);
        expect(c.ySpan).toBe(48);
        expect(c.location).toEqual(new Coord(10, 20));
        expect(c.depth).toBe(12);
    });
});

describe('validation', () => {
    describe('valid', () => {
        test('positive depth', () => {
            let c = new ComponentFeature('feature-name', 'layer', 10, 20, new Coord(20, 30), 14);

            expect(c.validate()).toBe(true);
        });

        test('negative depth', () => {
            let c = new ComponentFeature('feature-name', 'layer', 10, 20, new Coord(34, 213), -6854)

            expect(c.validate()).toBe(true);
        });
    });

    describe('invalid', () => {
        test('all fields', () => {
            let c = new ComponentFeature();

            expect(c.validate()).toBe(false);
        });

        test('name', () => {
            let c = new ComponentFeature(Validation.DEFAULT_STR_VALUE, 'layer', 10, 34, new Coord(0, 0), 12);

            expect(c.validate()).toBe(false);
        });

        test('layer', () => {
            let c = new ComponentFeature('feature-name', Validation.DEFAULT_STR_VALUE, 11, 23, new Coord(12, 54), 14);

            expect(c.validate()).toBe(false);
        });

        test('xSpan', () => {
            let c = new ComponentFeature('feature', 'layer', -45, 23, new Coord(0, 0), 12);

            expect(c.validate()).toBe(false);
        });

        test('ySpan', () => {
            let c = new ComponentFeature('feature', 'layer', 5654, Validation.DEFAULT_SPAN_VALUE, new Coord(10, 230), 5);

            expect(c.validate()).toBe(false);
        });

        describe('location', () => {
            test('negative values', () => {
                let c = new ComponentFeature('feature-name', 'layer', 10, 20, new Coord(-231, -60), 54);

                expect(c.validate()).toBe(false);
            });

            test('null value', () => {
                let c = new ComponentFeature('feature-name', 'layer', 10, 20, null, 34);

                expect(c.validate()).toBe(false);
            });
        });

        test('depth', () => {
            let c = new ComponentFeature('feature-name', 'layer', 10, 20, new Coord(59, 123), 'nan');

            expect(c.validate()).toBe(false);
        });
    });
});
