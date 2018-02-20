import * as Parse from 'parse';

import { CachedResults } from './CachedResults';

export class ParseOffline {
  /**
   * Save query results in the localStorage for any class. 
   * With this, given a query, you could fetch its results and 
   * save them in the localStorage for later usage.
   * 
   * Let's say you have a query for items of the class
   * GamePoints, they are saved as JSON in the local storage as 
   * _cache_GamePoints.
   * 
   * Nowadays, localStorage is widely supported
   * https://caniuse.com/#search=localStorage
   * 
   * @param params 
   */
  static async saveResultsToLocalStorage(params:{
    query: Parse.Query,
    localStorageKey?: string,
    options?: Parse.Query.FindOptions,
  }): Promise<Parse.Object[]> {
    const { query, localStorageKey, options } = params;

    // Generate the cache key
    const cacheKey: string = localStorageKey || 
      ParseOffline.getLocalStorageKeyForClassName(query.className);

    // Get the results
    const results = await query.find(options);

    // Save the items in the localStorage as JSON
    window.localStorage.setItem(
      cacheKey, 
      JSON.stringify(new CachedResults(results).toJSON()),
    );

    // Return the results
    return results;
  }

  /**
   * Given a query, gets the results
   * @param params 
   */
  static getResultsFromTheLocalStorage(params: {
    className: string,
    localStorageKey?: string,
  }): CachedResults {
    const { className, localStorageKey } = params;

    const previousItems = window.localStorage.getItem(
      localStorageKey || // from an arbitrary key
      ParseOffline.getLocalStorageKeyForClassName(className), // for an autogenerated key
    );

    // return if there were no previous items
    if (!previousItems) return new CachedResults([]);

    // parse the previous results
    const parsedJSON: any = JSON.parse(previousItems);

    // Return the Parse Objects
    return CachedResults.fromJSON(parsedJSON);
  }

  /**
   * Returns the key to be used for saving the results 
   * of a given query to the localStorage
   * @param className 
   */
  static getLocalStorageKeyForClassName(className: string): string {
    return `_cache_${className}`;
  }

  /**
   * Gets a className, given a localStorage key used to 
   * save an array of items
   * @param key 
   */
  static getClassNameFromLocalStorageKey(key: string): string {
    return key.replace('_cache_', '');
  }

  /**
   * Finds the results for the given query, 
   * saves them to the localStorage and gives you
   * back the results.
   * 
   * In case that the browser is not onLine, tries
   * to give you back the results that were cached 
   * in the localStorage
   * 
   * @param params 
   */
  static async findWithFallbackAndCache(params: {
    query: Parse.Query,
    localStorageKey?: string,
    options?: Parse.Query.FindOptions,
    maxAge?: number,
  }): Promise<Parse.Object[]> {
    const { query, localStorageKey, options, maxAge } = params;

    // Get the previous items
    const previousItems = window.localStorage.getItem(
      localStorageKey ||
      ParseOffline.getLocalStorageKeyForClassName(query.className),
    );

    // If offline, and results were cached, 
    // then parse and return them
    if (previousItems && !navigator.onLine) {
      const cachedResults = ParseOffline.getResultsFromTheLocalStorage({
        localStorageKey,
        className: query.className,
      });

      if (maxAge && !ParseOffline.areCachedResultsValid(cachedResults, maxAge)) {
        throw new Error('Cached results are not valid anymore');
      }

      return cachedResults.toParseObjs(query.className);
    }

    // Else, return the items from the network and cache them
    return ParseOffline.saveResultsToLocalStorage({
      query,
      localStorageKey,
      options,
    });
  }

  /**
   * Tests if results are still valid
   */
  static areCachedResultsValid(
    cachedResults: CachedResults, maxAge: number,
  ): boolean {
    return cachedResults.createdAt.getTime() > (new Date().getTime() - maxAge);
  }


  /**
   * Saves an image with the given url
   * @param imgUrl 
   */
  static saveImageToCache(imgUrl: string, worker: Worker): Promise<any> {
    return new Promise((resolve, reject) => {
      worker.postMessage(imgUrl);
      worker.onmessage = resolve;
      worker.onerror = reject;
    });
  }
}