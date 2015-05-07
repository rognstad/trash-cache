exports.showDocumentation = {
  name: 'showDocumentation',
  description: 'return API documentation',

  outputExample:{
    "documentation":{
      "queue":{
        "1":{
          "name":"queue",
          "version":1,
          "description":"I check the current length of the purge queue",
          "inputs":{  

          }
        }
      },
      "showDocumentation":{
        "1":{  
          "name":"showDocumentation",
          "version":1,
          "description":"I return API documentation",
          "inputs":{  

          }
        }
      },
      "status":{  
        "1":{  
          "name":"status",
          "version":1,
          "description":"I will return some basic information about the API",
          "inputs":{  

          }
        }
      },
      "trashCache":{  
        "1":{  
          "name":"trashCache",
          "version":1,
          "description":"I issue a request to invalidate the CDN's cache of one or more assets",
          "inputs":{  
            "domain":{  
              "required":true
            }
          }
        }
      },
      "trashCacheStatus":{  
        "1":{  
          "name":"trashCacheStatus",
          "version":1,
          "description":"I check the current status of a trashCache request",
          "inputs":{  
            "progressUri":{  
              "required":true
            }
          }
        }
      }
    }
  },

  run: function(api, connection, next){    
    connection.response.documentation = api.documentation.documentation;
    next(connection, true);
  }
};