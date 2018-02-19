import * as Parse from 'parse/node';
import { CachedResults } from '../src/CachedResults';

const obj = new Parse.Object('Test');
obj.set('testKey', 1);
obj.set('test', true);

const obj2 = obj.clone();
obj2.set('testKey', 2);

describe('#constructor', () => {
  test('should initialize with the right results', () => {
    const c = new CachedResults([obj, obj2]);
    expect(c.results).toEqual([obj.toJSON(), obj2.toJSON()]);
  });

  test('should be able to initialize with the right date', () => {
    const d = new Date();
    const c = new CachedResults([obj, obj2], d);
    expect(c.results).toEqual([obj.toJSON(), obj2.toJSON()]);
    expect(c.createdAt).toEqual(d);
  });
});

describe('#toJSON', () => {
  test('should return the right data', () => {
    const d = new Date();
    const c = new CachedResults([obj, obj2], d);
    expect(c.toJSON()).toEqual({
      createdAt: d,
      results: [obj.toJSON(), obj2.toJSON()],
    });
  });
});

describe('#toParseObjs', () => {
  test('should convert back to Parse.Objects', () => {
    const d = new Date();
    const c = new CachedResults([obj, obj2], d);
    expect(CachedResults.toParseObjs('Test', [obj.toJSON(), obj2.toJSON()])).toEqual([obj, obj2]);
  });
});

describe('#fromJSON', () => {
  test('should convert the results ok', () => {
    const results = [obj.toJSON(), obj2.toJSON()];
    const createdAt = new Date();
    const result = CachedResults.fromJSON({ createdAt, results });

    expect(result instanceof CachedResults).toBe(true);
    expect(result.toParseObjs('Test').map(t => t.toJSON())).toEqual(results);
  });
});
