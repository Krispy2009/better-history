class BH.Models.Week extends Backbone.Model
  @include BH.Modules.I18n
  @include BH.Modules.Url

  initialize: (attrs, options) ->
    @chromeAPI = chrome
    @settings = options.settings
    @set id: @get('date').id()
    @historyQuery = new BH.Lib.HistoryQuery(@chromeAPI)

  sync: (method, model, options) ->
    switch method
      when 'read'
        @historyQuery.run @toChrome(), (results) =>
          @preparse(results, options.success)

  toHistory: ->
    startDate: @get 'date'
    endDate: moment(@get 'date').add('days', 6)

  toTemplate: ->
    days = for day in @inflateDays()
      day: moment(day.id()).lang('en').format('dddd')
      title: day.format('dddd')
      inFuture: moment() < day
      url: @urlFor('day', day.id())
      visits: @getVisits(day)

    copy =
      shortTitle: @get('date').format('L')
      url: @urlFor('week', @id)
      title: @t('date_week_label', [
        @get('date').format('LL')
      ])

    _.extend copy, @toJSON(), days: days

  preparse: (results, callback) ->
    @worker 'dayGrouper', visits: results, (history) ->
      callback history

  parse: (data) ->
    history: data

  getVisits: (day) ->
    for day, visits of @get('history')
      visits if visits?
  
  dayVisits: ->
    for day, visits of @get('history')
      visits.length if visits?

  inflateDays: ->
    days = for i in [0..6]
      moment(@get('date')).add('days', i)

    if @settings.get('weekDayOrder') == 'descending'
      days.reverse()

    days
