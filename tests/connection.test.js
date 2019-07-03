const Connection = require('../model/connection.js');
const ParchKey = require('../model/parch-key.js');
const Terminal = require('../model/terminal.js');

//Suppress console logs
console.log = jest.fn();

var source = new Terminal('component-1');
var sink1 = new Terminal('component-2');
var sink2 = new Terminal('component-3');

test('initialize Connection: parameters', () => {
    let c = new Connection('name', 'id', 'layer', source, [sink1, sink2]);

    expect(c.name).toBe('name');
    expect(c.id).toBe('id');
    expect(c.layer).toBe('layer');
    expect(c.source).toEqual(source);
    expect(c.sinks).toEqual([sink1, sink2]);
});

test('initialize Connection: default', () => {
    let c = new Connection();

    expect(c.name).toBe(ParchKey.DEFAULT_STR_VALUE);
    expect(c.id).toBe(ParchKey.DEFAULT_STR_VALUE);
    expect(c.layer).toBe(ParchKey.DEFAULT_STR_VALUE);
    expect(c.source).toBe(null);
    expect(c.sinks).toBe(null);
});

test('modify Connection', () => {
    let c = new Connection();

    c.name = 'name';
    c.id = 'id';
    c.layer = 'layer';
    c.source = source;
    c.sinks = [sink1, sink2];

    expect(c.name).toBe('name');
    expect(c.id).toBe('id');
    expect(c.layer).toBe('layer');
    expect(c.source).toEqual(source);
    expect(c.sinks).toEqual([sink1, sink2]);
});

test('validate Connection: valid values', () => {
    let c = new Connection('name', 'id', 'layer', source, [sink1, sink2]);

    expect(c.validate()).toBe(true);
});

test('validate Connection: invalid values', () => {
    let badCon = new Connection('', '', '', new Terminal(), [new Terminal(), new Terminal()]);

    expect(badCon.validate()).toBe(false);
});

test('validate Connection: invalid Name value', () => {
    let badNameCon = new Connection('', 'id', 'layer', source, [sink1, sink2]);

    expect(badNameCon.validate()).toBe(false);
});

test('validate Connection: invalid ID value', () => {
    let badIDCon = new Connection('name', '', 'layer', source, [sink1, sink2]);

    expect(badIDCon.validate()).toBe(false);
});

test('validate Connection: invalid Layer value', () => {
    let badLayerCon = new Connection('name', 'id', '', source, [sink1, sink2]);

    expect(badLayerCon.validate()).toBe(false);
});

test('validate Connection: invalid Source value', () => {
    let badSourceCon = new Connection('name', 'id', 'layer', new Terminal(), [sink1, sink2]);

    expect(badSourceCon.validate()).toBe(false);
});

test('validate Connection: invalid Sinks value', () => {
    let badSinksCon = new Connection('name', 'id', 'layer', source, [new Terminal(), sink2]);

    expect(badSinksCon.validate()).toBe(false);
});

test('validate Connection: default values', () => {
    let defCon = new Connection();

    expect(defCon.validate()).toBe(false);
});

test('validate Connection: default name value', () => {
    let defNameCon = new Connection(ParchKey.DEFAULT_STR_VALUE, 'id', 'layer', source, [sink1, sink2]);

    expect(defNameCon.validate()).toBe(false);
});

test('validate Connection: default ID value', () => {
    let defIDCon = new Connection('name', ParchKey.DEFAULT_STR_VALUE, 'layer', source, [sink1, sink2]);

    expect(defIDCon.validate()).toBe(false);
});

test('validate Connection: default layer value', () => {
    let defLayerCon = new Connection('name', 'id', ParchKey.DEFAULT_STR_VALUE, source, [sink1, sink2]);

    expect(defLayerCon.validate()).toBe(false);
});

test('validate Connection: default source value', () => {
    let defSourceCon = new Connection('name', 'id', 'layer', null, [sink1, sink2]);

    expect(defSourceCon.validate()).toBe(false);
});

test('validate Connection: default sinks value', () => {
    let defSinksCon = new Connection('name', 'id', 'layer', source);

    expect(defSinksCon.validate()).toBe(false);
});
