(() => {
    var e = {
            18257: (e, t, r) => {
                var n = r(47583),
                    o = r(9212),
                    a = r(75637),
                    i = n.TypeError;
                e.exports = function (e) {
                    if (o(e)) return e;
                    throw i(a(e) + " is not a function")
                }
            },
            41186: (e, t, r) => {
                var n = r(47583),
                    o = r(62097),
                    a = r(75637),
                    i = n.TypeError;
                e.exports = function (e) {
                    if (o(e)) return e;
                    throw i(a(e) + " is not a constructor")
                }
            },
            79882: (e, t, r) => {
                var n = r(47583),
                    o = r(9212),
                    a = n.String,
                    i = n.TypeError;
                e.exports = function (e) {
                    if ("object" == typeof e || o(e)) return e;
                    throw i("Can't set " + a(e) + " as a prototype")
                }
            },
            96733: (e, t, r) => {
                "use strict";
                var n = r(96389).charAt;
                e.exports = function (e, t, r) {
                    return t + (r ? n(e, t).length : 1)
                }
            },
            44761: (e, t, r) => {
                var n = r(47583),
                    o = r(22447),
                    a = n.TypeError;
                e.exports = function (e, t) {
                    if (o(t, e)) return e;
                    throw a("Incorrect invocation")
                }
            },
            92569: (e, t, r) => {
                var n = r(47583),
                    o = r(90794),
                    a = n.String,
                    i = n.TypeError;
                e.exports = function (e) {
                    if (o(e)) return e;
                    throw i(a(e) + " is not an object")
                }
            },
            15766: (e, t, r) => {
                var n = r(22977),
                    o = r(96782),
                    a = r(1825),
                    i = function (e) {
                        return function (t, r, i) {
                            var s, c = n(t),
                                u = a(c),
                                p = o(i, u);
                            if (e && r != r) {
                                for (; u > p;)
                                    if ((s = c[p++]) != s) return !0
                            } else
                                for (; u > p; p++)
                                    if ((e || p in c) && c[p] === r)
                                        return e || p || 0;
                            return !e && -1
                        }
                    };
                e.exports = {
                    includes: i(!0),
                    indexOf: i(!1)
                }
            },
            46917: (e, t, r) => {
                var n = r(7386);
                e.exports = n([].slice)
            },
            3616: (e, t, r) => {
                var n = r(3649)("iterator"),
                    o = !1;
                try {
                    var a = 0,
                        i = {
                            next: function () {
                                return {
                                    done: !!a++
                                }
                            },
                            return: function () {
                                o = !0
                            }
                        };
                    i[n] = function () {
                        return this
                    }, Array.from(i, (function () {
                        throw 2
                    }))
                } catch (e) {}
                e.exports = function (e, t) {
                    if (!t && !o) return !1;
                    var r = !1;
                    try {
                        var a = {};
                        a[n] = function () {
                            return {
                                next: function () {
                                    return {
                                        done: r = !0
                                    }
                                }
                            }
                        }, e(a)
                    } catch (e) {}
                    return r
                }
            },
            39624: (e, t, r) => {
                var n = r(7386),
                    o = n({}.toString),
                    a = n("".slice);
                e.exports = function (e) {
                    return a(o(e), 8, -1)
                }
            },
            33058: (e, t, r) => {
                var n = r(47583),
                    o = r(88191),
                    a = r(9212),
                    i = r(39624),
                    s = r(3649)("toStringTag"),
                    c = n.Object,
                    u = "Arguments" == i(function () {
                        return arguments
                    }());
                e.exports = o ? i : function (e) {
                    var t, r, n;
                    return void 0 === e ? "Undefined" : null === e ?
                        "Null" : "string" == typeof (r = function (
                            e, t) {
                            try {
                                return e[t]
                            } catch (e) {}
                        }(t = c(e), s)) ? r : u ? i(t) : "Object" ==
                        (n = i(t)) && a(t.callee) ? "Arguments" : n
                }
            },
            83478: (e, t, r) => {
                var n = r(62870),
                    o = r(40929),
                    a = r(46683),
                    i = r(94615);
                e.exports = function (e, t, r) {
                    for (var s = o(t), c = i.f, u = a.f, p = 0; p <
                        s.length; p++) {
                        var l = s[p];
                        n(e, l) || r && n(r, l) || c(e, l, u(t, l))
                    }
                }
            },
            57: (e, t, r) => {
                var n = r(18494),
                    o = r(94615),
                    a = r(54677);
                e.exports = n ? function (e, t, r) {
                    return o.f(e, t, a(1, r))
                } : function (e, t, r) {
                    return e[t] = r, e
                }
            },
            54677: e => {
                e.exports = function (e, t) {
                    return {
                        enumerable: !(1 & e),
                        configurable: !(2 & e),
                        writable: !(4 & e),
                        value: t
                    }
                }
            },
            18494: (e, t, r) => {
                var n = r(16544);
                e.exports = !n((function () {
                    return 7 != Object.defineProperty({},
                    1, {
                        get: function () {
                            return 7
                        }
                    })[1]
                }))
            },
            26668: (e, t, r) => {
                var n = r(47583),
                    o = r(90794),
                    a = n.document,
                    i = o(a) && o(a.createElement);
                e.exports = function (e) {
                    return i ? a.createElement(e) : {}
                }
            },
            12274: e => {
                e.exports = "object" == typeof window
            },
            63256: (e, t, r) => {
                var n = r(46918),
                    o = r(47583);
                e.exports = /ipad|iphone|ipod/i.test(n) && void 0 !== o
                    .Pebble
            },
            17020: (e, t, r) => {
                var n = r(46918);
                e.exports = /(?:ipad|iphone|ipod).*applewebkit/i.test(n)
            },
            45354: (e, t, r) => {
                var n = r(39624),
                    o = r(47583);
                e.exports = "process" == n(o.process)
            },
            86846: (e, t, r) => {
                var n = r(46918);
                e.exports = /web0s(?!.*chrome)/i.test(n)
            },
            46918: (e, t, r) => {
                var n = r(35897);
                e.exports = n("navigator", "userAgent") || ""
            },
            24061: (e, t, r) => {
                var n, o, a = r(47583),
                    i = r(46918),
                    s = a.process,
                    c = a.Deno,
                    u = s && s.versions || c && c.version,
                    p = u && u.v8;
                p && (o = (n = p.split("."))[0] > 0 && n[0] < 4 ? 1 : +(
                    n[0] + n[1])), !o && i && (!(n = i.match(
                    /Edge\/(\d+)/)) || n[1] >= 74) && (n = i.match(
                    /Chrome\/(\d+)/)) && (o = +n[1]), e.exports = o
            },
            15690: e => {
                e.exports = ["constructor", "hasOwnProperty",
                    "isPrototypeOf", "propertyIsEnumerable",
                    "toLocaleString", "toString", "valueOf"
                ]
            },
            37263: (e, t, r) => {
                var n = r(47583),
                    o = r(46683).f,
                    a = r(57),
                    i = r(61270),
                    s = r(50460),
                    c = r(83478),
                    u = r(34451);
                e.exports = function (e, t) {
                    var r, p, l, f, h, d = e.target,
                        v = e.global,
                        m = e.stat;
                    if (r = v ? n : m ? n[d] || s(d, {}) : (n[d] ||
                        {}).prototype)
                        for (p in t) {
                            if (f = t[p], l = e.noTargetGet ? (h =
                                    o(r, p)) && h.value : r[p], !u(
                                    v ? p : d + (m ? "." : "#") + p,
                                    e.forced) && void 0 !== l) {
                                if (typeof f == typeof l) continue;
                                c(f, l)
                            }(e.sham || l && l.sham) && a(f, "sham",
                                !0), i(r, p, f, e)
                        }
                }
            },
            16544: e => {
                e.exports = function (e) {
                    try {
                        return !!e()
                    } catch (e) {
                        return !0
                    }
                }
            },
            90783: (e, t, r) => {
                "use strict";
                r(62322);
                var n = r(7386),
                    o = r(61270),
                    a = r(48445),
                    i = r(16544),
                    s = r(3649),
                    c = r(57),
                    u = s("species"),
                    p = RegExp.prototype;
                e.exports = function (e, t, r, l) {
                    var f = s(e),
                        h = !i((function () {
                            var t = {};
                            return t[f] = function () {
                                return 7
                            }, 7 != "" [e](t)
                        })),
                        d = h && !i((function () {
                            var t = !1,
                                r = /a/;
                            return "split" === e && ((
                                        r = {})
                                    .constructor = {}, r
                                    .constructor[u] =
                                    function () {
                                        return r
                                    }, r.flags = "", r[f] =
                                    /./ [f]), r.exec =
                                function () {
                                    return t = !0, null
                                }, r[f](""), !t
                        }));
                    if (!h || !d || r) {
                        var v = n(/./ [f]),
                            m = t(f, "" [e], (function (e, t, r, o,
                                i) {
                                var s = n(e),
                                    c = t.exec;
                                return c === a || c === p
                                    .exec ? h && !i ? {
                                        done: !0,
                                        value: v(t, r, o)
                                    } : {
                                        done: !0,
                                        value: s(r, t, o)
                                    } : {
                                        done: !1
                                    }
                            }));
                        o(String.prototype, e, m[0]), o(p, f, m[1])
                    }
                    l && c(p[f], "sham", !0)
                }
            },
            71611: (e, t, r) => {
                var n = r(88987),
                    o = Function.prototype,
                    a = o.apply,
                    i = o.call;
                e.exports = "object" == typeof Reflect && Reflect
                    .apply || (n ? i.bind(a) : function () {
                        return i.apply(a, arguments)
                    })
            },
            12938: (e, t, r) => {
                var n = r(7386),
                    o = r(18257),
                    a = r(88987),
                    i = n(n.bind);
                e.exports = function (e, t) {
                    return o(e), void 0 === t ? e : a ? i(e, t) :
                        function () {
                            return e.apply(t, arguments)
                        }
                }
            },
            88987: (e, t, r) => {
                var n = r(16544);
                e.exports = !n((function () {
                    var e = function () {}.bind();
                    return "function" != typeof e || e
                        .hasOwnProperty("prototype")
                }))
            },
            38262: (e, t, r) => {
                var n = r(88987),
                    o = Function.prototype.call;
                e.exports = n ? o.bind(o) : function () {
                    return o.apply(o, arguments)
                }
            },
            14340: (e, t, r) => {
                var n = r(18494),
                    o = r(62870),
                    a = Function.prototype,
                    i = n && Object.getOwnPropertyDescriptor,
                    s = o(a, "name"),
                    c = s && "something" === function () {}.name,
                    u = s && (!n || n && i(a, "name").configurable);
                e.exports = {
                    EXISTS: s,
                    PROPER: c,
                    CONFIGURABLE: u
                }
            },
            7386: (e, t, r) => {
                var n = r(88987),
                    o = Function.prototype,
                    a = o.bind,
                    i = o.call,
                    s = n && a.bind(i, i);
                e.exports = n ? function (e) {
                    return e && s(e)
                } : function (e) {
                    return e && function () {
                        return i.apply(e, arguments)
                    }
                }
            },
            35897: (e, t, r) => {
                var n = r(47583),
                    o = r(9212),
                    a = function (e) {
                        return o(e) ? e : void 0
                    };
                e.exports = function (e, t) {
                    return arguments.length < 2 ? a(n[e]) : n[e] &&
                        n[e][t]
                }
            },
            38272: (e, t, r) => {
                var n = r(33058),
                    o = r(60911),
                    a = r(60339),
                    i = r(3649)("iterator");
                e.exports = function (e) {
                    if (null != e) return o(e, i) || o(e,
                        "@@iterator") || a[n(e)]
                }
            },
            36307: (e, t, r) => {
                var n = r(47583),
                    o = r(38262),
                    a = r(18257),
                    i = r(92569),
                    s = r(75637),
                    c = r(38272),
                    u = n.TypeError;
                e.exports = function (e, t) {
                    var r = arguments.length < 2 ? c(e) : t;
                    if (a(r)) return i(o(r, e));
                    throw u(s(e) + " is not iterable")
                }
            },
            60911: (e, t, r) => {
                var n = r(18257);
                e.exports = function (e, t) {
                    var r = e[t];
                    return null == r ? void 0 : n(r)
                }
            },
            4305: (e, t, r) => {
                var n = r(7386),
                    o = r(61324),
                    a = Math.floor,
                    i = n("".charAt),
                    s = n("".replace),
                    c = n("".slice),
                    u = /\$([$&'`]|\d{1,2}|<[^>]*>)/g,
                    p = /\$([$&'`]|\d{1,2})/g;
                e.exports = function (e, t, r, n, l, f) {
                    var h = r + e.length,
                        d = n.length,
                        v = p;
                    return void 0 !== l && (l = o(l), v = u), s(f,
                        v, (function (o, s) {
                            var u;
                            switch (i(s, 0)) {
                                case "$":
                                    return "$";
                                case "&":
                                    return e;
                                case "`":
                                    return c(t, 0, r);
                                case "'":
                                    return c(t, h);
                                case "<":
                                    u = l[c(s, 1, -1)];
                                    break;
                                default:
                                    var p = +s;
                                    if (0 === p) return o;
                                    if (p > d) {
                                        var f = a(p / 10);
                                        return 0 === f ? o :
                                            f <= d ?
                                            void 0 === n[f -
                                                1] ? i(s,
                                            1) : n[f - 1] +
                                            i(s, 1) : o
                                    }
                                    u = n[p - 1]
                            }
                            return void 0 === u ? "" : u
                        }))
                }
            },
            47583: (e, t, r) => {
                var n = function (e) {
                    return e && e.Math == Math && e
                };
                e.exports = n("object" == typeof globalThis &&
                        globalThis) || n("object" == typeof window &&
                        window) || n("object" == typeof self && self) ||
                    n("object" == typeof r.g && r.g) || function () {
                        return this
                    }() || Function("return this")()
            },
            62870: (e, t, r) => {
                var n = r(7386),
                    o = r(61324),
                    a = n({}.hasOwnProperty);
                e.exports = Object.hasOwn || function (e, t) {
                    return a(o(e), t)
                }
            },
            64639: e => {
                e.exports = {}
            },
            92716: (e, t, r) => {
                var n = r(47583);
                e.exports = function (e, t) {
                    var r = n.console;
                    r && r.error && (1 == arguments.length ? r
                        .error(e) : r.error(e, t))
                }
            },
            90482: (e, t, r) => {
                var n = r(35897);
                e.exports = n("document", "documentElement")
            },
            275: (e, t, r) => {
                var n = r(18494),
                    o = r(16544),
                    a = r(26668);
                e.exports = !n && !o((function () {
                    return 7 != Object.defineProperty(a(
                        "div"), "a", {
                        get: function () {
                            return 7
                        }
                    }).a
                }))
            },
            55044: (e, t, r) => {
                var n = r(47583),
                    o = r(7386),
                    a = r(16544),
                    i = r(39624),
                    s = n.Object,
                    c = o("".split);
                e.exports = a((function () {
                    return !s("z").propertyIsEnumerable(0)
                })) ? function (e) {
                    return "String" == i(e) ? c(e, "") : s(e)
                } : s
            },
            69734: (e, t, r) => {
                var n = r(7386),
                    o = r(9212),
                    a = r(31314),
                    i = n(Function.toString);
                o(a.inspectSource) || (a.inspectSource = function (e) {
                    return i(e)
                }), e.exports = a.inspectSource
            },
            42743: (e, t, r) => {
                var n, o, a, i = r(89491),
                    s = r(47583),
                    c = r(7386),
                    u = r(90794),
                    p = r(57),
                    l = r(62870),
                    f = r(31314),
                    h = r(89137),
                    d = r(64639),
                    v = "Object already initialized",
                    m = s.TypeError,
                    y = s.WeakMap;
                if (i || f.state) {
                    var g = f.state || (f.state = new y),
                        w = c(g.get),
                        x = c(g.has),
                        b = c(g.set);
                    n = function (e, t) {
                        if (x(g, e)) throw new m(v);
                        return t.facade = e, b(g, e, t), t
                    }, o = function (e) {
                        return w(g, e) || {}
                    }, a = function (e) {
                        return x(g, e)
                    }
                } else {
                    var k = h("state");
                    d[k] = !0, n = function (e, t) {
                        if (l(e, k)) throw new m(v);
                        return t.facade = e, p(e, k, t), t
                    }, o = function (e) {
                        return l(e, k) ? e[k] : {}
                    }, a = function (e) {
                        return l(e, k)
                    }
                }
                e.exports = {
                    set: n,
                    get: o,
                    has: a,
                    enforce: function (e) {
                        return a(e) ? o(e) : n(e, {})
                    },
                    getterFor: function (e) {
                        return function (t) {
                            var r;
                            if (!u(t) || (r = o(t)).type !==
                                e) throw m(
                                "Incompatible receiver, " +
                                e + " required");
                            return r
                        }
                    }
                }
            },
            70114: (e, t, r) => {
                var n = r(3649),
                    o = r(60339),
                    a = n("iterator"),
                    i = Array.prototype;
                e.exports = function (e) {
                    return void 0 !== e && (o.Array === e || i[
                        a] === e)
                }
            },
            9212: e => {
                e.exports = function (e) {
                    return "function" == typeof e
                }
            },
            62097: (e, t, r) => {
                var n = r(7386),
                    o = r(16544),
                    a = r(9212),
                    i = r(33058),
                    s = r(35897),
                    c = r(69734),
                    u = function () {},
                    p = [],
                    l = s("Reflect", "construct"),
                    f = /^\s*(?:class|function)\b/,
                    h = n(f.exec),
                    d = !f.exec(u),
                    v = function (e) {
                        if (!a(e)) return !1;
                        try {
                            return l(u, p, e), !0
                        } catch (e) {
                            return !1
                        }
                    },
                    m = function (e) {
                        if (!a(e)) return !1;
                        switch (i(e)) {
                            case "AsyncFunction":
                            case "GeneratorFunction":
                            case "AsyncGeneratorFunction":
                                return !1
                        }
                        try {
                            return d || !!h(f, c(e))
                        } catch (e) {
                            return !0
                        }
                    };
                m.sham = !0, e.exports = !l || o((function () {
                    var e;
                    return v(v.call) || !v(Object) || !v((
                        function () {
                            e = !0
                        })) || e
                })) ? m : v
            },
            34451: (e, t, r) => {
                var n = r(16544),
                    o = r(9212),
                    a = /#|\.prototype\./,
                    i = function (e, t) {
                        var r = c[s(e)];
                        return r == p || r != u && (o(t) ? n(t) : !!t)
                    },
                    s = i.normalize = function (e) {
                        return String(e).replace(a, ".").toLowerCase()
                    },
                    c = i.data = {},
                    u = i.NATIVE = "N",
                    p = i.POLYFILL = "P";
                e.exports = i
            },
            90794: (e, t, r) => {
                var n = r(9212);
                e.exports = function (e) {
                    return "object" == typeof e ? null !== e : n(e)
                }
            },
            86268: e => {
                e.exports = !1
            },
            35871: (e, t, r) => {
                var n = r(47583),
                    o = r(35897),
                    a = r(9212),
                    i = r(22447),
                    s = r(67786),
                    c = n.Object;
                e.exports = s ? function (e) {
                    return "symbol" == typeof e
                } : function (e) {
                    var t = o("Symbol");
                    return a(t) && i(t.prototype, c(e))
                }
            },
            54026: (e, t, r) => {
                var n = r(47583),
                    o = r(12938),
                    a = r(38262),
                    i = r(92569),
                    s = r(75637),
                    c = r(70114),
                    u = r(1825),
                    p = r(22447),
                    l = r(36307),
                    f = r(38272),
                    h = r(47093),
                    d = n.TypeError,
                    v = function (e, t) {
                        this.stopped = e, this.result = t
                    },
                    m = v.prototype;
                e.exports = function (e, t, r) {
                    var n, y, g, w, x, b, k, T = r && r.that,
                        E = !(!r || !r.AS_ENTRIES),
                        O = !(!r || !r.IS_ITERATOR),
                        j = !(!r || !r.INTERRUPTED),
                        S = o(t, T),
                        P = function (e) {
                            return n && h(n, "normal", e), new v(!0,
                                e)
                        },
                        I = function (e) {
                            return E ? (i(e), j ? S(e[0], e[1], P) :
                                    S(e[0], e[1])) : j ? S(e, P) :
                                S(e)
                        };
                    if (O) n = e;
                    else {
                        if (!(y = f(e))) throw d(s(e) +
                            " is not iterable");
                        if (c(y)) {
                            for (g = 0, w = u(e); w > g; g++)
                                if ((x = I(e[g])) && p(m, x))
                                return x;
                            return new v(!1)
                        }
                        n = l(e, y)
                    }
                    for (b = n.next; !(k = a(b, n)).done;) {
                        try {
                            x = I(k.value)
                        } catch (e) {
                            h(n, "throw", e)
                        }
                        if ("object" == typeof x && x && p(m, x))
                            return x
                    }
                    return new v(!1)
                }
            },
            47093: (e, t, r) => {
                var n = r(38262),
                    o = r(92569),
                    a = r(60911);
                e.exports = function (e, t, r) {
                    var i, s;
                    o(e);
                    try {
                        if (!(i = a(e, "return"))) {
                            if ("throw" === t) throw r;
                            return r
                        }
                        i = n(i, e)
                    } catch (e) {
                        s = !0, i = e
                    }
                    if ("throw" === t) throw r;
                    if (s) throw i;
                    return o(i), r
                }
            },
            60339: e => {
                e.exports = {}
            },
            1825: (e, t, r) => {
                var n = r(70097);
                e.exports = function (e) {
                    return n(e.length)
                }
            },
            92095: (e, t, r) => {
                var n, o, a, i, s, c, u, p, l = r(47583),
                    f = r(12938),
                    h = r(46683).f,
                    d = r(48117).set,
                    v = r(17020),
                    m = r(63256),
                    y = r(86846),
                    g = r(45354),
                    w = l.MutationObserver || l.WebKitMutationObserver,
                    x = l.document,
                    b = l.process,
                    k = l.Promise,
                    T = h(l, "queueMicrotask"),
                    E = T && T.value;
                E || (n = function () {
                        var e, t;
                        for (g && (e = b.domain) && e.exit(); o;) {
                            t = o.fn, o = o.next;
                            try {
                                t()
                            } catch (e) {
                                throw o ? i() : a = void 0, e
                            }
                        }
                        a = void 0, e && e.enter()
                    }, v || g || y || !w || !x ? !m && k && k
                    .resolve ? ((u = k.resolve(void 0))
                        .constructor = k, p = f(u.then, u), i =
                        function () {
                            p(n)
                        }) : g ? i = function () {
                        b.nextTick(n)
                    } : (d = f(d, l), i = function () {
                        d(n)
                    }) : (s = !0, c = x.createTextNode(""), new w(n)
                        .observe(c, {
                            characterData: !0
                        }), i = function () {
                            c.data = s = !s
                        })), e.exports = E || function (e) {
                    var t = {
                        fn: e,
                        next: void 0
                    };
                    a && (a.next = t), o || (o = t, i()), a = t
                }
            },
            40783: (e, t, r) => {
                var n = r(47583);
                e.exports = n.Promise
            },
            88640: (e, t, r) => {
                var n = r(24061),
                    o = r(16544);
                e.exports = !!Object.getOwnPropertySymbols && !o((
                    function () {
                        var e = Symbol();
                        return !String(e) || !(Object(
                                e) instanceof Symbol) || !Symbol
                            .sham && n && n < 41
                    }))
            },
            89491: (e, t, r) => {
                var n = r(47583),
                    o = r(9212),
                    a = r(69734),
                    i = n.WeakMap;
                e.exports = o(i) && /native code/.test(a(i))
            },
            5084: (e, t, r) => {
                "use strict";
                var n = r(18257),
                    o = function (e) {
                        var t, r;
                        this.promise = new e((function (e, n) {
                            if (void 0 !== t || void 0 !==
                                r) throw TypeError(
                                "Bad Promise constructor"
                                );
                            t = e, r = n
                        })), this.resolve = n(t), this.reject = n(r)
                    };
                e.exports.f = function (e) {
                    return new o(e)
                }
            },
            3590: (e, t, r) => {
                var n, o = r(92569),
                    a = r(28728),
                    i = r(15690),
                    s = r(64639),
                    c = r(90482),
                    u = r(26668),
                    p = r(89137)("IE_PROTO"),
                    l = function () {},
                    f = function (e) {
                        return "<script>" + e + "<\/script>"
                    },
                    h = function (e) {
                        e.write(f("")), e.close();
                        var t = e.parentWindow.Object;
                        return e = null, t
                    },
                    d = function () {
                        try {
                            n = new ActiveXObject("htmlfile")
                        } catch (e) {}
                        var e, t;
                        d = "undefined" != typeof document ? document
                            .domain && n ? h(n) : ((t = u("iframe"))
                                .style.display = "none", c.appendChild(
                                    t), t.src = String("javascript:"), (
                                    e = t.contentWindow.document)
                            .open(), e.write(f("document.F=Object")), e
                                .close(), e.F) : h(n);
                        for (var r = i.length; r--;) delete d.prototype[
                            i[r]];
                        return d()
                    };
                s[p] = !0, e.exports = Object.create || function (e,
                t) {
                    var r;
                    return null !== e ? (l.prototype = o(e), r =
                            new l, l.prototype = null, r[p] = e) :
                        r = d(), void 0 === t ? r : a.f(r, t)
                }
            },
            28728: (e, t, r) => {
                var n = r(18494),
                    o = r(7670),
                    a = r(94615),
                    i = r(92569),
                    s = r(22977),
                    c = r(75432);
                t.f = n && !o ? Object.defineProperties : function (e,
                    t) {
                    i(e);
                    for (var r, n = s(t), o = c(t), u = o.length,
                            p = 0; u > p;) a.f(e, r = o[p++], n[r]);
                    return e
                }
            },
            94615: (e, t, r) => {
                var n = r(47583),
                    o = r(18494),
                    a = r(275),
                    i = r(7670),
                    s = r(92569),
                    c = r(98734),
                    u = n.TypeError,
                    p = Object.defineProperty,
                    l = Object.getOwnPropertyDescriptor;
                t.f = o ? i ? function (e, t, r) {
                    if (s(e), t = c(t), s(r), "function" ==
                        typeof e && "prototype" === t && "value" in
                        r && "writable" in r && !r.writable) {
                        var n = l(e, t);
                        n && n.writable && (e[t] = r.value, r = {
                            configurable: "configurable" in
                                r ? r.configurable : n
                                .configurable,
                            enumerable: "enumerable" in r ?
                                r.enumerable : n.enumerable,
                            writable: !1
                        })
                    }
                    return p(e, t, r)
                } : p : function (e, t, r) {
                    if (s(e), t = c(t), s(r), a) try {
                        return p(e, t, r)
                    } catch (e) {}
                    if ("get" in r || "set" in r) throw u(
                        "Accessors not supported");
                    return "value" in r && (e[t] = r.value), e
                }
            },
            46683: (e, t, r) => {
                var n = r(18494),
                    o = r(38262),
                    a = r(20112),
                    i = r(54677),
                    s = r(22977),
                    c = r(98734),
                    u = r(62870),
                    p = r(275),
                    l = Object.getOwnPropertyDescriptor;
                t.f = n ? l : function (e, t) {
                    if (e = s(e), t = c(t), p) try {
                        return l(e, t)
                    } catch (e) {}
                    if (u(e, t)) return i(!o(a.f, e, t), e[t])
                }
            },
            9275: (e, t, r) => {
                var n = r(98356),
                    o = r(15690).concat("length", "prototype");
                t.f = Object.getOwnPropertyNames || function (e) {
                    return n(e, o)
                }
            },
            74012: (e, t) => {
                t.f = Object.getOwnPropertySymbols
            },
            22447: (e, t, r) => {
                var n = r(7386);
                e.exports = n({}.isPrototypeOf)
            },
            98356: (e, t, r) => {
                var n = r(7386),
                    o = r(62870),
                    a = r(22977),
                    i = r(15766).indexOf,
                    s = r(64639),
                    c = n([].push);
                e.exports = function (e, t) {
                    var r, n = a(e),
                        u = 0,
                        p = [];
                    for (r in n) !o(s, r) && o(n, r) && c(p, r);
                    for (; t.length > u;) o(n, r = t[u++]) && (~i(p,
                        r) || c(p, r));
                    return p
                }
            },
            75432: (e, t, r) => {
                var n = r(98356),
                    o = r(15690);
                e.exports = Object.keys || function (e) {
                    return n(e, o)
                }
            },
            20112: (e, t) => {
                "use strict";
                var r = {}.propertyIsEnumerable,
                    n = Object.getOwnPropertyDescriptor,
                    o = n && !r.call({
                        1: 2
                    }, 1);
                t.f = o ? function (e) {
                    var t = n(this, e);
                    return !!t && t.enumerable
                } : r
            },
            17496: (e, t, r) => {
                var n = r(7386),
                    o = r(92569),
                    a = r(79882);
                e.exports = Object.setPrototypeOf || (
                    "__proto__" in {} ? function () {
                        var e, t = !1,
                            r = {};
                        try {
                            (e = n(Object.getOwnPropertyDescriptor(
                                Object.prototype,
                                "__proto__").set))(r, []), t =
                                r instanceof Array
                        } catch (e) {}
                        return function (r, n) {
                            return o(r), a(n), t ? e(r, n) : r
                                .__proto__ = n, r
                        }
                    }() : void 0)
            },
            43060: (e, t, r) => {
                "use strict";
                var n = r(88191),
                    o = r(33058);
                e.exports = n ? {}.toString : function () {
                    return "[object " + o(this) + "]"
                }
            },
            76252: (e, t, r) => {
                var n = r(47583),
                    o = r(38262),
                    a = r(9212),
                    i = r(90794),
                    s = n.TypeError;
                e.exports = function (e, t) {
                    var r, n;
                    if ("string" === t && a(r = e.toString) && !i(
                            n = o(r, e))) return n;
                    if (a(r = e.valueOf) && !i(n = o(r, e)))
                    return n;
                    if ("string" !== t && a(r = e.toString) && !i(
                            n = o(r, e))) return n;
                    throw s(
                        "Can't convert object to primitive value")
                }
            },
            40929: (e, t, r) => {
                var n = r(35897),
                    o = r(7386),
                    a = r(9275),
                    i = r(74012),
                    s = r(92569),
                    c = o([].concat);
                e.exports = n("Reflect", "ownKeys") || function (e) {
                    var t = a.f(s(e)),
                        r = i.f;
                    return r ? c(t, r(e)) : t
                }
            },
            80544: e => {
                e.exports = function (e) {
                    try {
                        return {
                            error: !1,
                            value: e()
                        }
                    } catch (e) {
                        return {
                            error: !0,
                            value: e
                        }
                    }
                }
            },
            95732: (e, t, r) => {
                var n = r(92569),
                    o = r(90794),
                    a = r(5084);
                e.exports = function (e, t) {
                    if (n(e), o(t) && t.constructor === e) return t;
                    var r = a.f(e);
                    return (0, r.resolve)(t), r.promise
                }
            },
            42723: e => {
                var t = function () {
                    this.head = null, this.tail = null
                };
                t.prototype = {
                    add: function (e) {
                        var t = {
                            item: e,
                            next: null
                        };
                        this.head ? this.tail.next = t : this
                            .head = t, this.tail = t
                    },
                    get: function () {
                        var e = this.head;
                        if (e) return this.head = e.next, this
                            .tail === e && (this.tail =
                                null), e.item
                    }
                }, e.exports = t
            },
            96893: (e, t, r) => {
                var n = r(61270);
                e.exports = function (e, t, r) {
                    for (var o in t) n(e, o, t[o], r);
                    return e
                }
            },
            61270: (e, t, r) => {
                var n = r(47583),
                    o = r(9212),
                    a = r(62870),
                    i = r(57),
                    s = r(50460),
                    c = r(69734),
                    u = r(42743),
                    p = r(14340).CONFIGURABLE,
                    l = u.get,
                    f = u.enforce,
                    h = String(String).split("String");
                (e.exports = function (e, t, r, c) {
                    var u, l = !!c && !!c.unsafe,
                        d = !!c && !!c.enumerable,
                        v = !!c && !!c.noTargetGet,
                        m = c && void 0 !== c.name ? c.name : t;
                    o(r) && ("Symbol(" === String(m).slice(0, 7) &&
                        (m = "[" + String(m).replace(
                                /^Symbol\(([^)]*)\)/, "$1") +
                            "]"), (!a(r, "name") || p && r
                            .name !== m) && i(r, "name", m), (
                            u = f(r)).source || (u.source = h
                            .join("string" == typeof m ? m : "")
                            )), e !== n ? (l ? !v && e[t] && (
                            d = !0) : delete e[t], d ? e[t] =
                        r : i(e, t, r)) : d ? e[t] = r : s(t, r)
                })(Function.prototype, "toString", (function () {
                    return o(this) && l(this).source || c(this)
                }))
            },
            74214: (e, t, r) => {
                var n = r(47583),
                    o = r(38262),
                    a = r(92569),
                    i = r(9212),
                    s = r(39624),
                    c = r(48445),
                    u = n.TypeError;
                e.exports = function (e, t) {
                    var r = e.exec;
                    if (i(r)) {
                        var n = o(r, e, t);
                        return null !== n && a(n), n
                    }
                    if ("RegExp" === s(e)) return o(c, e, t);
                    throw u(
                        "RegExp#exec called on incompatible receiver")
                }
            },
            48445: (e, t, r) => {
                "use strict";
                var n, o, a = r(38262),
                    i = r(7386),
                    s = r(28320),
                    c = r(74061),
                    u = r(35230),
                    p = r(17836),
                    l = r(3590),
                    f = r(42743).get,
                    h = r(74121),
                    d = r(1712),
                    v = p("native-string-replace", String.prototype
                        .replace),
                    m = RegExp.prototype.exec,
                    y = m,
                    g = i("".charAt),
                    w = i("".indexOf),
                    x = i("".replace),
                    b = i("".slice),
                    k = (o = /b*/g, a(m, n = /a/, "a"), a(m, o, "a"),
                        0 !== n.lastIndex || 0 !== o.lastIndex),
                    T = u.BROKEN_CARET,
                    E = void 0 !== /()??/.exec("")[1];
                (k || E || T || h || d) && (y = function (e) {
                    var t, r, n, o, i, u, p, h = this,
                        d = f(h),
                        O = s(e),
                        j = d.raw;
                    if (j) return j.lastIndex = h.lastIndex, t = a(
                            y, j, O), h.lastIndex = j.lastIndex,
                        t;
                    var S = d.groups,
                        P = T && h.sticky,
                        I = a(c, h),
                        M = h.source,
                        R = 0,
                        L = O;
                    if (P && (I = x(I, "y", ""), -1 === w(I, "g") &&
                            (I += "g"), L = b(O, h.lastIndex), h
                            .lastIndex > 0 && (!h.multiline || h
                                .multiline && "\n" !== g(O, h
                                    .lastIndex - 1)) && (M =
                                "(?: " + M + ")", L = " " + L, R++),
                            r = new RegExp("^(?:" + M + ")", I)),
                        E && (r = new RegExp("^" + M + "$(?!\\s)",
                            I)), k && (n = h.lastIndex), o = a(m,
                            P ? r : h, L), P ? o ? (o.input = b(o
                                .input, R), o[0] = b(o[0], R), o
                            .index = h.lastIndex, h.lastIndex += o[
                                0].length) : h.lastIndex = 0 : k &&
                        o && (h.lastIndex = h.global ? o.index + o[
                            0].length : n), E && o && o.length >
                        1 && a(v, o[0], r, (function () {
                            for (i = 1; i < arguments
                                .length - 2; i++) void 0 ===
                                arguments[i] && (o[i] =
                                    void 0)
                        })), o && S)
                        for (o.groups = u = l(null), i = 0; i < S
                            .length; i++) u[(p = S[i])[0]] = o[p[
                        1]];
                    return o
                }), e.exports = y
            },
            74061: (e, t, r) => {
                "use strict";
                var n = r(92569);
                e.exports = function () {
                    var e = n(this),
                        t = "";
                    return e.global && (t += "g"), e.ignoreCase && (
                            t += "i"), e.multiline && (t += "m"), e
                        .dotAll && (t += "s"), e.unicode && (t +=
                            "u"), e.sticky && (t += "y"), t
                }
            },
            35230: (e, t, r) => {
                var n = r(16544),
                    o = r(47583).RegExp,
                    a = n((function () {
                        var e = o("a", "y");
                        return e.lastIndex = 2, null != e.exec(
                            "abcd")
                    })),
                    i = a || n((function () {
                        return !o("a", "y").sticky
                    })),
                    s = a || n((function () {
                        var e = o("^r", "gy");
                        return e.lastIndex = 2, null != e.exec(
                            "str")
                    }));
                e.exports = {
                    BROKEN_CARET: s,
                    MISSED_STICKY: i,
                    UNSUPPORTED_Y: a
                }
            },
            74121: (e, t, r) => {
                var n = r(16544),
                    o = r(47583).RegExp;
                e.exports = n((function () {
                    var e = o(".", "s");
                    return !(e.dotAll && e.exec("\n") &&
                        "s" === e.flags)
                }))
            },
            1712: (e, t, r) => {
                var n = r(16544),
                    o = r(47583).RegExp;
                e.exports = n((function () {
                    var e = o("(?<a>b)", "g");
                    return "b" !== e.exec("b").groups.a ||
                        "bc" !== "b".replace(e, "$<a>c")
                }))
            },
            63955: (e, t, r) => {
                var n = r(47583).TypeError;
                e.exports = function (e) {
                    if (null == e) throw n("Can't call method on " +
                        e);
                    return e
                }
            },
            50460: (e, t, r) => {
                var n = r(47583),
                    o = Object.defineProperty;
                e.exports = function (e, t) {
                    try {
                        o(n, e, {
                            value: t,
                            configurable: !0,
                            writable: !0
                        })
                    } catch (r) {
                        n[e] = t
                    }
                    return t
                }
            },
            7730: (e, t, r) => {
                "use strict";
                var n = r(35897),
                    o = r(94615),
                    a = r(3649),
                    i = r(18494),
                    s = a("species");
                e.exports = function (e) {
                    var t = n(e),
                        r = o.f;
                    i && t && !t[s] && r(t, s, {
                        configurable: !0,
                        get: function () {
                            return this
                        }
                    })
                }
            },
            98821: (e, t, r) => {
                var n = r(94615).f,
                    o = r(62870),
                    a = r(3649)("toStringTag");
                e.exports = function (e, t, r) {
                    e && !r && (e = e.prototype), e && !o(e, a) &&
                        n(e, a, {
                            configurable: !0,
                            value: t
                        })
                }
            },
            89137: (e, t, r) => {
                var n = r(17836),
                    o = r(98284),
                    a = n("keys");
                e.exports = function (e) {
                    return a[e] || (a[e] = o(e))
                }
            },
            31314: (e, t, r) => {
                var n = r(47583),
                    o = r(50460),
                    a = "__core-js_shared__",
                    i = n[a] || o(a, {});
                e.exports = i
            },
            17836: (e, t, r) => {
                var n = r(86268),
                    o = r(31314);
                (e.exports = function (e, t) {
                    return o[e] || (o[e] = void 0 !== t ? t : {})
                })("versions", []).push({
                    version: "3.21.1",
                    mode: n ? "pure" : "global",
                    copyright: "© 2014-2022 Denis Pushkarev (zloirock.ru)",
                    license: "https://github.com/zloirock/core-js/blob/v3.21.1/LICENSE",
                    source: "https://github.com/zloirock/core-js"
                })
            },
            40564: (e, t, r) => {
                var n = r(92569),
                    o = r(41186),
                    a = r(3649)("species");
                e.exports = function (e, t) {
                    var r, i = n(e).constructor;
                    return void 0 === i || null == (r = n(i)[a]) ?
                        t : o(r)
                }
            },
            96389: (e, t, r) => {
                var n = r(7386),
                    o = r(87486),
                    a = r(28320),
                    i = r(63955),
                    s = n("".charAt),
                    c = n("".charCodeAt),
                    u = n("".slice),
                    p = function (e) {
                        return function (t, r) {
                            var n, p, l = a(i(t)),
                                f = o(r),
                                h = l.length;
                            return f < 0 || f >= h ? e ? "" :
                                void 0 : (n = c(l, f)) < 55296 ||
                                n > 56319 || f + 1 === h || (p = c(
                                    l, f + 1)) < 56320 || p >
                                57343 ? e ? s(l, f) : n : e ? u(l,
                                    f, f + 2) : p - 56320 + (n -
                                    55296 << 10) + 65536
                        }
                    };
                e.exports = {
                    codeAt: p(!1),
                    charAt: p(!0)
                }
            },
            65760: (e, t, r) => {
                var n = r(14340).PROPER,
                    o = r(16544),
                    a = r(20771);
                e.exports = function (e) {
                    return o((function () {
                        return !!a[e]() || "​᠎" !==
                            "​᠎" [e]() || n && a[e]
                            .name !== e
                    }))
                }
            },
            68940: (e, t, r) => {
                var n = r(7386),
                    o = r(63955),
                    a = r(28320),
                    i = r(20771),
                    s = n("".replace),
                    c = "[" + i + "]",
                    u = RegExp("^" + c + c + "*"),
                    p = RegExp(c + c + "*$"),
                    l = function (e) {
                        return function (t) {
                            var r = a(o(t));
                            return 1 & e && (r = s(r, u, "")), 2 &
                                e && (r = s(r, p, "")), r
                        }
                    };
                e.exports = {
                    start: l(1),
                    end: l(2),
                    trim: l(3)
                }
            },
            48117: (e, t, r) => {
                var n, o, a, i, s = r(47583),
                    c = r(71611),
                    u = r(12938),
                    p = r(9212),
                    l = r(62870),
                    f = r(16544),
                    h = r(90482),
                    d = r(46917),
                    v = r(26668),
                    m = r(57520),
                    y = r(17020),
                    g = r(45354),
                    w = s.setImmediate,
                    x = s.clearImmediate,
                    b = s.process,
                    k = s.Dispatch,
                    T = s.Function,
                    E = s.MessageChannel,
                    O = s.String,
                    j = 0,
                    S = {};
                try {
                    n = s.location
                } catch (e) {}
                var P = function (e) {
                        if (l(S, e)) {
                            var t = S[e];
                            delete S[e], t()
                        }
                    },
                    I = function (e) {
                        return function () {
                            P(e)
                        }
                    },
                    M = function (e) {
                        P(e.data)
                    },
                    R = function (e) {
                        s.postMessage(O(e), n.protocol + "//" + n.host)
                    };
                w && x || (w = function (e) {
                        m(arguments.length, 1);
                        var t = p(e) ? e : T(e),
                            r = d(arguments, 1);
                        return S[++j] = function () {
                            c(t, void 0, r)
                        }, o(j), j
                    }, x = function (e) {
                        delete S[e]
                    }, g ? o = function (e) {
                        b.nextTick(I(e))
                    } : k && k.now ? o = function (e) {
                        k.now(I(e))
                    } : E && !y ? (i = (a = new E).port2, a.port1
                        .onmessage = M, o = u(i.postMessage, i)) : s
                    .addEventListener && p(s.postMessage) && !s
                    .importScripts && n && "file:" !== n.protocol &&
                    !f(R) ? (o = R, s.addEventListener("message", M,
                        !1)) : o = "onreadystatechange" in v(
                        "script") ? function (e) {
                        h.appendChild(v("script"))
                            .onreadystatechange = function () {
                                h.removeChild(this), P(e)
                            }
                    } : function (e) {
                        setTimeout(I(e), 0)
                    }), e.exports = {
                    set: w,
                    clear: x
                }
            },
            96782: (e, t, r) => {
                var n = r(87486),
                    o = Math.max,
                    a = Math.min;
                e.exports = function (e, t) {
                    var r = n(e);
                    return r < 0 ? o(r + t, 0) : a(r, t)
                }
            },
            22977: (e, t, r) => {
                var n = r(55044),
                    o = r(63955);
                e.exports = function (e) {
                    return n(o(e))
                }
            },
            87486: e => {
                var t = Math.ceil,
                    r = Math.floor;
                e.exports = function (e) {
                    var n = +e;
                    return n != n || 0 === n ? 0 : (n > 0 ? r : t)(
                        n)
                }
            },
            70097: (e, t, r) => {
                var n = r(87486),
                    o = Math.min;
                e.exports = function (e) {
                    return e > 0 ? o(n(e), 9007199254740991) : 0
                }
            },
            61324: (e, t, r) => {
                var n = r(47583),
                    o = r(63955),
                    a = n.Object;
                e.exports = function (e) {
                    return a(o(e))
                }
            },
            22670: (e, t, r) => {
                var n = r(47583),
                    o = r(38262),
                    a = r(90794),
                    i = r(35871),
                    s = r(60911),
                    c = r(76252),
                    u = r(3649),
                    p = n.TypeError,
                    l = u("toPrimitive");
                e.exports = function (e, t) {
                    if (!a(e) || i(e)) return e;
                    var r, n = s(e, l);
                    if (n) {
                        if (void 0 === t && (t = "default"), r = o(
                                n, e, t), !a(r) || i(r)) return r;
                        throw p(
                            "Can't convert object to primitive value")
                    }
                    return void 0 === t && (t = "number"), c(e, t)
                }
            },
            98734: (e, t, r) => {
                var n = r(22670),
                    o = r(35871);
                e.exports = function (e) {
                    var t = n(e, "string");
                    return o(t) ? t : t + ""
                }
            },
            88191: (e, t, r) => {
                var n = {};
                n[r(3649)("toStringTag")] = "z", e.exports =
                    "[object z]" === String(n)
            },
            28320: (e, t, r) => {
                var n = r(47583),
                    o = r(33058),
                    a = n.String;
                e.exports = function (e) {
                    if ("Symbol" === o(e)) throw TypeError(
                        "Cannot convert a Symbol value to a string"
                        );
                    return a(e)
                }
            },
            75637: (e, t, r) => {
                var n = r(47583).String;
                e.exports = function (e) {
                    try {
                        return n(e)
                    } catch (e) {
                        return "Object"
                    }
                }
            },
            98284: (e, t, r) => {
                var n = r(7386),
                    o = 0,
                    a = Math.random(),
                    i = n(1..toString);
                e.exports = function (e) {
                    return "Symbol(" + (void 0 === e ? "" : e) +
                        ")_" + i(++o + a, 36)
                }
            },
            67786: (e, t, r) => {
                var n = r(88640);
                e.exports = n && !Symbol.sham && "symbol" ==
                    typeof Symbol.iterator
            },
            7670: (e, t, r) => {
                var n = r(18494),
                    o = r(16544);
                e.exports = n && o((function () {
                    return 42 != Object.defineProperty((
                            function () {}),
                        "prototype", {
                            value: 42,
                            writable: !1
                        }).prototype
                }))
            },
            57520: (e, t, r) => {
                var n = r(47583).TypeError;
                e.exports = function (e, t) {
                    if (e < t) throw n("Not enough arguments");
                    return e
                }
            },
            3649: (e, t, r) => {
                var n = r(47583),
                    o = r(17836),
                    a = r(62870),
                    i = r(98284),
                    s = r(88640),
                    c = r(67786),
                    u = o("wks"),
                    p = n.Symbol,
                    l = p && p.for,
                    f = c ? p : p && p.withoutSetter || i;
                e.exports = function (e) {
                    if (!a(u, e) || !s && "string" != typeof u[e]) {
                        var t = "Symbol." + e;
                        s && a(p, e) ? u[e] = p[e] : u[e] = c && l ?
                            l(t) : f(t)
                    }
                    return u[e]
                }
            },
            20771: e => {
                e.exports =
                    "\t\n\v\f\r                　\u2028\u2029\ufeff"
            },
            54458: (e, t, r) => {
                var n = r(18494),
                    o = r(14340).EXISTS,
                    a = r(7386),
                    i = r(94615).f,
                    s = Function.prototype,
                    c = a(s.toString),
                    u =
                    /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/,
                    p = a(u.exec);
                n && !o && i(s, "name", {
                    configurable: !0,
                    get: function () {
                        try {
                            return p(u, c(this))[1]
                        } catch (e) {
                            return ""
                        }
                    }
                })
            },
            56394: (e, t, r) => {
                var n = r(88191),
                    o = r(61270),
                    a = r(43060);
                n || o(Object.prototype, "toString", a, {
                    unsafe: !0
                })
            },
            25334: (e, t, r) => {
                "use strict";
                var n, o, a, i, s = r(37263),
                    c = r(86268),
                    u = r(47583),
                    p = r(35897),
                    l = r(38262),
                    f = r(40783),
                    h = r(61270),
                    d = r(96893),
                    v = r(17496),
                    m = r(98821),
                    y = r(7730),
                    g = r(18257),
                    w = r(9212),
                    x = r(90794),
                    b = r(44761),
                    k = r(69734),
                    T = r(54026),
                    E = r(3616),
                    O = r(40564),
                    j = r(48117).set,
                    S = r(92095),
                    P = r(95732),
                    I = r(92716),
                    M = r(5084),
                    R = r(80544),
                    L = r(42723),
                    N = r(42743),
                    _ = r(34451),
                    A = r(3649),
                    D = r(12274),
                    F = r(45354),
                    U = r(24061),
                    C = A("species"),
                    $ = "Promise",
                    G = N.getterFor($),
                    W = N.set,
                    Y = N.getterFor($),
                    J = f && f.prototype,
                    z = f,
                    K = J,
                    q = u.TypeError,
                    B = u.document,
                    H = u.process,
                    X = M.f,
                    V = X,
                    Q = !!(B && B.createEvent && u.dispatchEvent),
                    Z = w(u.PromiseRejectionEvent),
                    ee = "unhandledrejection",
                    te = !1,
                    re = _($, (function () {
                        var e = k(z),
                            t = e !== String(z);
                        if (!t && 66 === U) return !0;
                        if (c && !K.finally) return !0;
                        if (U >= 51 && /native code/.test(e))
                            return !1;
                        var r = new z((function (e) {
                                e(1)
                            })),
                            n = function (e) {
                                e((function () {}), (
                            function () {}))
                            };
                        return (r.constructor = {})[C] = n, !(
                                te = r.then((
                            function () {})) instanceof n) || !
                            t && D && !Z
                    })),
                    ne = re || !E((function (e) {
                        z.all(e).catch((function () {}))
                    })),
                    oe = function (e) {
                        var t;
                        return !(!x(e) || !w(t = e.then)) && t
                    },
                    ae = function (e, t) {
                        var r, n, o, a = t.value,
                            i = 1 == t.state,
                            s = i ? e.ok : e.fail,
                            c = e.resolve,
                            u = e.reject,
                            p = e.domain;
                        try {
                            s ? (i || (2 === t.rejection && pe(t), t
                                        .rejection = 1), !0 === s ? r =
                                    a : (p && p.enter(), r = s(a), p &&
                                        (p.exit(), o = !0)), r === e
                                    .promise ? u(q(
                                        "Promise-chain cycle")) : (n =
                                        oe(r)) ? l(n, r, c, u) : c(r)) :
                                u(a)
                        } catch (e) {
                            p && !o && p.exit(), u(e)
                        }
                    },
                    ie = function (e, t) {
                        e.notified || (e.notified = !0, S((function () {
                            for (var r, n = e
                                .reactions; r = n.get();
                                ) ae(r, e);
                            e.notified = !1, t && !e
                                .rejection && ce(e)
                        })))
                    },
                    se = function (e, t, r) {
                        var n, o;
                        Q ? ((n = B.createEvent("Event")).promise = t, n
                                .reason = r, n.initEvent(e, !1, !0), u
                                .dispatchEvent(n)) : n = {
                                promise: t,
                                reason: r
                            }, !Z && (o = u["on" + e]) ? o(n) : e ===
                            ee && I("Unhandled promise rejection", r)
                    },
                    ce = function (e) {
                        l(j, u, (function () {
                            var t, r = e.facade,
                                n = e.value;
                            if (ue(e) && (t = R((
                                function () {
                                        F ? H.emit(
                                                "unhandledRejection",
                                                n, r
                                                ) :
                                            se(ee,
                                                r, n
                                                )
                                    })), e.rejection = F ||
                                    ue(e) ? 2 : 1, t.error))
                                throw t.value
                        }))
                    },
                    ue = function (e) {
                        return 1 !== e.rejection && !e.parent
                    },
                    pe = function (e) {
                        l(j, u, (function () {
                            var t = e.facade;
                            F ? H.emit("rejectionHandled",
                                t) : se(
                                "rejectionhandled", t, e
                                .value)
                        }))
                    },
                    le = function (e, t, r) {
                        return function (n) {
                            e(t, n, r)
                        }
                    },
                    fe = function (e, t, r) {
                        e.done || (e.done = !0, r && (e = r), e.value =
                            t, e.state = 2, ie(e, !0))
                    },
                    he = function (e, t, r) {
                        if (!e.done) {
                            e.done = !0, r && (e = r);
                            try {
                                if (e.facade === t) throw q(
                                    "Promise can't be resolved itself"
                                    );
                                var n = oe(t);
                                n ? S((function () {
                                    var r = {
                                        done: !1
                                    };
                                    try {
                                        l(n, t, le(he, r,
                                            e), le(fe,
                                                r, e))
                                    } catch (t) {
                                        fe(r, t, e)
                                    }
                                })) : (e.value = t, e.state = 1, ie(
                                    e, !1))
                            } catch (t) {
                                fe({
                                    done: !1
                                }, t, e)
                            }
                        }
                    };
                if (re && (K = (z = function (e) {
                        b(this, K), g(e), l(n, this);
                        var t = G(this);
                        try {
                            e(le(he, t), le(fe, t))
                        } catch (e) {
                            fe(t, e)
                        }
                    }).prototype, (n = function (e) {
                        W(this, {
                            type: $,
                            done: !1,
                            notified: !1,
                            parent: !1,
                            reactions: new L,
                            rejection: !1,
                            state: 0,
                            value: void 0
                        })
                    }).prototype = d(K, {
                        then: function (e, t) {
                            var r = Y(this),
                                n = X(O(this, z));
                            return r.parent = !0, n.ok = !w(
                                    e) || e, n.fail = w(
                                t) && t, n.domain = F ? H
                                .domain : void 0, 0 == r
                                .state ? r.reactions.add(
                                n) : S((function () {
                                    ae(n, r)
                                })), n.promise
                        },
                        catch: function (e) {
                            return this.then(void 0, e)
                        }
                    }), o = function () {
                        var e = new n,
                            t = G(e);
                        this.promise = e, this.resolve = le(he, t),
                            this.reject = le(fe, t)
                    }, M.f = X = function (e) {
                        return e === z || e === a ? new o(e) : V(e)
                    }, !c && w(f) && J !== Object.prototype)) {
                    i = J.then, te || (h(J, "then", (function (e, t) {
                        var r = this;
                        return new z((function (e, t) {
                            l(i, r, e, t)
                        })).then(e, t)
                    }), {
                        unsafe: !0
                    }), h(J, "catch", K.catch, {
                        unsafe: !0
                    }));
                    try {
                        delete J.constructor
                    } catch (e) {}
                    v && v(J, K)
                }
                s({
                    global: !0,
                    wrap: !0,
                    forced: re
                }, {
                    Promise: z
                }), m(z, $, !1, !0), y($), a = p($), s({
                    target: $,
                    stat: !0,
                    forced: re
                }, {
                    reject: function (e) {
                        var t = X(this);
                        return l(t.reject, void 0, e), t
                            .promise
                    }
                }), s({
                    target: $,
                    stat: !0,
                    forced: c || re
                }, {
                    resolve: function (e) {
                        return P(c && this === a ? z : this,
                            e)
                    }
                }), s({
                    target: $,
                    stat: !0,
                    forced: ne
                }, {
                    all: function (e) {
                        var t = this,
                            r = X(t),
                            n = r.resolve,
                            o = r.reject,
                            a = R((function () {
                                var r = g(t
                                    .resolve),
                                    a = [],
                                    i = 0,
                                    s = 1;
                                T(e, (function (e) {
                                    var c =
                                        i++,
                                        u = !
                                        1;
                                    s++,
                                    l(r, t,
                                            e)
                                        .then(
                                            (function (
                                                e
                                                ) {
                                                u || (u = !
                                                    0,
                                                    a[
                                                        c] =
                                                    e,
                                                    --
                                                    s ||
                                                    n(
                                                        a)
                                                    )
                                            }),
                                            o
                                            )
                                })), --s || n(a)
                            }));
                        return a.error && o(a.value), r
                            .promise
                    },
                    race: function (e) {
                        var t = this,
                            r = X(t),
                            n = r.reject,
                            o = R((function () {
                                var o = g(t
                                .resolve);
                                T(e, (function (e) {
                                    l(o, t,
                                            e)
                                        .then(
                                            r
                                            .resolve,
                                            n
                                            )
                                }))
                            }));
                        return o.error && n(o.value), r
                            .promise
                    }
                })
            },
            62322: (e, t, r) => {
                "use strict";
                var n = r(37263),
                    o = r(48445);
                n({
                    target: "RegExp",
                    proto: !0,
                    forced: /./.exec !== o
                }, {
                    exec: o
                })
            },
            93296: (e, t, r) => {
                "use strict";
                var n = r(71611),
                    o = r(38262),
                    a = r(7386),
                    i = r(90783),
                    s = r(16544),
                    c = r(92569),
                    u = r(9212),
                    p = r(87486),
                    l = r(70097),
                    f = r(28320),
                    h = r(63955),
                    d = r(96733),
                    v = r(60911),
                    m = r(4305),
                    y = r(74214),
                    g = r(3649)("replace"),
                    w = Math.max,
                    x = Math.min,
                    b = a([].concat),
                    k = a([].push),
                    T = a("".indexOf),
                    E = a("".slice),
                    O = "$0" === "a".replace(/./, "$0"),
                    j = !!/./ [g] && "" === /./ [g]("a", "$0");
                i("replace", (function (e, t, r) {
                    var a = j ? "$" : "$0";
                    return [function (e, r) {
                        var n = h(this),
                            a = null == e ? void 0 :
                            v(e, g);
                        return a ? o(a, e, n, r) :
                            o(t, f(n), e, r)
                    }, function (e, o) {
                        var i = c(this),
                            s = f(e);
                        if ("string" == typeof o &&
                            -1 === T(o, a) && -1 ===
                            T(o, "$<")) {
                            var h = r(t, i, s, o);
                            if (h.done) return h
                                .value
                        }
                        var v = u(o);
                        v || (o = f(o));
                        var g = i.global;
                        if (g) {
                            var O = i.unicode;
                            i.lastIndex = 0
                        }
                        for (var j = [];;) {
                            var S = y(i, s);
                            if (null === S) break;
                            if (k(j, S), !g) break;
                            "" === f(S[0]) && (i
                                .lastIndex = d(
                                    s, l(i
                                        .lastIndex
                                        ), O))
                        }
                        for (var P, I = "", M = 0,
                                R = 0; R < j
                            .length; R++) {
                            for (var L = f((S = j[
                                        R])[0]), N =
                                    w(x(p(S.index),
                                        s.length
                                        ), 0),
                                    _ = [], A =
                                    1; A < S
                                .length; A++) k(_,
                                void 0 === (P =
                                    S[A]) ? P :
                                String(P));
                            var D = S.groups;
                            if (v) {
                                var F = b([L], _, N,
                                    s);
                                void 0 !== D && k(F,
                                    D);
                                var U = f(n(o,
                                    void 0,
                                    F))
                            } else U = m(L, s, N, _,
                                D, o);
                            N >= M && (I += E(s, M,
                                    N) + U, M =
                                N + L.length)
                        }
                        return I + E(s, M)
                    }]
                }), !!s((function () {
                    var e = /./;
                    return e.exec = function () {
                        var e = [];
                        return e.groups = {
                            a: "7"
                        }, e
                    }, "7" !== "".replace(e, "$<a>")
                })) || !O || j)
            },
            13233: (e, t, r) => {
                "use strict";
                var n = r(37263),
                    o = r(68940).trim;
                n({
                    target: "String",
                    proto: !0,
                    forced: r(65760)("trim")
                }, {
                    trim: function () {
                        return o(this)
                    }
                })
            },
            77588: e => {
                var t = function (e) {
                    "use strict";
                    var t, r = Object.prototype,
                        n = r.hasOwnProperty,
                        o = "function" == typeof Symbol ? Symbol :
                        {},
                        a = o.iterator || "@@iterator",
                        i = o.asyncIterator || "@@asyncIterator",
                        s = o.toStringTag || "@@toStringTag";

                    function c(e, t, r) {
                        return Object.defineProperty(e, t, {
                            value: r,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }), e[t]
                    }
                    try {
                        c({}, "")
                    } catch (e) {
                        c = function (e, t, r) {
                            return e[t] = r
                        }
                    }

                    function u(e, t, r, n) {
                        var o = t && t.prototype instanceof m ? t :
                            m,
                            a = Object.create(o.prototype),
                            i = new P(n || []);
                        return a._invoke = function (e, t, r) {
                            var n = l;
                            return function (o, a) {
                                if (n === h)
                                throw new Error(
                                        "Generator is already running"
                                        );
                                if (n === d) {
                                    if ("throw" === o)
                                    throw a;
                                    return M()
                                }
                                for (r.method = o, r.arg =
                                    a;;) {
                                    var i = r.delegate;
                                    if (i) {
                                        var s = O(i, r);
                                        if (s) {
                                            if (s === v)
                                                continue;
                                            return s
                                        }
                                    }
                                    if ("next" === r.method)
                                        r.sent = r._sent = r
                                        .arg;
                                    else if ("throw" === r
                                        .method) {
                                        if (n === l)
                                        throw n = d, r
                                            .arg;
                                        r.dispatchException(
                                            r.arg)
                                    } else "return" === r
                                        .method && r.abrupt(
                                            "return", r.arg
                                            );
                                    n = h;
                                    var c = p(e, t, r);
                                    if ("normal" === c
                                        .type) {
                                        if (n = r.done ? d :
                                            f, c.arg === v)
                                            continue;
                                        return {
                                            value: c.arg,
                                            done: r.done
                                        }
                                    }
                                    "throw" === c.type && (
                                        n = d, r
                                        .method =
                                        "throw", r.arg =
                                        c.arg)
                                }
                            }
                        }(e, r, i), a
                    }

                    function p(e, t, r) {
                        try {
                            return {
                                type: "normal",
                                arg: e.call(t, r)
                            }
                        } catch (e) {
                            return {
                                type: "throw",
                                arg: e
                            }
                        }
                    }
                    e.wrap = u;
                    var l = "suspendedStart",
                        f = "suspendedYield",
                        h = "executing",
                        d = "completed",
                        v = {};

                    function m() {}

                    function y() {}

                    function g() {}
                    var w = {};
                    c(w, a, (function () {
                        return this
                    }));
                    var x = Object.getPrototypeOf,
                        b = x && x(x(I([])));
                    b && b !== r && n.call(b, a) && (w = b);
                    var k = g.prototype = m.prototype = Object
                        .create(w);

                    function T(e) {
                        ["next", "throw", "return"].forEach((
                            function (t) {
                                c(e, t, (function (e) {
                                    return this
                                        ._invoke(
                                            t, e
                                            )
                                }))
                            }))
                    }

                    function E(e, t) {
                        function r(o, a, i, s) {
                            var c = p(e[o], e, a);
                            if ("throw" !== c.type) {
                                var u = c.arg,
                                    l = u.value;
                                return l && "object" == typeof l &&
                                    n.call(l, "__await") ? t
                                    .resolve(l.__await).then((
                                        function (e) {
                                            r("next", e, i, s)
                                        }), (function (e) {
                                        r("throw", e, i, s)
                                    })) : t.resolve(l).then((
                                        function (e) {
                                            u.value = e, i(u)
                                        }), (function (e) {
                                        return r("throw", e,
                                            i, s)
                                    }))
                            }
                            s(c.arg)
                        }
                        var o;
                        this._invoke = function (e, n) {
                            function a() {
                                return new t((function (t, o) {
                                    r(e, n, t, o)
                                }))
                            }
                            return o = o ? o.then(a, a) : a()
                        }
                    }

                    function O(e, r) {
                        var n = e.iterator[r.method];
                        if (n === t) {
                            if (r.delegate = null, "throw" === r
                                .method) {
                                if (e.iterator.return && (r.method =
                                        "return", r.arg = t, O(e,
                                        r), "throw" === r.method))
                                    return v;
                                r.method = "throw", r.arg =
                                    new TypeError(
                                        "The iterator does not provide a 'throw' method"
                                        )
                            }
                            return v
                        }
                        var o = p(n, e.iterator, r.arg);
                        if ("throw" === o.type) return r.method =
                            "throw", r.arg = o.arg, r.delegate =
                            null, v;
                        var a = o.arg;
                        return a ? a.done ? (r[e.resultName] = a
                            .value, r.next = e.nextLoc,
                            "return" !== r.method && (r.method =
                                "next", r.arg = t), r.delegate =
                            null, v) : a : (r.method = "throw",
                            r.arg = new TypeError(
                                "iterator result is not an object"
                                ), r.delegate = null, v)
                    }

                    function j(e) {
                        var t = {
                            tryLoc: e[0]
                        };
                        1 in e && (t.catchLoc = e[1]), 2 in e && (t
                            .finallyLoc = e[2], t.afterLoc = e[
                                3]), this.tryEntries.push(t)
                    }

                    function S(e) {
                        var t = e.completion || {};
                        t.type = "normal", delete t.arg, e
                            .completion = t
                    }

                    function P(e) {
                        this.tryEntries = [{
                            tryLoc: "root"
                        }], e.forEach(j, this), this.reset(!0)
                    }

                    function I(e) {
                        if (e) {
                            var r = e[a];
                            if (r) return r.call(e);
                            if ("function" == typeof e.next)
                            return e;
                            if (!isNaN(e.length)) {
                                var o = -1,
                                    i = function r() {
                                        for (; ++o < e.length;)
                                            if (n.call(e, o))
                                            return r.value = e[
                                                    o], r
                                                .done = !1, r;
                                        return r.value = t, r
                                            .done = !0, r
                                    };
                                return i.next = i
                            }
                        }
                        return {
                            next: M
                        }
                    }

                    function M() {
                        return {
                            value: t,
                            done: !0
                        }
                    }
                    return y.prototype = g, c(k, "constructor", g),
                        c(g, "constructor", y), y.displayName = c(g,
                            s, "GeneratorFunction"), e
                        .isGeneratorFunction = function (e) {
                            var t = "function" == typeof e && e
                                .constructor;
                            return !!t && (t === y ||
                                "GeneratorFunction" === (t
                                    .displayName || t.name))
                        }, e.mark = function (e) {
                            return Object.setPrototypeOf ? Object
                                .setPrototypeOf(e, g) : (e
                                    .__proto__ = g, c(e, s,
                                        "GeneratorFunction")), e
                                .prototype = Object.create(k), e
                        }, e.awrap = function (e) {
                            return {
                                __await: e
                            }
                        }, T(E.prototype), c(E.prototype, i, (
                            function () {
                                return this
                            })), e.AsyncIterator = E, e.async =
                        function (t, r, n, o, a) {
                            void 0 === a && (a = Promise);
                            var i = new E(u(t, r, n, o), a);
                            return e.isGeneratorFunction(r) ? i : i
                                .next().then((function (e) {
                                    return e.done ? e
                                        .value : i.next()
                                }))
                        }, T(k), c(k, s, "Generator"), c(k, a, (
                            function () {
                                return this
                            })), c(k, "toString", (function () {
                            return "[object Generator]"
                        })), e.keys = function (e) {
                            var t = [];
                            for (var r in e) t.push(r);
                            return t.reverse(),
                                function r() {
                                    for (; t.length;) {
                                        var n = t.pop();
                                        if (n in e) return r.value =
                                            n, r.done = !1, r
                                    }
                                    return r.done = !0, r
                                }
                        }, e.values = I, P.prototype = {
                            constructor: P,
                            reset: function (e) {
                                if (this.prev = 0, this.next =
                                    0, this.sent = this._sent =
                                    t, this.done = !1, this
                                    .delegate = null, this
                                    .method = "next", this.arg =
                                    t, this.tryEntries.forEach(
                                        S), !e)
                                    for (var r in this) "t" ===
                                        r.charAt(0) && n.call(
                                            this, r) && !isNaN(+
                                            r.slice(1)) && (
                                            this[r] = t)
                            },
                            stop: function () {
                                this.done = !0;
                                var e = this.tryEntries[0]
                                    .completion;
                                if ("throw" === e.type) throw e
                                    .arg;
                                return this.rval
                            },
                            dispatchException: function (e) {
                                if (this.done) throw e;
                                var r = this;

                                function o(n, o) {
                                    return s.type = "throw", s
                                        .arg = e, r.next = n,
                                        o && (r.method = "next",
                                            r.arg = t), !!o
                                }
                                for (var a = this.tryEntries
                                        .length - 1; a >= 0; --
                                    a) {
                                    var i = this.tryEntries[a],
                                        s = i.completion;
                                    if ("root" === i.tryLoc)
                                        return o("end");
                                    if (i.tryLoc <= this.prev) {
                                        var c = n.call(i,
                                                "catchLoc"),
                                            u = n.call(i,
                                                "finallyLoc");
                                        if (c && u) {
                                            if (this.prev < i
                                                .catchLoc)
                                                return o(i
                                                    .catchLoc,
                                                    !0);
                                            if (this.prev < i
                                                .finallyLoc)
                                                return o(i
                                                    .finallyLoc
                                                    )
                                        } else if (c) {
                                            if (this.prev < i
                                                .catchLoc)
                                                return o(i
                                                    .catchLoc,
                                                    !0)
                                        } else {
                                            if (!u) throw new Error(
                                                "try statement without catch or finally"
                                                );
                                            if (this.prev < i
                                                .finallyLoc)
                                                return o(i
                                                    .finallyLoc
                                                    )
                                        }
                                    }
                                }
                            },
                            abrupt: function (e, t) {
                                for (var r = this.tryEntries
                                        .length - 1; r >= 0; --
                                    r) {
                                    var o = this.tryEntries[r];
                                    if (o.tryLoc <= this.prev &&
                                        n.call(o,
                                        "finallyLoc") && this
                                        .prev < o.finallyLoc) {
                                        var a = o;
                                        break
                                    }
                                }
                                a && ("break" === e ||
                                        "continue" === e) && a
                                    .tryLoc <= t && t <= a
                                    .finallyLoc && (a = null);
                                var i = a ? a.completion : {};
                                return i.type = e, i.arg = t,
                                    a ? (this.method = "next",
                                        this.next = a
                                        .finallyLoc, v) : this
                                    .complete(i)
                            },
                            complete: function (e, t) {
                                if ("throw" === e.type) throw e
                                    .arg;
                                return "break" === e.type ||
                                    "continue" === e.type ? this
                                    .next = e.arg : "return" ===
                                    e.type ? (this.rval = this
                                        .arg = e.arg, this
                                        .method = "return", this
                                        .next = "end") :
                                    "normal" === e.type && t &&
                                    (this.next = t), v
                            },
                            finish: function (e) {
                                for (var t = this.tryEntries
                                        .length - 1; t >= 0; --
                                    t) {
                                    var r = this.tryEntries[t];
                                    if (r.finallyLoc === e)
                                        return this.complete(r
                                                .completion, r
                                                .afterLoc), S(
                                            r), v
                                }
                            },
                            catch: function (e) {
                                for (var t = this.tryEntries
                                        .length - 1; t >= 0; --
                                    t) {
                                    var r = this.tryEntries[t];
                                    if (r.tryLoc === e) {
                                        var n = r.completion;
                                        if ("throw" === n
                                            .type) {
                                            var o = n.arg;
                                            S(r)
                                        }
                                        return o
                                    }
                                }
                                throw new Error(
                                    "illegal catch attempt")
                            },
                            delegateYield: function (e, r, n) {
                                return this.delegate = {
                                        iterator: I(e),
                                        resultName: r,
                                        nextLoc: n
                                    }, "next" === this.method &&
                                    (this.arg = t), v
                            }
                        }, e
                }(e.exports);
                try {
                    regeneratorRuntime = t
                } catch (e) {
                    "object" == typeof globalThis ? globalThis
                        .regeneratorRuntime = t : Function("r",
                            "regeneratorRuntime = r")(t)
                }
            }
        },
        t = {};

    function r(n) {
        var o = t[n];
        if (void 0 !== o) return o.exports;
        var a = t[n] = {
            exports: {}
        };
        return e[n](a, a.exports, r), a.exports
    }
    r.n = e => {
        var t = e && e.__esModule ? () => e.default : () => e;
        return r.d(t, {
            a: t
        }), t
    }, r.d = (e, t) => {
        for (var n in t) r.o(t, n) && !r.o(e, n) && Object
            .defineProperty(e, n, {
                enumerable: !0,
                get: t[n]
            })
    }, r.g = function () {
        if ("object" == typeof globalThis) return globalThis;
        try {
            return this || new Function("return this")()
        } catch (e) {
            if ("object" == typeof window) return window
        }
    }(), r.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), (
    () => {
            "use strict";

            function e(e, t, r, n, o, a, i) {
                try {
                    var s = e[a](i),
                        c = s.value
                } catch (e) {
                    return void r(e)
                }
                s.done ? t(c) : Promise.resolve(c).then(n, o)
            }

            function t(t) {
                return function () {
                    var r = this,
                        n = arguments;
                    return new Promise((function (o, a) {
                        var i = t.apply(r, n);

                        function s(t) {
                            e(i, o, a, s, c, "next", t)
                        }

                        function c(t) {
                            e(i, o, a, s, c, "throw", t)
                        }
                        s(void 0)
                    }))
                }
            }
            r(77588), r(56394), r(25334), r(54458), r(62322), r(93296),
                r(13233);
            var n = {
                pets: null,
                ownerName: "Human",
                reminders: l(),
                chromePopupReminders: !1
            };

            function o(e) {
                chrome.tabs.query({}, (function (t) {
                    for (var r = 0; r < t.length; ++r)
                        chrome.tabs.sendMessage(t[r].id, e)
                }))
            }

            function a(e) {
                chrome.tabs.query({}, (function (t) {
                    for (var r = 0; r < t.length; ++r)
                        chrome.tabs.sendMessage(t[r].id, e)
                }))
            }

            function i() {
                return (i = t(regeneratorRuntime.mark((function e(t, r,
                    i) {
                    var c, l, d, v;
                    return regeneratorRuntime.wrap((
                        function (e) {
                            for (;;)
                                switch (e
                                    .prev =
                                    e.next
                                    ) {
                                    case 0:
                                        if (n
                                            .pets
                                            ) {
                                            e.next =
                                                3;
                                            break
                                        }
                                        return e
                                            .next =
                                            3,
                                            s();
                                    case 3:
                                        if (c = {
                                                pet: n
                                                    .pets
                                                    .cat1
                                            },
                                            "initiate" !=
                                            t
                                            .method
                                            ) {
                                            e.next =
                                                10;
                                            break
                                        }
                                        c.isDebug =
                                            h(),
                                            a({
                                                method: "browser-assets-ready",
                                                data: {
                                                    pet: n
                                                        .pets
                                                        .cat1
                                                }
                                            }),
                                            i(),
                                            e
                                            .next =
                                            55;
                                        break;
                                    case 10:
                                        if ("request-login" !=
                                            t
                                            .method
                                            ) {
                                            e.next =
                                                14;
                                            break
                                        }
                                        chrome
                                            .storage
                                            .local
                                            .get(
                                                [
                                                    "login"],
                                                (function (
                                                    e
                                                    ) {
                                                    var t =
                                                        "";
                                                    e && e
                                                        .login &&
                                                        (login =
                                                            JSON
                                                            .parse(
                                                                e
                                                                .login
                                                                ),
                                                            t =
                                                            login
                                                            .login_token
                                                            ),
                                                        c
                                                        .token =
                                                        t,
                                                        i({
                                                            data: c
                                                        })
                                                })
                                                ),
                                            e
                                            .next =
                                            55;
                                        break;
                                    case 14:
                                        if ("PING" !=
                                            t
                                            .method
                                            ) {
                                            e.next =
                                                18;
                                            break
                                        }
                                        i({
                                                data: c
                                            }),
                                            e
                                            .next =
                                            55;
                                        break;
                                    case 18:
                                        if ("updatePositions" !=
                                            t
                                            .method
                                            ) {
                                            e.next =
                                                27;
                                            break
                                        }
                                        t.data
                                            .posLeft ||
                                            (t.data
                                                .posLeft =
                                                0
                                                ),
                                            t
                                            .data
                                            .posTop ||
                                            (t.data
                                                .posTop =
                                                0
                                                ),
                                            n
                                            .pets
                                            .cat1
                                            .posLeft =
                                            t
                                            .data
                                            .posLeft,
                                            n
                                            .pets
                                            .cat1
                                            .posTop =
                                            t
                                            .data
                                            .posTop,
                                            u(),
                                            i({
                                                data: c
                                            }),
                                            e
                                            .next =
                                            55;
                                        break;
                                    case 27:
                                        if ("hide-30-min" !=
                                            t
                                            .method
                                            ) {
                                            e.next =
                                                35;
                                            break
                                        }
                                        l = (
                                                new Date)
                                            .getTime() +
                                            72e5,
                                            n
                                            .pets
                                            .cat1
                                            .hideUntil =
                                            l,
                                            u(),
                                            a({
                                                method: "hide",
                                                data: n
                                                    .pets
                                                    .cat1
                                            }),
                                            i(),
                                            e
                                            .next =
                                            55;
                                        break;
                                    case 35:
                                        if ("show-toggle" !=
                                            t
                                            .method
                                            ) {
                                            e.next =
                                                41;
                                            break
                                        }
                                        n.pets
                                            .cat1
                                            .hideUntil =
                                            0,
                                            t
                                            .data
                                            .status ?
                                            (n.pets
                                                .cat1
                                                .show = !
                                                0,
                                                n
                                                .pets
                                                .cat1
                                                .skin =
                                                t
                                                .data
                                                .skin,
                                                u(),
                                                f()
                                                ) :
                                            (n.pets
                                                .cat1
                                                .show = !
                                                1,
                                                u(),
                                                a({
                                                    method: "hide",
                                                    data: n
                                                        .pets
                                                        .cat1
                                                })
                                                ),
                                            i(),
                                            e
                                            .next =
                                            55;
                                        break;
                                    case 41:
                                        if ("walk-toggle" !=
                                            t
                                            .method
                                            ) {
                                            e.next =
                                                48;
                                            break
                                        }
                                        n.pets
                                            .cat1
                                            .walk =
                                            t
                                            .data
                                            .status,
                                            u(),
                                            a({
                                                method: "update-options",
                                                data: n
                                                    .pets
                                                    .cat1
                                            }),
                                            i(),
                                            e
                                            .next =
                                            55;
                                        break;
                                    case 48:
                                        if ("change-chrome-notify" !=
                                            t
                                            .method
                                            ) {
                                            e.next =
                                                54;
                                            break
                                        }
                                        return n
                                            .chromePopupReminders =
                                            t
                                            .data
                                            .status,
                                            chrome
                                            .storage
                                            .local
                                            .set({
                                                chromePopupReminders: n
                                                    .chromePopupReminders
                                            }),
                                            e
                                            .abrupt(
                                                "return",
                                                i()
                                                );
                                    case 54:
                                        "walk-type" ==
                                        t.method ?
                                            (n.pets
                                                .cat1
                                                .walkType =
                                                t
                                                .data
                                                .status,
                                                u(),
                                                a({
                                                    method: "update-options",
                                                    data: n
                                                        .pets
                                                        .cat1
                                                }),
                                                i()
                                                ) :
                                            "talk-toggle" ==
                                            t
                                            .method ?
                                            (n.pets
                                                .cat1
                                                .talk =
                                                t
                                                .data
                                                .status,
                                                u(),
                                                a({
                                                    method: "update-options",
                                                    data: n
                                                        .pets
                                                        .cat1
                                                }),
                                                i()
                                                ) :
                                            "eat-request" ==
                                            t
                                            .method ?
                                            (n.pets
                                                .cat1
                                                .hunger =
                                                n
                                                .pets
                                                .cat1
                                                .hunger +
                                                20,
                                                n
                                                .pets
                                                .cat1
                                                .happiness =
                                                n
                                                .pets
                                                .cat1
                                                .happiness +
                                                5,
                                                b(),
                                                o({
                                                    method: "action",
                                                    data: {
                                                        name: "talk",
                                                        parameters: {
                                                            text: x(
                                                                "happy")
                                                        }
                                                    }
                                                }),
                                                u(),
                                                i()
                                                ) :
                                            "petting" ==
                                            t
                                            .method ?
                                            (n.pets
                                                .cat1
                                                .happiness =
                                                n
                                                .pets
                                                .cat1
                                                .happiness +
                                                10,
                                                b(),
                                                u(),
                                                Math
                                                .floor(
                                                    100 *
                                                    Math
                                                    .random()
                                                    ) +
                                                1 <
                                                15 &&
                                                o({
                                                    method: "action",
                                                    data: {
                                                        name: "talk",
                                                        parameters: {
                                                            text: x(
                                                                "happy")
                                                        }
                                                    }
                                                }),
                                                i()
                                                ) :
                                            "dancing" ==
                                            t
                                            .method ?
                                            (n.pets
                                                .cat1
                                                .happiness =
                                                n
                                                .pets
                                                .cat1
                                                .happiness +
                                                5,
                                                b(),
                                                u(),
                                                i()
                                                ) :
                                            "put-to-sleep" ==
                                            t
                                            .method ?
                                            (n.pets
                                                .cat1
                                                .idleType =
                                                "sleep",
                                                o({
                                                    method: "action",
                                                    data: {
                                                        name: "sleep",
                                                        parameters: null
                                                    }
                                                }),
                                                i()
                                                ) :
                                            "sleep-request" ==
                                            t
                                            .method ?
                                            (n.pets
                                                .cat1
                                                .sleep =
                                                n
                                                .pets
                                                .cat1
                                                .sleep +
                                                5,
                                                n
                                                .pets
                                                .cat1
                                                .happiness =
                                                n
                                                .pets
                                                .cat1
                                                .happiness +
                                                3,
                                                b(),
                                                u(),
                                                i()
                                                ) :
                                            "change-pet-name" ==
                                            t
                                            .method ?
                                            (n.pets
                                                .cat1
                                                .name =
                                                t
                                                .data
                                                .name
                                                .trim()
                                                .substring(
                                                    0,
                                                    20
                                                    ),
                                                u(),
                                                i()
                                                ) :
                                            "change-owner-name" ==
                                            t
                                            .method ?
                                            (n.ownerName =
                                                t
                                                .data
                                                .name
                                                .trim()
                                                .substring(
                                                    0,
                                                    20
                                                    ),
                                                chrome
                                                .storage
                                                .local
                                                .set({
                                                    ownerName: n
                                                        .ownerName
                                                }),
                                                i()
                                                ) :
                                            "reminder-add" ==
                                            t
                                            .method ?
                                            ((d =
                                                    new p)
                                                .text =
                                                t
                                                .data
                                                .text
                                                .trim()
                                                .substring(
                                                    0,
                                                    60
                                                    ),
                                                d
                                                .enabled =
                                                t
                                                .data
                                                .enabled,
                                                d
                                                .hours =
                                                parseInt(
                                                    t
                                                    .data
                                                    .hours
                                                    ),
                                                d
                                                .minutes =
                                                parseInt(
                                                    t
                                                    .data
                                                    .minutes
                                                    ),
                                                n
                                                .reminders[
                                                    t
                                                    .data
                                                    .id
                                                    ] =
                                                d,
                                                chrome
                                                .storage
                                                .local
                                                .set({
                                                    reminders: JSON
                                                        .stringify(
                                                            n
                                                            .reminders
                                                            )
                                                }),
                                                i()
                                                ) :
                                            "reminder-update" ==
                                            t
                                            .method ?
                                            ((v = n.reminders[
                                                    t
                                                    .data
                                                    .id
                                                    ])
                                                .text =
                                                t
                                                .data
                                                .text
                                                .trim()
                                                .substring(
                                                    0,
                                                    60
                                                    ),
                                                v
                                                .enabled =
                                                t
                                                .data
                                                .enabled,
                                                v
                                                .hours =
                                                parseInt(
                                                    t
                                                    .data
                                                    .hours
                                                    ),
                                                v
                                                .minutes =
                                                parseInt(
                                                    t
                                                    .data
                                                    .minutes
                                                    ),
                                                chrome
                                                .storage
                                                .local
                                                .set({
                                                    reminders: JSON
                                                        .stringify(
                                                            n
                                                            .reminders
                                                            )
                                                }),
                                                i()
                                                ) :
                                            "reminder-remove" ==
                                            t
                                            .method ?
                                            (delete n
                                                .reminders[
                                                    t
                                                    .data
                                                    .id
                                                    ],
                                                chrome
                                                .storage
                                                .local
                                                .set({
                                                    reminders: JSON
                                                        .stringify(
                                                            n
                                                            .reminders
                                                            )
                                                })
                                                ) :
                                            "choose-browser-skin" ==
                                            t
                                            .method ?
                                            (n.pets
                                                .cat1
                                                .skin =
                                                t
                                                .data
                                                .skin,
                                                u(),
                                                (
                                                    new Date)
                                                .getTime() >
                                                n
                                                .pets
                                                .cat1
                                                .hideUntil &&
                                                n
                                                .pets
                                                .cat1
                                                .show &&
                                                f(),
                                                i()
                                                ) :
                                            "choose-browser-hat" ==
                                            t
                                            .method ?
                                            (n.pets
                                                .cat1
                                                .hat =
                                                t
                                                .data
                                                .hat,
                                                u(),
                                                (
                                                    new Date)
                                                .getTime() >
                                                n
                                                .pets
                                                .cat1
                                                .hideUntil &&
                                                n
                                                .pets
                                                .cat1
                                                .show &&
                                                f(),
                                                i()
                                                ) :
                                            "choose-browser-eyes" ==
                                            t
                                            .method ?
                                            (n.pets
                                                .cat1
                                                .eyes =
                                                t
                                                .data
                                                .eyes,
                                                u(),
                                                (
                                                    new Date)
                                                .getTime() >
                                                n
                                                .pets
                                                .cat1
                                                .hideUntil &&
                                                n
                                                .pets
                                                .cat1
                                                .show &&
                                                f(),
                                                i()
                                                ) :
                                            "choose-browser-wings" ==
                                            t
                                            .method ?
                                            (n.pets
                                                .cat1
                                                .wings =
                                                t
                                                .data
                                                .wings,
                                                u(),
                                                (
                                                    new Date)
                                                .getTime() >
                                                n
                                                .pets
                                                .cat1
                                                .hideUntil &&
                                                n
                                                .pets
                                                .cat1
                                                .show &&
                                                f(),
                                                i()
                                                ) :
                                            "choose-browser-glasses" ==
                                            t
                                            .method ?
                                            (n.pets
                                                .cat1
                                                .glasses =
                                                t
                                                .data
                                                .glasses,
                                                u(),
                                                (
                                                    new Date)
                                                .getTime() >
                                                n
                                                .pets
                                                .cat1
                                                .hideUntil &&
                                                n
                                                .pets
                                                .cat1
                                                .show &&
                                                f(),
                                                i()
                                                ) :
                                            "choose-browser-mask" ==
                                            t
                                            .method ?
                                            (n.pets
                                                .cat1
                                                .mask =
                                                t
                                                .data
                                                .mask,
                                                u(),
                                                (
                                                    new Date)
                                                .getTime() >
                                                n
                                                .pets
                                                .cat1
                                                .hideUntil &&
                                                n
                                                .pets
                                                .cat1
                                                .show &&
                                                f(),
                                                i()
                                                ) :
                                            "choose-browser-face-mask" ==
                                            t
                                            .method ?
                                            (n.pets
                                                .cat1
                                                .faceMask =
                                                t
                                                .data
                                                .faceMask,
                                                u(),
                                                (
                                                    new Date)
                                                .getTime() >
                                                n
                                                .pets
                                                .cat1
                                                .hideUntil &&
                                                n
                                                .pets
                                                .cat1
                                                .show &&
                                                f(),
                                                i()
                                                ) :
                                            "randomEvent" ==
                                            t
                                            .method &&
                                            (k(),
                                                i()
                                                );
                                    case 55:
                                    case "end":
                                        return e
                                            .stop()
                                }
                        }), e)
                })))).apply(this, arguments)
            }

            function s() {
                return new Promise((function (e, r) {
                    chrome.storage.local.get(["pets"],
                        function () {
                            var r = t(regeneratorRuntime
                                .mark((function t(
                                r) {
                                    var o;
                                    return regeneratorRuntime
                                        .wrap(
                                            (function (
                                                t
                                                ) {
                                                for (;;)
                                                    switch (
                                                        t
                                                        .prev =
                                                        t
                                                        .next
                                                        ) {
                                                        case 0:
                                                            if (r &&
                                                                r
                                                                .pets
                                                                )
                                                                for (
                                                                    o in
                                                                    n
                                                                    .pets =
                                                                    JSON
                                                                    .parse(
                                                                        r
                                                                        .pets
                                                                        ),
                                                                    n
                                                                    .pets
                                                                    )
                                                                    n
                                                                    .pets[
                                                                        o
                                                                        ]
                                                                    .loyalty ||
                                                                    (n.pets[
                                                                            o]
                                                                        .loyalty =
                                                                        100
                                                                        ),
                                                                    n
                                                                    .pets[
                                                                        o
                                                                        ]
                                                                    .thirst ||
                                                                    (n.pets[
                                                                            o]
                                                                        .thirst =
                                                                        100
                                                                        ),
                                                                    n
                                                                    .pets[
                                                                        o
                                                                        ]
                                                                    .playful ||
                                                                    (n.pets[
                                                                            o]
                                                                        .playful =
                                                                        100
                                                                        ),
                                                                    n
                                                                    .pets[
                                                                        o
                                                                        ]
                                                                    .cleanliness ||
                                                                    (n.pets[
                                                                            o]
                                                                        .cleanliness =
                                                                        100
                                                                        );
                                                            else n
                                                                .pets = {
                                                                    cat1: new c,
                                                                    cat2: new c
                                                                };
                                                            u(),
                                                        e();
                                                        case 3:
                                                        case "end":
                                                            return t
                                                                .stop()
                                                    }
                                            }),
                                            t
                                            )
                                })));
                            return function (e) {
                                return r.apply(this,
                                    arguments)
                            }
                        }())
                }))
            }

            function c() {
                this.name = "Meow", this.sleep = 100, this.happiness =
                    100, this.hunger = 100, this.loyalty = 100, this
                    .cleanliness = 100, this.playful = 100, this
                    .thirst = 100, this.posLeft = null, this.posTop =
                    null, this.hideUntil = 0, this.show = !0, this
                    .walk = !0, this.talk = !0, this.idleType = "idle",
                    this.walkType = "BOTTOM", this.skin = "meow"
            }

            function u() {
                return new Promise((function (e, t) {
                    chrome.storage.local.set({
                        pets: JSON.stringify(n.pets)
                    }, (function () {
                        e()
                    }))
                }))
            }

            function p() {
                this.hours = 0, this.minutes = 0, this.text = "", this
                    .enabled = !0, this.lastReminded = (new Date)
                    .getTime()
            }

            function l() {
                var e = new p;
                e.enabled = !1, e.hours = 0, e.minutes = 20, e.text =
                    "Look away from your screen for 10 seconds and blink multiple times";
                var t = new p;
                t.enabled = !1, t.hours = 0, t.minutes = 45, t.text =
                    "Don't forget to drink";
                var r = new p;
                return r.enabled = !1, r.hours = 2, r.minutes = 0, r
                    .text =
                    "Take a rest from the screen, stand up and walk for a few minutes", {
                        1: e,
                        2: t,
                        3: r
                    }
            }

            function f() {
                a({
                    method: "revive",
                    data: n.pets.cat1
                })
            }

            function h() {
                return !("update_url" in chrome.runtime.getManifest())
            }
            chrome.runtime.onMessage.addListener((function (e, t, r) {
                return function (e, t, r) {
                    i.apply(this, arguments)
                }(e, t, r), !0
            })), chrome.tabs.onActivated.addListener((function (e) {
                (!n.pets.cat1.hideUntil || (new Date)
                    .getTime() > n.pets.cat1.hideUntil) &&
                chrome.tabs.sendMessage(e.tabId, {
                    method: "newActiveTab",
                    data: n.pets.cat1
                }, (function () {}))
            })), chrome.alarms.create("barTicks", {
                periodInMinutes: 5
            }), chrome.alarms.create("sleepTicks", {
                periodInMinutes: 1
            }), chrome.alarms.create("checkReminders", {
                periodInMinutes: 1
            }), chrome.alarms.onAlarm.addListener(function () {
                var e = t(regeneratorRuntime.mark((function e(
                t) {
                    return regeneratorRuntime
                        .wrap((function (e) {
                            for (;;)
                                switch (
                                    e
                                    .prev =
                                    e
                                    .next
                                    ) {
                                    case 0:
                                        if (n
                                            .pets
                                            ) {
                                            e.next =
                                                3;
                                            break
                                        }
                                        return e
                                            .next =
                                            3,
                                            s();
                                    case 3:
                                        e.t0 =
                                            t
                                            .name,
                                            e
                                            .next =
                                            "barTicks" ===
                                            e
                                            .t0 ?
                                            6 :
                                            "sleepTicks" ===
                                            e
                                            .t0 ?
                                            8 :
                                            "checkReminders" ===
                                            e
                                            .t0 ?
                                            10 :
                                            12;
                                        break;
                                    case 6:
                                        return T(),
                                            e
                                            .abrupt(
                                                "break",
                                                12
                                                );
                                    case 8:
                                        return E(),
                                            e
                                            .abrupt(
                                                "break",
                                                12
                                                );
                                    case 10:
                                        return O(),
                                            e
                                            .abrupt(
                                                "break",
                                                12
                                                );
                                    case 12:
                                    case "end":
                                        return e
                                            .stop()
                                }
                        }), e)
                })));
                return function (t) {
                    return e.apply(this, arguments)
                }
            }());
            var d = ["I knew that you loved me", "Thank youuuu",
                    "Thankssss", "Meow Meow ^^", "^^",
                    "I LOVE YOU {owner}", "{owner}, You're the best",
                    "It feels so good", "My life is purrfect"
                ],
                v = ["{pet} is so bored", "{pet} life is meaningless",
                    "Take me to the playground please",
                    "All {pet} needs is looooove", "I am here",
                    "{pet} is here", "Why Don't you love {pet}?",
                    "No petting no fun",
                    "Why don't you play with {pet}",
                    "{owner} doesn't love me", "You don't love {pet}",
                    "Please pet me"
                ],
                m = ["{fish}", "{cheese}", "{chicken}"],
                y = ["{fish}", "{cheese}", "{chicken}",
                    "{pet} is so hungry", "{owner} doesn't love {pet}",
                    "Please feed {pet}", "Why no food Why",
                    "Is it fish? Do I see fish?", "Meow needs food",
                    "Do I smell fish?", "{owner} doesn't feed me"
                ],
                g = ["Please Pet Me", "Meow Meow Meow ^^",
                    "I love my {owner}...", "Whats'uppppp human",
                    "Please hug me", "You look great today :)",
                    "Please hug me", "I need a petting from {owner} ^^",
                    "This is an awesome website",
                    "Are you there {owner}?", "My name is {pet}",
                    "Who let the dogs out... Meow Meow",
                    "It smells like fish", "I hate water",
                    "Can you put the Meow Meow song?",
                    "Trust me, {pet} engineer... :D", "Boo !", "Ku-Ku",
                    "Time spent with cats is never wasted.",
                    "What would you do without me?", "HEY {owner}",
                    "KEEP CALM AND PET ME", "Rawrrrr",
                    "I Love my human pillow",
                    "Me happy, you happy, we happy...",
                    "I will sing for Tuna", "I like your mouse...",
                    "This is my favorite spot",
                    "Adopting you was my best decision ever",
                    "What are you doing there?", "check meow out",
                    "I need a hug right about meow",
                    "You are the purrfect {owner} :3",
                    "Take me to the Playground", "Let's play",
                    "{owner} {owner} {owner}"
                ],
                w = {
                    lastEvent: 0,
                    isUnhappy: function (e) {
                        return e || (e = 20), n.pets.cat1
                            .happiness < e
                    },
                    isHungry: function (e) {
                        return e || (e = 20), n.pets.cat1.hunger < e
                    },
                    isSleepy: function (e) {
                        return e || (e = 20), n.pets.cat1.sleep < e
                    },
                    sendIdleMode: function () {
                        a({
                            method: "update-idle",
                            data: n.pets.cat1
                        })
                    }
                },
                x = function (e) {
                    var t = "";
                    switch (e) {
                        case "hungry":
                            t = y[Math.floor(Math.random() * y.length)];
                            break;
                        case "unhappy":
                            t = v[Math.floor(Math.random() * v.length)];
                            break;
                        case "happy":
                            t = d[Math.floor(Math.random() * d.length)];
                            break;
                        case "dreaming":
                            t = m[Math.floor(Math.random() * m.length)];
                            break;
                        default:
                            t = g[Math.floor(Math.random() * g.length)]
                    }
                    var r = n.pets.cat1.name,
                        o = n.ownerName;
                    return o || (o = "Human"), r || (r = "Meow"), t
                        .replace(/{owner}/g, o).replace(/{pet}/g, r)
                },
                b = function () {
                    ("sleep" == n.pets.cat1.idleType && n.pets.cat1
                        .sleep >= 90 || "sad" == n.pets.cat1.idleType &&
                        n.pets.cat1.happiness >= 40 && n.pets.cat1
                        .hunger >= 40) && (n.pets.cat1.idleType =
                        "idle", w.sendIdleMode()), n.pets.cat1
                        .happiness > 100 ? n.pets.cat1.happiness = 100 :
                        n.pets.cat1.happiness < 0 && (n.pets.cat1
                            .happiness = 0), n.pets.cat1.hunger > 100 ?
                        n.pets.cat1.hunger = 100 : n.pets.cat1.hunger <
                        0 && (n.pets.cat1.hunger = 0), n.pets.cat1
                        .sleep > 100 ? n.pets.cat1.sleep = 100 : n.pets
                        .cat1.sleep < 0 && (n.pets.cat1.sleep = 0), n
                        .pets.cat1.loyalty > 100 ? n.pets.cat1.loyalty =
                        100 : n.pets.cat1.loyalty < 0 && (n.pets.cat1
                            .loyalty = 0)
                },
                k = function () {
                    if (n.pets.cat1.show) {
                        var e = (new Date).getTime();
                        if (!(e - w.lastEvent < 4e3)) {
                            var t = Math.floor(450 * Math.random()) + 1,
                                r = null,
                                a = {
                                    text: ""
                                };
                            "sleep" == n.pets.cat1.idleType ? t <= 20 &&
                                (r = "talk", a.text = x("dreaming")) : w
                                .isSleepy() ? (n.pets.cat1.idleType =
                                    "sleep", r = "sleep") : "sad" != n
                                .pets.cat1.idleType && w.isUnhappy(
                                40) || "sad" != n.pets.cat1.idleType &&
                                w.isHungry(40) ? (n.pets.cat1.idleType =
                                    "sad", r = "sad") : w.isHungry() ?
                                t <= 20 && (r = "talk", a.text = x(
                                    "hungry")) : w.isUnhappy() ? t <=
                                20 && (r = "talk", a.text = x(
                                    "unhappy")) : t >= 21 && t <= 40 &&
                                "sleep" != n.pets.cat1.idleType ? r =
                                "run" : t >= 41 && t <= 55 && "sleep" !=
                                n.pets.cat1.idleType ? r = "walk" : t >=
                                61 && t <= 80 && "sleep" != n.pets.cat1
                                .idleType ? (r = "talk", a.text = x(
                                    "default")) : t >= 81 && t <= 90 &&
                                "sleep" != n.pets.cat1.idleType && (r =
                                    "lick"), r && (w.lastEvent = e, o({
                                    method: "action",
                                    data: {
                                        name: r,
                                        parameters: a
                                    }
                                })), u()
                        }
                    }
                },
                T = function () {
                    "sleep" != n.pets.cat1.idleType && (n.pets.cat1
                            .sleep -= 1, n.pets.cat1.hunger -= 1, n.pets
                            .cat1.happiness -= 1), n.pets.cat1
                        .happiness > 65 ? n.pets.cat1.loyalty += 5 : n
                        .pets.cat1.loyalty -= 1, b(), u()
                },
                E = function () {
                    "sleep" == n.pets.cat1.idleType && (n.pets.cat1
                        .sleep += 5), b(), u()
                },
                O = function () {
                    if (n.reminders)
                        for (var e in n.reminders)
                            if (n.reminders.hasOwnProperty(e)) {
                                var t = (new Date).getTime(),
                                    r = parseInt(n.reminders[e]
                                        .lastReminded),
                                    a = 60 * n.reminders[e].hours * 60 +
                                    60 * n.reminders[e].minutes;
                                if (n.reminders[e].enabled && n
                                    .reminders[e].text && r / 1e3 + a <
                                    t / 1e3) return chrome
                                    .notifications && n
                                    .chromePopupReminders && chrome
                                    .notifications.create(
                                        "Meow reminder", {
                                            type: "basic",
                                            title: "Reminder",
                                            iconUrl: "/16.png",
                                            message: n.reminders[e]
                                                .text
                                        }, (function (e) {})), n
                                    .reminders[e].lastReminded = t,
                                    chrome.storage.local.set({
                                        reminders: JSON
                                            .stringify(n
                                                .reminders)
                                    }), o({
                                        method: "action",
                                        data: {
                                            name: "talk",
                                            parameters: {
                                                text: n
                                                    .reminders[
                                                        e].text,
                                                isReminder: !0
                                            }
                                        }
                                    }), void(w.lastEvent = t)
                            }
                };
            ! function () {
                if (chrome.runtime.onInstalled) try {
                    chrome.runtime.onInstalled.addListener((
                        function (e) {
                            "install" == e.reason ? (chrome
                                .tabs.create({
                                    url: "https://www.meowplayground.com/welcome"
                                }), fetch(
                                    "https://www.meowplayground.com/install", {
                                        method: "post",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON
                                            .stringify({
                                                version: chrome
                                                    .runtime
                                                    .getManifest()
                                                    .version
                                            })
                                    })) : e.reason
                        }))
                } catch (e) {}
                chrome.runtime.setUninstallURL
            }(), new Promise((function (e, t) {
                chrome.storage.local.get(["reminders",
                    "chromePopupReminders",
                    "ownerName"
                ], (function (t) {
                    t && t.reminders ? n
                        .reminders = JSON.parse(
                            t.reminders) : (n
                            .reminders = l(),
                            chrome.storage.local
                            .set({
                                reminders: JSON
                                    .stringify(
                                        n
                                        .reminders
                                        )
                            })), t && 1 == t
                        .chromePopupReminders &&
                        (n.chromePopupReminders = !
                            0), t && t
                        .ownerName && (n
                            .ownerName = t
                            .ownerName), e()
                }))
            })), s()
        })()
})();
