class BH.Models.Visit extends Backbone.Model
  @include BH.Modules.I18n

  defaults:
    title: '(No Title)'

  initialize: ->
    @chromeAPI = chrome

    @set id: @cid
    @set(title: @defaults.title) if @get('title') == ''

  sync: (method, model, options) ->
    if method == 'delete'
      @chromeAPI.history.deleteUrl({url: @get('url')})
      options.success(@)

  toTemplate: ->
    _.extend
      isGrouped: false
      host: @domain()
      path: @path()
      searchTerms: @findSearchTerms()
    , @toJSON()

  domain: ->
    match = @_getDomain @get('url')
    if match == null then null else match[0]

  path: () ->
    if @_getDomain(@get('url'))?
      @get('url').replace(@_getDomain(@get('url'))[0], '')

  _getDomain: (url) ->
    url.match(/\w+:\/\/(.*?)\//)

  findSearchTerms: () ->
    url = @get('url')
    if url.indexOf("www.google") isnt -1 and url.indexOf("/search?q") isnt -1
      q = url.split("&")
      q = q[0].split("=")
      q = q[1].split("+").join(" ")
      q

