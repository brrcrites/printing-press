const ParchKey = require('../parch-key');

test('instantiate ParchKey class', () => {
    function instantiateParch() {
        let pk = new ParchKey('name', 'id');
    }

    expect(instantiateParch).toThrowError(new TypeError('Abstract class "ParchKey" cannot be instantiated directly.'));
});