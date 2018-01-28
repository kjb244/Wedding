app.service('utilityFunctions', function(){

  this.getQueryParams =  function(){
    var hash = window.location.hash;
    var matchArr = hash.match(/(\?)(.*)/);
    if (matchArr && matchArr[2]){
      return matchArr[2].split('&')
      .map(function(e){ return [e.split('=')[0], e.split('=')[1]]})
      .reduce(function(e,i,a){e[i[0]]= i[1]; return e},{});

    }
    return false;
  }

  this.getPosition = function(element){
      var xPosition = 0;
      var yPosition = 0;

      while(element) {
          xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
          yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
          element = element.offsetParent;
      }

      return { x: xPosition, y: yPosition };
  }

  this.debounce = function(func, wait, immediate){
      var timeout;
      return function() {
          var context = this, args = arguments;
          var later = function() {
              timeout = null;
              if (!immediate) func.apply(context, args);
          };
          var callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (callNow) func.apply(context, args);
      };
  }

});



app.service("ajaxFetch", function($http) {
  this.getData= function(endpoint, type, data){
    type = type || 'GET';
    data = data || {};

    if('GET' === type){
      return $http.get(endpoint, {params:  data }  );
    }
    else if ('POST' === type){


      return $http.post(endpoint, { 'data': data} , { headers: { 'Content-Type': 'application/json' } } );
    }

    
  }

});