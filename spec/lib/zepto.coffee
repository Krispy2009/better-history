#!
# * jQuery.tagcloud.js
# * A Simple Tag Cloud Plugin for jQuery & Zepto
# *
# * https://github.com/addywaddy/jquery.tagcloud.js
# * created by Adam Groves
# 
(($) ->
  
  #global Zepto
  "use strict"
  compareWeights = (a, b) ->
    a - b

  
  # Converts hex to an RGB array
  toRGB = (code) ->
    code = code.replace(/(\w)(\w)(\w)/g, "$1$1$2$2$3$3")  if code.length is 4
    hex = /(\w{2})(\w{2})(\w{2})/.exec(code)
    [parseInt(hex[1], 16), parseInt(hex[2], 16), parseInt(hex[3], 16)]

  
  # Converts an RGB array to hex
  toHex = (ary) ->
    "#" + Zepto.map(ary, (i) ->
      hex = i.toString(16)
      hex = (if (hex.length is 1) then "0" + hex else hex)
      hex
    ).join("")

  colorIncrement = (color, range) ->
    Zepto.map toRGB(color.end), (n, i) ->
      (n - toRGB(color.start)[i]) / range


  tagColor = (color, increment, weighting) ->
    rgb = Zepto.map(toRGB(color.start), (n, i) ->
      ref = Math.round(n + (increment[i] * weighting))
      if ref > 255
        ref = 255
      else
        ref = 0  if ref < 0
      ref
    )
    toHex rgb

  $.fn.tagcloud = (options) ->
    opts = $.extend({}, $.fn.tagcloud.defaults, options)
    tagWeights = @map(->
      $(this).attr "data-weight"
    )
    tagWeights = Array::slice.call(tagWeights, 0).sort(compareWeights)
    lowest = tagWeights[0]
    highest = tagWeights.pop()
    range = highest - lowest
    range = 1  if range is 0
    
    # Sizes
    fontIncr = undefined
    colorIncr = undefined
    fontIncr = (opts.size.end - opts.size.start) / range  if opts.size
    
    # Colors
    colorIncr = colorIncrement(opts.color, range)  if opts.color
    @each ->
      weighting = $(this).attr("data-weight") - lowest
      $(this).css "font-size": opts.size.start + (weighting * fontIncr) + opts.size.unit  if opts.size
      $(this).css color: tagColor(opts.color, colorIncr, weighting)  if opts.color


  $.fn.tagcloud.defaults = size:
    start: 14
    end: 18
    unit: "pt"
) Zepto