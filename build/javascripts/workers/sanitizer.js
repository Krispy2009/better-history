(function() {
  var _ref;

  this.BH = typeof BH !== "undefined" && BH !== null ? BH : {};

  BH.Workers = (_ref = BH.Workers) != null ? _ref : {};

  BH.Workers.Sanitizer = (function() {

    function Sanitizer() {}

    Sanitizer.prototype.run = function(results, options) {
      var prunedResults, result, _i, _len;
      this.options = options;
      if (this.options.text) {
        this.terms = options.text.split(' ');
      }
      prunedResults = [];
      for (_i = 0, _len = results.length; _i < _len; _i++) {
        result = results[_i];
        if (this.options.searching != null) {
          if (prunedResults.length >= 100) {
            true;
          } else {
            this.setAdditionalProperties(result);
            if (this.verifyTextMatch(result)) {
              this.removeScriptTags(result);
              prunedResults.push(result);
            }
          }
        } else {
          if (this.verifyDateRange(result)) {
            this.setAdditionalProperties(result);
            this.removeScriptTags(result);
            if (this.terms && this.terms.length !== 0) {
              if (this.verifyTextMatch(result)) {
                prunedResults.push(result);
              }
            } else {
              prunedResults.push(result);
            }
          }
        }
      }
      prunedResults.sort(this.sortByTime);
      return prunedResults;
    };

    Sanitizer.prototype.verifyTextMatch = function(result) {
      var hits, regExp, term, _i, _len, _ref1;
      hits = [];
      regExp = null;
      _ref1 = this.terms;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        term = _ref1[_i];
        regExp = new RegExp(term, "i");
        if (result.time.match(regExp) || result.extendedDate.match(regExp) || result.url.match(regExp) || result.title.match(regExp)) {
          hits.push(true);
        }
      }
      if ((this.terms != null) && hits.length === this.terms.length) {
        return true;
      } else {
        return false;
      }
    };

    Sanitizer.prototype.verifyDateRange = function(result) {
      return result.lastVisitTime > this.options.startTime && result.lastVisitTime < this.options.endTime;
    };

    Sanitizer.prototype.removeScriptTags = function(result) {
      var property, regex, _i, _len, _ref1, _results;
      regex = /<(.|\n)*?>/ig;
      _ref1 = ['title', 'url', 'location'];
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        property = _ref1[_i];
        _results.push(result[property] = result[property].replace(regex, ""));
      }
      return _results;
    };

    Sanitizer.prototype.setAdditionalProperties = function(result) {
      return result.location = result.url;
    };

    Sanitizer.prototype.sortByTime = function(a, b) {
      if (a.lastVisitTime > b.lastVisitTime) {
        return -1;
      }
      if (a.lastVisitTime < b.lastVisitTime) {
        return 1;
      }
      return 0;
    };

    return Sanitizer;

  })();

  if (typeof onServer === "undefined" || onServer === null) {
    self.addEventListener('message', function(e) {
      var sanitizer;
      sanitizer = new BH.Workers.Sanitizer();
      return postMessage(sanitizer.run(e.data.results, e.data.options));
    });
  }

}).call(this);
