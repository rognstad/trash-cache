var request = require('request');

exports.queue = {
  name: 'queue',
  description: 'I check the current length of the Akamai queue',
  authenticated: false,
  outputExample: {
    "supportId": "17QY1405953107052757-292938848",
    "httpStatus": 200,
    "detail": "The queue may take a minute to reflect new or removed requests.",
    "queueLength": 4
  },
  version: 1.0,
  run: function(api, connection, next){

    request.get('https://api.ccu.akamai.com/ccu/v2/queues/default', {
      'auth': {
        'user': api.config.secret.userName,
        'pass': api.config.secret.password,
        'sendImmediately': false
      }
    }, function (error, response) {
       // response.body is not already an object
      connection.response.akamaiResponse = JSON.parse(response.body);
      next(connection, true);
    });

  }
};
