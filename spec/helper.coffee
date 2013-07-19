underscore = require 'underscore'
backbone = require 'backbone'
moment = require 'moment'
timekeeper = require 'timekeeper'

global.onServer = typeof exports != 'undefined'
global._ = underscore
global.Backbone = backbone
global.moment = moment
global.timekeeper = timekeeper
global.localStorage = {}
global.mockChromeAPI = require './chrome_api'
global.chrome = mockChromeAPI()
global.BH = require '../extension/coffeescripts/namespace'

require '../extension/javascripts/frameworks/backbone_hacks.js'
require '../extension/javascripts/frameworks/mixin.js'
require '../extension/javascripts/frameworks/moment_hacks.js'
require '../extension/coffeescripts/modules/url'
require '../extension/coffeescripts/modules/i18n'
require '../extension/coffeescripts/modules/worker'
require '../extension/coffeescripts/lib/date_i18n'
require '../extension/coffeescripts/lib/browser_actions'
require '../extension/coffeescripts/lib/page_context_menu'
require '../extension/coffeescripts/lib/selection_context_menu'
require '../extension/coffeescripts/lib/history_query'
require '../extension/coffeescripts/workers/day_grouper'
require '../extension/coffeescripts/workers/domain_grouper'
require '../extension/coffeescripts/workers/time_grouper'
require '../extension/coffeescripts/workers/sanitizer'
require '../extension/coffeescripts/models/history'
require '../extension/coffeescripts/models/week'
require '../extension/coffeescripts/models/day'
require '../extension/coffeescripts/models/search'
require '../extension/coffeescripts/models/settings'
require '../extension/coffeescripts/models/state'
require '../extension/coffeescripts/models/day_history'
require '../extension/coffeescripts/models/week_history'
require '../extension/coffeescripts/models/search_history'
require '../extension/coffeescripts/models/settings'
require '../extension/coffeescripts/collections/weeks'

new BH.Lib.DateI18n().configure()
