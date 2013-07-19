class BH.Views.MenuView extends Backbone.View
  template: BH.Templates['menu']

  events:
    'click .menu > *': 'weekClicked'

  render: ->
    #@$('.menu > * ').addClass 'hide'
    html = Mustache.to_html @template, @collection.toTemplate()
    @$el.html html


  weekClicked: (ev) ->
    @$('.menu > *').removeClass 'selected'
    $(ev.currentTarget).addClass 'selected'
    $('.menu > li > ol').addClass 'hide'
    $('.menu > li.selected > ol').removeClass 'hide'


