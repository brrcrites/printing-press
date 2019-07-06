const Coord = require('../model/coord.js');
const Port = require('../model/port.js');
const Validation = require('../utils/validation.js');

// Suppress console logs
console.log = jest.fn();


test('initialize Coord', () => {
    // x and y init to negative values, so 0 is diffe:100
    // rent enough
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

test('validate Coord: valid values', () => {
    let goodCoord = new Coord(120321, 2315432);

    expect(goodCoord.validate()).toBe(true);
});

test('validate Coord: invalid x value', () => {
    let badXCoord = new Coord(-123, 456);

    expect(badXCoord.validate()).toBe(false);
});

test('validate Coord: invalid y value', () => {
    let badYCoord = new Coord(123, -456);

    expect(badYCoord.validate()).toBe(false);
});

test('validate Coord: invalid x & y values', () => {
    let badXYCoord = new Coord(-123, -456);

    expect(badXYCoord.validate()).toBe(false);
});

test('validate Coord: default values', () => {
    let defCoord = new Coord();

    expect(defCoord.validate()).toBe(false);
});

test('validate Coord: default x value', () => {
    let defXCoord = new Coord(Validation.DEFAULT_COORD_VALUE, 10);

    expect(defXCoord.validate()).toBe(false);
});

test('validate Coord: default y value', () => {
    let defYCoord = new Coord(10);

    expect(defYCoord.validate()).toBe(false);
});

test('verify toString output: valid coord', () => {
    let c = new Coord(0, 0);

    expect(c.toString()).toBe('(0, 0)');
});

test('verify toString output: invalid coord', () => {
    let c = new Coord(-67, -23);

    expect(c.toString()).toBe('(-67, -23)');
});

test('verify toString output: default coord', () => {
    let c = new Coord();

    expect(c.toString()).toBe('(' + Validation.DEFAULT_COORD_VALUE + ', ' + Validation.DEFAULT_COORD_VALUE + ')');
});

test('comparison of Coord objects', () => {
    let c1 = new Coord(1, 1);
    let c2 = new Coord(1, 1);
    let c3 = new Coord(2, 2);

    expect(c1.is(c2)).toBe(true);
    expect(c1.is(c3)).toBe(false);
    expect(c1.is(new Coord(1, 2))).toBe(false);
    expect(c1.is(new Coord(2, 1))).toBe(false);
});

test('comparison of non-Coord objects', () => {
    let c = new Coord(1, 1);
    let p = new Port();
    p.pos = new Coord(1, 1);

    expect(c.is(p)).toBe(false);
});
