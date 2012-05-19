// Generated by CoffeeScript 1.3.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BH.Views.AppView = (function(_super) {

    __extends(AppView, _super);

    AppView.name = 'AppView';

    function AppView() {
      return AppView.__super__.constructor.apply(this, arguments);
    }

    AppView.prototype.className = 'app_view';

    AppView.prototype.templateId = 'app';

    AppView.prototype.selectedClass = 'selected';

    AppView.prototype.weekViews = {};

    AppView.prototype.events = {
      'click .navbar a': 'weekClicked'
    };

    AppView.prototype.initialize = function(config, options) {
      var versionView;
      this.options = options;
      this.views = {
        weeks: {}
      };
      if (this.model.get('suppress') === false) {
        versionView = new VersionView({
          model: this.model
        });
        $('body').append(versionView.render().el);
        return versionView.open();
      }
    };

    AppView.prototype.render = function() {
      var properties,
        _this = this;
      properties = _.extend(i18n.app(), this.collection.toTemplate());
      this.$el.html(this.template(properties));
      this.collection.each(function(model) {
        _this.views.weeks[model.id] = new BH.Views.WeekView({
          model: model
        }, _this.options);
        return _this.$('.mainview').append(_this.views.weeks[model.id].render().el);
      });
      this.views.search = new BH.Views.SearchView({
        model: new BH.Models.Search()
      });
      this.$('.mainview').append(this.views.search.render().el);
      this.views.settings = new BH.Views.SettingsView({
        model: settings
      });
      this.$('.mainview').append(this.views.settings.render().el);
      return this;
    };

    AppView.prototype.weekClicked = function(ev) {
      this.$('.navbar a').removeClass(this.selectedClass);
      return this.$(ev.currentTarget).addClass(this.selectedClass);
    };

    return AppView;

  })(Backbone.View);

}).call(this);
