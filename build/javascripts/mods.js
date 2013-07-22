setTimeout(function(){
  var v = $('div.tagcloud');
  $.fn.tagcloud.defaults = {
        size: {start: 12, end: 38, unit: 'px'},
        color: {start: '#B0E2FF', end: '#2B4F81'}
      };
  if(window.location.href.indexOf('#days') !== -1 && v.length == 0) {
      var searchTerms = "%"
      var listTerms = {};
      var searchURLS = [];
      $('<div class="tagcloud">').prependTo($('.content'))
      var listOfURLS = $('.content > div > ol.history li.interval ol.visits li.visit > a:not([class])')
      for (var a in listOfURLS) {
          if(listOfURLS[a].href !== undefined){ 
           searchTerms = findSearchTerms(listOfURLS[a].href)
              if (listTerms[searchTerms] != undefined) {
                  listTerms[searchTerms] += 1
              }else {
              	console.log(listOfURLS[a].href)
              searchURLS.push(listOfURLS[a].href)
              listTerms[searchTerms] = 1
            }
          }
      }

        
      var keys = Object.keys(listTerms)
      var idx = keys.indexOf("undefined")
      keys.splice(idx,1)
      for (var i in keys){
       var link = $('<a class="tag" re="tag" data-weight='+listTerms[keys[i]]+'>').text(keys[i])
        $(link).appendTo('.tagcloud')
      }
    $(function () {
      $('div.tagcloud a.tag').tagcloud();
    });
     } 
     else if (window.location.href.indexOf('#weeks') !== -1 && v.length == 0){
    $('<div class="tagcloud">').prependTo($('.week_view .content'))
    $('<h1 class="tag">').text("WEEK SEARCHES DUDES").appendTo($('div.tagcloud'));
    }

    
  
}, 2000)

var findSearchTerms = function(url) {
  var q=""
  if (url.indexOf("www.google") !== -1 && url.indexOf("/search?q") !== -1) {
    q = url.split("&");
    q = q[0].split("=");
    q = q[1].split("+").join(" ");
    return q;
  }
};
