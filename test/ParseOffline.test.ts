import * as Parse from 'parse/node';
import { ParseOffline } from '../src/ParseOffline';
import { CachedResults } from '../src/CachedResults';

const obj = new Parse.Object('Test');
obj.set('testKey', 1);
obj.set('test', true);

const obj2 = obj.clone();
obj2.set('testKey', 2);

const store: any = {};

beforeAll(() => {
  Object.assign(window, { 
    localStorage: { 
      setItem: (key: string, value: string) => {
        store[key] = value;
      }, 
      getItem: key => store[key], 
    }, 
  });
});

describe('#saveResultsToLocalStorage', () => {
  test('should save the results in a way they can be retrieved back as Parse Objects', async () => {
    const query = new Parse.Query('Test');
    const spy = jest.spyOn(query, 'find');
    spy.mockImplementationOnce(async () => [obj, obj2]);

    const spyStorage = jest.spyOn(localStorage, 'setItem');

    const results = await ParseOffline.saveResultsToLocalStorage({ 
      query,
      options: { sessionToken: '123' },
    });

    expect(spyStorage).toHaveBeenCalledTimes(1);
    expect(results).toEqual([obj, obj2]);

    const str = localStorage.getItem('_cache_Test');
    const json = JSON.parse(str);


    const cachedResults = CachedResults
      .fromJSON({ ...json, className: 'Test' });

    expect(cachedResults.toParseObjs('Test').map(o => o.toJSON()))
      .toEqual([obj.toJSON(), obj2.toJSON()]);
  });
});


describe('#getLocalStorageKeyForClassName', () => {
  test('should return the right key', () => {
    expect(ParseOffline.getLocalStorageKeyForClassName('Test'))
      .toEqual('_cache_Test');
  });
});

describe('#getClassNameFromLocalStorageKey', () => {
  test('should return the right name', () => {
    expect(ParseOffline.getClassNameFromLocalStorageKey('_cache_Test'))
      .toEqual('Test');
  });
});

describe('#getResultsFromTheLocalStorage', () => {
  test('should return the results from the localStorage', async () => {
    const results = await ParseOffline.getResultsFromTheLocalStorage({ 
      className: 'Test', 
    });

    expect(results.toParseObjs('Test').map(o => o.toJSON()))
      .toEqual([obj.toJSON(), obj2.toJSON()]);
  });

  test('should return an empty CachedResults if there were no results in the localStorage', 
       async () => {
         const results = await ParseOffline.getResultsFromTheLocalStorage({ 
           className: 'IDontExist', 
         });

         expect(results.results).toEqual([]);
       });
});
