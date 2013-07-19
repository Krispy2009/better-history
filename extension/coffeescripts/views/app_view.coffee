class BH.Views.AppView extends Backbone.View
  @include BH.Modules.I18n

  className: 'app_view'

  template: BH.Templates['app']

  initialize: ->
    @chromeAPI = chrome
    @settings = @options.settings

    @collection.reload @settings.get('startingWeekDay')
    @options.state.on 'change', @onStateChanged, @
    @settings.on 'change:startingWeekDay', @onStartingWeekDayChanged, @
    @settings.on 'change:weekDayOrder', @onWeekDayOrderChanged, @
    @collection.on 'reloaded', @onWeeksReloaded, @

    @cache = new BH.Views.Cache(@options)

  render: ->
    html = Mustache.to_html @template, @getI18nValues()
    @$el.html html
    @renderMenu()
    @

  renderMenu: ->
    menuView = new BH.Views.MenuView
      el: '.menu_view'
      collection: @collection
    menuView.render()

  onStateChanged: ->
    @options.state.save()

  onStartingWeekDayChanged: ->
    @reloadWeeks()

  onWeeksReloaded: ->
    @renderMenu()

  onWeekDayOrderChanged: ->
    @reloadWeeks()
    @cache.expire()

  reloadWeeks: ->
    @collection.reset()
    @collection.reload @settings.get('startingWeekDay')

  loadWeek: (id) ->
    @updateMenuSelection(id)
    @cache.weekView(id)

  loadDay: (id) ->
    startingWeekDay = @settings.get('startingWeekDay')
    weekId = moment(id).past(startingWeekDay, 0).id()
    @updateMenuSelection(weekId)
    @cache.dayView(id)

  loadSettings: ->
    @updateMenuSelection()
    @$('.menu .setting').parent().addClass 'selected'
    @cache.settingsView()

  loadSearch: (options = {}) ->
    @updateMenuSelection()
    @cache.searchView(options)

  updateMenuSelection: (id) ->
    @$('.menu > *').removeClass 'selected'
    @$("[data-week-id='#{id}']").addClass('selected') if id?

  getI18nValues: ->
    @t ['history_title', 'settings_link']
