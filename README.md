# Trash Cache

Trash Cache takes a URL to a page, builds a list of all the assets (typically JS, CSS, and images) necessary to render that page, and then issues a request to invalidate Akamai's cache of all those assets. Obviously it only works if the site is on your Akamai account.

Trash Cache is built on actionhero.js.

## Dependencies

+ [Node.js](http://nodejs.org/)
+ [PhantomJS](http://phantomjs.org/)

## To Install:
(Assuming you have the dependencies installed)

+ `npm install`
+ Edit `config/secret.js` to include your Akamai username and password

## To Run:
`npm start`

## To Test:
`npm test`
