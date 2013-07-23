(function() {
  var _ref;

  this.BH = typeof BH !== "undefined" && BH !== null ? BH : {};

  BH.Workers = (_ref = BH.Workers) != null ? _ref : {};

  BH.Workers.TimeGrouper = (function() {

    function TimeGrouper() {
      this.arrangedVisits = [];
    }

    TimeGrouper.prototype.run = function(visits, options) {
      var date, group, index, interval, visit, _i, _len, _ref1;
      this.visits = visits;
      this.options = options;
      this.interval = this.options.interval;
      _ref1 = this.visits;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        visit = _ref1[_i];
        date = new Date(visit.lastVisitTime);
        interval = this.calculateInterval(date);
        index = this.intervals().indexOf(interval);
        if (index === -1) {
          group = this.createIntervalGroup(date, interval);
          this.arrangedVisits.push(group);
          index = this.arrangedVisits.length - 1;
        }
        this.arrangedVisits[index].visits.push(visit);
      }
      return this.arrangedVisits;
    };

    TimeGrouper.prototype.createIntervalGroup = function(date, time) {
      var datetime;
      datetime = "" + (date.getMonth() + 1) + "/" + (date.getDate()) + "/" + (date.getFullYear()) + " " + time;
      return {
        datetime: new Date(datetime),
        id: time,
        visits: []
      };
    };

    TimeGrouper.prototype.intervals = function() {
      var arrangedVisit, _i, _len, _ref1, _results;
      _ref1 = this.arrangedVisits;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        arrangedVisit = _ref1[_i];
        _results.push(arrangedVisit.id);
      }
      return _results;
    };

    TimeGrouper.prototype.calculateInterval = function(date) {
      var hour, minutes;
      minutes = this.roundMinuteToInterval(date.getMinutes());
      hour = date.getHours();
      if (minutes === '00') {
        if (hour === 23) {
          hour = 0;
        } else {
          hour = hour + 1;
        }
      }
      return "" + hour + ":" + minutes;
    };

    TimeGrouper.prototype.roundMinuteToInterval = function(minutes) {
      minutes = Math.ceil(minutes / this.interval) * this.interval;
      if (minutes === 60) {
        return '00';
      }
      if (minutes === 0) {
        return '15';
      }
      return minutes;
    };

    return TimeGrouper;

  })();

  if (typeof onServer === "undefined" || onServer === null) {
    self.addEventListener('message', function(e) {
      var options, timeGrouper;
      timeGrouper = new BH.Workers.TimeGrouper();
      options = {
        interval: e.data.interval
      };
      return postMessage(timeGrouper.run(e.data.visits, options));
    });
  }

}).call(this);
