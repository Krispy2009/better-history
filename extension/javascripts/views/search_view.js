// Generated by CoffeeScript 1.3.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BH.Views.SearchView = (function(_super) {

    __extends(SearchView, _super);

    SearchView.name = 'SearchView';

    function SearchView() {
      return SearchView.__super__.constructor.apply(this, arguments);
    }

    SearchView.prototype.className = 'search_view';

    SearchView.prototype.templateId = 'search';

    SearchView.prototype.initialize = function() {
      return this.model.bind('change:title', this.refreshTitle, this);
    };

    SearchView.prototype.render = function() {
      this.$el.append(this.template(this.model.toTemplate()));
      return this;
    };

    SearchView.prototype.refreshTitle = function() {
      return this.$('.title').text(this.model.get('title'));
    };

    return SearchView;

  })(Backbone.View);

}).call(this);
