const Coord = require('../coord.js');

test('initialize Coord', () => {
    // x and y init to negative values, so 0 is different enough
    let coord = new Coord(0, 0);

    expect(coord.x).toBe(0);
    expect(coord.y).toBe(0);
});

test('modify Coord', () => {
    let coord = new Coord(0, 0);

    coord.x = 10;
    coord.y = 15;

    expect(coord.x).toBe(10);
    expect(coord.y).toBe(15);

    coord.setLocation(20, 25);

    expect(coord.x).toBe(20);
    expect(coord.y).toBe(25);
});

test('validate Coord', () => {
    // Invalid
    let goodCoord = new Coord(120321, 2315432);
    let badXCoord = new Coord(-123, 456);
    let badYCoord = new Coord(123, -456);
    let badXYCoord = new Coord(-123, -456);

    expect(goodCoord.validate()).toBe(true);
    expect(badXCoord.validate()).toBe(false);
    expect(badYCoord.validate()).toBe(false);
    expect(badXYCoord.validate()).toBe(false);

    // Defaults
    let defCoord = new Coord();
    let defXCoord = new Coord(Coord.DEFAULT_VALUE, 10);
    let defYCoord = new Coord(10);

    expect(defCoord.validate()).toBe(false);
    expect(defXCoord.validate()).toBe(false);
    expect(defYCoord.validate()).toBe(false);
});