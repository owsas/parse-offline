# Parse Offline (Work in progress)

Parse JS SDK Addons for handling offline for PWAs

## The problem

When you develop applications with Parse, you constantly need to fetch the information from the remote server, affecting the offline experience.

## The solution

With this addon for the Parse JS SDK, you can:

* [ ] Save query results in the `localStorage` for any class. With this, given a query, you could fetch its results and save them in the `localStorage` for later usage.

* [ ] Have a synced cache for your results in the `localStorage` for any class. So everytime you make a request, you can keep a local cache of the results, and display them when your app goes offline.

* [ ] Save in the Service Worker cache images from the results.

## How it works

Because the Parse JS SDK contacts your Parse Server via POST requests, and saves the user token in `localStorage`, it is currently not possible to handle retries via Service Worker. So, the `localStorage` is used to 

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