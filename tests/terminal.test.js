const Terminal = require('../model/terminal.js');
const Port = require('../model/port.js');
const ParchKey = require('../model/parch-key.js');

// Suppress console logs
console.log = jest.fn();

test('initialize Terminal: parameters', () => {
    let t = new Terminal('component-id', new Port());

    expect(t.compID).toBe('component-id');
    expect(t.port).toEqual(new Port());
});

test('initialize Terminal: default', () => {
    let t = new Terminal();

    expect(t.compID).toBe(ParchKey.DEFAULT_STR_VALUE);
    expect(t.port).toBe(null);
});

test('modify Terminal', () => {
    let t = new Terminal();

    t.compID = 'component-id';
    t.port = new Port();

    expect(t.compID).toBe('component-id');
    expect(t.port).toEqual(new Port());
});

test('validate Terminal: valid given values', () => {
    let t1 = new Terminal('component-id', new Port());

    expect(t1.validate()).toBe(true);
});

test('validate Terminal: valid default values', () => {
    let t2 = new Terminal('component-id');

    expect(t2.validate()).toBe(true);
});

test('validate Terminal: invalid values', () => {
    let t = new Terminal('');

    expect(t.validate()).toBe(false);
});

test('validate Terminal: default values', () => {
    let t = new Terminal();

    expect(t.validate()).toBe(false);
});