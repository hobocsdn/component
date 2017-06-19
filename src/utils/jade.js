/*eslint-disable*/
/*! jQuery v2.1.1 | (c) 2005, 2014 jQuery Foundation, Inc. | jquery.org/license */

!function (a) {
    if ("object" == typeof exports)
        module.exports = a();
    else if ("function" == typeof define && define.amd)
        define(a);
    else {
        var b;
        "undefined" != typeof window ? b = window : "undefined" != typeof global ? b = global : "undefined" != typeof self && (b = self),
            b.jade = a()
    }
}(function () {
    return function d(a, b, c) {
        function e(g, h) {
            if (!b[g]) {
                if (!a[g]) {
                    var i = "function" == typeof require && require;
                    if (!h && i)
                        return i(g, !0);
                    if (f)
                        return f(g, !0);
                    throw new Error("Cannot find module '" + g + "'")
                }
                var j = b[g] = {
                    exports: {}
                };
                a[g][0].call(j.exports, function (b) {
                    var c = a[g][1][b];
                    return e(c ? c : b)
                }, j, j.exports, d, a, b, c)
            }
            return b[g].exports
        }
        for (var f = "function" == typeof require && require, g = 0; g < c.length; g++)
            e(c[g]);
        return e
    }({
        1: [function (a, b) {
            "use strict";
            function l(a) {
                return k(a, {
                    jade: g,
                    jade_interp: void 0
                })
            }
            function m(a) {
                return k.toConstant(a, {
                    jade: g,
                    jade_interp: void 0
                })
            }
            function n(a, b) {
                return b.line = a.line,
                    b.filename = a.filename,
                    b
            }
            a("./nodes");
            var e = a("./filters")
                , f = a("./doctypes")
                , g = a("./runtime")
                , h = a("./utils")
                , i = a("void-elements")
                , j = a("character-parser").parseMax
                , k = a("constantinople")
                , o = b.exports = function (a, b) {
                    this.options = b = b || {},
                        this.node = a,
                        this.hasCompiledDoctype = !1,
                        this.hasCompiledTag = !1,
                        this.pp = b.pretty || !1,
                        this.debug = !1 !== b.compileDebug,
                        this.indents = 0,
                        this.parentIndents = 0,
                        this.terse = !1,
                        this.mixins = {},
                        this.dynamicMixins = !1,
                        b.doctype && this.setDoctype(b.doctype)
                }
                ;
            o.prototype = {
                compile: function () {
                    if (this.buf = [],
                        this.pp && this.buf.push("var jade_indent = [];"),
                        this.lastBufferedIdx = -1,
                        this.visit(this.node),
                        !this.dynamicMixins)
                        for (var a = Object.keys(this.mixins), b = 0; b < a.length; b++) {
                            var c = this.mixins[a[b]];
                            if (!c.used)
                                for (var d = 0; d < c.instances.length; d++)
                                    for (var e = c.instances[d].start; e < c.instances[d].end; e++)
                                        this.buf[e] = ""
                        }
                    return this.buf.join("\n")
                },
                setDoctype: function (a) {
                    this.doctype = f[a.toLowerCase()] || "<!DOCTYPE " + a + ">",
                        this.terse = "<!doctype html>" == this.doctype.toLowerCase(),
                        this.xml = 0 == this.doctype.indexOf("<?xml")
                },
                buffer: function (a, b) {
                    if (b) {
                        var d = /(\\)?([#!]){((?:.|\n)*)$/.exec(a);
                        if (d) {
                            if (this.buffer(a.substr(0, d.index), !1),
                                d[1])
                                return this.buffer(d[2] + "{", !1),
                                    this.buffer(d[3], !0),
                                    void 0;
                            var e = d[3]
                                , f = j(e)
                                , g = ("!" == d[2] ? "" : "jade.escape") + "((jade_interp = " + f.src + ") == null ? '' : jade_interp)";
                            return this.bufferExpression(g),
                                this.buffer(e.substr(f.end + 1), !0),
                                void 0
                        }
                    }
                    a = h.stringify(a),
                        a = a.substr(1, a.length - 2),
                        this.lastBufferedIdx == this.buf.length ? ("code" === this.lastBufferedType && (this.lastBuffered += ' + "'),
                            this.lastBufferedType = "text",
                            this.lastBuffered += a,
                            this.buf[this.lastBufferedIdx - 1] = "buf.push(" + this.bufferStartChar + this.lastBuffered + '");') : (this.buf.push('buf.push("' + a + '");'),
                                this.lastBufferedType = "text",
                                this.bufferStartChar = '"',
                                this.lastBuffered = a,
                                this.lastBufferedIdx = this.buf.length)
                },
                bufferExpression: function (a) {
                    return l(a) ? this.buffer(m(a) + "", !1) : (this.lastBufferedIdx == this.buf.length ? ("text" === this.lastBufferedType && (this.lastBuffered += '"'),
                        this.lastBufferedType = "code",
                        this.lastBuffered += " + (" + a + ")",
                        this.buf[this.lastBufferedIdx - 1] = "buf.push(" + this.bufferStartChar + this.lastBuffered + ");") : (this.buf.push("buf.push(" + a + ");"),
                            this.lastBufferedType = "code",
                            this.bufferStartChar = "",
                            this.lastBuffered = "(" + a + ")",
                            this.lastBufferedIdx = this.buf.length),
                        void 0)
                },
                prettyIndent: function (a, b) {
                    a = a || 0,
                        b = b ? "\n" : "",
                        this.buffer(b + Array(this.indents + a).join("  ")),
                        this.parentIndents && this.buf.push("buf.push.apply(buf, jade_indent);")
                },
                visit: function (a) {
                    var b = this.debug;
                    b && this.buf.push("jade_debug.unshift({ lineno: " + a.line + ", filename: " + (a.filename ? h.stringify(a.filename) : "jade_debug[0].filename") + " });"),
                        !1 === a.debug && this.debug && (this.buf.pop(),
                            this.buf.pop()),
                        this.visitNode(a),
                        b && this.buf.push("jade_debug.shift();")
                },
                visitNode: function (a) {
                    return this["visit" + a.type](a)
                },
                visitCase: function (a) {
                    var b = this.withinCase;
                    this.withinCase = !0,
                        this.buf.push("switch (" + a.expr + "){"),
                        this.visit(a.block),
                        this.buf.push("}"),
                        this.withinCase = b
                },
                visitWhen: function (a) {
                    "default" == a.expr ? this.buf.push("default:") : this.buf.push("case " + a.expr + ":"),
                        a.block && (this.visit(a.block),
                            this.buf.push("  break;"))
                },
                visitLiteral: function (a) {
                    this.buffer(a.str)
                },
                visitBlock: function (a) {
                    var b = a.nodes.length
                        , c = this.escape
                        , d = this.pp;
                    d && b > 1 && !c && a.nodes[0].isText && a.nodes[1].isText && this.prettyIndent(1, !0);
                    for (var e = 0; b > e; ++e)
                        d && e > 0 && !c && a.nodes[e].isText && a.nodes[e - 1].isText && this.prettyIndent(1, !1),
                            this.visit(a.nodes[e]),
                            a.nodes[e + 1] && a.nodes[e].isText && a.nodes[e + 1].isText && this.buffer("\n")
                },
                visitMixinBlock: function () {
                    this.pp && this.buf.push("jade_indent.push('" + Array(this.indents + 1).join("  ") + "');"),
                        this.buf.push("block && block();"),
                        this.pp && this.buf.push("jade_indent.pop();")
                },
                visitDoctype: function (a) {
                    !a || !a.val && this.doctype || this.setDoctype(a.val || "default"),
                        this.doctype && this.buffer(this.doctype),
                        this.hasCompiledDoctype = !0
                },
                visitMixin: function (a) {
                    var b = "jade_mixins["
                        , c = a.args || ""
                        , d = a.block
                        , e = a.attrs
                        , f = a.attributeBlocks
                        , g = this.pp
                        , h = "#" === a.name[0]
                        , i = a.name;
                    if (h && (this.dynamicMixins = !0),
                        b += (h ? a.name.substr(2, a.name.length - 3) : '"' + a.name + '"') + "]",
                        this.mixins[i] = this.mixins[i] || {
                            used: !1,
                            instances: []
                        },
                        a.call) {
                        if (this.mixins[i].used = !0,
                            g && this.buf.push("jade_indent.push('" + Array(this.indents + 1).join("  ") + "');"),
                            d || e.length || f.length) {
                            if (this.buf.push(b + ".call({"),
                                d) {
                                this.buf.push("block: function(){"),
                                    this.parentIndents++;
                                var j = this.indents;
                                this.indents = 0,
                                    this.visit(a.block),
                                    this.indents = j,
                                    this.parentIndents-- ,
                                    e.length || f.length ? this.buf.push("},") : this.buf.push("}")
                            }
                            if (f.length) {
                                if (e.length) {
                                    var k = this.attrs(e);
                                    f.unshift(k)
                                }
                                this.buf.push("attributes: jade.merge([" + f.join(",") + "])")
                            } else if (e.length) {
                                var k = this.attrs(e);
                                this.buf.push("attributes: " + k)
                            }
                            c ? this.buf.push("}, " + c + ");") : this.buf.push("});")
                        } else
                            this.buf.push(b + "(" + c + ");");
                        g && this.buf.push("jade_indent.pop();")
                    } else {
                        var l = this.buf.length;
                        c = c ? c.split(",") : [];
                        var m;
                        c.length && /^\.\.\./.test(c[c.length - 1].trim()) && (m = c.pop().trim().replace(/^\.\.\./, "")),
                            this.buf.push(b + " = function(" + c.join(",") + "){"),
                            this.buf.push("var block = (this && this.block), attributes = (this && this.attributes) || {};"),
                            m && (this.buf.push("var " + m + " = [];"),
                                this.buf.push("for (jade_interp = " + c.length + "; jade_interp < arguments.length; jade_interp++) {"),
                                this.buf.push("  " + m + ".push(arguments[jade_interp]);"),
                                this.buf.push("}")),
                            this.parentIndents++ ,
                            this.visit(d),
                            this.parentIndents-- ,
                            this.buf.push("};");
                        var n = this.buf.length;
                        this.mixins[i].instances.push({
                            start: l,
                            end: n
                        })
                    }
                },
                visitTag: function (a) {
                    function e() {
                        a.buffer ? d.bufferExpression(b) : d.buffer(b)
                    }
                    this.indents++;
                    var b = a.name
                        , c = this.pp
                        , d = this;
                    if ("pre" == a.name && (this.escape = !0),
                        this.hasCompiledTag || (this.hasCompiledDoctype || "html" != b || this.visitDoctype(),
                            this.hasCompiledTag = !0),
                        c && !a.isInline() && this.prettyIndent(0, !0),
                        a.selfClosing || !this.xml && -1 !== i.indexOf(a.name)) {
                        if (this.buffer("<"),
                            e(),
                            this.visitAttributes(a.attrs, a.attributeBlocks),
                            this.terse ? this.buffer(">") : this.buffer("/>"),
                            a.block && ("Block" !== a.block.type || 0 !== a.block.nodes.length) && a.block.nodes.some(function (a) {
                                return "Text" !== a.type || !/^\s*$/.test(a.val)
                            }))
                            throw n(a, new Error(b + " is self closing and should not have content."))
                    } else
                        this.buffer("<"),
                            e(),
                            this.visitAttributes(a.attrs, a.attributeBlocks),
                            this.buffer(">"),
                            a.code && this.visitCode(a.code),
                            this.visit(a.block),
                            !c || a.isInline() || "pre" == a.name || a.canInline() || this.prettyIndent(0, !0),
                            this.buffer("</"),
                            e(),
                            this.buffer(">");
                    "pre" == a.name && (this.escape = !1),
                        this.indents--
                },
                visitFilter: function (a) {
                    var b = a.block.nodes.map(function (a) {
                        return a.val
                    }).join("\n");
                    a.attrs.filename = this.options.filename;
                    try {
                        this.buffer(e(a.name, b, a.attrs), !0)
                    } catch (c) {
                        throw n(a, c)
                    }
                },
                visitText: function (a) {
                    this.buffer(a.val, !0)
                },
                visitComment: function (a) {
                    a.buffer && (this.pp && this.prettyIndent(1, !0),
                        this.buffer("<!--" + a.val + "-->"))
                },
                visitBlockComment: function (a) {
                    a.buffer && (this.pp && this.prettyIndent(1, !0),
                        this.buffer("<!--" + a.val),
                        this.visit(a.block),
                        this.pp && this.prettyIndent(1, !0),
                        this.buffer("-->"))
                },
                visitCode: function (a) {
                    if (a.buffer) {
                        var b = a.val.trimLeft();
                        b = "null == (jade_interp = " + b + ') ? "" : jade_interp',
                            a.escape && (b = "jade.escape(" + b + ")"),
                            this.bufferExpression(b)
                    } else
                        this.buf.push(a.val);
                    a.block && (a.buffer || this.buf.push("{"),
                        this.visit(a.block),
                        a.buffer || this.buf.push("}"))
                },
                visitEach: function (a) {
                    this.buf.push("// iterate " + a.obj + "\n" + ";(function(){\n" + "  var $$obj = " + a.obj + ";\n" + "  if ('number' == typeof $$obj.length) {\n"),
                        a.alternative && this.buf.push("  if ($$obj.length) {"),
                        this.buf.push("    for (var " + a.key + " = 0, $$l = $$obj.length; " + a.key + " < $$l; " + a.key + "++) {\n" + "      var " + a.val + " = $$obj[" + a.key + "];\n"),
                        this.visit(a.block),
                        this.buf.push("    }\n"),
                        a.alternative && (this.buf.push("  } else {"),
                            this.visit(a.alternative),
                            this.buf.push("  }")),
                        this.buf.push("  } else {\n    var $$l = 0;\n    for (var " + a.key + " in $$obj) {\n" + "      $$l++;" + "      var " + a.val + " = $$obj[" + a.key + "];\n"),
                        this.visit(a.block),
                        this.buf.push("    }\n"),
                        a.alternative && (this.buf.push("    if ($$l === 0) {"),
                            this.visit(a.alternative),
                            this.buf.push("    }")),
                        this.buf.push("  }\n}).call(this);\n")
                },
                visitAttributes: function (a, b) {
                    if (b.length) {
                        if (a.length) {
                            var c = this.attrs(a);
                            b.unshift(c)
                        }
                        this.bufferExpression("jade.attrs(jade.merge([" + b.join(",") + "]), " + h.stringify(this.terse) + ")")
                    } else
                        a.length && this.attrs(a, !0)
                },
                attrs: function (a, b) {
                    var c = []
                        , d = []
                        , e = [];
                    return a.forEach(function (a) {
                        var f = a.name
                            , i = a.escaped;
                        if ("class" === f)
                            d.push(a.val),
                                e.push(a.escaped);
                        else if (l(a.val))
                            if (b)
                                this.buffer(g.attr(f, m(a.val), i, this.terse));
                            else {
                                var j = m(a.val);
                                !i || 0 === f.indexOf("data") && "string" != typeof j || (j = g.escape(j)),
                                    c.push(h.stringify(f) + ": " + h.stringify(j))
                            }
                        else if (b)
                            this.bufferExpression('jade.attr("' + f + '", ' + a.val + ", " + h.stringify(i) + ", " + h.stringify(this.terse) + ")");
                        else {
                            var j = a.val;
                            i && 0 !== f.indexOf("data") ? j = "jade.escape(" + j + ")" : i && (j = "(typeof (jade_interp = " + j + ') == "string" ? jade.escape(jade_interp) : jade_interp)'),
                                c.push(h.stringify(f) + ": " + j)
                        }
                    }
                        .bind(this)),
                        b ? d.every(l) ? this.buffer(g.cls(d.map(m), e)) : this.bufferExpression("jade.cls([" + d.join(",") + "], " + h.stringify(e) + ")") : d.length && (d = d.every(l) ? h.stringify(g.joinClasses(d.map(m).map(g.joinClasses).map(function (a, b) {
                            return e[b] ? g.escape(a) : a
                        }))) : "(jade_interp = " + h.stringify(e) + "," + " jade.joinClasses([" + d.join(",") + "].map(jade.joinClasses).map(function (cls, i) {" + "   return jade_interp[i] ? jade.escape(cls) : cls" + " }))" + ")",
                            d.length && c.push('"class": ' + d)),
                        "{" + c.join(",") + "}"
                }
            }
        }
            , {
            "./doctypes": 2,
            "./filters": 3,
            "./nodes": 16,
            "./runtime": 24,
            "./utils": 25,
            "character-parser": 32,
            constantinople: 33,
            "void-elements": 45
        }],
        2: [function (a, b) {
            "use strict";
            b.exports = {
                "default": "<!DOCTYPE html>",
                xml: '<?xml version="1.0" encoding="utf-8" ?>',
                transitional: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
                strict: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
                frameset: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">',
                1.1: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">',
                basic: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">',
                mobile: '<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.2//EN" "http://www.openmobilealliance.org/tech/DTD/xhtml-mobile12.dtd">'
            }
        }
            , {}],
        3: [function (a, b) {
            "use strict";
            function d(a, b, c) {
                if ("function" == typeof d[a])
                    return d[a](b, c);
                throw new Error('unknown filter ":' + a + '"')
            }
            b.exports = d
        }
            , {}],
        4: [function (a, b) {
            "use strict";
            b.exports = ["a", "abbr", "acronym", "b", "br", "code", "em", "font", "i", "img", "ins", "kbd", "map", "samp", "small", "span", "strong", "sub", "sup"]
        }
            , {}],
        5: [function (a, b, c) {
            "use strict";
            function k(a, b) {
                var e, c = new (b.parser || d)(a, b.filename, b);
                try {
                    e = c.parse()
                } catch (i) {
                    c = c.context(),
                        g.rethrow(i, c.filename, c.lexer.lineno, c.input)
                }
                var k, j = new (b.compiler || f)(e, b);
                try {
                    k = j.compile()
                } catch (i) {
                    !i.line || !i.filename && b.filename || g.rethrow(i, i.filename, i.line, c.input)
                }
                b.debug && console.error("\nCompiled Function:\n\n[90m%s[0m", k.replace(/^/gm, "  "));
                var l = [];
                b.globals && (l = b.globals.slice()),
                    l.push("jade"),
                    l.push("jade_mixins"),
                    l.push("jade_interp"),
                    l.push("jade_debug"),
                    l.push("buf");
                var m = "var buf = [];\nvar jade_mixins = {};\nvar jade_interp;\n" + (b.self ? "var self = locals || {};\n" + k : h("locals || {}", "\n" + k, l)) + ";" + 'return buf.join("");';
                return {
                    body: m,
                    dependencies: c.dependencies
                }
            }
            var d = a("./parser")
                , e = a("./lexer")
                , f = a("./compiler")
                , g = a("./runtime")
                , h = a("with")
                , i = a("fs")
                , j = a("./utils");
            c.selfClosing = a("void-elements"),
                c.doctypes = a("./doctypes"),
                c.filters = a("./filters"),
                c.utils = a("./utils"),
                c.Compiler = f,
                c.Parser = d,
                c.Lexer = e,
                c.nodes = a("./nodes"),
                c.runtime = g,
                c.cache = {},
                c.compile = function (a, b) {
                    var e, b = b || {}, d = b.filename ? j.stringify(b.filename) : "undefined";
                    a = String(a);
                    var f = k(a, b);
                    e = b.compileDebug !== !1 ? ["var jade_debug = [{ lineno: 1, filename: " + d + " }];", "try {", f.body, "} catch (err) {", "  jade.rethrow(err, jade_debug[0].filename, jade_debug[0].lineno" + (b.compileDebug === !0 ? "," + j.stringify(a) : "") + ");", "}"].join("\n") : f.body,
                        e = new Function("locals, jade", e);
                    var h = function (a) {
                        return e(a, Object.create(g))
                    };
                    return b.client && (h.toString = function () {
                        var d = new Error("The `client` option is deprecated, use the `jade.compileClient` method instead");
                        return d.name = "Warning",
                            console.error(d.stack || d.message),
                            c.compileClient(a, b)
                    }
                    ),
                        h.dependencies = f.dependencies,
                        h
                }
                ,
                c.compileClient = function (a, b) {
                    var e, b = b || {}, c = b.name || "template", d = b.filename ? j.stringify(b.filename) : "undefined";
                    return a = String(a),
                        b.compileDebug ? (b.compileDebug = !0,
                            e = ["var jade_debug = [{ lineno: 1, filename: " + d + " }];", "try {", k(a, b).body, "} catch (err) {", "  jade.rethrow(err, jade_debug[0].filename, jade_debug[0].lineno, " + j.stringify(a) + ");", "}"].join("\n")) : (b.compileDebug = !1,
                                e = k(a, b).body),
                        "function " + c + "(locals) {\n" + e + "\n}"
                }
                ,
                c.compileFile = function (a, b) {
                    b = b || {};
                    var d = a + ":string";
                    b.filename = a;
                    var e = b.cache ? c.cache[d] || (c.cache[d] = i.readFileSync(a, "utf8")) : i.readFileSync(a, "utf8");
                    return b.cache ? c.cache[a] || (c.cache[a] = c.compile(e, b)) : c.compile(e, b)
                }
                ,
                c.render = function (a, b, d) {
                    if ("function" == typeof b && (d = b,
                        b = void 0),
                        "function" == typeof d) {
                        var e;
                        try {
                            e = c.render(a, b)
                        } catch (f) {
                            return d(f)
                        }
                        return d(null, e)
                    }
                    if (b = b || {},
                        b.cache && !b.filename)
                        throw new Error('the "filename" option is required for caching');
                    var g = b.filename
                        , h = b.cache ? c.cache[g] || (c.cache[g] = c.compile(a, b)) : c.compile(a, b);
                    return h(b)
                }
                ,
                c.renderFile = function (a, b, d) {
                    if ("function" == typeof b && (d = b,
                        b = void 0),
                        "function" == typeof d) {
                        var e;
                        try {
                            e = c.renderFile(a, b)
                        } catch (f) {
                            return d(f)
                        }
                        return d(null, e)
                    }
                    b = b || {};
                    var g = a + ":string";
                    b.filename = a;
                    var h = b.cache ? c.cache[g] || (c.cache[g] = i.readFileSync(a, "utf8")) : i.readFileSync(a, "utf8");
                    return c.render(h, b)
                }
                ,
                c.compileFileClient = function (a, b) {
                    b = b || {};
                    var d = a + ":string";
                    b.filename = a;
                    var e = b.cache ? c.cache[d] || (c.cache[d] = i.readFileSync(a, "utf8")) : i.readFileSync(a, "utf8");
                    return c.compileClient(e, b)
                }
                ,
                c.__express = c.renderFile
        }
            , {
            "./compiler": 1,
            "./doctypes": 2,
            "./filters": 3,
            "./lexer": 6,
            "./nodes": 16,
            "./parser": 23,
            "./runtime": 24,
            "./utils": 25,
            fs: 26,
            "void-elements": 45,
            "with": 46
        }],
        6: [function (a, b) {
            "use strict";
            function g(a) {
                Function("", "return (" + a + ")")
            }
            function h(a) {
                var b = e(a);
                if (b.isNesting())
                    throw new Error("Nesting must match on expression `" + a + "`")
            }
            var d = a("./utils")
                , e = a("character-parser")
                , f = b.exports = function (a, b) {
                    this.input = a.replace(/\r\n|\r/g, "\n"),
                        this.filename = b,
                        this.deferredTokens = [],
                        this.lastIndents = 0,
                        this.lineno = 1,
                        this.stash = [],
                        this.indentStack = [],
                        this.indentRe = null,
                        this.pipeless = !1
                }
                ;
            f.prototype = {
                tok: function (a, b) {
                    return {
                        type: a,
                        line: this.lineno,
                        val: b
                    }
                },
                consume: function (a) {
                    this.input = this.input.substr(a)
                },
                scan: function (a, b) {
                    var c;
                    return (c = a.exec(this.input)) ? (this.consume(c[0].length),
                        this.tok(b, c[1])) : void 0
                },
                defer: function (a) {
                    this.deferredTokens.push(a)
                },
                lookahead: function (a) {
                    for (var b = a - this.stash.length; b-- > 0;)
                        this.stash.push(this.next());
                    return this.stash[--a]
                },
                bracketExpression: function (a) {
                    a = a || 0;
                    var b = this.input[a];
                    if ("(" != b && "{" != b && "[" != b)
                        throw new Error("unrecognized start character");
                    var c = {
                        "(": ")",
                        "{": "}",
                        "[": "]"
                    }[b]
                        , d = e.parseMax(this.input, {
                            start: a + 1
                        });
                    if (this.input[d.end] !== c)
                        throw new Error("start character " + b + " does not match end character " + this.input[d.end]);
                    return d
                },
                stashed: function () {
                    return this.stash.length && this.stash.shift()
                },
                deferred: function () {
                    return this.deferredTokens.length && this.deferredTokens.shift()
                },
                eos: function () {
                    return this.input.length ? void 0 : this.indentStack.length ? (this.indentStack.shift(),
                        this.tok("outdent")) : this.tok("eos")
                },
                blank: function () {
                    var a;
                    return (a = /^\n *\n/.exec(this.input)) ? (this.consume(a[0].length - 1),
                        ++this.lineno,
                        this.pipeless ? this.tok("text", "") : this.next()) : void 0
                },
                comment: function () {
                    var a;
                    if (a = /^\/\/(-)?([^\n]*)/.exec(this.input)) {
                        this.consume(a[0].length);
                        var b = this.tok("comment", a[2]);
                        return b.buffer = "-" != a[1],
                            this.pipeless = !0,
                            b
                    }
                },
                interpolation: function () {
                    if (/^#\{/.test(this.input)) {
                        var a;
                        try {
                            a = this.bracketExpression(1)
                        } catch (b) {
                            return
                        }
                        return this.consume(a.end + 1),
                            this.tok("interpolation", a.src)
                    }
                },
                tag: function () {
                    var a;
                    if (a = /^(\w[-:\w]*)(\/?)/.exec(this.input)) {
                        this.consume(a[0].length);
                        var b, c = a[1];
                        if (":" == c[c.length - 1])
                            for (c = c.slice(0, -1),
                                b = this.tok("tag", c),
                                this.defer(this.tok(":")); " " == this.input[0];)
                                this.input = this.input.substr(1);
                        else
                            b = this.tok("tag", c);
                        return b.selfClosing = !!a[2],
                            b
                    }
                },
                filter: function () {
                    var a = this.scan(/^:([\w\-]+)/, "filter");
                    return a ? (this.pipeless = !0,
                        a) : void 0
                },
                doctype: function () {
                    if (this.scan(/^!!! *([^\n]+)?/, "doctype"))
                        throw new Error("`!!!` is deprecated, you must now use `doctype`");
                    var a = this.scan(/^(?:doctype) *([^\n]+)?/, "doctype");
                    if (a && a.val && "5" === a.val.trim())
                        throw new Error("`doctype 5` is deprecated, you must now use `doctype html`");
                    return a
                },
                id: function () {
                    return this.scan(/^#([\w-]+)/, "id")
                },
                className: function () {
                    return this.scan(/^\.([\w-]+)/, "class")
                },
                text: function () {
                    return this.scan(/^(?:\| ?| )([^\n]+)/, "text") || this.scan(/^\|?( )/, "text") || this.scan(/^(<[^\n]*)/, "text")
                },
                textFail: function () {
                    var a;
                    return (a = this.scan(/^([^\.\n][^\n]+)/, "text")) ? (console.warn("Warning: missing space before text for line " + this.lineno + ' of jade file "' + this.filename + '"'),
                        a) : void 0
                },
                dot: function () {
                    var a;
                    return (a = this.scan(/^\./, "dot")) ? (this.pipeless = !0,
                        a) : void 0
                },
                "extends": function () {
                    return this.scan(/^extends? +([^\n]+)/, "extends")
                },
                prepend: function () {
                    var a;
                    if (a = /^prepend +([^\n]+)/.exec(this.input)) {
                        this.consume(a[0].length);
                        var b = "prepend"
                            , c = a[1]
                            , d = this.tok("block", c);
                        return d.mode = b,
                            d
                    }
                },
                append: function () {
                    var a;
                    if (a = /^append +([^\n]+)/.exec(this.input)) {
                        this.consume(a[0].length);
                        var b = "append"
                            , c = a[1]
                            , d = this.tok("block", c);
                        return d.mode = b,
                            d
                    }
                },
                block: function () {
                    var a;
                    if (a = /^block\b *(?:(prepend|append) +)?([^\n]+)/.exec(this.input)) {
                        this.consume(a[0].length);
                        var b = a[1] || "replace"
                            , c = a[2]
                            , d = this.tok("block", c);
                        return d.mode = b,
                            d
                    }
                },
                mixinBlock: function () {
                    var a;
                    return (a = /^block[ \t]*(\n|$)/.exec(this.input)) ? (this.consume(a[0].length - a[1].length),
                        this.tok("mixin-block")) : void 0
                },
                yield: function () {
                    return this.scan(/^yield */, "yield")
                },
                include: function () {
                    return this.scan(/^include +([^\n]+)/, "include")
                },
                includeFiltered: function () {
                    var a;
                    if (a = /^include:([\w\-]+)([\( ])/.exec(this.input)) {
                        this.consume(a[0].length - 1);
                        var b = a[1]
                            , c = "(" === a[2] ? this.attrs() : null;
                        if (" " !== a[2] && " " !== this.input[0])
                            throw new Error("expected space after include:filter but got " + d.stringify(this.input[0]));
                        if (a = /^ *([^\n]+)/.exec(this.input),
                            !a || "" === a[1].trim())
                            throw new Error("missing path for include:filter");
                        this.consume(a[0].length);
                        var e = a[1]
                            , f = this.tok("include", e);
                        return f.filter = b,
                            f.attrs = c,
                            f
                    }
                },
                "case": function () {
                    return this.scan(/^case +([^\n]+)/, "case")
                },
                when: function () {
                    return this.scan(/^when +([^:\n]+)/, "when")
                },
                "default": function () {
                    return this.scan(/^default */, "default")
                },
                call: function () {
                    var a, b;
                    if (b = /^\+(\s*)(([-\w]+)|(#\{))/.exec(this.input)) {
                        if (b[3])
                            this.consume(b[0].length),
                                a = this.tok("call", b[3]);
                        else {
                            var c;
                            try {
                                c = this.bracketExpression(2 + b[1].length)
                            } catch (d) {
                                return
                            }
                            this.consume(c.end + 1),
                                g(c.src),
                                a = this.tok("call", "#{" + c.src + "}")
                        }
                        if (b = /^ *\(/.exec(this.input))
                            try {
                                var e = this.bracketExpression(b[0].length - 1);
                                /^\s*[-\w]+ *=/.test(e.src) || (this.consume(e.end + 1),
                                    a.args = e.src)
                            } catch (d) { }
                        return a
                    }
                },
                mixin: function () {
                    var a;
                    if (a = /^mixin +([-\w]+)(?: *\((.*)\))? */.exec(this.input)) {
                        this.consume(a[0].length);
                        var b = this.tok("mixin", a[1]);
                        return b.args = a[2],
                            b
                    }
                },
                conditional: function () {
                    var a;
                    if (a = /^(if|unless|else if|else)\b([^\n]*)/.exec(this.input)) {
                        this.consume(a[0].length);
                        var b = a[1]
                            , c = a[2]
                            , d = !1
                            , e = !1;
                        switch (b) {
                            case "if":
                                g(c),
                                    c = "if (" + c + ")",
                                    d = !0;
                                break;
                            case "unless":
                                g(c),
                                    c = "if (!(" + c + "))",
                                    d = !0;
                                break;
                            case "else if":
                                g(c),
                                    c = "else if (" + c + ")",
                                    d = !0,
                                    e = !0;
                                break;
                            case "else":
                                if (c && c.trim())
                                    throw new Error("`else` cannot have a condition, perhaps you meant `else if`");
                                c = "else",
                                    e = !0
                        }
                        var f = this.tok("code", c);
                        return f.isElse = e,
                            f.isIf = d,
                            f.requiresBlock = !0,
                            f
                    }
                },
                "while": function () {
                    var a;
                    if (a = /^while +([^\n]+)/.exec(this.input)) {
                        this.consume(a[0].length),
                            g(a[1]);
                        var b = this.tok("code", "while (" + a[1] + ")");
                        return b.requiresBlock = !0,
                            b
                    }
                },
                each: function () {
                    var a;
                    if (a = /^(?:- *)?(?:each|for) +([a-zA-Z_$][\w$]*)(?: *, *([a-zA-Z_$][\w$]*))? * in *([^\n]+)/.exec(this.input)) {
                        this.consume(a[0].length);
                        var b = this.tok("each", a[1]);
                        return b.key = a[2] || "$index",
                            g(a[3]),
                            b.code = a[3],
                            b
                    }
                },
                code: function () {
                    var a;
                    if (a = /^(!?=|-)[ \t]*([^\n]+)/.exec(this.input)) {
                        this.consume(a[0].length);
                        var b = a[1];
                        a[1] = a[2];
                        var c = this.tok("code", a[1]);
                        return c.escape = "=" === b.charAt(0),
                            c.buffer = "=" === b.charAt(0) || "=" === b.charAt(1),
                            c.buffer && g(a[1]),
                            c
                    }
                },
                attrs: function () {
                    if ("(" == this.input.charAt(0)) {
                        var a = this.bracketExpression().end
                            , b = this.input.substr(1, a - 1)
                            , c = this.tok("attrs");
                        h(b);
                        var d = ""
                            , f = function (a) {
                                return a.replace(/(\\)?#\{(.+)/g, function (a, b, c) {
                                    if (b)
                                        return a;
                                    try {
                                        var h = e.parseMax(c);
                                        return "}" !== c[h.end] ? a.substr(0, 2) + f(a.substr(2)) : (g(h.src),
                                            d + " + (" + h.src + ") + " + d + f(c.substr(h.end + 1)))
                                    } catch (i) {
                                        return a.substr(0, 2) + f(a.substr(2))
                                    }
                                })
                            };
                        this.consume(a + 1),
                            c.attrs = [];
                        var i = !0
                            , j = ""
                            , k = ""
                            , l = ""
                            , m = e.defaultState()
                            , n = "key"
                            , o = function (a) {
                                if ("" === j.trim())
                                    return !1;
                                if (a === b.length)
                                    return !0;
                                if ("key" === n) {
                                    if (" " === b[a] || "\n" === b[a])
                                        for (var c = a; c < b.length; c++)
                                            if (" " != b[c] && "\n" != b[c])
                                                return "=" === b[c] || "!" === b[c] || "," === b[c] ? !1 : !0;
                                    return "," === b[a]
                                }
                                if ("value" === n && !m.isNesting())
                                    try {
                                        if (Function("", "return (" + k + ");"),
                                            " " === b[a] || "\n" === b[a])
                                            for (var c = a; c < b.length; c++)
                                                if (" " != b[c] && "\n" != b[c])
                                                    return e.isPunctuator(b[c]) && '"' != b[c] && "'" != b[c] ? !1 : !0;
                                        return "," === b[a]
                                    } catch (d) {
                                        return !1
                                    }
                            };
                        this.lineno += b.split("\n").length - 1;
                        for (var p = 0; p <= b.length; p++)
                            if (o(p))
                                k = k.trim(),
                                    k && g(k),
                                    j = j.trim(),
                                    j = j.replace(/^['"]|['"]$/g, ""),
                                    c.attrs.push({
                                        name: j,
                                        val: "" == k ? !0 : k,
                                        escaped: i
                                    }),
                                    j = k = "",
                                    n = "key",
                                    i = !1;
                            else
                                switch (n) {
                                    case "key-char":
                                        if (b[p] === d) {
                                            if (n = "key",
                                                p + 1 < b.length && -1 === [" ", ",", "!", "=", "\n"].indexOf(b[p + 1]))
                                                throw new Error("Unexpected character " + b[p + 1] + " expected ` `, `\\n`, `,`, `!` or `=`")
                                        } else
                                            j += b[p];
                                        break;
                                    case "key":
                                        if ("" !== j || '"' !== b[p] && "'" !== b[p])
                                            if ("!" === b[p] || "=" === b[p]) {
                                                if (i = "!" !== b[p],
                                                    "!" === b[p] && p++ ,
                                                    "=" !== b[p])
                                                    throw new Error("Unexpected character " + b[p] + " expected `=`");
                                                n = "value",
                                                    m = e.defaultState()
                                            } else
                                                j += b[p];
                                        else
                                            n = "key-char",
                                                d = b[p];
                                        break;
                                    case "value":
                                        m = e.parseChar(b[p], m),
                                            m.isString() ? (n = "string",
                                                d = b[p],
                                                l = b[p]) : k += b[p];
                                        break;
                                    case "string":
                                        m = e.parseChar(b[p], m),
                                            l += b[p],
                                            m.isString() || (n = "value",
                                                k += f(l))
                                }
                        return "/" == this.input.charAt(0) && (this.consume(1),
                            c.selfClosing = !0),
                            c
                    }
                },
                attributesBlock: function () {
                    if (/^&attributes\b/.test(this.input)) {
                        this.consume(11);
                        var b = this.bracketExpression();
                        return this.consume(b.end + 1),
                            this.tok("&attributes", b.src)
                    }
                },
                indent: function () {
                    var a, b;
                    if (this.indentRe ? a = this.indentRe.exec(this.input) : (b = /^\n(\t*) */,
                        a = b.exec(this.input),
                        a && !a[1].length && (b = /^\n( *)/,
                            a = b.exec(this.input)),
                        a && a[1].length && (this.indentRe = b)),
                        a) {
                        var c, d = a[1].length;
                        if (++this.lineno,
                            this.consume(d + 1),
                            " " == this.input[0] || " " == this.input[0])
                            throw new Error("Invalid indentation, you can use tabs or spaces but not both");
                        if ("\n" == this.input[0])
                            return this.pipeless = !1,
                                this.tok("newline");
                        if (this.indentStack.length && d < this.indentStack[0]) {
                            for (; this.indentStack.length && this.indentStack[0] > d;)
                                this.stash.push(this.tok("outdent")),
                                    this.indentStack.shift();
                            c = this.stash.pop()
                        } else
                            d && d != this.indentStack[0] ? (this.indentStack.unshift(d),
                                c = this.tok("indent", d)) : c = this.tok("newline");
                        return this.pipeless = !1,
                            c
                    }
                },
                pipelessText: function () {
                    if (this.pipeless) {
                        var a, b;
                        this.indentRe ? a = this.indentRe.exec(this.input) : (b = /^\n(\t*) */,
                            a = b.exec(this.input),
                            a && !a[1].length && (b = /^\n( *)/,
                                a = b.exec(this.input)),
                            a && a[1].length && (this.indentRe = b));
                        var c = a && a[1].length;
                        if (c && (0 === this.indentStack.length || c > this.indentStack[0])) {
                            var g, d = a[1], f = [];
                            do {
                                var h = this.input.substr(1).indexOf("\n");
                                -1 == h && (h = this.input.length - 1);
                                var i = this.input.substr(1, h);
                                g = i.substr(0, d.length) === d || !i.trim(),
                                    g && (this.consume(i.length + 1),
                                        f.push(i.substr(d.length)))
                            } while (this.input.length && g); for (; 0 === this.input.length && "" === f[f.length - 1];)
                                f.pop();
                            return this.tok("pipeless-text", f)
                        }
                    }
                },
                colon: function () {
                    return this.scan(/^: */, ":")
                },
                fail: function () {
                    throw new Error("unexpected text " + this.input.substr(0, 5))
                },
                advance: function () {
                    return this.stashed() || this.next()
                },
                next: function () {
                    return this.deferred() || this.blank() || this.eos() || this.pipelessText() || this.yield() || this.doctype() || this.interpolation() || this["case"]() || this.when() || this["default"]() || this["extends"]() || this.append() || this.prepend() || this.block() || this.mixinBlock() || this.include() || this.includeFiltered() || this.mixin() || this.call() || this.conditional() || this.each() || this["while"]() || this.tag() || this.filter() || this.code() || this.id() || this.className() || this.attrs() || this.attributesBlock() || this.indent() || this.text() || this.comment() || this.colon() || this.dot() || this.textFail() || this.fail()
                }
            }
        }
            , {
            "./utils": 25,
            "character-parser": 32
        }],
        7: [function (a, b) {
            "use strict";
            var d = a("./node")
                , e = b.exports = function () {
                    this.attributeNames = [],
                        this.attrs = [],
                        this.attributeBlocks = []
                }
                ;
            e.prototype = Object.create(d.prototype),
                e.prototype.constructor = e,
                e.prototype.type = "Attrs",
                e.prototype.setAttribute = function (a, b, c) {
                    if ("class" !== a && -1 !== this.attributeNames.indexOf(a))
                        throw new Error('Duplicate attribute "' + a + '" is not allowed.');
                    return this.attributeNames.push(a),
                        this.attrs.push({
                            name: a,
                            val: b,
                            escaped: c
                        }),
                        this
                }
                ,
                e.prototype.removeAttribute = function (a) {
                    var b = new Error("attrs.removeAttribute is deprecated and will be removed in v2.0.0");
                    console.warn(b.stack);
                    for (var c = 0, d = this.attrs.length; d > c; ++c)
                        this.attrs[c] && this.attrs[c].name == a && delete this.attrs[c]
                }
                ,
                e.prototype.getAttribute = function (a) {
                    var b = new Error("attrs.getAttribute is deprecated and will be removed in v2.0.0");
                    console.warn(b.stack);
                    for (var c = 0, d = this.attrs.length; d > c; ++c)
                        if (this.attrs[c] && this.attrs[c].name == a)
                            return this.attrs[c].val
                }
                ,
                e.prototype.addAttributes = function (a) {
                    this.attributeBlocks.push(a)
                }
        }
            , {
            "./node": 20
        }],
        8: [function (a, b) {
            "use strict";
            var d = a("./node")
                , e = b.exports = function (a, b, c) {
                    this.block = b,
                        this.val = a,
                        this.buffer = c
                }
                ;
            e.prototype = Object.create(d.prototype),
                e.prototype.constructor = e,
                e.prototype.type = "BlockComment"
        }
            , {
            "./node": 20
        }],
        9: [function (a, b) {
            "use strict";
            var d = a("./node")
                , e = b.exports = function (a) {
                    this.nodes = [],
                        a && this.push(a)
                }
                ;
            e.prototype = Object.create(d.prototype),
                e.prototype.constructor = e,
                e.prototype.type = "Block",
                e.prototype.isBlock = !0,
                e.prototype.replace = function (a) {
                    var b = new Error("block.replace is deprecated and will be removed in v2.0.0");
                    console.warn(b.stack),
                        a.nodes = this.nodes
                }
                ,
                e.prototype.push = function (a) {
                    return this.nodes.push(a)
                }
                ,
                e.prototype.isEmpty = function () {
                    return 0 == this.nodes.length
                }
                ,
                e.prototype.unshift = function (a) {
                    return this.nodes.unshift(a)
                }
                ,
                e.prototype.includeBlock = function () {
                    for (var b, a = this, c = 0, d = this.nodes.length; d > c; ++c) {
                        if (b = this.nodes[c],
                            b.yield)
                            return b;
                        if (!b.textOnly && (b.includeBlock ? a = b.includeBlock() : b.block && !b.block.isEmpty() && (a = b.block.includeBlock()),
                            a.yield))
                            return a
                    }
                    return a
                }
                ,
                e.prototype.clone = function () {
                    var a = new Error("block.clone is deprecated and will be removed in v2.0.0");
                    console.warn(a.stack);
                    for (var b = new e, c = 0, d = this.nodes.length; d > c; ++c)
                        b.push(this.nodes[c].clone());
                    return b
                }
        }
            , {
            "./node": 20
        }],
        10: [function (a, b, c) {
            "use strict";
            var d = a("./node")
                , e = c = b.exports = function (a, b) {
                    this.expr = a,
                        this.block = b
                }
                ;
            e.prototype = Object.create(d.prototype),
                e.prototype.constructor = e,
                e.prototype.type = "Case";
            var f = c.When = function (a, b) {
                this.expr = a,
                    this.block = b,
                    this.debug = !1
            }
                ;
            f.prototype = Object.create(d.prototype),
                f.prototype.constructor = f,
                f.prototype.type = "When"
        }
            , {
            "./node": 20
        }],
        11: [function (a, b) {
            "use strict";
            var d = a("./node")
                , e = b.exports = function (a, b, c) {
                    this.val = a,
                        this.buffer = b,
                        this.escape = c,
                        a.match(/^ *else/) && (this.debug = !1)
                }
                ;
            e.prototype = Object.create(d.prototype),
                e.prototype.constructor = e,
                e.prototype.type = "Code"
        }
            , {
            "./node": 20
        }],
        12: [function (a, b) {
            "use strict";
            var d = a("./node")
                , e = b.exports = function (a, b) {
                    this.val = a,
                        this.buffer = b
                }
                ;
            e.prototype = Object.create(d.prototype),
                e.prototype.constructor = e,
                e.prototype.type = "Comment"
        }
            , {
            "./node": 20
        }],
        13: [function (a, b) {
            "use strict";
            var d = a("./node")
                , e = b.exports = function (a) {
                    this.val = a
                }
                ;
            e.prototype = Object.create(d.prototype),
                e.prototype.constructor = e,
                e.prototype.type = "Doctype"
        }
            , {
            "./node": 20
        }],
        14: [function (a, b) {
            "use strict";
            var d = a("./node")
                , e = b.exports = function (a, b, c, d) {
                    this.obj = a,
                        this.val = b,
                        this.key = c,
                        this.block = d
                }
                ;
            e.prototype = Object.create(d.prototype),
                e.prototype.constructor = e,
                e.prototype.type = "Each"
        }
            , {
            "./node": 20
        }],
        15: [function (a, b) {
            "use strict";
            var d = a("./node")
                , e = b.exports = function (a, b, c) {
                    this.name = a,
                        this.block = b,
                        this.attrs = c
                }
                ;
            e.prototype = Object.create(d.prototype),
                e.prototype.constructor = e,
                e.prototype.type = "Filter"
        }
            , {
            "./node": 20
        }],
        16: [function (a, b, c) {
            "use strict";
            c.Node = a("./node"),
                c.Tag = a("./tag"),
                c.Code = a("./code"),
                c.Each = a("./each"),
                c.Case = a("./case"),
                c.Text = a("./text"),
                c.Block = a("./block"),
                c.MixinBlock = a("./mixin-block"),
                c.Mixin = a("./mixin"),
                c.Filter = a("./filter"),
                c.Comment = a("./comment"),
                c.Literal = a("./literal"),
                c.BlockComment = a("./block-comment"),
                c.Doctype = a("./doctype")
        }
            , {
            "./block": 9,
            "./block-comment": 8,
            "./case": 10,
            "./code": 11,
            "./comment": 12,
            "./doctype": 13,
            "./each": 14,
            "./filter": 15,
            "./literal": 17,
            "./mixin": 19,
            "./mixin-block": 18,
            "./node": 20,
            "./tag": 21,
            "./text": 22
        }],
        17: [function (a, b) {
            "use strict";
            var d = a("./node")
                , e = b.exports = function (a) {
                    this.str = a
                }
                ;
            e.prototype = Object.create(d.prototype),
                e.prototype.constructor = e,
                e.prototype.type = "Literal"
        }
            , {
            "./node": 20
        }],
        18: [function (a, b) {
            "use strict";
            var d = a("./node")
                , e = b.exports = function () { }
                ;
            e.prototype = Object.create(d.prototype),
                e.prototype.constructor = e,
                e.prototype.type = "MixinBlock"
        }
            , {
            "./node": 20
        }],
        19: [function (a, b) {
            "use strict";
            var d = a("./attrs")
                , e = b.exports = function (a, b, c, e) {
                    d.call(this),
                        this.name = a,
                        this.args = b,
                        this.block = c,
                        this.call = e
                }
                ;
            e.prototype = Object.create(d.prototype),
                e.prototype.constructor = e,
                e.prototype.type = "Mixin"
        }
            , {
            "./attrs": 7
        }],
        20: [function (a, b) {
            "use strict";
            var d = b.exports = function () { }
                ;
            d.prototype.clone = function () {
                var a = new Error("node.clone is deprecated and will be removed in v2.0.0");
                return console.warn(a.stack),
                    this
            }
                ,
                d.prototype.type = ""
        }
            , {}],
        21: [function (a, b) {
            "use strict";
            var d = a("./attrs")
                , e = a("./block")
                , f = a("../inline-tags")
                , g = b.exports = function (a, b) {
                    d.call(this),
                        this.name = a,
                        this.block = b || new e
                }
                ;
            g.prototype = Object.create(d.prototype),
                g.prototype.constructor = g,
                g.prototype.type = "Tag",
                g.prototype.clone = function () {
                    var a = new Error("tag.clone is deprecated and will be removed in v2.0.0");
                    console.warn(a.stack);
                    var b = new g(this.name, this.block.clone());
                    return b.line = this.line,
                        b.attrs = this.attrs,
                        b.textOnly = this.textOnly,
                        b
                }
                ,
                g.prototype.isInline = function () {
                    return ~f.indexOf(this.name)
                }
                ,
                g.prototype.canInline = function () {
                    function b(a) {
                        return a.isBlock ? a.nodes.every(b) : a.isText || a.isInline && a.isInline()
                    }
                    var a = this.block.nodes;
                    if (!a.length)
                        return !0;
                    if (1 == a.length)
                        return b(a[0]);
                    if (this.block.nodes.every(b)) {
                        for (var c = 1, d = a.length; d > c; ++c)
                            if (a[c - 1].isText && a[c].isText)
                                return !1;
                        return !0
                    }
                    return !1
                }
        }
            , {
            "../inline-tags": 4,
            "./attrs": 7,
            "./block": 9
        }],
        22: [function (a, b) {
            "use strict";
            var d = a("./node")
                , e = b.exports = function (a) {
                    this.val = a
                }
                ;
            e.prototype = Object.create(d.prototype),
                e.prototype.constructor = e,
                e.prototype.type = "Text",
                e.prototype.isText = !0
        }
            , {
            "./node": 20
        }],
        23: [function (a, b, c) {
            "use strict";
            var d = a("./lexer")
                , e = a("./nodes")
                , f = a("./utils")
                , g = a("./filters")
                , h = a("path")
                , i = a("constantinople")
                , j = a("character-parser").parseMax;
            h.extname;
            var l = c = b.exports = function (a, b, c) {
                this.input = a.replace(/^\uFEFF/, ""),
                    this.lexer = new d(this.input, b),
                    this.filename = b,
                    this.blocks = {},
                    this.mixins = {},
                    this.options = c,
                    this.contexts = [this],
                    this.inMixin = !1,
                    this.dependencies = [],
                    this.inBlock = 0
            }
                ;
            l.prototype = {
                constructor: l,
                context: function (a) {
                    return a ? (this.contexts.push(a),
                        void 0) : this.contexts.pop()
                },
                advance: function () {
                    return this.lexer.advance()
                },
                peek: function () {
                    return this.lookahead(1)
                },
                line: function () {
                    return this.lexer.lineno
                },
                lookahead: function (a) {
                    return this.lexer.lookahead(a)
                },
                parse: function () {
                    var b, a = new e.Block;
                    for (a.line = 0,
                        a.filename = this.filename; "eos" != this.peek().type;)
                        if ("newline" == this.peek().type)
                            this.advance();
                        else {
                            var c = this.peek()
                                , d = this.parseExpr();
                            d.filename = d.filename || this.filename,
                                d.line = c.line,
                                a.push(d)
                        }
                    if (b = this.extending) {
                        this.context(b);
                        var g = b.parse();
                        this.context();
                        for (var h in this.mixins)
                            g.unshift(this.mixins[h]);
                        return g
                    }
                    if (!this.extending && !this.included && Object.keys(this.blocks).length) {
                        var i = [];
                        f.walkAST(a, function (a) {
                            "Block" === a.type && a.name && i.push(a.name)
                        }),
                            Object.keys(this.blocks).forEach(function (a) {
                                -1 !== i.indexOf(a) || this.blocks[a].isSubBlock || console.warn('Warning: Unexpected block "' + a + '" ' + " on line " + this.blocks[a].line + " of " + this.blocks[a].filename + ". This block is never used. This warning will be an error in v2.0.0")
                            }
                                .bind(this))
                    }
                    return a
                },
                expect: function (a) {
                    if (this.peek().type === a)
                        return this.advance();
                    throw new Error('expected "' + a + '", but got "' + this.peek().type + '"')
                },
                accept: function (a) {
                    return this.peek().type === a ? this.advance() : void 0
                },
                parseExpr: function () {
                    switch (this.peek().type) {
                        case "tag":
                            return this.parseTag();
                        case "mixin":
                            return this.parseMixin();
                        case "block":
                            return this.parseBlock();
                        case "mixin-block":
                            return this.parseMixinBlock();
                        case "case":
                            return this.parseCase();
                        case "extends":
                            return this.parseExtends();
                        case "include":
                            return this.parseInclude();
                        case "doctype":
                            return this.parseDoctype();
                        case "filter":
                            return this.parseFilter();
                        case "comment":
                            return this.parseComment();
                        case "text":
                            return this.parseText();
                        case "each":
                            return this.parseEach();
                        case "code":
                            return this.parseCode();
                        case "call":
                            return this.parseCall();
                        case "interpolation":
                            return this.parseInterpolation();
                        case "yield":
                            this.advance();
                            var a = new e.Block;
                            return a.yield = !0,
                                a;
                        case "id":
                        case "class":
                            var b = this.advance();
                            return this.lexer.defer(this.lexer.tok("tag", "div")),
                                this.lexer.defer(b),
                                this.parseExpr();
                        default:
                            throw new Error('unexpected token "' + this.peek().type + '"')
                    }
                },
                parseText: function () {
                    var a = this.expect("text")
                        , b = this.parseInlineTagsInText(a.val);
                    if (1 === b.length)
                        return b[0];
                    for (var c = new e.Block, d = 0; d < b.length; d++)
                        c.push(b[d]);
                    return c
                },
                parseBlockExpansion: function () {
                    return ":" == this.peek().type ? (this.advance(),
                        new e.Block(this.parseExpr())) : this.block()
                },
                parseCase: function () {
                    var a = this.expect("case").val
                        , b = new e.Case(a);
                    b.line = this.line();
                    var c = new e.Block;
                    for (c.line = this.line(),
                        c.filename = this.filename,
                        this.expect("indent"); "outdent" != this.peek().type;)
                        switch (this.peek().type) {
                            case "newline":
                                this.advance();
                                break;
                            case "when":
                                c.push(this.parseWhen());
                                break;
                            case "default":
                                c.push(this.parseDefault());
                                break;
                            default:
                                throw new Error('Unexpected token "' + this.peek().type + '", expected "when", "default" or "newline"')
                        }
                    return this.expect("outdent"),
                        b.block = c,
                        b
                },
                parseWhen: function () {
                    var a = this.expect("when").val;
                    return "newline" !== this.peek().type ? new e.Case.When(a, this.parseBlockExpansion()) : new e.Case.When(a)
                },
                parseDefault: function () {
                    return this.expect("default"),
                        new e.Case.When("default", this.parseBlockExpansion())
                },
                parseCode: function () {
                    var d, b = this.expect("code"), c = new e.Code(b.val, b.buffer, b.escape);
                    if (c.line = this.line(),
                        b.isElse && !b.hasIf)
                        throw new Error("Unexpected else without if");
                    return d = "indent" == this.peek().type,
                        d && (c.block = this.block()),
                        b.requiresBlock && !d && (c.block = new e.Block),
                        b.isIf && this.peek().isElse ? this.peek().hasIf = !0 : b.isIf && "newline" === this.peek().type && this.lookahead(2).isElse && (this.lookahead(2).hasIf = !0),
                        c
                },
                parseComment: function () {
                    var b, c, a = this.expect("comment");
                    return b = (c = this.parseTextBlock()) ? new e.BlockComment(a.val, c, a.buffer) : new e.Comment(a.val, a.buffer),
                        b.line = this.line(),
                        b
                },
                parseDoctype: function () {
                    var a = this.expect("doctype")
                        , b = new e.Doctype(a.val);
                    return b.line = this.line(),
                        b
                },
                parseFilter: function () {
                    var c, a = this.expect("filter"), b = this.accept("attrs");
                    c = this.parseTextBlock() || new e.Block;
                    var d = {};
                    b && b.attrs.forEach(function (a) {
                        d[a.name] = i.toConstant(a.val)
                    });
                    var f = new e.Filter(a.val, c, d);
                    return f.line = this.line(),
                        f
                },
                parseEach: function () {
                    var a = this.expect("each")
                        , b = new e.Each(a.code, a.val, a.key);
                    return b.line = this.line(),
                        b.block = this.block(),
                        "code" == this.peek().type && "else" == this.peek().val && (this.advance(),
                            b.alternative = this.block()),
                        b
                },
                resolvePath: function (b, c) {
                    var d = a("path")
                        , e = d.dirname
                        , f = d.basename
                        , g = d.join;
                    if ("/" !== b[0] && !this.filename)
                        throw new Error('the "filename" option is required to use "' + c + '" with "relative" paths');
                    if ("/" === b[0] && !this.options.basedir)
                        throw new Error('the "basedir" option is required to use "' + c + '" with "absolute" paths');
                    return b = g("/" === b[0] ? this.options.basedir : e(this.filename), b),
                        -1 === f(b).indexOf(".") && (b += ".jade"),
                        b
                },
                parseExtends: function () {
                    var b = a("fs")
                        , c = this.resolvePath(this.expect("extends").val.trim(), "extends");
                    ".jade" != c.substr(-5) && (c += ".jade"),
                        this.dependencies.push(c);
                    var d = b.readFileSync(c, "utf8")
                        , f = new this.constructor(d, c, this.options);
                    return f.dependencies = this.dependencies,
                        f.blocks = this.blocks,
                        f.included = this.included,
                        f.contexts = this.contexts,
                        this.extending = f,
                        new e.Literal("")
                },
                parseBlock: function () {
                    var a = this.expect("block")
                        , b = a.mode
                        , c = a.val.trim()
                        , d = a.line;
                    this.inBlock++ ,
                        a = "indent" == this.peek().type ? this.block() : new e.Block(new e.Literal("")),
                        this.inBlock-- ,
                        a.name = c,
                        a.line = d;
                    var f = this.blocks[c] || {
                        prepended: [],
                        appended: []
                    };
                    if ("replace" === f.mode)
                        return this.blocks[c] = f;
                    var g = f.prepended.concat(a.nodes).concat(f.appended);
                    switch (b) {
                        case "append":
                            f.appended = f.parser === this ? f.appended.concat(a.nodes) : a.nodes.concat(f.appended);
                            break;
                        case "prepend":
                            f.prepended = f.parser === this ? a.nodes.concat(f.prepended) : f.prepended.concat(a.nodes)
                    }
                    return a.nodes = g,
                        a.appended = f.appended,
                        a.prepended = f.prepended,
                        a.mode = b,
                        a.parser = this,
                        a.isSubBlock = this.inBlock > 0,
                        this.blocks[c] = a
                },
                parseMixinBlock: function () {
                    if (this.expect("mixin-block"),
                        !this.inMixin)
                        throw new Error("Anonymous blocks are not allowed unless they are part of a mixin.");
                    return new e.MixinBlock
                },
                parseInclude: function () {
                    var b = a("fs")
                        , c = this.expect("include")
                        , d = this.resolvePath(c.val.trim(), "include");
                    if (this.dependencies.push(d),
                        c.filter) {
                        var h = b.readFileSync(d, "utf8").replace(/\r/g, "")
                            , j = {
                                filename: d
                            };
                        return c.attrs && c.attrs.attrs.forEach(function (a) {
                            j[a.name] = i.toConstant(a.val)
                        }),
                            h = g(c.filter, h, j),
                            new e.Literal(h)
                    }
                    if (".jade" != d.substr(-5)) {
                        var h = b.readFileSync(d, "utf8").replace(/\r/g, "");
                        return new e.Literal(h)
                    }
                    var h = b.readFileSync(d, "utf8")
                        , k = new this.constructor(h, d, this.options);
                    k.dependencies = this.dependencies,
                        k.blocks = f.merge({}, this.blocks),
                        k.included = !0,
                        k.mixins = this.mixins,
                        this.context(k);
                    var l = k.parse();
                    return this.context(),
                        l.filename = d,
                        "indent" == this.peek().type && l.includeBlock().push(this.block()),
                        l
                },
                parseCall: function () {
                    var a = this.expect("call")
                        , b = a.val
                        , c = a.args
                        , d = new e.Mixin(b, c, new e.Block, !0);
                    return this.tag(d),
                        d.code && (d.block.push(d.code),
                            d.code = null),
                        d.block.isEmpty() && (d.block = null),
                        d
                },
                parseMixin: function () {
                    var d, a = this.expect("mixin"), b = a.val, c = a.args;
                    return "indent" == this.peek().type ? (this.inMixin = !0,
                        d = new e.Mixin(b, c, this.block(), !1),
                        this.mixins[b] = d,
                        this.inMixin = !1,
                        d) : new e.Mixin(b, c, null, !0)
                },
                parseInlineTagsInText: function (a) {
                    var b = this.line()
                        , c = /(\\)?#\[((?:.|\n)*)$/.exec(a);
                    if (c) {
                        if (c[1]) {
                            var d = new e.Text(a.substr(0, c.index) + "#[");
                            d.line = b;
                            var f = this.parseInlineTagsInText(c[2]);
                            return "Text" === f[0].type && (d.val += f[0].val,
                                f.shift()),
                                [d].concat(f)
                        }
                        var d = new e.Text(a.substr(0, c.index));
                        d.line = b;
                        var g = [d]
                            , f = c[2]
                            , h = j(f)
                            , i = new l(h.src, this.filename, this.options);
                        return g.push(i.parse()),
                            g.concat(this.parseInlineTagsInText(f.substr(h.end + 1)))
                    }
                    var d = new e.Text(a);
                    return d.line = b,
                        [d]
                },
                parseTextBlock: function () {
                    var a = new e.Block;
                    a.line = this.line();
                    var b = this.peek();
                    if ("pipeless-text" === b.type)
                        return this.advance(),
                            a.nodes = b.val.reduce(function (a, b) {
                                return a.concat(this.parseInlineTagsInText(b))
                            }
                                .bind(this), []),
                            a
                },
                block: function () {
                    var a = new e.Block;
                    for (a.line = this.line(),
                        a.filename = this.filename,
                        this.expect("indent"); "outdent" != this.peek().type;)
                        if ("newline" == this.peek().type)
                            this.advance();
                        else {
                            var b = this.parseExpr();
                            b.filename = this.filename,
                                a.push(b)
                        }
                    return this.expect("outdent"),
                        a
                },
                parseInterpolation: function () {
                    var a = this.advance()
                        , b = new e.Tag(a.val);
                    return b.buffer = !0,
                        this.tag(b)
                },
                parseTag: function () {
                    var a = this.advance()
                        , b = new e.Tag(a.val);
                    return b.selfClosing = a.selfClosing,
                        this.tag(b)
                },
                tag: function (a) {
                    a.line = this.line();
                    var b = !1;
                    a: for (; ;)
                        switch (this.peek().type) {
                            case "id":
                            case "class":
                                var c = this.advance();
                                a.setAttribute(c.type, "'" + c.val + "'");
                                continue;
                            case "attrs":
                                b && console.warn(this.filename + ", line " + this.peek().line + ":\nYou should not have jade tags with multiple attributes."),
                                    b = !0;
                                var c = this.advance()
                                    , d = c.attrs;
                                c.selfClosing && (a.selfClosing = !0);
                                for (var f = 0; f < d.length; f++)
                                    a.setAttribute(d[f].name, d[f].val, d[f].escaped);
                                continue;
                            case "&attributes":
                                var c = this.advance();
                                a.addAttributes(c.val);
                                break;
                            default:
                                break a
                        }
                    switch ("dot" == this.peek().type && (a.textOnly = !0,
                        this.advance()),
                    this.peek().type) {
                        case "text":
                            a.block.push(this.parseText());
                            break;
                        case "code":
                            a.code = this.parseCode();
                            break;
                        case ":":
                            this.advance(),
                                a.block = new e.Block,
                                a.block.push(this.parseExpr());
                            break;
                        case "newline":
                        case "indent":
                        case "outdent":
                        case "eos":
                        case "pipeless-text":
                            break;
                        default:
                            throw new Error("Unexpected token `" + this.peek().type + "` expected `text`, `code`, `:`, `newline` or `eos`")
                    }
                    for (; "newline" == this.peek().type;)
                        this.advance();
                    if (a.textOnly)
                        a.block = this.parseTextBlock();
                    else if ("indent" == this.peek().type)
                        for (var g = this.block(), f = 0, h = g.nodes.length; h > f; ++f)
                            a.block.push(g.nodes[f]);
                    return a
                }
            }
        }
            , {
            "./filters": 3,
            "./lexer": 6,
            "./nodes": 16,
            "./utils": 25,
            "character-parser": 32,
            constantinople: 33,
            fs: 26,
            path: 29
        }],
        24: [function (a, b, c) {
            "use strict";
            function d(a) {
                return null != a && "" !== a
            }
            function e(a) {
                return Array.isArray(a) ? a.map(e).filter(d).join(" ") : a
            }
            c.merge = function f(a, b) {
                if (1 === arguments.length) {
                    for (var c = a[0], e = 1; e < a.length; e++)
                        c = f(c, a[e]);
                    return c
                }
                var g = a["class"]
                    , h = b["class"];
                (g || h) && (g = g || [],
                    h = h || [],
                    Array.isArray(g) || (g = [g]),
                    Array.isArray(h) || (h = [h]),
                    a["class"] = g.concat(h).filter(d));
                for (var i in b)
                    "class" != i && (a[i] = b[i]);
                return a
            }
                ,
                c.joinClasses = e,
                c.cls = function (a, b) {
                    for (var d = [], f = 0; f < a.length; f++)
                        b && b[f] ? d.push(c.escape(e([a[f]]))) : d.push(e(a[f]));
                    var g = e(d);
                    return g.length ? ' class="' + g + '"' : ""
                }
                ,
                c.attr = function (a, b, d, e) {
                    return "boolean" == typeof b || null == b ? b ? " " + (e ? a : a + '="' + a + '"') : "" : 0 == a.indexOf("data") && "string" != typeof b ? " " + a + "='" + JSON.stringify(b).replace(/'/g, "&apos;") + "'" : d ? " " + a + '="' + c.escape(b) + '"' : " " + a + '="' + b + '"'
                }
                ,
                c.attrs = function (a, b) {
                    var d = []
                        , f = Object.keys(a);
                    if (f.length)
                        for (var g = 0; g < f.length; ++g) {
                            var h = f[g]
                                , i = a[h];
                            "class" == h ? (i = e(i)) && d.push(" " + h + '="' + i + '"') : d.push(c.attr(h, i, !1, b))
                        }
                    return d.join("")
                }
                ,
                c.escape = function (a) {
                    var b = String(a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
                    return b === "" + a ? a : b
                }
                ,
                c.rethrow = function k(b, c, d, e) {
                    if (!(b instanceof Error))
                        throw b;
                    if (!("undefined" == typeof window && c || e))
                        throw b.message += " on line " + d,
                        b;
                    try {
                        e = e || a("fs").readFileSync(c, "utf8")
                    } catch (f) {
                        k(b, null, d)
                    }
                    var g = 3
                        , h = e.split("\n")
                        , i = Math.max(d - g, 0)
                        , j = Math.min(h.length, d + g)
                        , g = h.slice(i, j).map(function (a, b) {
                            var c = b + i + 1;
                            return (c == d ? "  > " : "    ") + c + "| " + a
                        }).join("\n");
                    throw b.path = c,
                    b.message = (c || "Jade") + ":" + d + "\n" + g + "\n\n" + b.message,
                    b
                }
        }
            , {
            fs: 26
        }],
        25: [function (a, b, c) {
            "use strict";
            c.merge = function (a, b) {
                for (var c in b)
                    a[c] = b[c];
                return a
            }
                ,
                c.stringify = function (a) {
                    return JSON.stringify(a).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029")
                }
                ,
                c.walkAST = function d(a, b, c) {
                    switch (b && b(a),
                    a.type) {
                        case "Block":
                            a.nodes.forEach(function (a) {
                                d(a, b, c)
                            });
                            break;
                        case "Case":
                        case "Each":
                        case "Mixin":
                        case "Tag":
                        case "When":
                        case "Code":
                            a.block && d(a.block, b, c);
                            break;
                        case "Attrs":
                        case "BlockComment":
                        case "Comment":
                        case "Doctype":
                        case "Filter":
                        case "Literal":
                        case "MixinBlock":
                        case "Text":
                            break;
                        default:
                            throw new Error("Unexpected node type " + a.type)
                    }
                    c && c(a)
                }
        }
            , {}],
        26: [function () { }
            , {}],
        27: [function (a, b) {
            b.exports = "function" == typeof Object.create ? function (a, b) {
                a.super_ = b,
                    a.prototype = Object.create(b.prototype, {
                        constructor: {
                            value: a,
                            enumerable: !1,
                            writable: !0,
                            configurable: !0
                        }
                    })
            }
                : function (a, b) {
                    a.super_ = b;
                    var c = function () { };
                    c.prototype = b.prototype,
                        a.prototype = new c,
                        a.prototype.constructor = a
                }
        }
            , {}],
        28: [function (a, b) {
            var d = b.exports = {};
            d.nextTick = function () {
                var a = "undefined" != typeof window && window.setImmediate
                    , b = "undefined" != typeof window && window.postMessage && window.addEventListener;
                if (a)
                    return function (a) {
                        return window.setImmediate(a)
                    }
                        ;
                if (b) {
                    var c = [];
                    return window.addEventListener("message", function (a) {
                        var b = a.source;
                        if ((b === window || null === b) && "process-tick" === a.data && (a.stopPropagation(),
                            c.length > 0)) {
                            var d = c.shift();
                            d()
                        }
                    }, !0),
                        function (a) {
                            c.push(a),
                                window.postMessage("process-tick", "*")
                        }
                }
                return function (a) {
                    setTimeout(a, 0)
                }
            }(),
                d.title = "browser",
                d.browser = !0,
                d.env = {},
                d.argv = [],
                d.binding = function () {
                    throw new Error("process.binding is not supported")
                }
                ,
                d.cwd = function () {
                    return "/"
                }
                ,
                d.chdir = function () {
                    throw new Error("process.chdir is not supported")
                }
        }
            , {}],
        29: [function (a, b, c) {
            !function (a) {
                function b(a, b) {
                    for (var c = 0, d = a.length - 1; d >= 0; d--) {
                        var e = a[d];
                        "." === e ? a.splice(d, 1) : ".." === e ? (a.splice(d, 1),
                            c++) : c && (a.splice(d, 1),
                                c--)
                    }
                    if (b)
                        for (; c--; c)
                            a.unshift("..");
                    return a
                }
                function f(a, b) {
                    if (a.filter)
                        return a.filter(b);
                    for (var c = [], d = 0; d < a.length; d++)
                        b(a[d], d, a) && c.push(a[d]);
                    return c
                }
                var d = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/
                    , e = function (a) {
                        return d.exec(a).slice(1)
                    };
                c.resolve = function () {
                    for (var c = "", d = !1, e = arguments.length - 1; e >= -1 && !d; e--) {
                        var g = e >= 0 ? arguments[e] : a.cwd();
                        if ("string" != typeof g)
                            throw new TypeError("Arguments to path.resolve must be strings");
                        g && (c = g + "/" + c,
                            d = "/" === g.charAt(0))
                    }
                    return c = b(f(c.split("/"), function (a) {
                        return !!a
                    }), !d).join("/"),
                        (d ? "/" : "") + c || "."
                }
                    ,
                    c.normalize = function (a) {
                        var d = c.isAbsolute(a)
                            , e = "/" === g(a, -1);
                        return a = b(f(a.split("/"), function (a) {
                            return !!a
                        }), !d).join("/"),
                            a || d || (a = "."),
                            a && e && (a += "/"),
                            (d ? "/" : "") + a
                    }
                    ,
                    c.isAbsolute = function (a) {
                        return "/" === a.charAt(0)
                    }
                    ,
                    c.join = function () {
                        var a = Array.prototype.slice.call(arguments, 0);
                        return c.normalize(f(a, function (a) {
                            if ("string" != typeof a)
                                throw new TypeError("Arguments to path.join must be strings");
                            return a
                        }).join("/"))
                    }
                    ,
                    c.relative = function (a, b) {
                        function d(a) {
                            for (var b = 0; b < a.length && "" === a[b]; b++)
                                ;
                            for (var c = a.length - 1; c >= 0 && "" === a[c]; c--)
                                ;
                            return b > c ? [] : a.slice(b, c - b + 1)
                        }
                        a = c.resolve(a).substr(1),
                            b = c.resolve(b).substr(1);
                        for (var e = d(a.split("/")), f = d(b.split("/")), g = Math.min(e.length, f.length), h = g, i = 0; g > i; i++)
                            if (e[i] !== f[i]) {
                                h = i;
                                break
                            }
                        for (var j = [], i = h; i < e.length; i++)
                            j.push("..");
                        return j = j.concat(f.slice(h)),
                            j.join("/")
                    }
                    ,
                    c.sep = "/",
                    c.delimiter = ":",
                    c.dirname = function (a) {
                        var b = e(a)
                            , c = b[0]
                            , d = b[1];
                        return c || d ? (d && (d = d.substr(0, d.length - 1)),
                            c + d) : "."
                    }
                    ,
                    c.basename = function (a, b) {
                        var c = e(a)[2];
                        return b && c.substr(-1 * b.length) === b && (c = c.substr(0, c.length - b.length)),
                            c
                    }
                    ,
                    c.extname = function (a) {
                        return e(a)[3]
                    }
                    ;
                var g = "b" === "ab".substr(-1) ? function (a, b, c) {
                    return a.substr(b, c)
                }
                    : function (a, b, c) {
                        return 0 > b && (b = a.length + b),
                            a.substr(b, c)
                    }
            }
                .call(this, a("C:\\Users\\forbes.lindesay\\Documents\\GitHub\\jade\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js"))
        }
            , {
            "C:\\Users\\forbes.lindesay\\Documents\\GitHub\\jade\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js": 28
        }],
        30: [function (a, b) {
            b.exports = function (a) {
                return a && "object" == typeof a && "function" == typeof a.copy && "function" == typeof a.fill && "function" == typeof a.readUInt8
            }
        }
            , {}],
        31: [function (a, b, c) {
            !function (b, d) {
                function h(a, b) {
                    var d = {
                        seen: [],
                        stylize: j
                    };
                    return arguments.length >= 3 && (d.depth = arguments[2]),
                        arguments.length >= 4 && (d.colors = arguments[3]),
                        s(b) ? d.showHidden = b : b && c._extend(d, b),
                        y(d.showHidden) && (d.showHidden = !1),
                        y(d.depth) && (d.depth = 2),
                        y(d.colors) && (d.colors = !1),
                        y(d.customInspect) && (d.customInspect = !0),
                        d.colors && (d.stylize = i),
                        l(d, a, d.depth)
                }
                function i(a, b) {
                    var c = h.styles[b];
                    return c ? "[" + h.colors[c][0] + "m" + a + "[" + h.colors[c][1] + "m" : a
                }
                function j(a) {
                    return a
                }
                function k(a) {
                    var b = {};
                    return a.forEach(function (a) {
                        b[a] = !0
                    }),
                        b
                }
                function l(a, b, d) {
                    if (a.customInspect && b && D(b.inspect) && b.inspect !== c.inspect && (!b.constructor || b.constructor.prototype !== b)) {
                        var e = b.inspect(d, a);
                        return w(e) || (e = l(a, e, d)),
                            e
                    }
                    var f = m(a, b);
                    if (f)
                        return f;
                    var g = Object.keys(b)
                        , h = k(g);
                    if (a.showHidden && (g = Object.getOwnPropertyNames(b)),
                        C(b) && (g.indexOf("message") >= 0 || g.indexOf("description") >= 0))
                        return n(b);
                    if (0 === g.length) {
                        if (D(b)) {
                            var i = b.name ? ": " + b.name : "";
                            return a.stylize("[Function" + i + "]", "special")
                        }
                        if (z(b))
                            return a.stylize(RegExp.prototype.toString.call(b), "regexp");
                        if (B(b))
                            return a.stylize(Date.prototype.toString.call(b), "date");
                        if (C(b))
                            return n(b)
                    }
                    var j = ""
                        , s = !1
                        , t = ["{", "}"];
                    if (r(b) && (s = !0,
                        t = ["[", "]"]),
                        D(b)) {
                        var u = b.name ? ": " + b.name : "";
                        j = " [Function" + u + "]"
                    }
                    if (z(b) && (j = " " + RegExp.prototype.toString.call(b)),
                        B(b) && (j = " " + Date.prototype.toUTCString.call(b)),
                        C(b) && (j = " " + n(b)),
                        0 === g.length && (!s || 0 == b.length))
                        return t[0] + j + t[1];
                    if (0 > d)
                        return z(b) ? a.stylize(RegExp.prototype.toString.call(b), "regexp") : a.stylize("[Object]", "special");
                    a.seen.push(b);
                    var v;
                    return v = s ? o(a, b, d, h, g) : g.map(function (c) {
                        return p(a, b, d, h, c, s)
                    }),
                        a.seen.pop(),
                        q(v, j, t)
                }
                function m(a, b) {
                    if (y(b))
                        return a.stylize("undefined", "undefined");
                    if (w(b)) {
                        var c = "'" + JSON.stringify(b).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
                        return a.stylize(c, "string")
                    }
                    return v(b) ? a.stylize("" + b, "number") : s(b) ? a.stylize("" + b, "boolean") : t(b) ? a.stylize("null", "null") : void 0
                }
                function n(a) {
                    return "[" + Error.prototype.toString.call(a) + "]"
                }
                function o(a, b, c, d, e) {
                    for (var f = [], g = 0, h = b.length; h > g; ++g)
                        J(b, String(g)) ? f.push(p(a, b, c, d, String(g), !0)) : f.push("");
                    return e.forEach(function (e) {
                        e.match(/^\d+$/) || f.push(p(a, b, c, d, e, !0))
                    }),
                        f
                }
                function p(a, b, c, d, e, f) {
                    var g, h, i;
                    if (i = Object.getOwnPropertyDescriptor(b, e) || {
                        value: b[e]
                    },
                        i.get ? h = i.set ? a.stylize("[Getter/Setter]", "special") : a.stylize("[Getter]", "special") : i.set && (h = a.stylize("[Setter]", "special")),
                        J(d, e) || (g = "[" + e + "]"),
                        h || (a.seen.indexOf(i.value) < 0 ? (h = t(c) ? l(a, i.value, null) : l(a, i.value, c - 1),
                            h.indexOf("\n") > -1 && (h = f ? h.split("\n").map(function (a) {
                                return "  " + a
                            }).join("\n").substr(2) : "\n" + h.split("\n").map(function (a) {
                                return "   " + a
                            }).join("\n"))) : h = a.stylize("[Circular]", "special")),
                        y(g)) {
                        if (f && e.match(/^\d+$/))
                            return h;
                        g = JSON.stringify("" + e),
                            g.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (g = g.substr(1, g.length - 2),
                                g = a.stylize(g, "name")) : (g = g.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"),
                                    g = a.stylize(g, "string"))
                    }
                    return g + ": " + h
                }
                function q(a, b, c) {
                    var d = 0
                        , e = a.reduce(function (a, b) {
                            return d++ ,
                                b.indexOf("\n") >= 0 && d++ ,
                                a + b.replace(/\u001b\[\d\d?m/g, "").length + 1
                        }, 0);
                    return e > 60 ? c[0] + ("" === b ? "" : b + "\n ") + " " + a.join(",\n  ") + " " + c[1] : c[0] + b + " " + a.join(", ") + " " + c[1]
                }
                function r(a) {
                    return Array.isArray(a)
                }
                function s(a) {
                    return "boolean" == typeof a
                }
                function t(a) {
                    return null === a
                }
                function u(a) {
                    return null == a
                }
                function v(a) {
                    return "number" == typeof a
                }
                function w(a) {
                    return "string" == typeof a
                }
                function x(a) {
                    return "symbol" == typeof a
                }
                function y(a) {
                    return void 0 === a
                }
                function z(a) {
                    return A(a) && "[object RegExp]" === F(a)
                }
                function A(a) {
                    return "object" == typeof a && null !== a
                }
                function B(a) {
                    return A(a) && "[object Date]" === F(a)
                }
                function C(a) {
                    return A(a) && ("[object Error]" === F(a) || a instanceof Error)
                }
                function D(a) {
                    return "function" == typeof a
                }
                function E(a) {
                    return null === a || "boolean" == typeof a || "number" == typeof a || "string" == typeof a || "symbol" == typeof a || "undefined" == typeof a
                }
                function F(a) {
                    return Object.prototype.toString.call(a)
                }
                function G(a) {
                    return 10 > a ? "0" + a.toString(10) : a.toString(10)
                }
                function I() {
                    var a = new Date
                        , b = [G(a.getHours()), G(a.getMinutes()), G(a.getSeconds())].join(":");
                    return [a.getDate(), H[a.getMonth()], b].join(" ")
                }
                function J(a, b) {
                    return Object.prototype.hasOwnProperty.call(a, b)
                }
                var e = /%[sdj%]/g;
                c.format = function (a) {
                    if (!w(a)) {
                        for (var b = [], c = 0; c < arguments.length; c++)
                            b.push(h(arguments[c]));
                        return b.join(" ")
                    }
                    for (var c = 1, d = arguments, f = d.length, g = String(a).replace(e, function (a) {
                        if ("%%" === a)
                            return "%";
                        if (c >= f)
                            return a;
                        switch (a) {
                            case "%s":
                                return String(d[c++]);
                            case "%d":
                                return Number(d[c++]);
                            case "%j":
                                try {
                                    return JSON.stringify(d[c++])
                                } catch (b) {
                                    return "[Circular]"
                                }
                            default:
                                return a
                        }
                    }), i = d[c]; f > c; i = d[++c])
                        g += t(i) || !A(i) ? " " + i : " " + h(i);
                    return g
                }
                    ,
                    c.deprecate = function (a, e) {
                        function g() {
                            if (!f) {
                                if (b.throwDeprecation)
                                    throw new Error(e);
                                b.traceDeprecation ? console.trace(e) : console.error(e),
                                    f = !0
                            }
                            return a.apply(this, arguments)
                        }
                        if (y(d.process))
                            return function () {
                                return c.deprecate(a, e).apply(this, arguments)
                            }
                                ;
                        if (b.noDeprecation === !0)
                            return a;
                        var f = !1;
                        return g
                    }
                    ;
                var g, f = {};
                c.debuglog = function (a) {
                    if (y(g) && (g = b.env.NODE_DEBUG || ""),
                        a = a.toUpperCase(),
                        !f[a])
                        if (new RegExp("\\b" + a + "\\b", "i").test(g)) {
                            var d = b.pid;
                            f[a] = function () {
                                var b = c.format.apply(c, arguments);
                                console.error("%s %d: %s", a, d, b)
                            }
                        } else
                            f[a] = function () { }
                                ;
                    return f[a]
                }
                    ,
                    c.inspect = h,
                    h.colors = {
                        bold: [1, 22],
                        italic: [3, 23],
                        underline: [4, 24],
                        inverse: [7, 27],
                        white: [37, 39],
                        grey: [90, 39],
                        black: [30, 39],
                        blue: [34, 39],
                        cyan: [36, 39],
                        green: [32, 39],
                        magenta: [35, 39],
                        red: [31, 39],
                        yellow: [33, 39]
                    },
                    h.styles = {
                        special: "cyan",
                        number: "yellow",
                        "boolean": "yellow",
                        undefined: "grey",
                        "null": "bold",
                        string: "green",
                        date: "magenta",
                        regexp: "red"
                    },
                    c.isArray = r,
                    c.isBoolean = s,
                    c.isNull = t,
                    c.isNullOrUndefined = u,
                    c.isNumber = v,
                    c.isString = w,
                    c.isSymbol = x,
                    c.isUndefined = y,
                    c.isRegExp = z,
                    c.isObject = A,
                    c.isDate = B,
                    c.isError = C,
                    c.isFunction = D,
                    c.isPrimitive = E,
                    c.isBuffer = a("./support/isBuffer");
                var H = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                c.log = function () {
                    console.log("%s - %s", I(), c.format.apply(c, arguments))
                }
                    ,
                    c.inherits = a("inherits"),
                    c._extend = function (a, b) {
                        if (!b || !A(b))
                            return a;
                        for (var c = Object.keys(b), d = c.length; d--;)
                            a[c[d]] = b[c[d]];
                        return a
                    }
            }
                .call(this, a("C:\\Users\\forbes.lindesay\\Documents\\GitHub\\jade\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }
            , {
            "./support/isBuffer": 30,
            "C:\\Users\\forbes.lindesay\\Documents\\GitHub\\jade\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js": 28,
            inherits: 27
        }],
        32: [function (a, b, c) {
            function d(a, b, d) {
                d = d || {},
                    b = b || c.defaultState();
                for (var e = d.start || 0, f = d.end || a.length, g = e; f > g;) {
                    if (b.roundDepth < 0 || b.curlyDepth < 0 || b.squareDepth < 0)
                        throw new SyntaxError("Mismatched Bracket: " + a[g - 1]);
                    c.parseChar(a[g++], b)
                }
                return b
            }
            function e(a, b) {
                b = b || {};
                for (var d = b.start || 0, e = d, f = c.defaultState(); f.roundDepth >= 0 && f.curlyDepth >= 0 && f.squareDepth >= 0;) {
                    if (e >= a.length)
                        throw new Error("The end of the string was reached with no closing bracket found.");
                    c.parseChar(a[e++], f)
                }
                var g = e - 1;
                return {
                    start: d,
                    end: g,
                    src: a.substring(d, g)
                }
            }
            function f(a, b, d) {
                d = d || {};
                for (var e = d.includeLineComment || !1, f = d.start || 0, g = f, h = c.defaultState(); h.isString() || h.regexp || h.blockComment || !e && h.lineComment || !i(a, b, g);)
                    c.parseChar(a[g++], h);
                var j = g;
                return {
                    start: f,
                    end: j,
                    src: a.substring(f, j)
                }
            }
            function g(a, b) {
                if (1 !== a.length)
                    throw new Error("Character must be a string of length 1");
                b = b || c.defaultState(),
                    b.src = b.src || "",
                    b.src += a;
                var d = b.blockComment || b.lineComment
                    , e = b.history ? b.history[0] : "";
                return b.regexpStart && (("/" === a || "*" == a) && (b.regexp = !1),
                    b.regexpStart = !1),
                    b.lineComment ? "\n" === a && (b.lineComment = !1) : b.blockComment ? "*" === b.lastChar && "/" === a && (b.blockComment = !1) : b.singleQuote ? "'" !== a || b.escaped ? b.escaped = "\\" !== a || b.escaped ? !1 : !0 : b.singleQuote = !1 : b.doubleQuote ? '"' !== a || b.escaped ? b.escaped = "\\" !== a || b.escaped ? !1 : !0 : b.doubleQuote = !1 : b.regexp ? "/" !== a || b.escaped ? b.escaped = "\\" !== a || b.escaped ? !1 : !0 : b.regexp = !1 : "/" === e && "/" === a ? (b.history = b.history.substr(1),
                        b.lineComment = !0) : "/" === e && "*" === a ? (b.history = b.history.substr(1),
                            b.blockComment = !0) : "/" === a && l(b.history) ? (b.regexp = !0,
                                b.regexpStart = !0) : "'" === a ? b.singleQuote = !0 : '"' === a ? b.doubleQuote = !0 : "(" === a ? b.roundDepth++ : ")" === a ? b.roundDepth-- : "{" === a ? b.curlyDepth++ : "}" === a ? b.curlyDepth-- : "[" === a ? b.squareDepth++ : "]" === a && b.squareDepth-- ,
                    b.blockComment || b.lineComment || d || (b.history = a + b.history),
                    b.lastChar = a,
                    b
            }
            function h() {
                this.lineComment = !1,
                    this.blockComment = !1,
                    this.singleQuote = !1,
                    this.doubleQuote = !1,
                    this.regexp = !1,
                    this.escaped = !1,
                    this.roundDepth = 0,
                    this.curlyDepth = 0,
                    this.squareDepth = 0,
                    this.history = "",
                    this.lastChar = ""
            }
            function i(a, b, c) {
                return a.substr(c || 0, b.length) === b
            }
            function j(a) {
                if (!a)
                    return !0;
                var b = a.charCodeAt(0);
                switch (b) {
                    case 46:
                    case 40:
                    case 41:
                    case 59:
                    case 44:
                    case 123:
                    case 125:
                    case 91:
                    case 93:
                    case 58:
                    case 63:
                    case 126:
                    case 37:
                    case 38:
                    case 42:
                    case 43:
                    case 45:
                    case 47:
                    case 60:
                    case 62:
                    case 94:
                    case 124:
                    case 33:
                    case 61:
                        return !0;
                    default:
                        return !1
                }
            }
            function k(a) {
                return "if" === a || "in" === a || "do" === a || "var" === a || "for" === a || "new" === a || "try" === a || "let" === a || "this" === a || "else" === a || "case" === a || "void" === a || "with" === a || "enum" === a || "while" === a || "break" === a || "catch" === a || "throw" === a || "const" === a || "yield" === a || "class" === a || "super" === a || "return" === a || "typeof" === a || "delete" === a || "switch" === a || "export" === a || "import" === a || "default" === a || "finally" === a || "extends" === a || "function" === a || "continue" === a || "debugger" === a || "package" === a || "private" === a || "interface" === a || "instanceof" === a || "implements" === a || "protected" === a || "public" === a || "static" === a || "yield" === a || "let" === a
            }
            function l(a) {
                return a = a.replace(/^\s*/, ""),
                    ")" === a[0] ? !1 : "}" === a[0] ? !0 : j(a[0]) ? !0 : /^\w+\b/.test(a) && k(/^\w+\b/.exec(a)[0].split("").reverse().join("")) ? !0 : !1
            }
            c = b.exports = d,
                c.parse = d,
                c.parseMax = e,
                c.parseUntil = f,
                c.parseChar = g,
                c.defaultState = function () {
                    return new h
                }
                ,
                h.prototype.isString = function () {
                    return this.singleQuote || this.doubleQuote
                }
                ,
                h.prototype.isComment = function () {
                    return this.lineComment || this.blockComment
                }
                ,
                h.prototype.isNesting = function () {
                    return this.isString() || this.isComment() || this.regexp || this.roundDepth > 0 || this.curlyDepth > 0 || this.squareDepth > 0
                }
                ,
                c.isPunctuator = j,
                c.isKeyword = k
        }
            , {}],
        33: [function (a, b) {
            "use strict";
            function h(a, b) {
                if (a = "(" + a + ")",
                    e === a && g === b)
                    return f;
                e = a;
                try {
                    return f = 0 === j(a).filter(function (a) {
                        return !(b && a in b)
                    }).length
                } catch (c) {
                    return f = !1
                }
            }
            function i(a, b) {
                if (!h(a, b))
                    throw new Error(JSON.stringify(a) + " is not constant.");
                return Function(Object.keys(b || {}).join(","), "return (" + a + ")").apply(null, Object.keys(b || {}).map(function (a) {
                    return b[a]
                }))
            }
            function j(a) {
                var b = d.parse(a.toString());
                b.figure_out_scope();
                var c = b.globals.map(function (a, b) {
                    return b
                });
                return c
            }
            var d = a("uglify-js")
                , e = "(null)"
                , f = !0
                , g = void 0;
            b.exports = h,
                h.isConstant = h,
                h.toConstant = i
        }
            , {
            "uglify-js": 44
        }],
        34: [function (a, b, c) {
            c.SourceMapGenerator = a("./source-map/source-map-generator").SourceMapGenerator,
                c.SourceMapConsumer = a("./source-map/source-map-consumer").SourceMapConsumer,
                c.SourceNode = a("./source-map/source-node").SourceNode
        }
            , {
            "./source-map/source-map-consumer": 39,
            "./source-map/source-map-generator": 40,
            "./source-map/source-node": 41
        }],
        35: [function (a, b) {
            if ("function" != typeof d)
                var d = a("amdefine")(b, a);
            d(function (a, b) {
                function e() {
                    this._array = [],
                        this._set = {}
                }
                var d = a("./util");
                e.fromArray = function (a, b) {
                    for (var c = new e, d = 0, f = a.length; f > d; d++)
                        c.add(a[d], b);
                    return c
                }
                    ,
                    e.prototype.add = function (a, b) {
                        var c = this.has(a)
                            , e = this._array.length;
                        (!c || b) && this._array.push(a),
                            c || (this._set[d.toSetString(a)] = e)
                    }
                    ,
                    e.prototype.has = function (a) {
                        return Object.prototype.hasOwnProperty.call(this._set, d.toSetString(a))
                    }
                    ,
                    e.prototype.indexOf = function (a) {
                        if (this.has(a))
                            return this._set[d.toSetString(a)];
                        throw new Error('"' + a + '" is not in the set.')
                    }
                    ,
                    e.prototype.at = function (a) {
                        if (a >= 0 && a < this._array.length)
                            return this._array[a];
                        throw new Error("No element indexed by " + a)
                    }
                    ,
                    e.prototype.toArray = function () {
                        return this._array.slice()
                    }
                    ,
                    b.ArraySet = e
            })
        }
            , {
            "./util": 42,
            amdefine: 43
        }],
        36: [function (a, b) {
            if ("function" != typeof d)
                var d = a("amdefine")(b, a);
            d(function (a, b) {
                function i(a) {
                    return 0 > a ? (-a << 1) + 1 : (a << 1) + 0
                }
                function j(a) {
                    var b = 1 === (1 & a)
                        , c = a >> 1;
                    return b ? -c : c
                }
                var d = a("./base64")
                    , e = 5
                    , f = 1 << e
                    , g = f - 1
                    , h = f;
                b.encode = function (a) {
                    var c, b = "", f = i(a);
                    do
                        c = f & g,
                            f >>>= e,
                            f > 0 && (c |= h),
                            b += d.encode(c);
                    while (f > 0); return b
                }
                    ,
                    b.decode = function (a) {
                        var k, l, b = 0, c = a.length, f = 0, i = 0;
                        do {
                            if (b >= c)
                                throw new Error("Expected more digits in base 64 VLQ value.");
                            l = d.decode(a.charAt(b++)),
                                k = !!(l & h),
                                l &= g,
                                f += l << i,
                                i += e
                        } while (k); return {
                            value: j(f),
                            rest: a.slice(b)
                        }
                    }
            })
        }
            , {
            "./base64": 37,
            amdefine: 43
        }],
        37: [function (a, b) {
            if ("function" != typeof d)
                var d = a("amdefine")(b, a);
            d(function (a, b) {
                var d = {}
                    , e = {};
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("").forEach(function (a, b) {
                    d[a] = b,
                        e[b] = a
                }),
                    b.encode = function (a) {
                        if (a in e)
                            return e[a];
                        throw new TypeError("Must be between 0 and 63: " + a)
                    }
                    ,
                    b.decode = function (a) {
                        if (a in d)
                            return d[a];
                        throw new TypeError("Not a valid base 64 digit: " + a)
                    }
            })
        }
            , {
            amdefine: 43
        }],
        38: [function (a, b) {
            if ("function" != typeof d)
                var d = a("amdefine")(b, a);
            d(function (a, b) {
                function d(a, b, c, e, f) {
                    var g = Math.floor((b - a) / 2) + a
                        , h = f(c, e[g], !0);
                    return 0 === h ? e[g] : h > 0 ? b - g > 1 ? d(g, b, c, e, f) : e[g] : g - a > 1 ? d(a, g, c, e, f) : 0 > a ? null : e[a]
                }
                b.search = function (a, b, c) {
                    return b.length > 0 ? d(-1, b.length, a, b, c) : null
                }
            })
        }
            , {
            amdefine: 43
        }],
        39: [function (a, b) {
            if ("function" != typeof d)
                var d = a("amdefine")(b, a);
            d(function (a, b) {
                function h(a) {
                    var b = a;
                    "string" == typeof a && (b = JSON.parse(a.replace(/^\)\]\}'/, "")));
                    var c = d.getArg(b, "version")
                        , e = d.getArg(b, "sources")
                        , g = d.getArg(b, "names", [])
                        , h = d.getArg(b, "sourceRoot", null)
                        , i = d.getArg(b, "sourcesContent", null)
                        , j = d.getArg(b, "mappings")
                        , k = d.getArg(b, "file", null);
                    if (c != this._version)
                        throw new Error("Unsupported version: " + c);
                    this._names = f.fromArray(g, !0),
                        this._sources = f.fromArray(e, !0),
                        this.sourceRoot = h,
                        this.sourcesContent = i,
                        this._mappings = j,
                        this.file = k
                }
                var d = a("./util")
                    , e = a("./binary-search")
                    , f = a("./array-set").ArraySet
                    , g = a("./base64-vlq");
                h.fromSourceMap = function (a) {
                    var b = Object.create(h.prototype);
                    return b._names = f.fromArray(a._names.toArray(), !0),
                        b._sources = f.fromArray(a._sources.toArray(), !0),
                        b.sourceRoot = a._sourceRoot,
                        b.sourcesContent = a._generateSourcesContent(b._sources.toArray(), b.sourceRoot),
                        b.file = a._file,
                        b.__generatedMappings = a._mappings.slice().sort(d.compareByGeneratedPositions),
                        b.__originalMappings = a._mappings.slice().sort(d.compareByOriginalPositions),
                        b
                }
                    ,
                    h.prototype._version = 3,
                    Object.defineProperty(h.prototype, "sources", {
                        get: function () {
                            return this._sources.toArray().map(function (a) {
                                return this.sourceRoot ? d.join(this.sourceRoot, a) : a
                            }, this)
                        }
                    }),
                    h.prototype.__generatedMappings = null,
                    Object.defineProperty(h.prototype, "_generatedMappings", {
                        get: function () {
                            return this.__generatedMappings || (this.__generatedMappings = [],
                                this.__originalMappings = [],
                                this._parseMappings(this._mappings, this.sourceRoot)),
                                this.__generatedMappings
                        }
                    }),
                    h.prototype.__originalMappings = null,
                    Object.defineProperty(h.prototype, "_originalMappings", {
                        get: function () {
                            return this.__originalMappings || (this.__generatedMappings = [],
                                this.__originalMappings = [],
                                this._parseMappings(this._mappings, this.sourceRoot)),
                                this.__originalMappings
                        }
                    }),
                    h.prototype._parseMappings = function (a) {
                        for (var m, n, c = 1, e = 0, f = 0, h = 0, i = 0, j = 0, k = /^[,;]/, l = a; l.length > 0;)
                            if (";" === l.charAt(0))
                                c++ ,
                                    l = l.slice(1),
                                    e = 0;
                            else if ("," === l.charAt(0))
                                l = l.slice(1);
                            else {
                                if (m = {},
                                    m.generatedLine = c,
                                    n = g.decode(l),
                                    m.generatedColumn = e + n.value,
                                    e = m.generatedColumn,
                                    l = n.rest,
                                    l.length > 0 && !k.test(l.charAt(0))) {
                                    if (n = g.decode(l),
                                        m.source = this._sources.at(i + n.value),
                                        i += n.value,
                                        l = n.rest,
                                        0 === l.length || k.test(l.charAt(0)))
                                        throw new Error("Found a source, but no line and column");
                                    if (n = g.decode(l),
                                        m.originalLine = f + n.value,
                                        f = m.originalLine,
                                        m.originalLine += 1,
                                        l = n.rest,
                                        0 === l.length || k.test(l.charAt(0)))
                                        throw new Error("Found a source and line, but no column");
                                    n = g.decode(l),
                                        m.originalColumn = h + n.value,
                                        h = m.originalColumn,
                                        l = n.rest,
                                        l.length > 0 && !k.test(l.charAt(0)) && (n = g.decode(l),
                                            m.name = this._names.at(j + n.value),
                                            j += n.value,
                                            l = n.rest)
                                }
                                this.__generatedMappings.push(m),
                                    "number" == typeof m.originalLine && this.__originalMappings.push(m)
                            }
                        this.__originalMappings.sort(d.compareByOriginalPositions)
                    }
                    ,
                    h.prototype._findMapping = function (a, b, c, d, f) {
                        if (a[c] <= 0)
                            throw new TypeError("Line must be greater than or equal to 1, got " + a[c]);
                        if (a[d] < 0)
                            throw new TypeError("Column must be greater than or equal to 0, got " + a[d]);
                        return e.search(a, b, f)
                    }
                    ,
                    h.prototype.originalPositionFor = function (a) {
                        var b = {
                            generatedLine: d.getArg(a, "line"),
                            generatedColumn: d.getArg(a, "column")
                        }
                            , c = this._findMapping(b, this._generatedMappings, "generatedLine", "generatedColumn", d.compareByGeneratedPositions);
                        if (c) {
                            var e = d.getArg(c, "source", null);
                            return e && this.sourceRoot && (e = d.join(this.sourceRoot, e)),
                                {
                                    source: e,
                                    line: d.getArg(c, "originalLine", null),
                                    column: d.getArg(c, "originalColumn", null),
                                    name: d.getArg(c, "name", null)
                                }
                        }
                        return {
                            source: null,
                            line: null,
                            column: null,
                            name: null
                        }
                    }
                    ,
                    h.prototype.sourceContentFor = function (a) {
                        if (!this.sourcesContent)
                            return null;
                        if (this.sourceRoot && (a = d.relative(this.sourceRoot, a)),
                            this._sources.has(a))
                            return this.sourcesContent[this._sources.indexOf(a)];
                        var b;
                        if (this.sourceRoot && (b = d.urlParse(this.sourceRoot))) {
                            var c = a.replace(/^file:\/\//, "");
                            if ("file" == b.scheme && this._sources.has(c))
                                return this.sourcesContent[this._sources.indexOf(c)];
                            if ((!b.path || "/" == b.path) && this._sources.has("/" + a))
                                return this.sourcesContent[this._sources.indexOf("/" + a)]
                        }
                        throw new Error('"' + a + '" is not in the SourceMap.')
                    }
                    ,
                    h.prototype.generatedPositionFor = function (a) {
                        var b = {
                            source: d.getArg(a, "source"),
                            originalLine: d.getArg(a, "line"),
                            originalColumn: d.getArg(a, "column")
                        };
                        this.sourceRoot && (b.source = d.relative(this.sourceRoot, b.source));
                        var c = this._findMapping(b, this._originalMappings, "originalLine", "originalColumn", d.compareByOriginalPositions);
                        return c ? {
                            line: d.getArg(c, "generatedLine", null),
                            column: d.getArg(c, "generatedColumn", null)
                        } : {
                                line: null,
                                column: null
                            }
                    }
                    ,
                    h.GENERATED_ORDER = 1,
                    h.ORIGINAL_ORDER = 2,
                    h.prototype.eachMapping = function (a, b, c) {
                        var g, e = b || null, f = c || h.GENERATED_ORDER;
                        switch (f) {
                            case h.GENERATED_ORDER:
                                g = this._generatedMappings;
                                break;
                            case h.ORIGINAL_ORDER:
                                g = this._originalMappings;
                                break;
                            default:
                                throw new Error("Unknown order of iteration.")
                        }
                        var i = this.sourceRoot;
                        g.map(function (a) {
                            var b = a.source;
                            return b && i && (b = d.join(i, b)),
                                {
                                    source: b,
                                    generatedLine: a.generatedLine,
                                    generatedColumn: a.generatedColumn,
                                    originalLine: a.originalLine,
                                    originalColumn: a.originalColumn,
                                    name: a.name
                                }
                        }).forEach(a, e)
                    }
                    ,
                    b.SourceMapConsumer = h
            })
        }
            , {
            "./array-set": 35,
            "./base64-vlq": 36,
            "./binary-search": 38,
            "./util": 42,
            amdefine: 43
        }],
        40: [function (a, b) {
            if ("function" != typeof d)
                var d = a("amdefine")(b, a);
            d(function (a, b) {
                function g(a) {
                    this._file = e.getArg(a, "file"),
                        this._sourceRoot = e.getArg(a, "sourceRoot", null),
                        this._sources = new f,
                        this._names = new f,
                        this._mappings = [],
                        this._sourcesContents = null
                }
                var d = a("./base64-vlq")
                    , e = a("./util")
                    , f = a("./array-set").ArraySet;
                g.prototype._version = 3,
                    g.fromSourceMap = function (a) {
                        var b = a.sourceRoot
                            , c = new g({
                                file: a.file,
                                sourceRoot: b
                            });
                        return a.eachMapping(function (a) {
                            var d = {
                                generated: {
                                    line: a.generatedLine,
                                    column: a.generatedColumn
                                }
                            };
                            a.source && (d.source = a.source,
                                b && (d.source = e.relative(b, d.source)),
                                d.original = {
                                    line: a.originalLine,
                                    column: a.originalColumn
                                },
                                a.name && (d.name = a.name)),
                                c.addMapping(d)
                        }),
                            a.sources.forEach(function (b) {
                                var d = a.sourceContentFor(b);
                                d && c.setSourceContent(b, d)
                            }),
                            c
                    }
                    ,
                    g.prototype.addMapping = function (a) {
                        var b = e.getArg(a, "generated")
                            , c = e.getArg(a, "original", null)
                            , d = e.getArg(a, "source", null)
                            , f = e.getArg(a, "name", null);
                        this._validateMapping(b, c, d, f),
                            d && !this._sources.has(d) && this._sources.add(d),
                            f && !this._names.has(f) && this._names.add(f),
                            this._mappings.push({
                                generatedLine: b.line,
                                generatedColumn: b.column,
                                originalLine: null != c && c.line,
                                originalColumn: null != c && c.column,
                                source: d,
                                name: f
                            })
                    }
                    ,
                    g.prototype.setSourceContent = function (a, b) {
                        var c = a;
                        this._sourceRoot && (c = e.relative(this._sourceRoot, c)),
                            null !== b ? (this._sourcesContents || (this._sourcesContents = {}),
                                this._sourcesContents[e.toSetString(c)] = b) : (delete this._sourcesContents[e.toSetString(c)],
                                    0 === Object.keys(this._sourcesContents).length && (this._sourcesContents = null))
                    }
                    ,
                    g.prototype.applySourceMap = function (a, b) {
                        b || (b = a.file);
                        var c = this._sourceRoot;
                        c && (b = e.relative(c, b));
                        var d = new f
                            , g = new f;
                        this._mappings.forEach(function (f) {
                            if (f.source === b && f.originalLine) {
                                var h = a.originalPositionFor({
                                    line: f.originalLine,
                                    column: f.originalColumn
                                });
                                null !== h.source && (f.source = c ? e.relative(c, h.source) : h.source,
                                    f.originalLine = h.line,
                                    f.originalColumn = h.column,
                                    null !== h.name && null !== f.name && (f.name = h.name))
                            }
                            var i = f.source;
                            i && !d.has(i) && d.add(i);
                            var j = f.name;
                            j && !g.has(j) && g.add(j)
                        }, this),
                            this._sources = d,
                            this._names = g,
                            a.sources.forEach(function (b) {
                                var d = a.sourceContentFor(b);
                                d && (c && (b = e.relative(c, b)),
                                    this.setSourceContent(b, d))
                            }, this)
                    }
                    ,
                    g.prototype._validateMapping = function (a, b, c, d) {
                        if (!(a && "line" in a && "column" in a && a.line > 0 && a.column >= 0 && !b && !c && !d || a && "line" in a && "column" in a && b && "line" in b && "column" in b && a.line > 0 && a.column >= 0 && b.line > 0 && b.column >= 0 && c))
                            throw new Error("Invalid mapping: " + JSON.stringify({
                                generated: a,
                                source: c,
                                orginal: b,
                                name: d
                            }))
                    }
                    ,
                    g.prototype._serializeMappings = function () {
                        var j, a = 0, b = 1, c = 0, f = 0, g = 0, h = 0, i = "";
                        this._mappings.sort(e.compareByGeneratedPositions);
                        for (var k = 0, l = this._mappings.length; l > k; k++) {
                            if (j = this._mappings[k],
                                j.generatedLine !== b)
                                for (a = 0; j.generatedLine !== b;)
                                    i += ";",
                                        b++;
                            else if (k > 0) {
                                if (!e.compareByGeneratedPositions(j, this._mappings[k - 1]))
                                    continue;
                                i += ","
                            }
                            i += d.encode(j.generatedColumn - a),
                                a = j.generatedColumn,
                                j.source && (i += d.encode(this._sources.indexOf(j.source) - h),
                                    h = this._sources.indexOf(j.source),
                                    i += d.encode(j.originalLine - 1 - f),
                                    f = j.originalLine - 1,
                                    i += d.encode(j.originalColumn - c),
                                    c = j.originalColumn,
                                    j.name && (i += d.encode(this._names.indexOf(j.name) - g),
                                        g = this._names.indexOf(j.name)))
                        }
                        return i
                    }
                    ,
                    g.prototype._generateSourcesContent = function (a, b) {
                        return a.map(function (a) {
                            if (!this._sourcesContents)
                                return null;
                            b && (a = e.relative(b, a));
                            var c = e.toSetString(a);
                            return Object.prototype.hasOwnProperty.call(this._sourcesContents, c) ? this._sourcesContents[c] : null
                        }, this)
                    }
                    ,
                    g.prototype.toJSON = function () {
                        var a = {
                            version: this._version,
                            file: this._file,
                            sources: this._sources.toArray(),
                            names: this._names.toArray(),
                            mappings: this._serializeMappings()
                        };
                        return this._sourceRoot && (a.sourceRoot = this._sourceRoot),
                            this._sourcesContents && (a.sourcesContent = this._generateSourcesContent(a.sources, a.sourceRoot)),
                            a
                    }
                    ,
                    g.prototype.toString = function () {
                        return JSON.stringify(this)
                    }
                    ,
                    b.SourceMapGenerator = g
            })
        }
            , {
            "./array-set": 35,
            "./base64-vlq": 36,
            "./util": 42,
            amdefine: 43
        }],
        41: [function (a, b) {
            if ("function" != typeof d)
                var d = a("amdefine")(b, a);
            d(function (a, b) {
                function f(a, b, c, d, e) {
                    this.children = [],
                        this.sourceContents = {},
                        this.line = void 0 === a ? null : a,
                        this.column = void 0 === b ? null : b,
                        this.source = void 0 === c ? null : c,
                        this.name = void 0 === e ? null : e,
                        null != d && this.add(d)
                }
                var d = a("./source-map-generator").SourceMapGenerator
                    , e = a("./util");
                f.fromStringWithSourceMap = function (a, b) {
                    function i(a, b) {
                        null === a || void 0 === a.source ? c.add(b) : c.add(new f(a.originalLine, a.originalColumn, a.source, b, a.name))
                    }
                    var c = new f
                        , d = a.split("\n")
                        , e = 1
                        , g = 0
                        , h = null;
                    return b.eachMapping(function (a) {
                        if (null === h) {
                            for (; e < a.generatedLine;)
                                c.add(d.shift() + "\n"),
                                    e++;
                            if (g < a.generatedColumn) {
                                var b = d[0];
                                c.add(b.substr(0, a.generatedColumn)),
                                    d[0] = b.substr(a.generatedColumn),
                                    g = a.generatedColumn
                            }
                        } else if (e < a.generatedLine) {
                            var f = "";
                            do
                                f += d.shift() + "\n",
                                    e++ ,
                                    g = 0;
                            while (e < a.generatedLine); if (g < a.generatedColumn) {
                                var b = d[0];
                                f += b.substr(0, a.generatedColumn),
                                    d[0] = b.substr(a.generatedColumn),
                                    g = a.generatedColumn
                            }
                            i(h, f)
                        } else {
                            var b = d[0]
                                , f = b.substr(0, a.generatedColumn - g);
                            d[0] = b.substr(a.generatedColumn - g),
                                g = a.generatedColumn,
                                i(h, f)
                        }
                        h = a
                    }, this),
                        i(h, d.join("\n")),
                        b.sources.forEach(function (a) {
                            var d = b.sourceContentFor(a);
                            d && c.setSourceContent(a, d)
                        }),
                        c
                }
                    ,
                    f.prototype.add = function (a) {
                        if (Array.isArray(a))
                            a.forEach(function (a) {
                                this.add(a)
                            }, this);
                        else {
                            if (!(a instanceof f || "string" == typeof a))
                                throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + a);
                            a && this.children.push(a)
                        }
                        return this
                    }
                    ,
                    f.prototype.prepend = function (a) {
                        if (Array.isArray(a))
                            for (var b = a.length - 1; b >= 0; b--)
                                this.prepend(a[b]);
                        else {
                            if (!(a instanceof f || "string" == typeof a))
                                throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + a);
                            this.children.unshift(a)
                        }
                        return this
                    }
                    ,
                    f.prototype.walk = function (a) {
                        for (var b, c = 0, d = this.children.length; d > c; c++)
                            b = this.children[c],
                                b instanceof f ? b.walk(a) : "" !== b && a(b, {
                                    source: this.source,
                                    line: this.line,
                                    column: this.column,
                                    name: this.name
                                })
                    }
                    ,
                    f.prototype.join = function (a) {
                        var b, c, d = this.children.length;
                        if (d > 0) {
                            for (b = [],
                                c = 0; d - 1 > c; c++)
                                b.push(this.children[c]),
                                    b.push(a);
                            b.push(this.children[c]),
                                this.children = b
                        }
                        return this
                    }
                    ,
                    f.prototype.replaceRight = function (a, b) {
                        var c = this.children[this.children.length - 1];
                        return c instanceof f ? c.replaceRight(a, b) : "string" == typeof c ? this.children[this.children.length - 1] = c.replace(a, b) : this.children.push("".replace(a, b)),
                            this
                    }
                    ,
                    f.prototype.setSourceContent = function (a, b) {
                        this.sourceContents[e.toSetString(a)] = b
                    }
                    ,
                    f.prototype.walkSourceContents = function (a) {
                        for (var b = 0, c = this.children.length; c > b; b++)
                            this.children[b] instanceof f && this.children[b].walkSourceContents(a);
                        for (var d = Object.keys(this.sourceContents), b = 0, c = d.length; c > b; b++)
                            a(e.fromSetString(d[b]), this.sourceContents[d[b]])
                    }
                    ,
                    f.prototype.toString = function () {
                        var a = "";
                        return this.walk(function (b) {
                            a += b
                        }),
                            a
                    }
                    ,
                    f.prototype.toStringWithSourceMap = function (a) {
                        var b = {
                            code: "",
                            line: 1,
                            column: 0
                        }
                            , c = new d(a)
                            , e = !1
                            , f = null
                            , g = null
                            , h = null
                            , i = null;
                        return this.walk(function (a, d) {
                            b.code += a,
                                null !== d.source && null !== d.line && null !== d.column ? ((f !== d.source || g !== d.line || h !== d.column || i !== d.name) && c.addMapping({
                                    source: d.source,
                                    original: {
                                        line: d.line,
                                        column: d.column
                                    },
                                    generated: {
                                        line: b.line,
                                        column: b.column
                                    },
                                    name: d.name
                                }),
                                    f = d.source,
                                    g = d.line,
                                    h = d.column,
                                    i = d.name,
                                    e = !0) : e && (c.addMapping({
                                        generated: {
                                            line: b.line,
                                            column: b.column
                                        }
                                    }),
                                        f = null,
                                        e = !1),
                                a.split("").forEach(function (a) {
                                    "\n" === a ? (b.line++ ,
                                        b.column = 0) : b.column++
                                })
                        }),
                            this.walkSourceContents(function (a, b) {
                                c.setSourceContent(a, b)
                            }),
                            {
                                code: b.code,
                                map: c
                            }
                    }
                    ,
                    b.SourceNode = f
            })
        }
            , {
            "./source-map-generator": 40,
            "./util": 42,
            amdefine: 43
        }],
        42: [function (a, b) {
            if ("function" != typeof d)
                var d = a("amdefine")(b, a);
            d(function (a, b) {
                function d(a, b, c) {
                    if (b in a)
                        return a[b];
                    if (3 === arguments.length)
                        return c;
                    throw new Error('"' + b + '" is a required argument.')
                }
                function g(a) {
                    var b = a.match(e);
                    return b ? {
                        scheme: b[1],
                        auth: b[3],
                        host: b[4],
                        port: b[6],
                        path: b[7]
                    } : null
                }
                function h(a) {
                    var b = a.scheme + "://";
                    return a.auth && (b += a.auth + "@"),
                        a.host && (b += a.host),
                        a.port && (b += ":" + a.port),
                        a.path && (b += a.path),
                        b
                }
                function i(a, b) {
                    var c;
                    return b.match(e) || b.match(f) ? b : "/" === b.charAt(0) && (c = g(a)) ? (c.path = b,
                        h(c)) : a.replace(/\/$/, "") + "/" + b
                }
                function j(a) {
                    return "$" + a
                }
                function k(a) {
                    return a.substr(1)
                }
                function l(a, b) {
                    a = a.replace(/\/$/, "");
                    var c = g(a);
                    return "/" == b.charAt(0) && c && "/" == c.path ? b.slice(1) : 0 === b.indexOf(a + "/") ? b.substr(a.length + 1) : b
                }
                function m(a, b) {
                    var c = a || ""
                        , d = b || "";
                    return (c > d) - (d > c)
                }
                function n(a, b, c) {
                    var d;
                    return (d = m(a.source, b.source)) ? d : (d = a.originalLine - b.originalLine) ? d : (d = a.originalColumn - b.originalColumn,
                        d || c ? d : (d = m(a.name, b.name)) ? d : (d = a.generatedLine - b.generatedLine,
                            d ? d : a.generatedColumn - b.generatedColumn))
                }
                function o(a, b, c) {
                    var d;
                    return (d = a.generatedLine - b.generatedLine) ? d : (d = a.generatedColumn - b.generatedColumn,
                        d || c ? d : (d = m(a.source, b.source)) ? d : (d = a.originalLine - b.originalLine) ? d : (d = a.originalColumn - b.originalColumn,
                            d ? d : m(a.name, b.name)))
                }
                b.getArg = d;
                var e = /([\w+\-.]+):\/\/((\w+:\w+)@)?([\w.]+)?(:(\d+))?(\S+)?/
                    , f = /^data:.+\,.+/;
                b.urlParse = g,
                    b.urlGenerate = h,
                    b.join = i,
                    b.toSetString = j,
                    b.fromSetString = k,
                    b.relative = l,
                    b.compareByOriginalPositions = n,
                    b.compareByGeneratedPositions = o
            })
        }
            , {
            amdefine: 43
        }],
        43: [function (a, b) {
            !function (c, d) {
                "use strict";
                function e(b, e) {
                    function l(a) {
                        var b, c;
                        for (b = 0; a[b]; b += 1)
                            if (c = a[b],
                                "." === c)
                                a.splice(b, 1),
                                    b -= 1;
                            else if (".." === c) {
                                if (1 === b && (".." === a[2] || ".." === a[0]))
                                    break;
                                b > 0 && (a.splice(b - 1, 2),
                                    b -= 2)
                            }
                    }
                    function m(a, b) {
                        var c;
                        return a && "." === a.charAt(0) && b && (c = b.split("/"),
                            c = c.slice(0, c.length - 1),
                            c = c.concat(a.split("/")),
                            l(c),
                            a = c.join("/")),
                            a
                    }
                    function n(a) {
                        return function (b) {
                            return m(b, a)
                        }
                    }
                    function o(a) {
                        function b(b) {
                            g[a] = b
                        }
                        return b.fromText = function () {
                            throw new Error("amdefine does not implement load.fromText")
                        }
                            ,
                            b
                    }
                    function p(a, c, f) {
                        var i, k, l, m;
                        if (a)
                            k = g[a] = {},
                                l = {
                                    id: a,
                                    uri: d,
                                    exports: k
                                },
                                i = j(e, k, l, a);
                        else {
                            if (h)
                                throw new Error("amdefine with no module ID cannot be called more than once per file.");
                            h = !0,
                                k = b.exports,
                                l = b,
                                i = j(e, k, l, b.id)
                        }
                        c && (c = c.map(function (a) {
                            return i(a)
                        })),
                            m = "function" == typeof f ? f.apply(l.exports, c) : f,
                            void 0 !== m && (l.exports = m,
                                a && (g[a] = l.exports))
                    }
                    function q(a, b, c) {
                        Array.isArray(a) ? (c = b,
                            b = a,
                            a = void 0) : "string" != typeof a && (c = a,
                                a = b = void 0),
                            b && !Array.isArray(b) && (c = b,
                                b = void 0),
                            b || (b = ["require", "exports", "module"]),
                            a ? f[a] = [a, b, c] : p(a, b, c)
                    }
                    var j, k, f = {}, g = {}, h = !1, i = a("path");
                    return j = function (a, b, d, e) {
                        function f(f, g) {
                            return "string" == typeof f ? k(a, b, d, f, e) : (f = f.map(function (c) {
                                return k(a, b, d, c, e)
                            }),
                                c.nextTick(function () {
                                    g.apply(null, f)
                                }),
                                void 0)
                        }
                        return f.toUrl = function (a) {
                            return 0 === a.indexOf(".") ? m(a, i.dirname(d.filename)) : a
                        }
                            ,
                            f
                    }
                        ,
                        e = e || function () {
                            return b.require.apply(b, arguments)
                        }
                        ,
                        k = function (a, b, c, d, e) {
                            var l, q, h = d.indexOf("!"), i = d;
                            if (-1 === h) {
                                if (d = m(d, e),
                                    "require" === d)
                                    return j(a, b, c, e);
                                if ("exports" === d)
                                    return b;
                                if ("module" === d)
                                    return c;
                                if (g.hasOwnProperty(d))
                                    return g[d];
                                if (f[d])
                                    return p.apply(null, f[d]),
                                        g[d];
                                if (a)
                                    return a(i);
                                throw new Error("No module with ID: " + d)
                            }
                            return l = d.substring(0, h),
                                d = d.substring(h + 1, d.length),
                                q = k(a, b, c, l, e),
                                d = q.normalize ? q.normalize(d, n(e)) : m(d, e),
                                g[d] ? g[d] : (q.load(d, j(a, b, c, e), o(d), {}),
                                    g[d])
                        }
                        ,
                        q.require = function (a) {
                            return g[a] ? g[a] : f[a] ? (p.apply(null, f[a]),
                                g[a]) : void 0
                        }
                        ,
                        q.amd = {},
                        q
                }
                b.exports = e
            }
                .call(this, a("C:\\Users\\forbes.lindesay\\Documents\\GitHub\\jade\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js"), "/..\\node_modules\\uglify-js\\node_modules\\source-map\\node_modules\\amdefine\\amdefine.js")
        }
            , {
            "C:\\Users\\forbes.lindesay\\Documents\\GitHub\\jade\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js": 28,
            path: 29
        }],
        44: [function (a, b, c) {
            function g(a) {
                for (var b = Object.create(null), c = 0; c < a.length; ++c)
                    b[a[c]] = !0;
                return b
            }
            function h(a, b) {
                return Array.prototype.slice.call(a, b || 0)
            }
            function i(a) {
                return a.split("")
            }
            function j(a, b) {
                for (var c = b.length; --c >= 0;)
                    if (b[c] == a)
                        return !0;
                return !1
            }
            function k(a, b) {
                for (var c = 0, d = b.length; d > c; ++c)
                    if (a(b[c]))
                        return b[c]
            }
            function l(a, b) {
                if (0 >= b)
                    return "";
                if (1 == b)
                    return a;
                var c = l(a, b >> 1);
                return c += c,
                    1 & b && (c += a),
                    c
            }
            function m(a, b) {
                Error.call(this, a),
                    this.msg = a,
                    this.defs = b
            }
            function n(a, b, c) {
                a === !0 && (a = {});
                var d = a || {};
                if (c)
                    for (var e in d)
                        d.hasOwnProperty(e) && !b.hasOwnProperty(e) && m.croak("`" + e + "` is not a supported option", b);
                for (var e in b)
                    b.hasOwnProperty(e) && (d[e] = a && a.hasOwnProperty(e) ? a[e] : b[e]);
                return d
            }
            function o(a, b) {
                for (var c in b)
                    b.hasOwnProperty(c) && (a[c] = b[c]);
                return a
            }
            function p() { }
            function r(a, b) {
                a.indexOf(b) < 0 && a.push(b)
            }
            function s(a, b) {
                return a.replace(/\{(.+?)\}/g, function (a, c) {
                    return b[c]
                })
            }
            function t(a, b) {
                for (var c = a.length; --c >= 0;)
                    a[c] === b && a.splice(c, 1)
            }
            function u(a, b) {
                function c(a, c) {
                    for (var d = [], e = 0, f = 0, g = 0; e < a.length && f < c.length;)
                        d[g++] = b(a[e], c[f]) <= 0 ? a[e++] : c[f++];
                    return e < a.length && d.push.apply(d, a.slice(e)),
                        f < c.length && d.push.apply(d, c.slice(f)),
                        d
                }
                function d(a) {
                    if (a.length <= 1)
                        return a;
                    var b = Math.floor(a.length / 2)
                        , e = a.slice(0, b)
                        , f = a.slice(b);
                    return e = d(e),
                        f = d(f),
                        c(e, f)
                }
                return a.length < 2 ? a.slice() : d(a)
            }
            function v(a, b) {
                return a.filter(function (a) {
                    return b.indexOf(a) < 0
                })
            }
            function w(a, b) {
                return a.filter(function (a) {
                    return b.indexOf(a) >= 0
                })
            }
            function x(a) {
                function f(a) {
                    if (1 == a.length)
                        return b += "return str === " + JSON.stringify(a[0]) + ";";
                    b += "switch(str){";
                    for (var c = 0; c < a.length; ++c)
                        b += "case " + JSON.stringify(a[c]) + ":";
                    b += "return true}return false;"
                }
                a instanceof Array || (a = a.split(" "));
                var b = ""
                    , c = [];
                a: for (var d = 0; d < a.length; ++d) {
                    for (var e = 0; e < c.length; ++e)
                        if (c[e][0].length == a[d].length) {
                            c[e].push(a[d]);
                            continue a
                        }
                    c.push([a[d]])
                }
                if (c.length > 3) {
                    c.sort(function (a, b) {
                        return b.length - a.length
                    }),
                        b += "switch(str.length){";
                    for (var d = 0; d < c.length; ++d) {
                        var g = c[d];
                        b += "case " + g[0].length + ":",
                            f(g)
                    }
                    b += "}"
                } else
                    f(a);
                return new Function("str", b)
            }
            function y(a, b) {
                for (var c = a.length; --c >= 0;)
                    if (!b(a[c]))
                        return !1;
                return !0
            }
            function z() {
                this._values = Object.create(null),
                    this._size = 0
            }
            function A(a, b, c, d) {
                arguments.length < 4 && (d = C),
                    b = b ? b.split(/\s+/) : [];
                var e = b;
                d && d.PROPS && (b = b.concat(d.PROPS));
                for (var f = "return function AST_" + a + "(props){ if (props) { ", g = b.length; --g >= 0;)
                    f += "this." + b[g] + " = props." + b[g] + ";";
                var h = d && new d;
                (h && h.initialize || c && c.initialize) && (f += "this.initialize();"),
                    f += "}}";
                var i = new Function(f)();
                if (h && (i.prototype = h,
                    i.BASE = d),
                    d && d.SUBCLASSES.push(i),
                    i.prototype.CTOR = i,
                    i.PROPS = b || null,
                    i.SELF_PROPS = e,
                    i.SUBCLASSES = [],
                    a && (i.prototype.TYPE = i.TYPE = a),
                    c)
                    for (g in c)
                        c.hasOwnProperty(g) && (/^\$/.test(g) ? i[g.substr(1)] = c[g] : i.prototype[g] = c[g]);
                return i.DEFMETHOD = function (a, b) {
                    this.prototype[a] = b
                }
                    ,
                    i
            }
            function H(a, b) {
                a.body instanceof D ? a.body._walk(b) : a.body.forEach(function (a) {
                    a._walk(b)
                })
            }
            function hc(a) {
                this.visit = a,
                    this.stack = []
            }
            function wc(a) {
                return a >= 97 && 122 >= a || a >= 65 && 90 >= a || a >= 170 && vc.letter.test(String.fromCharCode(a))
            }
            function xc(a) {
                return a >= 48 && 57 >= a
            }
            function yc(a) {
                return xc(a) || wc(a)
            }
            function zc(a) {
                return vc.non_spacing_mark.test(a) || vc.space_combining_mark.test(a)
            }
            function Ac(a) {
                return vc.connector_punctuation.test(a)
            }
            function Bc(a) {
                return !kc(a) && /^[a-z_$][a-z0-9_$]*$/i.test(a)
            }
            function Cc(a) {
                return 36 == a || 95 == a || wc(a)
            }
            function Dc(a) {
                var b = a.charCodeAt(0);
                return Cc(b) || xc(b) || 8204 == b || 8205 == b || zc(a) || Ac(a)
            }
            function Ec(a) {
                var b = a.length;
                if (0 == b)
                    return !1;
                if (!Cc(a.charCodeAt(0)))
                    return !1;
                for (; --b >= 0;)
                    if (!Dc(a.charAt(b)))
                        return !1;
                return !0
            }
            function Fc(a) {
                return nc.test(a) ? parseInt(a.substr(2), 16) : oc.test(a) ? parseInt(a.substr(1), 8) : pc.test(a) ? parseFloat(a) : void 0
            }
            function Gc(a, b, c, d) {
                this.message = a,
                    this.line = b,
                    this.col = c,
                    this.pos = d,
                    this.stack = (new Error).stack
            }
            function Hc(a, b, c, d, e) {
                throw new Gc(a, c, d, e)
            }
            function Ic(a, b, c) {
                return a.type == b && (null == c || a.value == c)
            }
            function Kc(a, b, c) {
                function e() {
                    return d.text.charAt(d.pos)
                }
                function f(a, b) {
                    var c = d.text.charAt(d.pos++);
                    if (a && !c)
                        throw Jc;
                    return "\n" == c ? (d.newline_before = d.newline_before || !b,
                        ++d.line,
                        d.col = 0) : ++d.col,
                        c
                }
                function g(a) {
                    for (; a-- > 0;)
                        f()
                }
                function h(a) {
                    return d.text.substr(d.pos, a.length) == a
                }
                function i(a, b) {
                    var c = d.text.indexOf(a, d.pos);
                    if (b && -1 == c)
                        throw Jc;
                    return c
                }
                function j() {
                    d.tokline = d.line,
                        d.tokcol = d.col,
                        d.tokpos = d.pos
                }
                function l(a, c, e) {
                    d.regex_allowed = "operator" == a && !Mc(c) || "keyword" == a && lc(c) || "punc" == a && sc(c),
                        k = "punc" == a && "." == c;
                    var f = {
                        type: a,
                        value: c,
                        line: d.tokline,
                        col: d.tokcol,
                        pos: d.tokpos,
                        endpos: d.pos,
                        nlb: d.newline_before,
                        file: b
                    };
                    if (!e) {
                        f.comments_before = d.comments_before,
                            d.comments_before = [];
                        for (var g = 0, h = f.comments_before.length; h > g; g++)
                            f.nlb = f.nlb || f.comments_before[g].nlb
                    }
                    return d.newline_before = !1,
                        new B(f)
                }
                function m() {
                    for (; rc(e());)
                        f()
                }
                function n(a) {
                    for (var c, b = "", d = 0; (c = e()) && a(c, d++);)
                        b += f();
                    return b
                }
                function o(a) {
                    Hc(a, b, d.tokline, d.tokcol, d.tokpos)
                }
                function p(a) {
                    var b = !1
                        , c = !1
                        , d = !1
                        , e = "." == a
                        , f = n(function (f, g) {
                            var h = f.charCodeAt(0);
                            switch (h) {
                                case 120:
                                case 88:
                                    return d ? !1 : d = !0;
                                case 101:
                                case 69:
                                    return d ? !0 : b ? !1 : b = c = !0;
                                case 45:
                                    return c || 0 == g && !a;
                                case 43:
                                    return c;
                                case c = !1, 46:
                                    return e || d || b ? !1 : e = !0
                            }
                            return yc(h)
                        });
                    a && (f = a + f);
                    var g = Fc(f);
                    return isNaN(g) ? (o("Invalid syntax: " + f),
                        void 0) : l("num", g)
                }
                function q(a) {
                    var b = f(!0, a);
                    switch (b.charCodeAt(0)) {
                        case 110:
                            return "\n";
                        case 114:
                            return "\r";
                        case 116:
                            return "  ";
                        case 98:
                            return "\b";
                        case 118:
                            return "";
                        case 102:
                            return "\f";
                        case 48:
                            return "\0";
                        case 120:
                            return String.fromCharCode(r(2));
                        case 117:
                            return String.fromCharCode(r(4));
                        case 10:
                            return "";
                        default:
                            return b
                    }
                }
                function r(a) {
                    for (var b = 0; a > 0; --a) {
                        var c = parseInt(f(!0), 16);
                        isNaN(c) && o("Invalid hex-character pattern in string"),
                            b = b << 4 | c
                    }
                    return b
                }
                function t(a) {
                    var e, b = d.regex_allowed, c = i("\n");
                    return -1 == c ? (e = d.text.substr(d.pos),
                        d.pos = d.text.length) : (e = d.text.substring(d.pos, c),
                            d.pos = c),
                        d.comments_before.push(l(a, e, !0)),
                        d.regex_allowed = b,
                        D()
                }
                function v() {
                    for (var c, g, a = !1, b = "", d = !1; null != (c = e());)
                        if (a)
                            "u" != c && o("Expecting UnicodeEscapeSequence -- uXXXX"),
                                c = q(),
                                Dc(c) || o("Unicode char: " + c.charCodeAt(0) + " is not valid in identifier"),
                                b += c,
                                a = !1;
                        else if ("\\" == c)
                            d = a = !0,
                                f();
                        else {
                            if (!Dc(c))
                                break;
                            b += f()
                        }
                    return ic(b) && d && (g = b.charCodeAt(0).toString(16).toUpperCase(),
                        b = "\\u" + "0000".substr(g.length) + g + b.slice(1)),
                        b
                }
                function x(a) {
                    function b(a) {
                        if (!e())
                            return a;
                        var c = a + e();
                        return qc(c) ? (f(),
                            b(c)) : a
                    }
                    return l("operator", b(a || f()))
                }
                function y() {
                    switch (f(),
                    e()) {
                        case "/":
                            return f(),
                                t("comment1");
                        case "*":
                            return f(),
                                u()
                    }
                    return d.regex_allowed ? w("") : x("/")
                }
                function z() {
                    return f(),
                        xc(e().charCodeAt(0)) ? p(".") : l("punc", ".")
                }
                function A() {
                    var a = v();
                    return k ? l("name", a) : jc(a) ? l("atom", a) : ic(a) ? qc(a) ? l("operator", a) : l("keyword", a) : l("name", a)
                }
                function C(a, b) {
                    return function (c) {
                        try {
                            return b(c)
                        } catch (d) {
                            if (d !== Jc)
                                throw d;
                            o(a)
                        }
                    }
                }
                function D(a) {
                    if (null != a)
                        return w(a);
                    if (m(),
                        j(),
                        c) {
                        if (h("<!--"))
                            return g(4),
                                t("comment3");
                        if (h("-->") && d.newline_before)
                            return g(3),
                                t("comment4")
                    }
                    var b = e();
                    if (!b)
                        return l("eof");
                    var i = b.charCodeAt(0);
                    switch (i) {
                        case 34:
                        case 39:
                            return s();
                        case 46:
                            return z();
                        case 47:
                            return y()
                    }
                    return xc(i) ? p() : tc(b) ? l("punc", f()) : mc(b) ? x() : 92 == i || Cc(i) ? A() : (o("Unexpected character '" + b + "'"),
                        void 0)
                }
                var d = {
                    text: a.replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/\uFEFF/g, ""),
                    filename: b,
                    pos: 0,
                    tokpos: 0,
                    line: 1,
                    tokline: 0,
                    col: 0,
                    tokcol: 0,
                    newline_before: !1,
                    regex_allowed: !1,
                    comments_before: []
                }
                    , k = !1
                    , s = C("Unterminated string constant", function () {
                        for (var a = f(), b = ""; ;) {
                            var c = f(!0);
                            if ("\\" == c) {
                                var d = 0
                                    , e = null;
                                c = n(function (a) {
                                    if (a >= "0" && "7" >= a) {
                                        if (!e)
                                            return e = a,
                                                ++d;
                                        if ("3" >= e && 2 >= d)
                                            return ++d;
                                        if (e >= "4" && 1 >= d)
                                            return ++d
                                    }
                                    return !1
                                }),
                                    c = d > 0 ? String.fromCharCode(parseInt(c, 8)) : q(!0)
                            } else if (c == a)
                                break;
                            b += c
                        }
                        return l("string", b)
                    })
                    , u = C("Unterminated multiline comment", function () {
                        var a = d.regex_allowed
                            , b = i("*/", !0)
                            , c = d.text.substring(d.pos, b)
                            , e = c.split("\n")
                            , f = e.length;
                        d.pos = b + 2,
                            d.line += f - 1,
                            f > 1 ? d.col = e[f - 1].length : d.col += e[f - 1].length,
                            d.col += 2;
                        var g = d.newline_before = d.newline_before || c.indexOf("\n") >= 0;
                        return d.comments_before.push(l("comment2", c, !0)),
                            d.regex_allowed = a,
                            d.newline_before = g,
                            D()
                    })
                    , w = C("Unterminated regular expression", function (a) {
                        for (var c, b = !1, d = !1; c = f(!0);)
                            if (b)
                                a += "\\" + c,
                                    b = !1;
                            else if ("[" == c)
                                d = !0,
                                    a += c;
                            else if ("]" == c && d)
                                d = !1,
                                    a += c;
                            else {
                                if ("/" == c && !d)
                                    break;
                                "\\" == c ? b = !0 : a += c
                            }
                        var e = v();
                        return l("regexp", new RegExp(a, e))
                    });
                return D.context = function (a) {
                    return a && (d = a),
                        d
                }
                    ,
                    D
            }
            function Rc(a, b) {
                function d(a, b) {
                    return Ic(c.token, a, b)
                }
                function e() {
                    return c.peeked || (c.peeked = c.input())
                }
                function f() {
                    return c.prev = c.token,
                        c.peeked ? (c.token = c.peeked,
                            c.peeked = null) : c.token = c.input(),
                        c.in_directives = c.in_directives && ("string" == c.token.type || d("punc", ";")),
                        c.token
                }
                function g() {
                    return c.prev
                }
                function h(a, b, d, e) {
                    var f = c.input.context();
                    Hc(a, f.filename, null != b ? b : f.tokline, null != d ? d : f.tokcol, null != e ? e : f.tokpos)
                }
                function i(a, b) {
                    h(b, a.line, a.col)
                }
                function j(a) {
                    null == a && (a = c.token),
                        i(a, "Unexpected token: " + a.type + " (" + a.value + ")")
                }
                function l(a, b) {
                    return d(a, b) ? f() : (i(c.token, "Unexpected token " + c.token.type + " \xab" + c.token.value + "\xbb" + ", expected " + a + " \xab" + b + "\xbb"),
                        void 0)
                }
                function m(a) {
                    return l("punc", a)
                }
                function o() {
                    return !b.strict && (c.token.nlb || d("eof") || d("punc", "}"))
                }
                function p() {
                    d("punc", ";") ? f() : o() || j()
                }
                function q() {
                    m("(");
                    var a = ic(!0);
                    return m(")"),
                        a
                }
                function r(a) {
                    return function () {
                        var b = c.token
                            , d = a()
                            , e = g();
                        return d.start = b,
                            d.end = e,
                            d
                    }
                }
                function s() {
                    (d("operator", "/") || d("operator", "/=")) && (c.peeked = null,
                        c.token = c.input(c.token.value.substr(1)))
                }
                function u() {
                    var a = Kb(Sb);
                    k(function (b) {
                        return b.name == a.name
                    }, c.labels) && h("Label " + a.name + " defined twice"),
                        m(":"),
                        c.labels.push(a);
                    var b = t();
                    return c.labels.pop(),
                        b instanceof N || a.references.forEach(function (b) {
                            b instanceof eb && (b = b.label.start,
                                h("Continue label `" + a.name + "` refers to non-IterationStatement.", b.line, b.col, b.pos))
                        }),
                        new M({
                            body: b,
                            label: a
                        })
                }
                function v(a) {
                    return new G({
                        body: (a = ic(!0),
                            p(),
                            a)
                    })
                }
                function w(a) {
                    var d, b = null;
                    o() || (b = Kb(Ub, !0)),
                        null != b ? (d = k(function (a) {
                            return a.name == b.name
                        }, c.labels),
                            d || h("Undefined label " + b.name),
                            b.thedef = d) : 0 == c.in_loop && h(a.TYPE + " not inside a loop or switch"),
                        p();
                    var e = new a({
                        label: b
                    });
                    return d && d.references.push(e),
                        e
                }
                function x() {
                    m("(");
                    var a = null;
                    return !d("punc", ";") && (a = d("keyword", "var") ? (f(),
                        L(!0)) : ic(!0, !0),
                        d("operator", "in")) ? (a instanceof ob && a.definitions.length > 1 && h("Only one variable declaration allowed in for..in loop"),
                            f(),
                            z(a)) : y(a)
                }
                function y(a) {
                    m(";");
                    var b = d("punc", ";") ? null : ic(!0);
                    m(";");
                    var c = d("punc", ")") ? null : ic(!0);
                    return m(")"),
                        new R({
                            init: a,
                            condition: b,
                            step: c,
                            body: jc(t)
                        })
                }
                function z(a) {
                    var b = a instanceof ob ? a.definitions[0].name : null
                        , c = ic(!0);
                    return m(")"),
                        new S({
                            init: a,
                            name: b,
                            object: c,
                            body: jc(t)
                        })
                }
                function B() {
                    var a = q()
                        , b = t()
                        , c = null;
                    return d("keyword", "else") && (f(),
                        c = t()),
                        new fb({
                            condition: a,
                            body: b,
                            alternative: c
                        })
                }
                function C() {
                    m("{");
                    for (var a = []; !d("punc", "}");)
                        d("eof") && j(),
                            a.push(t());
                    return f(),
                        a
                }
                function D() {
                    m("{");
                    for (var h, a = [], b = null, e = null; !d("punc", "}");)
                        d("eof") && j(),
                            d("keyword", "case") ? (e && (e.end = g()),
                                b = [],
                                e = new jb({
                                    start: (h = c.token,
                                        f(),
                                        h),
                                    expression: ic(!0),
                                    body: b
                                }),
                                a.push(e),
                                m(":")) : d("keyword", "default") ? (e && (e.end = g()),
                                    b = [],
                                    e = new ib({
                                        start: (h = c.token,
                                            f(),
                                            m(":"),
                                            h),
                                        body: b
                                    }),
                                    a.push(e)) : (b || j(),
                                        b.push(t()));
                    return e && (e.end = g()),
                        f(),
                        a
                }
                function H() {
                    var a = C()
                        , b = null
                        , e = null;
                    if (d("keyword", "catch")) {
                        var i = c.token;
                        f(),
                            m("(");
                        var j = Kb(Rb);
                        m(")"),
                            b = new lb({
                                start: i,
                                argname: j,
                                body: C(),
                                end: g()
                            })
                    }
                    if (d("keyword", "finally")) {
                        var i = c.token;
                        f(),
                            e = new mb({
                                start: i,
                                body: C(),
                                end: g()
                            })
                    }
                    return b || e || h("Missing catch/finally blocks"),
                        new kb({
                            body: a,
                            bcatch: b,
                            bfinally: e
                        })
                }
                function I(a, b) {
                    for (var e = []; e.push(new qb({
                        start: c.token,
                        name: Kb(b ? Nb : Mb),
                        value: d("operator", "=") ? (f(),
                            ic(!1, a)) : null,
                        end: g()
                    })),
                        d("punc", ",");)
                        f();
                    return e
                }
                function W() {
                    var b, a = c.token;
                    switch (a.type) {
                        case "name":
                        case "keyword":
                            b = Fb(Tb);
                            break;
                        case "num":
                            b = new Yb({
                                start: a,
                                end: a,
                                value: a.value
                            });
                            break;
                        case "string":
                            b = new Xb({
                                start: a,
                                end: a,
                                value: a.value
                            });
                            break;
                        case "regexp":
                            b = new Zb({
                                start: a,
                                end: a,
                                value: a.value
                            });
                            break;
                        case "atom":
                            switch (a.value) {
                                case "false":
                                    b = new fc({
                                        start: a,
                                        end: a
                                    });
                                    break;
                                case "true":
                                    b = new gc({
                                        start: a,
                                        end: a
                                    });
                                    break;
                                case "null":
                                    b = new _b({
                                        start: a,
                                        end: a
                                    })
                            }
                    }
                    return f(),
                        b
                }
                function _(a, b, e) {
                    for (var g = !0, h = []; !d("punc", a) && (g ? g = !1 : m(","),
                        !b || !d("punc", a));)
                        d("punc", ",") && e ? h.push(new cc({
                            start: c.token,
                            end: c.token
                        })) : h.push(ic(!1));
                    return f(),
                        h
                }
                function nb() {
                    var a = c.token;
                    switch (f(),
                    a.type) {
                        case "num":
                        case "string":
                        case "name":
                        case "operator":
                        case "keyword":
                        case "atom":
                            return a.value;
                        default:
                            j()
                    }
                }
                function xb() {
                    var a = c.token;
                    switch (f(),
                    a.type) {
                        case "name":
                        case "operator":
                        case "keyword":
                        case "atom":
                            return a.value;
                        default:
                            j()
                    }
                }
                function Fb(a) {
                    var b = c.token.value;
                    return new ("this" == b ? Vb : a)({
                        name: String(b),
                        start: c.token,
                        end: c.token
                    })
                }
                function Kb(a, b) {
                    if (!d("name"))
                        return b || h("Name expected"),
                            null;
                    var c = Fb(a);
                    return f(),
                        c
                }
                function $b(a, b, c) {
                    return "++" != b && "--" != b || ec(c) || h("Invalid use of " + b + " operator"),
                        new a({
                            operator: b,
                            expression: c
                        })
                }
                function bc(a) {
                    return ac(Wb(!0), 0, a)
                }
                function ec(a) {
                    return b.strict ? a instanceof Vb ? !1 : a instanceof ub || a instanceof Jb : !0
                }
                function jc(a) {
                    ++c.in_loop;
                    var b = a();
                    return --c.in_loop,
                        b
                }
                b = n(b, {
                    strict: !1,
                    filename: null,
                    toplevel: null,
                    expression: !1,
                    html5_comments: !0
                });
                var c = {
                    input: "string" == typeof a ? Kc(a, b.filename, b.html5_comments) : a,
                    token: null,
                    prev: null,
                    peeked: null,
                    in_function: 0,
                    in_directives: !0,
                    in_loop: 0,
                    labels: []
                };
                c.token = f();
                var t = r(function () {
                    var a;
                    switch (s(),
                    c.token.type) {
                        case "string":
                            var b = c.in_directives
                                , i = v();
                            return b && i.body instanceof Xb && !d("punc", ",") ? new F({
                                value: i.body.value
                            }) : i;
                        case "num":
                        case "regexp":
                        case "operator":
                        case "atom":
                            return v();
                        case "name":
                            return Ic(e(), "punc", ":") ? u() : v();
                        case "punc":
                            switch (c.token.value) {
                                case "{":
                                    return new J({
                                        start: c.token,
                                        body: C(),
                                        end: g()
                                    });
                                case "[":
                                case "(":
                                    return v();
                                case ";":
                                    return f(),
                                        new K;
                                default:
                                    j()
                            }
                        case "keyword":
                            switch (a = c.token.value,
                            f(),
                            a) {
                                case "break":
                                    return w(db);
                                case "continue":
                                    return w(eb);
                                case "debugger":
                                    return p(),
                                        new E;
                                case "do":
                                    return new P({
                                        body: jc(t),
                                        condition: (l("keyword", "while"),
                                            a = q(),
                                            p(),
                                            a)
                                    });
                                case "while":
                                    return new Q({
                                        condition: q(),
                                        body: jc(t)
                                    });
                                case "for":
                                    return x();
                                case "function":
                                    return A(Z);
                                case "if":
                                    return B();
                                case "return":
                                    return 0 == c.in_function && h("'return' outside of function"),
                                        new ab({
                                            value: d("punc", ";") ? (f(),
                                                null) : o() ? null : (a = ic(!0),
                                                    p(),
                                                    a)
                                        });
                                case "switch":
                                    return new gb({
                                        expression: q(),
                                        body: jc(D)
                                    });
                                case "throw":
                                    return c.token.nlb && h("Illegal newline after 'throw'"),
                                        new bb({
                                            value: (a = ic(!0),
                                                p(),
                                                a)
                                        });
                                case "try":
                                    return H();
                                case "var":
                                    return a = L(),
                                        p(),
                                        a;
                                case "const":
                                    return a = O(),
                                        p(),
                                        a;
                                case "with":
                                    return new T({
                                        expression: q(),
                                        body: t()
                                    });
                                default:
                                    j()
                            }
                    }
                })
                    , A = function (a) {
                        var b = a === Z
                            , e = d("name") ? Kb(b ? Pb : Qb) : null;
                        return b && !e && j(),
                            m("("),
                            new a({
                                name: e,
                                argnames: function (a, b) {
                                    for (; !d("punc", ")");)
                                        a ? a = !1 : m(","),
                                            b.push(Kb(Ob));
                                    return f(),
                                        b
                                }(!0, []),
                                body: function (a, b) {
                                    ++c.in_function,
                                        c.in_directives = !0,
                                        c.in_loop = 0,
                                        c.labels = [];
                                    var d = C();
                                    return --c.in_function,
                                        c.in_loop = a,
                                        c.labels = b,
                                        d
                                }(c.in_loop, c.labels)
                            })
                    }
                    , L = function (a) {
                        return new ob({
                            start: g(),
                            definitions: I(a, !1),
                            end: g()
                        })
                    }
                    , O = function () {
                        return new pb({
                            start: g(),
                            definitions: I(!1, !0),
                            end: g()
                        })
                    }
                    , U = function () {
                        var a = c.token;
                        l("operator", "new");
                        var e, b = $(!1);
                        return d("punc", "(") ? (f(),
                            e = _(")")) : e = [],
                            Lb(new sb({
                                start: a,
                                expression: b,
                                args: e,
                                end: g()
                            }), !0)
                    }
                    , $ = function (a) {
                        if (d("operator", "new"))
                            return U();
                        var b = c.token;
                        if (d("punc")) {
                            switch (b.value) {
                                case "(":
                                    f();
                                    var e = ic(!0);
                                    return e.start = b,
                                        e.end = c.token,
                                        m(")"),
                                        Lb(e, a);
                                case "[":
                                    return Lb(cb(), a);
                                case "{":
                                    return Lb(hb(), a)
                            }
                            j()
                        }
                        if (d("keyword", "function")) {
                            f();
                            var h = A(Y);
                            return h.start = b,
                                h.end = g(),
                                Lb(h, a)
                        }
                        return Qc[c.token.type] ? Lb(W(), a) : (j(),
                            void 0)
                    }
                    , cb = r(function () {
                        return m("["),
                            new Db({
                                elements: _("]", !b.strict, !0)
                            })
                    })
                    , hb = r(function () {
                        m("{");
                        for (var a = !0, e = []; !d("punc", "}") && (a ? a = !1 : m(","),
                            b.strict || !d("punc", "}"));) {
                            var h = c.token
                                , i = h.type
                                , j = nb();
                            if ("name" == i && !d("punc", ":")) {
                                if ("get" == j) {
                                    e.push(new Ib({
                                        start: h,
                                        key: W(),
                                        value: A(X),
                                        end: g()
                                    }));
                                    continue
                                }
                                if ("set" == j) {
                                    e.push(new Hb({
                                        start: h,
                                        key: W(),
                                        value: A(X),
                                        end: g()
                                    }));
                                    continue
                                }
                            }
                            m(":"),
                                e.push(new Gb({
                                    start: h,
                                    key: j,
                                    value: ic(!1),
                                    end: g()
                                }))
                        }
                        return f(),
                            new Eb({
                                properties: e
                            })
                    })
                    , Lb = function (a, b) {
                        var c = a.start;
                        if (d("punc", "."))
                            return f(),
                                Lb(new vb({
                                    start: c,
                                    expression: a,
                                    property: xb(),
                                    end: g()
                                }), b);
                        if (d("punc", "[")) {
                            f();
                            var e = ic(!0);
                            return m("]"),
                                Lb(new wb({
                                    start: c,
                                    expression: a,
                                    property: e,
                                    end: g()
                                }), b)
                        }
                        return b && d("punc", "(") ? (f(),
                            Lb(new rb({
                                start: c,
                                expression: a,
                                args: _(")"),
                                end: g()
                            }), !0)) : a
                    }
                    , Wb = function (a) {
                        var b = c.token;
                        if (d("operator") && Lc(b.value)) {
                            f(),
                                s();
                            var e = $b(yb, b.value, Wb(a));
                            return e.start = b,
                                e.end = g(),
                                e
                        }
                        for (var h = $(a); d("operator") && Mc(c.token.value) && !c.token.nlb;)
                            h = $b(zb, c.token.value, h),
                                h.start = b,
                                h.end = c.token,
                                f();
                        return h
                    }
                    , ac = function (a, b, e) {
                        var g = d("operator") ? c.token.value : null;
                        "in" == g && e && (g = null);
                        var h = null != g ? Oc[g] : null;
                        if (null != h && h > b) {
                            f();
                            var i = ac(Wb(!0), h, e);
                            return ac(new Ab({
                                start: a.start,
                                left: a,
                                operator: g,
                                right: i,
                                end: i.end
                            }), b, e)
                        }
                        return a
                    }
                    , dc = function (a) {
                        var b = c.token
                            , e = bc(a);
                        if (d("operator", "?")) {
                            f();
                            var h = ic(!1);
                            return m(":"),
                                new Bb({
                                    start: b,
                                    condition: e,
                                    consequent: h,
                                    alternative: ic(!1, a),
                                    end: g()
                                })
                        }
                        return e
                    }
                    , hc = function (a) {
                        var b = c.token
                            , e = dc(a)
                            , i = c.token.value;
                        if (d("operator") && Nc(i)) {
                            if (ec(e))
                                return f(),
                                    new Cb({
                                        start: b,
                                        left: e,
                                        operator: i,
                                        right: hc(a),
                                        end: g()
                                    });
                            h("Invalid assignment")
                        }
                        return e
                    }
                    , ic = function (a, b) {
                        var g = c.token
                            , h = hc(b);
                        return a && d("punc", ",") ? (f(),
                            new tb({
                                start: g,
                                car: h,
                                cdr: ic(!0, b),
                                end: e()
                            })) : h
                    };
                return b.expression ? ic(!0) : function () {
                    for (var a = c.token, e = []; !d("eof");)
                        e.push(t());
                    var f = g()
                        , h = b.toplevel;
                    return h ? (h.body = h.body.concat(e),
                        h.end = f) : h = new V({
                            start: a,
                            body: e,
                            end: f
                        }),
                        h
                }()
            }
            function Sc(a, b) {
                hc.call(this),
                    this.before = a,
                    this.after = b
            }
            function Tc(a, b, c) {
                this.name = c.name,
                    this.orig = [c],
                    this.scope = a,
                    this.references = [],
                    this.global = !1,
                    this.mangled_name = null,
                    this.undeclared = !1,
                    this.constant = !1,
                    this.index = b
            }
            function Vc(a) {
                function g(a, b) {
                    return a.replace(/[\u0080-\uffff]/g, function (a) {
                        var c = a.charCodeAt(0).toString(16);
                        if (c.length <= 2 && !b) {
                            for (; c.length < 2;)
                                c = "0" + c;
                            return "\\x" + c
                        }
                        for (; c.length < 4;)
                            c = "0" + c;
                        return "\\u" + c
                    })
                }
                function h(b) {
                    var c = 0
                        , d = 0;
                    return b = b.replace(/[\\\b\f\n\r\t\x22\x27\u2028\u2029\0]/g, function (a) {
                        switch (a) {
                            case "\\":
                                return "\\\\";
                            case "\b":
                                return "\\b";
                            case "\f":
                                return "\\f";
                            case "\n":
                                return "\\n";
                            case "\r":
                                return "\\r";
                            case "\u2028":
                                return "\\u2028";
                            case "\u2029":
                                return "\\u2029";
                            case '"':
                                return ++c,
                                    '"';
                            case "'":
                                return ++d,
                                    "'";
                            case "\0":
                                return "\\x00"
                        }
                        return a
                    }),
                        a.ascii_only && (b = g(b)),
                        c > d ? "'" + b.replace(/\x27/g, "\\'") + "'" : '"' + b.replace(/\x22/g, '\\"') + '"'
                }
                function i(b) {
                    var c = h(b);
                    return a.inline_script && (c = c.replace(/<\x2fscript([>\/\t\n\f\r ])/gi, "<\\/script$1")),
                        c
                }
                function j(b) {
                    return b = b.toString(),
                        a.ascii_only && (b = g(b, !0)),
                        b
                }
                function k(c) {
                    return l(" ", a.indent_start + b - c * a.indent_level)
                }
                function r() {
                    return q.charAt(q.length - 1)
                }
                function s() {
                    a.max_line_len && c > a.max_line_len && u("\n")
                }
                function u(b) {
                    b = String(b);
                    var g = b.charAt(0);
                    if (o && (g && !(";}".indexOf(g) < 0) || /[;]$/.test(q) || (a.semicolons || t(g) ? (f += ";",
                        c++ ,
                        e++) : (f += "\n",
                            e++ ,
                            d++ ,
                            c = 0),
                        a.beautify || (m = !1)),
                        o = !1,
                        s()),
                        !a.beautify && a.preserve_line && L[L.length - 1])
                        for (var h = L[L.length - 1].start.line; h > d;)
                            f += "\n",
                                e++ ,
                                d++ ,
                                c = 0,
                                m = !1;
                    if (m) {
                        var i = r();
                        (Dc(i) && (Dc(g) || "\\" == g) || /^[\+\-\/]$/.test(g) && g == i) && (f += " ",
                            c++ ,
                            e++),
                            m = !1
                    }
                    var j = b.split(/\r?\n/)
                        , k = j.length - 1;
                    d += k,
                        0 == k ? c += j[k].length : c = j[k].length,
                        e += b.length,
                        q = b,
                        f += b
                }
                function B() {
                    o = !1,
                        u(";")
                }
                function D() {
                    return b + a.indent_level
                }
                function E(a) {
                    var b;
                    return u("{"),
                        z(),
                        y(D(), function () {
                            b = a()
                        }),
                        w(),
                        u("}"),
                        b
                }
                function F(a) {
                    u("(");
                    var b = a();
                    return u(")"),
                        b
                }
                function G(a) {
                    u("[");
                    var b = a();
                    return u("]"),
                        b
                }
                function H() {
                    u(","),
                        v()
                }
                function I() {
                    u(":"),
                        a.space_colon && v()
                }
                function K() {
                    return f
                }
                a = n(a, {
                    indent_start: 0,
                    indent_level: 4,
                    quote_keys: !1,
                    space_colon: !0,
                    ascii_only: !1,
                    unescape_regexps: !1,
                    inline_script: !1,
                    width: 80,
                    max_line_len: 32e3,
                    beautify: !1,
                    source_map: null,
                    bracketize: !1,
                    semicolons: !0,
                    comments: !1,
                    preserve_line: !1,
                    screw_ie8: !1,
                    preamble: null
                }, !0);
                var b = 0
                    , c = 0
                    , d = 1
                    , e = 0
                    , f = ""
                    , m = !1
                    , o = !1
                    , q = null
                    , t = x("( [ + * / - , .")
                    , v = a.beautify ? function () {
                        u(" ")
                    }
                        : function () {
                            m = !0
                        }
                    , w = a.beautify ? function (b) {
                        a.beautify && u(k(b ? .5 : 0))
                    }
                        : p
                    , y = a.beautify ? function (a, c) {
                        a === !0 && (a = D());
                        var d = b;
                        b = a;
                        var e = c();
                        return b = d,
                            e
                    }
                        : function (a, b) {
                            return b()
                        }
                    , z = a.beautify ? function () {
                        u("\n")
                    }
                        : p
                    , A = a.beautify ? function () {
                        u(";")
                    }
                        : function () {
                            o = !0
                        }
                    , J = a.source_map ? function (b, e) {
                        try {
                            b && a.source_map.add(b.file || "?", d, c, b.line, b.col, e || "name" != b.type ? e : b.value)
                        } catch (f) {
                            C.warn("Couldn't figure out mapping for {file}:{line},{col} \u2192 {cline},{ccol} [{name}]", {
                                file: b.file,
                                line: b.line,
                                col: b.col,
                                cline: d,
                                ccol: c,
                                name: e || ""
                            })
                        }
                    }
                        : p;
                a.preamble && u(a.preamble.replace(/\r\n?|[\n\u2028\u2029]|\s*$/g, "\n"));
                var L = [];
                return {
                    get: K,
                    toString: K,
                    indent: w,
                    indentation: function () {
                        return b
                    },
                    current_width: function () {
                        return c - b
                    },
                    should_break: function () {
                        return a.width && this.current_width() >= a.width
                    },
                    newline: z,
                    print: u,
                    space: v,
                    comma: H,
                    colon: I,
                    last: function () {
                        return q
                    },
                    semicolon: A,
                    force_semicolon: B,
                    to_ascii: g,
                    print_name: function (a) {
                        u(j(a))
                    },
                    print_string: function (a) {
                        u(i(a))
                    },
                    next_indent: D,
                    with_indent: y,
                    with_block: E,
                    with_parens: F,
                    with_square: G,
                    add_mapping: J,
                    option: function (b) {
                        return a[b]
                    },
                    line: function () {
                        return d
                    },
                    col: function () {
                        return c
                    },
                    pos: function () {
                        return e
                    },
                    push_node: function (a) {
                        L.push(a)
                    },
                    pop_node: function () {
                        return L.pop()
                    },
                    stack: function () {
                        return L
                    },
                    parent: function (a) {
                        return L[L.length - 2 - (a || 0)]
                    }
                }
            }
            function Wc(a, b) {
                return this instanceof Wc ? (Sc.call(this, this.before, this.after),
                    this.options = n(a, {
                        sequences: !b,
                        properties: !b,
                        dead_code: !b,
                        drop_debugger: !b,
                        unsafe: !1,
                        unsafe_comps: !1,
                        conditionals: !b,
                        comparisons: !b,
                        evaluate: !b,
                        booleans: !b,
                        loops: !b,
                        unused: !b,
                        hoist_funs: !b,
                        hoist_vars: !1,
                        if_return: !b,
                        join_vars: !b,
                        cascade: !b,
                        side_effects: !b,
                        pure_getters: !1,
                        pure_funcs: null,
                        negate_iife: !b,
                        screw_ie8: !1,
                        drop_console: !1,
                        angular: !1,
                        warnings: !0,
                        global_defs: {}
                    }, !0),
                    void 0) : new Wc(a, b)
            }
            function Xc(a) {
                function d(d, e, f, g, h, i) {
                    if (c) {
                        var j = c.originalPositionFor({
                            line: g,
                            column: h
                        });
                        d = j.source,
                            g = j.line,
                            h = j.column,
                            i = j.name
                    }
                    b.addMapping({
                        generated: {
                            line: e + a.dest_line_diff,
                            column: f
                        },
                        original: {
                            line: g + a.orig_line_diff,
                            column: h
                        },
                        source: d,
                        name: i
                    })
                }
                a = n(a, {
                    file: null,
                    root: null,
                    orig: null,
                    orig_line_diff: 0,
                    dest_line_diff: 0
                });
                var b = new e.SourceMapGenerator({
                    file: a.file,
                    sourceRoot: a.root
                })
                    , c = a.orig && new e.SourceMapConsumer(a.orig);
                return {
                    add: d,
                    get: function () {
                        return b
                    },
                    toString: function () {
                        return b.toString()
                    }
                }
            }
            var d = a("util")
                , e = a("source-map")
                , f = c;
            m.prototype = Object.create(Error.prototype),
                m.prototype.constructor = m,
                m.croak = function (a, b) {
                    throw new m(a, b)
                }
                ;
            var q = function () {
                function a(a, f, g) {
                    function k() {
                        var k = f(a[j], j)
                            , l = k instanceof e;
                        return l && (k = k.v),
                            k instanceof c ? (k = k.v,
                                k instanceof d ? i.push.apply(i, g ? k.v.slice().reverse() : k.v) : i.push(k)) : k !== b && (k instanceof d ? h.push.apply(h, g ? k.v.slice().reverse() : k.v) : h.push(k)),
                            l
                    }
                    var j, h = [], i = [];
                    if (a instanceof Array)
                        if (g) {
                            for (j = a.length; --j >= 0 && !k();)
                                ;
                            h.reverse(),
                                i.reverse()
                        } else
                            for (j = 0; j < a.length && !k(); ++j)
                                ;
                    else
                        for (j in a)
                            if (a.hasOwnProperty(j) && k())
                                break;
                    return i.concat(h)
                }
                function c(a) {
                    this.v = a
                }
                function d(a) {
                    this.v = a
                }
                function e(a) {
                    this.v = a
                }
                a.at_top = function (a) {
                    return new c(a)
                }
                    ,
                    a.splice = function (a) {
                        return new d(a)
                    }
                    ,
                    a.last = function (a) {
                        return new e(a)
                    }
                    ;
                var b = a.skip = {};
                return a
            }();
            z.prototype = {
                set: function (a, b) {
                    return this.has(a) || ++this._size,
                        this._values["$" + a] = b,
                        this
                },
                add: function (a, b) {
                    return this.has(a) ? this.get(a).push(b) : this.set(a, [b]),
                        this
                },
                get: function (a) {
                    return this._values["$" + a]
                },
                del: function (a) {
                    return this.has(a) && (--this._size,
                        delete this._values["$" + a]),
                        this
                },
                has: function (a) {
                    return "$" + a in this._values
                },
                each: function (a) {
                    for (var b in this._values)
                        a(this._values[b], b.substr(1))
                },
                size: function () {
                    return this._size
                },
                map: function (a) {
                    var b = [];
                    for (var c in this._values)
                        b.push(a(this._values[c], c.substr(1)));
                    return b
                }
            };
            var B = A("Token", "type value line col pos endpos nlb comments_before file", {}, null)
                , C = A("Node", "start end", {
                    clone: function () {
                        return new this.CTOR(this)
                    },
                    $documentation: "Base class of all AST nodes",
                    $propdoc: {
                        start: "[AST_Token] The first token of this node",
                        end: "[AST_Token] The last token of this node"
                    },
                    _walk: function (a) {
                        return a._visit(this)
                    },
                    walk: function (a) {
                        return this._walk(a)
                    }
                }, null);
            C.warn_function = null,
                C.warn = function (a, b) {
                    C.warn_function && C.warn_function(s(a, b))
                }
                ;
            var D = A("Statement", null, {
                $documentation: "Base class of all statements"
            })
                , E = A("Debugger", null, {
                    $documentation: "Represents a debugger statement"
                }, D)
                , F = A("Directive", "value scope", {
                    $documentation: 'Represents a directive, like "use strict";',
                    $propdoc: {
                        value: "[string] The value of this directive as a plain string (it's not an AST_String!)",
                        scope: "[AST_Scope/S] The scope that this directive affects"
                    }
                }, D)
                , G = A("SimpleStatement", "body", {
                    $documentation: "A statement consisting of an expression, i.e. a = 1 + 2",
                    $propdoc: {
                        body: "[AST_Node] an expression node (should not be instanceof AST_Statement)"
                    },
                    _walk: function (a) {
                        return a._visit(this, function () {
                            this.body._walk(a)
                        })
                    }
                }, D)
                , I = A("Block", "body", {
                    $documentation: "A body of statements (usually bracketed)",
                    $propdoc: {
                        body: "[AST_Statement*] an array of statements"
                    },
                    _walk: function (a) {
                        return a._visit(this, function () {
                            H(this, a)
                        })
                    }
                }, D)
                , J = A("BlockStatement", null, {
                    $documentation: "A block statement"
                }, I)
                , K = A("EmptyStatement", null, {
                    $documentation: "The empty statement (empty block or simply a semicolon)",
                    _walk: function (a) {
                        return a._visit(this)
                    }
                }, D)
                , L = A("StatementWithBody", "body", {
                    $documentation: "Base class for all statements that contain one nested body: `For`, `ForIn`, `Do`, `While`, `With`",
                    $propdoc: {
                        body: "[AST_Statement] the body; this should always be present, even if it's an AST_EmptyStatement"
                    },
                    _walk: function (a) {
                        return a._visit(this, function () {
                            this.body._walk(a)
                        })
                    }
                }, D)
                , M = A("LabeledStatement", "label", {
                    $documentation: "Statement with a label",
                    $propdoc: {
                        label: "[AST_Label] a label definition"
                    },
                    _walk: function (a) {
                        return a._visit(this, function () {
                            this.label._walk(a),
                                this.body._walk(a)
                        })
                    }
                }, L)
                , N = A("IterationStatement", null, {
                    $documentation: "Internal class.  All loops inherit from it."
                }, L)
                , O = A("DWLoop", "condition", {
                    $documentation: "Base class for do/while statements",
                    $propdoc: {
                        condition: "[AST_Node] the loop condition.  Should not be instanceof AST_Statement"
                    },
                    _walk: function (a) {
                        return a._visit(this, function () {
                            this.condition._walk(a),
                                this.body._walk(a)
                        })
                    }
                }, N)
                , P = A("Do", null, {
                    $documentation: "A `do` statement"
                }, O)
                , Q = A("While", null, {
                    $documentation: "A `while` statement"
                }, O)
                , R = A("For", "init condition step", {
                    $documentation: "A `for` statement",
                    $propdoc: {
                        init: "[AST_Node?] the `for` initialization code, or null if empty",
                        condition: "[AST_Node?] the `for` termination clause, or null if empty",
                        step: "[AST_Node?] the `for` update clause, or null if empty"
                    },
                    _walk: function (a) {
                        return a._visit(this, function () {
                            this.init && this.init._walk(a),
                                this.condition && this.condition._walk(a),
                                this.step && this.step._walk(a),
                                this.body._walk(a)
                        })
                    }
                }, N)
                , S = A("ForIn", "init name object", {
                    $documentation: "A `for ... in` statement",
                    $propdoc: {
                        init: "[AST_Node] the `for/in` initialization code",
                        name: "[AST_SymbolRef?] the loop variable, only if `init` is AST_Var",
                        object: "[AST_Node] the object that we're looping through"
                    },
                    _walk: function (a) {
                        return a._visit(this, function () {
                            this.init._walk(a),
                                this.object._walk(a),
                                this.body._walk(a)
                        })
                    }
                }, N)
                , T = A("With", "expression", {
                    $documentation: "A `with` statement",
                    $propdoc: {
                        expression: "[AST_Node] the `with` expression"
                    },
                    _walk: function (a) {
                        return a._visit(this, function () {
                            this.expression._walk(a),
                                this.body._walk(a)
                        })
                    }
                }, L)
                , U = A("Scope", "directives variables functions uses_with uses_eval parent_scope enclosed cname", {
                    $documentation: "Base class for all statements introducing a lexical scope",
                    $propdoc: {
                        directives: "[string*/S] an array of directives declared in this scope",
                        variables: "[Object/S] a map of name -> SymbolDef for all variables/functions defined in this scope",
                        functions: "[Object/S] like `variables`, but only lists function declarations",
                        uses_with: "[boolean/S] tells whether this scope uses the `with` statement",
                        uses_eval: "[boolean/S] tells whether this scope contains a direct call to the global `eval`",
                        parent_scope: "[AST_Scope?/S] link to the parent scope",
                        enclosed: "[SymbolDef*/S] a list of all symbol definitions that are accessed from this scope or any subscopes",
                        cname: "[integer/S] current index for mangling variables (used internally by the mangler)"
                    }
                }, I)
                , V = A("Toplevel", "globals", {
                    $documentation: "The toplevel scope",
                    $propdoc: {
                        globals: "[Object/S] a map of name -> SymbolDef for all undeclared names"
                    },
                    wrap_enclose: function (a) {
                        var b = this
                            , c = []
                            , d = [];
                        a.forEach(function (a) {
                            var b = a.split(":");
                            c.push(b[0]),
                                d.push(b[1])
                        });
                        var e = "(function(" + d.join(",") + "){ '$ORIG'; })(" + c.join(",") + ")";
                        return e = Rc(e),
                            e = e.transform(new Sc(function (a) {
                                return a instanceof F && "$ORIG" == a.value ? q.splice(b.body) : void 0
                            }
                            ))
                    },
                    wrap_commonjs: function (a, b) {
                        var c = this
                            , d = [];
                        b && (c.figure_out_scope(),
                            c.walk(new hc(function (a) {
                                a instanceof Lb && a.definition().global && (k(function (b) {
                                    return b.name == a.name
                                }, d) || d.push(a))
                            }
                            )));
                        var e = "(function(exports, global){ global['" + a + "'] = exports; '$ORIG'; '$EXPORTS'; }({}, (function(){return this}())))";
                        return e = Rc(e),
                            e = e.transform(new Sc(function (a) {
                                if (a instanceof G && (a = a.body,
                                    a instanceof Xb))
                                    switch (a.getValue()) {
                                        case "$ORIG":
                                            return q.splice(c.body);
                                        case "$EXPORTS":
                                            var b = [];
                                            return d.forEach(function (a) {
                                                b.push(new G({
                                                    body: new Cb({
                                                        left: new wb({
                                                            expression: new Tb({
                                                                name: "exports"
                                                            }),
                                                            property: new Xb({
                                                                value: a.name
                                                            })
                                                        }),
                                                        operator: "=",
                                                        right: new Tb(a)
                                                    })
                                                }))
                                            }),
                                                q.splice(b)
                                    }
                            }
                            ))
                    }
                }, U)
                , W = A("Lambda", "name argnames uses_arguments", {
                    $documentation: "Base class for functions",
                    $propdoc: {
                        name: "[AST_SymbolDeclaration?] the name of this function",
                        argnames: "[AST_SymbolFunarg*] array of function arguments",
                        uses_arguments: "[boolean/S] tells whether this function accesses the arguments array"
                    },
                    _walk: function (a) {
                        return a._visit(this, function () {
                            this.name && this.name._walk(a),
                                this.argnames.forEach(function (b) {
                                    b._walk(a)
                                }),
                                H(this, a)
                        })
                    }
                }, U)
                , X = A("Accessor", null, {
                    $documentation: "A setter/getter function.  The `name` property is always null."
                }, W)
                , Y = A("Function", null, {
                    $documentation: "A function expression"
                }, W)
                , Z = A("Defun", null, {
                    $documentation: "A function definition"
                }, W)
                , $ = A("Jump", null, {
                    $documentation: "Base class for \u201cjumps\u201d (for now that's `return`, `throw`, `break` and `continue`)"
                }, D)
                , _ = A("Exit", "value", {
                    $documentation: "Base class for \u201cexits\u201d (`return` and `throw`)",
                    $propdoc: {
                        value: "[AST_Node?] the value returned or thrown by this statement; could be null for AST_Return"
                    },
                    _walk: function (a) {
                        return a._visit(this, this.value && function () {
                            this.value._walk(a)
                        }
                        )
                    }
                }, $)
                , ab = A("Return", null, {
                    $documentation: "A `return` statement"
                }, _)
                , bb = A("Throw", null, {
                    $documentation: "A `throw` statement"
                }, _)
                , cb = A("LoopControl", "label", {
                    $documentation: "Base class for loop control statements (`break` and `continue`)",
                    $propdoc: {
                        label: "[AST_LabelRef?] the label, or null if none"
                    },
                    _walk: function (a) {
                        return a._visit(this, this.label && function () {
                            this.label._walk(a)
                        }
                        )
                    }
                }, $)
                , db = A("Break", null, {
                    $documentation: "A `break` statement"
                }, cb)
                , eb = A("Continue", null, {
                    $documentation: "A `continue` statement"
                }, cb)
                , fb = A("If", "condition alternative", {
                    $documentation: "A `if` statement",
                    $propdoc: {
                        condition: "[AST_Node] the `if` condition",
                        alternative: "[AST_Statement?] the `else` part, or null if not present"
                    },
                    _walk: function (a) {
                        return a._visit(this, function () {
                            this.condition._walk(a),
                                this.body._walk(a),
                                this.alternative && this.alternative._walk(a)
                        })
                    }
                }, L)
                , gb = A("Switch", "expression", {
                    $documentation: "A `switch` statement",
                    $propdoc: {
                        expression: "[AST_Node] the `switch` \u201cdiscriminant\u201d"
                    },
                    _walk: function (a) {
                        return a._visit(this, function () {
                            this.expression._walk(a),
                                H(this, a)
                        })
                    }
                }, I)
                , hb = A("SwitchBranch", null, {
                    $documentation: "Base class for `switch` branches"
                }, I)
                , ib = A("Default", null, {
                    $documentation: "A `default` switch branch"
                }, hb)
                , jb = A("Case", "expression", {
                    $documentation: "A `case` switch branch",
                    $propdoc: {
                        expression: "[AST_Node] the `case` expression"
                    },
                    _walk: function (a) {
                        return a._visit(this, function () {
                            this.expression._walk(a),
                                H(this, a)
                        })
                    }
                }, hb)
                , kb = A("Try", "bcatch bfinally", {
                    $documentation: "A `try` statement",
                    $propdoc: {
                        bcatch: "[AST_Catch?] the catch block, or null if not present",
                        bfinally: "[AST_Finally?] the finally block, or null if not present"
                    },
                    _walk: function (a) {
                        return a._visit(this, function () {
                            H(this, a),
                                this.bcatch && this.bcatch._walk(a),
                                this.bfinally && this.bfinally._walk(a)
                        })
                    }
                }, I)
                , lb = A("Catch", "argname", {
                    $documentation: "A `catch` node; only makes sense as part of a `try` statement",
                    $propdoc: {
                        argname: "[AST_SymbolCatch] symbol for the exception"
                    },
                    _walk: function (a) {
                        return a._visit(this, function () {
                            this.argname._walk(a),
                                H(this, a)
                        })
                    }
                }, I)
                , mb = A("Finally", null, {
                    $documentation: "A `finally` node; only makes sense as part of a `try` statement"
                }, I)
                , nb = A("Definitions", "definitions", {
                    $documentation: "Base class for `var` or `const` nodes (variable declarations/initializations)",
                    $propdoc: {
                        definitions: "[AST_VarDef*] array of variable definitions"
                    },
                    _walk: function (a) {
                        return a._visit(this, function () {
                            this.definitions.forEach(function (b) {
                                b._walk(a)
                            })
                        })
                    }
                }, D)
                , ob = A("Var", null, {
                    $documentation: "A `var` statement"
                }, nb)
                , pb = A("Const", null, {
                    $documentation: "A `const` statement"
                }, nb)
                , qb = A("VarDef", "name value", {
                    $documentation: "A variable declaration; only appears in a AST_Definitions node",
                    $propdoc: {
                        name: "[AST_SymbolVar|AST_SymbolConst] name of the variable",
                        value: "[AST_Node?] initializer, or null of there's no initializer"
                    },
                    _walk: function (a) {
                        return a._visit(this, function () {
                            this.name._walk(a),
                                this.value && this.value._walk(a)
                        })
                    }
                })
                , rb = A("Call", "expression args", {
                    $documentation: "A function call expression",
                    $propdoc: {
                        expression: "[AST_Node] expression to invoke as function",
                        args: "[AST_Node*] array of arguments"
                    },
                    _walk: function (a) {
                        return a._visit(this, function () {
                            this.expression._walk(a),
                                this.args.forEach(function (b) {
                                    b._walk(a)
                                })
                        })
                    }
                })
                , sb = A("New", null, {
                    $documentation: "An object instantiation.  Derives from a function call since it has exactly the same properties"
                }, rb)
                , tb = A("Seq", "car cdr", {
                    $documentation: "A sequence expression (two comma-separated expressions)",
                    $propdoc: {
                        car: "[AST_Node] first element in sequence",
                        cdr: "[AST_Node] second element in sequence"
                    },
                    $cons: function (a, b) {
                        var c = new tb(a);
                        return c.car = a,
                            c.cdr = b,
                            c
                    },
                    $from_array: function (a) {
                        if (0 == a.length)
                            return null;
                        if (1 == a.length)
                            return a[0].clone();
                        for (var b = null, c = a.length; --c >= 0;)
                            b = tb.cons(a[c], b);
                        for (var d = b; d;) {
                            if (d.cdr && !d.cdr.cdr) {
                                d.cdr = d.cdr.car;
                                break
                            }
                            d = d.cdr
                        }
                        return b
                    },
                    to_array: function () {
                        for (var a = this, b = []; a;) {
                            if (b.push(a.car),
                                a.cdr && !(a.cdr instanceof tb)) {
                                b.push(a.cdr);
                                break
                            }
                            a = a.cdr
                        }
                        return b
                    },
                    add: function (a) {
                        for (var b = this; b;) {
                            if (!(b.cdr instanceof tb)) {
                                var c = tb.cons(b.cdr, a);
                                return b.cdr = c
                            }
                            b = b.cdr
                        }
                    },
                    _walk: function (a) {
                        return a._visit(this, function () {
                            this.car._walk(a),
                                this.cdr && this.cdr._walk(a)
                        })
                    }
                })
                , ub = A("PropAccess", "expression property", {
                    $documentation: 'Base class for property access expressions, i.e. `a.foo` or `a["foo"]`',
                    $propdoc: {
                        expression: "[AST_Node] the \u201ccontainer\u201d expression",
                        property: "[AST_Node|string] the property to access.  For AST_Dot this is always a plain string, while for AST_Sub it's an arbitrary AST_Node"
                    }
                })
                , vb = A("Dot", null, {
                    $documentation: "A dotted property access expression",
                    _walk: function (a) {
                        return a._visit(this, function () {
                            this.expression._walk(a)
                        })
                    }
                }, ub)
                , wb = A("Sub", null, {
                    $documentation: 'Index-style property access, i.e. `a["foo"]`',
                    _walk: function (a) {
                        return a._visit(this, function () {
                            this.expression._walk(a),
                                this.property._walk(a)
                        })
                    }
                }, ub)
                , xb = A("Unary", "operator expression", {
                    $documentation: "Base class for unary expressions",
                    $propdoc: {
                        operator: "[string] the operator",
                        expression: "[AST_Node] expression that this unary operator applies to"
                    },
                    _walk: function (a) {
                        return a._visit(this, function () {
                            this.expression._walk(a)
                        })
                    }
                })
                , yb = A("UnaryPrefix", null, {
                    $documentation: "Unary prefix expression, i.e. `typeof i` or `++i`"
                }, xb)
                , zb = A("UnaryPostfix", null, {
                    $documentation: "Unary postfix expression, i.e. `i++`"
                }, xb)
                , Ab = A("Binary", "left operator right", {
                    $documentation: "Binary expression, i.e. `a + b`",
                    $propdoc: {
                        left: "[AST_Node] left-hand side expression",
                        operator: "[string] the operator",
                        right: "[AST_Node] right-hand side expression"
                    },
                    _walk: function (a) {
                        return a._visit(this, function () {
                            this.left._walk(a),
                                this.right._walk(a)
                        })
                    }
                })
                , Bb = A("Conditional", "condition consequent alternative", {
                    $documentation: "Conditional expression using the ternary operator, i.e. `a ? b : c`",
                    $propdoc: {
                        condition: "[AST_Node]",
                        consequent: "[AST_Node]",
                        alternative: "[AST_Node]"
                    },
                    _walk: function (a) {
                        return a._visit(this, function () {
                            this.condition._walk(a),
                                this.consequent._walk(a),
                                this.alternative._walk(a)
                        })
                    }
                })
                , Cb = A("Assign", null, {
                    $documentation: "An assignment expression \u2014 `a = b + 5`"
                }, Ab)
                , Db = A("Array", "elements", {
                    $documentation: "An array literal",
                    $propdoc: {
                        elements: "[AST_Node*] array of elements"
                    },
                    _walk: function (a) {
                        return a._visit(this, function () {
                            this.elements.forEach(function (b) {
                                b._walk(a)
                            })
                        })
                    }
                })
                , Eb = A("Object", "properties", {
                    $documentation: "An object literal",
                    $propdoc: {
                        properties: "[AST_ObjectProperty*] array of properties"
                    },
                    _walk: function (a) {
                        return a._visit(this, function () {
                            this.properties.forEach(function (b) {
                                b._walk(a)
                            })
                        })
                    }
                })
                , Fb = A("ObjectProperty", "key value", {
                    $documentation: "Base class for literal object properties",
                    $propdoc: {
                        key: "[string] the property name converted to a string for ObjectKeyVal.  For setters and getters this is an arbitrary AST_Node.",
                        value: "[AST_Node] property value.  For setters and getters this is an AST_Function."
                    },
                    _walk: function (a) {
                        return a._visit(this, function () {
                            this.value._walk(a)
                        })
                    }
                })
                , Gb = A("ObjectKeyVal", null, {
                    $documentation: "A key: value object property"
                }, Fb)
                , Hb = A("ObjectSetter", null, {
                    $documentation: "An object setter property"
                }, Fb)
                , Ib = A("ObjectGetter", null, {
                    $documentation: "An object getter property"
                }, Fb)
                , Jb = A("Symbol", "scope name thedef", {
                    $propdoc: {
                        name: "[string] name of this symbol",
                        scope: "[AST_Scope/S] the current scope (not necessarily the definition scope)",
                        thedef: "[SymbolDef/S] the definition of this symbol"
                    },
                    $documentation: "Base class for all symbols"
                })
                , Kb = A("SymbolAccessor", null, {
                    $documentation: "The name of a property accessor (setter/getter function)"
                }, Jb)
                , Lb = A("SymbolDeclaration", "init", {
                    $documentation: "A declaration symbol (symbol in var/const, function name or argument, symbol in catch)",
                    $propdoc: {
                        init: "[AST_Node*/S] array of initializers for this declaration."
                    }
                }, Jb)
                , Mb = A("SymbolVar", null, {
                    $documentation: "Symbol defining a variable"
                }, Lb)
                , Nb = A("SymbolConst", null, {
                    $documentation: "A constant declaration"
                }, Lb)
                , Ob = A("SymbolFunarg", null, {
                    $documentation: "Symbol naming a function argument"
                }, Mb)
                , Pb = A("SymbolDefun", null, {
                    $documentation: "Symbol defining a function"
                }, Lb)
                , Qb = A("SymbolLambda", null, {
                    $documentation: "Symbol naming a function expression"
                }, Lb)
                , Rb = A("SymbolCatch", null, {
                    $documentation: "Symbol naming the exception in catch"
                }, Lb)
                , Sb = A("Label", "references", {
                    $documentation: "Symbol naming a label (declaration)",
                    $propdoc: {
                        references: "[AST_LoopControl*] a list of nodes referring to this label"
                    },
                    initialize: function () {
                        this.references = [],
                            this.thedef = this
                    }
                }, Jb)
                , Tb = A("SymbolRef", null, {
                    $documentation: "Reference to some symbol (not definition/declaration)"
                }, Jb)
                , Ub = A("LabelRef", null, {
                    $documentation: "Reference to a label symbol"
                }, Jb)
                , Vb = A("This", null, {
                    $documentation: "The `this` symbol"
                }, Jb)
                , Wb = A("Constant", null, {
                    $documentation: "Base class for all constants",
                    getValue: function () {
                        return this.value
                    }
                })
                , Xb = A("String", "value", {
                    $documentation: "A string literal",
                    $propdoc: {
                        value: "[string] the contents of this string"
                    }
                }, Wb)
                , Yb = A("Number", "value", {
                    $documentation: "A number literal",
                    $propdoc: {
                        value: "[number] the numeric value"
                    }
                }, Wb)
                , Zb = A("RegExp", "value", {
                    $documentation: "A regexp literal",
                    $propdoc: {
                        value: "[RegExp] the actual regexp"
                    }
                }, Wb)
                , $b = A("Atom", null, {
                    $documentation: "Base class for atoms"
                }, Wb)
                , _b = A("Null", null, {
                    $documentation: "The `null` atom",
                    value: null
                }, $b)
                , ac = A("NaN", null, {
                    $documentation: "The impossible value",
                    value: 0 / 0
                }, $b)
                , bc = A("Undefined", null, {
                    $documentation: "The `undefined` value",
                    value: void 0
                }, $b)
                , cc = A("Hole", null, {
                    $documentation: "A hole in an array",
                    value: void 0
                }, $b)
                , dc = A("Infinity", null, {
                    $documentation: "The `Infinity` value",
                    value: 1 / 0
                }, $b)
                , ec = A("Boolean", null, {
                    $documentation: "Base class for booleans"
                }, $b)
                , fc = A("False", null, {
                    $documentation: "The `false` atom",
                    value: !1
                }, ec)
                , gc = A("True", null, {
                    $documentation: "The `true` atom",
                    value: !0
                }, ec);
            hc.prototype = {
                _visit: function (a, b) {
                    this.stack.push(a);
                    var c = this.visit(a, b ? function () {
                        b.call(a)
                    }
                        : p);
                    return !c && b && b.call(a),
                        this.stack.pop(),
                        c
                },
                parent: function (a) {
                    return this.stack[this.stack.length - 2 - (a || 0)]
                },
                push: function (a) {
                    this.stack.push(a)
                },
                pop: function () {
                    return this.stack.pop()
                },
                self: function () {
                    return this.stack[this.stack.length - 1]
                },
                find_parent: function (a) {
                    for (var b = this.stack, c = b.length; --c >= 0;) {
                        var d = b[c];
                        if (d instanceof a)
                            return d
                    }
                },
                has_directive: function (a) {
                    return this.find_parent(U).has_directive(a)
                },
                in_boolean_context: function () {
                    for (var a = this.stack, b = a.length, c = a[--b]; b > 0;) {
                        var d = a[--b];
                        if (d instanceof fb && d.condition === c || d instanceof Bb && d.condition === c || d instanceof O && d.condition === c || d instanceof R && d.condition === c || d instanceof yb && "!" == d.operator && d.expression === c)
                            return !0;
                        if (!(d instanceof Ab) || "&&" != d.operator && "||" != d.operator)
                            return !1;
                        c = d
                    }
                },
                loopcontrol_target: function (a) {
                    var b = this.stack;
                    if (a)
                        for (var c = b.length; --c >= 0;) {
                            var d = b[c];
                            if (d instanceof M && d.label.name == a.name)
                                return d.body
                        }
                    else
                        for (var c = b.length; --c >= 0;) {
                            var d = b[c];
                            if (d instanceof gb || d instanceof N)
                                return d
                        }
                }
            };
            var ic = "break case catch const continue debugger default delete do else finally for function if in instanceof new return switch throw try typeof var void while with"
                , jc = "false null true"
                , kc = "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized this throws transient volatile yield " + jc + " " + ic
                , lc = "return new delete throw else case";
            ic = x(ic),
                kc = x(kc),
                lc = x(lc),
                jc = x(jc);
            var mc = x(i("+-*&%=<>!?|~^"))
                , nc = /^0x[0-9a-f]+$/i
                , oc = /^0[0-7]+$/
                , pc = /^\d*\.?\d*(?:e[+-]?\d*(?:\d\.?|\.?\d)\d*)?$/i
                , qc = x(["in", "instanceof", "typeof", "new", "void", "delete", "++", "--", "+", "-", "!", "~", "&", "|", "^", "*", "/", "%", ">>", "<<", ">>>", "<", ">", "<=", ">=", "==", "===", "!=", "!==", "?", "=", "+=", "-=", "/=", "*=", "%=", ">>=", "<<=", ">>>=", "|=", "^=", "&=", "&&", "||"])
                , rc = x(i(" \xa0\n\r \f\u200b\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000"))
                , sc = x(i("[{(,.;:"))
                , tc = x(i("[]{}(),;:"))
                , uc = x(i("gmsiy"))
                , vc = {
                    letter: new RegExp("[\\u0041-\\u005A\\u0061-\\u007A\\u00AA\\u00B5\\u00BA\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0370-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u0386\\u0388-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u048A-\\u0523\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0621-\\u064A\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06E5\\u06E6\\u06EE\\u06EF\\u06FA-\\u06FC\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07CA-\\u07EA\\u07F4\\u07F5\\u07FA\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0971\\u0972\\u097B-\\u097F\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD\\u09DF-\\u09E1\\u09F0\\u09F1\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B71\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BD0\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C33\\u0C35-\\u0C39\\u0C3D\\u0C58\\u0C59\\u0C60\\u0C61\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDE\\u0CE0\\u0CE1\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D28\\u0D2A-\\u0D39\\u0D3D\\u0D60\\u0D61\\u0D7A-\\u0D7F\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0E01-\\u0E30\\u0E32\\u0E33\\u0E40-\\u0E46\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EDC\\u0EDD\\u0F00\\u0F40-\\u0F47\\u0F49-\\u0F6C\\u0F88-\\u0F8B\\u1000-\\u102A\\u103F\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u10A0-\\u10C5\\u10D0-\\u10FA\\u10FC\\u1100-\\u1159\\u115F-\\u11A2\\u11A8-\\u11F9\\u1200-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1380-\\u138F\\u13A0-\\u13F4\\u1401-\\u166C\\u166F-\\u1676\\u1681-\\u169A\\u16A0-\\u16EA\\u1700-\\u170C\\u170E-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770\\u1780-\\u17B3\\u17D7\\u17DC\\u1820-\\u1877\\u1880-\\u18A8\\u18AA\\u1900-\\u191C\\u1950-\\u196D\\u1970-\\u1974\\u1980-\\u19A9\\u19C1-\\u19C7\\u1A00-\\u1A16\\u1B05-\\u1B33\\u1B45-\\u1B4B\\u1B83-\\u1BA0\\u1BAE\\u1BAF\\u1C00-\\u1C23\\u1C4D-\\u1C4F\\u1C5A-\\u1C7D\\u1D00-\\u1DBF\\u1E00-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u2071\\u207F\\u2090-\\u2094\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D\\u212F-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2183\\u2184\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2C6F\\u2C71-\\u2C7D\\u2C80-\\u2CE4\\u2D00-\\u2D25\\u2D30-\\u2D65\\u2D6F\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u2E2F\\u3005\\u3006\\u3031-\\u3035\\u303B\\u303C\\u3041-\\u3096\\u309D-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31B7\\u31F0-\\u31FF\\u3400\\u4DB5\\u4E00\\u9FC3\\uA000-\\uA48C\\uA500-\\uA60C\\uA610-\\uA61F\\uA62A\\uA62B\\uA640-\\uA65F\\uA662-\\uA66E\\uA67F-\\uA697\\uA717-\\uA71F\\uA722-\\uA788\\uA78B\\uA78C\\uA7FB-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA840-\\uA873\\uA882-\\uA8B3\\uA90A-\\uA925\\uA930-\\uA946\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAC00\\uD7A3\\uF900-\\uFA2D\\uFA30-\\uFA6A\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC]"),
                    non_spacing_mark: new RegExp("[\\u0300-\\u036F\\u0483-\\u0487\\u0591-\\u05BD\\u05BF\\u05C1\\u05C2\\u05C4\\u05C5\\u05C7\\u0610-\\u061A\\u064B-\\u065E\\u0670\\u06D6-\\u06DC\\u06DF-\\u06E4\\u06E7\\u06E8\\u06EA-\\u06ED\\u0711\\u0730-\\u074A\\u07A6-\\u07B0\\u07EB-\\u07F3\\u0816-\\u0819\\u081B-\\u0823\\u0825-\\u0827\\u0829-\\u082D\\u0900-\\u0902\\u093C\\u0941-\\u0948\\u094D\\u0951-\\u0955\\u0962\\u0963\\u0981\\u09BC\\u09C1-\\u09C4\\u09CD\\u09E2\\u09E3\\u0A01\\u0A02\\u0A3C\\u0A41\\u0A42\\u0A47\\u0A48\\u0A4B-\\u0A4D\\u0A51\\u0A70\\u0A71\\u0A75\\u0A81\\u0A82\\u0ABC\\u0AC1-\\u0AC5\\u0AC7\\u0AC8\\u0ACD\\u0AE2\\u0AE3\\u0B01\\u0B3C\\u0B3F\\u0B41-\\u0B44\\u0B4D\\u0B56\\u0B62\\u0B63\\u0B82\\u0BC0\\u0BCD\\u0C3E-\\u0C40\\u0C46-\\u0C48\\u0C4A-\\u0C4D\\u0C55\\u0C56\\u0C62\\u0C63\\u0CBC\\u0CBF\\u0CC6\\u0CCC\\u0CCD\\u0CE2\\u0CE3\\u0D41-\\u0D44\\u0D4D\\u0D62\\u0D63\\u0DCA\\u0DD2-\\u0DD4\\u0DD6\\u0E31\\u0E34-\\u0E3A\\u0E47-\\u0E4E\\u0EB1\\u0EB4-\\u0EB9\\u0EBB\\u0EBC\\u0EC8-\\u0ECD\\u0F18\\u0F19\\u0F35\\u0F37\\u0F39\\u0F71-\\u0F7E\\u0F80-\\u0F84\\u0F86\\u0F87\\u0F90-\\u0F97\\u0F99-\\u0FBC\\u0FC6\\u102D-\\u1030\\u1032-\\u1037\\u1039\\u103A\\u103D\\u103E\\u1058\\u1059\\u105E-\\u1060\\u1071-\\u1074\\u1082\\u1085\\u1086\\u108D\\u109D\\u135F\\u1712-\\u1714\\u1732-\\u1734\\u1752\\u1753\\u1772\\u1773\\u17B7-\\u17BD\\u17C6\\u17C9-\\u17D3\\u17DD\\u180B-\\u180D\\u18A9\\u1920-\\u1922\\u1927\\u1928\\u1932\\u1939-\\u193B\\u1A17\\u1A18\\u1A56\\u1A58-\\u1A5E\\u1A60\\u1A62\\u1A65-\\u1A6C\\u1A73-\\u1A7C\\u1A7F\\u1B00-\\u1B03\\u1B34\\u1B36-\\u1B3A\\u1B3C\\u1B42\\u1B6B-\\u1B73\\u1B80\\u1B81\\u1BA2-\\u1BA5\\u1BA8\\u1BA9\\u1C2C-\\u1C33\\u1C36\\u1C37\\u1CD0-\\u1CD2\\u1CD4-\\u1CE0\\u1CE2-\\u1CE8\\u1CED\\u1DC0-\\u1DE6\\u1DFD-\\u1DFF\\u20D0-\\u20DC\\u20E1\\u20E5-\\u20F0\\u2CEF-\\u2CF1\\u2DE0-\\u2DFF\\u302A-\\u302F\\u3099\\u309A\\uA66F\\uA67C\\uA67D\\uA6F0\\uA6F1\\uA802\\uA806\\uA80B\\uA825\\uA826\\uA8C4\\uA8E0-\\uA8F1\\uA926-\\uA92D\\uA947-\\uA951\\uA980-\\uA982\\uA9B3\\uA9B6-\\uA9B9\\uA9BC\\uAA29-\\uAA2E\\uAA31\\uAA32\\uAA35\\uAA36\\uAA43\\uAA4C\\uAAB0\\uAAB2-\\uAAB4\\uAAB7\\uAAB8\\uAABE\\uAABF\\uAAC1\\uABE5\\uABE8\\uABED\\uFB1E\\uFE00-\\uFE0F\\uFE20-\\uFE26]"),
                    space_combining_mark: new RegExp("[\\u0903\\u093E-\\u0940\\u0949-\\u094C\\u094E\\u0982\\u0983\\u09BE-\\u09C0\\u09C7\\u09C8\\u09CB\\u09CC\\u09D7\\u0A03\\u0A3E-\\u0A40\\u0A83\\u0ABE-\\u0AC0\\u0AC9\\u0ACB\\u0ACC\\u0B02\\u0B03\\u0B3E\\u0B40\\u0B47\\u0B48\\u0B4B\\u0B4C\\u0B57\\u0BBE\\u0BBF\\u0BC1\\u0BC2\\u0BC6-\\u0BC8\\u0BCA-\\u0BCC\\u0BD7\\u0C01-\\u0C03\\u0C41-\\u0C44\\u0C82\\u0C83\\u0CBE\\u0CC0-\\u0CC4\\u0CC7\\u0CC8\\u0CCA\\u0CCB\\u0CD5\\u0CD6\\u0D02\\u0D03\\u0D3E-\\u0D40\\u0D46-\\u0D48\\u0D4A-\\u0D4C\\u0D57\\u0D82\\u0D83\\u0DCF-\\u0DD1\\u0DD8-\\u0DDF\\u0DF2\\u0DF3\\u0F3E\\u0F3F\\u0F7F\\u102B\\u102C\\u1031\\u1038\\u103B\\u103C\\u1056\\u1057\\u1062-\\u1064\\u1067-\\u106D\\u1083\\u1084\\u1087-\\u108C\\u108F\\u109A-\\u109C\\u17B6\\u17BE-\\u17C5\\u17C7\\u17C8\\u1923-\\u1926\\u1929-\\u192B\\u1930\\u1931\\u1933-\\u1938\\u19B0-\\u19C0\\u19C8\\u19C9\\u1A19-\\u1A1B\\u1A55\\u1A57\\u1A61\\u1A63\\u1A64\\u1A6D-\\u1A72\\u1B04\\u1B35\\u1B3B\\u1B3D-\\u1B41\\u1B43\\u1B44\\u1B82\\u1BA1\\u1BA6\\u1BA7\\u1BAA\\u1C24-\\u1C2B\\u1C34\\u1C35\\u1CE1\\u1CF2\\uA823\\uA824\\uA827\\uA880\\uA881\\uA8B4-\\uA8C3\\uA952\\uA953\\uA983\\uA9B4\\uA9B5\\uA9BA\\uA9BB\\uA9BD-\\uA9C0\\uAA2F\\uAA30\\uAA33\\uAA34\\uAA4D\\uAA7B\\uABE3\\uABE4\\uABE6\\uABE7\\uABE9\\uABEA\\uABEC]"),
                    connector_punctuation: new RegExp("[\\u005F\\u203F\\u2040\\u2054\\uFE33\\uFE34\\uFE4D-\\uFE4F\\uFF3F]")
                };
            Gc.prototype.toString = function () {
                return this.message + " (line: " + this.line + ", col: " + this.col + ", pos: " + this.pos + ")" + "\n\n" + this.stack
            }
                ;
            var Jc = {}
                , Lc = x(["typeof", "void", "delete", "--", "++", "!", "~", "-", "+"])
                , Mc = x(["--", "++"])
                , Nc = x(["=", "+=", "-=", "/=", "*=", "%=", ">>=", "<<=", ">>>=", "|=", "^=", "&="])
                , Oc = function (a, b) {
                    for (var c = 0; c < a.length; ++c)
                        for (var d = a[c], e = 0; e < d.length; ++e)
                            b[d[e]] = c + 1;
                    return b
                }([["||"], ["&&"], ["|"], ["^"], ["&"], ["==", "===", "!=", "!=="], ["<", ">", "<=", ">=", "in", "instanceof"], [">>", "<<", ">>>"], ["+", "-"], ["*", "/", "%"]], {})
                , Pc = g(["for", "do", "while", "switch"])
                , Qc = g(["atom", "num", "string", "regexp", "name"]);
            Sc.prototype = new hc,
                function (a) {
                    function b(b, c) {
                        b.DEFMETHOD("transform", function (b, d) {
                            var e, f;
                            return b.push(this),
                                b.before && (e = b.before(this, c, d)),
                                e === a && (b.after ? (b.stack[b.stack.length - 1] = e = this.clone(),
                                    c(e, b),
                                    f = b.after(e, d),
                                    f !== a && (e = f)) : (e = this,
                                        c(e, b))),
                                b.pop(),
                                e
                        })
                    }
                    function c(a, b) {
                        return q(a, function (a) {
                            return a.transform(b, !0)
                        })
                    }
                    b(C, p),
                        b(M, function (a, b) {
                            a.label = a.label.transform(b),
                                a.body = a.body.transform(b)
                        }),
                        b(G, function (a, b) {
                            a.body = a.body.transform(b)
                        }),
                        b(I, function (a, b) {
                            a.body = c(a.body, b)
                        }),
                        b(O, function (a, b) {
                            a.condition = a.condition.transform(b),
                                a.body = a.body.transform(b)
                        }),
                        b(R, function (a, b) {
                            a.init && (a.init = a.init.transform(b)),
                                a.condition && (a.condition = a.condition.transform(b)),
                                a.step && (a.step = a.step.transform(b)),
                                a.body = a.body.transform(b)
                        }),
                        b(S, function (a, b) {
                            a.init = a.init.transform(b),
                                a.object = a.object.transform(b),
                                a.body = a.body.transform(b)
                        }),
                        b(T, function (a, b) {
                            a.expression = a.expression.transform(b),
                                a.body = a.body.transform(b)
                        }),
                        b(_, function (a, b) {
                            a.value && (a.value = a.value.transform(b))
                        }),
                        b(cb, function (a, b) {
                            a.label && (a.label = a.label.transform(b))
                        }),
                        b(fb, function (a, b) {
                            a.condition = a.condition.transform(b),
                                a.body = a.body.transform(b),
                                a.alternative && (a.alternative = a.alternative.transform(b))
                        }),
                        b(gb, function (a, b) {
                            a.expression = a.expression.transform(b),
                                a.body = c(a.body, b)
                        }),
                        b(jb, function (a, b) {
                            a.expression = a.expression.transform(b),
                                a.body = c(a.body, b)
                        }),
                        b(kb, function (a, b) {
                            a.body = c(a.body, b),
                                a.bcatch && (a.bcatch = a.bcatch.transform(b)),
                                a.bfinally && (a.bfinally = a.bfinally.transform(b))
                        }),
                        b(lb, function (a, b) {
                            a.argname = a.argname.transform(b),
                                a.body = c(a.body, b)
                        }),
                        b(nb, function (a, b) {
                            a.definitions = c(a.definitions, b)
                        }),
                        b(qb, function (a, b) {
                            a.name = a.name.transform(b),
                                a.value && (a.value = a.value.transform(b))
                        }),
                        b(W, function (a, b) {
                            a.name && (a.name = a.name.transform(b)),
                                a.argnames = c(a.argnames, b),
                                a.body = c(a.body, b)
                        }),
                        b(rb, function (a, b) {
                            a.expression = a.expression.transform(b),
                                a.args = c(a.args, b)
                        }),
                        b(tb, function (a, b) {
                            a.car = a.car.transform(b),
                                a.cdr = a.cdr.transform(b)
                        }),
                        b(vb, function (a, b) {
                            a.expression = a.expression.transform(b)
                        }),
                        b(wb, function (a, b) {
                            a.expression = a.expression.transform(b),
                                a.property = a.property.transform(b)
                        }),
                        b(xb, function (a, b) {
                            a.expression = a.expression.transform(b)
                        }),
                        b(Ab, function (a, b) {
                            a.left = a.left.transform(b),
                                a.right = a.right.transform(b)
                        }),
                        b(Bb, function (a, b) {
                            a.condition = a.condition.transform(b),
                                a.consequent = a.consequent.transform(b),
                                a.alternative = a.alternative.transform(b)
                        }),
                        b(Db, function (a, b) {
                            a.elements = c(a.elements, b)
                        }),
                        b(Eb, function (a, b) {
                            a.properties = c(a.properties, b)
                        }),
                        b(Fb, function (a, b) {
                            a.value = a.value.transform(b)
                        })
                }(),
                Tc.prototype = {
                    unmangleable: function (a) {
                        return this.global && !(a && a.toplevel) || this.undeclared || !(a && a.eval) && (this.scope.uses_eval || this.scope.uses_with)
                    },
                    mangle: function (a) {
                        if (!this.mangled_name && !this.unmangleable(a)) {
                            var b = this.scope;
                            !a.screw_ie8 && this.orig[0] instanceof Qb && (b = b.parent_scope),
                                this.mangled_name = b.next_mangled(a, this)
                        }
                    }
                },
                V.DEFMETHOD("figure_out_scope", function (a) {
                    a = n(a, {
                        screw_ie8: !1
                    });
                    var b = this
                        , c = b.parent_scope = null
                        , d = null
                        , e = 0
                        , f = new hc(function (b, g) {
                            if (a.screw_ie8 && b instanceof lb) {
                                var h = c;
                                return c = new U(b),
                                    c.init_scope_vars(e),
                                    c.parent_scope = h,
                                    g(),
                                    c = h,
                                    !0
                            }
                            if (b instanceof U) {
                                b.init_scope_vars(e);
                                var h = b.parent_scope = c
                                    , i = d;
                                return d = c = b,
                                    ++e,
                                    g(),
                                    --e,
                                    c = h,
                                    d = i,
                                    !0
                            }
                            if (b instanceof F)
                                return b.scope = c,
                                    r(c.directives, b.value),
                                    !0;
                            if (b instanceof T)
                                for (var j = c; j; j = j.parent_scope)
                                    j.uses_with = !0;
                            else if (b instanceof Jb && (b.scope = c),
                                b instanceof Qb)
                                d.def_function(b);
                            else if (b instanceof Pb)
                                (b.scope = d.parent_scope).def_function(b);
                            else if (b instanceof Mb || b instanceof Nb) {
                                var k = d.def_variable(b);
                                k.constant = b instanceof Nb,
                                    k.init = f.parent().value
                            } else
                                b instanceof Rb && (a.screw_ie8 ? c : d).def_variable(b)
                        }
                        );
                    b.walk(f);
                    var g = null
                        , h = b.globals = new z
                        , f = new hc(function (a, c) {
                            if (a instanceof W) {
                                var d = g;
                                return g = a,
                                    c(),
                                    g = d,
                                    !0
                            }
                            if (a instanceof Tb) {
                                var e = a.name
                                    , i = a.scope.find_variable(e);
                                if (i)
                                    a.thedef = i;
                                else {
                                    var j;
                                    if (h.has(e) ? j = h.get(e) : (j = new Tc(b, h.size(), a),
                                        j.undeclared = !0,
                                        j.global = !0,
                                        h.set(e, j)),
                                        a.thedef = j,
                                        "eval" == e && f.parent() instanceof rb)
                                        for (var k = a.scope; k && !k.uses_eval; k = k.parent_scope)
                                            k.uses_eval = !0;
                                    g && "arguments" == e && (g.uses_arguments = !0)
                                }
                                return a.reference(),
                                    !0
                            }
                        }
                        );
                    b.walk(f)
                }),
                U.DEFMETHOD("init_scope_vars", function (a) {
                    this.directives = [],
                        this.variables = new z,
                        this.functions = new z,
                        this.uses_with = !1,
                        this.uses_eval = !1,
                        this.parent_scope = null,
                        this.enclosed = [],
                        this.cname = -1,
                        this.nesting = a
                }),
                U.DEFMETHOD("strict", function () {
                    return this.has_directive("use strict")
                }),
                W.DEFMETHOD("init_scope_vars", function () {
                    U.prototype.init_scope_vars.apply(this, arguments),
                        this.uses_arguments = !1
                }),
                Tb.DEFMETHOD("reference", function () {
                    var a = this.definition();
                    a.references.push(this);
                    for (var b = this.scope; b && (r(b.enclosed, a),
                        b !== a.scope);)
                        b = b.parent_scope;
                    this.frame = this.scope.nesting - a.scope.nesting
                }),
                U.DEFMETHOD("find_variable", function (a) {
                    return a instanceof Jb && (a = a.name),
                        this.variables.get(a) || this.parent_scope && this.parent_scope.find_variable(a)
                }),
                U.DEFMETHOD("has_directive", function (a) {
                    return this.parent_scope && this.parent_scope.has_directive(a) || (this.directives.indexOf(a) >= 0 ? this : null)
                }),
                U.DEFMETHOD("def_function", function (a) {
                    this.functions.set(a.name, this.def_variable(a))
                }),
                U.DEFMETHOD("def_variable", function (a) {
                    var b;
                    return this.variables.has(a.name) ? (b = this.variables.get(a.name),
                        b.orig.push(a)) : (b = new Tc(this, this.variables.size(), a),
                            this.variables.set(a.name, b),
                            b.global = !this.parent_scope),
                        a.thedef = b
                }),
                U.DEFMETHOD("next_mangled", function (a) {
                    var b = this.enclosed;
                    a: for (; ;) {
                        var c = Uc(++this.cname);
                        if (Bc(c) && !(a.except.indexOf(c) >= 0)) {
                            for (var d = b.length; --d >= 0;) {
                                var e = b[d]
                                    , f = e.mangled_name || e.unmangleable(a) && e.name;
                                if (c == f)
                                    continue a
                            }
                            return c
                        }
                    }
                }),
                Y.DEFMETHOD("next_mangled", function (a, b) {
                    for (var c = b.orig[0] instanceof Ob && this.name && this.name.definition(); ;) {
                        var d = W.prototype.next_mangled.call(this, a, b);
                        if (!c || c.mangled_name != d)
                            return d
                    }
                }),
                U.DEFMETHOD("references", function (a) {
                    return a instanceof Jb && (a = a.definition()),
                        this.enclosed.indexOf(a) < 0 ? null : a
                }),
                Jb.DEFMETHOD("unmangleable", function (a) {
                    return this.definition().unmangleable(a)
                }),
                Kb.DEFMETHOD("unmangleable", function () {
                    return !0
                }),
                Sb.DEFMETHOD("unmangleable", function () {
                    return !1
                }),
                Jb.DEFMETHOD("unreferenced", function () {
                    return 0 == this.definition().references.length && !(this.scope.uses_eval || this.scope.uses_with)
                }),
                Jb.DEFMETHOD("undeclared", function () {
                    return this.definition().undeclared
                }),
                Ub.DEFMETHOD("undeclared", function () {
                    return !1
                }),
                Sb.DEFMETHOD("undeclared", function () {
                    return !1
                }),
                Jb.DEFMETHOD("definition", function () {
                    return this.thedef
                }),
                Jb.DEFMETHOD("global", function () {
                    return this.definition().global
                }),
                V.DEFMETHOD("_default_mangler_options", function (a) {
                    return n(a, {
                        except: [],
                        eval: !1,
                        sort: !1,
                        toplevel: !1,
                        screw_ie8: !1
                    })
                }),
                V.DEFMETHOD("mangle_names", function (a) {
                    a = this._default_mangler_options(a);
                    var b = -1
                        , c = []
                        , d = new hc(function (e, f) {
                            if (e instanceof M) {
                                var g = b;
                                return f(),
                                    b = g,
                                    !0
                            }
                            if (e instanceof U) {
                                var i = (d.parent(),
                                    []);
                                return e.variables.each(function (b) {
                                    a.except.indexOf(b.name) < 0 && i.push(b)
                                }),
                                    a.sort && i.sort(function (a, b) {
                                        return b.references.length - a.references.length
                                    }),
                                    c.push.apply(c, i),
                                    void 0
                            }
                            if (e instanceof Sb) {
                                var j;
                                do
                                    j = Uc(++b);
                                while (!Bc(j)); return e.mangled_name = j,
                                    !0
                            }
                        }
                        );
                    this.walk(d),
                        c.forEach(function (b) {
                            b.mangle(a)
                        })
                }),
                V.DEFMETHOD("compute_char_frequency", function (a) {
                    a = this._default_mangler_options(a);
                    var b = new hc(function (b) {
                        b instanceof Wb ? Uc.consider(b.print_to_string()) : b instanceof ab ? Uc.consider("return") : b instanceof bb ? Uc.consider("throw") : b instanceof eb ? Uc.consider("continue") : b instanceof db ? Uc.consider("break") : b instanceof E ? Uc.consider("debugger") : b instanceof F ? Uc.consider(b.value) : b instanceof Q ? Uc.consider("while") : b instanceof P ? Uc.consider("do while") : b instanceof fb ? (Uc.consider("if"),
                            b.alternative && Uc.consider("else")) : b instanceof ob ? Uc.consider("var") : b instanceof pb ? Uc.consider("const") : b instanceof W ? Uc.consider("function") : b instanceof R ? Uc.consider("for") : b instanceof S ? Uc.consider("for in") : b instanceof gb ? Uc.consider("switch") : b instanceof jb ? Uc.consider("case") : b instanceof ib ? Uc.consider("default") : b instanceof T ? Uc.consider("with") : b instanceof Hb ? Uc.consider("set" + b.key) : b instanceof Ib ? Uc.consider("get" + b.key) : b instanceof Gb ? Uc.consider(b.key) : b instanceof sb ? Uc.consider("new") : b instanceof Vb ? Uc.consider("this") : b instanceof kb ? Uc.consider("try") : b instanceof lb ? Uc.consider("catch") : b instanceof mb ? Uc.consider("finally") : b instanceof Jb && b.unmangleable(a) ? Uc.consider(b.name) : b instanceof xb || b instanceof Ab ? Uc.consider(b.operator) : b instanceof vb && Uc.consider(b.property)
                    }
                    );
                    this.walk(b),
                        Uc.sort()
                });
            var Uc = function () {
                function d() {
                    c = Object.create(null),
                        b = a.split("").map(function (a) {
                            return a.charCodeAt(0)
                        }),
                        b.forEach(function (a) {
                            c[a] = 0
                        })
                }
                function e(a) {
                    var c = ""
                        , d = 54;
                    do
                        c += String.fromCharCode(b[a % d]),
                            a = Math.floor(a / d),
                            d = 64;
                    while (a > 0); return c
                }
                var b, c, a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_0123456789";
                return e.consider = function (a) {
                    for (var b = a.length; --b >= 0;) {
                        var d = a.charCodeAt(b);
                        d in c && ++c[d]
                    }
                }
                    ,
                    e.sort = function () {
                        b = u(b, function (a, b) {
                            return xc(a) && !xc(b) ? 1 : xc(b) && !xc(a) ? -1 : c[b] - c[a]
                        })
                    }
                    ,
                    e.reset = d,
                    d(),
                    e.get = function () {
                        return b
                    }
                    ,
                    e.freq = function () {
                        return c
                    }
                    ,
                    e
            }();
            V.DEFMETHOD("scope_warnings", function (a) {
                a = n(a, {
                    undeclared: !1,
                    unreferenced: !0,
                    assign_to_global: !0,
                    func_arguments: !0,
                    nested_defuns: !0,
                    eval: !0
                });
                var b = new hc(function (c) {
                    if (a.undeclared && c instanceof Tb && c.undeclared() && C.warn("Undeclared symbol: {name} [{file}:{line},{col}]", {
                        name: c.name,
                        file: c.start.file,
                        line: c.start.line,
                        col: c.start.col
                    }),
                        a.assign_to_global) {
                        var d = null;
                        c instanceof Cb && c.left instanceof Tb ? d = c.left : c instanceof S && c.init instanceof Tb && (d = c.init),
                            d && (d.undeclared() || d.global() && d.scope !== d.definition().scope) && C.warn("{msg}: {name} [{file}:{line},{col}]", {
                                msg: d.undeclared() ? "Accidental global?" : "Assignment to global",
                                name: d.name,
                                file: d.start.file,
                                line: d.start.line,
                                col: d.start.col
                            })
                    }
                    a.eval && c instanceof Tb && c.undeclared() && "eval" == c.name && C.warn("Eval is used [{file}:{line},{col}]", c.start),
                        a.unreferenced && (c instanceof Lb || c instanceof Sb) && c.unreferenced() && C.warn("{type} {name} is declared but not referenced [{file}:{line},{col}]", {
                            type: c instanceof Sb ? "Label" : "Symbol",
                            name: c.name,
                            file: c.start.file,
                            line: c.start.line,
                            col: c.start.col
                        }),
                        a.func_arguments && c instanceof W && c.uses_arguments && C.warn("arguments used in function {name} [{file}:{line},{col}]", {
                            name: c.name ? c.name.name : "anonymous",
                            file: c.start.file,
                            line: c.start.line,
                            col: c.start.col
                        }),
                        a.nested_defuns && c instanceof Z && !(b.parent() instanceof U) && C.warn('Function {name} declared in nested statement "{type}" [{file}:{line},{col}]', {
                            name: c.name.name,
                            type: b.parent().TYPE,
                            file: c.start.file,
                            line: c.start.line,
                            col: c.start.col
                        })
                }
                );
                this.walk(b)
            }),
                function () {
                    function a(a, b) {
                        a.DEFMETHOD("_codegen", b)
                    }
                    function b(a, b) {
                        a.DEFMETHOD("needs_parens", b)
                    }
                    function c(a) {
                        var b = a.parent();
                        return b instanceof xb ? !0 : b instanceof Ab && !(b instanceof Cb) ? !0 : b instanceof rb && b.expression === this ? !0 : b instanceof Bb && b.condition === this ? !0 : b instanceof ub && b.expression === this ? !0 : void 0
                    }
                    function d(a, b, c) {
                        var d = a.length - 1;
                        a.forEach(function (a, e) {
                            a instanceof K || (c.indent(),
                                a.print(c),
                                e == d && b || (c.newline(),
                                    b && c.newline()))
                        })
                    }
                    function e(a, b) {
                        a.length > 0 ? b.with_block(function () {
                            d(a, !1, b)
                        }) : b.print("{}")
                    }
                    function f(a, b) {
                        if (b.option("bracketize"))
                            return n(a.body, b),
                                void 0;
                        if (!a.body)
                            return b.force_semicolon();
                        if (a.body instanceof P && !b.option("screw_ie8"))
                            return n(a.body, b),
                                void 0;
                        for (var c = a.body; ;)
                            if (c instanceof fb) {
                                if (!c.alternative)
                                    return n(a.body, b),
                                        void 0;
                                c = c.alternative
                            } else {
                                if (!(c instanceof L))
                                    break;
                                c = c.body
                            }
                        i(a.body, b)
                    }
                    function g(a, b, c) {
                        if (c)
                            try {
                                a.walk(new hc(function (a) {
                                    if (a instanceof Ab && "in" == a.operator)
                                        throw b
                                }
                                )),
                                    a.print(b)
                            } catch (d) {
                                if (d !== b)
                                    throw d;
                                a.print(b, !0)
                            }
                        else
                            a.print(b)
                    }
                    function h(a) {
                        return [92, 47, 46, 43, 42, 63, 40, 41, 91, 93, 123, 125, 36, 94, 58, 124, 33, 10, 13, 0, 65279, 8232, 8233].indexOf(a) < 0
                    }
                    function i(a, b) {
                        b.option("bracketize") ? !a || a instanceof K ? b.print("{}") : a instanceof J ? a.print(b) : b.with_block(function () {
                            b.indent(),
                                a.print(b),
                                b.newline()
                        }) : !a || a instanceof K ? b.force_semicolon() : a.print(b)
                    }
                    function j(a) {
                        for (var b = a.stack(), c = b.length, d = b[--c], e = b[--c]; c > 0;) {
                            if (e instanceof D && e.body === d)
                                return !0;
                            if (!(e instanceof tb && e.car === d || e instanceof rb && e.expression === d && !(e instanceof sb) || e instanceof vb && e.expression === d || e instanceof wb && e.expression === d || e instanceof Bb && e.condition === d || e instanceof Ab && e.left === d || e instanceof zb && e.expression === d))
                                return !1;
                            d = e,
                                e = b[--c]
                        }
                    }
                    function k(a, b) {
                        return 0 == a.args.length && !b.option("beautify")
                    }
                    function l(a) {
                        for (var b = a[0], c = b.length, d = 1; d < a.length; ++d)
                            a[d].length < c && (b = a[d],
                                c = b.length);
                        return b
                    }
                    function m(a) {
                        var d, b = a.toString(10), c = [b.replace(/^0\./, ".").replace("e+", "e")];
                        return Math.floor(a) === a ? (a >= 0 ? c.push("0x" + a.toString(16).toLowerCase(), "0" + a.toString(8)) : c.push("-0x" + (-a).toString(16).toLowerCase(), "-0" + (-a).toString(8)),
                            (d = /^(.*?)(0+)$/.exec(a)) && c.push(d[1] + "e" + d[2].length)) : (d = /^0?\.(0+)(.*)$/.exec(a)) && c.push(d[2] + "e-" + (d[1].length + d[2].length), b.substr(b.indexOf("."))),
                            l(c)
                    }
                    function n(a, b) {
                        return a instanceof J ? (a.print(b),
                            void 0) : (b.with_block(function () {
                                b.indent(),
                                    a.print(b),
                                    b.newline()
                            }),
                                void 0)
                    }
                    function o(a, b) {
                        a.DEFMETHOD("add_source_map", function (a) {
                            b(this, a)
                        })
                    }
                    function q(a, b) {
                        b.add_mapping(a.start)
                    }
                    C.DEFMETHOD("print", function (a, b) {
                        function e() {
                            c.add_comments(a),
                                c.add_source_map(a),
                                d(c, a)
                        }
                        var c = this
                            , d = c._codegen;
                        a.push_node(c),
                            b || c.needs_parens(a) ? a.with_parens(e) : e(),
                            a.pop_node()
                    }),
                        C.DEFMETHOD("print_to_string", function (a) {
                            var b = Vc(a);
                            return this.print(b),
                                b.get()
                        }),
                        C.DEFMETHOD("add_comments", function (a) {
                            var b = a.option("comments")
                                , c = this;
                            if (b) {
                                var d = c.start;
                                if (d && !d._comments_dumped) {
                                    d._comments_dumped = !0;
                                    var e = d.comments_before || [];
                                    c instanceof _ && c.value && c.value.walk(new hc(function (a) {
                                        return a.start && a.start.comments_before && (e = e.concat(a.start.comments_before),
                                            a.start.comments_before = []),
                                            a instanceof Y || a instanceof Db || a instanceof Eb ? !0 : void 0
                                    }
                                    )),
                                        b.test ? e = e.filter(function (a) {
                                            return b.test(a.value)
                                        }) : "function" == typeof b && (e = e.filter(function (a) {
                                            return b(c, a)
                                        })),
                                        e.forEach(function (b) {
                                            /comment[134]/.test(b.type) ? (a.print("//" + b.value + "\n"),
                                                a.indent()) : "comment2" == b.type && (a.print("/*" + b.value + "*/"),
                                                    d.nlb ? (a.print("\n"),
                                                        a.indent()) : a.space())
                                        })
                                }
                            }
                        }),
                        b(C, function () {
                            return !1
                        }),
                        b(Y, function (a) {
                            return j(a)
                        }),
                        b(Eb, function (a) {
                            return j(a)
                        }),
                        b(xb, function (a) {
                            var b = a.parent();
                            return b instanceof ub && b.expression === this
                        }),
                        b(tb, function (a) {
                            var b = a.parent();
                            return b instanceof rb || b instanceof xb || b instanceof Ab || b instanceof qb || b instanceof ub || b instanceof Db || b instanceof Fb || b instanceof Bb
                        }),
                        b(Ab, function (a) {
                            var b = a.parent();
                            if (b instanceof rb && b.expression === this)
                                return !0;
                            if (b instanceof xb)
                                return !0;
                            if (b instanceof ub && b.expression === this)
                                return !0;
                            if (b instanceof Ab) {
                                var c = b.operator
                                    , d = Oc[c]
                                    , e = this.operator
                                    , f = Oc[e];
                                if (d > f || d == f && this === b.right)
                                    return !0
                            }
                        }),
                        b(ub, function (a) {
                            var b = a.parent();
                            if (b instanceof sb && b.expression === this)
                                try {
                                    this.walk(new hc(function (a) {
                                        if (a instanceof rb)
                                            throw b
                                    }
                                    ))
                                } catch (c) {
                                    if (c !== b)
                                        throw c;
                                    return !0
                                }
                        }),
                        b(rb, function (a) {
                            var c, b = a.parent();
                            return b instanceof sb && b.expression === this ? !0 : this.expression instanceof Y && b instanceof ub && b.expression === this && (c = a.parent(1)) instanceof Cb && c.left === b
                        }),
                        b(sb, function (a) {
                            var b = a.parent();
                            return k(this, a) && (b instanceof ub || b instanceof rb && b.expression === this) ? !0 : void 0
                        }),
                        b(Yb, function (a) {
                            var b = a.parent();
                            return this.getValue() < 0 && b instanceof ub && b.expression === this ? !0 : void 0
                        }),
                        b(ac, function (a) {
                            var b = a.parent();
                            return b instanceof ub && b.expression === this ? !0 : void 0
                        }),
                        b(Cb, c),
                        b(Bb, c),
                        a(F, function (a, b) {
                            b.print_string(a.value),
                                b.semicolon()
                        }),
                        a(E, function (a, b) {
                            b.print("debugger"),
                                b.semicolon()
                        }),
                        L.DEFMETHOD("_do_print_body", function (a) {
                            i(this.body, a)
                        }),
                        a(D, function (a, b) {
                            a.body.print(b),
                                b.semicolon()
                        }),
                        a(V, function (a, b) {
                            d(a.body, !0, b),
                                b.print("")
                        }),
                        a(M, function (a, b) {
                            a.label.print(b),
                                b.colon(),
                                a.body.print(b)
                        }),
                        a(G, function (a, b) {
                            a.body.print(b),
                                b.semicolon()
                        }),
                        a(J, function (a, b) {
                            e(a.body, b)
                        }),
                        a(K, function (a, b) {
                            b.semicolon()
                        }),
                        a(P, function (a, b) {
                            b.print("do"),
                                b.space(),
                                a._do_print_body(b),
                                b.space(),
                                b.print("while"),
                                b.space(),
                                b.with_parens(function () {
                                    a.condition.print(b)
                                }),
                                b.semicolon()
                        }),
                        a(Q, function (a, b) {
                            b.print("while"),
                                b.space(),
                                b.with_parens(function () {
                                    a.condition.print(b)
                                }),
                                b.space(),
                                a._do_print_body(b)
                        }),
                        a(R, function (a, b) {
                            b.print("for"),
                                b.space(),
                                b.with_parens(function () {
                                    a.init ? (a.init instanceof nb ? a.init.print(b) : g(a.init, b, !0),
                                        b.print(";"),
                                        b.space()) : b.print(";"),
                                        a.condition ? (a.condition.print(b),
                                            b.print(";"),
                                            b.space()) : b.print(";"),
                                        a.step && a.step.print(b)
                                }),
                                b.space(),
                                a._do_print_body(b)
                        }),
                        a(S, function (a, b) {
                            b.print("for"),
                                b.space(),
                                b.with_parens(function () {
                                    a.init.print(b),
                                        b.space(),
                                        b.print("in"),
                                        b.space(),
                                        a.object.print(b)
                                }),
                                b.space(),
                                a._do_print_body(b)
                        }),
                        a(T, function (a, b) {
                            b.print("with"),
                                b.space(),
                                b.with_parens(function () {
                                    a.expression.print(b)
                                }),
                                b.space(),
                                a._do_print_body(b)
                        }),
                        W.DEFMETHOD("_do_print", function (a, b) {
                            var c = this;
                            b || a.print("function"),
                                c.name && (a.space(),
                                    c.name.print(a)),
                                a.with_parens(function () {
                                    c.argnames.forEach(function (b, c) {
                                        c && a.comma(),
                                            b.print(a)
                                    })
                                }),
                                a.space(),
                                e(c.body, a)
                        }),
                        a(W, function (a, b) {
                            a._do_print(b)
                        }),
                        _.DEFMETHOD("_do_print", function (a, b) {
                            a.print(b),
                                this.value && (a.space(),
                                    this.value.print(a)),
                                a.semicolon()
                        }),
                        a(ab, function (a, b) {
                            a._do_print(b, "return")
                        }),
                        a(bb, function (a, b) {
                            a._do_print(b, "throw")
                        }),
                        cb.DEFMETHOD("_do_print", function (a, b) {
                            a.print(b),
                                this.label && (a.space(),
                                    this.label.print(a)),
                                a.semicolon()
                        }),
                        a(db, function (a, b) {
                            a._do_print(b, "break")
                        }),
                        a(eb, function (a, b) {
                            a._do_print(b, "continue")
                        }),
                        a(fb, function (a, b) {
                            b.print("if"),
                                b.space(),
                                b.with_parens(function () {
                                    a.condition.print(b)
                                }),
                                b.space(),
                                a.alternative ? (f(a, b),
                                    b.space(),
                                    b.print("else"),
                                    b.space(),
                                    i(a.alternative, b)) : a._do_print_body(b)
                        }),
                        a(gb, function (a, b) {
                            b.print("switch"),
                                b.space(),
                                b.with_parens(function () {
                                    a.expression.print(b)
                                }),
                                b.space(),
                                a.body.length > 0 ? b.with_block(function () {
                                    a.body.forEach(function (a, c) {
                                        c && b.newline(),
                                            b.indent(!0),
                                            a.print(b)
                                    })
                                }) : b.print("{}")
                        }),
                        hb.DEFMETHOD("_do_print_body", function (a) {
                            this.body.length > 0 && (a.newline(),
                                this.body.forEach(function (b) {
                                    a.indent(),
                                        b.print(a),
                                        a.newline()
                                }))
                        }),
                        a(ib, function (a, b) {
                            b.print("default:"),
                                a._do_print_body(b)
                        }),
                        a(jb, function (a, b) {
                            b.print("case"),
                                b.space(),
                                a.expression.print(b),
                                b.print(":"),
                                a._do_print_body(b)
                        }),
                        a(kb, function (a, b) {
                            b.print("try"),
                                b.space(),
                                e(a.body, b),
                                a.bcatch && (b.space(),
                                    a.bcatch.print(b)),
                                a.bfinally && (b.space(),
                                    a.bfinally.print(b))
                        }),
                        a(lb, function (a, b) {
                            b.print("catch"),
                                b.space(),
                                b.with_parens(function () {
                                    a.argname.print(b)
                                }),
                                b.space(),
                                e(a.body, b)
                        }),
                        a(mb, function (a, b) {
                            b.print("finally"),
                                b.space(),
                                e(a.body, b)
                        }),
                        nb.DEFMETHOD("_do_print", function (a, b) {
                            a.print(b),
                                a.space(),
                                this.definitions.forEach(function (b, c) {
                                    c && a.comma(),
                                        b.print(a)
                                });
                            var c = a.parent()
                                , d = c instanceof R || c instanceof S
                                , e = d && c.init === this;
                            e || a.semicolon()
                        }),
                        a(ob, function (a, b) {
                            a._do_print(b, "var")
                        }),
                        a(pb, function (a, b) {
                            a._do_print(b, "const")
                        }),
                        a(qb, function (a, b) {
                            if (a.name.print(b),
                                a.value) {
                                b.space(),
                                    b.print("="),
                                    b.space();
                                var c = b.parent(1)
                                    , d = c instanceof R || c instanceof S;
                                g(a.value, b, d)
                            }
                        }),
                        a(rb, function (a, b) {
                            a.expression.print(b),
                                a instanceof sb && k(a, b) || b.with_parens(function () {
                                    a.args.forEach(function (a, c) {
                                        c && b.comma(),
                                            a.print(b)
                                    })
                                })
                        }),
                        a(sb, function (a, b) {
                            b.print("new"),
                                b.space(),
                                rb.prototype._codegen(a, b)
                        }),
                        tb.DEFMETHOD("_do_print", function (a) {
                            this.car.print(a),
                                this.cdr && (a.comma(),
                                    a.should_break() && (a.newline(),
                                        a.indent()),
                                    this.cdr.print(a))
                        }),
                        a(tb, function (a, b) {
                            a._do_print(b)
                        }),
                        a(vb, function (a, b) {
                            var c = a.expression;
                            c.print(b),
                                c instanceof Yb && c.getValue() >= 0 && (/[xa-f.]/i.test(b.last()) || b.print(".")),
                                b.print("."),
                                b.add_mapping(a.end),
                                b.print_name(a.property)
                        }),
                        a(wb, function (a, b) {
                            a.expression.print(b),
                                b.print("["),
                                a.property.print(b),
                                b.print("]")
                        }),
                        a(yb, function (a, b) {
                            var c = a.operator;
                            b.print(c),
                                /^[a-z]/i.test(c) && b.space(),
                                a.expression.print(b)
                        }),
                        a(zb, function (a, b) {
                            a.expression.print(b),
                                b.print(a.operator)
                        }),
                        a(Ab, function (a, b) {
                            a.left.print(b),
                                b.space(),
                                b.print(a.operator),
                                "<" == a.operator && a.right instanceof yb && "!" == a.right.operator && a.right.expression instanceof yb && "--" == a.right.expression.operator ? b.print(" ") : b.space(),
                                a.right.print(b)
                        }),
                        a(Bb, function (a, b) {
                            a.condition.print(b),
                                b.space(),
                                b.print("?"),
                                b.space(),
                                a.consequent.print(b),
                                b.space(),
                                b.colon(),
                                a.alternative.print(b)
                        }),
                        a(Db, function (a, b) {
                            b.with_square(function () {
                                var c = a.elements
                                    , d = c.length;
                                d > 0 && b.space(),
                                    c.forEach(function (a, c) {
                                        c && b.comma(),
                                            a.print(b),
                                            c === d - 1 && a instanceof cc && b.comma()
                                    }),
                                    d > 0 && b.space()
                            })
                        }),
                        a(Eb, function (a, b) {
                            a.properties.length > 0 ? b.with_block(function () {
                                a.properties.forEach(function (a, c) {
                                    c && (b.print(","),
                                        b.newline()),
                                        b.indent(),
                                        a.print(b)
                                }),
                                    b.newline()
                            }) : b.print("{}")
                        }),
                        a(Gb, function (a, b) {
                            var c = a.key;
                            b.option("quote_keys") ? b.print_string(c + "") : ("number" == typeof c || !b.option("beautify") && +c + "" == c) && parseFloat(c) >= 0 ? b.print(m(c)) : (kc(c) ? b.option("screw_ie8") : Ec(c)) ? b.print_name(c) : b.print_string(c),
                                b.colon(),
                                a.value.print(b)
                        }),
                        a(Hb, function (a, b) {
                            b.print("set"),
                                b.space(),
                                a.key.print(b),
                                a.value._do_print(b, !0)
                        }),
                        a(Ib, function (a, b) {
                            b.print("get"),
                                b.space(),
                                a.key.print(b),
                                a.value._do_print(b, !0)
                        }),
                        a(Jb, function (a, b) {
                            var c = a.definition();
                            b.print_name(c ? c.mangled_name || c.name : a.name)
                        }),
                        a(bc, function (a, b) {
                            b.print("void 0")
                        }),
                        a(cc, p),
                        a(dc, function (a, b) {
                            b.print("1/0")
                        }),
                        a(ac, function (a, b) {
                            b.print("0/0")
                        }),
                        a(Vb, function (a, b) {
                            b.print("this")
                        }),
                        a(Wb, function (a, b) {
                            b.print(a.getValue())
                        }),
                        a(Xb, function (a, b) {
                            b.print_string(a.getValue())
                        }),
                        a(Yb, function (a, b) {
                            b.print(m(a.getValue()))
                        }),
                        a(Zb, function (a, b) {
                            var c = a.getValue().toString();
                            b.option("ascii_only") ? c = b.to_ascii(c) : b.option("unescape_regexps") && (c = c.split("\\\\").map(function (a) {
                                return a.replace(/\\u[0-9a-fA-F]{4}|\\x[0-9a-fA-F]{2}/g, function (a) {
                                    var b = parseInt(a.substr(2), 16);
                                    return h(b) ? String.fromCharCode(b) : a
                                })
                            }).join("\\\\")),
                                b.print(c);
                            var d = b.parent();
                            d instanceof Ab && /^in/.test(d.operator) && d.left === a && b.print(" ")
                        }),
                        o(C, p),
                        o(F, q),
                        o(E, q),
                        o(Jb, q),
                        o($, q),
                        o(L, q),
                        o(M, p),
                        o(W, q),
                        o(gb, q),
                        o(hb, q),
                        o(J, q),
                        o(V, p),
                        o(sb, q),
                        o(kb, q),
                        o(lb, q),
                        o(mb, q),
                        o(nb, q),
                        o(Wb, q),
                        o(Fb, function (a, b) {
                            b.add_mapping(a.start, a.key)
                        })
                }(),
                Wc.prototype = new Sc,
                o(Wc.prototype, {
                    option: function (a) {
                        return this.options[a]
                    },
                    warn: function () {
                        this.options.warnings && C.warn.apply(C, arguments)
                    },
                    before: function (a, b) {
                        if (a._squeezed)
                            return a;
                        var d = !1;
                        return a instanceof U && (a = a.hoist_declarations(this),
                            d = !0),
                            b(a, this),
                            a = a.optimize(this),
                            d && a instanceof U && (a.drop_unused(this),
                                b(a, this)),
                            a._squeezed = !0,
                            a
                    }
                }),
                function () {
                    function a(a, b) {
                        a.DEFMETHOD("optimize", function (a) {
                            var c = this;
                            if (c._optimized)
                                return c;
                            var d = b(c, a);
                            return d._optimized = !0,
                                d === c ? d : d.transform(a)
                        })
                    }
                    function b(a, b, c) {
                        return c || (c = {}),
                            b && (c.start || (c.start = b.start),
                                c.end || (c.end = b.end)),
                            new a(c)
                    }
                    function c(a, c, d) {
                        if (c instanceof C)
                            return c.transform(a);
                        switch (typeof c) {
                            case "string":
                                return b(Xb, d, {
                                    value: c
                                }).optimize(a);
                            case "number":
                                return b(isNaN(c) ? ac : Yb, d, {
                                    value: c
                                }).optimize(a);
                            case "boolean":
                                return b(c ? gc : fc, d).optimize(a);
                            case "undefined":
                                return b(bc, d).optimize(a);
                            default:
                                if (null === c)
                                    return b(_b, d).optimize(a);
                                if (c instanceof RegExp)
                                    return b(Zb, d).optimize(a);
                                throw new Error(s("Can't handle constant of type: {type}", {
                                    type: typeof c
                                }))
                        }
                    }
                    function d(a) {
                        if (null === a)
                            return [];
                        if (a instanceof J)
                            return a.body;
                        if (a instanceof K)
                            return [];
                        if (a instanceof D)
                            return [a];
                        throw new Error("Can't convert thing to statement array")
                    }
                    function e(a) {
                        return null === a ? !0 : a instanceof K ? !0 : a instanceof J ? 0 == a.body.length : !1
                    }
                    function f(a) {
                        return a instanceof gb ? a : a instanceof R || a instanceof S || a instanceof O ? a.body instanceof J ? a.body : a : a
                    }
                    function g(a, c) {
                        function g(a) {
                            function d(a, c) {
                                return b(G, a, {
                                    body: b(Cb, a, {
                                        operator: "=",
                                        left: b(vb, c, {
                                            expression: b(Tb, c, c),
                                            property: "$inject"
                                        }),
                                        right: b(Db, a, {
                                            elements: a.argnames.map(function (a) {
                                                return b(Xb, a, {
                                                    value: a.name
                                                })
                                            })
                                        })
                                    })
                                })
                            }
                            return a.reduce(function (a, b) {
                                a.push(b);
                                var e = b.start
                                    , f = e.comments_before;
                                if (f && f.length > 0) {
                                    var g = f.pop();
                                    /@ngInject/.test(g.value) && (b instanceof Z ? a.push(d(b, b.name)) : b instanceof nb ? b.definitions.forEach(function (b) {
                                        b.value && b.value instanceof W && a.push(d(b.value, b.name))
                                    }) : c.warn("Unknown statement marked with @ngInject [{file}:{line},{col}]", e))
                                }
                                return a
                            }, [])
                        }
                        function i(a) {
                            var b = [];
                            return a.reduce(function (a, c) {
                                return c instanceof J ? (e = !0,
                                    a.push.apply(a, i(c.body))) : c instanceof K ? e = !0 : c instanceof F ? b.indexOf(c.value) < 0 ? (a.push(c),
                                        b.push(c.value)) : e = !0 : a.push(c),
                                    a
                            }, [])
                        }
                        function j(a, c) {
                            var g = c.self()
                                , h = g instanceof W
                                , i = [];
                            a: for (var j = a.length; --j >= 0;) {
                                var k = a[j];
                                switch (!0) {
                                    case h && k instanceof ab && !k.value && 0 == i.length:
                                        e = !0;
                                        continue a;
                                    case k instanceof fb:
                                        if (k.body instanceof ab) {
                                            if ((h && 0 == i.length || i[0] instanceof ab && !i[0].value) && !k.body.value && !k.alternative) {
                                                e = !0;
                                                var m = b(G, k.condition, {
                                                    body: k.condition
                                                });
                                                i.unshift(m);
                                                continue a
                                            }
                                            if (i[0] instanceof ab && k.body.value && i[0].value && !k.alternative) {
                                                e = !0,
                                                    k = k.clone(),
                                                    k.alternative = i[0],
                                                    i[0] = k.transform(c);
                                                continue a
                                            }
                                            if ((0 == i.length || i[0] instanceof ab) && k.body.value && !k.alternative && h) {
                                                e = !0,
                                                    k = k.clone(),
                                                    k.alternative = i[0] || b(ab, k, {
                                                        value: b(bc, k)
                                                    }),
                                                    i[0] = k.transform(c);
                                                continue a
                                            }
                                            if (!k.body.value && h) {
                                                e = !0,
                                                    k = k.clone(),
                                                    k.condition = k.condition.negate(c),
                                                    k.body = b(J, k, {
                                                        body: d(k.alternative).concat(i)
                                                    }),
                                                    k.alternative = null,
                                                    i = [k.transform(c)];
                                                continue a
                                            }
                                            if (1 == i.length && h && i[0] instanceof G && (!k.alternative || k.alternative instanceof G)) {
                                                e = !0,
                                                    i.push(b(ab, i[0], {
                                                        value: b(bc, i[0])
                                                    }).transform(c)),
                                                    i = d(k.alternative).concat(i),
                                                    i.unshift(k);
                                                continue a
                                            }
                                        }
                                        var n = l(k.body)
                                            , o = n instanceof cb ? c.loopcontrol_target(n.label) : null;
                                        if (n && (n instanceof ab && !n.value && h || n instanceof eb && g === f(o) || n instanceof db && o instanceof J && g === o)) {
                                            n.label && t(n.label.thedef.references, n),
                                                e = !0;
                                            var p = d(k.body).slice(0, -1);
                                            k = k.clone(),
                                                k.condition = k.condition.negate(c),
                                                k.body = b(J, k, {
                                                    body: i
                                                }),
                                                k.alternative = b(J, k, {
                                                    body: p
                                                }),
                                                i = [k.transform(c)];
                                            continue a
                                        }
                                        var n = l(k.alternative)
                                            , o = n instanceof cb ? c.loopcontrol_target(n.label) : null;
                                        if (n && (n instanceof ab && !n.value && h || n instanceof eb && g === f(o) || n instanceof db && o instanceof J && g === o)) {
                                            n.label && t(n.label.thedef.references, n),
                                                e = !0,
                                                k = k.clone(),
                                                k.body = b(J, k.body, {
                                                    body: d(k.body).concat(i)
                                                }),
                                                k.alternative = b(J, k.alternative, {
                                                    body: d(k.alternative).slice(0, -1)
                                                }),
                                                i = [k.transform(c)];
                                            continue a
                                        }
                                        i.unshift(k);
                                        break;
                                    default:
                                        i.unshift(k)
                                }
                            }
                            return i
                        }
                        function k(a, b) {
                            var c = !1
                                , d = a.length
                                , g = b.self();
                            return a = a.reduce(function (a, d) {
                                if (c)
                                    h(b, d, a);
                                else {
                                    if (d instanceof cb) {
                                        var e = b.loopcontrol_target(d.label);
                                        d instanceof db && e instanceof J && f(e) === g || d instanceof eb && f(e) === g ? d.label && t(d.label.thedef.references, d) : a.push(d)
                                    } else
                                        a.push(d);
                                    l(d) && (c = !0)
                                }
                                return a
                            }, []),
                                e = a.length != d,
                                a
                        }
                        function m(a, c) {
                            function g() {
                                d = tb.from_array(d),
                                    d && f.push(b(G, d, {
                                        body: d
                                    })),
                                    d = []
                            }
                            if (a.length < 2)
                                return a;
                            var d = []
                                , f = [];
                            return a.forEach(function (a) {
                                a instanceof G ? d.push(a.body) : (g(),
                                    f.push(a))
                            }),
                                g(),
                                f = n(f, c),
                                e = f.length != a.length,
                                f
                        }
                        function n(a, c) {
                            function d(a) {
                                e.pop();
                                var b = f.body;
                                return b instanceof tb ? b.add(a) : b = tb.cons(b, a),
                                    b.transform(c)
                            }
                            var e = []
                                , f = null;
                            return a.forEach(function (a) {
                                if (f)
                                    if (a instanceof R) {
                                        var c = {};
                                        try {
                                            f.body.walk(new hc(function (a) {
                                                if (a instanceof Ab && "in" == a.operator)
                                                    throw c
                                            }
                                            )),
                                                !a.init || a.init instanceof nb ? a.init || (a.init = f.body,
                                                    e.pop()) : a.init = d(a.init)
                                        } catch (g) {
                                            if (g !== c)
                                                throw g
                                        }
                                    } else
                                        a instanceof fb ? a.condition = d(a.condition) : a instanceof T ? a.expression = d(a.expression) : a instanceof _ && a.value ? a.value = d(a.value) : a instanceof _ ? a.value = d(b(bc, a)) : a instanceof gb && (a.expression = d(a.expression));
                                e.push(a),
                                    f = a instanceof G ? a : null
                            }),
                                e
                        }
                        function o(a) {
                            var c = null;
                            return a.reduce(function (a, b) {
                                return b instanceof nb && c && c.TYPE == b.TYPE ? (c.definitions = c.definitions.concat(b.definitions),
                                    e = !0) : b instanceof R && c instanceof nb && (!b.init || b.init.TYPE == c.TYPE) ? (e = !0,
                                        a.pop(),
                                        b.init ? b.init.definitions = c.definitions.concat(b.init.definitions) : b.init = c,
                                        a.push(b),
                                        c = b) : (c = b,
                                            a.push(b)),
                                    a
                            }, [])
                        }
                        function p(a) {
                            a.forEach(function (a) {
                                a instanceof G && (a.body = function c(a) {
                                    return a.transform(new Sc(function (a) {
                                        if (a instanceof rb && a.expression instanceof Y)
                                            return b(yb, a, {
                                                operator: "!",
                                                expression: a
                                            });
                                        if (a instanceof rb)
                                            a.expression = c(a.expression);
                                        else if (a instanceof tb)
                                            a.car = c(a.car);
                                        else if (a instanceof Bb) {
                                            var d = c(a.condition);
                                            if (d !== a.condition) {
                                                a.condition = d;
                                                var e = a.consequent;
                                                a.consequent = a.alternative,
                                                    a.alternative = e
                                            }
                                        }
                                        return a
                                    }
                                    ))
                                }(a.body))
                            })
                        }
                        var e;
                        do
                            e = !1,
                                c.option("angular") && (a = g(a)),
                                a = i(a),
                                c.option("dead_code") && (a = k(a, c)),
                                c.option("if_return") && (a = j(a, c)),
                                c.option("sequences") && (a = m(a, c)),
                                c.option("join_vars") && (a = o(a, c));
                        while (e); return c.option("negate_iife") && p(a, c),
                            a
                    }
                    function h(a, b, c) {
                        a.warn("Dropping unreachable code [{file}:{line},{col}]", b.start),
                            b.walk(new hc(function (b) {
                                return b instanceof nb ? (a.warn("Declarations in unreachable code! [{file}:{line},{col}]", b.start),
                                    b.remove_initializers(),
                                    c.push(b),
                                    !0) : b instanceof Z ? (c.push(b),
                                        !0) : b instanceof U ? !0 : void 0
                            }
                            ))
                    }
                    function i(a, b) {
                        return a.print_to_string().length > b.print_to_string().length ? b : a
                    }
                    function l(a) {
                        return a && a.aborts()
                    }
                    function m(a, c) {
                        function e(e) {
                            e = d(e),
                                a.body instanceof J ? (a.body = a.body.clone(),
                                    a.body.body = e.concat(a.body.body.slice(1)),
                                    a.body = a.body.transform(c)) : a.body = b(J, a.body, {
                                        body: e
                                    }).transform(c),
                                m(a, c)
                        }
                        var f = a.body instanceof J ? a.body.body[0] : a.body;
                        f instanceof fb && (f.body instanceof db && c.loopcontrol_target(f.body.label) === a ? (a.condition = a.condition ? b(Ab, a.condition, {
                            left: a.condition,
                            operator: "&&",
                            right: f.condition.negate(c)
                        }) : f.condition.negate(c),
                            e(f.alternative)) : f.alternative instanceof db && c.loopcontrol_target(f.alternative.label) === a && (a.condition = a.condition ? b(Ab, a.condition, {
                                left: a.condition,
                                operator: "&&",
                                right: f.condition
                            }) : f.condition,
                                e(f.body)))
                    }
                    function n(a, b) {
                        var c = b.option("pure_getters");
                        b.options.pure_getters = !1;
                        var d = a.has_side_effects(b);
                        return b.options.pure_getters = c,
                            d
                    }
                    function w(a, c) {
                        return c.option("booleans") && c.in_boolean_context() ? b(gc, a) : a
                    }
                    a(C, function (a) {
                        return a
                    }),
                        C.DEFMETHOD("equivalent_to", function (a) {
                            return this.print_to_string() == a.print_to_string()
                        }),
                        function (a) {
                            var b = ["!", "delete"]
                                , c = ["in", "instanceof", "==", "!=", "===", "!==", "<", "<=", ">=", ">"];
                            a(C, function () {
                                return !1
                            }),
                                a(yb, function () {
                                    return j(this.operator, b)
                                }),
                                a(Ab, function () {
                                    return j(this.operator, c) || ("&&" == this.operator || "||" == this.operator) && this.left.is_boolean() && this.right.is_boolean()
                                }),
                                a(Bb, function () {
                                    return this.consequent.is_boolean() && this.alternative.is_boolean()
                                }),
                                a(Cb, function () {
                                    return "=" == this.operator && this.right.is_boolean()
                                }),
                                a(tb, function () {
                                    return this.cdr.is_boolean()
                                }),
                                a(gc, function () {
                                    return !0
                                }),
                                a(fc, function () {
                                    return !0
                                })
                        }(function (a, b) {
                            a.DEFMETHOD("is_boolean", b)
                        }),
                        function (a) {
                            a(C, function () {
                                return !1
                            }),
                                a(Xb, function () {
                                    return !0
                                }),
                                a(yb, function () {
                                    return "typeof" == this.operator
                                }),
                                a(Ab, function (a) {
                                    return "+" == this.operator && (this.left.is_string(a) || this.right.is_string(a))
                                }),
                                a(Cb, function (a) {
                                    return ("=" == this.operator || "+=" == this.operator) && this.right.is_string(a)
                                }),
                                a(tb, function (a) {
                                    return this.cdr.is_string(a)
                                }),
                                a(Bb, function (a) {
                                    return this.consequent.is_string(a) && this.alternative.is_string(a)
                                }),
                                a(rb, function (a) {
                                    return a.option("unsafe") && this.expression instanceof Tb && "String" == this.expression.name && this.expression.undeclared()
                                })
                        }(function (a, b) {
                            a.DEFMETHOD("is_string", b)
                        }),
                        function (a) {
                            function b(a, b) {
                                if (!b)
                                    throw new Error("Compressor must be passed");
                                return a._eval(b)
                            }
                            C.DEFMETHOD("evaluate", function (b) {
                                if (!b.option("evaluate"))
                                    return [this];
                                try {
                                    var d = this._eval(b);
                                    return [i(c(b, d, this), this), d]
                                } catch (e) {
                                    if (e !== a)
                                        throw e;
                                    return [this]
                                }
                            }),
                                a(D, function () {
                                    throw new Error(s("Cannot evaluate a statement [{file}:{line},{col}]", this.start))
                                }),
                                a(Y, function () {
                                    throw a
                                }),
                                a(C, function () {
                                    throw a
                                }),
                                a(Wb, function () {
                                    return this.getValue()
                                }),
                                a(yb, function (c) {
                                    var d = this.expression;
                                    switch (this.operator) {
                                        case "!":
                                            return !b(d, c);
                                        case "typeof":
                                            if (d instanceof Y)
                                                return "function";
                                            if (d = b(d, c),
                                                d instanceof RegExp)
                                                throw a;
                                            return typeof d;
                                        case "void":
                                            return void b(d, c);
                                        case "~":
                                            return ~b(d, c);
                                        case "-":
                                            if (d = b(d, c),
                                                0 === d)
                                                throw a;
                                            return -d;
                                        case "+":
                                            return +b(d, c)
                                    }
                                    throw a
                                }),
                                a(Ab, function (c) {
                                    var d = this.left
                                        , e = this.right;
                                    switch (this.operator) {
                                        case "&&":
                                            return b(d, c) && b(e, c);
                                        case "||":
                                            return b(d, c) || b(e, c);
                                        case "|":
                                            return b(d, c) | b(e, c);
                                        case "&":
                                            return b(d, c) & b(e, c);
                                        case "^":
                                            return b(d, c) ^ b(e, c);
                                        case "+":
                                            return b(d, c) + b(e, c);
                                        case "*":
                                            return b(d, c) * b(e, c);
                                        case "/":
                                            return b(d, c) / b(e, c);
                                        case "%":
                                            return b(d, c) % b(e, c);
                                        case "-":
                                            return b(d, c) - b(e, c);
                                        case "<<":
                                            return b(d, c) << b(e, c);
                                        case ">>":
                                            return b(d, c) >> b(e, c);
                                        case ">>>":
                                            return b(d, c) >>> b(e, c);
                                        case "==":
                                            return b(d, c) == b(e, c);
                                        case "===":
                                            return b(d, c) === b(e, c);
                                        case "!=":
                                            return b(d, c) != b(e, c);
                                        case "!==":
                                            return b(d, c) !== b(e, c);
                                        case "<":
                                            return b(d, c) < b(e, c);
                                        case "<=":
                                            return b(d, c) <= b(e, c);
                                        case ">":
                                            return b(d, c) > b(e, c);
                                        case ">=":
                                            return b(d, c) >= b(e, c);
                                        case "in":
                                            return b(d, c) in b(e, c);
                                        case "instanceof":
                                            return b(d, c) instanceof b(e, c)
                                    }
                                    throw a
                                }),
                                a(Bb, function (a) {
                                    return b(this.condition, a) ? b(this.consequent, a) : b(this.alternative, a)
                                }),
                                a(Tb, function (c) {
                                    var d = this.definition();
                                    if (d && d.constant && d.init)
                                        return b(d.init, c);
                                    throw a
                                })
                        }(function (a, b) {
                            a.DEFMETHOD("_eval", b)
                        }),
                        function (a) {
                            function c(a) {
                                return b(yb, a, {
                                    operator: "!",
                                    expression: a
                                })
                            }
                            a(C, function () {
                                return c(this)
                            }),
                                a(D, function () {
                                    throw new Error("Cannot negate a statement")
                                }),
                                a(Y, function () {
                                    return c(this)
                                }),
                                a(yb, function () {
                                    return "!" == this.operator ? this.expression : c(this)
                                }),
                                a(tb, function (a) {
                                    var b = this.clone();
                                    return b.cdr = b.cdr.negate(a),
                                        b
                                }),
                                a(Bb, function (a) {
                                    var b = this.clone();
                                    return b.consequent = b.consequent.negate(a),
                                        b.alternative = b.alternative.negate(a),
                                        i(c(this), b)
                                }),
                                a(Ab, function (a) {
                                    var b = this.clone()
                                        , d = this.operator;
                                    if (a.option("unsafe_comps"))
                                        switch (d) {
                                            case "<=":
                                                return b.operator = ">",
                                                    b;
                                            case "<":
                                                return b.operator = ">=",
                                                    b;
                                            case ">=":
                                                return b.operator = "<",
                                                    b;
                                            case ">":
                                                return b.operator = "<=",
                                                    b
                                        }
                                    switch (d) {
                                        case "==":
                                            return b.operator = "!=",
                                                b;
                                        case "!=":
                                            return b.operator = "==",
                                                b;
                                        case "===":
                                            return b.operator = "!==",
                                                b;
                                        case "!==":
                                            return b.operator = "===",
                                                b;
                                        case "&&":
                                            return b.operator = "||",
                                                b.left = b.left.negate(a),
                                                b.right = b.right.negate(a),
                                                i(c(this), b);
                                        case "||":
                                            return b.operator = "&&",
                                                b.left = b.left.negate(a),
                                                b.right = b.right.negate(a),
                                                i(c(this), b)
                                    }
                                    return c(this)
                                })
                        }(function (a, b) {
                            a.DEFMETHOD("negate", function (a) {
                                return b.call(this, a)
                            })
                        }),
                        function (a) {
                            a(C, function () {
                                return !0
                            }),
                                a(K, function () {
                                    return !1
                                }),
                                a(Wb, function () {
                                    return !1
                                }),
                                a(Vb, function () {
                                    return !1
                                }),
                                a(rb, function (a) {
                                    var b = a.option("pure_funcs");
                                    return b ? b.indexOf(this.expression.print_to_string()) < 0 : !0
                                }),
                                a(I, function (a) {
                                    for (var b = this.body.length; --b >= 0;)
                                        if (this.body[b].has_side_effects(a))
                                            return !0;
                                    return !1
                                }),
                                a(G, function (a) {
                                    return this.body.has_side_effects(a)
                                }),
                                a(Z, function () {
                                    return !0
                                }),
                                a(Y, function () {
                                    return !1
                                }),
                                a(Ab, function (a) {
                                    return this.left.has_side_effects(a) || this.right.has_side_effects(a)
                                }),
                                a(Cb, function () {
                                    return !0
                                }),
                                a(Bb, function (a) {
                                    return this.condition.has_side_effects(a) || this.consequent.has_side_effects(a) || this.alternative.has_side_effects(a)
                                }),
                                a(xb, function (a) {
                                    return "delete" == this.operator || "++" == this.operator || "--" == this.operator || this.expression.has_side_effects(a)
                                }),
                                a(Tb, function () {
                                    return !1
                                }),
                                a(Eb, function (a) {
                                    for (var b = this.properties.length; --b >= 0;)
                                        if (this.properties[b].has_side_effects(a))
                                            return !0;
                                    return !1
                                }),
                                a(Fb, function (a) {
                                    return this.value.has_side_effects(a)
                                }),
                                a(Db, function (a) {
                                    for (var b = this.elements.length; --b >= 0;)
                                        if (this.elements[b].has_side_effects(a))
                                            return !0;
                                    return !1
                                }),
                                a(vb, function (a) {
                                    return a.option("pure_getters") ? this.expression.has_side_effects(a) : !0
                                }),
                                a(wb, function (a) {
                                    return a.option("pure_getters") ? this.expression.has_side_effects(a) || this.property.has_side_effects(a) : !0
                                }),
                                a(ub, function (a) {
                                    return !a.option("pure_getters")
                                }),
                                a(tb, function (a) {
                                    return this.car.has_side_effects(a) || this.cdr.has_side_effects(a)
                                })
                        }(function (a, b) {
                            a.DEFMETHOD("has_side_effects", b)
                        }),
                        function (a) {
                            function b() {
                                var a = this.body.length;
                                return a > 0 && l(this.body[a - 1])
                            }
                            a(D, function () {
                                return null
                            }),
                                a($, function () {
                                    return this
                                }),
                                a(J, b),
                                a(hb, b),
                                a(fb, function () {
                                    return this.alternative && l(this.body) && l(this.alternative)
                                })
                        }(function (a, b) {
                            a.DEFMETHOD("aborts", b)
                        }),
                        a(F, function (a) {
                            return a.scope.has_directive(a.value) !== a.scope ? b(K, a) : a
                        }),
                        a(E, function (a, c) {
                            return c.option("drop_debugger") ? b(K, a) : a
                        }),
                        a(M, function (a, c) {
                            return a.body instanceof db && c.loopcontrol_target(a.body.label) === a.body ? b(K, a) : 0 == a.label.references.length ? a.body : a
                        }),
                        a(I, function (a, b) {
                            return a.body = g(a.body, b),
                                a
                        }),
                        a(J, function (a, c) {
                            switch (a.body = g(a.body, c),
                            a.body.length) {
                                case 1:
                                    return a.body[0];
                                case 0:
                                    return b(K, a)
                            }
                            return a
                        }),
                        U.DEFMETHOD("drop_unused", function (a) {
                            var c = this;
                            if (a.option("unused") && !(c instanceof V) && !c.uses_eval) {
                                var d = []
                                    , e = new z
                                    , f = this
                                    , g = new hc(function (b, h) {
                                        if (b !== c) {
                                            if (b instanceof Z)
                                                return e.add(b.name.name, b),
                                                    !0;
                                            if (b instanceof nb && f === c)
                                                return b.definitions.forEach(function (b) {
                                                    b.value && (e.add(b.name.name, b.value),
                                                        b.value.has_side_effects(a) && b.value.walk(g))
                                                }),
                                                    !0;
                                            if (b instanceof Tb)
                                                return r(d, b.definition()),
                                                    !0;
                                            if (b instanceof U) {
                                                var i = f;
                                                return f = b,
                                                    h(),
                                                    f = i,
                                                    !0
                                            }
                                        }
                                    }
                                    );
                                c.walk(g);
                                for (var h = 0; h < d.length; ++h)
                                    d[h].orig.forEach(function (a) {
                                        var b = e.get(a.name);
                                        b && b.forEach(function (a) {
                                            var b = new hc(function (a) {
                                                a instanceof Tb && r(d, a.definition())
                                            }
                                            );
                                            a.walk(b)
                                        })
                                    });
                                var i = new Sc(function (e, f, g) {
                                    if (e instanceof W && !(e instanceof X))
                                        for (var h = e.argnames, k = h.length; --k >= 0;) {
                                            var l = h[k];
                                            if (!l.unreferenced())
                                                break;
                                            h.pop(),
                                                a.warn("Dropping unused function argument {name} [{file}:{line},{col}]", {
                                                    name: l.name,
                                                    file: l.start.file,
                                                    line: l.start.line,
                                                    col: l.start.col
                                                })
                                        }
                                    if (e instanceof Z && e !== c)
                                        return j(e.name.definition(), d) ? e : (a.warn("Dropping unused function {name} [{file}:{line},{col}]", {
                                            name: e.name.name,
                                            file: e.name.start.file,
                                            line: e.name.start.line,
                                            col: e.name.start.col
                                        }),
                                            b(K, e));
                                    if (e instanceof nb && !(i.parent() instanceof S)) {
                                        var m = e.definitions.filter(function (b) {
                                            if (j(b.name.definition(), d))
                                                return !0;
                                            var c = {
                                                name: b.name.name,
                                                file: b.name.start.file,
                                                line: b.name.start.line,
                                                col: b.name.start.col
                                            };
                                            return b.value && b.value.has_side_effects(a) ? (b._unused_side_effects = !0,
                                                a.warn("Side effects in initialization of unused variable {name} [{file}:{line},{col}]", c),
                                                !0) : (a.warn("Dropping unused variable {name} [{file}:{line},{col}]", c),
                                                    !1)
                                        });
                                        m = u(m, function (a, b) {
                                            return !a.value && b.value ? -1 : !b.value && a.value ? 1 : 0
                                        });
                                        for (var n = [], k = 0; k < m.length;) {
                                            var o = m[k];
                                            o._unused_side_effects ? (n.push(o.value),
                                                m.splice(k, 1)) : (n.length > 0 && (n.push(o.value),
                                                    o.value = tb.from_array(n),
                                                    n = []),
                                                    ++k)
                                        }
                                        return n = n.length > 0 ? b(J, e, {
                                            body: [b(G, e, {
                                                body: tb.from_array(n)
                                            })]
                                        }) : null,
                                            0 != m.length || n ? 0 == m.length ? n : (e.definitions = m,
                                                n && (n.body.unshift(e),
                                                    e = n),
                                                e) : b(K, e)
                                    }
                                    if (e instanceof R && (f(e, this),
                                        e.init instanceof J)) {
                                        var p = e.init.body.slice(0, -1);
                                        return e.init = e.init.body.slice(-1)[0].body,
                                            p.push(e),
                                            g ? q.splice(p) : b(J, e, {
                                                body: p
                                            })
                                    }
                                    return e instanceof U && e !== c ? e : void 0
                                }
                                );
                                c.transform(i)
                            }
                        }),
                        U.DEFMETHOD("hoist_declarations", function (a) {
                            var c = a.option("hoist_funs")
                                , d = a.option("hoist_vars")
                                , e = this;
                            if (c || d) {
                                var f = []
                                    , g = []
                                    , h = new z
                                    , i = 0
                                    , j = 0;
                                e.walk(new hc(function (a) {
                                    return a instanceof U && a !== e ? !0 : a instanceof ob ? (++j,
                                        !0) : void 0
                                }
                                )),
                                    d = d && j > 1;
                                var l = new Sc(function (a) {
                                    if (a !== e) {
                                        if (a instanceof F)
                                            return f.push(a),
                                                b(K, a);
                                        if (a instanceof Z && c)
                                            return g.push(a),
                                                b(K, a);
                                        if (a instanceof ob && d) {
                                            a.definitions.forEach(function (a) {
                                                h.set(a.name.name, a),
                                                    ++i
                                            });
                                            var j = a.to_assignments()
                                                , k = l.parent();
                                            return k instanceof S && k.init === a ? null == j ? a.definitions[0].name : j : k instanceof R && k.init === a ? j : j ? b(G, a, {
                                                body: j
                                            }) : b(K, a)
                                        }
                                        if (a instanceof U)
                                            return a
                                    }
                                }
                                );
                                if (e = e.transform(l),
                                    i > 0) {
                                    var m = [];
                                    if (h.each(function (a, b) {
                                        e instanceof W && k(function (b) {
                                            return b.name == a.name.name
                                        }, e.argnames) ? h.del(b) : (a = a.clone(),
                                            a.value = null,
                                            m.push(a),
                                            h.set(b, a))
                                    }),
                                        m.length > 0) {
                                        for (var n = 0; n < e.body.length;) {
                                            if (e.body[n] instanceof G) {
                                                var p, q, o = e.body[n].body;
                                                if (o instanceof Cb && "=" == o.operator && (p = o.left) instanceof Jb && h.has(p.name)) {
                                                    var r = h.get(p.name);
                                                    if (r.value)
                                                        break;
                                                    r.value = o.right,
                                                        t(m, r),
                                                        m.push(r),
                                                        e.body.splice(n, 1);
                                                    continue
                                                }
                                                if (o instanceof tb && (q = o.car) instanceof Cb && "=" == q.operator && (p = q.left) instanceof Jb && h.has(p.name)) {
                                                    var r = h.get(p.name);
                                                    if (r.value)
                                                        break;
                                                    r.value = q.right,
                                                        t(m, r),
                                                        m.push(r),
                                                        e.body[n].body = o.cdr;
                                                    continue
                                                }
                                            }
                                            if (e.body[n] instanceof K)
                                                e.body.splice(n, 1);
                                            else {
                                                if (!(e.body[n] instanceof J))
                                                    break;
                                                var s = [n, 1].concat(e.body[n].body);
                                                e.body.splice.apply(e.body, s)
                                            }
                                        }
                                        m = b(ob, e, {
                                            definitions: m
                                        }),
                                            g.push(m)
                                    }
                                }
                                e.body = f.concat(g, e.body)
                            }
                            return e
                        }),
                        a(G, function (a, c) {
                            return c.option("side_effects") && !a.body.has_side_effects(c) ? (c.warn("Dropping side-effect-free statement [{file}:{line},{col}]", a.start),
                                b(K, a)) : a
                        }),
                        a(O, function (a, c) {
                            var d = a.condition.evaluate(c);
                            if (a.condition = d[0],
                                !c.option("loops"))
                                return a;
                            if (d.length > 1) {
                                if (d[1])
                                    return b(R, a, {
                                        body: a.body
                                    });
                                if (a instanceof Q && c.option("dead_code")) {
                                    var e = [];
                                    return h(c, a.body, e),
                                        b(J, a, {
                                            body: e
                                        })
                                }
                            }
                            return a
                        }),
                        a(Q, function (a, c) {
                            return c.option("loops") ? (a = O.prototype.optimize.call(a, c),
                                a instanceof Q && (m(a, c),
                                    a = b(R, a, a).transform(c)),
                                a) : a
                        }),
                        a(R, function (a, c) {
                            var d = a.condition;
                            if (d && (d = d.evaluate(c),
                                a.condition = d[0]),
                                !c.option("loops"))
                                return a;
                            if (d && d.length > 1 && !d[1] && c.option("dead_code")) {
                                var e = [];
                                return a.init instanceof D ? e.push(a.init) : a.init && e.push(b(G, a.init, {
                                    body: a.init
                                })),
                                    h(c, a.body, e),
                                    b(J, a, {
                                        body: e
                                    })
                            }
                            return m(a, c),
                                a
                        }),
                        a(fb, function (a, c) {
                            if (!c.option("conditionals"))
                                return a;
                            var d = a.condition.evaluate(c);
                            if (a.condition = d[0],
                                d.length > 1)
                                if (d[1]) {
                                    if (c.warn("Condition always true [{file}:{line},{col}]", a.condition.start),
                                        c.option("dead_code")) {
                                        var f = [];
                                        return a.alternative && h(c, a.alternative, f),
                                            f.push(a.body),
                                            b(J, a, {
                                                body: f
                                            }).transform(c)
                                    }
                                } else if (c.warn("Condition always false [{file}:{line},{col}]", a.condition.start),
                                    c.option("dead_code")) {
                                    var f = [];
                                    return h(c, a.body, f),
                                        a.alternative && f.push(a.alternative),
                                        b(J, a, {
                                            body: f
                                        }).transform(c)
                                }
                            e(a.alternative) && (a.alternative = null);
                            var g = a.condition.negate(c)
                                , j = i(a.condition, g) === g;
                            if (a.alternative && j) {
                                j = !1,
                                    a.condition = g;
                                var k = a.body;
                                a.body = a.alternative || b(K),
                                    a.alternative = k
                            }
                            if (e(a.body) && e(a.alternative))
                                return b(G, a.condition, {
                                    body: a.condition
                                }).transform(c);
                            if (a.body instanceof G && a.alternative instanceof G)
                                return b(G, a, {
                                    body: b(Bb, a, {
                                        condition: a.condition,
                                        consequent: a.body.body,
                                        alternative: a.alternative.body
                                    })
                                }).transform(c);
                            if (e(a.alternative) && a.body instanceof G)
                                return j ? b(G, a, {
                                    body: b(Ab, a, {
                                        operator: "||",
                                        left: g,
                                        right: a.body.body
                                    })
                                }).transform(c) : b(G, a, {
                                    body: b(Ab, a, {
                                        operator: "&&",
                                        left: a.condition,
                                        right: a.body.body
                                    })
                                }).transform(c);
                            if (a.body instanceof K && a.alternative && a.alternative instanceof G)
                                return b(G, a, {
                                    body: b(Ab, a, {
                                        operator: "||",
                                        left: a.condition,
                                        right: a.alternative.body
                                    })
                                }).transform(c);
                            if (a.body instanceof _ && a.alternative instanceof _ && a.body.TYPE == a.alternative.TYPE)
                                return b(a.body.CTOR, a, {
                                    value: b(Bb, a, {
                                        condition: a.condition,
                                        consequent: a.body.value || b(bc, a.body).optimize(c),
                                        alternative: a.alternative.value || b(bc, a.alternative).optimize(c)
                                    })
                                }).transform(c);
                            if (a.body instanceof fb && !a.body.alternative && !a.alternative && (a.condition = b(Ab, a.condition, {
                                operator: "&&",
                                left: a.condition,
                                right: a.body.condition
                            }).transform(c),
                                a.body = a.body.body),
                                l(a.body) && a.alternative) {
                                var m = a.alternative;
                                return a.alternative = null,
                                    b(J, a, {
                                        body: [a, m]
                                    }).transform(c)
                            }
                            if (l(a.alternative)) {
                                var n = a.body;
                                return a.body = a.alternative,
                                    a.condition = j ? g : a.condition.negate(c),
                                    a.alternative = null,
                                    b(J, a, {
                                        body: [a, n]
                                    }).transform(c)
                            }
                            return a
                        }),
                        a(gb, function (a, c) {
                            if (0 == a.body.length && c.option("conditionals"))
                                return b(G, a, {
                                    body: a.expression
                                }).transform(c);
                            for (; ;) {
                                var d = a.body[a.body.length - 1];
                                if (d) {
                                    var e = d.body[d.body.length - 1];
                                    if (e instanceof db && f(c.loopcontrol_target(e.label)) === a && d.body.pop(),
                                        d instanceof ib && 0 == d.body.length) {
                                        a.body.pop();
                                        continue
                                    }
                                }
                                break
                            }
                            var g = a.expression.evaluate(c);
                            a: if (2 == g.length)
                                try {
                                    if (a.expression = g[0],
                                        !c.option("dead_code"))
                                        break a;
                                    var h = g[1]
                                        , i = !1
                                        , j = !1
                                        , k = !1
                                        , m = !1
                                        , n = !1
                                        , o = new Sc(function (d, e, f) {
                                            if (d instanceof W || d instanceof G)
                                                return d;
                                            if (d instanceof gb && d === a)
                                                return d = d.clone(),
                                                    e(d, this),
                                                    n ? d : b(J, d, {
                                                        body: d.body.reduce(function (a, b) {
                                                            return a.concat(b.body)
                                                        }, [])
                                                    }).transform(c);
                                            if (d instanceof fb || d instanceof kb) {
                                                var g = i;
                                                return i = !j,
                                                    e(d, this),
                                                    i = g,
                                                    d
                                            }
                                            if (d instanceof L || d instanceof gb) {
                                                var g = j;
                                                return j = !0,
                                                    e(d, this),
                                                    j = g,
                                                    d
                                            }
                                            if (d instanceof db && this.loopcontrol_target(d.label) === a)
                                                return i ? (n = !0,
                                                    d) : j ? d : (m = !0,
                                                        f ? q.skip : b(K, d));
                                            if (d instanceof hb && this.parent() === a) {
                                                if (m)
                                                    return q.skip;
                                                if (d instanceof jb) {
                                                    var o = d.expression.evaluate(c);
                                                    if (o.length < 2)
                                                        throw a;
                                                    return o[1] === h || k ? (k = !0,
                                                        l(d) && (m = !0),
                                                        e(d, this),
                                                        d) : q.skip
                                                }
                                                return e(d, this),
                                                    d
                                            }
                                        }
                                        );
                                    o.stack = c.stack.slice(),
                                        a = a.transform(o)
                                } catch (p) {
                                    if (p !== a)
                                        throw p
                                }
                            return a
                        }),
                        a(jb, function (a, b) {
                            return a.body = g(a.body, b),
                                a
                        }),
                        a(kb, function (a, b) {
                            return a.body = g(a.body, b),
                                a
                        }),
                        nb.DEFMETHOD("remove_initializers", function () {
                            this.definitions.forEach(function (a) {
                                a.value = null
                            })
                        }),
                        nb.DEFMETHOD("to_assignments", function () {
                            var a = this.definitions.reduce(function (a, c) {
                                if (c.value) {
                                    var d = b(Tb, c.name, c.name);
                                    a.push(b(Cb, c, {
                                        operator: "=",
                                        left: d,
                                        right: c.value
                                    }))
                                }
                                return a
                            }, []);
                            return 0 == a.length ? null : tb.from_array(a)
                        }),
                        a(nb, function (a) {
                            return 0 == a.definitions.length ? b(K, a) : a
                        }),
                        a(Y, function (a, b) {
                            return a = W.prototype.optimize.call(a, b),
                                b.option("unused") && a.name && a.name.unreferenced() && (a.name = null),
                                a
                        }),
                        a(rb, function (a, d) {
                            if (d.option("unsafe")) {
                                var e = a.expression;
                                if (e instanceof Tb && e.undeclared())
                                    switch (e.name) {
                                        case "Array":
                                            if (1 != a.args.length)
                                                return b(Db, a, {
                                                    elements: a.args
                                                }).transform(d);
                                            break;
                                        case "Object":
                                            if (0 == a.args.length)
                                                return b(Eb, a, {
                                                    properties: []
                                                });
                                            break;
                                        case "String":
                                            if (0 == a.args.length)
                                                return b(Xb, a, {
                                                    value: ""
                                                });
                                            if (a.args.length <= 1)
                                                return b(Ab, a, {
                                                    left: a.args[0],
                                                    operator: "+",
                                                    right: b(Xb, a, {
                                                        value: ""
                                                    })
                                                }).transform(d);
                                            break;
                                        case "Number":
                                            if (0 == a.args.length)
                                                return b(Yb, a, {
                                                    value: 0
                                                });
                                            if (1 == a.args.length)
                                                return b(yb, a, {
                                                    expression: a.args[0],
                                                    operator: "+"
                                                }).transform(d);
                                        case "Boolean":
                                            if (0 == a.args.length)
                                                return b(fc, a);
                                            if (1 == a.args.length)
                                                return b(yb, a, {
                                                    expression: b(yb, null, {
                                                        expression: a.args[0],
                                                        operator: "!"
                                                    }),
                                                    operator: "!"
                                                }).transform(d);
                                            break;
                                        case "Function":
                                            if (y(a.args, function (a) {
                                                return a instanceof Xb
                                            }))
                                                try {
                                                    var f = "(function(" + a.args.slice(0, -1).map(function (a) {
                                                        return a.value
                                                    }).join(",") + "){" + a.args[a.args.length - 1].value + "})()"
                                                        , g = Rc(f);
                                                    g.figure_out_scope({
                                                        screw_ie8: d.option("screw_ie8")
                                                    });
                                                    var h = new Wc(d.options);
                                                    g = g.transform(h),
                                                        g.figure_out_scope({
                                                            screw_ie8: d.option("screw_ie8")
                                                        }),
                                                        g.mangle_names();
                                                    var j;
                                                    try {
                                                        g.walk(new hc(function (a) {
                                                            if (a instanceof W)
                                                                throw j = a,
                                                                g
                                                        }
                                                        ))
                                                    } catch (k) {
                                                        if (k !== g)
                                                            throw k
                                                    }
                                                    var l = j.argnames.map(function (c, d) {
                                                        return b(Xb, a.args[d], {
                                                            value: c.print_to_string()
                                                        })
                                                    })
                                                        , f = Vc();
                                                    return J.prototype._codegen.call(j, j, f),
                                                        f = f.toString().replace(/^\{|\}$/g, ""),
                                                        l.push(b(Xb, a.args[a.args.length - 1], {
                                                            value: f
                                                        })),
                                                        a.args = l,
                                                        a
                                                } catch (k) {
                                                    if (!(k instanceof Gc))
                                                        throw console.log(k),
                                                        k;
                                                    d.warn("Error parsing code passed to new Function [{file}:{line},{col}]", a.args[a.args.length - 1].start),
                                                        d.warn(k.toString())
                                                }
                                    }
                                else {
                                    if (e instanceof vb && "toString" == e.property && 0 == a.args.length)
                                        return b(Ab, a, {
                                            left: b(Xb, a, {
                                                value: ""
                                            }),
                                            operator: "+",
                                            right: e.expression
                                        }).transform(d);
                                    if (e instanceof vb && e.expression instanceof Db && "join" == e.property) {
                                        var m = 0 == a.args.length ? "," : a.args[0].evaluate(d)[1];
                                        if (null != m) {
                                            var n = e.expression.elements.reduce(function (a, b) {
                                                if (b = b.evaluate(d),
                                                    0 == a.length || 1 == b.length)
                                                    a.push(b);
                                                else {
                                                    var e = a[a.length - 1];
                                                    if (2 == e.length) {
                                                        var f = "" + e[1] + m + b[1];
                                                        a[a.length - 1] = [c(d, f, e[0]), f]
                                                    } else
                                                        a.push(b)
                                                }
                                                return a
                                            }, []);
                                            if (0 == n.length)
                                                return b(Xb, a, {
                                                    value: ""
                                                });
                                            if (1 == n.length)
                                                return n[0][0];
                                            if ("" == m) {
                                                var o;
                                                return o = n[0][0] instanceof Xb || n[1][0] instanceof Xb ? n.shift()[0] : b(Xb, a, {
                                                    value: ""
                                                }),
                                                    n.reduce(function (a, c) {
                                                        return b(Ab, c[0], {
                                                            operator: "+",
                                                            left: a,
                                                            right: c[0]
                                                        })
                                                    }, o).transform(d)
                                            }
                                            var p = a.clone();
                                            return p.expression = p.expression.clone(),
                                                p.expression.expression = p.expression.expression.clone(),
                                                p.expression.expression.elements = n.map(function (a) {
                                                    return a[0]
                                                }),
                                                i(a, p)
                                        }
                                    }
                                }
                            }
                            return d.option("side_effects") && a.expression instanceof Y && 0 == a.args.length && !I.prototype.has_side_effects.call(a.expression, d) ? b(bc, a).transform(d) : d.option("drop_console") && a.expression instanceof ub && a.expression.expression instanceof Tb && "console" == a.expression.expression.name && a.expression.expression.undeclared() ? b(bc, a).transform(d) : a.evaluate(d)[0]
                        }),
                        a(sb, function (a, c) {
                            if (c.option("unsafe")) {
                                var d = a.expression;
                                if (d instanceof Tb && d.undeclared())
                                    switch (d.name) {
                                        case "Object":
                                        case "RegExp":
                                        case "Function":
                                        case "Error":
                                        case "Array":
                                            return b(rb, a, a).transform(c)
                                    }
                            }
                            return a
                        }),
                        a(tb, function (a, c) {
                            if (!c.option("side_effects"))
                                return a;
                            if (!a.car.has_side_effects(c)) {
                                var d;
                                if (!(a.cdr instanceof Tb && "eval" == a.cdr.name && a.cdr.undeclared() && (d = c.parent()) instanceof rb && d.expression === a))
                                    return a.cdr
                            }
                            if (c.option("cascade")) {
                                if (a.car instanceof Cb && !a.car.left.has_side_effects(c)) {
                                    if (a.car.left.equivalent_to(a.cdr))
                                        return a.car;
                                    if (a.cdr instanceof rb && a.cdr.expression.equivalent_to(a.car.left))
                                        return a.cdr.expression = a.car,
                                            a.cdr
                                }
                                if (!a.car.has_side_effects(c) && !a.cdr.has_side_effects(c) && a.car.equivalent_to(a.cdr))
                                    return a.car
                            }
                            return a.cdr instanceof yb && "void" == a.cdr.operator && !a.cdr.expression.has_side_effects(c) ? (a.cdr.operator = a.car,
                                a.cdr) : a.cdr instanceof bc ? b(yb, a, {
                                    operator: "void",
                                    expression: a.car
                                }) : a
                        }),
                        xb.DEFMETHOD("lift_sequences", function (a) {
                            if (a.option("sequences") && this.expression instanceof tb) {
                                var b = this.expression
                                    , c = b.to_array();
                                return this.expression = c.pop(),
                                    c.push(this),
                                    b = tb.from_array(c).transform(a)
                            }
                            return this
                        }),
                        a(zb, function (a, b) {
                            return a.lift_sequences(b)
                        }),
                        a(yb, function (a, c) {
                            a = a.lift_sequences(c);
                            var d = a.expression;
                            if (c.option("booleans") && c.in_boolean_context()) {
                                switch (a.operator) {
                                    case "!":
                                        if (d instanceof yb && "!" == d.operator)
                                            return d.expression;
                                        break;
                                    case "typeof":
                                        return c.warn("Boolean expression always true [{file}:{line},{col}]", a.start),
                                            b(gc, a)
                                }
                                d instanceof Ab && "!" == a.operator && (a = i(a, d.negate(c)))
                            }
                            return a.evaluate(c)[0]
                        }),
                        Ab.DEFMETHOD("lift_sequences", function (a) {
                            if (a.option("sequences")) {
                                if (this.left instanceof tb) {
                                    var b = this.left
                                        , c = b.to_array();
                                    return this.left = c.pop(),
                                        c.push(this),
                                        b = tb.from_array(c).transform(a)
                                }
                                if (this.right instanceof tb && this instanceof Cb && !n(this.left, a)) {
                                    var b = this.right
                                        , c = b.to_array();
                                    return this.right = c.pop(),
                                        c.push(this),
                                        b = tb.from_array(c).transform(a)
                                }
                            }
                            return this
                        });
                    var o = x("== === != !== * & | ^");
                    a(Ab, function (a, c) {
                        var d = c.has_directive("use asm") ? p : function (b, d) {
                            if (d || !a.left.has_side_effects(c) && !a.right.has_side_effects(c)) {
                                b && (a.operator = b);
                                var e = a.left;
                                a.left = a.right,
                                    a.right = e
                            }
                        }
                            ;
                        if (o(a.operator) && (a.right instanceof Wb && !(a.left instanceof Wb) && (a.left instanceof Ab && Oc[a.left.operator] >= Oc[a.operator] || d(null, !0)),
                            /^[!=]==?$/.test(a.operator))) {
                            if (a.left instanceof Tb && a.right instanceof Bb) {
                                if (a.right.consequent instanceof Tb && a.right.consequent.definition() === a.left.definition()) {
                                    if (/^==/.test(a.operator))
                                        return a.right.condition;
                                    if (/^!=/.test(a.operator))
                                        return a.right.condition.negate(c)
                                }
                                if (a.right.alternative instanceof Tb && a.right.alternative.definition() === a.left.definition()) {
                                    if (/^==/.test(a.operator))
                                        return a.right.condition.negate(c);
                                    if (/^!=/.test(a.operator))
                                        return a.right.condition
                                }
                            }
                            if (a.right instanceof Tb && a.left instanceof Bb) {
                                if (a.left.consequent instanceof Tb && a.left.consequent.definition() === a.right.definition()) {
                                    if (/^==/.test(a.operator))
                                        return a.left.condition;
                                    if (/^!=/.test(a.operator))
                                        return a.left.condition.negate(c)
                                }
                                if (a.left.alternative instanceof Tb && a.left.alternative.definition() === a.right.definition()) {
                                    if (/^==/.test(a.operator))
                                        return a.left.condition.negate(c);
                                    if (/^!=/.test(a.operator))
                                        return a.left.condition
                                }
                            }
                        }
                        if (a = a.lift_sequences(c),
                            c.option("comparisons"))
                            switch (a.operator) {
                                case "===":
                                case "!==":
                                    (a.left.is_string(c) && a.right.is_string(c) || a.left.is_boolean() && a.right.is_boolean()) && (a.operator = a.operator.substr(0, 2));
                                case "==":
                                case "!=":
                                    a.left instanceof Xb && "undefined" == a.left.value && a.right instanceof yb && "typeof" == a.right.operator && c.option("unsafe") && (a.right.expression instanceof Tb && a.right.expression.undeclared() || (a.right = a.right.expression,
                                        a.left = b(bc, a.left).optimize(c),
                                        2 == a.operator.length && (a.operator += "=")))
                            }
                        if (c.option("booleans") && c.in_boolean_context())
                            switch (a.operator) {
                                case "&&":
                                    var e = a.left.evaluate(c)
                                        , f = a.right.evaluate(c);
                                    if (e.length > 1 && !e[1] || f.length > 1 && !f[1])
                                        return c.warn("Boolean && always false [{file}:{line},{col}]", a.start),
                                            b(fc, a);
                                    if (e.length > 1 && e[1])
                                        return f[0];
                                    if (f.length > 1 && f[1])
                                        return e[0];
                                    break;
                                case "||":
                                    var e = a.left.evaluate(c)
                                        , f = a.right.evaluate(c);
                                    if (e.length > 1 && e[1] || f.length > 1 && f[1])
                                        return c.warn("Boolean || always true [{file}:{line},{col}]", a.start),
                                            b(gc, a);
                                    if (e.length > 1 && !e[1])
                                        return f[0];
                                    if (f.length > 1 && !f[1])
                                        return e[0];
                                    break;
                                case "+":
                                    var e = a.left.evaluate(c)
                                        , f = a.right.evaluate(c);
                                    if (e.length > 1 && e[0] instanceof Xb && e[1] || f.length > 1 && f[0] instanceof Xb && f[1])
                                        return c.warn("+ in boolean context always true [{file}:{line},{col}]", a.start),
                                            b(gc, a)
                            }
                        if (c.option("comparisons")) {
                            if (!(c.parent() instanceof Ab) || c.parent() instanceof Cb) {
                                var g = b(yb, a, {
                                    operator: "!",
                                    expression: a.negate(c)
                                });
                                a = i(a, g)
                            }
                            switch (a.operator) {
                                case "<":
                                    d(">");
                                    break;
                                case "<=":
                                    d(">=")
                            }
                        }
                        return "+" == a.operator && a.right instanceof Xb && "" === a.right.getValue() && a.left instanceof Ab && "+" == a.left.operator && a.left.is_string(c) ? a.left : (c.option("evaluate") && "+" == a.operator && (a.left instanceof Wb && a.right instanceof Ab && "+" == a.right.operator && a.right.left instanceof Wb && a.right.is_string(c) && (a = b(Ab, a, {
                            operator: "+",
                            left: b(Xb, null, {
                                value: "" + a.left.getValue() + a.right.left.getValue(),
                                start: a.left.start,
                                end: a.right.left.end
                            }),
                            right: a.right.right
                        })),
                            a.right instanceof Wb && a.left instanceof Ab && "+" == a.left.operator && a.left.right instanceof Wb && a.left.is_string(c) && (a = b(Ab, a, {
                                operator: "+",
                                left: a.left.left,
                                right: b(Xb, null, {
                                    value: "" + a.left.right.getValue() + a.right.getValue(),
                                    start: a.left.right.start,
                                    end: a.right.end
                                })
                            })),
                            a.left instanceof Ab && "+" == a.left.operator && a.left.is_string(c) && a.left.right instanceof Wb && a.right instanceof Ab && "+" == a.right.operator && a.right.left instanceof Wb && a.right.is_string(c) && (a = b(Ab, a, {
                                operator: "+",
                                left: b(Ab, a.left, {
                                    operator: "+",
                                    left: a.left.left,
                                    right: b(Xb, null, {
                                        value: "" + a.left.right.getValue() + a.right.left.getValue(),
                                        start: a.left.right.start,
                                        end: a.right.left.end
                                    })
                                }),
                                right: a.right.right
                            }))),
                            a.right instanceof Ab && a.right.operator == a.operator && ("*" == a.operator || "&&" == a.operator || "||" == a.operator) ? (a.left = b(Ab, a.left, {
                                operator: a.operator,
                                left: a.left,
                                right: a.right.left
                            }),
                                a.right = a.right.right,
                                a.transform(c)) : a.evaluate(c)[0])
                    }),
                        a(Tb, function (a, d) {
                            if (a.undeclared()) {
                                var e = d.option("global_defs");
                                if (e && e.hasOwnProperty(a.name))
                                    return c(d, e[a.name], a);
                                switch (a.name) {
                                    case "undefined":
                                        return b(bc, a);
                                    case "NaN":
                                        return b(ac, a);
                                    case "Infinity":
                                        return b(dc, a)
                                }
                            }
                            return a
                        }),
                        a(bc, function (a, c) {
                            if (c.option("unsafe")) {
                                var d = c.find_parent(U)
                                    , e = d.find_variable("undefined");
                                if (e) {
                                    var f = b(Tb, a, {
                                        name: "undefined",
                                        scope: d,
                                        thedef: e
                                    });
                                    return f.reference(),
                                        f
                                }
                            }
                            return a
                        });
                    var v = ["+", "-", "/", "*", "%", ">>", "<<", ">>>", "|", "^", "&"];
                    a(Cb, function (a, b) {
                        return a = a.lift_sequences(b),
                            "=" == a.operator && a.left instanceof Tb && a.right instanceof Ab && a.right.left instanceof Tb && a.right.left.name == a.left.name && j(a.right.operator, v) && (a.operator = a.right.operator + "=",
                                a.right = a.right.right),
                            a
                    }),
                        a(Bb, function (a, c) {
                            if (!c.option("conditionals"))
                                return a;
                            if (a.condition instanceof tb) {
                                var d = a.condition.car;
                                return a.condition = a.condition.cdr,
                                    tb.cons(d, a)
                            }
                            var e = a.condition.evaluate(c);
                            if (e.length > 1)
                                return e[1] ? (c.warn("Condition always true [{file}:{line},{col}]", a.start),
                                    a.consequent) : (c.warn("Condition always false [{file}:{line},{col}]", a.start),
                                        a.alternative);
                            var f = e[0].negate(c);
                            i(e[0], f) === f && (a = b(Bb, a, {
                                condition: f,
                                consequent: a.alternative,
                                alternative: a.consequent
                            }));
                            var g = a.consequent
                                , h = a.alternative;
                            if (g instanceof Cb && h instanceof Cb && g.operator == h.operator && g.left.equivalent_to(h.left))
                                return b(Cb, a, {
                                    operator: g.operator,
                                    left: g.left,
                                    right: b(Bb, a, {
                                        condition: a.condition,
                                        consequent: g.right,
                                        alternative: h.right
                                    })
                                });
                            if (g instanceof rb && h.TYPE === g.TYPE && g.args.length == h.args.length && g.expression.equivalent_to(h.expression)) {
                                if (0 == g.args.length)
                                    return b(tb, a, {
                                        car: a.condition,
                                        cdr: g
                                    });
                                if (1 == g.args.length)
                                    return g.args[0] = b(Bb, a, {
                                        condition: a.condition,
                                        consequent: g.args[0],
                                        alternative: h.args[0]
                                    }),
                                        g
                            }
                            return a
                        }),
                        a(ec, function (a, c) {
                            if (c.option("booleans")) {
                                var d = c.parent();
                                return d instanceof Ab && ("==" == d.operator || "!=" == d.operator) ? (c.warn("Non-strict equality against boolean: {operator} {value} [{file}:{line},{col}]", {
                                    operator: d.operator,
                                    value: a.value,
                                    file: d.start.file,
                                    line: d.start.line,
                                    col: d.start.col
                                }),
                                    b(Yb, a, {
                                        value: +a.value
                                    })) : b(yb, a, {
                                        operator: "!",
                                        expression: b(Yb, a, {
                                            value: 1 - a.value
                                        })
                                    })
                            }
                            return a
                        }),
                        a(wb, function (a, c) {
                            var d = a.property;
                            if (d instanceof Xb && c.option("properties")) {
                                if (d = d.getValue(),
                                    kc(d) ? c.option("screw_ie8") : Ec(d))
                                    return b(vb, a, {
                                        expression: a.expression,
                                        property: d
                                    });
                                var e = parseFloat(d);
                                isNaN(e) || e.toString() != d || (a.property = b(Yb, a.property, {
                                    value: e
                                }))
                            }
                            return a
                        }),
                        a(Db, w),
                        a(Eb, w),
                        a(Zb, w)
                }(),
                function () {
                    function b(a) {
                        var b = "prefix" in a ? a.prefix : "UnaryExpression" == a.type ? !0 : !1;
                        return new (b ? yb : zb)({
                            start: d(a),
                            end: e(a),
                            operator: a.operator,
                            expression: h(a.argument)
                        })
                    }
                    function d(a) {
                        return new B({
                            file: a.loc && a.loc.source,
                            line: a.loc && a.loc.start.line,
                            col: a.loc && a.loc.start.column,
                            pos: a.start,
                            endpos: a.start
                        })
                    }
                    function e(a) {
                        return new B({
                            file: a.loc && a.loc.source,
                            line: a.loc && a.loc.end.line,
                            col: a.loc && a.loc.end.column,
                            pos: a.end,
                            endpos: a.end
                        })
                    }
                    function f(b, c, f) {
                        var g = "function From_Moz_" + b + "(M){\n";
                        return g += "return new mytype({\nstart: my_start_token(M),\nend: my_end_token(M)",
                            f && f.split(/\s*,\s*/).forEach(function (a) {
                                var b = /([a-z0-9$_]+)(=|@|>|%)([a-z0-9$_]+)/i.exec(a);
                                if (!b)
                                    throw new Error("Can't understand property map: " + a);
                                var c = "M." + b[1]
                                    , d = b[2]
                                    , e = b[3];
                                if (g += ",\n" + e + ": ",
                                    "@" == d)
                                    g += c + ".map(from_moz)";
                                else if (">" == d)
                                    g += "from_moz(" + c + ")";
                                else if ("=" == d)
                                    g += c;
                                else {
                                    if ("%" != d)
                                        throw new Error("Can't understand operator in propmap: " + a);
                                    g += "from_moz(" + c + ").body"
                                }
                            }),
                            g += "\n})}",
                            g = new Function("mytype", "my_start_token", "my_end_token", "from_moz", "return(" + g + ")")(c, d, e, h),
                            a[b] = g
                    }
                    function h(b) {
                        g.push(b);
                        var c = null != b ? a[b.type](b) : null;
                        return g.pop(),
                            c
                    }
                    var a = {
                        TryStatement: function (a) {
                            return new kb({
                                start: d(a),
                                end: e(a),
                                body: h(a.block).body,
                                bcatch: h(a.handlers[0]),
                                bfinally: a.finalizer ? new mb(h(a.finalizer)) : null
                            })
                        },
                        CatchClause: function (a) {
                            return new lb({
                                start: d(a),
                                end: e(a),
                                argname: h(a.param),
                                body: h(a.body).body
                            })
                        },
                        ObjectExpression: function (a) {
                            return new Eb({
                                start: d(a),
                                end: e(a),
                                properties: a.properties.map(function (a) {
                                    var b = a.key
                                        , c = "Identifier" == b.type ? b.name : b.value
                                        , f = {
                                            start: d(b),
                                            end: e(a.value),
                                            key: c,
                                            value: h(a.value)
                                        };
                                    switch (a.kind) {
                                        case "init":
                                            return new Gb(f);
                                        case "set":
                                            return f.value.name = h(b),
                                                new Hb(f);
                                        case "get":
                                            return f.value.name = h(b),
                                                new Ib(f)
                                    }
                                })
                            })
                        },
                        SequenceExpression: function (a) {
                            return tb.from_array(a.expressions.map(h))
                        },
                        MemberExpression: function (a) {
                            return new (a.computed ? wb : vb)({
                                start: d(a),
                                end: e(a),
                                property: a.computed ? h(a.property) : a.property.name,
                                expression: h(a.object)
                            })
                        },
                        SwitchCase: function (a) {
                            return new (a.test ? jb : ib)({
                                start: d(a),
                                end: e(a),
                                expression: h(a.test),
                                body: a.consequent.map(h)
                            })
                        },
                        Literal: function (a) {
                            var b = a.value
                                , c = {
                                    start: d(a),
                                    end: e(a)
                                };
                            if (null === b)
                                return new _b(c);
                            switch (typeof b) {
                                case "string":
                                    return c.value = b,
                                        new Xb(c);
                                case "number":
                                    return c.value = b,
                                        new Yb(c);
                                case "boolean":
                                    return new (b ? gc : fc)(c);
                                default:
                                    return c.value = b,
                                        new Zb(c)
                            }
                        },
                        UnaryExpression: b,
                        UpdateExpression: b,
                        Identifier: function (a) {
                            var b = g[g.length - 2];
                            return new ("this" == a.name ? Vb : "LabeledStatement" == b.type ? Sb : "VariableDeclarator" == b.type && b.id === a ? "const" == b.kind ? Nb : Mb : "FunctionExpression" == b.type ? b.id === a ? Qb : Ob : "FunctionDeclaration" == b.type ? b.id === a ? Pb : Ob : "CatchClause" == b.type ? Rb : "BreakStatement" == b.type || "ContinueStatement" == b.type ? Ub : Tb)({
                                start: d(a),
                                end: e(a),
                                name: a.name
                            })
                        }
                    };
                    f("Node", C),
                        f("Program", V, "body@body"),
                        f("Function", Y, "id>name, params@argnames, body%body"),
                        f("EmptyStatement", K),
                        f("BlockStatement", J, "body@body"),
                        f("ExpressionStatement", G, "expression>body"),
                        f("IfStatement", fb, "test>condition, consequent>body, alternate>alternative"),
                        f("LabeledStatement", M, "label>label, body>body"),
                        f("BreakStatement", db, "label>label"),
                        f("ContinueStatement", eb, "label>label"),
                        f("WithStatement", T, "object>expression, body>body"),
                        f("SwitchStatement", gb, "discriminant>expression, cases@body"),
                        f("ReturnStatement", ab, "argument>value"),
                        f("ThrowStatement", bb, "argument>value"),
                        f("WhileStatement", Q, "test>condition, body>body"),
                        f("DoWhileStatement", P, "test>condition, body>body"),
                        f("ForStatement", R, "init>init, test>condition, update>step, body>body"),
                        f("ForInStatement", S, "left>init, right>object, body>body"),
                        f("DebuggerStatement", E),
                        f("FunctionDeclaration", Z, "id>name, params@argnames, body%body"),
                        f("VariableDeclaration", ob, "declarations@definitions"),
                        f("VariableDeclarator", qb, "id>name, init>value"),
                        f("ThisExpression", Vb),
                        f("ArrayExpression", Db, "elements@elements"),
                        f("FunctionExpression", Y, "id>name, params@argnames, body%body"),
                        f("BinaryExpression", Ab, "operator=operator, left>left, right>right"),
                        f("AssignmentExpression", Cb, "operator=operator, left>left, right>right"),
                        f("LogicalExpression", Ab, "operator=operator, left>left, right>right"),
                        f("ConditionalExpression", Bb, "test>condition, consequent>consequent, alternate>alternative"),
                        f("NewExpression", sb, "callee>expression, arguments@args"),
                        f("CallExpression", rb, "callee>expression, arguments@args");
                    var g = null;
                    C.from_mozilla_ast = function (a) {
                        var b = g;
                        g = [];
                        var c = h(a);
                        return g = b,
                            c
                    }
                }(),
                c.sys = d,
                c.MOZ_SourceMap = e,
                c.UglifyJS = f,
                c.array_to_hash = g,
                c.slice = h,
                c.characters = i,
                c.member = j,
                c.find_if = k,
                c.repeat_string = l,
                c.DefaultsError = m,
                c.defaults = n,
                c.merge = o,
                c.noop = p,
                c.MAP = q,
                c.push_uniq = r,
                c.string_template = s,
                c.remove = t,
                c.mergeSort = u,
                c.set_difference = v,
                c.set_intersection = w,
                c.makePredicate = x,
                c.all = y,
                c.Dictionary = z,
                c.DEFNODE = A,
                c.AST_Token = B,
                c.AST_Node = C,
                c.AST_Statement = D,
                c.AST_Debugger = E,
                c.AST_Directive = F,
                c.AST_SimpleStatement = G,
                c.walk_body = H,
                c.AST_Block = I,
                c.AST_BlockStatement = J,
                c.AST_EmptyStatement = K,
                c.AST_StatementWithBody = L,
                c.AST_LabeledStatement = M,
                c.AST_IterationStatement = N,
                c.AST_DWLoop = O,
                c.AST_Do = P,
                c.AST_While = Q,
                c.AST_For = R,
                c.AST_ForIn = S,
                c.AST_With = T,
                c.AST_Scope = U,
                c.AST_Toplevel = V,
                c.AST_Lambda = W,
                c.AST_Accessor = X,
                c.AST_Function = Y,
                c.AST_Defun = Z,
                c.AST_Jump = $,
                c.AST_Exit = _,
                c.AST_Return = ab,
                c.AST_Throw = bb,
                c.AST_LoopControl = cb,
                c.AST_Break = db,
                c.AST_Continue = eb,
                c.AST_If = fb,
                c.AST_Switch = gb,
                c.AST_SwitchBranch = hb,
                c.AST_Default = ib,
                c.AST_Case = jb,
                c.AST_Try = kb,
                c.AST_Catch = lb,
                c.AST_Finally = mb,
                c.AST_Definitions = nb,
                c.AST_Var = ob,
                c.AST_Const = pb,
                c.AST_VarDef = qb,
                c.AST_Call = rb,
                c.AST_New = sb,
                c.AST_Seq = tb,
                c.AST_PropAccess = ub,
                c.AST_Dot = vb,
                c.AST_Sub = wb,
                c.AST_Unary = xb,
                c.AST_UnaryPrefix = yb,
                c.AST_UnaryPostfix = zb,
                c.AST_Binary = Ab,
                c.AST_Conditional = Bb,
                c.AST_Assign = Cb,
                c.AST_Array = Db,
                c.AST_Object = Eb,
                c.AST_ObjectProperty = Fb,
                c.AST_ObjectKeyVal = Gb,
                c.AST_ObjectSetter = Hb,
                c.AST_ObjectGetter = Ib,
                c.AST_Symbol = Jb,
                c.AST_SymbolAccessor = Kb,
                c.AST_SymbolDeclaration = Lb,
                c.AST_SymbolVar = Mb,
                c.AST_SymbolConst = Nb,
                c.AST_SymbolFunarg = Ob,
                c.AST_SymbolDefun = Pb,
                c.AST_SymbolLambda = Qb,
                c.AST_SymbolCatch = Rb,
                c.AST_Label = Sb,
                c.AST_SymbolRef = Tb,
                c.AST_LabelRef = Ub,
                c.AST_This = Vb,
                c.AST_Constant = Wb,
                c.AST_String = Xb,
                c.AST_Number = Yb,
                c.AST_RegExp = Zb,
                c.AST_Atom = $b,
                c.AST_Null = _b,
                c.AST_NaN = ac,
                c.AST_Undefined = bc,
                c.AST_Hole = cc,
                c.AST_Infinity = dc,
                c.AST_Boolean = ec,
                c.AST_False = fc,
                c.AST_True = gc,
                c.TreeWalker = hc,
                c.KEYWORDS = ic,
                c.KEYWORDS_ATOM = jc,
                c.RESERVED_WORDS = kc,
                c.KEYWORDS_BEFORE_EXPRESSION = lc,
                c.OPERATOR_CHARS = mc,
                c.RE_HEX_NUMBER = nc,
                c.RE_OCT_NUMBER = oc,
                c.RE_DEC_NUMBER = pc,
                c.OPERATORS = qc,
                c.WHITESPACE_CHARS = rc,
                c.PUNC_BEFORE_EXPRESSION = sc,
                c.PUNC_CHARS = tc,
                c.REGEXP_MODIFIERS = uc,
                c.UNICODE = vc,
                c.is_letter = wc,
                c.is_digit = xc,
                c.is_alphanumeric_char = yc,
                c.is_unicode_combining_mark = zc,
                c.is_unicode_connector_punctuation = Ac,
                c.is_identifier = Bc,
                c.is_identifier_start = Cc,
                c.is_identifier_char = Dc,
                c.is_identifier_string = Ec,
                c.parse_js_number = Fc,
                c.JS_Parse_Error = Gc,
                c.js_error = Hc,
                c.is_token = Ic,
                c.EX_EOF = Jc,
                c.tokenizer = Kc,
                c.UNARY_PREFIX = Lc,
                c.UNARY_POSTFIX = Mc,
                c.ASSIGNMENT = Nc,
                c.PRECEDENCE = Oc,
                c.STATEMENTS_WITH_LABELS = Pc,
                c.ATOMIC_START_TOKEN = Qc,
                c.parse = Rc,
                c.TreeTransformer = Sc,
                c.SymbolDef = Tc,
                c.base54 = Uc,
                c.OutputStream = Vc,
                c.Compressor = Wc,
                c.SourceMap = Xc,
                c.AST_Node.warn_function = function (a) {
                    "undefined" != typeof console && "function" == typeof console.warn && console.warn(a)
                }
                ,
                c.minify = function (a, b) {
                    b = f.defaults(b, {
                        spidermonkey: !1,
                        outSourceMap: null,
                        sourceRoot: null,
                        inSourceMap: null,
                        fromString: !1,
                        warnings: !1,
                        mangle: {},
                        output: null,
                        compress: {}
                    }),
                        f.base54.reset();
                    var c = null;
                    if (b.spidermonkey ? c = f.AST_Node.from_mozilla_ast(a) : ("string" == typeof a && (a = [a]),
                        a.forEach(function (a) {
                            var d = b.fromString ? a : fs.readFileSync(a, "utf8");
                            c = f.parse(d, {
                                filename: b.fromString ? "?" : a,
                                toplevel: c
                            })
                        })),
                        b.compress) {
                        var d = {
                            warnings: b.warnings
                        };
                        f.merge(d, b.compress),
                            c.figure_out_scope();
                        var e = f.Compressor(d);
                        c = c.transform(e)
                    }
                    b.mangle && (c.figure_out_scope(),
                        c.compute_char_frequency(),
                        c.mangle_names(b.mangle));
                    var g = b.inSourceMap
                        , h = {};
                    "string" == typeof b.inSourceMap && (g = fs.readFileSync(b.inSourceMap, "utf8")),
                        b.outSourceMap && (h.source_map = f.SourceMap({
                            file: b.outSourceMap,
                            orig: g,
                            root: b.sourceRoot
                        })),
                        b.output && f.merge(h, b.output);
                    var i = f.OutputStream(h);
                    return c.print(i),
                        {
                            code: i + "",
                            map: h.source_map + ""
                        }
                }
                ,
                c.describe_ast = function () {
                    function b(c) {
                        a.print("AST_" + c.TYPE);
                        var d = c.SELF_PROPS.filter(function (a) {
                            return !/^\$/.test(a)
                        });
                        d.length > 0 && (a.space(),
                            a.with_parens(function () {
                                d.forEach(function (b, c) {
                                    c && a.space(),
                                        a.print(b)
                                })
                            })),
                            c.documentation && (a.space(),
                                a.print_string(c.documentation)),
                            c.SUBCLASSES.length > 0 && (a.space(),
                                a.with_block(function () {
                                    c.SUBCLASSES.forEach(function (c) {
                                        a.indent(),
                                            b(c),
                                            a.newline()
                                    })
                                }))
                    }
                    var a = f.OutputStream({
                        beautify: !0
                    });
                    return b(f.AST_Node),
                        a + ""
                }
        }
            , {
            "source-map": 34,
            util: 31
        }],
        45: [function (a, b) {
            b.exports = ["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "menuitem", "meta", "param", "source", "track", "wbr"]
        }
            , {}],
        46: [function (a, b) {
            "use strict";
            function e(a, b, c) {
                a += "",
                    b += "",
                    c = c || [],
                    c = c.concat(f(a));
                var d = f(b).filter(function (a) {
                    return -1 === c.indexOf(a)
                });
                if (0 === d.length)
                    return b;
                var e = ""
                    , h = "locals_for_with"
                    , i = "result_of_with";
                if (/^[a-zA-Z0-9$_]+$/.test(a))
                    h = a;
                else {
                    for (; -1 != d.indexOf(h) || -1 != c.indexOf(h);)
                        h += "_";
                    e = "var " + h + " = (" + a + ")"
                }
                for (; -1 != d.indexOf(i) || -1 != c.indexOf(i);)
                    i += "_";
                var j = d.map(function (a) {
                    return JSON.stringify(a) + " in " + h + "?" + h + "." + a + ":" + "typeof " + a + '!=="undefined"?' + a + ":undefined"
                });
                return b = "(function (" + d.join(", ") + ") {" + b + "}(" + j.join(",") + "))",
                    ";" + e + ";" + g(b, i) + ";"
            }
            function f(a) {
                var b = d.parse("(function () {" + a + "}())");
                b.figure_out_scope();
                var c = b.globals.map(function (a, b) {
                    return b
                });
                return c
            }
            function g(a, b) {
                function i(a, b) {
                    return a === g || "Defun" !== a.TYPE && "Function" !== a.TYPE ? "Return" === a.TYPE ? (b(),
                        e = !0,
                        k(a, "return {value: " + j(a.value) + "};"),
                        !0) : void 0 : !0
                }
                function j(b) {
                    return a.slice(b.start.pos, b.end.endpos).join("")
                }
                function k(b, c) {
                    for (var d = b.start.pos; d < b.end.endpos; d++)
                        a[d] = "";
                    a[b.start.pos] = c
                }
                var c = a
                    , e = !1
                    , f = d.parse(a);
                if (a = a.split(""),
                    1 !== f.body.length || "SimpleStatement" !== f.body[0].TYPE || "Call" !== f.body[0].body.TYPE || "Function" !== f.body[0].body.expression.TYPE)
                    throw new Error("AST does not seem to represent a self-calling function");
                var g = f.body[0].body.expression
                    , h = new d.TreeWalker(i);
                return f.walk(h),
                    e ? "var " + b + "=" + a.join("") + ";if (" + b + ") return " + b + ".value" : c
            }
            var d = a("uglify-js");
            b.exports = e
        }
            , {
            "uglify-js": 44
        }]
    }, {}, [5])(5)
});

export default jade;

/*eslint-disable*/
