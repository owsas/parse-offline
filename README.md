# Parse Offline

Parse JS SDK Addons for handling offline for PWAs

Bonus: No external dependencies

<!-- TOC -->

- [Parse Offline](#parse-offline)
  - [The problem](#the-problem)
  - [The solution](#the-solution)
  - [How it works](#how-it-works)
  - [Examples](#examples)
    - [Basic](#basic)
    - [Controlled cache time](#controlled-cache-time)
    - [With custom cache key](#with-custom-cache-key)
  - [Want to contribute?](#want-to-contribute)
  - [Dev Features](#dev-features)
  - [Credits](#credits)
  - [License](#license)
  - [Support us on Patreon](#support-us-on-patreon)

<!-- /TOC -->

## The problem

When you develop applications with Parse, you constantly need to fetch the information from the remote server, affecting the offline experience.

## The solution

With this addon for the Parse JS SDK, you can:

* [x] Save query results in the `localStorage` for any class. With this, given a query, you could fetch its results and save them in the `localStorage` for later usage.

* [x] Have a synced cache for your results in the `localStorage` for any class. So everytime you make a request, you can keep a local cache of the results, and display them when your app goes offline.

* [ ] Edit/destroy objects, and save them when the app goes online.

## How it works

Because the Parse JS SDK contacts your Parse Server via POST requests, and saves the user token in `localStorage`, it is currently not possible to handle retries via Service Worker. To solve this problem, the `localStorage` is used to save sets of results that you might need to see when the app goes offline. 

## Examples

Please be aware that the following examples are given in Typescript. The main difference between the Typescript and the Javascript examples is the way in which `parse` is imported.

In Typescript: 
```ts
import * as Parse from 'parse';
```

In Javascript: 
```ts
import Parse from 'parse';
```

### Basic
In this example, we get a set of results from the database, and save them to the localStorage. To do this, we call `findWithFallbackAndCache` as follows:

```ts
import * as Parse from 'parse';
import { ParseOffline } from 'parse-offline';

const query = new Parse.Query('Vehicle');
const results: Parse.Object[] = await ParseOffline.findWithFallbackAndCache({
  query
});
```

`findWithFallbackAndCache` always tries to fetch the most recent content, and only if the navigator is not online it returns the elements saved in the cache.

The results are saved in the `localStorage`, available in the key `_cache_:className`. So, you could do the following, to get the items saved in the browser's local storage:

```ts
localStorage.getItem('_cache_Vehicle'); // [{ ... }]
```


### Controlled cache time

In this example, we set a maximum age to the fetched results. If the results are still valid, they are returned. Else, the library returns an empty array. 

```ts
import * as Parse from 'parse';
import { ParseOffline } from 'parse-offline';

const ONE_WEEK = 60 * 60 * 24 * 7;

const query = new Parse.Query('Test');
const results: Parse.Object[] = await ParseOffline.findWithFallbackAndCache({
  query,
  options: { sessionToken: '123' },
  maxAge: ONE_WEEK,
});
```

### With custom cache key

Sometimes, you have different queries for the same class and you want to cache those results.

```ts
import * as Parse from 'parse';
import { ParseOffline } from 'parse-offline';

// Here we save a cache for the elements of the class Post
const query = new Parse.Query('Post');
const results: Parse.Object[] = await ParseOffline.findWithFallbackAndCache({
  query,
  localStorageKey: 'my-custom-key'
});

// Here we save another cache for the elements of the class Post
const query2 = new Parse.Query('Post');
const results2: Parse.Object[] = await ParseOffline.findWithFallbackAndCache({
  query2,
  localStorageKey: 'my-custom-key2'
});
```

The results do not collide because the `localStorageKey` is different.


## Want to contribute?

Open a PR with your contribution and I'll be glad to merge it.

## Dev Features
* Testing with Jest
* Linting out of the box (checks the style of your code), with TSLint
* Build, prepublish and other scripts to help you to develop
* Works with Typescript: Static typing for your JS Applications, reducing amount of runtime errors
* Coverage out of the box, thanks to Jest
* Uses deterministic module resolving, with Yarn

## Credits

Developed by Juan Camilo Guarín Peñaranda,  
Otherwise SAS, Colombia  
2018

## License 

MIT.

## Support us on Patreon
[![patreon](./.repo/patreon.png)](https://patreon.com/owsas)
