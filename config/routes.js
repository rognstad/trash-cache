exports.default = { 
  routes: function(api){
    return {
      all: [
        { path: '/trashCache/:apiVersion', action: 'trashCache' },
        { path: '/trashCacheStatus/:apiVersion', action: 'trashCacheStatus' },
        { path: '/queue/:apiVersion', action: 'queue' }
      ]
    }
  }
}