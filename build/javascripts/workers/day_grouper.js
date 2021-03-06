(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty;

  this.BH = typeof BH !== "undefined" && BH !== null ? BH : {};

  BH.Workers = (_ref = BH.Workers) != null ? _ref : {};

  BH.Workers.DayGrouper = (function() {

    function DayGrouper() {
      this.weekDays = {
        Sunday: [],
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: []
      };
    }

    DayGrouper.prototype.run = function(visits) {
      var day, visit, _i, _len;
      for (_i = 0, _len = visits.length; _i < _len; _i++) {
        visit = visits[_i];
        day = new Date(visit.lastVisitTime).getDay();
        this.weekDays[this.indexToDay(day)].push(visit);
      }
      return this.weekDays;
    };

    DayGrouper.prototype.indexToDay = function(index) {
      var day, days;
      days = (function() {
        var _ref1, _results;
        _ref1 = this.weekDays;
        _results = [];
        for (day in _ref1) {
          if (!__hasProp.call(_ref1, day)) continue;
          _results.push(day);
        }
        return _results;
      }).call(this);
      return days[index];
    };

    return DayGrouper;

  })();

  if (typeof onServer === "undefined" || onServer === null) {
    self.addEventListener('message', function(e) {
      var dayGrouper;
      dayGrouper = new BH.Workers.DayGrouper();
      return postMessage(dayGrouper.run(e.data.visits));
    });
  }

}).call(this);
