class BH.Views.SettingsView extends BH.Views.MainView
  @include BH.Modules.I18n

  className: 'settings_view'

  template: BH.Templates['settings']

  events:
    'click .clear_history': 'clickedClearHistory'
    'click .credits': 'clickedCredits'
    'change #time_grouping': 'changedTimeGrouping'
    'change #time_format': 'changedTimeFormat'
    'change #open_location': 'changedOpenLocation'
    'change #starting_week_day': 'changedStartingWeekDay'
    'change #week_day_order': 'changedWeekDayOrder'
    'click #domain_grouping': 'clickedDomainGrouping'
    'click #search_by_domain': 'clickedSearchByDomain'
    'click #search_by_selection': 'clickedSearchBySelection'

  initialize: ->
    @chromeAPI = chrome
    @model.off 'change'
    @model.on 'change', @model.save, @model
    @model.on 'change:openLocation', @options.state.updateRoute, @options.state
    @model.on 'change:startingWeekDay', @options.state.updateRoute, @options.state
    @on 'selected', @activateSocialLinks, @

  pageTitle: ->
    @t('settings_title')

  activateSocialLinks: ->
    !((d,s,id) ->
      js
      fjs=d.getElementsByTagName(s)[0];
      if !d.getElementById(id)
        js=d.createElement(s);
        js.id=id;
        js.src="https://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js,fjs);
    )(document,"script","twitter-wjs");
    window.___gcfg = {lang: @t('google_plus_language')}
    (->
      po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
      po.src = 'https://apis.google.com/js/plusone.js';
      s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    )()

  render: ->
    properties = _.extend {},
      @getI18nValues(),
      @model.toTemplate()
    html = Mustache.to_html @template, properties
    @$el.append html
    @populateFields()
    @

  populateFields: ->
    @$('#open_location').val @model.get('openLocation')
    @$('#starting_week_day').val @model.get('startingWeekDay')
    @$('#week_day_order').val @model.get('weekDayOrder')
    @$('#time_grouping').val @model.get('timeGrouping')
    @$('#time_format').val @model.get('timeFormat')
    @$('#domain_grouping').prop 'checked', @model.get('domainGrouping')
    @$('#search_by_domain').prop 'checked', @model.get('searchByDomain')
    @$('#search_by_selection').prop 'checked', @model.get('searchBySelection')

  changedTimeGrouping: (ev) ->
    @model.set timeGrouping: $(ev.currentTarget).val()

  changedTimeFormat: (ev) ->
    @model.set timeFormat: $(ev.currentTarget).val()

  changedOpenLocation: (ev) ->
    @model.set openLocation: $(ev.currentTarget).val()

  changedStartingWeekDay: (ev) ->
    @model.set startingWeekDay: $(ev.currentTarget).val()

  changedWeekDayOrder: (ev) ->
    @model.set weekDayOrder: $(ev.currentTarget).val()

  clickedDomainGrouping: (ev) ->
    @model.set domainGrouping: $(ev.currentTarget).is(':checked')

  clickedSearchByDomain: (ev) ->
    @model.set searchByDomain: $(ev.currentTarget).is(':checked')

    backgroundPage = @chromeAPI.extension.getBackgroundPage()
    method = if @model.get('searchByDomain') then 'create' else 'remove'

    backgroundPage.pageContextMenu[method]()

  clickedSearchBySelection: (ev) ->
    @model.set searchBySelection: $(ev.currentTarget).prop('checked')

    backgroundPage = @chromeAPI.extension.getBackgroundPage()
    method = if @model.get('searchBySelection') then 'create' else 'remove'

    backgroundPage.selectionContextMenu[method]()

  clickedClearHistory: (ev) ->
    ev.preventDefault()
    @chromeAPI.tabs.create url:'chrome://settings/clearBrowserData'

  clickedCredits: (ev) ->
    ev.preventDefault()
    creditsView = new BH.Views.CreditsView()
    $('body').append(creditsView.render().el)
    creditsView.open()

  getI18nValues: ->
    properties = @t([
      'settings_title',
      'clearing_history_section_title',
      'clear_history_button',
      'visit_grouping_section_title',
      'group_visits_by_label',
      'time_format_label',
      'group_visits_by_domain_label',
      'right_click_options_section_title',
      'search_by_text_selection_label',
      'search_by_domain_label',
      'whats_new_section_title',
      'feedback_section_title',
      'spread_the_word_section_title',
      'leave_a_review',
      'twitter_template',
      'twitter_language',
      'open_location',
      'starting_week_day',
      'week_day_order',
      'general_section_title'
    ])
    properties['i18n_credits_link'] = @t('credits_link', [
      '<strong>',
      '</strong>'
    ])
    properties['i18n_suggestions_bugs_comments'] = @t('suggestions_bugs_comments', [
      '<a href="http://twitter.com/Better_History">',
      '</a>'
    ])
    properties
