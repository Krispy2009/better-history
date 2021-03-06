/*! Version: 0.4.2 */
/*
  mustache.js — Logic-less templates in JavaScript

  See http://mustache.github.com/ for more info.
*/
var Mustache = function() {
    function g(a) {
      return String(a).replace(/&(?!#?\w+;)|[<>"']/g, function(a) {
        return f[a] || a
      })
    }
    var a = Object.prototype.toString;
    Array.isArray = Array.isArray ||
    function(b) {
      return a.call(b) == "[object Array]"
    };
    var b = String.prototype.trim,
      c;
    if (b) c = function(a) {
      return a == null ? "" : b.call(a)
    };
    else {
      var d, e;
      /\S/.test(" ") ? (d = /^[\s\xA0]+/, e = /[\s\xA0]+$/) : (d = /^\s+/, e = /\s+$/), c = function(a) {
        return a == null ? "" : a.toString().replace(d, "").replace(e, "")
      }
    }
    var f = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    },
      h = {},
      i = function() {};
    return i.prototype = {
      otag: "{{",
      ctag: "}}",
      pragmas: {},
      buffer: [],
      pragmas_implemented: {
        "IMPLICIT-ITERATOR": !0
      },
      context: {},
      render: function(a, b, c, d) {
        d || (this.context = b, this.buffer = []);
        if (!this.includes("", a)) {
          if (d) return a;
          this.send(a);
          return
        }
        a = this.render_pragmas(a);
        var e = this.render_section(a, b, c);
        e === !1 && (e = this.render_tags(a, b, c, d));
        if (d) return e;
        this.sendLines(e)
      },
      send: function(a) {
        a !== "" && this.buffer.push(a)
      },
      sendLines: function(a) {
        if (a) {
          var b = a.split("\n");
          for (var c = 0; c < b.length; c++) this.send(b[c])
        }
      },
      render_pragmas: function(a) {
        if (!this.includes("%", a)) return a;
        var b = this,
          c = this.getCachedRegex("render_pragmas", function(a, b) {
            return new RegExp(a + "%([\\w-]+) ?([\\w]+=[\\w]+)?" + b, "g")
          });
        return a.replace(c, function(a, c, d) {
          if (!b.pragmas_implemented[c]) throw {
            message: "This implementation of mustache doesn't understand the '" + c + "' pragma"
          };
          b.pragmas[c] = {};
          if (d) {
            var e = d.split("=");
            b.pragmas[c][e[0]] = e[1]
          }
          return ""
        })
      },
      render_partial: function(a, b, d) {
        a = c(a);
        if (!d || d[a] === undefined) throw {
          message: "unknown_partial '" + a + "'"
        };
        return !b || typeof b[a] != "object" ? this.render(d[a], b, d, !0) : this.render(d[a], b[a], d, !0)
      },
      render_section: function(a, b, c) {
        if (!this.includes("#", a) && !this.includes("^", a)) return !1;
        var d = this,
          e = this.getCachedRegex("render_section", function(a, b) {
            return new RegExp("^([\\s\\S]*?)" + a + "(\\^|\\#)\\s*(.+?)\\s*" + b + "\n*([\\s\\S]*?)" + a + "\\/\\s*\\3\\s*" + b + "\\s*([\\s\\S]*)$", "g")
          });
        return a.replace(e, function(a, e, f, g, h, i) {
          var j = e ? d.render_tags(e, b, c, !0) : "",
            k = i ? d.render(i, b, c, !0) : "",
            l, m = d.find(g, b);
          return f === "^" ? !m || Array.isArray(m) && m.length === 0 ? l = d.render(h, b, c, !0) : l = "" : f === "#" && (Array.isArray(m) ? l = d.map(m, function(a) {
            return d.render(h, d.create_context(a), c, !0)
          }).join("") : d.is_object(m) ? l = d.render(h, d.create_context(m), c, !0) : typeof m == "function" ? l = m.call(b, h, function(a) {
            return d.render(a, b, c, !0)
          }) : m ? l = d.render(h, b, c, !0) : l = ""), j + l + k
        })
      },
      render_tags: function(a, b, c, d) {
        var e = this,
          f = function() {
            return e.getCachedRegex("render_tags", function(a, b) {
              return new RegExp(a + "(=|!|>|&|\\{|%)?([^#\\^]+?)\\1?" + b + "+", "g")
            })
          },
          h = f(),
          i = function(a, d, i) {
            switch (d) {
            case "!":
              return "";
            case "=":
              return e.set_delimiters(i), h = f(), "";
            case ">":
              return e.render_partial(i, b, c);
            case "{":
            case "&":
              return e.find(i, b);
            default:
              return g(e.find(i, b))
            }
          },
          j = a.split("\n");
        for (var k = 0; k < j.length; k++) j[k] = j[k].replace(h, i, this), d || this.send(j[k]);
        if (d) return j.join("\n")
      },
      set_delimiters: function(a) {
        var b = a.split(" ");
        this.otag = this.escape_regex(b[0]), this.ctag = this.escape_regex(b[1])
      },
      escape_regex: function(a) {
        if (!arguments.callee.sRE) {
          var b = ["/", ".", "*", "+", "?", "|", "(", ")", "[", "]", "{", "}", "\\"];
          arguments.callee.sRE = new RegExp("(\\" + b.join("|\\") + ")", "g")
        }
        return a.replace(arguments.callee.sRE, "\\$1")
      },
      find: function(a, b) {
        function d(a) {
          return a === !1 || a === 0 || a
        }
        a = c(a);
        var e;
        if (a.match(/([a-z_]+)\./ig)) {
          var f = this.walk_context(a, b);
          d(f) && (e = f)
        } else d(b[a]) ? e = b[a] : d(this.context[a]) && (e = this.context[a]);
        return typeof e == "function" ? e.apply(b) : e !== undefined ? e : ""
      },
      walk_context: function(a, b) {
        var c = a.split("."),
          d = b[c[0]] != undefined ? b : this.context,
          e = d[c.shift()];
        while (e != undefined && c.length > 0) d = e, e = e[c.shift()];
        return typeof e == "function" ? e.apply(d) : e
      },
      includes: function(a, b) {
        return b.indexOf(this.otag + a) != -1
      },
      create_context: function(a) {
        if (this.is_object(a)) return a;
        var b = ".";
        this.pragmas["IMPLICIT-ITERATOR"] && (b = this.pragmas["IMPLICIT-ITERATOR"].iterator);
        var c = {};
        return c[b] = a, c
      },
      is_object: function(a) {
        return a && typeof a == "object"
      },
      map: function(a, b) {
        if (typeof a.map == "function") return a.map(b);
        var c = [],
          d = a.length;
        for (var e = 0; e < d; e++) c.push(b(a[e]));
        return c
      },
      getCachedRegex: function(a, b) {
        var c = h[this.otag];
        c || (c = h[this.otag] = {});
        var d = c[this.ctag];
        d || (d = c[this.ctag] = {});
        var e = d[a];
        return e || (e = d[a] = b(this.otag, this.ctag)), e
      }
    }, {
      name: "mustache.js",
      version: "0.4.2",
      to_html: function(a, b, c, d) {
        var e = new i;
        d && (e.send = d), e.render(a, b || {}, c);
        if (!d) return e.buffer.join("\n")
      }
    }
  }();
