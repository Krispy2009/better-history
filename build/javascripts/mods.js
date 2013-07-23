//check to see if location has changed. If it did, then reload the page to reload the tag cloud
$('li').click(function(){
  var loc = $(this).children()[0]
  if(loc.href != window.location){
    window.location = loc.href
    setTimeout(function() {window.location.reload()}, 1000)
  }
});
setTimeout(function(){
  
  
  $.fn.tagcloud.defaults = {
        size: {start: 12, end: 38, unit: 'px'},
        color: {start: '#B0E2FF', end: '#2B4F81'}
      };
  

  if(window.location.href.indexOf('#days') !== -1) {
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
              }else{
              if(searchTerms !== "") {searchURLS.push(listOfURLS[a].href)}
              listTerms[searchTerms] = 1
            }
          }
      }        
      var keys = Object.keys(listTerms)
      var idx = keys.indexOf("")
      keys.splice(idx,1)
      for (var i in keys){
       var link = $('<a class="tag" rel="tag" data-weight='+listTerms[keys[i]]+'>').text(keys[i]+" ")
       $(link).prop('href', searchURLS[i])
        $(link).appendTo('.tagcloud')
      }

     } 
     else if (window.location.href.indexOf('#weeks') !== -1){
    $('<div class="tagcloud">').prependTo($('.week_view .content'))
      listOfURLS = $('.getUrl')
      searchURLS = []
      listTerms = {}
      for(var a in listOfURLS){
        if(listOfURLS[a].innerText !== undefined){ 
           searchTerms = findSearchTerms(listOfURLS[a].innerText)
              if (listTerms[searchTerms] != undefined) {
                  listTerms[searchTerms] += 1
              }else{
              if(searchTerms !== "") {searchURLS.push(listOfURLS[a].innerText)}
              listTerms[searchTerms] = 1
            }
          }

      }

      var keys = Object.keys(listTerms)
      var idx = keys.indexOf("")
      keys.splice(idx,1)
      for (var i in keys){
       var link = $('<a class="tag" rel="tag" data-weight='+listTerms[keys[i]]+'>').text(keys[i]+" ")
       $(link).prop('href', searchURLS[i])
        $(link).appendTo('.tagcloud')
      }
      
    }

    $(function () {
      $('div.tagcloud a.tag').tagcloud();
    });
 
}, 2000);

var findSearchTerms = function(url) {
  var q=""
  if (url.indexOf("www.google.") !== -1 && url.indexOf("/search?q") !== -1) {
    url = url.split("/search?q=")
    q = checkQuery(url[1]).split("+").join(" ");
    return decodeURIComponent(q);
  }
  else { return ""}
};

var checkQuery = function(q){
  count_q = countOccurences(q,"&q=") +1
  count_oq = countOccurences(q,"&oq=")
  var q1 = q.indexOf("q=")
  var oq1 = q.indexOf("oq=")

  if(count_q > 1 && count_oq > 1) {
    var q2 = q.indexOf("q=",q1+1)
    var oq2 = q.indexOf("oq=",oq1+1)
    //if there exists a second pair of q and oq, then the query was re-requested, and
    //the terms might have changed, so we collect the second ones. (this is because 
    // the user would most probably focus their search more the second time around.)
    if (q2 !== -1 && oq2 !== -1){
      q = q.slice(oq2)
      return q.split("&",q2+1)[0].split("=")[1]
    } else {
      return q.split("&", q2+1)[0].split("=")[1]
    }
  } 
  if(q[q2] !== -1 || (q[q1] !== q[q2] && q[q2] === q[oq1])){
    return q.split("&",q2)[0]
  } else {
    return q.split("&",q1)[0]
  }
  
};

var countOccurences = function(string, subString, allowOverlapping){

    string+=""; subString+="";
    if(subString.length<=0) return string.length+1;

    var n=0, pos=0;
    var step=(allowOverlapping)?(1):(subString.length);

    while(true){
        pos=string.indexOf(subString,pos);
        if(pos>=0){ n++; pos+=step; } else break;
    }
    return(n);
}
