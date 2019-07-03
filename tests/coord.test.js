const Coord = require('../model/coord.js');
const Port = require('../model/port.js');
const Validation = require('../utils/validation.js');

// Suppress console logs
console.log = jest.fn();


test('initialize Coord', () => {
    // x and y init to negative values, so 0 is different enough
    let coord = new Coord(0, 0);

    expect(coord.x).toBe(0);
    expect(coord.y).toBe(0);
});

test('modify Coord using fields', () => {
    let coord = new Coord(0, 0);

    coord.x = 10;
    coord.y = 15;

    expect(coord.x).toBe(10);
    expect(coord.y).toBe(15);
});

test('modify Coord using setLocation', () => {
    let coord = new Coord(0, 0);

    coord.setLocation(20, 25);

    expect(coord.x).toBe(20);
    expect(coord.y).toBe(25);
});

test('validate Coord: invalid values', () => {
    let goodCoord = new Coord(120321, 2315432);
    let badXCoord = new Coord(-123, 456);
    let badYCoord = new Coord(123, -456);
    let badXYCoord = new Coord(-123, -456);

    expect(goodCoord.validate()).toBe(true);
    expect(badXCoord.validate()).toBe(false);
    expect(badYCoord.validate()).toBe(false);
    expect(badXYCoord.validate()).toBe(false);
});

test('validate Coord: default values', () => {
    let defCoord = new Coord();
    let defXCoord = new Coord(Validation.DEFAULT_COORD_VALUE, 10);
    let defYCoord = new Coord(10);

    expect(defCoord.validate()).toBe(false);
    expect(defXCoord.validate()).toBe(false);
    expect(defYCoord.validate()).toBe(false);
});

test('verify toString output', () => {
    let c = new Coord();

    for (let i = 0; i < 100; i++) {
        c.setLocation(i, i);
        expect(c.toString()).toBe('(' + i + ', ' + i + ')');
    }
});

test('comparison of Coord objects', () => {
    let c1 = new Coord(1, 1);
    let c2 = new Coord(1, 1);
    let c3 = new Coord(2, 2);

    expect(c1.is(c2)).toBe(true);
    expect(c1.is(c3)).toBe(false);
});

test('comparison of non-Coord objects', () => {
    let c = new Coord(1, 1);
    let p = new Port();

    expect(c.is(p)).toBe(false);
});
