const { withoutProperties } = require('../lib/utils');

describe('utils#withoutProperties', () => {
  it('works with an empty object', () => {
    let undefinedObj;
    expect(withoutProperties(undefinedObj, [])).toEqual({});
    expect(withoutProperties({}, [])).toEqual({});
    expect(withoutProperties({ foo: 'foo' }, [])).toEqual({ foo: 'foo' });
  });

  it('removes properties', () => {
    const object = {
      foo: 'foo',
      bar: 'bar',
      baz: 'baz',
    };
    const propsToRemove = ['foo', 'bar'];
    const result = withoutProperties(object, propsToRemove);

    expect(result).toEqual({ baz: 'baz' });
    propsToRemove.forEach((prop) => {
      expect(object).toHaveProperty(prop);
    });
  });

  it('does not remove own properties', () => {
    expect(
      withoutProperties({}, ['toString'])
    ).toHaveProperty('toString');
  });
});
