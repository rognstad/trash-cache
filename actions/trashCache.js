var phantom = require('node-phantom-simple');
var Promise = require('promise');
var recursivefs = require('recursive-fs');
var request = require('request');

exports.trashCache = {
  name: 'trashCache',
  description: 'I issue a request to invalidate the CDN\'s cache of all the assets required to load the provided page',
  authenticated: false,
  inputs: {
    domain: {
      required: true,
      validator: function (param, connection, actionTemplate) {
        
        // from https://gist.github.com/dperini/729294 based on info from https://mathiasbynens.be/demo/url-regex
        var urlRegex = new RegExp(
          "^" +
            // protocol identifier
            "(?:(?:https?|ftp)://)" +
            // user:pass authentication
            "(?:\\S+(?::\\S*)?@)?" +
            "(?:" +
              // IP address exclusion
              // private & local networks
              "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
              "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
              "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
              // IP address dotted notation octets
              // excludes loopback network 0.0.0.0
              // excludes reserved space >= 224.0.0.0
              // excludes network & broacast addresses
              // (first & last IP address of each class)
              "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
              "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
              "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
            "|" +
              // host name
              "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
              // domain name
              "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
              // TLD identifier
              "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
            ")" +
            // port number
            "(?::\\d{2,5})?" +
            // resource path
            "(?:/\\S*)?" +
          "$", "i"
        );

        if (urlRegex.test(param)) {
          return true;
        } else {
          return 'The submitted URL was not in the correct format; see the output example.';
        }

      }
    }
  },
  outputExample: {
   "trashedUrls": [
       "http://www.alantholmes.com/includes/site-features.css",
       "http://www.alantholmes.com/design/css/site.css",
       "http://www.alantholmes.com/design/css/blue.css",
       "http://www.alantholmes.com/includes/searchFormDesignCheck.js",
       "http://www.alantholmes.com/includes/autofillFSP.js",
       "http://www.alantholmes.com/design/scripts/highlight.js",
       "http://www.alantholmes.com/includes/omtr_code.js",
       "http://www.alantholmes.com/includes/omtr_variable.js",
       "http://www.alantholmes.com/design/images/printBanner.gif",
       "http://www.alantholmes.com/design/images/bg-pageWrap-blue.png",
       "http://www.alantholmes.com/design/images/searchFormDesignSubmit.gif",
       "http://www.alantholmes.com/design/images/firmName.png",
       "http://www.alantholmes.com/design/images/tagline.png",
       "http://www.alantholmes.com/design/images/callToAction.png",
       "http://www.alantholmes.com/design/images/swappable-family.jpg",
       "http://www.alantholmes.com/content/images/creditcard-small-visa.jpg",
       "http://www.alantholmes.com/content/images/creditcard-small-master.jpg",
       "http://www.alantholmes.com/content/images/creditcard-small-american.jpg",
       "http://www.alantholmes.com/design/images/formSubmitShort.gif",
       "http://www.alantholmes.com/design/images/bg-banner.png",
       "http://www.alantholmes.com/design/images/bg-containerColumns.png",
       "http://www.alantholmes.com/design/images/searchFormDesignSubmit-o.gif",
       "http://www.alantholmes.com/design/images/formSubmitShort-o.gif",
       "http://www.alantholmes.com/design/css/print.css"
     ],
     "akamaiResponse": {
       "estimatedSeconds": 300,
       "progressUri": "/ccu/v2/purges/1cb75fe1-f478-11e4-93a6-07a46d1c66c3",
       "purgeId": "1cb75fe1-f478-11e4-93a6-07a46d1c66c3",
       "supportId": "17PY1430975744281865-327161024",
       "httpStatus": 201,
       "detail": "Request accepted.",
       "pingAfterSeconds": 300
     },
     "serverInformation": {
       "serverName": "Trash Cache API",
       "apiVersion": "1.0.0",
       "requestDuration": 9426,
       "currentTime": 1430975744038
     },
     "requesterInformation": {
       "id": "8372713895e815cbf439459aa4ab1f8bafcd5830-070e1caf-e69d-4092-8e17-7a2f6a06c4a2",
       "fingerprint": "8372713895e815cbf439459aa4ab1f8bafcd5830",
       "remoteIP": "127.0.0.1",
       "receivedParams": {
         "domain": "http://www.alantholmes.com/",
         "apiVersion": "1",
         "action": "trashCache"
       }
     }
  },
  version: 1.0,
  run: function(api, connection, next){

    var checkAssetsWithPhantom = function (url) {
      return new Promise(function (fulfill, reject){
        var received = [];
        phantom.create(function (err, ph) {
          return ph.createPage(function (err, page) {

            if (err) reject(err);
            page.set('settings', {
              javascriptEnabled: true,
              loadImages: true,
              userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36' // chrome 42 desktop
            });

            page.onResourceReceived = function (res) {
              if (res.stage == 'end' && res.id != 1) {
                received.push(res);
              }
            };

            return page.open(url, function (err, status) {
              if (err) reject(err);
              page.get('content', function (err, html) {
                ph.exit();
                if (err) reject(err);
                if (received.length == 0) {
                  var empty = 'There are no assets to trash for that URL.';
                  connection.response.message = empty;
                  connection.rawConnection.responseHttpCode = 202;
                  next(connection, true);
                  reject(empty);
                }
                fulfill(received);
              });
            });

          });
        });
      });
    };

    var reduceToUrls = function (array) {
      return array.map(function (currentValue, index, array) {
        return currentValue.url;
      });
    };

    var filterAssets = function (array) {
      return array.filter(function (currentValue, index, array) {
         // omit requests to the page itself
        return (currentValue.indexOf(connection.params.domain) > -1 && currentValue != connection.params.domain);
      });
    };

    var submitTrashCache = function (paths) {
      return new Promise(function (fulfill, reject){
        request.post('https://api.ccu.akamai.com/ccu/v2/queues/default', {
          'auth': {
            'user': api.config.secret.userName,
            'pass': api.config.secret.password,
            'sendImmediately': false
          },
          'json': {
            'action': 'invalidate',
            'objects': paths
          }
        }, function (error, response) {
          if (error) {
            reject('submitTrashCache' + error);
          }
          else {
            console.log(response.body.httpStatus);
            if (response.body.httpStatus == 201) {
              connection.response.trashedUrls = paths;
            }
            else {
              connection.rawConnection.responseHttpCode = response.body.httpStatus;
            }
            connection.response.akamaiResponse = response.body;
            next(connection, true);
             // response.body is already an object here
            fulfill(response.body);
          }
        });
      });
    };

    checkAssetsWithPhantom(connection.params.domain)
    .then(reduceToUrls)
    .then(filterAssets)
    .then(submitTrashCache)
    // for now, send errors to console
    .then(null, console.log)
    .done();

  }
};
