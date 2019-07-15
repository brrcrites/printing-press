const ComponentFeature = require('../../model/component-feature.js');
const Coord = require('../../model/coord.js');
const Validation = require('../../utils/validation.js');
// Suppress console logs
console.log = jest.fn();

describe('initialization', () => {
    describe('constructor', () => {
        test('parameters', () => {
            let c = new ComponentFeature(new Coord(5, 15), 10);

            expect(c.location).toEqual(new Coord(5, 15));
            expect(c.depth).toBe(10);
        });

        test('defaults', () => {
            let c = new ComponentFeature();

            expect(c.location).toBe(null);
            expect(c.depth).toBe(Validation.DEFAULT_DIM_VALUE);
        });
    });

    test('modify fields', () => {
        let c = new ComponentFeature();
        c.location = new Coord(10, 20);
        c.depth = 12;

        expect(c.location).toEqual(new Coord(10, 20));
        expect(c.depth).toBe(12);
    });
});

describe('validation', () => {
    test('valid', () => {
        let c = new ComponentFeature(new Coord(20, 30), 14);

        expect(c.validate()).toBe(true);
    });

    describe('invalid', () => {
        test('all fields', () => {
            let c = new ComponentFeature();

            expect(c.validate()).toBe(false);
        });

        describe('location', () => {
            test('negative values', () => {
                let c = new ComponentFeature(new Coord(-231, -60), 54);

                expect(c.validate()).toBe(false);
            });

            test('null value', () => {
                let c = new ComponentFeature(null, 34);

                expect(c.validate()).toBe(false);
            });
        });

        test('depth', () => {
            let c = new ComponentFeature(new Coord(59, 123), -4);

            expect(c.validate()).toBe(false);
        });
    });
});
