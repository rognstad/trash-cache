var request = require('request');

exports.trashCacheStatus = {
  name: 'trashCacheStatus',
  description: 'I check the current status of a trashCache request based on the provided progressUri',
  authenticated: false,
  inputs: {
    progressUri: {
      required: true,
      validator: function (param, connection, actionTemplate) {
        
        var urlRegex = /\/ccu\/v2\/purges\/[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/;

        if (urlRegex.test(param)) {
          return true;
        } else {
          return 'The submitted progressUri was not in the correct format; see the *trashCache* output example.';
        }

      }
    }
  },
  outputExample: {
    'originalEstimatedSeconds': 420,
     'originalQueueLength': 0,
     'supportId': '17SY1405954814899441-292938848',
     'httpStatus': 200,
     'purgeId': '57799d8b-10e4-11e4-9088-62ece60caaf0',
     'completionTime': '2014-07-21T14:42:18Z',
     'submittedBy': 'client_name',
     'trashCacheStatus': 'In-Progress',
     'submissionTime': '2014-07-21T14:39:30Z'
  },
  version: 1.0,
  run: function(api, connection, next){

    request.get('https://api.ccu.akamai.com' + connection.params.progressUri, {
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
