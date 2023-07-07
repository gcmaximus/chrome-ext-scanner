/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
var d, e = e || {};
e.scope = {};
e.arrayIteratorImpl = function (a) {
    var b = 0;
    return function () {
        return b < a.length ? {
            done: !1,
            value: a[b++]
        } : {
            done: !0
        }
    }
};
e.arrayIterator = function (a) {
    return {
        next: e.arrayIteratorImpl(a)
    }
};
e.ASSUME_ES5 = !1;
e.ASSUME_NO_NATIVE_MAP = !1;
e.ASSUME_NO_NATIVE_SET = !1;
e.SIMPLE_FROUND_POLYFILL = !1;
e.ISOLATE_POLYFILLS = !1;
e.FORCE_POLYFILL_PROMISE = !1;
e.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1;
e.defineProperty = e.ASSUME_ES5 || "function" == typeof Object
    .defineProperties ? Object.defineProperty : function (a, b, c) {
        if (a == Array.prototype || a == Object.prototype) return a;
        a[b] = c.value;
        return a
    };
e.getGlobal = function (a) {
    a = ["object" == typeof globalThis && globalThis, a, "object" ==
        typeof window && window, "object" == typeof self && self,
        "object" == typeof global && global
    ];
    for (var b = 0; b < a.length; ++b) {
        var c = a[b];
        if (c && c.Math == Math) return c
    }
    throw Error("Cannot find global object");
};
e.global = e.getGlobal(this);
e.IS_SYMBOL_NATIVE = "function" === typeof Symbol && "symbol" === typeof Symbol(
    "x");
e.TRUST_ES6_POLYFILLS = !e.ISOLATE_POLYFILLS || e.IS_SYMBOL_NATIVE;
e.polyfills = {};
e.propertyToPolyfillSymbol = {};
e.POLYFILL_PREFIX = "$jscp$";
e.polyfill = function (a, b, c) {
    b && (e.ISOLATE_POLYFILLS ? e.polyfillIsolated(a, b, c) : e
        .polyfillUnisolated(a, b))
};
e.polyfillUnisolated = function (a, b) {
    var c = e.global;
    a = a.split(".");
    for (var f = 0; f < a.length - 1; f++) {
        var g = a[f];
        if (!(g in c)) return;
        c = c[g]
    }
    a = a[a.length - 1];
    f = c[a];
    b = b(f);
    b != f && null != b && e.defineProperty(c, a, {
        configurable: !0,
        writable: !0,
        value: b
    })
};
e.polyfillIsolated = function (a, b, c) {
    var f = a.split(".");
    a = 1 === f.length;
    var g = f[0];
    g = !a && g in e.polyfills ? e.polyfills : e.global;
    for (var h = 0; h < f.length - 1; h++) {
        var l = f[h];
        if (!(l in g)) return;
        g = g[l]
    }
    f = f[f.length - 1];
    c = e.IS_SYMBOL_NATIVE && "es6" === c ? g[f] : null;
    b = b(c);
    null != b && (a ? e.defineProperty(e.polyfills, f, {
        configurable: !0,
        writable: !0,
        value: b
    }) : b !== c && (void 0 === e.propertyToPolyfillSymbol[f] && (e
            .propertyToPolyfillSymbol[f] = e.IS_SYMBOL_NATIVE ? e
            .global.Symbol(f) : e.POLYFILL_PREFIX + f), e
        .defineProperty(g, e.propertyToPolyfillSymbol[f], {
            configurable: !0,
            writable: !0,
            value: b
        })))
};
e.initSymbol = function () {};
e.polyfill("Symbol", function (a) {
    if (a) return a;
    var b = function (g, h) {
        this.$jscomp$symbol$id_ = g;
        e.defineProperty(this, "description", {
            configurable: !0,
            writable: !0,
            value: h
        })
    };
    b.prototype.toString = function () {
        return this.$jscomp$symbol$id_
    };
    var c = 0,
        f = function (g) {
            if (this instanceof f) throw new TypeError(
                "Symbol is not a constructor");
            return new b("jscomp_symbol_" + (g || "") + "_" + c++, g)
        };
    return f
}, "es6");
e.polyfill("Symbol.iterator", function (a) {
    if (a) return a;
    a = Symbol("Symbol.iterator");
    for (var b =
            "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array"
            .split(" "), c = 0; c < b.length; c++) {
        var f = e.global[b[c]];
        "function" === typeof f && "function" != typeof f.prototype[
            a] && e.defineProperty(f.prototype, a, {
                configurable: !0,
                writable: !0,
                value: function () {
                    return e.iteratorPrototype(e
                        .arrayIteratorImpl(this))
                }
            })
    }
    return a
}, "es6");
e.iteratorPrototype = function (a) {
    a = {
        next: a
    };
    a[Symbol.iterator] = function () {
        return this
    };
    return a
};
e.createTemplateTagFirstArg = function (a) {
    return a.raw = a
};
e.createTemplateTagFirstArgWithRaw = function (a, b) {
    a.raw = b;
    return a
};
e.makeIterator = function (a) {
    var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol
        .iterator];
    return b ? b.call(a) : e.arrayIterator(a)
};
e.arrayFromIterator = function (a) {
    for (var b, c = []; !(b = a.next()).done;) c.push(b.value);
    return c
};
e.arrayFromIterable = function (a) {
    return a instanceof Array ? a : e.arrayFromIterator(e.makeIterator(a))
};
e.objectCreate = e.ASSUME_ES5 || "function" == typeof Object.create ? Object
    .create : function (a) {
        var b = function () {};
        b.prototype = a;
        return new b
    };
e.getConstructImplementation = function () {
    function a() {
        function c() {}
        new c;
        Reflect.construct(c, [], function () {});
        return new c instanceof c
    }
    if (e.TRUST_ES6_POLYFILLS && "undefined" != typeof Reflect && Reflect
        .construct) {
        if (a()) return Reflect.construct;
        var b = Reflect.construct;
        return function (c, f, g) {
            c = b(c, f);
            g && Reflect.setPrototypeOf(c, g.prototype);
            return c
        }
    }
    return function (c, f, g) {
        void 0 === g && (g = c);
        g = e.objectCreate(g.prototype || Object.prototype);
        return Function.prototype.apply.call(c, g, f) || g
    }
};
e.construct = {
    valueOf: e.getConstructImplementation
}.valueOf();
e.underscoreProtoCanBeSet = function () {
    var a = {
            a: !0
        },
        b = {};
    try {
        return b.__proto__ = a, b.a
    } catch (c) {}
    return !1
};
e.setPrototypeOf = e.TRUST_ES6_POLYFILLS && "function" == typeof Object
    .setPrototypeOf ? Object.setPrototypeOf : e.underscoreProtoCanBeSet() ?
    function (a, b) {
        a.__proto__ = b;
        if (a.__proto__ !== b) throw new TypeError(a + " is not extensible");
        return a
    } : null;
e.inherits = function (a, b) {
    a.prototype = e.objectCreate(b.prototype);
    a.prototype.constructor = a;
    if (e.setPrototypeOf) {
        var c = e.setPrototypeOf;
        c(a, b)
    } else
        for (c in b)
            if ("prototype" != c)
                if (Object.defineProperties) {
                    var f = Object.getOwnPropertyDescriptor(b, c);
                    f && Object.defineProperty(a, c, f)
                } else a[c] = b[c];
    a.superClass_ = b.prototype
};
e.polyfill("Reflect", function (a) {
    return a ? a : {}
}, "es6");
e.polyfill("Reflect.construct", function () {
    return e.construct
}, "es6");
e.polyfill("Reflect.setPrototypeOf", function (a) {
    if (a) return a;
    if (e.setPrototypeOf) {
        var b = e.setPrototypeOf;
        return function (c, f) {
            try {
                return b(c, f), !0
            } catch (g) {
                return !1
            }
        }
    }
    return null
}, "es6");
e.findInternal = function (a, b, c) {
    a instanceof String && (a = String(a));
    for (var f = a.length, g = 0; g < f; g++) {
        var h = a[g];
        if (b.call(c, h, g, a)) return {
            i: g,
            v: h
        }
    }
    return {
        i: -1,
        v: void 0
    }
};
e.checkStringArgs = function (a, b, c) {
    if (null == a) throw new TypeError(
        "The 'this' value for String.prototype." + c +
        " must not be null or undefined");
    if (b instanceof RegExp) throw new TypeError(
        "First argument to String.prototype." + c +
        " must not be a regular expression");
    return a + ""
};
e.polyfill("String.prototype.endsWith", function (a) {
    return a ? a : function (b, c) {
        var f = e.checkStringArgs(this, b, "endsWith");
        b += "";
        void 0 === c && (c = f.length);
        c = Math.max(0, Math.min(c | 0, f.length));
        for (var g = b.length; 0 < g && 0 < c;)
            if (f[--c] != b[--g]) return !1;
        return 0 >= g
    }
}, "es6");
e.polyfill("String.prototype.startsWith", function (a) {
    return a ? a : function (b, c) {
        var f = e.checkStringArgs(this, b, "startsWith");
        b += "";
        var g = f.length,
            h = b.length;
        c = Math.max(0, Math.min(c | 0, f.length));
        for (var l = 0; l < h && c < g;)
            if (f[c++] != b[l++]) return !1;
        return l >= h
    }
}, "es6");
e.polyfill("String.prototype.repeat", function (a) {
    return a ? a : function (b) {
        var c = e.checkStringArgs(this, null, "repeat");
        if (0 > b || 1342177279 < b) throw new RangeError(
            "Invalid count value");
        b |= 0;
        for (var f = ""; b;)
            if (b & 1 && (f += c), b >>>= 1) c += c;
        return f
    }
}, "es6");
e.polyfill("String.prototype.trimLeft", function (a) {
    function b() {
        return this.replace(/^[\s\xa0]+/, "")
    }
    return a || b
}, "es_2019");
e.iteratorFromArray = function (a, b) {
    a instanceof String && (a += "");
    var c = 0,
        f = !1,
        g = {
            next: function () {
                if (!f && c < a.length) {
                    var h = c++;
                    return {
                        value: b(h, a[h]),
                        done: !1
                    }
                }
                f = !0;
                return {
                    done: !0,
                    value: void 0
                }
            }
        };
    g[Symbol.iterator] = function () {
        return g
    };
    return g
};
e.polyfill("Array.prototype.entries", function (a) {
    return a ? a : function () {
        return e.iteratorFromArray(this, function (b, c) {
            return [b, c]
        })
    }
}, "es6");
e.polyfill("Array.prototype.keys", function (a) {
    return a ? a : function () {
        return e.iteratorFromArray(this, function (b) {
            return b
        })
    }
}, "es6");
var k = k || {};
k.global = this || self;
k.exportPath_ = function (a, b, c, f) {
    a = a.split(".");
    f = f || k.global;
    a[0] in f || "undefined" == typeof f.execScript || f.execScript("var " +
        a[0]);
    for (var g; a.length && (g = a.shift());)
        if (a.length || void 0 === b) f = f[g] && f[g] !== Object.prototype[
            g] ? f[g] : f[g] = {};
        else if (!c && k.isObject(b) && k.isObject(f[g]))
        for (var h in b) b.hasOwnProperty(h) && (f[g][h] = b[h]);
    else f[g] = b
};
k.define = function (a, b) {
    return b
};
k.FEATURESET_YEAR = 2012;
k.DEBUG = !0;
k.LOCALE = "en";
k.TRUSTED_SITE = !0;
k.DISALLOW_TEST_ONLY_CODE = !k.DEBUG;
k.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING = !1;
k.provide = function (a) {
    if (k.isInModuleLoader_()) throw Error(
        "goog.provide cannot be used within a module.");
    k.constructNamespace_(a)
};
k.constructNamespace_ = function (a, b, c) {
    k.exportPath_(a, b, c)
};
k.getScriptNonce = function (a) {
    if (a && a != k.global) return k.getScriptNonce_(a.document);
    null === k.cspNonce_ && (k.cspNonce_ = k.getScriptNonce_(k.global
        .document));
    return k.cspNonce_
};
k.NONCE_PATTERN_ = /^[\w+/_-]+[=]{0,2}$/;
k.cspNonce_ = null;
k.getScriptNonce_ = function (a) {
    return (a = a.querySelector && a.querySelector("script[nonce]")) && (a =
            a.nonce || a.getAttribute("nonce")) && k.NONCE_PATTERN_.test(
        a) ? a : ""
};
k.VALID_MODULE_RE_ = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/;
k.module = function (a) {
    if ("string" !== typeof a || !a || -1 == a.search(k.VALID_MODULE_RE_))
        throw Error("Invalid module identifier");
    if (!k.isInGoogModuleLoader_()) throw Error("Module " + a +
        " has been loaded incorrectly. Note, modules cannot be loaded as normal scripts. They require some kind of pre-processing step. You're likely trying to load a module via a script tag or as a part of a concatenated bundle without rewriting the module. For more info see: https://github.com/google/closure-library/wiki/goog.module:-an-ES6-module-like-alternative-to-goog.provide."
        );
    if (k.moduleLoaderState_.moduleName) throw Error(
        "goog.module may only be called once per module.");
    k.moduleLoaderState_.moduleName = a
};
k.module.get = function () {
    return null
};
k.module.getInternal_ = function () {
    return null
};
k.ModuleType = {
    ES6: "es6",
    GOOG: "goog"
};
k.moduleLoaderState_ = null;
k.isInModuleLoader_ = function () {
    return k.isInGoogModuleLoader_() || k.isInEs6ModuleLoader_()
};
k.isInGoogModuleLoader_ = function () {
    return !!k.moduleLoaderState_ && k.moduleLoaderState_.type == k
        .ModuleType.GOOG
};
k.isInEs6ModuleLoader_ = function () {
    if (k.moduleLoaderState_ && k.moduleLoaderState_.type == k.ModuleType
        .ES6) return !0;
    var a = k.global.$jscomp;
    return a ? "function" != typeof a.getCurrentModulePath ? !1 : !!a
        .getCurrentModulePath() : !1
};
k.module.declareLegacyNamespace = function () {
    k.moduleLoaderState_.declareLegacyNamespace = !0
};
k.declareModuleId = function (a) {
    if (k.moduleLoaderState_) k.moduleLoaderState_.moduleName = a;
    else {
        var b = k.global.$jscomp;
        if (!b || "function" != typeof b.getCurrentModulePath) throw Error(
            'Module with namespace "' + a +
            '" has been loaded incorrectly.');
        b = b.require(b.getCurrentModulePath());
        k.loadedModules_[a] = {
            exports: b,
            type: k.ModuleType.ES6,
            moduleId: a
        }
    }
};
k.setTestOnly = function (a) {
    if (k.DISALLOW_TEST_ONLY_CODE) throw a = a || "", Error(
        "Importing test-only code into non-debug environment" + (a ?
            ": " + a : "."));
};
k.forwardDeclare = function () {};
k.getObjectByName = function (a) {
    a = a.split(".");
    for (var b = k.global, c = 0; c < a.length; c++)
        if (b = b[a[c]], null == b) return null;
    return b
};
k.addDependency = function () {};
k.useStrictRequires = !1;
k.ENABLE_DEBUG_LOADER = !0;
k.logToConsole_ = function (a) {
    k.global.console && k.global.console.error(a)
};
k.require = function () {};
k.requireType = function () {
    return {}
};
k.basePath = "";
k.nullFunction = function () {};
k.abstractMethod = function () {
    throw Error("unimplemented abstract method");
};
k.addSingletonGetter = function (a) {
    a.instance_ = void 0;
    a.getInstance = function () {
        if (a.instance_) return a.instance_;
        k.DEBUG && (k.instantiatedSingletons_[k.instantiatedSingletons_
            .length] = a);
        return a.instance_ = new a
    }
};
k.instantiatedSingletons_ = [];
k.LOAD_MODULE_USING_EVAL = !0;
k.SEAL_MODULE_EXPORTS = k.DEBUG;
k.loadedModules_ = {};
k.DEPENDENCIES_ENABLED = !1;
k.TRANSPILE = "detect";
k.ASSUME_ES_MODULES_TRANSPILED = !1;
k.TRANSPILE_TO_LANGUAGE = "";
k.TRANSPILER = "transpile.js";
k.hasBadLetScoping = null;
k.loadModule = function (a) {
    var b = k.moduleLoaderState_;
    try {
        k.moduleLoaderState_ = {
            moduleName: "",
            declareLegacyNamespace: !1,
            type: k.ModuleType.GOOG
        };
        var c = {},
            f = c;
        if ("function" === typeof a) f = a.call(void 0, f);
        else if ("string" === typeof a) f = k.loadModuleFromSource_.call(
            void 0, f, a);
        else throw Error("Invalid module definition");
        var g = k.moduleLoaderState_.moduleName;
        if ("string" === typeof g && g) k.moduleLoaderState_
            .declareLegacyNamespace ? k.constructNamespace_(g, f, c !== f) :
            k.SEAL_MODULE_EXPORTS && Object.seal && "object" ==
            typeof f && null != f && Object.seal(f), k.loadedModules_[g] = {
                exports: f,
                type: k.ModuleType.GOOG,
                moduleId: k.moduleLoaderState_.moduleName
            };
        else throw Error('Invalid module name "' + g + '"');
    } finally {
        k.moduleLoaderState_ = b
    }
};
k.loadModuleFromSource_ = function (a, b) {
    eval(k.CLOSURE_EVAL_PREFILTER_.createScript(b));
    return a
};
k.normalizePath_ = function (a) {
    a = a.split("/");
    for (var b = 0; b < a.length;) "." == a[b] ? a.splice(b, 1) : b &&
        ".." == a[b] && a[b - 1] && ".." != a[b - 1] ? a.splice(--b, 2) :
        b++;
    return a.join("/")
};
k.loadFileSync_ = function (a) {
    if (k.global.CLOSURE_LOAD_FILE_SYNC) return k.global
        .CLOSURE_LOAD_FILE_SYNC(a);
    try {
        var b = new k.global.XMLHttpRequest;
        b.open("get", a, !1);
        b.send();
        return 0 == b.status || 200 == b.status ? b.responseText : null
    } catch (c) {
        return null
    }
};
k.transpile_ = function (a, b, c) {
    var f = k.global.$jscomp;
    f || (k.global.$jscomp = f = {});
    var g = f.transpile;
    if (!g) {
        var h = k.basePath + k.TRANSPILER,
            l = k.loadFileSync_(h);
        if (l) {
            (function () {
                (0, eval)(l + "\n//# sourceURL=" + h)
            }).call(k.global);
            if (k.global.$gwtExport && k.global.$gwtExport.$jscomp && !k
                .global.$gwtExport.$jscomp.transpile) throw Error(
                'The transpiler did not properly export the "transpile" method. $gwtExport: ' +
                JSON.stringify(k.global.$gwtExport));
            k.global.$jscomp.transpile = k.global.$gwtExport.$jscomp
                .transpile;
            f = k.global.$jscomp;
            g = f.transpile
        }
    }
    if (!g) {
        var r = " requires transpilation but no transpiler was found.";
        r +=
        ' Please add "//javascript/closure:transpiler" as a data dependency to ensure it is included.';
        g = f.transpile = function (v, E) {
            k.logToConsole_(E + r);
            return v
        }
    }
    return g(a, b, c)
};
k.typeOf = function (a) {
    var b = typeof a;
    return "object" != b ? b : a ? Array.isArray(a) ? "array" : b : "null"
};
k.isArrayLike = function (a) {
    var b = k.typeOf(a);
    return "array" == b || "object" == b && "number" == typeof a.length
};
k.isDateLike = function (a) {
    return k.isObject(a) && "function" == typeof a.getFullYear
};
k.isObject = function (a) {
    var b = typeof a;
    return "object" == b && null != a || "function" == b
};
k.getUid = function (a) {
    return Object.prototype.hasOwnProperty.call(a, k.UID_PROPERTY_) && a[k
        .UID_PROPERTY_] || (a[k.UID_PROPERTY_] = ++k.uidCounter_)
};
k.hasUid = function (a) {
    return !!a[k.UID_PROPERTY_]
};
k.removeUid = function (a) {
    null !== a && "removeAttribute" in a && a.removeAttribute(k
        .UID_PROPERTY_);
    try {
        delete a[k.UID_PROPERTY_]
    } catch (b) {}
};
k.UID_PROPERTY_ = "closure_uid_" + (1E9 * Math.random() >>> 0);
k.uidCounter_ = 0;
k.cloneObject = function (a) {
    var b = k.typeOf(a);
    if ("object" == b || "array" == b) {
        if ("function" === typeof a.clone) return a.clone();
        b = "array" == b ? [] : {};
        for (var c in a) b[c] = k.cloneObject(a[c]);
        return b
    }
    return a
};
k.bindNative_ = function (a, b, c) {
    return a.call.apply(a.bind, arguments)
};
k.bindJs_ = function (a, b, c) {
    if (!a) throw Error();
    if (2 < arguments.length) {
        var f = Array.prototype.slice.call(arguments, 2);
        return function () {
            var g = Array.prototype.slice.call(arguments);
            Array.prototype.unshift.apply(g, f);
            return a.apply(b, g)
        }
    }
    return function () {
        return a.apply(b, arguments)
    }
};
k.bind = function (a, b, c) {
    Function.prototype.bind && -1 != Function.prototype.bind.toString()
        .indexOf("native code") ? k.bind = k.bindNative_ : k.bind = k
        .bindJs_;
    return k.bind.apply(null, arguments)
};
k.partial = function (a, b) {
    var c = Array.prototype.slice.call(arguments, 1);
    return function () {
        var f = c.slice();
        f.push.apply(f, arguments);
        return a.apply(this, f)
    }
};
k.mixin = function (a, b) {
    for (var c in b) a[c] = b[c]
};
k.now = function () {
    return Date.now()
};
k.globalEval = function (a) {
    (0, eval)(a)
};
k.getCssName = function (a, b) {
    if ("." == String(a).charAt(0)) throw Error(
        'className passed in goog.getCssName must not start with ".". You passed: ' +
        a);
    var c = function (g) {
            return k.cssNameMapping_[g] || g
        },
        f = function (g) {
            g = g.split("-");
            for (var h = [], l = 0; l < g.length; l++) h.push(c(g[l]));
            return h.join("-")
        };
    f = k.cssNameMapping_ ? "BY_WHOLE" == k.cssNameMappingStyle_ ? c : f :
        function (g) {
            return g
        };
    a = b ? a + "-" + f(b) : f(a);
    return k.global.CLOSURE_CSS_NAME_MAP_FN ? k.global
        .CLOSURE_CSS_NAME_MAP_FN(a) : a
};
k.setCssNameMapping = function (a, b) {
    k.cssNameMapping_ = a;
    k.cssNameMappingStyle_ = b
};
k.getMsg = function (a, b, c) {
    c && c.html && (a = a.replace(/</g, "&lt;"));
    c && c.unescapeHtmlEntities && (a = a.replace(/&lt;/g, "<").replace(
        /&gt;/g, ">").replace(/&apos;/g, "'").replace(/&quot;/g,
        '"').replace(/&amp;/g, "&"));
    b && (a = a.replace(/\{\$([^}]+)}/g, function (f, g) {
        return null != b && g in b ? b[g] : f
    }));
    return a
};
k.getMsgWithFallback = function (a) {
    return a
};
k.exportSymbol = function (a, b, c) {
    k.exportPath_(a, b, !0, c)
};
k.exportProperty = function (a, b, c) {
    a[b] = c
};
k.inherits = function (a, b) {
    function c() {}
    c.prototype = b.prototype;
    a.superClass_ = b.prototype;
    a.prototype = new c;
    a.prototype.constructor = a;
    a.base = function (f, g, h) {
        for (var l = Array(arguments.length - 2), r = 2; r < arguments
            .length; r++) l[r - 2] = arguments[r];
        return b.prototype[g].apply(f, l)
    }
};
k.scope = function (a) {
    if (k.isInModuleLoader_()) throw Error(
        "goog.scope is not supported within a module.");
    a.call(k.global)
};
k.defineClass = function (a, b) {
    var c = b.constructor,
        f = b.statics;
    c && c != Object.prototype.constructor || (c = function () {
        throw Error(
            "cannot instantiate an interface (no constructor defined)."
            );
    });
    c = k.defineClass.createSealingConstructor_(c);
    a && k.inherits(c, a);
    delete b.constructor;
    delete b.statics;
    k.defineClass.applyProperties_(c.prototype, b);
    null != f && (f instanceof Function ? f(c) : k.defineClass
        .applyProperties_(c, f));
    return c
};
k.defineClass.SEAL_CLASS_INSTANCES = k.DEBUG;
k.defineClass.createSealingConstructor_ = function (a) {
    return k.defineClass.SEAL_CLASS_INSTANCES ? function () {
        var b = a.apply(this, arguments) || this;
        b[k.UID_PROPERTY_] = b[k.UID_PROPERTY_];
        return b
    } : a
};
k.defineClass.OBJECT_PROTOTYPE_FIELDS_ =
    "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf"
    .split(" ");
k.defineClass.applyProperties_ = function (a, b) {
    for (var c in b) Object.prototype.hasOwnProperty.call(b, c) && (a[c] =
        b[c]);
    for (var f = 0; f < k.defineClass.OBJECT_PROTOTYPE_FIELDS_.length; f++)
        c = k.defineClass.OBJECT_PROTOTYPE_FIELDS_[f], Object.prototype
        .hasOwnProperty.call(b, c) && (a[c] = b[c])
};
k.TRUSTED_TYPES_POLICY_NAME = "goog";
k.identity_ = function (a) {
    return a
};
k.createTrustedTypesPolicy = function () {
    var a = k.TRUSTED_TYPES_POLICY_NAME + "#html",
        b = null,
        c = k.global.trustedTypes;
    if (!c || !c.createPolicy) return b;
    try {
        b = c.createPolicy(a, {
            createHTML: k.identity_,
            createScript: k.identity_,
            createScriptURL: k.identity_
        })
    } catch (f) {
        k.logToConsole_(f.message)
    }
    return b
};
k.craw = {};
var aa = function () {};
aa.prototype.getWindowBounds = function () {};
aa.impl_ = aa;
k.craw.AppBackgroundDelegate = aa;
var ca = function (a, b) {
    this.url_ = a;
    this.useAuth_ = b
};
ca.prototype.getUrl = function () {
    return this.url_
};
ca.prototype.getUseAuth = function () {
    return this.useAuth_
};
k.craw.WindowConfig = ca;
var da = {
        Errors: {}
    },
    ea = {
        MINT_JWT_ERROR: "MINT_JWT_ERROR",
        PURCHASE_CANCELED: "PURCHASE_CANCELED",
        CONSUME_PURCHASE_ERROR: "CONSUME_PURCHASE_ERROR",
        GET_PURCHASES_ERROR: "GET_PURCHASES_ERROR",
        GET_SKU_DETAILS_ERROR: "GET_SKU_DETAILS_ERROR",
        ENV_NOT_SUPPORTED_ERROR: "ENV_NOT_SUPPORTED_ERROR",
        TOKEN_MISSING_ERROR: "TOKEN_MISSING_ERROR",
        INVALID_RESPONSE_ERROR: "INVALID_RESPONSE_ERROR"
    };

function fa(a) {
    return {
        request: {},
        response: {
            errorType: a
        }
    }
}
da.Errors.ErrorTypes = ea;
da.Errors.getErrorResponse = fa;
k.debug = {};

function ha(a) {
    if (Error.captureStackTrace) Error.captureStackTrace(this, ha);
    else {
        var b = Error().stack;
        b && (this.stack = b)
    }
    a && (this.message = String(a))
}
k.inherits(ha, Error);
ha.prototype.name = "CustomError";
k.debug.Error = ha;
k.dom = {};
k.dom.NodeType = {
    ELEMENT: 1,
    ATTRIBUTE: 2,
    TEXT: 3,
    CDATA_SECTION: 4,
    ENTITY_REFERENCE: 5,
    ENTITY: 6,
    PROCESSING_INSTRUCTION: 7,
    COMMENT: 8,
    DOCUMENT: 9,
    DOCUMENT_TYPE: 10,
    DOCUMENT_FRAGMENT: 11,
    NOTATION: 12
};
k.asserts = {};
k.asserts.ENABLE_ASSERTS = k.DEBUG;
k.asserts.AssertionError = function (a, b) {
    ha.call(this, k.asserts.subs_(a, b))
};
k.inherits(k.asserts.AssertionError, ha);
k.asserts.AssertionError.prototype.name = "AssertionError";
k.asserts.DEFAULT_ERROR_HANDLER = function (a) {
    throw a;
};
k.asserts.errorHandler_ = k.asserts.DEFAULT_ERROR_HANDLER;
k.asserts.subs_ = function (a, b) {
    a = a.split("%s");
    for (var c = "", f = a.length - 1, g = 0; g < f; g++) c += a[g] + (g < b
        .length ? b[g] : "%s");
    return c + a[f]
};
k.asserts.doAssertFailure_ = function (a, b, c, f) {
    var g = "Assertion failed";
    if (c) {
        g += ": " + c;
        var h = f
    } else a && (g += ": " + a, h = b);
    a = new k.asserts.AssertionError("" + g, h || []);
    k.asserts.errorHandler_(a)
};
k.asserts.setErrorHandler = function (a) {
    k.asserts.ENABLE_ASSERTS && (k.asserts.errorHandler_ = a)
};
k.asserts.assert = function (a, b, c) {
    k.asserts.ENABLE_ASSERTS && !a && k.asserts.doAssertFailure_("", null,
        b, Array.prototype.slice.call(arguments, 2));
    return a
};
k.asserts.assertExists = function (a, b, c) {
    k.asserts.ENABLE_ASSERTS && null == a && k.asserts.doAssertFailure_(
        "Expected to exist: %s.", [a], b, Array.prototype.slice.call(
            arguments, 2));
    return a
};
k.asserts.fail = function (a, b) {
    k.asserts.ENABLE_ASSERTS && k.asserts.errorHandler_(new k.asserts
        .AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype
            .slice.call(arguments, 1)))
};
k.asserts.assertNumber = function (a, b, c) {
    k.asserts.ENABLE_ASSERTS && "number" !== typeof a && k.asserts
        .doAssertFailure_("Expected number but got %s: %s.", [k.typeOf(a),
            a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
k.asserts.assertString = function (a, b, c) {
    k.asserts.ENABLE_ASSERTS && "string" !== typeof a && k.asserts
        .doAssertFailure_("Expected string but got %s: %s.", [k.typeOf(a),
            a], b, Array.prototype.slice.call(arguments, 2))
};
k.asserts.assertFunction = function (a, b, c) {
    k.asserts.ENABLE_ASSERTS && "function" !== typeof a && k.asserts
        .doAssertFailure_("Expected function but got %s: %s.", [k.typeOf(a),
            a
        ], b, Array.prototype.slice.call(arguments, 2))
};
k.asserts.assertObject = function (a, b, c) {
    k.asserts.ENABLE_ASSERTS && !k.isObject(a) && k.asserts
        .doAssertFailure_("Expected object but got %s: %s.", [k.typeOf(a),
            a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
k.asserts.assertArray = function (a, b, c) {
    k.asserts.ENABLE_ASSERTS && !Array.isArray(a) && k.asserts
        .doAssertFailure_("Expected array but got %s: %s.", [k.typeOf(a),
            a], b, Array.prototype.slice.call(arguments, 2))
};
k.asserts.assertBoolean = function (a, b, c) {
    k.asserts.ENABLE_ASSERTS && "boolean" !== typeof a && k.asserts
        .doAssertFailure_("Expected boolean but got %s: %s.", [k.typeOf(a),
            a
        ], b, Array.prototype.slice.call(arguments, 2));
    return a
};
k.asserts.assertElement = function (a, b, c) {
    !k.asserts.ENABLE_ASSERTS || k.isObject(a) && a.nodeType == k.dom
        .NodeType.ELEMENT || k.asserts.doAssertFailure_(
            "Expected Element but got %s: %s.", [k.typeOf(a), a], b, Array
            .prototype.slice.call(arguments, 2));
    return a
};
k.asserts.assertInstanceof = function (a, b, c, f) {
    !k.asserts.ENABLE_ASSERTS || a instanceof b || k.asserts
        .doAssertFailure_("Expected instanceof %s but got %s.", [k.asserts
            .getType_(b), k.asserts.getType_(a)
        ], c, Array.prototype.slice.call(arguments, 3));
    return a
};
k.asserts.assertFinite = function (a, b, c) {
    !k.asserts.ENABLE_ASSERTS || "number" == typeof a && isFinite(a) || k
        .asserts.doAssertFailure_(
            "Expected %s to be a finite number but it is not.", [a], b,
            Array.prototype.slice.call(arguments, 2));
    return a
};
k.asserts.assertObjectPrototypeIsIntact = function () {
    for (var a in Object.prototype) k.asserts.fail(a +
        " should not be enumerable in Object.prototype.")
};
k.asserts.getType_ = function (a) {
    return a instanceof Function ? a.displayName || a.name ||
        "unknown type name" : a instanceof Object ? a.constructor
        .displayName || a.constructor.name || Object.prototype.toString
        .call(a) : null === a ? "null" : typeof a
};
k.array = {};
k.NATIVE_ARRAY_PROTOTYPES = k.TRUSTED_SITE;
var m = 2012 < k.FEATURESET_YEAR;
k.array.ASSUME_NATIVE_FUNCTIONS = m;

function ja(a) {
    return a[a.length - 1]
}
k.array.peek = ja;
k.array.last = ja;
var ka = k.NATIVE_ARRAY_PROTOTYPES && (m || Array.prototype.indexOf) ?
    function (a, b, c) {
        k.asserts.assert(null != a.length);
        return Array.prototype.indexOf.call(a, b, c)
    } : function (a, b, c) {
        c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
        if ("string" === typeof a) return "string" !== typeof b || 1 != b
            .length ? -1 : a.indexOf(b, c);
        for (; c < a.length; c++)
            if (c in a && a[c] === b) return c;
        return -1
    };
k.array.indexOf = ka;
var la = k.NATIVE_ARRAY_PROTOTYPES && (m || Array.prototype.lastIndexOf) ?
    function (a, b, c) {
        k.asserts.assert(null != a.length);
        return Array.prototype.lastIndexOf.call(a, b, null == c ? a.length - 1 :
            c)
    } : function (a, b, c) {
        c = null == c ? a.length - 1 : c;
        0 > c && (c = Math.max(0, a.length + c));
        if ("string" === typeof a) return "string" !== typeof b || 1 != b
            .length ? -1 : a.lastIndexOf(b, c);
        for (; 0 <= c; c--)
            if (c in a && a[c] === b) return c;
        return -1
    };
k.array.lastIndexOf = la;
var n = k.NATIVE_ARRAY_PROTOTYPES && (m || Array.prototype.forEach) ? function (
    a, b, c) {
    k.asserts.assert(null != a.length);
    Array.prototype.forEach.call(a, b, c)
} : function (a, b, c) {
    for (var f = a.length, g = "string" === typeof a ? a.split("") : a, h =
            0; h < f; h++) h in g && b.call(c, g[h], h, a)
};
k.array.forEach = n;

function ma(a, b, c) {
    var f = a.length,
        g = "string" === typeof a ? a.split("") : a;
    for (--f; 0 <= f; --f) f in g && b.call(c, g[f], f, a)
}
k.array.forEachRight = ma;
var na = k.NATIVE_ARRAY_PROTOTYPES && (m || Array.prototype.filter) ? function (
    a, b, c) {
    k.asserts.assert(null != a.length);
    return Array.prototype.filter.call(a, b, c)
} : function (a, b, c) {
    for (var f = a.length, g = [], h = 0, l = "string" === typeof a ? a
            .split("") : a, r = 0; r < f; r++)
        if (r in l) {
            var v = l[r];
            b.call(c, v, r, a) && (g[h++] = v)
        } return g
};
k.array.filter = na;
var p = k.NATIVE_ARRAY_PROTOTYPES && (m || Array.prototype.map) ? function (a,
    b, c) {
    k.asserts.assert(null != a.length);
    return Array.prototype.map.call(a, b, c)
} : function (a, b, c) {
    for (var f = a.length, g = Array(f), h = "string" === typeof a ? a
            .split("") : a, l = 0; l < f; l++) l in h && (g[l] = b.call(c,
        h[l], l, a));
    return g
};
k.array.map = p;
var oa = k.NATIVE_ARRAY_PROTOTYPES && (m || Array.prototype.reduce) ? function (
    a, b, c, f) {
    k.asserts.assert(null != a.length);
    f && (b = k.bind(b, f));
    return Array.prototype.reduce.call(a, b, c)
} : function (a, b, c, f) {
    var g = c;
    n(a, function (h, l) {
        g = b.call(f, g, h, l, a)
    });
    return g
};
k.array.reduce = oa;
k.array.reduceRight = k.NATIVE_ARRAY_PROTOTYPES && (m || Array.prototype
    .reduceRight) ? function (a, b, c, f) {
    k.asserts.assert(null != a.length);
    k.asserts.assert(null != b);
    f && (b = k.bind(b, f));
    return Array.prototype.reduceRight.call(a, b, c)
} : function (a, b, c, f) {
    var g = c;
    ma(a, function (h, l) {
        g = b.call(f, g, h, l, a)
    });
    return g
};
var pa = k.NATIVE_ARRAY_PROTOTYPES && (m || Array.prototype.some) ? function (a,
    b, c) {
    k.asserts.assert(null != a.length);
    return Array.prototype.some.call(a, b, c)
} : function (a, b, c) {
    for (var f = a.length, g = "string" === typeof a ? a.split("") : a, h =
            0; h < f; h++)
        if (h in g && b.call(c, g[h], h, a)) return !0;
    return !1
};
k.array.some = pa;
var qa = k.NATIVE_ARRAY_PROTOTYPES && (m || Array.prototype.every) ? function (
    a, b, c) {
    k.asserts.assert(null != a.length);
    return Array.prototype.every.call(a, b, c)
} : function (a, b, c) {
    for (var f = a.length, g = "string" === typeof a ? a.split("") : a, h =
            0; h < f; h++)
        if (h in g && !b.call(c, g[h], h, a)) return !1;
    return !0
};
k.array.every = qa;
k.array.count = function (a, b, c) {
    var f = 0;
    n(a, function (g, h, l) {
        b.call(c, g, h, l) && ++f
    }, c);
    return f
};

function ra(a, b, c) {
    b = sa(a, b, c);
    return 0 > b ? null : "string" === typeof a ? a.charAt(b) : a[b]
}
k.array.find = ra;

function sa(a, b, c) {
    for (var f = a.length, g = "string" === typeof a ? a.split("") : a, h =
        0; h < f; h++)
        if (h in g && b.call(c, g[h], h, a)) return h;
    return -1
}
k.array.findIndex = sa;
k.array.findRight = function (a, b, c) {
    b = ta(a, b, c);
    return 0 > b ? null : "string" === typeof a ? a.charAt(b) : a[b]
};

function ta(a, b, c) {
    var f = a.length,
        g = "string" === typeof a ? a.split("") : a;
    for (--f; 0 <= f; f--)
        if (f in g && b.call(c, g[f], f, a)) return f;
    return -1
}
k.array.findIndexRight = ta;

function ua(a, b) {
    return 0 <= ka(a, b)
}
k.array.contains = ua;

function va(a) {
    return 0 == a.length
}
k.array.isEmpty = va;

function wa(a) {
    if (!Array.isArray(a))
        for (var b = a.length - 1; 0 <= b; b--) delete a[b];
    a.length = 0
}
k.array.clear = wa;
k.array.insert = function (a, b) {
    ua(a, b) || a.push(b)
};

function ya(a, b, c) {
    za(a, c, 0, b)
}
k.array.insertAt = ya;
k.array.insertArrayAt = function (a, b, c) {
    k.partial(za, a, c, 0).apply(null, b)
};
k.array.insertBefore = function (a, b, c) {
    var f;
    2 == arguments.length || 0 > (f = ka(a, c)) ? a.push(b) : ya(a, b, f)
};

function Aa(a, b) {
    b = ka(a, b);
    var c;
    (c = 0 <= b) && Ba(a, b);
    return c
}
k.array.remove = Aa;
k.array.removeLast = function (a, b) {
    b = la(a, b);
    return 0 <= b ? (Ba(a, b), !0) : !1
};

function Ba(a, b) {
    k.asserts.assert(null != a.length);
    return 1 == Array.prototype.splice.call(a, b, 1).length
}
k.array.removeAt = Ba;
k.array.removeIf = function (a, b, c) {
    b = sa(a, b, c);
    return 0 <= b ? (Ba(a, b), !0) : !1
};
k.array.removeAllIf = function (a, b, c) {
    var f = 0;
    ma(a, function (g, h) {
        b.call(c, g, h, a) && Ba(a, h) && f++
    });
    return f
};

function Ca(a) {
    return Array.prototype.concat.apply([], arguments)
}
k.array.concat = Ca;
k.array.join = function (a) {
    return Array.prototype.concat.apply([], arguments)
};

function Da(a) {
    var b = a.length;
    if (0 < b) {
        for (var c = Array(b), f = 0; f < b; f++) c[f] = a[f];
        return c
    }
    return []
}
k.array.toArray = Da;
k.array.clone = Da;
k.array.extend = function (a, b) {
    for (var c = 1; c < arguments.length; c++) {
        var f = arguments[c];
        if (k.isArrayLike(f)) {
            var g = a.length || 0,
                h = f.length || 0;
            a.length = g + h;
            for (var l = 0; l < h; l++) a[g + l] = f[l]
        } else a.push(f)
    }
};

function za(a, b, c, f) {
    k.asserts.assert(null != a.length);
    return Array.prototype.splice.apply(a, Ea(arguments, 1))
}
k.array.splice = za;

function Ea(a, b, c) {
    k.asserts.assert(null != a.length);
    return 2 >= arguments.length ? Array.prototype.slice.call(a, b) : Array
        .prototype.slice.call(a, b, c)
}
k.array.slice = Ea;

function Fa(a, b, c) {
    b = b || a;
    var f = function (v) {
        return k.isObject(v) ? "o" + k.getUid(v) : (typeof v).charAt(0) + v
    };
    c = c || f;
    f = {};
    for (var g = 0, h = 0; h < a.length;) {
        var l = a[h++],
            r = c(l);
        Object.prototype.hasOwnProperty.call(f, r) || (f[r] = !0, b[g++] = l)
    }
    b.length = g
}
k.array.removeDuplicates = Fa;

function Ga(a, b, c) {
    return Ha(a, c || Ia, !1, b)
}
k.array.binarySearch = Ga;
k.array.binarySelect = function (a, b, c) {
    return Ha(a, b, !0, void 0, c)
};

function Ha(a, b, c, f, g) {
    for (var h = 0, l = a.length, r; h < l;) {
        var v = h + (l - h >>> 1);
        var E = c ? b.call(g, a[v], v, a) : b(f, a[v]);
        0 < E ? h = v + 1 : (l = v, r = !E)
    }
    return r ? h : -h - 1
}

function Ja(a, b) {
    a.sort(b || Ia)
}
k.array.sort = Ja;
k.array.stableSort = function (a, b) {
    for (var c = Array(a.length), f = 0; f < a.length; f++) c[f] = {
        index: f,
        value: a[f]
    };
    var g = b || Ia;
    Ja(c, function (h, l) {
        return g(h.value, l.value) || h.index - l.index
    });
    for (f = 0; f < a.length; f++) a[f] = c[f].value
};

function Ka(a, b, c) {
    var f = c || Ia;
    Ja(a, function (g, h) {
        return f(b(g), b(h))
    })
}
k.array.sortByKey = Ka;
k.array.sortObjectsByKey = function (a, b, c) {
    Ka(a, function (f) {
        return f[b]
    }, c)
};

function La(a, b, c) {
    b = b || Ia;
    for (var f = 1; f < a.length; f++) {
        var g = b(a[f - 1], a[f]);
        if (0 < g || 0 == g && c) return !1
    }
    return !0
}
k.array.isSorted = La;
k.array.equals = function (a, b) {
    if (!k.isArrayLike(a) || !k.isArrayLike(b) || a.length != b.length)
        return !1;
    for (var c = a.length, f = Ma, g = 0; g < c; g++)
        if (!f(a[g], b[g])) return !1;
    return !0
};
k.array.compare3 = function (a, b, c) {
    c = c || Ia;
    for (var f = Math.min(a.length, b.length), g = 0; g < f; g++) {
        var h = c(a[g], b[g]);
        if (0 != h) return h
    }
    return Ia(a.length, b.length)
};

function Ia(a, b) {
    return a > b ? 1 : a < b ? -1 : 0
}
k.array.defaultCompare = Ia;
k.array.inverseDefaultCompare = function (a, b) {
    return -Ia(a, b)
};

function Ma(a, b) {
    return a === b
}
k.array.defaultCompareEquality = Ma;
k.array.binaryInsert = function (a, b, c) {
    c = Ga(a, b, c);
    return 0 > c ? (ya(a, b, -(c + 1)), !0) : !1
};
k.array.binaryRemove = function (a, b, c) {
    b = Ga(a, b, c);
    return 0 <= b ? Ba(a, b) : !1
};
k.array.bucket = function (a, b, c) {
    for (var f = {}, g = 0; g < a.length; g++) {
        var h = a[g],
            l = b.call(c, h, g, a);
        void 0 !== l && (f[l] || (f[l] = [])).push(h)
    }
    return f
};
k.array.toObject = function (a, b, c) {
    var f = {};
    n(a, function (g, h) {
        f[b.call(c, g, h, a)] = g
    });
    return f
};

function Na(a, b, c) {
    var f = [],
        g = 0,
        h = a;
    c = c || 1;
    void 0 !== b && (g = a, h = b);
    if (0 > c * (h - g)) return [];
    if (0 < c)
        for (a = g; a < h; a += c) f.push(a);
    else
        for (a = g; a > h; a += c) f.push(a);
    return f
}
k.array.range = Na;

function Oa(a, b) {
    for (var c = [], f = 0; f < b; f++) c[f] = a;
    return c
}
k.array.repeat = Oa;

function Pa(a) {
    for (var b = [], c = 0; c < arguments.length; c++) {
        var f = arguments[c];
        if (Array.isArray(f))
            for (var g = 0; g < f.length; g += 8192) {
                var h = Ea(f, g, g + 8192);
                h = Pa.apply(null, h);
                for (var l = 0; l < h.length; l++) b.push(h[l])
            } else b.push(f)
    }
    return b
}
k.array.flatten = Pa;
k.array.rotate = function (a, b) {
    k.asserts.assert(null != a.length);
    a.length && (b %= a.length, 0 < b ? Array.prototype.unshift.apply(a, a
        .splice(-b, b)) : 0 > b && Array.prototype.push.apply(a, a
        .splice(0, -b)));
    return a
};
k.array.moveItem = function (a, b, c) {
    k.asserts.assert(0 <= b && b < a.length);
    k.asserts.assert(0 <= c && c < a.length);
    b = Array.prototype.splice.call(a, b, 1);
    Array.prototype.splice.call(a, c, 0, b[0])
};
k.array.zip = function (a) {
    if (!arguments.length) return [];
    for (var b = [], c = arguments[0].length, f = 1; f < arguments
        .length; f++) arguments[f].length < c && (c = arguments[f].length);
    for (f = 0; f < c; f++) {
        for (var g = [], h = 0; h < arguments.length; h++) g.push(arguments[
            h][f]);
        b.push(g)
    }
    return b
};
k.array.shuffle = function (a, b) {
    b = b || Math.random;
    for (var c = a.length - 1; 0 < c; c--) {
        var f = Math.floor(b() * (c + 1)),
            g = a[c];
        a[c] = a[f];
        a[f] = g
    }
};
k.array.copyByIndex = function (a, b) {
    var c = [];
    n(b, function (f) {
        c.push(a[f])
    });
    return c
};
k.array.concatMap = function (a, b, c) {
    return Ca.apply([], p(a, b, c))
};
k.debug.errorcontext = {};
k.debug.errorcontext.addErrorContext = function (a, b, c) {
    a[k.debug.errorcontext.CONTEXT_KEY_] || (a[k.debug.errorcontext
        .CONTEXT_KEY_] = {});
    a[k.debug.errorcontext.CONTEXT_KEY_][b] = c
};
k.debug.errorcontext.getErrorContext = function (a) {
    return a[k.debug.errorcontext.CONTEXT_KEY_] || {}
};
k.debug.errorcontext.CONTEXT_KEY_ = "__closure__error__context__984382";
k.string = {};
k.string.internal = {};
k.string.internal.startsWith = function (a, b) {
    return 0 == a.lastIndexOf(b, 0)
};
k.string.internal.endsWith = function (a, b) {
    var c = a.length - b.length;
    return 0 <= c && a.indexOf(b, c) == c
};
k.string.internal.caseInsensitiveStartsWith = function (a, b) {
    return 0 == k.string.internal.caseInsensitiveCompare(b, a.substr(0, b
        .length))
};
k.string.internal.caseInsensitiveEndsWith = function (a, b) {
    return 0 == k.string.internal.caseInsensitiveCompare(b, a.substr(a
        .length - b.length, b.length))
};
k.string.internal.caseInsensitiveEquals = function (a, b) {
    return a.toLowerCase() == b.toLowerCase()
};
k.string.internal.isEmptyOrWhitespace = function (a) {
    return /^[\s\xa0]*$/.test(a)
};
k.string.internal.trim = k.TRUSTED_SITE && String.prototype.trim ? function (
a) {
    return a.trim()
} : function (a) {
    return /^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(a)[1]
};
k.string.internal.caseInsensitiveCompare = function (a, b) {
    a = String(a).toLowerCase();
    b = String(b).toLowerCase();
    return a < b ? -1 : a == b ? 0 : 1
};
k.string.internal.newLineToBr = function (a, b) {
    return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>")
};
k.string.internal.htmlEscape = function (a, b) {
    if (b) a = a.replace(k.string.internal.AMP_RE_, "&amp;").replace(k
            .string.internal.LT_RE_, "&lt;").replace(k.string.internal
            .GT_RE_, "&gt;").replace(k.string.internal.QUOT_RE_, "&quot;")
        .replace(k.string.internal.SINGLE_QUOTE_RE_, "&#39;").replace(k
            .string.internal.NULL_RE_, "&#0;");
    else {
        if (!k.string.internal.ALL_RE_.test(a)) return a; - 1 != a.indexOf(
            "&") && (a = a.replace(k.string.internal.AMP_RE_, "&amp;")); - 1
            != a.indexOf("<") && (a = a.replace(k.string.internal.LT_RE_,
                "&lt;")); -
        1 != a.indexOf(">") && (a = a.replace(k.string.internal.GT_RE_,
            "&gt;")); - 1 != a.indexOf('"') && (a = a.replace(k.string
            .internal.QUOT_RE_, "&quot;")); - 1 != a.indexOf("'") && (a = a
            .replace(k.string.internal.SINGLE_QUOTE_RE_, "&#39;")); - 1 != a
            .indexOf("\x00") && (a = a.replace(k.string.internal.NULL_RE_,
                "&#0;"))
    }
    return a
};
k.string.internal.AMP_RE_ = /&/g;
k.string.internal.LT_RE_ = /</g;
k.string.internal.GT_RE_ = />/g;
k.string.internal.QUOT_RE_ = /"/g;
k.string.internal.SINGLE_QUOTE_RE_ = /'/g;
k.string.internal.NULL_RE_ = /\x00/g;
k.string.internal.ALL_RE_ = /[\x00&<>"']/;
k.string.internal.whitespaceEscape = function (a) {
    return k.string.internal.newLineToBr(a.replace(/  /g, " &#160;"),
        void 0)
};
k.string.internal.contains = function (a, b) {
    return -1 != a.indexOf(b)
};
k.string.internal.caseInsensitiveContains = function (a, b) {
    return k.string.internal.contains(a.toLowerCase(), b.toLowerCase())
};
k.string.internal.compareVersions = function (a, b) {
    var c = 0;
    a = k.string.internal.trim(String(a)).split(".");
    b = k.string.internal.trim(String(b)).split(".");
    for (var f = Math.max(a.length, b.length), g = 0; 0 == c && g <
        f; g++) {
        var h = a[g] || "",
            l = b[g] || "";
        do {
            h = /(\d*)(\D*)(.*)/.exec(h) || ["", "", "", ""];
            l = /(\d*)(\D*)(.*)/.exec(l) || ["", "", "", ""];
            if (0 == h[0].length && 0 == l[0].length) break;
            c = k.string.internal.compareElements_(0 == h[1].length ? 0 :
                    parseInt(h[1], 10), 0 == l[1].length ? 0 : parseInt(l[
                        1], 10)) || k.string.internal.compareElements_(0 ==
                    h[2].length, 0 == l[2].length) || k.string.internal
                .compareElements_(h[2], l[2]);
            h = h[3];
            l = l[3]
        } while (0 == c)
    }
    return c
};
k.string.internal.compareElements_ = function (a, b) {
    return a < b ? -1 : a > b ? 1 : 0
};
k.labs = {};
k.labs.userAgent = {};
k.labs.userAgent.util = {};
k.labs.userAgent.util.getNativeUserAgentString_ = function () {
    var a = k.labs.userAgent.util.getNavigator_();
    return a && (a = a.userAgent) ? a : ""
};
k.labs.userAgent.util.getNavigator_ = function () {
    return k.global.navigator
};
k.labs.userAgent.util.userAgent_ = k.labs.userAgent.util
    .getNativeUserAgentString_();
k.labs.userAgent.util.setUserAgent = function (a) {
    k.labs.userAgent.util.userAgent_ = a || k.labs.userAgent.util
        .getNativeUserAgentString_()
};
k.labs.userAgent.util.getUserAgent = function () {
    return k.labs.userAgent.util.userAgent_
};
k.labs.userAgent.util.matchUserAgent = function (a) {
    return k.string.internal.contains(k.labs.userAgent.util.getUserAgent(),
        a)
};
k.labs.userAgent.util.matchUserAgentIgnoreCase = function (a) {
    return k.string.internal.caseInsensitiveContains(k.labs.userAgent.util
        .getUserAgent(), a)
};
k.labs.userAgent.util.extractVersionTuples = function (a) {
    for (var b = /(\w[\w ]+)\/([^\s]+)\s*(?:\((.*?)\))?/g, c = [], f; f = b
        .exec(a);) c.push([f[1], f[2], f[3] || void 0]);
    return c
};
k.object = {};
k.object.forEach = function (a, b, c) {
    for (var f in a) b.call(c, a[f], f, a)
};
k.object.filter = function (a, b, c) {
    var f = {},
        g;
    for (g in a) b.call(c, a[g], g, a) && (f[g] = a[g]);
    return f
};
k.object.map = function (a, b, c) {
    var f = {},
        g;
    for (g in a) f[g] = b.call(c, a[g], g, a);
    return f
};
k.object.some = function (a, b, c) {
    for (var f in a)
        if (b.call(c, a[f], f, a)) return !0;
    return !1
};
k.object.every = function (a, b, c) {
    for (var f in a)
        if (!b.call(c, a[f], f, a)) return !1;
    return !0
};
k.object.getCount = function (a) {
    var b = 0,
        c;
    for (c in a) b++;
    return b
};
k.object.getAnyKey = function (a) {
    for (var b in a) return b
};
k.object.getAnyValue = function (a) {
    for (var b in a) return a[b]
};
k.object.contains = function (a, b) {
    return k.object.containsValue(a, b)
};
k.object.getValues = function (a) {
    var b = [],
        c = 0,
        f;
    for (f in a) b[c++] = a[f];
    return b
};
k.object.getKeys = function (a) {
    var b = [],
        c = 0,
        f;
    for (f in a) b[c++] = f;
    return b
};
k.object.getValueByKeys = function (a, b) {
    var c = k.isArrayLike(b),
        f = c ? b : arguments;
    for (c = c ? 0 : 1; c < f.length; c++) {
        if (null == a) return;
        a = a[f[c]]
    }
    return a
};
k.object.containsKey = function (a, b) {
    return null !== a && b in a
};
k.object.containsValue = function (a, b) {
    for (var c in a)
        if (a[c] == b) return !0;
    return !1
};
k.object.findKey = function (a, b, c) {
    for (var f in a)
        if (b.call(c, a[f], f, a)) return f
};
k.object.findValue = function (a, b, c) {
    return (b = k.object.findKey(a, b, c)) && a[b]
};
k.object.isEmpty = function (a) {
    for (var b in a) return !1;
    return !0
};
k.object.clear = function (a) {
    for (var b in a) delete a[b]
};
k.object.remove = function (a, b) {
    var c;
    (c = b in a) && delete a[b];
    return c
};
k.object.add = function (a, b, c) {
    if (null !== a && b in a) throw Error(
        'The object already contains the key "' + b + '"');
    k.object.set(a, b, c)
};
k.object.get = function (a, b, c) {
    return null !== a && b in a ? a[b] : c
};
k.object.set = function (a, b, c) {
    a[b] = c
};
k.object.setIfUndefined = function (a, b, c) {
    return b in a ? a[b] : a[b] = c
};
k.object.setWithReturnValueIfNotSet = function (a, b, c) {
    if (b in a) return a[b];
    c = c();
    return a[b] = c
};
k.object.equals = function (a, b) {
    for (var c in a)
        if (!(c in b) || a[c] !== b[c]) return !1;
    for (var f in b)
        if (!(f in a)) return !1;
    return !0
};
k.object.clone = function (a) {
    var b = {},
        c;
    for (c in a) b[c] = a[c];
    return b
};
k.object.unsafeClone = function (a) {
    if (!a || "object" !== typeof a) return a;
    if ("function" === typeof a.clone) return a.clone();
    var b = Array.isArray(a) ? [] : "function" !== typeof ArrayBuffer ||
        "function" !== typeof ArrayBuffer.isView || !ArrayBuffer.isView(
        a) || a instanceof DataView ? {} : new a.constructor(a.length),
        c;
    for (c in a) b[c] = k.object.unsafeClone(a[c]);
    return b
};
k.object.transpose = function (a) {
    var b = {},
        c;
    for (c in a) b[a[c]] = c;
    return b
};
k.object.PROTOTYPE_FIELDS_ =
    "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf"
    .split(" ");
k.object.extend = function (a, b) {
    for (var c, f, g = 1; g < arguments.length; g++) {
        f = arguments[g];
        for (c in f) a[c] = f[c];
        for (var h = 0; h < k.object.PROTOTYPE_FIELDS_.length; h++) c = k
            .object.PROTOTYPE_FIELDS_[h], Object.prototype.hasOwnProperty
            .call(f, c) && (a[c] = f[c])
    }
};
k.object.create = function (a) {
    var b = arguments.length;
    if (1 == b && Array.isArray(arguments[0])) return k.object.create.apply(
        null, arguments[0]);
    if (b % 2) throw Error("Uneven number of arguments");
    for (var c = {}, f = 0; f < b; f += 2) c[arguments[f]] = arguments[f +
        1];
    return c
};
k.object.createSet = function (a) {
    var b = arguments.length;
    if (1 == b && Array.isArray(arguments[0])) return k.object.createSet
        .apply(null, arguments[0]);
    for (var c = {}, f = 0; f < b; f++) c[arguments[f]] = !0;
    return c
};
k.object.createImmutableView = function (a) {
    var b = a;
    Object.isFrozen && !Object.isFrozen(a) && (b = Object.create(a), Object
        .freeze(b));
    return b
};
k.object.isImmutableView = function (a) {
    return !!Object.isFrozen && Object.isFrozen(a)
};
k.object.getAllPropertyNames = function (a, b, c) {
    if (!a) return [];
    if (!Object.getOwnPropertyNames || !Object.getPrototypeOf) return k
        .object.getKeys(a);
    for (var f = {}; a && (a !== Object.prototype || b) && (a !== Function
            .prototype || c);) {
        for (var g = Object.getOwnPropertyNames(a), h = 0; h < g
            .length; h++) f[g[h]] = !0;
        a = Object.getPrototypeOf(a)
    }
    return k.object.getKeys(f)
};
k.object.getSuperClass = function (a) {
    return (a = Object.getPrototypeOf(a.prototype)) && a.constructor
};
k.labs.userAgent.browser = {};
k.labs.userAgent.browser.matchOpera_ = function () {
    return k.labs.userAgent.util.matchUserAgent("Opera")
};
k.labs.userAgent.browser.matchIE_ = function () {
    return k.labs.userAgent.util.matchUserAgent("Trident") || k.labs
        .userAgent.util.matchUserAgent("MSIE")
};
k.labs.userAgent.browser.matchEdgeHtml_ = function () {
    return k.labs.userAgent.util.matchUserAgent("Edge")
};
k.labs.userAgent.browser.matchEdgeChromium_ = function () {
    return k.labs.userAgent.util.matchUserAgent("Edg/")
};
k.labs.userAgent.browser.matchOperaChromium_ = function () {
    return k.labs.userAgent.util.matchUserAgent("OPR")
};
k.labs.userAgent.browser.matchFirefox_ = function () {
    return k.labs.userAgent.util.matchUserAgent("Firefox") || k.labs
        .userAgent.util.matchUserAgent("FxiOS")
};
k.labs.userAgent.browser.matchSafari_ = function () {
    return k.labs.userAgent.util.matchUserAgent("Safari") && !(k.labs
        .userAgent.browser.matchChrome_() || k.labs.userAgent.browser
        .matchCoast_() || k.labs.userAgent.browser.matchOpera_() || k
        .labs.userAgent.browser.matchEdgeHtml_() || k.labs.userAgent
        .browser.matchEdgeChromium_() || k.labs.userAgent.browser
        .matchOperaChromium_() || k.labs.userAgent.browser
        .matchFirefox_() || k.labs.userAgent.browser.isSilk() || k.labs
        .userAgent.util.matchUserAgent("Android"))
};
k.labs.userAgent.browser.matchCoast_ = function () {
    return k.labs.userAgent.util.matchUserAgent("Coast")
};
k.labs.userAgent.browser.matchIosWebview_ = function () {
    return (k.labs.userAgent.util.matchUserAgent("iPad") || k.labs.userAgent
            .util.matchUserAgent("iPhone")) && !k.labs.userAgent.browser
        .matchSafari_() && !k.labs.userAgent.browser.matchChrome_() && !k
        .labs.userAgent.browser.matchCoast_() && !k.labs.userAgent.browser
        .matchFirefox_() && k.labs.userAgent.util.matchUserAgent(
            "AppleWebKit")
};
k.labs.userAgent.browser.matchChrome_ = function () {
    return (k.labs.userAgent.util.matchUserAgent("Chrome") || k.labs
            .userAgent.util.matchUserAgent("CriOS")) && !k.labs.userAgent
        .browser.matchEdgeHtml_()
};
k.labs.userAgent.browser.matchAndroidBrowser_ = function () {
    return k.labs.userAgent.util.matchUserAgent("Android") && !(k.labs
        .userAgent.browser.isChrome() || k.labs.userAgent.browser
        .isFirefox() || k.labs.userAgent.browser.isOpera() || k.labs
        .userAgent.browser.isSilk())
};
k.labs.userAgent.browser.isOpera = k.labs.userAgent.browser.matchOpera_;
k.labs.userAgent.browser.isIE = k.labs.userAgent.browser.matchIE_;
k.labs.userAgent.browser.isEdge = k.labs.userAgent.browser.matchEdgeHtml_;
k.labs.userAgent.browser.isEdgeChromium = k.labs.userAgent.browser
    .matchEdgeChromium_;
k.labs.userAgent.browser.isOperaChromium = k.labs.userAgent.browser
    .matchOperaChromium_;
k.labs.userAgent.browser.isFirefox = k.labs.userAgent.browser.matchFirefox_;
k.labs.userAgent.browser.isSafari = k.labs.userAgent.browser.matchSafari_;
k.labs.userAgent.browser.isCoast = k.labs.userAgent.browser.matchCoast_;
k.labs.userAgent.browser.isIosWebview = k.labs.userAgent.browser
    .matchIosWebview_;
k.labs.userAgent.browser.isChrome = k.labs.userAgent.browser.matchChrome_;
k.labs.userAgent.browser.isAndroidBrowser = k.labs.userAgent.browser
    .matchAndroidBrowser_;
k.labs.userAgent.browser.isSilk = function () {
    return k.labs.userAgent.util.matchUserAgent("Silk")
};
k.labs.userAgent.browser.getVersion = function () {
    function a(g) {
        g = ra(g, f);
        return c[g] || ""
    }
    var b = k.labs.userAgent.util.getUserAgent();
    if (k.labs.userAgent.browser.isIE()) return k.labs.userAgent.browser
        .getIEVersion_(b);
    b = k.labs.userAgent.util.extractVersionTuples(b);
    var c = {};
    n(b, function (g) {
        c[g[0]] = g[1]
    });
    var f = k.partial(k.object.containsKey, c);
    return k.labs.userAgent.browser.isOpera() ? a(["Version", "Opera"]) : k
        .labs.userAgent.browser.isEdge() ? a(["Edge"]) : k.labs.userAgent
        .browser.isEdgeChromium() ? a(["Edg"]) :
        k.labs.userAgent.browser.isChrome() ? a(["Chrome", "CriOS",
            "HeadlessChrome"
        ]) : (b = b[2]) && b[1] || ""
};
k.labs.userAgent.browser.isVersionOrHigher = function (a) {
    return 0 <= k.string.internal.compareVersions(k.labs.userAgent.browser
        .getVersion(), a)
};
k.labs.userAgent.browser.getIEVersion_ = function (a) {
    var b = /rv: *([\d\.]*)/.exec(a);
    if (b && b[1]) return b[1];
    b = "";
    var c = /MSIE +([\d\.]+)/.exec(a);
    if (c && c[1])
        if (a = /Trident\/(\d.\d)/.exec(a), "7.0" == c[1])
            if (a && a[1]) switch (a[1]) {
                case "4.0":
                    b = "8.0";
                    break;
                case "5.0":
                    b = "9.0";
                    break;
                case "6.0":
                    b = "10.0";
                    break;
                case "7.0":
                    b = "11.0"
            } else b = "7.0";
            else b = c[1];
    return b
};
k.dom.asserts = {};
k.dom.asserts.assertIsLocation = function (a) {
    if (k.asserts.ENABLE_ASSERTS) {
        var b = k.dom.asserts.getWindow_(a);
        b && (!a || !(a instanceof b.Location) && a instanceof b.Element) &&
            k.asserts.fail(
                "Argument is not a Location (or a non-Element mock); got: %s",
                k.dom.asserts.debugStringForType_(a))
    }
};
k.dom.asserts.assertIsElementType_ = function (a, b) {
    if (k.asserts.ENABLE_ASSERTS) {
        var c = k.dom.asserts.getWindow_(a);
        c && "undefined" != typeof c[b] && (a && (a instanceof c[b] || !(
                a instanceof c.Location || a instanceof c.Element)) || k
            .asserts.fail(
                "Argument is not a %s (or a non-Element, non-Location mock); got: %s",
                b, k.dom.asserts.debugStringForType_(a)))
    }
    return a
};
k.dom.asserts.assertIsHTMLAnchorElement = function (a) {
    k.dom.asserts.assertIsElementType_(a, "HTMLAnchorElement")
};
k.dom.asserts.assertIsHTMLButtonElement = function (a) {
    return k.dom.asserts.assertIsElementType_(a, "HTMLButtonElement")
};
k.dom.asserts.assertIsHTMLLinkElement = function (a) {
    k.dom.asserts.assertIsElementType_(a, "HTMLLinkElement")
};
k.dom.asserts.assertIsHTMLImageElement = function (a) {
    k.dom.asserts.assertIsElementType_(a, "HTMLImageElement")
};
k.dom.asserts.assertIsHTMLAudioElement = function (a) {
    k.dom.asserts.assertIsElementType_(a, "HTMLAudioElement")
};
k.dom.asserts.assertIsHTMLVideoElement = function (a) {
    k.dom.asserts.assertIsElementType_(a, "HTMLVideoElement")
};
k.dom.asserts.assertIsHTMLInputElement = function (a) {
    return k.dom.asserts.assertIsElementType_(a, "HTMLInputElement")
};
k.dom.asserts.assertIsHTMLTextAreaElement = function (a) {
    return k.dom.asserts.assertIsElementType_(a, "HTMLTextAreaElement")
};
k.dom.asserts.assertIsHTMLCanvasElement = function (a) {
    return k.dom.asserts.assertIsElementType_(a, "HTMLCanvasElement")
};
k.dom.asserts.assertIsHTMLEmbedElement = function (a) {
    k.dom.asserts.assertIsElementType_(a, "HTMLEmbedElement")
};
k.dom.asserts.assertIsHTMLFormElement = function (a) {
    return k.dom.asserts.assertIsElementType_(a, "HTMLFormElement")
};
k.dom.asserts.assertIsHTMLFrameElement = function (a) {
    k.dom.asserts.assertIsElementType_(a, "HTMLFrameElement")
};
k.dom.asserts.assertIsHTMLIFrameElement = function (a) {
    k.dom.asserts.assertIsElementType_(a, "HTMLIFrameElement")
};
k.dom.asserts.assertIsHTMLObjectElement = function (a) {
    k.dom.asserts.assertIsElementType_(a, "HTMLObjectElement")
};
k.dom.asserts.assertIsHTMLScriptElement = function (a) {
    k.dom.asserts.assertIsElementType_(a, "HTMLScriptElement")
};
k.dom.asserts.debugStringForType_ = function (a) {
    if (k.isObject(a)) try {
        return a.constructor.displayName || a.constructor.name || Object
            .prototype.toString.call(a)
    } catch (b) {
        return "<object could not be stringified>"
    } else return void 0 === a ? "undefined" : null === a ? "null" :
        typeof a
};
k.dom.asserts.getWindow_ = function (a) {
    try {
        var b = a && a.ownerDocument,
            c = b && (b.defaultView || b.parentWindow);
        c = c || k.global;
        if (c.Element && c.Location) return c
    } catch (f) {}
    return null
};
k.functions = {};
k.functions.constant = function (a) {
    return function () {
        return a
    }
};
k.functions.FALSE = function () {
    return !1
};
k.functions.TRUE = function () {
    return !0
};
k.functions.NULL = function () {
    return null
};
k.functions.UNDEFINED = function () {};
k.functions.EMPTY = k.functions.UNDEFINED;
k.functions.identity = function (a) {
    return a
};
k.functions.error = function (a) {
    return function () {
        throw Error(a);
    }
};
k.functions.fail = function () {};
k.functions.lock = function (a, b) {
    b = b || 0;
    return function () {
        return a.apply(this, Array.prototype.slice.call(arguments, 0,
            b))
    }
};
k.functions.nth = function (a) {
    return function () {
        return arguments[a]
    }
};
k.functions.partialRight = function (a, b) {
    var c = Array.prototype.slice.call(arguments, 1);
    return function () {
        var f = this;
        f === k.global && (f = void 0);
        var g = Array.prototype.slice.call(arguments);
        g.push.apply(g, c);
        return a.apply(f, g)
    }
};
k.functions.withReturnValue = function (a, b) {
    return k.functions.sequence(a, k.functions.constant(b))
};
k.functions.equalTo = function (a, b) {
    return function (c) {
        return b ? a == c : a === c
    }
};
k.functions.compose = function (a, b) {
    var c = arguments,
        f = c.length;
    return function () {
        var g;
        f && (g = c[f - 1].apply(this, arguments));
        for (var h = f - 2; 0 <= h; h--) g = c[h].call(this, g);
        return g
    }
};
k.functions.sequence = function (a) {
    var b = arguments,
        c = b.length;
    return function () {
        for (var f, g = 0; g < c; g++) f = b[g].apply(this, arguments);
        return f
    }
};
k.functions.and = function (a) {
    var b = arguments,
        c = b.length;
    return function () {
        for (var f = 0; f < c; f++)
            if (!b[f].apply(this, arguments)) return !1;
        return !0
    }
};
k.functions.or = function (a) {
    var b = arguments,
        c = b.length;
    return function () {
        for (var f = 0; f < c; f++)
            if (b[f].apply(this, arguments)) return !0;
        return !1
    }
};
k.functions.not = function (a) {
    return function () {
        return !a.apply(this, arguments)
    }
};
k.functions.create = function (a, b) {
    var c = function () {};
    c.prototype = a.prototype;
    c = new c;
    a.apply(c, Array.prototype.slice.call(arguments, 1));
    return c
};
k.functions.CACHE_RETURN_VALUE = !0;
k.functions.cacheReturnValue = function (a) {
    var b = !1,
        c;
    return function () {
        if (!k.functions.CACHE_RETURN_VALUE) return a();
        b || (c = a(), b = !0);
        return c
    }
};
k.functions.once = function (a) {
    var b = a;
    return function () {
        if (b) {
            var c = b;
            b = null;
            c()
        }
    }
};
k.functions.debounce = function (a, b, c) {
    var f = 0;
    return function (g) {
        k.global.clearTimeout(f);
        var h = arguments;
        f = k.global.setTimeout(function () {
            a.apply(c, h)
        }, b)
    }
};
k.functions.throttle = function (a, b, c) {
    var f = 0,
        g = !1,
        h = [],
        l = function () {
            f = 0;
            g && (g = !1, r())
        },
        r = function () {
            f = k.global.setTimeout(l, b);
            a.apply(c, h)
        };
    return function (v) {
        h = arguments;
        f ? g = !0 : r()
    }
};
k.functions.rateLimit = function (a, b, c) {
    var f = 0,
        g = function () {
            f = 0
        };
    return function (h) {
        f || (f = k.global.setTimeout(g, b), a.apply(c, arguments))
    }
};
k.functions.isFunction = function (a) {
    return "function" === typeof a
};
k.dom.HtmlElement = function () {};
k.dom.TagName = function () {};
k.dom.TagName.cast = function (a) {
    return a
};
k.dom.TagName.prototype.toString = function () {};
k.dom.TagName.A = "A";
k.dom.TagName.ABBR = "ABBR";
k.dom.TagName.ACRONYM = "ACRONYM";
k.dom.TagName.ADDRESS = "ADDRESS";
k.dom.TagName.APPLET = "APPLET";
k.dom.TagName.AREA = "AREA";
k.dom.TagName.ARTICLE = "ARTICLE";
k.dom.TagName.ASIDE = "ASIDE";
k.dom.TagName.AUDIO = "AUDIO";
k.dom.TagName.B = "B";
k.dom.TagName.BASE = "BASE";
k.dom.TagName.BASEFONT = "BASEFONT";
k.dom.TagName.BDI = "BDI";
k.dom.TagName.BDO = "BDO";
k.dom.TagName.BIG = "BIG";
k.dom.TagName.BLOCKQUOTE = "BLOCKQUOTE";
k.dom.TagName.BODY = "BODY";
k.dom.TagName.BR = "BR";
k.dom.TagName.BUTTON = "BUTTON";
k.dom.TagName.CANVAS = "CANVAS";
k.dom.TagName.CAPTION = "CAPTION";
k.dom.TagName.CENTER = "CENTER";
k.dom.TagName.CITE = "CITE";
k.dom.TagName.CODE = "CODE";
k.dom.TagName.COL = "COL";
k.dom.TagName.COLGROUP = "COLGROUP";
k.dom.TagName.COMMAND = "COMMAND";
k.dom.TagName.DATA = "DATA";
k.dom.TagName.DATALIST = "DATALIST";
k.dom.TagName.DD = "DD";
k.dom.TagName.DEL = "DEL";
k.dom.TagName.DETAILS = "DETAILS";
k.dom.TagName.DFN = "DFN";
k.dom.TagName.DIALOG = "DIALOG";
k.dom.TagName.DIR = "DIR";
k.dom.TagName.DIV = "DIV";
k.dom.TagName.DL = "DL";
k.dom.TagName.DT = "DT";
k.dom.TagName.EM = "EM";
k.dom.TagName.EMBED = "EMBED";
k.dom.TagName.FIELDSET = "FIELDSET";
k.dom.TagName.FIGCAPTION = "FIGCAPTION";
k.dom.TagName.FIGURE = "FIGURE";
k.dom.TagName.FONT = "FONT";
k.dom.TagName.FOOTER = "FOOTER";
k.dom.TagName.FORM = "FORM";
k.dom.TagName.FRAME = "FRAME";
k.dom.TagName.FRAMESET = "FRAMESET";
k.dom.TagName.H1 = "H1";
k.dom.TagName.H2 = "H2";
k.dom.TagName.H3 = "H3";
k.dom.TagName.H4 = "H4";
k.dom.TagName.H5 = "H5";
k.dom.TagName.H6 = "H6";
k.dom.TagName.HEAD = "HEAD";
k.dom.TagName.HEADER = "HEADER";
k.dom.TagName.HGROUP = "HGROUP";
k.dom.TagName.HR = "HR";
k.dom.TagName.HTML = "HTML";
k.dom.TagName.I = "I";
k.dom.TagName.IFRAME = "IFRAME";
k.dom.TagName.IMG = "IMG";
k.dom.TagName.INPUT = "INPUT";
k.dom.TagName.INS = "INS";
k.dom.TagName.ISINDEX = "ISINDEX";
k.dom.TagName.KBD = "KBD";
k.dom.TagName.KEYGEN = "KEYGEN";
k.dom.TagName.LABEL = "LABEL";
k.dom.TagName.LEGEND = "LEGEND";
k.dom.TagName.LI = "LI";
k.dom.TagName.LINK = "LINK";
k.dom.TagName.MAIN = "MAIN";
k.dom.TagName.MAP = "MAP";
k.dom.TagName.MARK = "MARK";
k.dom.TagName.MATH = "MATH";
k.dom.TagName.MENU = "MENU";
k.dom.TagName.MENUITEM = "MENUITEM";
k.dom.TagName.META = "META";
k.dom.TagName.METER = "METER";
k.dom.TagName.NAV = "NAV";
k.dom.TagName.NOFRAMES = "NOFRAMES";
k.dom.TagName.NOSCRIPT = "NOSCRIPT";
k.dom.TagName.OBJECT = "OBJECT";
k.dom.TagName.OL = "OL";
k.dom.TagName.OPTGROUP = "OPTGROUP";
k.dom.TagName.OPTION = "OPTION";
k.dom.TagName.OUTPUT = "OUTPUT";
k.dom.TagName.P = "P";
k.dom.TagName.PARAM = "PARAM";
k.dom.TagName.PICTURE = "PICTURE";
k.dom.TagName.PRE = "PRE";
k.dom.TagName.PROGRESS = "PROGRESS";
k.dom.TagName.Q = "Q";
k.dom.TagName.RP = "RP";
k.dom.TagName.RT = "RT";
k.dom.TagName.RTC = "RTC";
k.dom.TagName.RUBY = "RUBY";
k.dom.TagName.S = "S";
k.dom.TagName.SAMP = "SAMP";
k.dom.TagName.SCRIPT = "SCRIPT";
k.dom.TagName.SECTION = "SECTION";
k.dom.TagName.SELECT = "SELECT";
k.dom.TagName.SMALL = "SMALL";
k.dom.TagName.SOURCE = "SOURCE";
k.dom.TagName.SPAN = "SPAN";
k.dom.TagName.STRIKE = "STRIKE";
k.dom.TagName.STRONG = "STRONG";
k.dom.TagName.STYLE = "STYLE";
k.dom.TagName.SUB = "SUB";
k.dom.TagName.SUMMARY = "SUMMARY";
k.dom.TagName.SUP = "SUP";
k.dom.TagName.SVG = "SVG";
k.dom.TagName.TABLE = "TABLE";
k.dom.TagName.TBODY = "TBODY";
k.dom.TagName.TD = "TD";
k.dom.TagName.TEMPLATE = "TEMPLATE";
k.dom.TagName.TEXTAREA = "TEXTAREA";
k.dom.TagName.TFOOT = "TFOOT";
k.dom.TagName.TH = "TH";
k.dom.TagName.THEAD = "THEAD";
k.dom.TagName.TIME = "TIME";
k.dom.TagName.TITLE = "TITLE";
k.dom.TagName.TR = "TR";
k.dom.TagName.TRACK = "TRACK";
k.dom.TagName.TT = "TT";
k.dom.TagName.U = "U";
k.dom.TagName.UL = "UL";
k.dom.TagName.VAR = "VAR";
k.dom.TagName.VIDEO = "VIDEO";
k.dom.TagName.WBR = "WBR";
k.dom.tags = {};
k.dom.tags.VOID_TAGS_ = {
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    command: !0,
    embed: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0
};
k.dom.tags.isVoidTag = function (a) {
    return !0 === k.dom.tags.VOID_TAGS_[a]
};
k.html = {};
k.html.trustedtypes = {};
k.html.trustedtypes.getPolicyPrivateDoNotAccessOrElse = function () {
    if (!k.TRUSTED_TYPES_POLICY_NAME) return null;
    void 0 === k.html.trustedtypes.cachedPolicy_ && (k.html.trustedtypes
        .cachedPolicy_ = k.createTrustedTypesPolicy());
    return k.html.trustedtypes.cachedPolicy_
};
k.string.TypedString = function () {};
k.string.Const = function (a, b) {
    this.stringConstValueWithSecurityContract__googStringSecurityPrivate_ =
        a === k.string.Const.GOOG_STRING_CONSTRUCTOR_TOKEN_PRIVATE_ && b ||
        "";
    this.STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_ = k.string
        .Const.TYPE_MARKER_
};
k.string.Const.prototype.implementsGoogStringTypedString = !0;
k.string.Const.prototype.getTypedStringValue = function () {
    return this
        .stringConstValueWithSecurityContract__googStringSecurityPrivate_
};
k.DEBUG && (k.string.Const.prototype.toString = function () {
    return "Const{" + this
        .stringConstValueWithSecurityContract__googStringSecurityPrivate_ +
        "}"
});
k.string.Const.unwrap = function (a) {
    if (a instanceof k.string.Const && a.constructor === k.string.Const && a
        .STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_ === k
        .string.Const.TYPE_MARKER_) return a
        .stringConstValueWithSecurityContract__googStringSecurityPrivate_;
    k.asserts.fail("expected object of type Const, got '" + a + "'");
    return "type_error:Const"
};
k.string.Const.from = function (a) {
    return new k.string.Const(k.string.Const
        .GOOG_STRING_CONSTRUCTOR_TOKEN_PRIVATE_, a)
};
k.string.Const.TYPE_MARKER_ = {};
k.string.Const.GOOG_STRING_CONSTRUCTOR_TOKEN_PRIVATE_ = {};
k.string.Const.EMPTY = k.string.Const.from("");
var Qa = {},
    q = function (a, b) {
        this.privateDoNotAccessOrElseSafeScriptWrappedValue_ = b === Qa ? a :
        "";
        this.implementsGoogStringTypedString = !0
    };
q.fromConstant = function (a) {
    a = k.string.Const.unwrap(a);
    return 0 === a.length ? q.EMPTY : Ra(a)
};
q.prototype.getTypedStringValue = function () {
    return this.privateDoNotAccessOrElseSafeScriptWrappedValue_.toString()
};
q.unwrap = function (a) {
    return Sa(a).toString()
};
var Sa = function (a) {
        if (a instanceof q && a.constructor === q) return a
            .privateDoNotAccessOrElseSafeScriptWrappedValue_;
        (0, k.asserts.fail)("expected object of type SafeScript, got '" + a +
            "' of type " + k.typeOf(a));
        return "type_error:SafeScript"
    },
    Ra = function (a) {
        var b = k.html.trustedtypes.getPolicyPrivateDoNotAccessOrElse();
        a = b ? b.createScript(a) : a;
        return new q(a, Qa)
    };
q.prototype.toString = function () {
    return this.privateDoNotAccessOrElseSafeScriptWrappedValue_.toString()
};
q.EMPTY = Ra("");
k.html.SafeScript = q;
k.fs = {};
k.fs.url = {};
k.fs.url.createObjectUrl = function (a) {
    return k.fs.url.getUrlObject_().createObjectURL(a)
};
k.fs.url.revokeObjectUrl = function (a) {
    k.fs.url.getUrlObject_().revokeObjectURL(a)
};
k.fs.url.UrlObject_ = function () {};
k.fs.url.UrlObject_.prototype.createObjectURL = function () {};
k.fs.url.UrlObject_.prototype.revokeObjectURL = function () {};
k.fs.url.getUrlObject_ = function () {
    var a = k.fs.url.findUrlObject_();
    if (null != a) return a;
    throw Error("This browser doesn't seem to support blob URLs");
};
k.fs.url.findUrlObject_ = function () {
    return void 0 !== k.global.URL && void 0 !== k.global.URL
        .createObjectURL ? k.global.URL : void 0 !== k.global
        .createObjectURL ? k.global : null
};
k.fs.url.browserSupportsObjectUrls = function () {
    return null != k.fs.url.findUrlObject_()
};
k.fs.blob = {};
k.fs.blob.getBlob = function (a) {
    var b = k.global.BlobBuilder || k.global.WebKitBlobBuilder;
    if (void 0 !== b) {
        b = new b;
        for (var c = 0; c < arguments.length; c++) b.append(arguments[c]);
        return b.getBlob()
    }
    return k.fs.blob.getBlobWithProperties(Da(arguments))
};
k.fs.blob.getBlobWithProperties = function (a, b) {
    var c = k.global.BlobBuilder || k.global.WebKitBlobBuilder;
    if (void 0 !== c) {
        c = new c;
        for (var f = 0; f < a.length; f++) c.append(a[f], void 0);
        return c.getBlob(b)
    }
    if (void 0 !== k.global.Blob) return c = {}, b && (c.type = b),
        new Blob(a, c);
    throw Error("This browser doesn't seem to support creating Blobs");
};
k.i18n = {};
k.i18n.bidi = {};
k.i18n.bidi.FORCE_RTL = !1;
k.i18n.bidi.IS_RTL = k.i18n.bidi.FORCE_RTL || ("ar" == k.LOCALE.substring(0, 2)
        .toLowerCase() || "fa" == k.LOCALE.substring(0, 2).toLowerCase() ||
        "he" == k.LOCALE.substring(0, 2).toLowerCase() || "iw" == k.LOCALE
        .substring(0, 2).toLowerCase() || "ps" == k.LOCALE.substring(0, 2)
        .toLowerCase() || "sd" == k.LOCALE.substring(0, 2).toLowerCase() ||
        "ug" == k.LOCALE.substring(0, 2).toLowerCase() || "ur" == k.LOCALE
        .substring(0, 2).toLowerCase() || "yi" == k.LOCALE.substring(0, 2)
        .toLowerCase()) && (2 == k.LOCALE.length || "-" == k.LOCALE.substring(2,
            3) || "_" ==
        k.LOCALE.substring(2, 3)) || 3 <= k.LOCALE.length && "ckb" == k.LOCALE
    .substring(0, 3).toLowerCase() && (3 == k.LOCALE.length || "-" == k.LOCALE
        .substring(3, 4) || "_" == k.LOCALE.substring(3, 4)) || 7 <= k.LOCALE
    .length && ("-" == k.LOCALE.substring(2, 3) || "_" == k.LOCALE.substring(2,
        3)) && ("adlm" == k.LOCALE.substring(3, 7).toLowerCase() || "arab" == k
        .LOCALE.substring(3, 7).toLowerCase() || "hebr" == k.LOCALE.substring(3,
            7).toLowerCase() || "nkoo" == k.LOCALE.substring(3, 7)
    .toLowerCase() || "rohg" == k.LOCALE.substring(3, 7).toLowerCase() ||
        "thaa" == k.LOCALE.substring(3,
            7).toLowerCase()) || 8 <= k.LOCALE.length && ("-" == k.LOCALE
        .substring(3, 4) || "_" == k.LOCALE.substring(3, 4)) && ("adlm" == k
        .LOCALE.substring(4, 8).toLowerCase() || "arab" == k.LOCALE.substring(4,
            8).toLowerCase() || "hebr" == k.LOCALE.substring(4, 8)
    .toLowerCase() || "nkoo" == k.LOCALE.substring(4, 8).toLowerCase() ||
        "rohg" == k.LOCALE.substring(4, 8).toLowerCase() || "thaa" == k.LOCALE
        .substring(4, 8).toLowerCase());
k.i18n.bidi.Format = {
    LRE: "\u202a",
    RLE: "\u202b",
    PDF: "\u202c",
    LRM: "\u200e",
    RLM: "\u200f"
};
k.i18n.bidi.Dir = {
    LTR: 1,
    RTL: -1,
    NEUTRAL: 0
};
k.i18n.bidi.RIGHT = "right";
k.i18n.bidi.LEFT = "left";
k.i18n.bidi.I18N_RIGHT = k.i18n.bidi.IS_RTL ? k.i18n.bidi.LEFT : k.i18n.bidi
    .RIGHT;
k.i18n.bidi.I18N_LEFT = k.i18n.bidi.IS_RTL ? k.i18n.bidi.RIGHT : k.i18n.bidi
    .LEFT;
k.i18n.bidi.toDir = function (a) {
    return "number" == typeof a ? 0 < a ? k.i18n.bidi.Dir.LTR : 0 > a ? k
        .i18n.bidi.Dir.RTL : k.i18n.bidi.Dir.NEUTRAL : null == a ? null :
        a ? k.i18n.bidi.Dir.RTL : k.i18n.bidi.Dir.LTR
};
k.i18n.bidi.ltrChars_ =
    "A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0900-\u1fff\u200e\u2c00-\ud801\ud804-\ud839\ud83c-\udbff\uf900-\ufb1c\ufe00-\ufe6f\ufefd-\uffff";
k.i18n.bidi.rtlChars_ =
    "\u0591-\u06ef\u06fa-\u08ff\u200f\ud802-\ud803\ud83a-\ud83b\ufb1d-\ufdff\ufe70-\ufefc";
k.i18n.bidi.htmlSkipReg_ = /<[^>]*>|&[^;]+;/g;
k.i18n.bidi.stripHtmlIfNeeded_ = function (a, b) {
    return b ? a.replace(k.i18n.bidi.htmlSkipReg_, "") : a
};
k.i18n.bidi.rtlCharReg_ = new RegExp("[" + k.i18n.bidi.rtlChars_ + "]");
k.i18n.bidi.ltrCharReg_ = new RegExp("[" + k.i18n.bidi.ltrChars_ + "]");
k.i18n.bidi.hasAnyRtl = function (a, b) {
    return k.i18n.bidi.rtlCharReg_.test(k.i18n.bidi.stripHtmlIfNeeded_(a,
        b))
};
k.i18n.bidi.hasRtlChar = k.i18n.bidi.hasAnyRtl;
k.i18n.bidi.hasAnyLtr = function (a) {
    return k.i18n.bidi.ltrCharReg_.test(k.i18n.bidi.stripHtmlIfNeeded_(a,
        void 0))
};
k.i18n.bidi.ltrRe_ = new RegExp("^[" + k.i18n.bidi.ltrChars_ + "]");
k.i18n.bidi.rtlRe_ = new RegExp("^[" + k.i18n.bidi.rtlChars_ + "]");
k.i18n.bidi.isRtlChar = function (a) {
    return k.i18n.bidi.rtlRe_.test(a)
};
k.i18n.bidi.isLtrChar = function (a) {
    return k.i18n.bidi.ltrRe_.test(a)
};
k.i18n.bidi.isNeutralChar = function (a) {
    return !k.i18n.bidi.isLtrChar(a) && !k.i18n.bidi.isRtlChar(a)
};
k.i18n.bidi.ltrDirCheckRe_ = new RegExp("^[^" + k.i18n.bidi.rtlChars_ + "]*[" +
    k.i18n.bidi.ltrChars_ + "]");
k.i18n.bidi.rtlDirCheckRe_ = new RegExp("^[^" + k.i18n.bidi.ltrChars_ + "]*[" +
    k.i18n.bidi.rtlChars_ + "]");
k.i18n.bidi.startsWithRtl = function (a, b) {
    return k.i18n.bidi.rtlDirCheckRe_.test(k.i18n.bidi.stripHtmlIfNeeded_(a,
        b))
};
k.i18n.bidi.isRtlText = k.i18n.bidi.startsWithRtl;
k.i18n.bidi.startsWithLtr = function (a, b) {
    return k.i18n.bidi.ltrDirCheckRe_.test(k.i18n.bidi.stripHtmlIfNeeded_(a,
        b))
};
k.i18n.bidi.isLtrText = k.i18n.bidi.startsWithLtr;
k.i18n.bidi.isRequiredLtrRe_ = /^http:\/\/.*/;
k.i18n.bidi.isNeutralText = function (a, b) {
    a = k.i18n.bidi.stripHtmlIfNeeded_(a, b);
    return k.i18n.bidi.isRequiredLtrRe_.test(a) || !k.i18n.bidi.hasAnyLtr(
        a) && !k.i18n.bidi.hasAnyRtl(a)
};
k.i18n.bidi.ltrExitDirCheckRe_ = new RegExp("[" + k.i18n.bidi.ltrChars_ +
    "][^" + k.i18n.bidi.rtlChars_ + "]*$");
k.i18n.bidi.rtlExitDirCheckRe_ = new RegExp("[" + k.i18n.bidi.rtlChars_ +
    "][^" + k.i18n.bidi.ltrChars_ + "]*$");
k.i18n.bidi.endsWithLtr = function (a, b) {
    return k.i18n.bidi.ltrExitDirCheckRe_.test(k.i18n.bidi
        .stripHtmlIfNeeded_(a, b))
};
k.i18n.bidi.isLtrExitText = k.i18n.bidi.endsWithLtr;
k.i18n.bidi.endsWithRtl = function (a, b) {
    return k.i18n.bidi.rtlExitDirCheckRe_.test(k.i18n.bidi
        .stripHtmlIfNeeded_(a, b))
};
k.i18n.bidi.isRtlExitText = k.i18n.bidi.endsWithRtl;
k.i18n.bidi.rtlLocalesRe_ =
    /^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Adlm|Arab|Hebr|Nkoo|Rohg|Thaa))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;
k.i18n.bidi.isRtlLanguage = function (a) {
    return k.i18n.bidi.rtlLocalesRe_.test(a)
};
k.i18n.bidi.bracketGuardTextRe_ = /(\(.*?\)+)|(\[.*?\]+)|(\{.*?\}+)|(<.*?>+)/g;
k.i18n.bidi.guardBracketInText = function (a, b) {
    b = (void 0 === b ? k.i18n.bidi.hasAnyRtl(a) : b) ? k.i18n.bidi.Format
        .RLM : k.i18n.bidi.Format.LRM;
    return a.replace(k.i18n.bidi.bracketGuardTextRe_, b + "$&" + b)
};
k.i18n.bidi.enforceRtlInHtml = function (a) {
    return "<" == a.charAt(0) ? a.replace(/<\w+/, "$& dir=rtl") :
        "\n<span dir=rtl>" + a + "</span>"
};
k.i18n.bidi.enforceRtlInText = function (a) {
    return k.i18n.bidi.Format.RLE + a + k.i18n.bidi.Format.PDF
};
k.i18n.bidi.enforceLtrInHtml = function (a) {
    return "<" == a.charAt(0) ? a.replace(/<\w+/, "$& dir=ltr") :
        "\n<span dir=ltr>" + a + "</span>"
};
k.i18n.bidi.enforceLtrInText = function (a) {
    return k.i18n.bidi.Format.LRE + a + k.i18n.bidi.Format.PDF
};
k.i18n.bidi.dimensionsRe_ =
    /:\s*([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)/g;
k.i18n.bidi.leftRe_ = /left/gi;
k.i18n.bidi.rightRe_ = /right/gi;
k.i18n.bidi.tempRe_ = /%%%%/g;
k.i18n.bidi.mirrorCSS = function (a) {
    return a.replace(k.i18n.bidi.dimensionsRe_, ":$1 $4 $3 $2").replace(k
        .i18n.bidi.leftRe_, "%%%%").replace(k.i18n.bidi.rightRe_, k.i18n
        .bidi.LEFT).replace(k.i18n.bidi.tempRe_, k.i18n.bidi.RIGHT)
};
k.i18n.bidi.doubleQuoteSubstituteRe_ = /([\u0591-\u05f2])"/g;
k.i18n.bidi.singleQuoteSubstituteRe_ = /([\u0591-\u05f2])'/g;
k.i18n.bidi.normalizeHebrewQuote = function (a) {
    return a.replace(k.i18n.bidi.doubleQuoteSubstituteRe_, "$1\u05f4")
        .replace(k.i18n.bidi.singleQuoteSubstituteRe_, "$1\u05f3")
};
k.i18n.bidi.wordSeparatorRe_ = /\s+/;
k.i18n.bidi.hasNumeralsRe_ = /[\d\u06f0-\u06f9]/;
k.i18n.bidi.rtlDetectionThreshold_ = .4;
k.i18n.bidi.estimateDirection = function (a, b) {
    var c = 0,
        f = 0,
        g = !1;
    a = k.i18n.bidi.stripHtmlIfNeeded_(a, b).split(k.i18n.bidi
        .wordSeparatorRe_);
    for (b = 0; b < a.length; b++) {
        var h = a[b];
        k.i18n.bidi.startsWithRtl(h) ? (c++, f++) : k.i18n.bidi
            .isRequiredLtrRe_.test(h) ? g = !0 : k.i18n.bidi.hasAnyLtr(h) ?
            f++ : k.i18n.bidi.hasNumeralsRe_.test(h) && (g = !0)
    }
    return 0 == f ? g ? k.i18n.bidi.Dir.LTR : k.i18n.bidi.Dir.NEUTRAL : c /
        f > k.i18n.bidi.rtlDetectionThreshold_ ? k.i18n.bidi.Dir.RTL : k
        .i18n.bidi.Dir.LTR
};
k.i18n.bidi.detectRtlDirectionality = function (a, b) {
    return k.i18n.bidi.estimateDirection(a, b) == k.i18n.bidi.Dir.RTL
};
k.i18n.bidi.setElementDirAndAlign = function (a, b) {
    a && (b = k.i18n.bidi.toDir(b)) && (a.style.textAlign = b == k.i18n.bidi
        .Dir.RTL ? k.i18n.bidi.RIGHT : k.i18n.bidi.LEFT, a.dir = b == k
        .i18n.bidi.Dir.RTL ? "rtl" : "ltr")
};
k.i18n.bidi.setElementDirByTextDirectionality = function (a, b) {
    switch (k.i18n.bidi.estimateDirection(b)) {
        case k.i18n.bidi.Dir.LTR:
            "ltr" !== a.dir && (a.dir = "ltr");
            break;
        case k.i18n.bidi.Dir.RTL:
            "rtl" !== a.dir && (a.dir = "rtl");
            break;
        default:
            a.removeAttribute("dir")
    }
};
k.i18n.bidi.DirectionalString = function () {};
k.html.TrustedResourceUrl = function (a, b) {
    this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ = b === k
        .html.TrustedResourceUrl.CONSTRUCTOR_TOKEN_PRIVATE_ ? a : ""
};
d = k.html.TrustedResourceUrl.prototype;
d.implementsGoogStringTypedString = !0;
d.getTypedStringValue = function () {
    return this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_
        .toString()
};
d.implementsGoogI18nBidiDirectionalString = !0;
d.getDirection = function () {
    return k.i18n.bidi.Dir.LTR
};
d.toString = function () {
    return this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ + ""
};
k.html.TrustedResourceUrl.unwrap = function (a) {
    return k.html.TrustedResourceUrl.unwrapTrustedScriptURL(a).toString()
};
k.html.TrustedResourceUrl.unwrapTrustedScriptURL = function (a) {
    if (a instanceof k.html.TrustedResourceUrl && a.constructor === k.html
        .TrustedResourceUrl) return a
        .privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_;
    k.asserts.fail("expected object of type TrustedResourceUrl, got '" + a +
        "' of type " + k.typeOf(a));
    return "type_error:TrustedResourceUrl"
};
k.html.TrustedResourceUrl.format = function (a, b) {
    var c = k.string.Const.unwrap(a);
    if (!k.html.TrustedResourceUrl.BASE_URL_.test(c)) throw Error(
        "Invalid TrustedResourceUrl format: " + c);
    a = c.replace(k.html.TrustedResourceUrl.FORMAT_MARKER_, function (f,
    g) {
        if (!Object.prototype.hasOwnProperty.call(b, g))
        throw Error('Found marker, "' + g +
                '", in format string, "' + c +
                '", but no valid label mapping found in args: ' +
                JSON.stringify(b));
        f = b[g];
        return f instanceof k.string.Const ? k.string.Const.unwrap(
            f) : encodeURIComponent(String(f))
    });
    return k.html.TrustedResourceUrl
        .createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(a)
};
k.html.TrustedResourceUrl.FORMAT_MARKER_ = /%{(\w+)}/g;
k.html.TrustedResourceUrl.BASE_URL_ =
    /^((https:)?\/\/[0-9a-z.:[\]-]+\/|\/[^/\\]|[^:/\\%]+\/|[^:/\\%]*[?#]|about:blank#)/i;
k.html.TrustedResourceUrl.URL_PARAM_PARSER_ = /^([^?#]*)(\?[^#]*)?(#[\s\S]*)?/;
k.html.TrustedResourceUrl.formatWithParams = function (a, b, c, f) {
    a = k.html.TrustedResourceUrl.format(a, b);
    a = k.html.TrustedResourceUrl.unwrap(a);
    a = k.html.TrustedResourceUrl.URL_PARAM_PARSER_.exec(a);
    b = a[3] || "";
    return k.html.TrustedResourceUrl
        .createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(a[1] + k
            .html.TrustedResourceUrl.stringifyParams_("?", a[2] || "", c) +
            k.html.TrustedResourceUrl.stringifyParams_("#", b, f))
};
k.html.TrustedResourceUrl.fromConstant = function (a) {
    return k.html.TrustedResourceUrl
        .createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(k.string
            .Const.unwrap(a))
};
k.html.TrustedResourceUrl.fromConstants = function (a) {
    for (var b = "", c = 0; c < a.length; c++) b += k.string.Const.unwrap(a[
        c]);
    return k.html.TrustedResourceUrl
        .createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(b)
};
k.html.TrustedResourceUrl.fromSafeScript = function (a) {
    a = k.fs.blob.getBlobWithProperties([q.unwrap(a)], "text/javascript");
    a = k.fs.url.createObjectUrl(a);
    return k.html.TrustedResourceUrl
        .createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(a)
};
k.html.TrustedResourceUrl.CONSTRUCTOR_TOKEN_PRIVATE_ = {};
k.html.TrustedResourceUrl
    .createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse = function (a) {
        var b = k.html.trustedtypes.getPolicyPrivateDoNotAccessOrElse();
        a = b ? b.createScriptURL(a) : a;
        return new k.html.TrustedResourceUrl(a, k.html.TrustedResourceUrl
            .CONSTRUCTOR_TOKEN_PRIVATE_)
    };
k.html.TrustedResourceUrl.stringifyParams_ = function (a, b, c) {
    if (null == c) return b;
    if ("string" === typeof c) return c ? a + encodeURIComponent(c) : "";
    for (var f in c)
        if (Object.prototype.hasOwnProperty.call(c, f)) {
            var g = c[f];
            g = Array.isArray(g) ? g : [g];
            for (var h = 0; h < g.length; h++) {
                var l = g[h];
                null != l && (b || (b = a), b += (b.length > a.length ?
                        "&" : "") + encodeURIComponent(f) + "=" +
                    encodeURIComponent(String(l)))
            }
        } return b
};
k.html.SafeUrl = function (a, b) {
    this.privateDoNotAccessOrElseSafeUrlWrappedValue_ = b === k.html.SafeUrl
        .CONSTRUCTOR_TOKEN_PRIVATE_ ? a : ""
};
k.html.SafeUrl.INNOCUOUS_STRING = "about:invalid#zClosurez";
d = k.html.SafeUrl.prototype;
d.implementsGoogStringTypedString = !0;
d.getTypedStringValue = function () {
    return this.privateDoNotAccessOrElseSafeUrlWrappedValue_.toString()
};
d.implementsGoogI18nBidiDirectionalString = !0;
d.getDirection = function () {
    return k.i18n.bidi.Dir.LTR
};
d.toString = function () {
    return this.privateDoNotAccessOrElseSafeUrlWrappedValue_.toString()
};
k.html.SafeUrl.unwrap = function (a) {
    if (a instanceof k.html.SafeUrl && a.constructor === k.html.SafeUrl)
        return a.privateDoNotAccessOrElseSafeUrlWrappedValue_;
    k.asserts.fail("expected object of type SafeUrl, got '" + a +
        "' of type " + k.typeOf(a));
    return "type_error:SafeUrl"
};
k.html.SafeUrl.fromConstant = function (a) {
    return k.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(k
        .string.Const.unwrap(a))
};
k.html.SAFE_MIME_TYPE_PATTERN_ =
    /^(?:audio\/(?:3gpp2|3gpp|aac|L16|midi|mp3|mp4|mpeg|oga|ogg|opus|x-m4a|x-matroska|x-wav|wav|webm)|font\/\w+|image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp|x-icon)|video\/(?:mpeg|mp4|ogg|webm|quicktime|x-matroska))(?:;\w+=(?:\w+|"[\w;,= ]+"))*$/i;
k.html.SafeUrl.isSafeMimeType = function (a) {
    return k.html.SAFE_MIME_TYPE_PATTERN_.test(a)
};
k.html.SafeUrl.fromBlob = function (a) {
    a = k.html.SafeUrl.isSafeMimeType(a.type) ? k.fs.url.createObjectUrl(
        a) : k.html.SafeUrl.INNOCUOUS_STRING;
    return k.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a)
};
k.html.SafeUrl.revokeObjectUrl = function (a) {
    a = a.getTypedStringValue();
    a !== k.html.SafeUrl.INNOCUOUS_STRING && k.fs.url.revokeObjectUrl(a)
};
k.html.SafeUrl.fromMediaSource = function (a) {
    k.asserts.assert("MediaSource" in k.global,
        "No support for MediaSource");
    a = a instanceof MediaSource ? k.fs.url.createObjectUrl(a) : k.html
        .SafeUrl.INNOCUOUS_STRING;
    return k.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a)
};
k.html.DATA_URL_PATTERN_ = /^data:(.*);base64,[a-z0-9+\/]+=*$/i;
k.html.SafeUrl.tryFromDataUrl = function (a) {
    a = String(a);
    a = a.replace(/(%0A|%0D)/g, "");
    var b = a.match(k.html.DATA_URL_PATTERN_);
    return b && k.html.SafeUrl.isSafeMimeType(b[1]) ? k.html.SafeUrl
        .createSafeUrlSecurityPrivateDoNotAccessOrElse(a) : null
};
k.html.SafeUrl.fromDataUrl = function (a) {
    return k.html.SafeUrl.tryFromDataUrl(a) || k.html.SafeUrl.INNOCUOUS_URL
};
k.html.SafeUrl.fromTelUrl = function (a) {
    k.string.internal.caseInsensitiveStartsWith(a, "tel:") || (a = k.html
        .SafeUrl.INNOCUOUS_STRING);
    return k.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a)
};
k.html.SIP_URL_PATTERN_ =
    /^sip[s]?:[+a-z0-9_.!$%&'*\/=^`{|}~-]+@([a-z0-9-]+\.)+[a-z0-9]{2,63}$/i;
k.html.SafeUrl.fromSipUrl = function (a) {
    k.html.SIP_URL_PATTERN_.test(decodeURIComponent(a)) || (a = k.html
        .SafeUrl.INNOCUOUS_STRING);
    return k.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a)
};
k.html.SafeUrl.fromFacebookMessengerUrl = function (a) {
    k.string.internal.caseInsensitiveStartsWith(a,
        "fb-messenger://share") || (a = k.html.SafeUrl.INNOCUOUS_STRING);
    return k.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a)
};
k.html.SafeUrl.fromWhatsAppUrl = function (a) {
    k.string.internal.caseInsensitiveStartsWith(a, "whatsapp://send") || (
        a = k.html.SafeUrl.INNOCUOUS_STRING);
    return k.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a)
};
k.html.SafeUrl.fromSmsUrl = function (a) {
    k.string.internal.caseInsensitiveStartsWith(a, "sms:") && k.html.SafeUrl
        .isSmsUrlBodyValid_(a) || (a = k.html.SafeUrl.INNOCUOUS_STRING);
    return k.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a)
};
k.html.SafeUrl.isSmsUrlBodyValid_ = function (a) {
    var b = a.indexOf("#");
    0 < b && (a = a.substring(0, b));
    b = a.match(/[?&]body=/gi);
    if (!b) return !0;
    if (1 < b.length) return !1;
    a = a.match(/[?&]body=([^&]*)/)[1];
    if (!a) return !0;
    try {
        decodeURIComponent(a)
    } catch (c) {
        return !1
    }
    return /^(?:[a-z0-9\-_.~]|%[0-9a-f]{2})+$/i.test(a)
};
k.html.SafeUrl.fromSshUrl = function (a) {
    k.string.internal.caseInsensitiveStartsWith(a, "ssh://") || (a = k.html
        .SafeUrl.INNOCUOUS_STRING);
    return k.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a)
};
k.html.SafeUrl.sanitizeChromeExtensionUrl = function (a, b) {
    return k.html.SafeUrl.sanitizeExtensionUrl_(
        /^chrome-extension:\/\/([^\/]+)\//, a, b)
};
k.html.SafeUrl.sanitizeFirefoxExtensionUrl = function (a, b) {
    return k.html.SafeUrl.sanitizeExtensionUrl_(
        /^moz-extension:\/\/([^\/]+)\//, a, b)
};
k.html.SafeUrl.sanitizeEdgeExtensionUrl = function (a, b) {
    return k.html.SafeUrl.sanitizeExtensionUrl_(
        /^ms-browser-extension:\/\/([^\/]+)\//, a, b)
};
k.html.SafeUrl.sanitizeExtensionUrl_ = function (a, b, c) {
    (a = a.exec(b)) ? (a = a[1], -1 == (c instanceof k.string.Const ? [k
        .string.Const.unwrap(c)
    ] : c.map(function (f) {
        return k.string.Const.unwrap(f)
    })).indexOf(a) && (b = k.html.SafeUrl.INNOCUOUS_STRING)) : b = k.html
        .SafeUrl.INNOCUOUS_STRING;
    return k.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(b)
};
k.html.SafeUrl.fromTrustedResourceUrl = function (a) {
    return k.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(k
        .html.TrustedResourceUrl.unwrap(a))
};
k.html.SAFE_URL_PATTERN_ = /^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i;
k.html.SafeUrl.SAFE_URL_PATTERN = k.html.SAFE_URL_PATTERN_;
k.html.SafeUrl.trySanitize = function (a) {
    if (a instanceof k.html.SafeUrl) return a;
    a = "object" == typeof a && a.implementsGoogStringTypedString ? a
        .getTypedStringValue() : String(a);
    return k.html.SAFE_URL_PATTERN_.test(a) ? k.html.SafeUrl
        .createSafeUrlSecurityPrivateDoNotAccessOrElse(a) : k.html.SafeUrl
        .tryFromDataUrl(a)
};
k.html.SafeUrl.sanitize = function (a) {
    return k.html.SafeUrl.trySanitize(a) || k.html.SafeUrl.INNOCUOUS_URL
};
k.html.SafeUrl.sanitizeAssertUnchanged = function (a, b) {
    if (a instanceof k.html.SafeUrl) return a;
    a = "object" == typeof a && a.implementsGoogStringTypedString ? a
        .getTypedStringValue() : String(a);
    if (b && /^data:/i.test(a) && (b = k.html.SafeUrl.fromDataUrl(a), b
            .getTypedStringValue() == a)) return b;
    k.asserts.assert(k.html.SAFE_URL_PATTERN_.test(a),
        "%s does not match the safe URL pattern", a) || (a = k.html
        .SafeUrl.INNOCUOUS_STRING);
    return k.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a)
};
k.html.SafeUrl.CONSTRUCTOR_TOKEN_PRIVATE_ = {};
k.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse = function (a) {
    return new k.html.SafeUrl(a, k.html.SafeUrl.CONSTRUCTOR_TOKEN_PRIVATE_)
};
k.html.SafeUrl.INNOCUOUS_URL = k.html.SafeUrl
    .createSafeUrlSecurityPrivateDoNotAccessOrElse(k.html.SafeUrl
        .INNOCUOUS_STRING);
k.html.SafeUrl.ABOUT_BLANK = k.html.SafeUrl
    .createSafeUrlSecurityPrivateDoNotAccessOrElse("about:blank");
k.html.SafeStyle = function (a, b) {
    this.privateDoNotAccessOrElseSafeStyleWrappedValue_ = b === k.html
        .SafeStyle.CONSTRUCTOR_TOKEN_PRIVATE_ ? a : ""
};
k.html.SafeStyle.prototype.implementsGoogStringTypedString = !0;
k.html.SafeStyle.fromConstant = function (a) {
    a = k.string.Const.unwrap(a);
    if (0 === a.length) return k.html.SafeStyle.EMPTY;
    k.asserts.assert(k.string.internal.endsWith(a, ";"),
        "Last character of style string is not ';': " + a);
    k.asserts.assert(k.string.internal.contains(a, ":"),
        "Style string must contain at least one ':', to specify a \"name: value\" pair: " +
        a);
    return k.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(
        a)
};
k.html.SafeStyle.prototype.getTypedStringValue = function () {
    return this.privateDoNotAccessOrElseSafeStyleWrappedValue_
};
k.html.SafeStyle.prototype.toString = function () {
    return this.privateDoNotAccessOrElseSafeStyleWrappedValue_.toString()
};
k.html.SafeStyle.unwrap = function (a) {
    if (a instanceof k.html.SafeStyle && a.constructor === k.html.SafeStyle)
        return a.privateDoNotAccessOrElseSafeStyleWrappedValue_;
    k.asserts.fail("expected object of type SafeStyle, got '" + a +
        "' of type " + k.typeOf(a));
    return "type_error:SafeStyle"
};
k.html.SafeStyle.CONSTRUCTOR_TOKEN_PRIVATE_ = {};
k.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse = function (
a) {
    return new k.html.SafeStyle(a, k.html.SafeStyle
        .CONSTRUCTOR_TOKEN_PRIVATE_)
};
k.html.SafeStyle.EMPTY = k.html.SafeStyle
    .createSafeStyleSecurityPrivateDoNotAccessOrElse("");
k.html.SafeStyle.INNOCUOUS_STRING = "zClosurez";
k.html.SafeStyle.create = function (a) {
    var b = "",
        c;
    for (c in a)
        if (Object.prototype.hasOwnProperty.call(a, c)) {
            if (!/^[-_a-zA-Z0-9]+$/.test(c)) throw Error(
                "Name allows only [-_a-zA-Z0-9], got: " + c);
            var f = a[c];
            null != f && (f = Array.isArray(f) ? p(f, k.html.SafeStyle
                    .sanitizePropertyValue_).join(" ") : k.html
                .SafeStyle.sanitizePropertyValue_(f), b += c + ":" + f +
                ";")
        } return b ? k.html.SafeStyle
        .createSafeStyleSecurityPrivateDoNotAccessOrElse(b) : k.html
        .SafeStyle.EMPTY
};
k.html.SafeStyle.sanitizePropertyValue_ = function (a) {
    if (a instanceof k.html.SafeUrl) return 'url("' + k.html.SafeUrl.unwrap(
        a).replace(/</g, "%3c").replace(/[\\"]/g, "\\$&") + '")';
    a = a instanceof k.string.Const ? k.string.Const.unwrap(a) : k.html
        .SafeStyle.sanitizePropertyValueString_(String(a));
    if (/[{;}]/.test(a)) throw new k.asserts.AssertionError(
        "Value does not allow [{;}], got: %s.", [a]);
    return a
};
k.html.SafeStyle.sanitizePropertyValueString_ = function (a) {
    var b = a.replace(k.html.SafeStyle.FUNCTIONS_RE_, "$1").replace(k.html
        .SafeStyle.FUNCTIONS_RE_, "$1").replace(k.html.SafeStyle
        .URL_RE_, "url");
    if (k.html.SafeStyle.VALUE_RE_.test(b)) {
        if (k.html.SafeStyle.COMMENT_RE_.test(a)) return k.asserts.fail(
                "String value disallows comments, got: " + a), k.html
            .SafeStyle.INNOCUOUS_STRING;
        if (!k.html.SafeStyle.hasBalancedQuotes_(a)) return k.asserts.fail(
                "String value requires balanced quotes, got: " + a), k
            .html.SafeStyle.INNOCUOUS_STRING;
        if (!k.html.SafeStyle.hasBalancedSquareBrackets_(a)) return k
            .asserts.fail(
                "String value requires balanced square brackets and one identifier per pair of brackets, got: " +
                a), k.html.SafeStyle.INNOCUOUS_STRING
    } else return k.asserts.fail("String value allows only " + k.html
            .SafeStyle.VALUE_ALLOWED_CHARS_ +
            " and simple functions, got: " + a), k.html.SafeStyle
        .INNOCUOUS_STRING;
    return k.html.SafeStyle.sanitizeUrl_(a)
};
k.html.SafeStyle.hasBalancedQuotes_ = function (a) {
    for (var b = !0, c = !0, f = 0; f < a.length; f++) {
        var g = a.charAt(f);
        "'" == g && c ? b = !b : '"' == g && b && (c = !c)
    }
    return b && c
};
k.html.SafeStyle.hasBalancedSquareBrackets_ = function (a) {
    for (var b = !0, c = /^[-_a-zA-Z0-9]$/, f = 0; f < a.length; f++) {
        var g = a.charAt(f);
        if ("]" == g) {
            if (b) return !1;
            b = !0
        } else if ("[" == g) {
            if (!b) return !1;
            b = !1
        } else if (!b && !c.test(g)) return !1
    }
    return b
};
k.html.SafeStyle.VALUE_ALLOWED_CHARS_ = "[-,.\"'%_!# a-zA-Z0-9\\[\\]]";
k.html.SafeStyle.VALUE_RE_ = new RegExp("^" + k.html.SafeStyle
    .VALUE_ALLOWED_CHARS_ + "+$");
k.html.SafeStyle.URL_RE_ =
    /\b(url\([ \t\n]*)('[ -&(-\[\]-~]*'|"[ !#-\[\]-~]*"|[!#-&*-\[\]-~]*)([ \t\n]*\))/g;
k.html.SafeStyle.ALLOWED_FUNCTIONS_ =
    "calc cubic-bezier fit-content hsl hsla linear-gradient matrix minmax repeat rgb rgba (rotate|scale|translate)(X|Y|Z|3d)?"
    .split(" ");
k.html.SafeStyle.FUNCTIONS_RE_ = new RegExp("\\b(" + k.html.SafeStyle
    .ALLOWED_FUNCTIONS_.join("|") + ")\\([-+*/0-9a-z.%\\[\\], ]+\\)", "g");
k.html.SafeStyle.COMMENT_RE_ = /\/\*/;
k.html.SafeStyle.sanitizeUrl_ = function (a) {
    return a.replace(k.html.SafeStyle.URL_RE_, function (b, c, f, g) {
        var h = "";
        f = f.replace(/^(['"])(.*)\1$/, function (l, r, v) {
            h = r;
            return v
        });
        b = k.html.SafeUrl.sanitize(f).getTypedStringValue();
        return c + h + b + h + g
    })
};
k.html.SafeStyle.concat = function (a) {
    var b = "",
        c = function (f) {
            Array.isArray(f) ? n(f, c) : b += k.html.SafeStyle.unwrap(f)
        };
    n(arguments, c);
    return b ? k.html.SafeStyle
        .createSafeStyleSecurityPrivateDoNotAccessOrElse(b) : k.html
        .SafeStyle.EMPTY
};
var Ta = {},
    t = function (a, b) {
        this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_ = b === Ta ?
            a : "";
        this.implementsGoogStringTypedString = !0
    };
t.concat = function (a) {
    var b = "",
        c = function (f) {
            Array.isArray(f) ? n(f, c) : b += t.unwrap(f)
        };
    n(arguments, c);
    return new t(b, Ta)
};
t.fromConstant = function (a) {
    a = k.string.Const.unwrap(a);
    if (0 === a.length) return t.EMPTY;
    (0, k.asserts.assert)(!(0, k.string.internal.contains)(a, "<"),
        "Forbidden '<' character in style sheet string: " + a);
    return new t(a, Ta)
};
t.prototype.getTypedStringValue = function () {
    return this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_
};
t.unwrap = function (a) {
    if (a instanceof t && a.constructor === t) return a
        .privateDoNotAccessOrElseSafeStyleSheetWrappedValue_;
    (0, k.asserts.fail)("expected object of type SafeStyleSheet, got '" +
        a + "' of type " + k.typeOf(a));
    return "type_error:SafeStyleSheet"
};
t.prototype.toString = function () {
    return this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_
        .toString()
};
t.EMPTY = new t("", Ta);
k.html.SafeStyleSheet = t;
k.html.SafeHtml = function (a, b, c) {
    this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = c === k.html
        .SafeHtml.CONSTRUCTOR_TOKEN_PRIVATE_ ? a : "";
    this.dir_ = b
};
k.html.SafeHtml.ENABLE_ERROR_MESSAGES = k.DEBUG;
k.html.SafeHtml.SUPPORT_STYLE_ATTRIBUTE = !0;
d = k.html.SafeHtml.prototype;
d.implementsGoogI18nBidiDirectionalString = !0;
d.getDirection = function () {
    return this.dir_
};
d.implementsGoogStringTypedString = !0;
d.getTypedStringValue = function () {
    return this.privateDoNotAccessOrElseSafeHtmlWrappedValue_.toString()
};
d.toString = function () {
    return this.privateDoNotAccessOrElseSafeHtmlWrappedValue_.toString()
};
k.html.SafeHtml.unwrap = function (a) {
    return k.html.SafeHtml.unwrapTrustedHTML(a).toString()
};
k.html.SafeHtml.unwrapTrustedHTML = function (a) {
    if (a instanceof k.html.SafeHtml && a.constructor === k.html.SafeHtml)
        return a.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
    k.asserts.fail("expected object of type SafeHtml, got '" + a +
        "' of type " + k.typeOf(a));
    return "type_error:SafeHtml"
};
k.html.SafeHtml.htmlEscape = function (a) {
    if (a instanceof k.html.SafeHtml) return a;
    var b = "object" == typeof a,
        c = null;
    b && a.implementsGoogI18nBidiDirectionalString && (c = a
.getDirection());
    return k.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(k
        .string.internal.htmlEscape(b && a
            .implementsGoogStringTypedString ? a.getTypedStringValue() :
            String(a)), c)
};
k.html.SafeHtml.htmlEscapePreservingNewlines = function (a) {
    if (a instanceof k.html.SafeHtml) return a;
    a = k.html.SafeHtml.htmlEscape(a);
    return k.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(k
        .string.internal.newLineToBr(k.html.SafeHtml.unwrap(a)), a
        .getDirection())
};
k.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces = function (a) {
    if (a instanceof k.html.SafeHtml) return a;
    a = k.html.SafeHtml.htmlEscape(a);
    return k.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(k
        .string.internal.whitespaceEscape(k.html.SafeHtml.unwrap(a)), a
        .getDirection())
};
k.html.SafeHtml.from = k.html.SafeHtml.htmlEscape;
k.html.SafeHtml.comment = function (a) {
    return k.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(
        "\x3c!--" + k.string.internal.htmlEscape(a) + "--\x3e", null)
};
k.html.SafeHtml.VALID_NAMES_IN_TAG_ = /^[a-zA-Z0-9-]+$/;
k.html.SafeHtml.URL_ATTRIBUTES_ = {
    action: !0,
    cite: !0,
    data: !0,
    formaction: !0,
    href: !0,
    manifest: !0,
    poster: !0,
    src: !0
};
k.html.SafeHtml.NOT_ALLOWED_TAG_NAMES_ = k.object.createSet(k.dom.TagName
    .APPLET, k.dom.TagName.BASE, k.dom.TagName.EMBED, k.dom.TagName.IFRAME,
    k.dom.TagName.LINK, k.dom.TagName.MATH, k.dom.TagName.META, k.dom
    .TagName.OBJECT, k.dom.TagName.SCRIPT, k.dom.TagName.STYLE, k.dom
    .TagName.SVG, k.dom.TagName.TEMPLATE);
k.html.SafeHtml.create = function (a, b, c) {
    k.html.SafeHtml.verifyTagName(String(a));
    return k.html.SafeHtml
        .createSafeHtmlTagSecurityPrivateDoNotAccessOrElse(String(a), b, c)
};
k.html.SafeHtml.verifyTagName = function (a) {
    if (!k.html.SafeHtml.VALID_NAMES_IN_TAG_.test(a)) throw Error(k.html
        .SafeHtml.ENABLE_ERROR_MESSAGES ? "Invalid tag name <" + a +
        ">." : "");
    if (a.toUpperCase() in k.html.SafeHtml.NOT_ALLOWED_TAG_NAMES_)
    throw Error(k.html.SafeHtml.ENABLE_ERROR_MESSAGES ? "Tag name <" +
            a + "> is not allowed for SafeHtml." : "");
};
k.html.SafeHtml.createIframe = function (a, b, c, f) {
    a && k.html.TrustedResourceUrl.unwrap(a);
    var g = {};
    g.src = a || null;
    g.srcdoc = b && k.html.SafeHtml.unwrap(b);
    a = k.html.SafeHtml.combineAttributes(g, {
        sandbox: ""
    }, c);
    return k.html.SafeHtml
        .createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("iframe", a, f)
};
k.html.SafeHtml.createSandboxIframe = function (a, b, c, f) {
    if (!k.html.SafeHtml.canUseSandboxIframe()) throw Error(k.html.SafeHtml
        .ENABLE_ERROR_MESSAGES ?
        "The browser does not support sandboxed iframes." : "");
    var g = {};
    g.src = a ? k.html.SafeUrl.unwrap(k.html.SafeUrl.sanitize(a)) : null;
    g.srcdoc = b || null;
    g.sandbox = "";
    a = k.html.SafeHtml.combineAttributes(g, {}, c);
    return k.html.SafeHtml
        .createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("iframe", a, f)
};
k.html.SafeHtml.canUseSandboxIframe = function () {
    return k.global.HTMLIFrameElement && "sandbox" in k.global
        .HTMLIFrameElement.prototype
};
k.html.SafeHtml.createScriptSrc = function (a, b) {
    k.html.TrustedResourceUrl.unwrap(a);
    a = k.html.SafeHtml.combineAttributes({
        src: a
    }, {}, b);
    return k.html.SafeHtml
        .createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("script", a)
};
k.html.SafeHtml.createScript = function (a, b) {
    for (var c in b)
        if (Object.prototype.hasOwnProperty.call(b, c)) {
            var f = c.toLowerCase();
            if ("language" == f || "src" == f || "text" == f || "type" == f)
                throw Error(k.html.SafeHtml.ENABLE_ERROR_MESSAGES ?
                    'Cannot set "' + f + '" attribute' : "");
        } c = "";
    a = Ca(a);
    for (f = 0; f < a.length; f++) c += q.unwrap(a[f]);
    a = k.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(c, k
        .i18n.bidi.Dir.NEUTRAL);
    return k.html.SafeHtml
        .createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("script", b, a)
};
k.html.SafeHtml.createStyle = function (a, b) {
    b = k.html.SafeHtml.combineAttributes({
        type: "text/css"
    }, {}, b);
    var c = "";
    a = Ca(a);
    for (var f = 0; f < a.length; f++) c += t.unwrap(a[f]);
    a = k.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(c, k
        .i18n.bidi.Dir.NEUTRAL);
    return k.html.SafeHtml
        .createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("style", b, a)
};
k.html.SafeHtml.createMetaRefresh = function (a, b) {
    a = k.html.SafeUrl.unwrap(k.html.SafeUrl.sanitize(a));
    (k.labs.userAgent.browser.isIE() || k.labs.userAgent.browser
.isEdge()) && k.string.internal.contains(a, ";") && (a = "'" + a.replace(
        /'/g, "%27") + "'");
    return k.html.SafeHtml
        .createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("meta", {
            "http-equiv": "refresh",
            content: (b || 0) + "; url=" + a
        })
};
k.html.SafeHtml.getAttrNameAndValue_ = function (a, b, c) {
    if (c instanceof k.string.Const) c = k.string.Const.unwrap(c);
    else if ("style" == b.toLowerCase())
        if (k.html.SafeHtml.SUPPORT_STYLE_ATTRIBUTE) c = k.html.SafeHtml
            .getStyleValue_(c);
        else throw Error(k.html.SafeHtml.ENABLE_ERROR_MESSAGES ?
            'Attribute "style" not supported.' : "");
    else {
        if (/^on/i.test(b)) throw Error(k.html.SafeHtml
            .ENABLE_ERROR_MESSAGES ? 'Attribute "' + b +
            '" requires goog.string.Const value, "' + c +
            '" given.' : "");
        if (b.toLowerCase() in k.html.SafeHtml.URL_ATTRIBUTES_)
            if (c instanceof k.html.TrustedResourceUrl) c = k.html
                .TrustedResourceUrl.unwrap(c);
            else if (c instanceof k.html.SafeUrl) c = k.html.SafeUrl.unwrap(
            c);
        else if ("string" === typeof c) c = k.html.SafeUrl.sanitize(c)
            .getTypedStringValue();
        else throw Error(k.html.SafeHtml.ENABLE_ERROR_MESSAGES ?
            'Attribute "' + b + '" on tag "' + a +
            '" requires goog.html.SafeUrl, goog.string.Const, or string, value "' +
            c + '" given.' : "");
    }
    c.implementsGoogStringTypedString && (c = c.getTypedStringValue());
    k.asserts.assert("string" === typeof c || "number" === typeof c,
        "String or number value expected, got " + typeof c +
        " with value: " + c);
    return b + '="' + k.string.internal.htmlEscape(String(c)) + '"'
};
k.html.SafeHtml.getStyleValue_ = function (a) {
    if (!k.isObject(a)) throw Error(k.html.SafeHtml.ENABLE_ERROR_MESSAGES ?
        'The "style" attribute requires goog.html.SafeStyle or map of style properties, ' +
        typeof a + " given: " + a : "");
    a instanceof k.html.SafeStyle || (a = k.html.SafeStyle.create(a));
    return k.html.SafeStyle.unwrap(a)
};
k.html.SafeHtml.createWithDir = function (a, b, c, f) {
    b = k.html.SafeHtml.create(b, c, f);
    b.dir_ = a;
    return b
};
k.html.SafeHtml.join = function (a, b) {
    a = k.html.SafeHtml.htmlEscape(a);
    var c = a.getDirection(),
        f = [],
        g = function (h) {
            Array.isArray(h) ? n(h, g) : (h = k.html.SafeHtml.htmlEscape(h),
                f.push(k.html.SafeHtml.unwrap(h)), h = h.getDirection(),
                c == k.i18n.bidi.Dir.NEUTRAL ? c = h : h != k.i18n.bidi
                .Dir.NEUTRAL && c != h && (c = null))
        };
    n(b, g);
    return k.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(f
        .join(k.html.SafeHtml.unwrap(a)), c)
};
k.html.SafeHtml.concat = function (a) {
    return k.html.SafeHtml.join(k.html.SafeHtml.EMPTY, Array.prototype.slice
        .call(arguments))
};
k.html.SafeHtml.concatWithDir = function (a, b) {
    var c = k.html.SafeHtml.concat(Ea(arguments, 1));
    c.dir_ = a;
    return c
};
k.html.SafeHtml.CONSTRUCTOR_TOKEN_PRIVATE_ = {};
k.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse = function (a,
b) {
    var c = k.html.trustedtypes.getPolicyPrivateDoNotAccessOrElse();
    a = c ? c.createHTML(a) : a;
    return new k.html.SafeHtml(a, b, k.html.SafeHtml
        .CONSTRUCTOR_TOKEN_PRIVATE_)
};
k.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse = function (a,
    b, c) {
    var f = null;
    var g = "<" + a + k.html.SafeHtml.stringifyAttributes(a, b);
    null == c ? c = [] : Array.isArray(c) || (c = [c]);
    k.dom.tags.isVoidTag(a.toLowerCase()) ? (k.asserts.assert(!c.length,
        "Void tag <" + a + "> does not allow content."), g += ">") : (
        f = k.html.SafeHtml.concat(c), g += ">" + k.html.SafeHtml
        .unwrap(f) + "</" + a + ">", f = f.getDirection());
    (a = b && b.dir) && (f = /^(ltr|rtl|auto)$/i.test(a) ? k.i18n.bidi.Dir
        .NEUTRAL : null);
    return k.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(g,
        f)
};
k.html.SafeHtml.stringifyAttributes = function (a, b) {
    var c = "";
    if (b)
        for (var f in b)
            if (Object.prototype.hasOwnProperty.call(b, f)) {
                if (!k.html.SafeHtml.VALID_NAMES_IN_TAG_.test(f))
                throw Error(k.html.SafeHtml.ENABLE_ERROR_MESSAGES ?
                        'Invalid attribute name "' + f + '".' : "");
                var g = b[f];
                null != g && (c += " " + k.html.SafeHtml
                    .getAttrNameAndValue_(a, f, g))
            } return c
};
k.html.SafeHtml.combineAttributes = function (a, b, c) {
    var f = {},
        g;
    for (g in a) Object.prototype.hasOwnProperty.call(a, g) && (k.asserts
        .assert(g.toLowerCase() == g, "Must be lower case"), f[g] = a[g]
        );
    for (g in b) Object.prototype.hasOwnProperty.call(b, g) && (k.asserts
        .assert(g.toLowerCase() == g, "Must be lower case"), f[g] = b[g]
        );
    if (c)
        for (g in c)
            if (Object.prototype.hasOwnProperty.call(c, g)) {
                var h = g.toLowerCase();
                if (h in a) throw Error(k.html.SafeHtml
                    .ENABLE_ERROR_MESSAGES ? 'Cannot override "' +
                    h + '" attribute, got "' + g +
                    '" with value "' +
                    c[g] + '"' : "");
                h in b && delete f[h];
                f[g] = c[g]
            } return f
};
k.html.SafeHtml.DOCTYPE_HTML = k.html.SafeHtml
    .createSafeHtmlSecurityPrivateDoNotAccessOrElse("<!DOCTYPE html>", k.i18n
        .bidi.Dir.NEUTRAL);
k.html.SafeHtml.EMPTY = new k.html.SafeHtml(k.global.trustedTypes && k.global
    .trustedTypes.emptyHTML || "", k.i18n.bidi.Dir.NEUTRAL, k.html.SafeHtml
    .CONSTRUCTOR_TOKEN_PRIVATE_);
k.html.SafeHtml.BR = k.html.SafeHtml
    .createSafeHtmlSecurityPrivateDoNotAccessOrElse("<br>", k.i18n.bidi.Dir
        .NEUTRAL);
k.html.uncheckedconversions = {};
k.html.uncheckedconversions.safeHtmlFromStringKnownToSatisfyTypeContract =
    function (a, b) {
        k.asserts.assertString(k.string.Const.unwrap(a),
            "must provide justification");
        k.asserts.assert(!k.string.internal.isEmptyOrWhitespace(k.string.Const
            .unwrap(a)), "must provide non-empty justification");
        return k.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(b,
            null)
    };
k.html.uncheckedconversions.safeScriptFromStringKnownToSatisfyTypeContract =
    function (a, b) {
        k.asserts.assertString(k.string.Const.unwrap(a),
            "must provide justification");
        k.asserts.assert(!k.string.internal.isEmptyOrWhitespace(k.string.Const
            .unwrap(a)), "must provide non-empty justification");
        return Ra(b)
    };
k.html.uncheckedconversions.safeStyleFromStringKnownToSatisfyTypeContract =
    function (a, b) {
        k.asserts.assertString(k.string.Const.unwrap(a),
            "must provide justification");
        k.asserts.assert(!k.string.internal.isEmptyOrWhitespace(k.string.Const
            .unwrap(a)), "must provide non-empty justification");
        return k.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(
            b)
    };
k.html.uncheckedconversions.safeStyleSheetFromStringKnownToSatisfyTypeContract =
    function (a, b) {
        k.asserts.assertString(k.string.Const.unwrap(a),
            "must provide justification");
        k.asserts.assert(!k.string.internal.isEmptyOrWhitespace(k.string.Const
            .unwrap(a)), "must provide non-empty justification");
        return new t(b, Ta)
    };
k.html.uncheckedconversions.safeUrlFromStringKnownToSatisfyTypeContract =
    function (a, b) {
        k.asserts.assertString(k.string.Const.unwrap(a),
            "must provide justification");
        k.asserts.assert(!k.string.internal.isEmptyOrWhitespace(k.string.Const
            .unwrap(a)), "must provide non-empty justification");
        return k.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(b)
    };
k.html.uncheckedconversions
    .trustedResourceUrlFromStringKnownToSatisfyTypeContract = function (a, b) {
        k.asserts.assertString(k.string.Const.unwrap(a),
            "must provide justification");
        k.asserts.assert(!k.string.internal.isEmptyOrWhitespace(k.string.Const
            .unwrap(a)), "must provide non-empty justification");
        return k.html.TrustedResourceUrl
            .createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(b)
    };
k.dom.safe = {};
k.dom.safe.InsertAdjacentHtmlPosition = {
    AFTERBEGIN: "afterbegin",
    AFTEREND: "afterend",
    BEFOREBEGIN: "beforebegin",
    BEFOREEND: "beforeend"
};
k.dom.safe.insertAdjacentHtml = function (a, b, c) {
    a.insertAdjacentHTML(b, k.html.SafeHtml.unwrapTrustedHTML(c))
};
k.dom.safe.SET_INNER_HTML_DISALLOWED_TAGS_ = {
    MATH: !0,
    SCRIPT: !0,
    STYLE: !0,
    SVG: !0,
    TEMPLATE: !0
};
k.dom.safe.isInnerHtmlCleanupRecursive_ = k.functions.cacheReturnValue(
    function () {
        if (k.DEBUG && "undefined" === typeof document) return !1;
        var a = document.createElement("div"),
            b = document.createElement("div");
        b.appendChild(document.createElement("div"));
        a.appendChild(b);
        if (k.DEBUG && !a.firstChild) return !1;
        b = a.firstChild.firstChild;
        a.innerHTML = k.html.SafeHtml.unwrapTrustedHTML(k.html.SafeHtml
            .EMPTY);
        return !b.parentElement
    });
k.dom.safe.unsafeSetInnerHtmlDoNotUseOrElse = function (a, b) {
    if (k.dom.safe.isInnerHtmlCleanupRecursive_())
        for (; a.lastChild;) a.removeChild(a.lastChild);
    a.innerHTML = k.html.SafeHtml.unwrapTrustedHTML(b)
};
k.dom.safe.setInnerHtml = function (a, b) {
    if (k.asserts.ENABLE_ASSERTS && a.tagName && k.dom.safe
        .SET_INNER_HTML_DISALLOWED_TAGS_[a.tagName.toUpperCase()])
    throw Error(
            "goog.dom.safe.setInnerHtml cannot be used to set content of " +
            a.tagName + ".");
    k.dom.safe.unsafeSetInnerHtmlDoNotUseOrElse(a, b)
};
k.dom.safe.setInnerHtmlFromConstant = function (a, b) {
    k.dom.safe.setInnerHtml(a, k.html.uncheckedconversions
        .safeHtmlFromStringKnownToSatisfyTypeContract(k.string.Const
            .from("Constant HTML to be immediatelly used."), k.string
            .Const.unwrap(b)))
};
k.dom.safe.setOuterHtml = function (a, b) {
    a.outerHTML = k.html.SafeHtml.unwrapTrustedHTML(b)
};
k.dom.safe.setFormElementAction = function (a, b) {
    b = b instanceof k.html.SafeUrl ? b : k.html.SafeUrl
        .sanitizeAssertUnchanged(b);
    k.dom.asserts.assertIsHTMLFormElement(a).action = k.html.SafeUrl.unwrap(
        b)
};
k.dom.safe.setButtonFormAction = function (a, b) {
    b = b instanceof k.html.SafeUrl ? b : k.html.SafeUrl
        .sanitizeAssertUnchanged(b);
    k.dom.asserts.assertIsHTMLButtonElement(a).formAction = k.html.SafeUrl
        .unwrap(b)
};
k.dom.safe.setInputFormAction = function (a, b) {
    b = b instanceof k.html.SafeUrl ? b : k.html.SafeUrl
        .sanitizeAssertUnchanged(b);
    k.dom.asserts.assertIsHTMLInputElement(a).formAction = k.html.SafeUrl
        .unwrap(b)
};
k.dom.safe.setStyle = function (a, b) {
    a.style.cssText = k.html.SafeStyle.unwrap(b)
};
k.dom.safe.documentWrite = function (a, b) {
    a.write(k.html.SafeHtml.unwrapTrustedHTML(b))
};
k.dom.safe.setAnchorHref = function (a, b) {
    k.dom.asserts.assertIsHTMLAnchorElement(a);
    b = b instanceof k.html.SafeUrl ? b : k.html.SafeUrl
        .sanitizeAssertUnchanged(b);
    a.href = k.html.SafeUrl.unwrap(b)
};
k.dom.safe.setImageSrc = function (a, b) {
    k.dom.asserts.assertIsHTMLImageElement(a);
    b = b instanceof k.html.SafeUrl ? b : k.html.SafeUrl
        .sanitizeAssertUnchanged(b, /^data:image\//i.test(b));
    a.src = k.html.SafeUrl.unwrap(b)
};
k.dom.safe.setAudioSrc = function (a, b) {
    k.dom.asserts.assertIsHTMLAudioElement(a);
    b = b instanceof k.html.SafeUrl ? b : k.html.SafeUrl
        .sanitizeAssertUnchanged(b, /^data:audio\//i.test(b));
    a.src = k.html.SafeUrl.unwrap(b)
};
k.dom.safe.setVideoSrc = function (a, b) {
    k.dom.asserts.assertIsHTMLVideoElement(a);
    b = b instanceof k.html.SafeUrl ? b : k.html.SafeUrl
        .sanitizeAssertUnchanged(b, /^data:video\//i.test(b));
    a.src = k.html.SafeUrl.unwrap(b)
};
k.dom.safe.setEmbedSrc = function (a, b) {
    k.dom.asserts.assertIsHTMLEmbedElement(a);
    a.src = k.html.TrustedResourceUrl.unwrapTrustedScriptURL(b)
};
k.dom.safe.setFrameSrc = function (a, b) {
    k.dom.asserts.assertIsHTMLFrameElement(a);
    a.src = k.html.TrustedResourceUrl.unwrap(b)
};
k.dom.safe.setIframeSrc = function (a, b) {
    k.dom.asserts.assertIsHTMLIFrameElement(a);
    a.src = k.html.TrustedResourceUrl.unwrap(b)
};
k.dom.safe.setIframeSrcdoc = function (a, b) {
    k.dom.asserts.assertIsHTMLIFrameElement(a);
    a.srcdoc = k.html.SafeHtml.unwrapTrustedHTML(b)
};
k.dom.safe.setLinkHrefAndRel = function (a, b, c) {
    k.dom.asserts.assertIsHTMLLinkElement(a);
    a.rel = c;
    k.string.internal.caseInsensitiveContains(c, "stylesheet") ? (k.asserts
            .assert(b instanceof k.html.TrustedResourceUrl,
                'URL must be TrustedResourceUrl because "rel" contains "stylesheet"'
                ), a.href = k.html.TrustedResourceUrl.unwrap(b)) : a.href =
        b instanceof k.html.TrustedResourceUrl ? k.html.TrustedResourceUrl
        .unwrap(b) : b instanceof k.html.SafeUrl ? k.html.SafeUrl.unwrap(
        b) : k.html.SafeUrl.unwrap(k.html.SafeUrl.sanitizeAssertUnchanged(
            b))
};
k.dom.safe.setObjectData = function (a, b) {
    k.dom.asserts.assertIsHTMLObjectElement(a);
    a.data = k.html.TrustedResourceUrl.unwrapTrustedScriptURL(b)
};
k.dom.safe.setScriptSrc = function (a, b) {
    k.dom.asserts.assertIsHTMLScriptElement(a);
    a.src = k.html.TrustedResourceUrl.unwrapTrustedScriptURL(b);
    k.dom.safe.setNonceForScriptElement_(a)
};
k.dom.safe.setScriptContent = function (a, b) {
    k.dom.asserts.assertIsHTMLScriptElement(a);
    a.textContent = Sa(b);
    k.dom.safe.setNonceForScriptElement_(a)
};
k.dom.safe.setNonceForScriptElement_ = function (a) {
    var b = k.getScriptNonce(a.ownerDocument && a.ownerDocument
    .defaultView);
    b && a.setAttribute("nonce", b)
};
k.dom.safe.setLocationHref = function (a, b) {
    k.dom.asserts.assertIsLocation(a);
    b = b instanceof k.html.SafeUrl ? b : k.html.SafeUrl
        .sanitizeAssertUnchanged(b);
    a.href = k.html.SafeUrl.unwrap(b)
};
k.dom.safe.assignLocation = function (a, b) {
    k.dom.asserts.assertIsLocation(a);
    b = b instanceof k.html.SafeUrl ? b : k.html.SafeUrl
        .sanitizeAssertUnchanged(b);
    a.assign(k.html.SafeUrl.unwrap(b))
};
k.dom.safe.replaceLocation = function (a, b) {
    b = b instanceof k.html.SafeUrl ? b : k.html.SafeUrl
        .sanitizeAssertUnchanged(b);
    a.replace(k.html.SafeUrl.unwrap(b))
};
k.dom.safe.openInWindow = function (a, b, c, f, g) {
    a = a instanceof k.html.SafeUrl ? a : k.html.SafeUrl
        .sanitizeAssertUnchanged(a);
    b = b || k.global;
    c = c instanceof k.string.Const ? k.string.Const.unwrap(c) : c || "";
    return void 0 !== f || void 0 !== g ? b.open(k.html.SafeUrl.unwrap(a),
        c, f, g) : b.open(k.html.SafeUrl.unwrap(a), c)
};
k.dom.safe.parseFromStringHtml = function (a, b) {
    return k.dom.safe.parseFromString(a, b, "text/html")
};
k.dom.safe.parseFromString = function (a, b, c) {
    return a.parseFromString(k.html.SafeHtml.unwrapTrustedHTML(b), c)
};
k.dom.safe.createImageFromBlob = function (a) {
    if (!/^image\/.*/g.test(a.type)) throw Error(
        "goog.dom.safe.createImageFromBlob only accepts MIME type image/.*."
        );
    var b = k.global.URL.createObjectURL(a);
    a = new k.global.Image;
    a.onload = function () {
        k.global.URL.revokeObjectURL(b)
    };
    k.dom.safe.setImageSrc(a, k.html.uncheckedconversions
        .safeUrlFromStringKnownToSatisfyTypeContract(k.string.Const
            .from("Image blob URL."), b));
    return a
};
k.dom.safe.createContextualFragment = function (a, b) {
    return a.createContextualFragment(k.html.SafeHtml.unwrapTrustedHTML(b))
};
k.string.DETECT_DOUBLE_ESCAPING = !1;
k.string.FORCE_NON_DOM_HTML_UNESCAPING = !1;
k.string.Unicode = {
    NBSP: "\u00a0"
};
k.string.startsWith = k.string.internal.startsWith;
k.string.endsWith = k.string.internal.endsWith;
k.string.caseInsensitiveStartsWith = k.string.internal
.caseInsensitiveStartsWith;
k.string.caseInsensitiveEndsWith = k.string.internal.caseInsensitiveEndsWith;
k.string.caseInsensitiveEquals = k.string.internal.caseInsensitiveEquals;
k.string.subs = function (a, b) {
    for (var c = a.split("%s"), f = "", g = Array.prototype.slice.call(
            arguments, 1); g.length && 1 < c.length;) f += c.shift() + g
        .shift();
    return f + c.join("%s")
};
k.string.collapseWhitespace = function (a) {
    return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
};
k.string.isEmptyOrWhitespace = k.string.internal.isEmptyOrWhitespace;
k.string.isEmptyString = function (a) {
    return 0 == a.length
};
k.string.isEmpty = k.string.isEmptyOrWhitespace;
k.string.isEmptyOrWhitespaceSafe = function (a) {
    return k.string.isEmptyOrWhitespace(k.string.makeSafe(a))
};
k.string.isEmptySafe = k.string.isEmptyOrWhitespaceSafe;
k.string.isBreakingWhitespace = function (a) {
    return !/[^\t\n\r ]/.test(a)
};
k.string.isAlpha = function (a) {
    return !/[^a-zA-Z]/.test(a)
};
k.string.isNumeric = function (a) {
    return !/[^0-9]/.test(a)
};
k.string.isAlphaNumeric = function (a) {
    return !/[^a-zA-Z0-9]/.test(a)
};
k.string.isSpace = function (a) {
    return " " == a
};
k.string.isUnicodeChar = function (a) {
    return 1 == a.length && " " <= a && "~" >= a || "\u0080" <= a &&
        "\ufffd" >= a
};
k.string.stripNewlines = function (a) {
    return a.replace(/(\r\n|\r|\n)+/g, " ")
};
k.string.canonicalizeNewlines = function (a) {
    return a.replace(/(\r\n|\r|\n)/g, "\n")
};
k.string.normalizeWhitespace = function (a) {
    return a.replace(/\xa0|\s/g, " ")
};
k.string.normalizeSpaces = function (a) {
    return a.replace(/\xa0|[ \t]+/g, " ")
};
k.string.collapseBreakingSpaces = function (a) {
    return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g,
        "")
};
k.string.trim = k.string.internal.trim;
k.string.trimLeft = function (a) {
    return a.replace(/^[\s\xa0]+/, "")
};
k.string.trimRight = function (a) {
    return a.replace(/[\s\xa0]+$/, "")
};
k.string.caseInsensitiveCompare = k.string.internal.caseInsensitiveCompare;
k.string.numberAwareCompare_ = function (a, b, c) {
    if (a == b) return 0;
    if (!a) return -1;
    if (!b) return 1;
    for (var f = a.toLowerCase().match(c), g = b.toLowerCase().match(c), h =
            Math.min(f.length, g.length), l = 0; l < h; l++) {
        c = f[l];
        var r = g[l];
        if (c != r) return a = parseInt(c, 10), !isNaN(a) && (b = parseInt(
            r, 10), !isNaN(b) && a - b) ? a - b : c < r ? -1 : 1
    }
    return f.length != g.length ? f.length - g.length : a < b ? -1 : 1
};
k.string.intAwareCompare = function (a, b) {
    return k.string.numberAwareCompare_(a, b, /\d+|\D+/g)
};
k.string.floatAwareCompare = function (a, b) {
    return k.string.numberAwareCompare_(a, b, /\d+|\.\d+|\D+/g)
};
k.string.numerateCompare = k.string.floatAwareCompare;
k.string.urlEncode = function (a) {
    return encodeURIComponent(String(a))
};
k.string.urlDecode = function (a) {
    return decodeURIComponent(a.replace(/\+/g, " "))
};
k.string.newLineToBr = k.string.internal.newLineToBr;
k.string.htmlEscape = function (a, b) {
    a = k.string.internal.htmlEscape(a, b);
    k.string.DETECT_DOUBLE_ESCAPING && (a = a.replace(k.string.E_RE_,
        "&#101;"));
    return a
};
k.string.E_RE_ = /e/g;
k.string.unescapeEntities = function (a) {
    return k.string.contains(a, "&") ? !k.string
        .FORCE_NON_DOM_HTML_UNESCAPING && "document" in k.global ? k.string
        .unescapeEntitiesUsingDom_(a) : k.string.unescapePureXmlEntities_(
        a) : a
};
k.string.unescapeEntitiesWithDocument = function (a, b) {
    return k.string.contains(a, "&") ? k.string.unescapeEntitiesUsingDom_(a,
        b) : a
};
k.string.unescapeEntitiesUsingDom_ = function (a, b) {
    var c = {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"'
    };
    var f = b ? b.createElement("div") : k.global.document.createElement(
        "div");
    return a.replace(k.string.HTML_ENTITY_PATTERN_, function (g, h) {
        var l = c[g];
        if (l) return l;
        "#" == h.charAt(0) && (h = Number("0" + h.substr(1)), isNaN(
            h) || (l = String.fromCharCode(h)));
        l || (k.dom.safe.setInnerHtml(f, k.html.uncheckedconversions
            .safeHtmlFromStringKnownToSatisfyTypeContract(k
                .string.Const.from("Single HTML entity."),
                g + " ")), l = f.firstChild.nodeValue.slice(
            0,
            -1));
        return c[g] = l
    })
};
k.string.unescapePureXmlEntities_ = function (a) {
    return a.replace(/&([^;]+);/g, function (b, c) {
        switch (c) {
            case "amp":
                return "&";
            case "lt":
                return "<";
            case "gt":
                return ">";
            case "quot":
                return '"';
            default:
                return "#" != c.charAt(0) || (c = Number("0" + c
                        .substr(1)), isNaN(c)) ? b : String
                    .fromCharCode(c)
        }
    })
};
k.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
k.string.whitespaceEscape = function (a) {
    return k.string.newLineToBr(a.replace(/  /g, " &#160;"), void 0)
};
k.string.preserveSpaces = function (a) {
    return a.replace(/(^|[\n ]) /g, "$1" + k.string.Unicode.NBSP)
};
k.string.stripQuotes = function (a, b) {
    for (var c = b.length, f = 0; f < c; f++) {
        var g = 1 == c ? b : b.charAt(f);
        if (a.charAt(0) == g && a.charAt(a.length - 1) == g) return a
            .substring(1, a.length - 1)
    }
    return a
};
k.string.truncate = function (a, b, c) {
    c && (a = k.string.unescapeEntities(a));
    a.length > b && (a = a.substring(0, b - 3) + "...");
    c && (a = k.string.htmlEscape(a));
    return a
};
k.string.truncateMiddle = function (a, b, c, f) {
    c && (a = k.string.unescapeEntities(a));
    f && a.length > b ? (f > b && (f = b), a = a.substring(0, b - f) +
        "..." + a.substring(a.length - f)) : a.length > b && (f = Math
        .floor(b / 2), a = a.substring(0, f + b % 2) + "..." + a
        .substring(a.length - f));
    c && (a = k.string.htmlEscape(a));
    return a
};
k.string.specialEscapeChars_ = {
    "\x00": "\\0",
    "\b": "\\b",
    "\f": "\\f",
    "\n": "\\n",
    "\r": "\\r",
    "\t": "\\t",
    "\x0B": "\\x0B",
    '"': '\\"',
    "\\": "\\\\",
    "<": "\\u003C"
};
k.string.jsEscapeCache_ = {
    "'": "\\'"
};
k.string.quote = function (a) {
    a = String(a);
    for (var b = ['"'], c = 0; c < a.length; c++) {
        var f = a.charAt(c),
            g = f.charCodeAt(0);
        b[c + 1] = k.string.specialEscapeChars_[f] || (31 < g && 127 > g ?
            f : k.string.escapeChar(f))
    }
    b.push('"');
    return b.join("")
};
k.string.escapeString = function (a) {
    for (var b = [], c = 0; c < a.length; c++) b[c] = k.string.escapeChar(a
        .charAt(c));
    return b.join("")
};
k.string.escapeChar = function (a) {
    if (a in k.string.jsEscapeCache_) return k.string.jsEscapeCache_[a];
    if (a in k.string.specialEscapeChars_) return k.string.jsEscapeCache_[
        a] = k.string.specialEscapeChars_[a];
    var b = a.charCodeAt(0);
    if (31 < b && 127 > b) var c = a;
    else {
        if (256 > b) {
            if (c = "\\x", 16 > b || 256 < b) c += "0"
        } else c = "\\u", 4096 > b && (c += "0");
        c += b.toString(16).toUpperCase()
    }
    return k.string.jsEscapeCache_[a] = c
};
k.string.contains = k.string.internal.contains;
k.string.caseInsensitiveContains = k.string.internal.caseInsensitiveContains;
k.string.countOf = function (a, b) {
    return a && b ? a.split(b).length - 1 : 0
};
k.string.removeAt = function (a, b, c) {
    var f = a;
    0 <= b && b < a.length && 0 < c && (f = a.substr(0, b) + a.substr(b + c,
        a.length - b - c));
    return f
};
k.string.remove = function (a, b) {
    return a.replace(b, "")
};
k.string.removeAll = function (a, b) {
    b = new RegExp(k.string.regExpEscape(b), "g");
    return a.replace(b, "")
};
k.string.replaceAll = function (a, b, c) {
    b = new RegExp(k.string.regExpEscape(b), "g");
    return a.replace(b, c.replace(/\$/g, "$$$$"))
};
k.string.regExpEscape = function (a) {
    return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1")
        .replace(/\x08/g, "\\x08")
};
k.string.repeat = String.prototype.repeat ? function (a, b) {
    return a.repeat(b)
} : function (a, b) {
    return Array(b + 1).join(a)
};
k.string.padNumber = function (a, b, c) {
    a = void 0 !== c ? a.toFixed(c) : String(a);
    c = a.indexOf("."); - 1 == c && (c = a.length);
    return k.string.repeat("0", Math.max(0, b - c)) + a
};
k.string.makeSafe = function (a) {
    return null == a ? "" : String(a)
};
k.string.buildString = function (a) {
    return Array.prototype.join.call(arguments, "")
};
k.string.getRandomString = function () {
    return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(
        Math.floor(2147483648 * Math.random()) ^ k.now()).toString(36)
};
k.string.compareVersions = k.string.internal.compareVersions;
k.string.hashCode = function (a) {
    for (var b = 0, c = 0; c < a.length; ++c) b = 31 * b + a.charCodeAt(
        c) >>> 0;
    return b
};
k.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
k.string.createUniqueString = function () {
    return "goog_" + k.string.uniqueStringCounter_++
};
k.string.toNumber = function (a) {
    var b = Number(a);
    return 0 == b && k.string.isEmptyOrWhitespace(a) ? NaN : b
};
k.string.isLowerCamelCase = function (a) {
    return /^[a-z]+([A-Z][a-z]*)*$/.test(a)
};
k.string.isUpperCamelCase = function (a) {
    return /^([A-Z][a-z]*)+$/.test(a)
};
k.string.toCamelCase = function (a) {
    return String(a).replace(/\-([a-z])/g, function (b, c) {
        return c.toUpperCase()
    })
};
k.string.toSelectorCase = function (a) {
    return String(a).replace(/([A-Z])/g, "-$1").toLowerCase()
};
k.string.toTitleCase = function (a, b) {
    b = "string" === typeof b ? k.string.regExpEscape(b) : "\\s";
    return a.replace(new RegExp("(^" + (b ? "|[" + b + "]+" : "") +
        ")([a-z])", "g"), function (c, f, g) {
        return f + g.toUpperCase()
    })
};
k.string.capitalize = function (a) {
    return String(a.charAt(0)).toUpperCase() + String(a.substr(1))
        .toLowerCase()
};
k.string.parseInt = function (a) {
    isFinite(a) && (a = String(a));
    return "string" === typeof a ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) :
        parseInt(a, 10) : NaN
};
k.string.splitLimit = function (a, b, c) {
    a = a.split(b);
    for (var f = []; 0 < c && a.length;) f.push(a.shift()), c--;
    a.length && f.push(a.join(b));
    return f
};
k.string.lastComponent = function (a, b) {
    if (b) "string" == typeof b && (b = [b]);
    else return a;
    for (var c = -1, f = 0; f < b.length; f++)
        if ("" != b[f]) {
            var g = a.lastIndexOf(b[f]);
            g > c && (c = g)
        } return -1 == c ? a : a.slice(c + 1)
};
k.string.editDistance = function (a, b) {
    var c = [],
        f = [];
    if (a == b) return 0;
    if (!a.length || !b.length) return Math.max(a.length, b.length);
    for (var g = 0; g < b.length + 1; g++) c[g] = g;
    for (g = 0; g < a.length; g++) {
        f[0] = g + 1;
        for (var h = 0; h < b.length; h++) f[h + 1] = Math.min(f[h] + 1, c[
            h + 1] + 1, c[h] + Number(a[g] != b[h]));
        for (h = 0; h < c.length; h++) c[h] = f[h]
    }
    return f[b.length]
};
k.labs.userAgent.engine = {};
k.labs.userAgent.engine.isPresto = function () {
    return k.labs.userAgent.util.matchUserAgent("Presto")
};
k.labs.userAgent.engine.isTrident = function () {
    return k.labs.userAgent.util.matchUserAgent("Trident") || k.labs
        .userAgent.util.matchUserAgent("MSIE")
};
k.labs.userAgent.engine.isEdge = function () {
    return k.labs.userAgent.util.matchUserAgent("Edge")
};
k.labs.userAgent.engine.isWebKit = function () {
    return k.labs.userAgent.util.matchUserAgentIgnoreCase("WebKit") && !k
        .labs.userAgent.engine.isEdge()
};
k.labs.userAgent.engine.isGecko = function () {
    return k.labs.userAgent.util.matchUserAgent("Gecko") && !k.labs
        .userAgent.engine.isWebKit() && !k.labs.userAgent.engine
    .isTrident() && !k.labs.userAgent.engine.isEdge()
};
k.labs.userAgent.engine.getVersion = function () {
    var a = k.labs.userAgent.util.getUserAgent();
    if (a) {
        a = k.labs.userAgent.util.extractVersionTuples(a);
        var b = k.labs.userAgent.engine.getEngineTuple_(a);
        if (b) return "Gecko" == b[0] ? k.labs.userAgent.engine
            .getVersionForKey_(a) : b[1];
        a = a[0];
        var c;
        if (a && (c = a[2]) && (c = /Trident\/([^\s;]+)/.exec(c))) return c[
            1]
    }
    return ""
};
k.labs.userAgent.engine.getEngineTuple_ = function (a) {
    if (!k.labs.userAgent.engine.isEdge()) return a[1];
    for (var b = 0; b < a.length; b++) {
        var c = a[b];
        if ("Edge" == c[0]) return c
    }
};
k.labs.userAgent.engine.isVersionOrHigher = function (a) {
    return 0 <= k.string.compareVersions(k.labs.userAgent.engine
    .getVersion(), a)
};
k.labs.userAgent.engine.getVersionForKey_ = function (a) {
    return (a = ra(a, function (b) {
        return "Firefox" == b[0]
    })) && a[1] || ""
};
k.labs.userAgent.platform = {};
k.labs.userAgent.platform.isAndroid = function () {
    return k.labs.userAgent.util.matchUserAgent("Android")
};
k.labs.userAgent.platform.isIpod = function () {
    return k.labs.userAgent.util.matchUserAgent("iPod")
};
k.labs.userAgent.platform.isIphone = function () {
    return k.labs.userAgent.util.matchUserAgent("iPhone") && !k.labs
        .userAgent.util.matchUserAgent("iPod") && !k.labs.userAgent.util
        .matchUserAgent("iPad")
};
k.labs.userAgent.platform.isIpad = function () {
    return k.labs.userAgent.util.matchUserAgent("iPad")
};
k.labs.userAgent.platform.isIos = function () {
    return k.labs.userAgent.platform.isIphone() || k.labs.userAgent.platform
        .isIpad() || k.labs.userAgent.platform.isIpod()
};
k.labs.userAgent.platform.isMacintosh = function () {
    return k.labs.userAgent.util.matchUserAgent("Macintosh")
};
k.labs.userAgent.platform.isLinux = function () {
    return k.labs.userAgent.util.matchUserAgent("Linux")
};
k.labs.userAgent.platform.isWindows = function () {
    return k.labs.userAgent.util.matchUserAgent("Windows")
};
k.labs.userAgent.platform.isChromeOS = function () {
    return k.labs.userAgent.util.matchUserAgent("CrOS")
};
k.labs.userAgent.platform.isChromecast = function () {
    return k.labs.userAgent.util.matchUserAgent("CrKey")
};
k.labs.userAgent.platform.isKaiOS = function () {
    return k.labs.userAgent.util.matchUserAgentIgnoreCase("KaiOS")
};
k.labs.userAgent.platform.getVersion = function () {
    var a = k.labs.userAgent.util.getUserAgent(),
        b = "";
    k.labs.userAgent.platform.isWindows() ? (b =
            /Windows (?:NT|Phone) ([0-9.]+)/, b = (a = b.exec(a)) ? a[1] :
            "0.0") : k.labs.userAgent.platform.isIos() ? (b =
            /(?:iPhone|iPod|iPad|CPU)\s+OS\s+(\S+)/, b = (a = b.exec(a)) &&
            a[1].replace(/_/g, ".")) : k.labs.userAgent.platform
        .isMacintosh() ? (b = /Mac OS X ([0-9_.]+)/, b = (a = b.exec(a)) ?
            a[1].replace(/_/g, ".") : "10") : k.labs.userAgent.platform
        .isKaiOS() ? (b = /(?:KaiOS)\/(\S+)/i, b = (a = b.exec(a)) &&
            a[1]) : k.labs.userAgent.platform.isAndroid() ? (b =
            /Android\s+([^\);]+)(\)|;)/, b = (a = b.exec(a)) && a[1]) : k
        .labs.userAgent.platform.isChromeOS() && (b =
            /(?:CrOS\s+(?:i686|x86_64)\s+([0-9.]+))/, b = (a = b.exec(a)) &&
            a[1]);
    return b || ""
};
k.labs.userAgent.platform.isVersionOrHigher = function (a) {
    return 0 <= k.string.compareVersions(k.labs.userAgent.platform
        .getVersion(), a)
};
k.reflect = {};
k.reflect.object = function (a, b) {
    return b
};
k.reflect.objectProperty = function (a) {
    return a
};
k.reflect.sinkValue = function (a) {
    k.reflect.sinkValue[" "](a);
    return a
};
k.reflect.sinkValue[" "] = k.nullFunction;
k.reflect.canAccessProperty = function (a) {
    try {
        return k.reflect.sinkValue(a.nodeName), !0
    } catch (b) {}
    return !1
};
k.reflect.cache = function (a, b, c, f) {
    f = f ? f(b) : b;
    return Object.prototype.hasOwnProperty.call(a, f) ? a[f] : a[f] = c(b)
};
k.userAgent = {};
k.userAgent.ASSUME_IE = !1;
k.userAgent.ASSUME_EDGE = !1;
k.userAgent.ASSUME_GECKO = !1;
k.userAgent.ASSUME_WEBKIT = !1;
k.userAgent.ASSUME_MOBILE_WEBKIT = !1;
k.userAgent.ASSUME_OPERA = !1;
k.userAgent.ASSUME_ANY_VERSION = !1;
k.userAgent.BROWSER_KNOWN_ = k.userAgent.ASSUME_IE || k.userAgent.ASSUME_EDGE ||
    k.userAgent.ASSUME_GECKO || k.userAgent.ASSUME_MOBILE_WEBKIT || k.userAgent
    .ASSUME_WEBKIT || k.userAgent.ASSUME_OPERA;
k.userAgent.getUserAgentString = function () {
    return k.labs.userAgent.util.getUserAgent()
};
k.userAgent.getNavigatorTyped = function () {
    return k.global.navigator || null
};
k.userAgent.getNavigator = function () {
    return k.userAgent.getNavigatorTyped()
};
k.userAgent.OPERA = k.userAgent.BROWSER_KNOWN_ ? k.userAgent.ASSUME_OPERA : k
    .labs.userAgent.browser.isOpera();
k.userAgent.IE = k.userAgent.BROWSER_KNOWN_ ? k.userAgent.ASSUME_IE : k.labs
    .userAgent.browser.isIE();
k.userAgent.EDGE = k.userAgent.BROWSER_KNOWN_ ? k.userAgent.ASSUME_EDGE : k.labs
    .userAgent.engine.isEdge();
k.userAgent.EDGE_OR_IE = k.userAgent.EDGE || k.userAgent.IE;
k.userAgent.GECKO = k.userAgent.BROWSER_KNOWN_ ? k.userAgent.ASSUME_GECKO : k
    .labs.userAgent.engine.isGecko();
k.userAgent.WEBKIT = k.userAgent.BROWSER_KNOWN_ ? k.userAgent.ASSUME_WEBKIT || k
    .userAgent.ASSUME_MOBILE_WEBKIT : k.labs.userAgent.engine.isWebKit();
k.userAgent.isMobile_ = function () {
    return k.userAgent.WEBKIT && k.labs.userAgent.util.matchUserAgent(
        "Mobile")
};
k.userAgent.MOBILE = k.userAgent.ASSUME_MOBILE_WEBKIT || k.userAgent
.isMobile_();
k.userAgent.SAFARI = k.userAgent.WEBKIT;
k.userAgent.determinePlatform_ = function () {
    var a = k.userAgent.getNavigatorTyped();
    return a && a.platform || ""
};
k.userAgent.PLATFORM = k.userAgent.determinePlatform_();
k.userAgent.ASSUME_MAC = !1;
k.userAgent.ASSUME_WINDOWS = !1;
k.userAgent.ASSUME_LINUX = !1;
k.userAgent.ASSUME_X11 = !1;
k.userAgent.ASSUME_ANDROID = !1;
k.userAgent.ASSUME_IPHONE = !1;
k.userAgent.ASSUME_IPAD = !1;
k.userAgent.ASSUME_IPOD = !1;
k.userAgent.ASSUME_KAIOS = !1;
k.userAgent.PLATFORM_KNOWN_ = k.userAgent.ASSUME_MAC || k.userAgent
    .ASSUME_WINDOWS || k.userAgent.ASSUME_LINUX || k.userAgent.ASSUME_X11 || k
    .userAgent.ASSUME_ANDROID || k.userAgent.ASSUME_IPHONE || k.userAgent
    .ASSUME_IPAD || k.userAgent.ASSUME_IPOD;
k.userAgent.MAC = k.userAgent.PLATFORM_KNOWN_ ? k.userAgent.ASSUME_MAC : k.labs
    .userAgent.platform.isMacintosh();
k.userAgent.WINDOWS = k.userAgent.PLATFORM_KNOWN_ ? k.userAgent.ASSUME_WINDOWS :
    k.labs.userAgent.platform.isWindows();
k.userAgent.isLegacyLinux_ = function () {
    return k.labs.userAgent.platform.isLinux() || k.labs.userAgent.platform
        .isChromeOS()
};
k.userAgent.LINUX = k.userAgent.PLATFORM_KNOWN_ ? k.userAgent.ASSUME_LINUX : k
    .userAgent.isLegacyLinux_();
k.userAgent.isX11_ = function () {
    var a = k.userAgent.getNavigatorTyped();
    return !!a && k.string.contains(a.appVersion || "", "X11")
};
k.userAgent.X11 = k.userAgent.PLATFORM_KNOWN_ ? k.userAgent.ASSUME_X11 : k
    .userAgent.isX11_();
k.userAgent.ANDROID = k.userAgent.PLATFORM_KNOWN_ ? k.userAgent.ASSUME_ANDROID :
    k.labs.userAgent.platform.isAndroid();
k.userAgent.IPHONE = k.userAgent.PLATFORM_KNOWN_ ? k.userAgent.ASSUME_IPHONE : k
    .labs.userAgent.platform.isIphone();
k.userAgent.IPAD = k.userAgent.PLATFORM_KNOWN_ ? k.userAgent.ASSUME_IPAD : k
    .labs.userAgent.platform.isIpad();
k.userAgent.IPOD = k.userAgent.PLATFORM_KNOWN_ ? k.userAgent.ASSUME_IPOD : k
    .labs.userAgent.platform.isIpod();
k.userAgent.IOS = k.userAgent.PLATFORM_KNOWN_ ? k.userAgent.ASSUME_IPHONE || k
    .userAgent.ASSUME_IPAD || k.userAgent.ASSUME_IPOD : k.labs.userAgent
    .platform.isIos();
k.userAgent.KAIOS = k.userAgent.PLATFORM_KNOWN_ ? k.userAgent.ASSUME_KAIOS : k
    .labs.userAgent.platform.isKaiOS();
k.userAgent.determineVersion_ = function () {
    var a = "",
        b = k.userAgent.getVersionRegexResult_();
    b && (a = b ? b[1] : "");
    return k.userAgent.IE && (b = k.userAgent.getDocumentMode_(), null !=
        b && b > parseFloat(a)) ? String(b) : a
};
k.userAgent.getVersionRegexResult_ = function () {
    var a = k.userAgent.getUserAgentString();
    if (k.userAgent.GECKO) return /rv:([^\);]+)(\)|;)/.exec(a);
    if (k.userAgent.EDGE) return /Edge\/([\d\.]+)/.exec(a);
    if (k.userAgent.IE) return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);
    if (k.userAgent.WEBKIT) return /WebKit\/(\S+)/.exec(a);
    if (k.userAgent.OPERA) return /(?:Version)[ \/]?(\S+)/.exec(a)
};
k.userAgent.getDocumentMode_ = function () {
    var a = k.global.document;
    return a ? a.documentMode : void 0
};
k.userAgent.VERSION = k.userAgent.determineVersion_();
k.userAgent.compare = function (a, b) {
    return k.string.compareVersions(a, b)
};
k.userAgent.isVersionOrHigherCache_ = {};
k.userAgent.isVersionOrHigher = function (a) {
    return k.userAgent.ASSUME_ANY_VERSION || k.reflect.cache(k.userAgent
        .isVersionOrHigherCache_, a,
        function () {
            return 0 <= k.string.compareVersions(k.userAgent.VERSION, a)
        })
};
k.userAgent.isVersion = k.userAgent.isVersionOrHigher;
k.userAgent.isDocumentModeOrHigher = function (a) {
    return Number(k.userAgent.DOCUMENT_MODE) >= a
};
k.userAgent.isDocumentMode = k.userAgent.isDocumentModeOrHigher;
var Ua;
if (k.global.document && k.userAgent.IE) {
    var Va = k.userAgent.getDocumentMode_();
    Ua = Va ? Va : parseInt(k.userAgent.VERSION, 10) || void 0
} else Ua = void 0;
k.userAgent.DOCUMENT_MODE = Ua;
k.debug.LOGGING_ENABLED = k.DEBUG;
k.debug.FORCE_SLOPPY_STACKS = !1;
k.debug.CHECK_FOR_THROWN_EVENT = !1;
k.debug.catchErrors = function (a, b, c) {
    c = c || k.global;
    var f = c.onerror,
        g = !!b;
    k.userAgent.WEBKIT && !k.userAgent.isVersionOrHigher("535.3") && (g = !
        g);
    c.onerror = function (h, l, r, v, E) {
        f && f(h, l, r, v, E);
        a({
            message: h,
            fileName: l,
            line: r,
            lineNumber: r,
            col: v,
            error: E
        });
        return g
    }
};
k.debug.expose = function (a, b) {
    if ("undefined" == typeof a) return "undefined";
    if (null == a) return "NULL";
    var c = [],
        f;
    for (f in a)
        if (b || "function" !== typeof a[f]) {
            var g = f + " = ";
            try {
                g += a[f]
            } catch (h) {
                g += "*** " + h + " ***"
            }
            c.push(g)
        } return c.join("\n")
};
k.debug.deepExpose = function (a, b) {
    var c = [],
        f = [],
        g = {},
        h = function (l, r) {
            var v = r + "  ";
            try {
                if (void 0 === l) c.push("undefined");
                else if (null === l) c.push("NULL");
                else if ("string" === typeof l) c.push('"' + l.replace(
                    /\n/g, "\n" + r) + '"');
                else if ("function" === typeof l) c.push(String(l).replace(
                    /\n/g, "\n" + r));
                else if (k.isObject(l)) {
                    k.hasUid(l) || f.push(l);
                    var E = k.getUid(l);
                    if (g[E]) c.push("*** reference loop detected (id=" +
                        E + ") ***");
                    else {
                        g[E] = !0;
                        c.push("{");
                        for (var H in l)
                            if (b || "function" !== typeof l[H]) c.push(
                                    "\n"), c.push(v),
                                c.push(H + " = "), h(l[H], v);
                        c.push("\n" + r + "}");
                        delete g[E]
                    }
                } else c.push(l)
            } catch (ia) {
                c.push("*** " + ia + " ***")
            }
        };
    h(a, "");
    for (a = 0; a < f.length; a++) k.removeUid(f[a]);
    return c.join("")
};
k.debug.exposeArray = function (a) {
    for (var b = [], c = 0; c < a.length; c++) Array.isArray(a[c]) ? b.push(
        k.debug.exposeArray(a[c])) : b.push(a[c]);
    return "[ " + b.join(", ") + " ]"
};
k.debug.normalizeErrorObject = function (a) {
    var b = k.getObjectByName("window.location.href");
    null == a && (a = 'Unknown Error of type "null/undefined"');
    if ("string" === typeof a) return {
        message: a,
        name: "Unknown error",
        lineNumber: "Not available",
        fileName: b,
        stack: "Not available"
    };
    var c = !1;
    try {
        var f = a.lineNumber || a.line || "Not available"
    } catch (l) {
        f = "Not available", c = !0
    }
    try {
        var g = a.fileName || a.filename || a.sourceURL || k.global
            .$googDebugFname || b
    } catch (l) {
        g = "Not available", c = !0
    }
    b = k.debug.serializeErrorStack_(a);
    if (!(!c &&
            a.lineNumber && a.fileName && a.stack && a.message && a.name)) {
        c = a.message;
        if (null == c) {
            if (a.constructor && a.constructor instanceof Function) {
                var h = a.constructor.name ? a.constructor.name : k.debug
                    .getFunctionName(a.constructor);
                c = 'Unknown Error of type "' + h + '"';
                if (k.debug.CHECK_FOR_THROWN_EVENT && "Event" == h) try {
                    c = c + ' with Event.type "' + (a.type || "") + '"'
                } catch (l) {}
            } else c = "Unknown Error of unknown type";
            "function" === typeof a.toString && Object.prototype
                .toString !== a.toString && (c += ": " + a.toString())
        }
        return {
            message: c,
            name: a.name || "UnknownError",
            lineNumber: f,
            fileName: g,
            stack: b || "Not available"
        }
    }
    a.stack = b;
    return a
};
k.debug.serializeErrorStack_ = function (a, b) {
    b || (b = {});
    b[k.debug.serializeErrorAsKey_(a)] = !0;
    var c = a.stack || "";
    (a = a.cause) && !b[k.debug.serializeErrorAsKey_(a)] && (c +=
        "\nCaused by: ", a.stack && 0 == a.stack.indexOf(a
    .toString()) || (c += "string" === typeof a ? a : a.message + "\n"),
        c += k.debug.serializeErrorStack_(a, b));
    return c
};
k.debug.serializeErrorAsKey_ = function (a) {
    var b = "";
    "function" === typeof a.toString && (b = "" + a);
    return b + a.stack
};
k.debug.enhanceError = function (a, b) {
    a instanceof Error || (a = Error(a), Error.captureStackTrace && Error
        .captureStackTrace(a, k.debug.enhanceError));
    a.stack || (a.stack = k.debug.getStacktrace(k.debug.enhanceError));
    if (b) {
        for (var c = 0; a["message" + c];) ++c;
        a["message" + c] = String(b)
    }
    return a
};
k.debug.enhanceErrorWithContext = function (a, b) {
    a = k.debug.enhanceError(a);
    if (b)
        for (var c in b) k.debug.errorcontext.addErrorContext(a, c, b[c]);
    return a
};
k.debug.getStacktraceSimple = function (a) {
    if (!k.debug.FORCE_SLOPPY_STACKS) {
        var b = k.debug.getNativeStackTrace_(k.debug.getStacktraceSimple);
        if (b) return b
    }
    b = [];
    for (var c = arguments.callee.caller, f = 0; c && (!a || f < a);) {
        b.push(k.debug.getFunctionName(c));
        b.push("()\n");
        try {
            c = c.caller
        } catch (g) {
            b.push("[exception trying to get caller]\n");
            break
        }
        f++;
        if (f >= k.debug.MAX_STACK_DEPTH) {
            b.push("[...long stack...]");
            break
        }
    }
    a && f >= a ? b.push("[...reached max depth limit...]") : b.push(
        "[end]");
    return b.join("")
};
k.debug.MAX_STACK_DEPTH = 50;
k.debug.getNativeStackTrace_ = function (a) {
    var b = Error();
    if (Error.captureStackTrace) return Error.captureStackTrace(b, a),
        String(b.stack);
    try {
        throw b;
    } catch (c) {
        b = c
    }
    return (a = b.stack) ? String(a) : null
};
k.debug.getStacktrace = function (a) {
    var b;
    k.debug.FORCE_SLOPPY_STACKS || (b = k.debug.getNativeStackTrace_(a || k
        .debug.getStacktrace));
    b || (b = k.debug.getStacktraceHelper_(a || arguments.callee.caller,
    []));
    return b
};
k.debug.getStacktraceHelper_ = function (a, b) {
    var c = [];
    if (ua(b, a)) c.push("[...circular reference...]");
    else if (a && b.length < k.debug.MAX_STACK_DEPTH) {
        c.push(k.debug.getFunctionName(a) + "(");
        for (var f = a.arguments, g = 0; f && g < f.length; g++) {
            0 < g && c.push(", ");
            var h = f[g];
            switch (typeof h) {
                case "object":
                    h = h ? "object" : "null";
                    break;
                case "string":
                    break;
                case "number":
                    h = String(h);
                    break;
                case "boolean":
                    h = h ? "true" : "false";
                    break;
                case "function":
                    h = (h = k.debug.getFunctionName(h)) ? h : "[fn]";
                    break;
                default:
                    h = typeof h
            }
            40 < h.length &&
                (h = h.substr(0, 40) + "...");
            c.push(h)
        }
        b.push(a);
        c.push(")\n");
        try {
            c.push(k.debug.getStacktraceHelper_(a.caller, b))
        } catch (l) {
            c.push("[exception trying to get caller]\n")
        }
    } else a ? c.push("[...long stack...]") : c.push("[end]");
    return c.join("")
};
k.debug.getFunctionName = function (a) {
    if (k.debug.fnNameCache_[a]) return k.debug.fnNameCache_[a];
    a = String(a);
    if (!k.debug.fnNameCache_[a]) {
        var b = /function\s+([^\(]+)/m.exec(a);
        k.debug.fnNameCache_[a] = b ? b[1] : "[Anonymous]"
    }
    return k.debug.fnNameCache_[a]
};
k.debug.makeWhitespaceVisible = function (a) {
    return a.replace(/ /g, "[_]").replace(/\f/g, "[f]").replace(/\n/g,
        "[n]\n").replace(/\r/g, "[r]").replace(/\t/g, "[t]")
};
k.debug.runtimeType = function (a) {
    return a instanceof Function ? a.displayName || a.name ||
        "unknown type name" : a instanceof Object ? a.constructor
        .displayName || a.constructor.name || Object.prototype.toString
        .call(a) : null === a ? "null" : typeof a
};
k.debug.fnNameCache_ = {};
k.debug.freezeInternal_ = k.DEBUG && Object.freeze || function (a) {
    return a
};
k.debug.freeze = function (a) {
    return k.debug.freezeInternal_(a)
};
k.debug.entryPointRegistry = {};
k.debug.EntryPointMonitor = function () {};
k.debug.entryPointRegistry.refList_ = [];
k.debug.entryPointRegistry.monitors_ = [];
k.debug.entryPointRegistry.monitorsMayExist_ = !1;
k.debug.entryPointRegistry.register = function (a) {
    k.debug.entryPointRegistry.refList_[k.debug.entryPointRegistry.refList_
        .length] = a;
    if (k.debug.entryPointRegistry.monitorsMayExist_)
        for (var b = k.debug.entryPointRegistry.monitors_, c = 0; c < b
            .length; c++) a(k.bind(b[c].wrap, b[c]))
};
k.debug.entryPointRegistry.monitorAll = function (a) {
    k.debug.entryPointRegistry.monitorsMayExist_ = !0;
    for (var b = k.bind(a.wrap, a), c = 0; c < k.debug.entryPointRegistry
        .refList_.length; c++) k.debug.entryPointRegistry.refList_[c](b);
    k.debug.entryPointRegistry.monitors_.push(a)
};
k.debug.entryPointRegistry.unmonitorAllIfPossible = function (a) {
    var b = k.debug.entryPointRegistry.monitors_;
    k.asserts.assert(a == b[b.length - 1],
        "Only the most recent monitor can be unwrapped.");
    a = k.bind(a.unwrap, a);
    for (var c = 0; c < k.debug.entryPointRegistry.refList_.length; c++) k
        .debug.entryPointRegistry.refList_[c](a);
    b.length--
};

function Wa(a) {
    a && "function" == typeof a.dispose && a.dispose()
}
k.dispose = Wa;

function Xa(a) {
    for (var b = 0, c = arguments.length; b < c; ++b) {
        var f = arguments[b];
        k.isArrayLike(f) ? Xa.apply(null, f) : Wa(f)
    }
}
k.disposeAll = Xa;
k.disposable = {};
k.disposable.IDisposable = function () {};
k.Disposable = function () {
    k.Disposable.MONITORING_MODE != k.Disposable.MonitoringMode.OFF && (k
        .Disposable.instances_[k.getUid(this)] = this);
    this.disposed_ = this.disposed_;
    this.onDisposeCallbacks_ = this.onDisposeCallbacks_
};
k.Disposable.MonitoringMode = {
    OFF: 0,
    PERMANENT: 1,
    INTERACTIVE: 2
};
k.Disposable.MONITORING_MODE = 0;
k.Disposable.INCLUDE_STACK_ON_CREATION = !0;
k.Disposable.instances_ = {};
k.Disposable.getUndisposedObjects = function () {
    var a = [],
        b;
    for (b in k.Disposable.instances_) k.Disposable.instances_
        .hasOwnProperty(b) && a.push(k.Disposable.instances_[Number(b)]);
    return a
};
k.Disposable.clearUndisposedObjects = function () {
    k.Disposable.instances_ = {}
};
k.Disposable.prototype.disposed_ = !1;
k.Disposable.prototype.isDisposed = function () {
    return this.disposed_
};
k.Disposable.prototype.dispose = function () {
    if (!this.disposed_ && (this.disposed_ = !0, this.disposeInternal(), k
            .Disposable.MONITORING_MODE != k.Disposable.MonitoringMode.OFF
            )) {
        var a = k.getUid(this);
        if (k.Disposable.MONITORING_MODE == k.Disposable.MonitoringMode
            .PERMANENT && !k.Disposable.instances_.hasOwnProperty(a))
        throw Error(this +
                " did not call the goog.Disposable base constructor or was disposed of after a clearUndisposedObjects call"
                );
        if (k.Disposable.MONITORING_MODE != k.Disposable.MonitoringMode
            .OFF && this.onDisposeCallbacks_ &&
            0 < this.onDisposeCallbacks_.length) throw Error(this +
            " did not empty its onDisposeCallbacks queue. This probably means it overrode dispose() or disposeInternal() without calling the superclass' method."
            );
        delete k.Disposable.instances_[a]
    }
};
k.Disposable.prototype.disposeInternal = function () {
    if (this.onDisposeCallbacks_)
        for (; this.onDisposeCallbacks_.length;) this.onDisposeCallbacks_
            .shift()()
};
k.Disposable.isDisposed = function () {
    return !1
};
k.events = {};
k.events.BrowserFeature = {
    HAS_W3C_BUTTON: !k.userAgent.IE || k.userAgent.isDocumentModeOrHigher(
        9),
    HAS_W3C_EVENT_SUPPORT: !k.userAgent.IE || k.userAgent
        .isDocumentModeOrHigher(9),
    SET_KEY_CODE_TO_PREVENT_DEFAULT: k.userAgent.IE && !k.userAgent
        .isVersionOrHigher("9"),
    HAS_NAVIGATOR_ONLINE_PROPERTY: !k.userAgent.WEBKIT || k.userAgent
        .isVersionOrHigher("528"),
    HAS_HTML5_NETWORK_EVENT_SUPPORT: k.userAgent.GECKO && k.userAgent
        .isVersionOrHigher("1.9b") || k.userAgent.IE && k.userAgent
        .isVersionOrHigher("8") || k.userAgent.OPERA && k.userAgent
        .isVersionOrHigher("9.5") ||
        k.userAgent.WEBKIT && k.userAgent.isVersionOrHigher("528"),
    HTML5_NETWORK_EVENTS_FIRE_ON_BODY: k.userAgent.GECKO && !k.userAgent
        .isVersionOrHigher("8") || k.userAgent.IE && !k.userAgent
        .isVersionOrHigher("9"),
    TOUCH_ENABLED: "ontouchstart" in k.global || !!(k.global.document &&
        document.documentElement && "ontouchstart" in document
        .documentElement) || !(!k.global.navigator || !k.global
        .navigator.maxTouchPoints && !k.global.navigator
        .msMaxTouchPoints),
    POINTER_EVENTS: "PointerEvent" in k.global,
    MSPOINTER_EVENTS: "MSPointerEvent" in
        k.global && !(!k.global.navigator || !k.global.navigator
            .msPointerEnabled),
    PASSIVE_EVENTS: function () {
        if (!k.global.addEventListener || !Object.defineProperty)
        return !1;
        var a = !1,
            b = Object.defineProperty({}, "passive", {
                get: function () {
                    a = !0
                }
            });
        try {
            k.global.addEventListener("test", k.nullFunction, b), k
                .global.removeEventListener("test", k.nullFunction, b)
        } catch (c) {}
        return a
    }()
};
k.events.EventId = function (a) {
    this.id = a
};
k.events.EventId.prototype.toString = function () {
    return this.id
};
k.events.Event = function (a, b) {
    this.type = a instanceof k.events.EventId ? String(a) : a;
    this.currentTarget = this.target = b;
    this.defaultPrevented = this.propagationStopped_ = !1
};
k.events.Event.prototype.stopPropagation = function () {
    this.propagationStopped_ = !0
};
k.events.Event.prototype.preventDefault = function () {
    this.defaultPrevented = !0
};
k.events.Event.stopPropagation = function (a) {
    a.stopPropagation()
};
k.events.Event.preventDefault = function (a) {
    a.preventDefault()
};
k.events.getVendorPrefixedName_ = function (a) {
    return k.userAgent.WEBKIT ? "webkit" + a : k.userAgent.OPERA ? "o" + a
        .toLowerCase() : a.toLowerCase()
};
k.events.EventType = {
    CLICK: "click",
    RIGHTCLICK: "rightclick",
    DBLCLICK: "dblclick",
    AUXCLICK: "auxclick",
    MOUSEDOWN: "mousedown",
    MOUSEUP: "mouseup",
    MOUSEOVER: "mouseover",
    MOUSEOUT: "mouseout",
    MOUSEMOVE: "mousemove",
    MOUSEENTER: "mouseenter",
    MOUSELEAVE: "mouseleave",
    MOUSECANCEL: "mousecancel",
    SELECTIONCHANGE: "selectionchange",
    SELECTSTART: "selectstart",
    WHEEL: "wheel",
    KEYPRESS: "keypress",
    KEYDOWN: "keydown",
    KEYUP: "keyup",
    BLUR: "blur",
    FOCUS: "focus",
    DEACTIVATE: "deactivate",
    FOCUSIN: "focusin",
    FOCUSOUT: "focusout",
    CHANGE: "change",
    RESET: "reset",
    SELECT: "select",
    SUBMIT: "submit",
    INPUT: "input",
    PROPERTYCHANGE: "propertychange",
    DRAGSTART: "dragstart",
    DRAG: "drag",
    DRAGENTER: "dragenter",
    DRAGOVER: "dragover",
    DRAGLEAVE: "dragleave",
    DROP: "drop",
    DRAGEND: "dragend",
    TOUCHSTART: "touchstart",
    TOUCHMOVE: "touchmove",
    TOUCHEND: "touchend",
    TOUCHCANCEL: "touchcancel",
    BEFOREUNLOAD: "beforeunload",
    CONSOLEMESSAGE: "consolemessage",
    CONTEXTMENU: "contextmenu",
    DEVICECHANGE: "devicechange",
    DEVICEMOTION: "devicemotion",
    DEVICEORIENTATION: "deviceorientation",
    DOMCONTENTLOADED: "DOMContentLoaded",
    ERROR: "error",
    HELP: "help",
    LOAD: "load",
    LOSECAPTURE: "losecapture",
    ORIENTATIONCHANGE: "orientationchange",
    READYSTATECHANGE: "readystatechange",
    RESIZE: "resize",
    SCROLL: "scroll",
    UNLOAD: "unload",
    CANPLAY: "canplay",
    CANPLAYTHROUGH: "canplaythrough",
    DURATIONCHANGE: "durationchange",
    EMPTIED: "emptied",
    ENDED: "ended",
    LOADEDDATA: "loadeddata",
    LOADEDMETADATA: "loadedmetadata",
    PAUSE: "pause",
    PLAY: "play",
    PLAYING: "playing",
    PROGRESS: "progress",
    RATECHANGE: "ratechange",
    SEEKED: "seeked",
    SEEKING: "seeking",
    STALLED: "stalled",
    SUSPEND: "suspend",
    TIMEUPDATE: "timeupdate",
    VOLUMECHANGE: "volumechange",
    WAITING: "waiting",
    SOURCEOPEN: "sourceopen",
    SOURCEENDED: "sourceended",
    SOURCECLOSED: "sourceclosed",
    ABORT: "abort",
    UPDATE: "update",
    UPDATESTART: "updatestart",
    UPDATEEND: "updateend",
    HASHCHANGE: "hashchange",
    PAGEHIDE: "pagehide",
    PAGESHOW: "pageshow",
    POPSTATE: "popstate",
    COPY: "copy",
    PASTE: "paste",
    CUT: "cut",
    BEFORECOPY: "beforecopy",
    BEFORECUT: "beforecut",
    BEFOREPASTE: "beforepaste",
    ONLINE: "online",
    OFFLINE: "offline",
    MESSAGE: "message",
    CONNECT: "connect",
    INSTALL: "install",
    ACTIVATE: "activate",
    FETCH: "fetch",
    FOREIGNFETCH: "foreignfetch",
    MESSAGEERROR: "messageerror",
    STATECHANGE: "statechange",
    UPDATEFOUND: "updatefound",
    CONTROLLERCHANGE: "controllerchange",
    ANIMATIONSTART: k.events.getVendorPrefixedName_("AnimationStart"),
    ANIMATIONEND: k.events.getVendorPrefixedName_("AnimationEnd"),
    ANIMATIONITERATION: k.events.getVendorPrefixedName_(
        "AnimationIteration"),
    TRANSITIONEND: k.events.getVendorPrefixedName_("TransitionEnd"),
    POINTERDOWN: "pointerdown",
    POINTERUP: "pointerup",
    POINTERCANCEL: "pointercancel",
    POINTERMOVE: "pointermove",
    POINTEROVER: "pointerover",
    POINTEROUT: "pointerout",
    POINTERENTER: "pointerenter",
    POINTERLEAVE: "pointerleave",
    GOTPOINTERCAPTURE: "gotpointercapture",
    LOSTPOINTERCAPTURE: "lostpointercapture",
    MSGESTURECHANGE: "MSGestureChange",
    MSGESTUREEND: "MSGestureEnd",
    MSGESTUREHOLD: "MSGestureHold",
    MSGESTURESTART: "MSGestureStart",
    MSGESTURETAP: "MSGestureTap",
    MSGOTPOINTERCAPTURE: "MSGotPointerCapture",
    MSINERTIASTART: "MSInertiaStart",
    MSLOSTPOINTERCAPTURE: "MSLostPointerCapture",
    MSPOINTERCANCEL: "MSPointerCancel",
    MSPOINTERDOWN: "MSPointerDown",
    MSPOINTERENTER: "MSPointerEnter",
    MSPOINTERHOVER: "MSPointerHover",
    MSPOINTERLEAVE: "MSPointerLeave",
    MSPOINTERMOVE: "MSPointerMove",
    MSPOINTEROUT: "MSPointerOut",
    MSPOINTEROVER: "MSPointerOver",
    MSPOINTERUP: "MSPointerUp",
    TEXT: "text",
    TEXTINPUT: k.userAgent.IE ? "textinput" : "textInput",
    COMPOSITIONSTART: "compositionstart",
    COMPOSITIONUPDATE: "compositionupdate",
    COMPOSITIONEND: "compositionend",
    BEFOREINPUT: "beforeinput",
    EXIT: "exit",
    LOADABORT: "loadabort",
    LOADCOMMIT: "loadcommit",
    LOADREDIRECT: "loadredirect",
    LOADSTART: "loadstart",
    LOADSTOP: "loadstop",
    RESPONSIVE: "responsive",
    SIZECHANGED: "sizechanged",
    UNRESPONSIVE: "unresponsive",
    VISIBILITYCHANGE: "visibilitychange",
    STORAGE: "storage",
    DOMSUBTREEMODIFIED: "DOMSubtreeModified",
    DOMNODEINSERTED: "DOMNodeInserted",
    DOMNODEREMOVED: "DOMNodeRemoved",
    DOMNODEREMOVEDFROMDOCUMENT: "DOMNodeRemovedFromDocument",
    DOMNODEINSERTEDINTODOCUMENT: "DOMNodeInsertedIntoDocument",
    DOMATTRMODIFIED: "DOMAttrModified",
    DOMCHARACTERDATAMODIFIED: "DOMCharacterDataModified",
    BEFOREPRINT: "beforeprint",
    AFTERPRINT: "afterprint",
    BEFOREINSTALLPROMPT: "beforeinstallprompt",
    APPINSTALLED: "appinstalled"
};
k.events.getPointerFallbackEventName_ = function (a, b, c) {
    return k.events.BrowserFeature.POINTER_EVENTS ? a : k.events
        .BrowserFeature.MSPOINTER_EVENTS ? b : c
};
k.events.PointerFallbackEventType = {
    POINTERDOWN: k.events.getPointerFallbackEventName_(k.events.EventType
        .POINTERDOWN, k.events.EventType.MSPOINTERDOWN, k.events
        .EventType.MOUSEDOWN),
    POINTERUP: k.events.getPointerFallbackEventName_(k.events.EventType
        .POINTERUP, k.events.EventType.MSPOINTERUP, k.events.EventType
        .MOUSEUP),
    POINTERCANCEL: k.events.getPointerFallbackEventName_(k.events.EventType
        .POINTERCANCEL, k.events.EventType.MSPOINTERCANCEL, k.events
        .EventType.MOUSECANCEL),
    POINTERMOVE: k.events.getPointerFallbackEventName_(k.events.EventType
        .POINTERMOVE,
        k.events.EventType.MSPOINTERMOVE, k.events.EventType.MOUSEMOVE),
    POINTEROVER: k.events.getPointerFallbackEventName_(k.events.EventType
        .POINTEROVER, k.events.EventType.MSPOINTEROVER, k.events
        .EventType.MOUSEOVER),
    POINTEROUT: k.events.getPointerFallbackEventName_(k.events.EventType
        .POINTEROUT, k.events.EventType.MSPOINTEROUT, k.events.EventType
        .MOUSEOUT),
    POINTERENTER: k.events.getPointerFallbackEventName_(k.events.EventType
        .POINTERENTER, k.events.EventType.MSPOINTERENTER, k.events
        .EventType.MOUSEENTER),
    POINTERLEAVE: k.events.getPointerFallbackEventName_(k.events.EventType
        .POINTERLEAVE,
        k.events.EventType.MSPOINTERLEAVE, k.events.EventType.MOUSELEAVE
        )
};
k.events.PointerTouchFallbackEventType = {
    POINTERDOWN: k.events.getPointerFallbackEventName_(k.events.EventType
        .POINTERDOWN, k.events.EventType.MSPOINTERDOWN, k.events
        .EventType.TOUCHSTART),
    POINTERUP: k.events.getPointerFallbackEventName_(k.events.EventType
        .POINTERUP, k.events.EventType.MSPOINTERUP, k.events.EventType
        .TOUCHEND),
    POINTERCANCEL: k.events.getPointerFallbackEventName_(k.events.EventType
        .POINTERCANCEL, k.events.EventType.MSPOINTERCANCEL, k.events
        .EventType.TOUCHCANCEL),
    POINTERMOVE: k.events.getPointerFallbackEventName_(k.events.EventType
        .POINTERMOVE,
        k.events.EventType.MSPOINTERMOVE, k.events.EventType.TOUCHMOVE)
};
k.events.PointerAsMouseEventType = {
    MOUSEDOWN: k.events.PointerFallbackEventType.POINTERDOWN,
    MOUSEUP: k.events.PointerFallbackEventType.POINTERUP,
    MOUSECANCEL: k.events.PointerFallbackEventType.POINTERCANCEL,
    MOUSEMOVE: k.events.PointerFallbackEventType.POINTERMOVE,
    MOUSEOVER: k.events.PointerFallbackEventType.POINTEROVER,
    MOUSEOUT: k.events.PointerFallbackEventType.POINTEROUT,
    MOUSEENTER: k.events.PointerFallbackEventType.POINTERENTER,
    MOUSELEAVE: k.events.PointerFallbackEventType.POINTERLEAVE
};
k.events.MouseAsMouseEventType = {
    MOUSEDOWN: k.events.EventType.MOUSEDOWN,
    MOUSEUP: k.events.EventType.MOUSEUP,
    MOUSECANCEL: k.events.EventType.MOUSECANCEL,
    MOUSEMOVE: k.events.EventType.MOUSEMOVE,
    MOUSEOVER: k.events.EventType.MOUSEOVER,
    MOUSEOUT: k.events.EventType.MOUSEOUT,
    MOUSEENTER: k.events.EventType.MOUSEENTER,
    MOUSELEAVE: k.events.EventType.MOUSELEAVE
};
k.events.PointerAsTouchEventType = {
    TOUCHCANCEL: k.events.PointerTouchFallbackEventType.POINTERCANCEL,
    TOUCHEND: k.events.PointerTouchFallbackEventType.POINTERUP,
    TOUCHMOVE: k.events.PointerTouchFallbackEventType.POINTERMOVE,
    TOUCHSTART: k.events.PointerTouchFallbackEventType.POINTERDOWN
};
k.events.USE_LAYER_XY_AS_OFFSET_XY = !1;
k.events.BrowserEvent = function (a, b) {
    k.events.Event.call(this, a ? a.type : "");
    this.relatedTarget = this.currentTarget = this.target = null;
    this.button = this.screenY = this.screenX = this.clientY = this
        .clientX = this.offsetY = this.offsetX = 0;
    this.key = "";
    this.charCode = this.keyCode = 0;
    this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;
    this.state = null;
    this.pointerId = 0;
    this.pointerType = "";
    this.event_ = null;
    if (a) {
        var c = this.type = a.type,
            f = a.changedTouches && a.changedTouches.length ? a
            .changedTouches[0] : null;
        this.target = a.target ||
            a.srcElement;
        this.currentTarget = b;
        (b = a.relatedTarget) ? k.userAgent.GECKO && (k.reflect
                .canAccessProperty(b) || (b = null)): c == k.events
            .EventType.MOUSEOVER ? b = a.fromElement : c == k.events
            .EventType.MOUSEOUT && (b = a.toElement);
        this.relatedTarget = b;
        f ? (this.clientX = void 0 !== f.clientX ? f.clientX : f.pageX, this
                .clientY = void 0 !== f.clientY ? f.clientY : f.pageY, this
                .screenX = f.screenX || 0, this.screenY = f.screenY || 0) :
            (k.events.USE_LAYER_XY_AS_OFFSET_XY ? (this.offsetX = void 0 !==
                    a.layerX ? a.layerX : a.offsetX, this.offsetY =
                    void 0 !== a.layerY ?
                    a.layerY : a.offsetY) : (this.offsetX = k.userAgent
                    .WEBKIT || void 0 !== a.offsetX ? a.offsetX : a.layerX,
                    this.offsetY = k.userAgent.WEBKIT || void 0 !== a
                    .offsetY ? a.offsetY : a.layerY), this.clientX =
                void 0 !== a.clientX ? a.clientX : a.pageX, this.clientY =
                void 0 !== a.clientY ? a.clientY : a.pageY, this.screenX = a
                .screenX || 0, this.screenY = a.screenY || 0);
        this.button = a.button;
        this.keyCode = a.keyCode || 0;
        this.key = a.key || "";
        this.charCode = a.charCode || ("keypress" == c ? a.keyCode : 0);
        this.ctrlKey = a.ctrlKey;
        this.altKey = a.altKey;
        this.shiftKey = a.shiftKey;
        this.metaKey = a.metaKey;
        this.pointerId = a.pointerId || 0;
        this.pointerType = k.events.BrowserEvent.getPointerType_(a);
        this.state = a.state;
        this.event_ = a;
        a.defaultPrevented && k.events.BrowserEvent.superClass_
            .preventDefault.call(this)
    }
};
k.inherits(k.events.BrowserEvent, k.events.Event);
k.events.BrowserEvent.MouseButton = {
    LEFT: 0,
    MIDDLE: 1,
    RIGHT: 2
};
k.events.BrowserEvent.PointerType = {
    MOUSE: "mouse",
    PEN: "pen",
    TOUCH: "touch"
};
k.events.BrowserEvent.IEButtonMap = k.debug.freeze([1, 4, 2]);
k.events.BrowserEvent.IE_BUTTON_MAP = k.events.BrowserEvent.IEButtonMap;
k.events.BrowserEvent.IE_POINTER_TYPE_MAP = k.debug.freeze({
    2: k.events.BrowserEvent.PointerType.TOUCH,
    3: k.events.BrowserEvent.PointerType.PEN,
    4: k.events.BrowserEvent.PointerType.MOUSE
});
k.events.BrowserEvent.prototype.stopPropagation = function () {
    k.events.BrowserEvent.superClass_.stopPropagation.call(this);
    this.event_.stopPropagation ? this.event_.stopPropagation() : this
        .event_.cancelBubble = !0
};
k.events.BrowserEvent.prototype.preventDefault = function () {
    k.events.BrowserEvent.superClass_.preventDefault.call(this);
    var a = this.event_;
    if (a.preventDefault) a.preventDefault();
    else if (a.returnValue = !1, k.events.BrowserFeature
        .SET_KEY_CODE_TO_PREVENT_DEFAULT) try {
        if (a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode) a
            .keyCode = -1
    } catch (b) {}
};
k.events.BrowserEvent.getPointerType_ = function (a) {
    return "string" === typeof a.pointerType ? a.pointerType : k.events
        .BrowserEvent.IE_POINTER_TYPE_MAP[a.pointerType] || ""
};
k.events.Listenable = function () {};
k.events.Listenable.IMPLEMENTED_BY_PROP = "closure_listenable_" + (1E6 * Math
    .random() | 0);
k.events.Listenable.addImplementation = function (a) {
    a.prototype[k.events.Listenable.IMPLEMENTED_BY_PROP] = !0
};
k.events.Listenable.isImplementedBy = function (a) {
    return !(!a || !a[k.events.Listenable.IMPLEMENTED_BY_PROP])
};
d = k.events.Listenable.prototype;
d.listen = function () {};
d.listenOnce = function () {};
d.unlisten = function () {};
d.unlistenByKey = function () {};
d.dispatchEvent = function () {};
d.removeAllListeners = function () {};
d.getParentEventTarget = function () {};
d.fireListeners = function () {};
d.getListeners = function () {};
d.getListener = function () {};
d.hasListener = function () {};
k.events.ListenableKey = function () {};
k.events.ListenableKey.counter_ = 0;
k.events.ListenableKey.reserveKey = function () {
    return ++k.events.ListenableKey.counter_
};
k.events.Listener = function (a, b, c, f, g) {
    this.listener = a;
    this.proxy = null;
    this.src = b;
    this.type = c;
    this.capture = !!f;
    this.handler = g;
    this.key = k.events.ListenableKey.reserveKey();
    this.removed = this.callOnce = !1
};
k.events.Listener.ENABLE_MONITORING = !1;
var Ya = function (a) {
    a.removed = !0;
    a.listener = null;
    a.proxy = null;
    a.src = null;
    a.handler = null
};
k.events.ListenerMap = function (a) {
    this.src = a;
    this.listeners = {};
    this.typeCount_ = 0
};
k.events.ListenerMap.prototype.add = function (a, b, c, f, g) {
    var h = a.toString();
    a = this.listeners[h];
    a || (a = this.listeners[h] = [], this.typeCount_++);
    var l = k.events.ListenerMap.findListenerIndex_(a, b, f, g); - 1 < l ? (
        b = a[l], c || (b.callOnce = !1)) : (b = new k.events.Listener(
        b, this.src, h, !!f, g), b.callOnce = c, a.push(b));
    return b
};
k.events.ListenerMap.prototype.remove = function (a, b, c, f) {
    a = a.toString();
    if (!(a in this.listeners)) return !1;
    var g = this.listeners[a];
    b = k.events.ListenerMap.findListenerIndex_(g, b, c, f);
    return -1 < b ? (Ya(g[b]), Ba(g, b), 0 == g.length && (delete this
        .listeners[a], this.typeCount_--), !0) : !1
};
var Za = function (a, b) {
    var c = b.type;
    if (!(c in a.listeners)) return !1;
    var f = Aa(a.listeners[c], b);
    f && (Ya(b), 0 == a.listeners[c].length && (delete a.listeners[c], a
        .typeCount_--));
    return f
};
k.events.ListenerMap.prototype.removeAll = function (a) {
    a = a && a.toString();
    var b = 0,
        c;
    for (c in this.listeners)
        if (!a || c == a) {
            for (var f = this.listeners[c], g = 0; g < f.length; g++) ++b,
                Ya(f[g]);
            delete this.listeners[c];
            this.typeCount_--
        } return b
};
k.events.ListenerMap.prototype.getListeners = function (a, b) {
    a = this.listeners[a.toString()];
    var c = [];
    if (a)
        for (var f = 0; f < a.length; ++f) {
            var g = a[f];
            g.capture == b && c.push(g)
        }
    return c
};
k.events.ListenerMap.prototype.getListener = function (a, b, c, f) {
    a = this.listeners[a.toString()];
    var g = -1;
    a && (g = k.events.ListenerMap.findListenerIndex_(a, b, c, f));
    return -1 < g ? a[g] : null
};
k.events.ListenerMap.prototype.hasListener = function (a, b) {
    var c = void 0 !== a,
        f = c ? a.toString() : "",
        g = void 0 !== b;
    return k.object.some(this.listeners, function (h) {
        for (var l = 0; l < h.length; ++l)
            if (!(c && h[l].type != f || g && h[l].capture != b))
                return !0;
        return !1
    })
};
k.events.ListenerMap.findListenerIndex_ = function (a, b, c, f) {
    for (var g = 0; g < a.length; ++g) {
        var h = a[g];
        if (!h.removed && h.listener == b && h.capture == !!c && h
            .handler == f) return g
    }
    return -1
};
k.events.LISTENER_MAP_PROP_ = "closure_lm_" + (1E6 * Math.random() | 0);
k.events.onString_ = "on";
k.events.onStringMap_ = {};
k.events.CaptureSimulationMode = {
    OFF_AND_FAIL: 0,
    OFF_AND_SILENT: 1,
    ON: 2
};
k.events.CAPTURE_SIMULATION_MODE = 2;
k.events.listenerCountEstimate_ = 0;
k.events.listen = function (a, b, c, f, g) {
    if (f && f.once) return k.events.listenOnce(a, b, c, f, g);
    if (Array.isArray(b)) {
        for (var h = 0; h < b.length; h++) k.events.listen(a, b[h], c, f,
        g);
        return null
    }
    c = k.events.wrapListener(c);
    return k.events.Listenable.isImplementedBy(a) ? a.listen(b, c, k
        .isObject(f) ? !!f.capture : !!f, g) : k.events.listen_(a, b, c,
        !1, f, g)
};
k.events.listen_ = function (a, b, c, f, g, h) {
    if (!b) throw Error("Invalid event type");
    var l = k.isObject(g) ? !!g.capture : !!g;
    if (l && !k.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
        if (k.events.CAPTURE_SIMULATION_MODE == k.events
            .CaptureSimulationMode.OFF_AND_FAIL) return k.asserts.fail(
            "Can not register capture listener in IE8-."), null;
        if (k.events.CAPTURE_SIMULATION_MODE == k.events
            .CaptureSimulationMode.OFF_AND_SILENT) return null
    }
    var r = k.events.getListenerMap_(a);
    r || (a[k.events.LISTENER_MAP_PROP_] = r = new k.events.ListenerMap(a));
    c = r.add(b, c, f, l, h);
    if (c.proxy) return c;
    f = k.events.getProxy();
    c.proxy = f;
    f.src = a;
    f.listener = c;
    if (a.addEventListener) k.events.BrowserFeature.PASSIVE_EVENTS || (g =
        l), void 0 === g && (g = !1), a.addEventListener(b.toString(),
        f, g);
    else if (a.attachEvent) a.attachEvent(k.events.getOnString_(b
    .toString()), f);
    else if (a.addListener && a.removeListener) k.asserts.assert(
            "change" === b, "MediaQueryList only has a change event"), a
        .addListener(f);
    else throw Error("addEventListener and attachEvent are unavailable.");
    k.events.listenerCountEstimate_++;
    return c
};
k.events.getProxy = function () {
    var a = k.events.handleBrowserEvent_,
        b = k.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT ? function (c) {
            return a.call(b.src, b.listener, c)
        } : function (c) {
            c = a.call(b.src, b.listener, c);
            if (!c) return c
        };
    return b
};
k.events.listenOnce = function (a, b, c, f, g) {
    if (Array.isArray(b)) {
        for (var h = 0; h < b.length; h++) k.events.listenOnce(a, b[h], c,
            f, g);
        return null
    }
    c = k.events.wrapListener(c);
    return k.events.Listenable.isImplementedBy(a) ? a.listenOnce(b, c, k
        .isObject(f) ? !!f.capture : !!f, g) : k.events.listen_(a, b, c,
        !0, f, g)
};
k.events.listenWithWrapper = function (a, b, c, f, g) {
    b.listen(a, c, f, g)
};
k.events.unlisten = function (a, b, c, f, g) {
    if (Array.isArray(b)) {
        for (var h = 0; h < b.length; h++) k.events.unlisten(a, b[h], c, f,
            g);
        return null
    }
    f = k.isObject(f) ? !!f.capture : !!f;
    c = k.events.wrapListener(c);
    if (k.events.Listenable.isImplementedBy(a)) return a.unlisten(b, c, f,
        g);
    if (!a) return !1;
    if (a = k.events.getListenerMap_(a))
        if (b = a.getListener(b, c, f, g)) return k.events.unlistenByKey(b);
    return !1
};
k.events.unlistenByKey = function (a) {
    if ("number" === typeof a || !a || a.removed) return !1;
    var b = a.src;
    if (k.events.Listenable.isImplementedBy(b)) return b.unlistenByKey(a);
    var c = a.type,
        f = a.proxy;
    b.removeEventListener ? b.removeEventListener(c, f, a.capture) : b
        .detachEvent ? b.detachEvent(k.events.getOnString_(c), f) : b
        .addListener && b.removeListener && b.removeListener(f);
    k.events.listenerCountEstimate_--;
    (c = k.events.getListenerMap_(b)) ? (Za(c, a), 0 == c.typeCount_ && (c
        .src = null, b[k.events.LISTENER_MAP_PROP_] = null)) : Ya(a);
    return !0
};
k.events.unlistenWithWrapper = function (a, b, c, f, g) {
    b.unlisten(a, c, f, g)
};
k.events.removeAll = function (a, b) {
    if (!a) return 0;
    if (k.events.Listenable.isImplementedBy(a)) return a.removeAllListeners(
        b);
    a = k.events.getListenerMap_(a);
    if (!a) return 0;
    var c = 0;
    b = b && b.toString();
    for (var f in a.listeners)
        if (!b || f == b)
            for (var g = a.listeners[f].concat(), h = 0; h < g.length; ++h)
                k.events.unlistenByKey(g[h]) && ++c;
    return c
};
k.events.getListeners = function (a, b) {
    return k.events.Listenable.isImplementedBy(a) ? a.getListeners(b,
            void 0) : a ? (a = k.events.getListenerMap_(a)) ? a
        .getListeners(b, void 0) : [] : []
};
k.events.getListener = function (a, b, c, f, g) {
    c = k.events.wrapListener(c);
    f = !!f;
    return k.events.Listenable.isImplementedBy(a) ? a.getListener(b, c, f,
        g) : a ? (a = k.events.getListenerMap_(a)) ? a.getListener(b, c,
        f, g) : null : null
};
k.events.hasListener = function (a, b, c) {
    if (k.events.Listenable.isImplementedBy(a)) return a.hasListener(b, c);
    a = k.events.getListenerMap_(a);
    return !!a && a.hasListener(b, c)
};
k.events.expose = function (a) {
    var b = [],
        c;
    for (c in a) a[c] && a[c].id ? b.push(c + " = " + a[c] + " (" + a[c]
        .id + ")") : b.push(c + " = " + a[c]);
    return b.join("\n")
};
k.events.getOnString_ = function (a) {
    return a in k.events.onStringMap_ ? k.events.onStringMap_[a] : k.events
        .onStringMap_[a] = k.events.onString_ + a
};
k.events.fireListeners = function (a, b, c) {
    return k.events.Listenable.isImplementedBy(a) ? a.fireListeners(b, c,
        void 0) : k.events.fireListeners_(a, b, c, void 0)
};
k.events.fireListeners_ = function (a, b, c, f) {
    var g = !0;
    if (a = k.events.getListenerMap_(a))
        if (b = a.listeners[b.toString()])
            for (b = b.concat(), a = 0; a < b.length; a++) {
                var h = b[a];
                h && h.capture == c && !h.removed && (h = k.events
                    .fireListener(h, f), g = g && !1 !== h)
            }
    return g
};
k.events.fireListener = function (a, b) {
    var c = a.listener,
        f = a.handler || a.src;
    a.callOnce && k.events.unlistenByKey(a);
    return c.call(f, b)
};
k.events.getTotalListenerCount = function () {
    return k.events.listenerCountEstimate_
};
k.events.dispatchEvent = function (a, b) {
    k.asserts.assert(k.events.Listenable.isImplementedBy(a),
        "Can not use goog.events.dispatchEvent with non-goog.events.Listenable instance."
        );
    return a.dispatchEvent(b)
};
k.events.protectBrowserEventEntryPoint = function (a) {
    k.events.handleBrowserEvent_ = a.protectEntryPoint(k.events
        .handleBrowserEvent_)
};
k.events.handleBrowserEvent_ = function (a, b) {
    if (a.removed) return !0;
    if (!k.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
        var c = b || k.getObjectByName("window.event");
        b = new k.events.BrowserEvent(c, this);
        var f = !0;
        if (k.events.CAPTURE_SIMULATION_MODE == k.events
            .CaptureSimulationMode.ON) {
            if (!k.events.isMarkedIeEvent_(c)) {
                k.events.markIeEvent_(c);
                c = [];
                for (var g = b.currentTarget; g; g = g.parentNode) c.push(
                g);
                a = a.type;
                for (g = c.length - 1; !b.propagationStopped_ && 0 <=
                    g; g--) {
                    b.currentTarget = c[g];
                    var h = k.events.fireListeners_(c[g],
                        a, !0, b);
                    f = f && h
                }
                for (g = 0; !b.propagationStopped_ && g < c.length; g++) b
                    .currentTarget = c[g], h = k.events.fireListeners_(c[g],
                        a, !1, b), f = f && h
            }
        } else f = k.events.fireListener(a, b);
        return f
    }
    return k.events.fireListener(a, new k.events.BrowserEvent(b, this))
};
k.events.markIeEvent_ = function (a) {
    var b = !1;
    if (0 == a.keyCode) try {
        a.keyCode = -1;
        return
    } catch (c) {
        b = !0
    }
    if (b || void 0 == a.returnValue) a.returnValue = !0
};
k.events.isMarkedIeEvent_ = function (a) {
    return 0 > a.keyCode || void 0 != a.returnValue
};
k.events.uniqueIdCounter_ = 0;
k.events.getUniqueId = function (a) {
    return a + "_" + k.events.uniqueIdCounter_++
};
k.events.getListenerMap_ = function (a) {
    a = a[k.events.LISTENER_MAP_PROP_];
    return a instanceof k.events.ListenerMap ? a : null
};
k.events.LISTENER_WRAPPER_PROP_ = "__closure_events_fn_" + (1E9 * Math
.random() >>> 0);
k.events.wrapListener = function (a) {
    k.asserts.assert(a, "Listener can not be null.");
    if ("function" === typeof a) return a;
    k.asserts.assert(a.handleEvent,
        "An object listener must have handleEvent method.");
    a[k.events.LISTENER_WRAPPER_PROP_] || (a[k.events
        .LISTENER_WRAPPER_PROP_] = function (b) {
        return a.handleEvent(b)
    });
    return a[k.events.LISTENER_WRAPPER_PROP_]
};
k.debug.entryPointRegistry.register(function (a) {
    k.events.handleBrowserEvent_ = a(k.events.handleBrowserEvent_)
});
k.events.EventHandler = function (a) {
    k.Disposable.call(this);
    this.handler_ = a;
    this.keys_ = {}
};
k.inherits(k.events.EventHandler, k.Disposable);
k.events.EventHandler.typeArray_ = [];
k.events.EventHandler.prototype.listen = function (a, b, c, f) {
    return this.listen_(a, b, c, f)
};
k.events.EventHandler.prototype.listen_ = function (a, b, c, f, g) {
    Array.isArray(b) || (b && (k.events.EventHandler.typeArray_[0] = b
        .toString()), b = k.events.EventHandler.typeArray_);
    for (var h = 0; h < b.length; h++) {
        var l = k.events.listen(a, b[h], c || this.handleEvent, f || !1,
            g || this.handler_ || this);
        if (!l) break;
        this.keys_[l.key] = l
    }
    return this
};
k.events.EventHandler.prototype.listenOnce = function (a, b, c, f) {
    return $a(this, a, b, c, f)
};
var $a = function (a, b, c, f, g, h) {
    if (Array.isArray(c))
        for (var l = 0; l < c.length; l++) $a(a, b, c[l], f, g, h);
    else {
        b = k.events.listenOnce(b, c, f || a.handleEvent, g, h || a
            .handler_ || a);
        if (!b) return a;
        a.keys_[b.key] = b
    }
    return a
};
d = k.events.EventHandler.prototype;
d.listenWithWrapper = function (a, b, c, f) {
    b.listen(a, c, f, this.handler_ || this, this);
    return this
};
d.unlisten = function (a, b, c, f, g) {
    if (Array.isArray(b))
        for (var h = 0; h < b.length; h++) this.unlisten(a, b[h], c, f, g);
    else if (a = k.events.getListener(a, b, c || this.handleEvent, k
            .isObject(f) ? !!f.capture : !!f, g || this.handler_ || this)) k
        .events.unlistenByKey(a), delete this.keys_[a.key];
    return this
};
d.unlistenWithWrapper = function (a, b, c, f, g) {
    b.unlisten(a, c, f, g || this.handler_ || this, this);
    return this
};
d.removeAll = function () {
    k.object.forEach(this.keys_, function (a, b) {
        this.keys_.hasOwnProperty(b) && k.events.unlistenByKey(a)
    }, this);
    this.keys_ = {}
};
d.disposeInternal = function () {
    k.events.EventHandler.superClass_.disposeInternal.call(this);
    this.removeAll()
};
d.handleEvent = function () {
    throw Error("EventHandler.handleEvent not implemented");
};
k.events.EventTarget = function () {
    k.Disposable.call(this);
    this.eventTargetListeners_ = new k.events.ListenerMap(this);
    this.actualEventTarget_ = this;
    this.parentEventTarget_ = null
};
k.inherits(k.events.EventTarget, k.Disposable);
k.events.Listenable.addImplementation(k.events.EventTarget);
k.events.EventTarget.MAX_ANCESTORS_ = 1E3;
d = k.events.EventTarget.prototype;
d.getParentEventTarget = function () {
    return this.parentEventTarget_
};
d.addEventListener = function (a, b, c, f) {
    k.events.listen(this, a, b, c, f)
};
d.removeEventListener = function (a, b, c, f) {
    k.events.unlisten(this, a, b, c, f)
};
d.dispatchEvent = function (a) {
    ab(this);
    var b = this.getParentEventTarget();
    if (b) {
        var c = [];
        for (var f = 1; b; b = b.getParentEventTarget()) c.push(b), k
            .asserts.assert(++f < k.events.EventTarget.MAX_ANCESTORS_,
                "infinite loop")
    }
    return k.events.EventTarget.dispatchEventInternal_(this
        .actualEventTarget_, a, c)
};
d.disposeInternal = function () {
    k.events.EventTarget.superClass_.disposeInternal.call(this);
    this.removeAllListeners();
    this.parentEventTarget_ = null
};
d.listen = function (a, b, c, f) {
    ab(this);
    return this.eventTargetListeners_.add(String(a), b, !1, c, f)
};
d.listenOnce = function (a, b, c, f) {
    return this.eventTargetListeners_.add(String(a), b, !0, c, f)
};
d.unlisten = function (a, b, c, f) {
    return this.eventTargetListeners_.remove(String(a), b, c, f)
};
d.unlistenByKey = function (a) {
    return Za(this.eventTargetListeners_, a)
};
d.removeAllListeners = function (a) {
    return this.eventTargetListeners_ ? this.eventTargetListeners_
        .removeAll(a) : 0
};
d.fireListeners = function (a, b, c) {
    a = this.eventTargetListeners_.listeners[String(a)];
    if (!a) return !0;
    a = a.concat();
    for (var f = !0, g = 0; g < a.length; ++g) {
        var h = a[g];
        if (h && !h.removed && h.capture == b) {
            var l = h.listener,
                r = h.handler || h.src;
            h.callOnce && this.unlistenByKey(h);
            f = !1 !== l.call(r, c) && f
        }
    }
    return f && !c.defaultPrevented
};
d.getListeners = function (a, b) {
    return this.eventTargetListeners_.getListeners(String(a), b)
};
d.getListener = function (a, b, c, f) {
    return this.eventTargetListeners_.getListener(String(a), b, c, f)
};
d.hasListener = function (a, b) {
    return this.eventTargetListeners_.hasListener(void 0 !== a ? String(a) :
        void 0, b)
};
var ab = function (a) {
    k.asserts.assert(a.eventTargetListeners_,
        "Event target is not initialized. Did you call the superclass (goog.events.EventTarget) constructor?"
        )
};
k.events.EventTarget.dispatchEventInternal_ = function (a, b, c) {
    var f = b.type || b;
    if ("string" === typeof b) b = new k.events.Event(b, a);
    else if (b instanceof k.events.Event) b.target = b.target || a;
    else {
        var g = b;
        b = new k.events.Event(f, a);
        k.object.extend(b, g)
    }
    g = !0;
    if (c)
        for (var h = c.length - 1; !b.propagationStopped_ && 0 <= h; h--) {
            var l = b.currentTarget = c[h];
            g = l.fireListeners(f, !0, b) && g
        }
    b.propagationStopped_ || (l = b.currentTarget = a, g = l.fireListeners(
        f, !0, b) && g, b.propagationStopped_ || (g = l
        .fireListeners(f, !1, b) && g));
    if (c)
        for (h =
            0; !b.propagationStopped_ && h < c.length; h++) l = b
            .currentTarget = c[h], g = l.fireListeners(f, !1, b) && g;
    return g
};
k.events.EventWrapper = function () {};
k.events.EventWrapper.prototype.listen = function () {};
k.events.EventWrapper.prototype.unlisten = function () {};
k.math = {};
k.math.randomInt = function (a) {
    return Math.floor(Math.random() * a)
};
k.math.uniformRandom = function (a, b) {
    return a + Math.random() * (b - a)
};
k.math.clamp = function (a, b, c) {
    return Math.min(Math.max(a, b), c)
};
k.math.modulo = function (a, b) {
    a %= b;
    return 0 > a * b ? a + b : a
};
k.math.lerp = function (a, b, c) {
    return a + c * (b - a)
};
k.math.nearlyEquals = function (a, b, c) {
    return Math.abs(a - b) <= (c || 1E-6)
};
k.math.standardAngle = function (a) {
    return k.math.modulo(a, 360)
};
k.math.standardAngleInRadians = function (a) {
    return k.math.modulo(a, 2 * Math.PI)
};
k.math.toRadians = function (a) {
    return a * Math.PI / 180
};
k.math.toDegrees = function (a) {
    return 180 * a / Math.PI
};
k.math.angleDx = function (a, b) {
    return b * Math.cos(k.math.toRadians(a))
};
k.math.angleDy = function (a, b) {
    return b * Math.sin(k.math.toRadians(a))
};
k.math.angle = function (a, b, c, f) {
    return k.math.standardAngle(k.math.toDegrees(Math.atan2(f - b, c - a)))
};
k.math.angleDifference = function (a, b) {
    a = k.math.standardAngle(b) - k.math.standardAngle(a);
    180 < a ? a -= 360 : -180 >= a && (a = 360 + a);
    return a
};
k.math.sign = function (a) {
    return 0 < a ? 1 : 0 > a ? -1 : a
};
k.math.longestCommonSubsequence = function (a, b, c, f) {
    c = c || function (H, ia) {
        return H == ia
    };
    f = f || function (H) {
        return a[H]
    };
    for (var g = a.length, h = b.length, l = [], r = 0; r < g + 1; r++) l[
        r] = [], l[r][0] = 0;
    for (var v = 0; v < h + 1; v++) l[0][v] = 0;
    for (r = 1; r <= g; r++)
        for (v = 1; v <= h; v++) c(a[r - 1], b[v - 1]) ? l[r][v] = l[r - 1][
            v - 1
        ] + 1 : l[r][v] = Math.max(l[r - 1][v], l[r][v - 1]);
    var E = [];
    r = g;
    for (v = h; 0 < r && 0 < v;) c(a[r - 1], b[v - 1]) ? (E.unshift(f(r - 1,
        v - 1)), r--, v--) : l[r - 1][v] > l[r][v - 1] ? r-- : v--;
    return E
};
k.math.sum = function (a) {
    return oa(arguments, function (b, c) {
        return b + c
    }, 0)
};
k.math.average = function (a) {
    return k.math.sum.apply(null, arguments) / arguments.length
};
k.math.sampleVariance = function (a) {
    var b = arguments.length;
    if (2 > b) return 0;
    var c = k.math.average.apply(null, arguments);
    return k.math.sum.apply(null, p(arguments, function (f) {
        return Math.pow(f - c, 2)
    })) / (b - 1)
};
k.math.standardDeviation = function (a) {
    return Math.sqrt(k.math.sampleVariance.apply(null, arguments))
};
k.math.isInt = function (a) {
    return isFinite(a) && 0 == a % 1
};
k.math.isFiniteNumber = function (a) {
    return isFinite(a)
};
k.math.isNegativeZero = function (a) {
    return 0 == a && 0 > 1 / a
};
k.math.log10Floor = function (a) {
    if (0 < a) {
        var b = Math.round(Math.log(a) * Math.LOG10E);
        return b - (parseFloat("1e" + b) > a ? 1 : 0)
    }
    return 0 == a ? -Infinity : NaN
};
k.math.safeFloor = function (a, b) {
    k.asserts.assert(void 0 === b || 0 < b);
    return Math.floor(a + (b || 2E-15))
};
k.math.safeCeil = function (a, b) {
    k.asserts.assert(void 0 === b || 0 < b);
    return Math.ceil(a - (b || 2E-15))
};
k.iter = {};
k.iter.StopIteration = "StopIteration" in k.global ? k.global.StopIteration : {
    message: "StopIteration",
    stack: ""
};
k.iter.Iterator = function () {};
k.iter.Iterator.prototype.next = function () {
    throw k.iter.StopIteration;
};
k.iter.Iterator.prototype.__iterator__ = function () {
    return this
};
k.iter.toIterator = function (a) {
    if (a instanceof k.iter.Iterator) return a;
    if ("function" == typeof a.__iterator__) return a.__iterator__(!1);
    if (k.isArrayLike(a)) {
        var b = 0,
            c = new k.iter.Iterator;
        c.next = function () {
            for (;;) {
                if (b >= a.length) throw k.iter.StopIteration;
                if (b in a) return a[b++];
                b++
            }
        };
        return c
    }
    throw Error("Not implemented");
};
k.iter.forEach = function (a, b, c) {
    if (k.isArrayLike(a)) try {
        n(a, b, c)
    } catch (f) {
        if (f !== k.iter.StopIteration) throw f;
    } else {
        a = k.iter.toIterator(a);
        try {
            for (;;) b.call(c, a.next(), void 0, a)
        } catch (f) {
            if (f !== k.iter.StopIteration) throw f;
        }
    }
};
k.iter.filter = function (a, b, c) {
    var f = k.iter.toIterator(a);
    a = new k.iter.Iterator;
    a.next = function () {
        for (;;) {
            var g = f.next();
            if (b.call(c, g, void 0, f)) return g
        }
    };
    return a
};
k.iter.filterFalse = function (a, b, c) {
    return k.iter.filter(a, k.functions.not(b), c)
};
k.iter.range = function (a, b, c) {
    var f = 0,
        g = a,
        h = c || 1;
    1 < arguments.length && (f = a, g = +b);
    if (0 == h) throw Error("Range step argument must not be zero");
    var l = new k.iter.Iterator;
    l.next = function () {
        if (0 < h && f >= g || 0 > h && f <= g) throw k.iter
            .StopIteration;
        var r = f;
        f += h;
        return r
    };
    return l
};
k.iter.join = function (a, b) {
    return k.iter.toArray(a).join(b)
};
k.iter.map = function (a, b, c) {
    var f = k.iter.toIterator(a);
    a = new k.iter.Iterator;
    a.next = function () {
        var g = f.next();
        return b.call(c, g, void 0, f)
    };
    return a
};
k.iter.reduce = function (a, b, c, f) {
    var g = c;
    k.iter.forEach(a, function (h) {
        g = b.call(f, g, h)
    });
    return g
};
k.iter.some = function (a, b, c) {
    a = k.iter.toIterator(a);
    try {
        for (;;)
            if (b.call(c, a.next(), void 0, a)) return !0
    } catch (f) {
        if (f !== k.iter.StopIteration) throw f;
    }
    return !1
};
k.iter.every = function (a, b, c) {
    a = k.iter.toIterator(a);
    try {
        for (;;)
            if (!b.call(c, a.next(), void 0, a)) return !1
    } catch (f) {
        if (f !== k.iter.StopIteration) throw f;
    }
    return !0
};
k.iter.chain = function (a) {
    return k.iter.chainFromIterable(arguments)
};
k.iter.chainFromIterable = function (a) {
    var b = k.iter.toIterator(a);
    a = new k.iter.Iterator;
    var c = null;
    a.next = function () {
        for (;;) {
            if (null == c) {
                var f = b.next();
                c = k.iter.toIterator(f)
            }
            try {
                return c.next()
            } catch (g) {
                if (g !== k.iter.StopIteration) throw g;
                c = null
            }
        }
    };
    return a
};
k.iter.dropWhile = function (a, b, c) {
    var f = k.iter.toIterator(a);
    a = new k.iter.Iterator;
    var g = !0;
    a.next = function () {
        for (;;) {
            var h = f.next();
            if (!g || !b.call(c, h, void 0, f)) return g = !1, h
        }
    };
    return a
};
k.iter.takeWhile = function (a, b, c) {
    var f = k.iter.toIterator(a);
    a = new k.iter.Iterator;
    a.next = function () {
        var g = f.next();
        if (b.call(c, g, void 0, f)) return g;
        throw k.iter.StopIteration;
    };
    return a
};
k.iter.toArray = function (a) {
    if (k.isArrayLike(a)) return Da(a);
    a = k.iter.toIterator(a);
    var b = [];
    k.iter.forEach(a, function (c) {
        b.push(c)
    });
    return b
};
k.iter.equals = function (a, b) {
    a = k.iter.zipLongest({}, a, b);
    var c = Ma;
    return k.iter.every(a, function (f) {
        return c(f[0], f[1])
    })
};
k.iter.nextOrValue = function (a) {
    try {
        k.iter.toIterator(a).next()
    } catch (b) {
        if (b != k.iter.StopIteration) throw b;
    }
};
k.iter.product = function (a) {
    if (pa(arguments, function (g) {
            return !g.length
        }) || !arguments.length) return new k.iter.Iterator;
    var b = new k.iter.Iterator,
        c = arguments,
        f = Oa(0, c.length);
    b.next = function () {
        if (f) {
            for (var g = p(f, function (l, r) {
                    return c[r][l]
                }), h = f.length - 1; 0 <= h; h--) {
                k.asserts.assert(f);
                if (f[h] < c[h].length - 1) {
                    f[h]++;
                    break
                }
                if (0 == h) {
                    f = null;
                    break
                }
                f[h] = 0
            }
            return g
        }
        throw k.iter.StopIteration;
    };
    return b
};
k.iter.cycle = function (a) {
    var b = k.iter.toIterator(a),
        c = [],
        f = 0;
    a = new k.iter.Iterator;
    var g = !1;
    a.next = function () {
        var h = null;
        if (!g) try {
            return h = b.next(), c.push(h), h
        } catch (l) {
            if (l != k.iter.StopIteration || va(c)) throw l;
            g = !0
        }
        h = c[f];
        f = (f + 1) % c.length;
        return h
    };
    return a
};
k.iter.count = function (a, b) {
    var c = a || 0,
        f = void 0 !== b ? b : 1;
    a = new k.iter.Iterator;
    a.next = function () {
        var g = c;
        c += f;
        return g
    };
    return a
};
k.iter.repeat = function (a) {
    var b = new k.iter.Iterator;
    b.next = k.functions.constant(a);
    return b
};
k.iter.accumulate = function (a) {
    var b = k.iter.toIterator(a),
        c = 0;
    a = new k.iter.Iterator;
    a.next = function () {
        return c += b.next()
    };
    return a
};
k.iter.zip = function (a) {
    var b = arguments,
        c = new k.iter.Iterator;
    if (0 < b.length) {
        var f = p(b, k.iter.toIterator);
        c.next = function () {
            return p(f, function (g) {
                return g.next()
            })
        }
    }
    return c
};
k.iter.zipLongest = function (a, b) {
    var c = Ea(arguments, 1),
        f = new k.iter.Iterator;
    if (0 < c.length) {
        var g = p(c, k.iter.toIterator);
        f.next = function () {
            var h = !1,
                l = p(g, function (r) {
                    try {
                        var v = r.next();
                        h = !0
                    } catch (E) {
                        if (E !== k.iter.StopIteration) throw E;
                        v = a
                    }
                    return v
                });
            if (!h) throw k.iter.StopIteration;
            return l
        }
    }
    return f
};
k.iter.compress = function (a, b) {
    var c = k.iter.toIterator(b);
    return k.iter.filter(a, function () {
        return !!c.next()
    })
};
k.iter.GroupByIterator_ = function (a, b) {
    this.iterator = k.iter.toIterator(a);
    this.keyFunc = b || k.functions.identity
};
k.inherits(k.iter.GroupByIterator_, k.iter.Iterator);
k.iter.GroupByIterator_.prototype.next = function () {
    for (; this.currentKey == this.targetKey;) this.currentValue = this
        .iterator.next(), this.currentKey = this.keyFunc(this.currentValue);
    for (var a = this.targetKey = this.currentKey, b = this.targetKey,
        c = []; this.currentKey == b;) {
        c.push(this.currentValue);
        try {
            this.currentValue = this.iterator.next()
        } catch (f) {
            if (f !== k.iter.StopIteration) throw f;
            break
        }
        this.currentKey = this.keyFunc(this.currentValue)
    }
    return [a, c]
};
k.iter.groupBy = function (a, b) {
    return new k.iter.GroupByIterator_(a, b)
};
k.iter.starMap = function (a, b, c) {
    var f = k.iter.toIterator(a);
    a = new k.iter.Iterator;
    a.next = function () {
        var g = k.iter.toArray(f.next());
        return b.apply(c, Ca(g, void 0, f))
    };
    return a
};
k.iter.tee = function (a, b) {
    var c = k.iter.toIterator(a),
        f = p(Na("number" === typeof b ? b : 2), function () {
            return []
        }),
        g = function () {
            var h = c.next();
            n(f, function (l) {
                l.push(h)
            })
        };
    return p(f, function (h) {
        var l = new k.iter.Iterator;
        l.next = function () {
            va(h) && g();
            k.asserts.assert(!va(h));
            return h.shift()
        };
        return l
    })
};
k.iter.enumerate = function (a, b) {
    return k.iter.zip(k.iter.count(b), a)
};
k.iter.limit = function (a, b) {
    k.asserts.assert(k.math.isInt(b) && 0 <= b);
    var c = k.iter.toIterator(a);
    a = new k.iter.Iterator;
    var f = b;
    a.next = function () {
        if (0 < f--) return c.next();
        throw k.iter.StopIteration;
    };
    return a
};
k.iter.consume = function (a, b) {
    k.asserts.assert(k.math.isInt(b) && 0 <= b);
    for (a = k.iter.toIterator(a); 0 < b--;) k.iter.nextOrValue(a);
    return a
};
k.iter.slice = function (a, b, c) {
    k.asserts.assert(k.math.isInt(b) && 0 <= b);
    a = k.iter.consume(a, b);
    "number" === typeof c && (k.asserts.assert(k.math.isInt(c) && c >= b),
        a = k.iter.limit(a, c - b));
    return a
};
k.iter.hasDuplicates_ = function (a) {
    var b = [];
    Fa(a, b);
    return a.length != b.length
};
k.iter.permutations = function (a, b) {
    a = k.iter.toArray(a);
    b = k.iter.product.apply(void 0, Oa(a, "number" === typeof b ? b : a
        .length));
    return k.iter.filter(b, function (c) {
        return !k.iter.hasDuplicates_(c)
    })
};
k.iter.combinations = function (a, b) {
    function c(h) {
        return f[h]
    }
    var f = k.iter.toArray(a);
    a = k.iter.range(f.length);
    b = k.iter.permutations(a, b);
    var g = k.iter.filter(b, function (h) {
        return La(h)
    });
    b = new k.iter.Iterator;
    b.next = function () {
        return p(g.next(), c)
    };
    return b
};
k.iter.combinationsWithReplacement = function (a, b) {
    function c(h) {
        return f[h]
    }
    var f = k.iter.toArray(a);
    a = Na(f.length);
    b = k.iter.product.apply(void 0, Oa(a, b));
    var g = k.iter.filter(b, function (h) {
        return La(h)
    });
    b = new k.iter.Iterator;
    b.next = function () {
        return p(g.next(), c)
    };
    return b
};
k.structs = {};
k.structs.Map = function (a, b) {
    this.map_ = {};
    this.keys_ = [];
    this.version_ = this.count_ = 0;
    var c = arguments.length;
    if (1 < c) {
        if (c % 2) throw Error("Uneven number of arguments");
        for (var f = 0; f < c; f += 2) this.set(arguments[f], arguments[f +
            1])
    } else a && this.addAll(a)
};
d = k.structs.Map.prototype;
d.getCount = function () {
    return this.count_
};
d.getValues = function () {
    bb(this);
    for (var a = [], b = 0; b < this.keys_.length; b++) a.push(this.map_[
        this.keys_[b]]);
    return a
};
d.getKeys = function () {
    bb(this);
    return this.keys_.concat()
};
d.containsKey = function (a) {
    return k.structs.Map.hasKey_(this.map_, a)
};
d.containsValue = function (a) {
    for (var b = 0; b < this.keys_.length; b++) {
        var c = this.keys_[b];
        if (k.structs.Map.hasKey_(this.map_, c) && this.map_[c] == a)
        return !0
    }
    return !1
};
d.equals = function (a, b) {
    if (this === a) return !0;
    if (this.count_ != a.getCount()) return !1;
    b = b || k.structs.Map.defaultEquals;
    bb(this);
    for (var c, f = 0; c = this.keys_[f]; f++)
        if (!b(this.get(c), a.get(c))) return !1;
    return !0
};
k.structs.Map.defaultEquals = function (a, b) {
    return a === b
};
k.structs.Map.prototype.isEmpty = function () {
    return 0 == this.count_
};
k.structs.Map.prototype.clear = function () {
    this.map_ = {};
    this.version_ = this.count_ = this.keys_.length = 0
};
k.structs.Map.prototype.remove = function (a) {
    return k.structs.Map.hasKey_(this.map_, a) ? (delete this.map_[a], this
        .count_--, this.version_++, this.keys_.length > 2 * this
        .count_ && bb(this), !0) : !1
};
var bb = function (a) {
    if (a.count_ != a.keys_.length) {
        for (var b = 0, c = 0; b < a.keys_.length;) {
            var f = a.keys_[b];
            k.structs.Map.hasKey_(a.map_, f) && (a.keys_[c++] = f);
            b++
        }
        a.keys_.length = c
    }
    if (a.count_ != a.keys_.length) {
        var g = {};
        for (c = b = 0; b < a.keys_.length;) f = a.keys_[b], k.structs.Map
            .hasKey_(g, f) || (a.keys_[c++] = f, g[f] = 1), b++;
        a.keys_.length = c
    }
};
d = k.structs.Map.prototype;
d.get = function (a, b) {
    return k.structs.Map.hasKey_(this.map_, a) ? this.map_[a] : b
};
d.set = function (a, b) {
    k.structs.Map.hasKey_(this.map_, a) || (this.count_++, this.keys_.push(
        a), this.version_++);
    this.map_[a] = b
};
d.addAll = function (a) {
    if (a instanceof k.structs.Map)
        for (var b = a.getKeys(), c = 0; c < b.length; c++) this.set(b[c], a
            .get(b[c]));
    else
        for (b in a) this.set(b, a[b])
};
d.forEach = function (a, b) {
    for (var c = this.getKeys(), f = 0; f < c.length; f++) {
        var g = c[f],
            h = this.get(g);
        a.call(b, h, g, this)
    }
};
d.clone = function () {
    return new k.structs.Map(this)
};
d.transpose = function () {
    for (var a = new k.structs.Map, b = 0; b < this.keys_.length; b++) {
        var c = this.keys_[b];
        a.set(this.map_[c], c)
    }
    return a
};
d.toObject = function () {
    bb(this);
    for (var a = {}, b = 0; b < this.keys_.length; b++) {
        var c = this.keys_[b];
        a[c] = this.map_[c]
    }
    return a
};
d.__iterator__ = function (a) {
    bb(this);
    var b = 0,
        c = this.version_,
        f = this,
        g = new k.iter.Iterator;
    g.next = function () {
        if (c != f.version_) throw Error(
            "The map has changed since the iterator was created"
            );
        if (b >= f.keys_.length) throw k.iter.StopIteration;
        var h = f.keys_[b++];
        return a ? h : f.map_[h]
    };
    return g
};
k.structs.Map.hasKey_ = function (a, b) {
    return Object.prototype.hasOwnProperty.call(a, b)
};
k.structs.LinkedMap = function (a) {
    this.maxCount_ = a || null;
    this.cache_ = !0;
    this.evictionCallback_ = void 0;
    this.map_ = new k.structs.Map;
    this.head_ = new k.structs.LinkedMap.Node_("", void 0);
    this.head_.next = this.head_.prev = this.head_
};
var db = function (a, b) {
    (b = a.map_.get(b)) && a.cache_ && (b.remove(), cb(a, b));
    return b
};
d = k.structs.LinkedMap.prototype;
d.get = function (a, b) {
    return (a = db(this, a)) ? a.value : b
};
d.set = function (a, b) {
    var c = db(this, a);
    c ? c.value = b : (c = new k.structs.LinkedMap.Node_(a, b), this.map_
        .set(a, c), cb(this, c))
};
d.peek = function () {
    return this.head_.next.value
};
d.shift = function () {
    return eb(this, this.head_.next)
};
d.pop = function () {
    return eb(this, this.head_.prev)
};
d.remove = function (a) {
    return (a = this.map_.get(a)) ? (this.removeNode(a), !0) : !1
};
d.removeNode = function (a) {
    a.remove();
    this.map_.remove(a.key)
};
d.getCount = function () {
    return this.map_.getCount()
};
d.isEmpty = function () {
    return this.map_.isEmpty()
};
d.getKeys = function () {
    return this.map(function (a, b) {
        return b
    })
};
d.getValues = function () {
    return this.map(function (a) {
        return a
    })
};
d.contains = function (a) {
    return this.some(function (b) {
        return b == a
    })
};
d.containsKey = function (a) {
    return this.map_.containsKey(a)
};
d.clear = function () {
    gb(this, 0)
};
d.forEach = function (a, b) {
    for (var c = this.head_.next; c != this.head_; c = c.next) a.call(b, c
        .value, c.key, this)
};
d.map = function (a, b) {
    for (var c = [], f = this.head_.next; f != this.head_; f = f.next) c
        .push(a.call(b, f.value, f.key, this));
    return c
};
d.some = function (a, b) {
    for (var c = this.head_.next; c != this.head_; c = c.next)
        if (a.call(b, c.value, c.key, this)) return !0;
    return !1
};
d.every = function (a, b) {
    for (var c = this.head_.next; c != this.head_; c = c.next)
        if (!a.call(b, c.value, c.key, this)) return !1;
    return !0
};
var cb = function (a, b) {
        a.cache_ ? (b.next = a.head_.next, b.prev = a.head_, a.head_.next = b, b
            .next.prev = b) : (b.prev = a.head_.prev, b.next = a.head_, a
            .head_.prev = b, b.prev.next = b);
        null != a.maxCount_ && gb(a, a.maxCount_)
    },
    gb = function (a, b) {
        for (; a.getCount() > b;) {
            var c = a.cache_ ? a.head_.prev : a.head_.next;
            a.removeNode(c);
            a.evictionCallback_ && a.evictionCallback_(c.key, c.value)
        }
    },
    eb = function (a, b) {
        a.head_ != b && a.removeNode(b);
        return b.value
    };
k.structs.LinkedMap.Node_ = function (a, b) {
    this.key = a;
    this.value = b
};
k.structs.LinkedMap.Node_.prototype.remove = function () {
    this.prev.next = this.next;
    this.next.prev = this.prev;
    delete this.prev;
    delete this.next
};
var hb = function (a, b) {
    k.events.EventTarget.call(this);
    this.timeout_ = a || 36E5;
    this.cache_ = new k.structs.LinkedMap(b || 100)
};
e.inherits(hb, k.events.EventTarget);
hb.prototype.get = function (a) {
    return (a = this.cache_.get(a)) && Date.now() - a.timeStamp_ <= this
        .timeout_ ? a.licenses_ : null
};
hb.prototype.remove = function (a) {
    this.cache_.remove(a)
};
hb.Entry = function (a) {
    this.timeStamp_ = Date.now();
    this.licenses_ = a
};
da.LicensesCache = hb;
k.structs.getCount = function (a) {
    return a.getCount && "function" == typeof a.getCount ? a.getCount() : k
        .isArrayLike(a) || "string" === typeof a ? a.length : k.object
        .getCount(a)
};
k.structs.getValues = function (a) {
    if (a.getValues && "function" == typeof a.getValues) return a
    .getValues();
    if ("string" === typeof a) return a.split("");
    if (k.isArrayLike(a)) {
        for (var b = [], c = a.length, f = 0; f < c; f++) b.push(a[f]);
        return b
    }
    return k.object.getValues(a)
};
k.structs.getKeys = function (a) {
    if (a.getKeys && "function" == typeof a.getKeys) return a.getKeys();
    if (!a.getValues || "function" != typeof a.getValues) {
        if (k.isArrayLike(a) || "string" === typeof a) {
            var b = [];
            a = a.length;
            for (var c = 0; c < a; c++) b.push(c);
            return b
        }
        return k.object.getKeys(a)
    }
};
k.structs.contains = function (a, b) {
    return a.contains && "function" == typeof a.contains ? a.contains(b) : a
        .containsValue && "function" == typeof a.containsValue ? a
        .containsValue(b) : k.isArrayLike(a) || "string" === typeof a ? ua(
            a, b) : k.object.containsValue(a, b)
};
k.structs.isEmpty = function (a) {
    return a.isEmpty && "function" == typeof a.isEmpty ? a.isEmpty() : k
        .isArrayLike(a) || "string" === typeof a ? va(a) : k.object.isEmpty(
            a)
};
k.structs.clear = function (a) {
    a.clear && "function" == typeof a.clear ? a.clear() : k.isArrayLike(a) ?
        wa(a) : k.object.clear(a)
};
k.structs.forEach = function (a, b, c) {
    if (a.forEach && "function" == typeof a.forEach) a.forEach(b, c);
    else if (k.isArrayLike(a) || "string" === typeof a) n(a, b, c);
    else
        for (var f = k.structs.getKeys(a), g = k.structs.getValues(a), h = g
                .length, l = 0; l < h; l++) b.call(c, g[l], f && f[l], a)
};
k.structs.filter = function (a, b, c) {
    if ("function" == typeof a.filter) return a.filter(b, c);
    if (k.isArrayLike(a) || "string" === typeof a) return na(a, b, c);
    var f = k.structs.getKeys(a),
        g = k.structs.getValues(a),
        h = g.length;
    if (f) {
        var l = {};
        for (var r = 0; r < h; r++) b.call(c, g[r], f[r], a) && (l[f[r]] =
            g[r])
    } else
        for (l = [], r = 0; r < h; r++) b.call(c, g[r], void 0, a) && l
            .push(g[r]);
    return l
};
k.structs.map = function (a, b, c) {
    if ("function" == typeof a.map) return a.map(b, c);
    if (k.isArrayLike(a) || "string" === typeof a) return p(a, b, c);
    var f = k.structs.getKeys(a),
        g = k.structs.getValues(a),
        h = g.length;
    if (f) {
        var l = {};
        for (var r = 0; r < h; r++) l[f[r]] = b.call(c, g[r], f[r], a)
    } else
        for (l = [], r = 0; r < h; r++) l[r] = b.call(c, g[r], void 0, a);
    return l
};
k.structs.some = function (a, b, c) {
    if ("function" == typeof a.some) return a.some(b, c);
    if (k.isArrayLike(a) || "string" === typeof a) return pa(a, b, c);
    for (var f = k.structs.getKeys(a), g = k.structs.getValues(a), h = g
            .length, l = 0; l < h; l++)
        if (b.call(c, g[l], f && f[l], a)) return !0;
    return !1
};
k.structs.every = function (a, b, c) {
    if ("function" == typeof a.every) return a.every(b, c);
    if (k.isArrayLike(a) || "string" === typeof a) return qa(a, b, c);
    for (var f = k.structs.getKeys(a), g = k.structs.getValues(a), h = g
            .length, l = 0; l < h; l++)
        if (!b.call(c, g[l], f && f[l], a)) return !1;
    return !0
};
k.uri = {};
k.uri.utils = {};
k.uri.utils.CharCode_ = {
    AMPERSAND: 38,
    EQUAL: 61,
    HASH: 35,
    QUESTION: 63
};
k.uri.utils.buildFromEncodedParts = function (a, b, c, f, g, h, l) {
    var r = "";
    a && (r += a + ":");
    c && (r += "//", b && (r += b + "@"), r += c, f && (r += ":" + f));
    g && (r += g);
    h && (r += "?" + h);
    l && (r += "#" + l);
    return r
};
k.uri.utils.splitRe_ =
    /^(?:([^:/?#.]+):)?(?:\/\/(?:([^\\/?#]*)@)?([^\\/?#]*?)(?::([0-9]+))?(?=[\\/?#]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/;
k.uri.utils.ComponentIndex = {
    SCHEME: 1,
    USER_INFO: 2,
    DOMAIN: 3,
    PORT: 4,
    PATH: 5,
    QUERY_DATA: 6,
    FRAGMENT: 7
};
k.uri.utils.urlPackageSupportLoggingHandler_ = null;
k.uri.utils.setUrlPackageSupportLoggingHandler = function (a) {
    k.uri.utils.urlPackageSupportLoggingHandler_ = a
};
k.uri.utils.split = function (a) {
    var b = a.match(k.uri.utils.splitRe_);
    k.uri.utils.urlPackageSupportLoggingHandler_ && 0 <= ["http", "https",
            "ws", "wss", "ftp"
        ].indexOf(b[k.uri.utils.ComponentIndex.SCHEME]) && k.uri.utils
        .urlPackageSupportLoggingHandler_(a);
    return b
};
k.uri.utils.decodeIfPossible_ = function (a, b) {
    return a ? b ? decodeURI(a) : decodeURIComponent(a) : a
};
k.uri.utils.getComponentByIndex_ = function (a, b) {
    return k.uri.utils.split(b)[a] || null
};
k.uri.utils.getScheme = function (a) {
    return k.uri.utils.getComponentByIndex_(k.uri.utils.ComponentIndex
        .SCHEME, a)
};
k.uri.utils.getEffectiveScheme = function (a) {
    a = k.uri.utils.getScheme(a);
    !a && k.global.self && k.global.self.location && (a = k.global.self
        .location.protocol, a = a.substr(0, a.length - 1));
    return a ? a.toLowerCase() : ""
};
k.uri.utils.getUserInfoEncoded = function () {
    return k.uri.utils.getComponentByIndex_(k.uri.utils.ComponentIndex
        .USER_INFO, void 0)
};
k.uri.utils.getUserInfo = function () {
    return k.uri.utils.decodeIfPossible_(k.uri.utils.getUserInfoEncoded())
};
k.uri.utils.getDomainEncoded = function () {
    return k.uri.utils.getComponentByIndex_(k.uri.utils.ComponentIndex
        .DOMAIN, void 0)
};
k.uri.utils.getDomain = function () {
    return k.uri.utils.decodeIfPossible_(k.uri.utils.getDomainEncoded(), !0)
};
k.uri.utils.getPort = function () {
    return Number(k.uri.utils.getComponentByIndex_(k.uri.utils
        .ComponentIndex.PORT, void 0)) || null
};
k.uri.utils.getPathEncoded = function () {
    return k.uri.utils.getComponentByIndex_(k.uri.utils.ComponentIndex.PATH,
        void 0)
};
k.uri.utils.getPath = function () {
    return k.uri.utils.decodeIfPossible_(k.uri.utils.getPathEncoded(), !0)
};
k.uri.utils.getQueryData = function () {
    return k.uri.utils.getComponentByIndex_(k.uri.utils.ComponentIndex
        .QUERY_DATA, void 0)
};
k.uri.utils.getFragmentEncoded = function () {
    var a = (void 0).indexOf("#");
    return 0 > a ? null : (void 0).substr(a + 1)
};
k.uri.utils.setFragmentEncoded = function (a, b) {
    return k.uri.utils.removeFragment(a) + (b ? "#" + b : "")
};
k.uri.utils.getFragment = function () {
    return k.uri.utils.decodeIfPossible_(k.uri.utils.getFragmentEncoded())
};
k.uri.utils.getHost = function (a) {
    a = k.uri.utils.split(a);
    return k.uri.utils.buildFromEncodedParts(a[k.uri.utils.ComponentIndex
        .SCHEME], a[k.uri.utils.ComponentIndex.USER_INFO], a[k.uri
        .utils.ComponentIndex.DOMAIN], a[k.uri.utils.ComponentIndex
        .PORT])
};
k.uri.utils.getOrigin = function (a) {
    a = k.uri.utils.split(a);
    return k.uri.utils.buildFromEncodedParts(a[k.uri.utils.ComponentIndex
        .SCHEME], null, a[k.uri.utils.ComponentIndex.DOMAIN], a[k
        .uri.utils.ComponentIndex.PORT])
};
k.uri.utils.getPathAndAfter = function (a) {
    a = k.uri.utils.split(a);
    return k.uri.utils.buildFromEncodedParts(null, null, null, null, a[k.uri
        .utils.ComponentIndex.PATH], a[k.uri.utils.ComponentIndex
        .QUERY_DATA], a[k.uri.utils.ComponentIndex.FRAGMENT])
};
k.uri.utils.removeFragment = function (a) {
    var b = a.indexOf("#");
    return 0 > b ? a : a.substr(0, b)
};
k.uri.utils.haveSameDomain = function (a, b) {
    a = k.uri.utils.split(a);
    b = k.uri.utils.split(b);
    return a[k.uri.utils.ComponentIndex.DOMAIN] == b[k.uri.utils
            .ComponentIndex.DOMAIN] && a[k.uri.utils.ComponentIndex
        .SCHEME] == b[k.uri.utils.ComponentIndex.SCHEME] && a[k.uri.utils
            .ComponentIndex.PORT] == b[k.uri.utils.ComponentIndex.PORT]
};
k.uri.utils.assertNoFragmentsOrQueries_ = function (a) {
    k.asserts.assert(0 > a.indexOf("#") && 0 > a.indexOf("?"),
        "goog.uri.utils: Fragment or query identifiers are not supported: [%s]",
        a)
};
k.uri.utils.parseQueryData = function (a, b) {
    if (a) {
        a = a.split("&");
        for (var c = 0; c < a.length; c++) {
            var f = a[c].indexOf("="),
                g = null;
            if (0 <= f) {
                var h = a[c].substring(0, f);
                g = a[c].substring(f + 1)
            } else h = a[c];
            b(h, g ? k.string.urlDecode(g) : "")
        }
    }
};
k.uri.utils.splitQueryData_ = function (a) {
    var b = a.indexOf("#");
    0 > b && (b = a.length);
    var c = a.indexOf("?");
    if (0 > c || c > b) {
        c = b;
        var f = ""
    } else f = a.substring(c + 1, b);
    return [a.substr(0, c), f, a.substr(b)]
};
k.uri.utils.joinQueryData_ = function (a) {
    return a[0] + (a[1] ? "?" + a[1] : "") + a[2]
};
k.uri.utils.appendQueryData_ = function (a, b) {
    return b ? a ? a + "&" + b : b : a
};
k.uri.utils.appendQueryDataToUri_ = function (a, b) {
    if (!b) return a;
    a = k.uri.utils.splitQueryData_(a);
    a[1] = k.uri.utils.appendQueryData_(a[1], b);
    return k.uri.utils.joinQueryData_(a)
};
k.uri.utils.appendKeyValuePairs_ = function (a, b, c) {
    k.asserts.assertString(a);
    if (Array.isArray(b)) {
        k.asserts.assertArray(b);
        for (var f = 0; f < b.length; f++) k.uri.utils.appendKeyValuePairs_(
            a, String(b[f]), c)
    } else null != b && c.push(a + ("" === b ? "" : "=" + k.string
        .urlEncode(b)))
};
k.uri.utils.buildQueryData = function (a, b) {
    k.asserts.assert(0 == Math.max(a.length - (b || 0), 0) % 2,
        "goog.uri.utils: Key/value lists must be even in length.");
    var c = [];
    for (b = b || 0; b < a.length; b += 2) k.uri.utils.appendKeyValuePairs_(
        a[b], a[b + 1], c);
    return c.join("&")
};
k.uri.utils.buildQueryDataFromMap = function (a) {
    var b = [],
        c;
    for (c in a) k.uri.utils.appendKeyValuePairs_(c, a[c], b);
    return b.join("&")
};
k.uri.utils.appendParams = function (a, b) {
    var c = 2 == arguments.length ? k.uri.utils.buildQueryData(arguments[1],
        0) : k.uri.utils.buildQueryData(arguments, 1);
    return k.uri.utils.appendQueryDataToUri_(a, c)
};
k.uri.utils.appendParamsFromMap = function (a, b) {
    b = k.uri.utils.buildQueryDataFromMap(b);
    return k.uri.utils.appendQueryDataToUri_(a, b)
};
k.uri.utils.appendParam = function (a, b, c) {
    c = null != c ? "=" + k.string.urlEncode(c) : "";
    return k.uri.utils.appendQueryDataToUri_(a, b + c)
};
k.uri.utils.findParam_ = function (a, b, c, f) {
    for (var g = c.length; 0 <= (b = a.indexOf(c, b)) && b < f;) {
        var h = a.charCodeAt(b - 1);
        if (h == k.uri.utils.CharCode_.AMPERSAND || h == k.uri.utils
            .CharCode_.QUESTION)
            if (h = a.charCodeAt(b + g), !h || h == k.uri.utils.CharCode_
                .EQUAL || h == k.uri.utils.CharCode_.AMPERSAND || h == k.uri
                .utils.CharCode_.HASH) return b;
        b += g + 1
    }
    return -1
};
k.uri.utils.hashOrEndRe_ = /#|$/;
k.uri.utils.hasParam = function (a, b) {
    return 0 <= k.uri.utils.findParam_(a, 0, b, a.search(k.uri.utils
        .hashOrEndRe_))
};
k.uri.utils.getParamValue = function (a, b) {
    var c = a.search(k.uri.utils.hashOrEndRe_),
        f = k.uri.utils.findParam_(a, 0, b, c);
    if (0 > f) return null;
    var g = a.indexOf("&", f);
    if (0 > g || g > c) g = c;
    f += b.length + 1;
    return k.string.urlDecode(a.substr(f, g - f))
};
k.uri.utils.getParamValues = function (a, b) {
    for (var c = a.search(k.uri.utils.hashOrEndRe_), f = 0, g, h = []; 0 <=
        (g = k.uri.utils.findParam_(a, f, b, c));) {
        f = a.indexOf("&", g);
        if (0 > f || f > c) f = c;
        g += b.length + 1;
        h.push(k.string.urlDecode(a.substr(g, f - g)))
    }
    return h
};
k.uri.utils.trailingQueryPunctuationRe_ = /[?&]($|#)/;
k.uri.utils.removeParam = function (a, b) {
    for (var c = a.search(k.uri.utils.hashOrEndRe_), f = 0, g, h = []; 0 <=
        (g = k.uri.utils.findParam_(a, f, b, c));) h.push(a.substring(f,
        g)), f = Math.min(a.indexOf("&", g) + 1 || c, c);
    h.push(a.substr(f));
    return h.join("").replace(k.uri.utils.trailingQueryPunctuationRe_, "$1")
};
k.uri.utils.setParam = function (a) {
    var b = k.uri.utils.StandardQueryParam.RANDOM,
        c = k.string.getRandomString();
    return k.uri.utils.appendParam(k.uri.utils.removeParam(a, b), b, c)
};
k.uri.utils.setParamsFromMap = function (a, b) {
    a = k.uri.utils.splitQueryData_(a);
    var c = a[1],
        f = [];
    c && c.split("&").forEach(function (g) {
        var h = g.indexOf("=");
        b.hasOwnProperty(0 <= h ? g.substr(0, h) : g) || f.push(g)
    });
    a[1] = k.uri.utils.appendQueryData_(f.join("&"), k.uri.utils
        .buildQueryDataFromMap(b));
    return k.uri.utils.joinQueryData_(a)
};
k.uri.utils.appendPath = function (a, b) {
    k.uri.utils.assertNoFragmentsOrQueries_(a);
    k.string.endsWith(a, "/") && (a = a.substr(0, a.length - 1));
    k.string.startsWith(b, "/") && (b = b.substr(1));
    return "" + a + "/" + b
};
k.uri.utils.setPath = function (a, b) {
    k.string.startsWith(b, "/");
    k.uri.utils.split(a)
};
k.uri.utils.StandardQueryParam = {
    RANDOM: "zx"
};
k.uri.utils.makeUnique = function (a) {
    return k.uri.utils.setParam(a)
};
k.Uri = function (a, b) {
    this.domain_ = this.userInfo_ = this.scheme_ = "";
    this.port_ = null;
    this.fragment_ = this.path_ = "";
    this.ignoreCase_ = this.isReadOnly_ = !1;
    var c;
    a instanceof k.Uri ? (this.ignoreCase_ = void 0 !== b ? b : a
        .ignoreCase_, ib(this, a.getScheme()), jb(this, a
    .getUserInfo()), kb(this, a.getDomain()), lb(this, a.getPort()),
        this.setPath(a.getPath()), mb(this, a.getQueryData().clone()),
        nb(this, a.getFragment())) : a && (c = k.uri.utils.split(String(
        a))) ? (this.ignoreCase_ = !!b, ib(this, c[k.uri.utils
                .ComponentIndex.SCHEME] || "",
            !0), jb(this, c[k.uri.utils.ComponentIndex.USER_INFO] || "",
            !0), kb(this, c[k.uri.utils.ComponentIndex.DOMAIN] || "", !
            0), lb(this, c[k.uri.utils.ComponentIndex.PORT]), this
        .setPath(c[k.uri.utils.ComponentIndex.PATH] || "", !0), mb(this,
            c[k.uri.utils.ComponentIndex.QUERY_DATA] || "", !0), nb(
            this, c[k.uri.utils.ComponentIndex.FRAGMENT] || "", !0)) : (
        this.ignoreCase_ = !!b, this.queryData_ = new k.Uri.QueryData(
            null, this.ignoreCase_))
};
k.Uri.RANDOM_PARAM = k.uri.utils.StandardQueryParam.RANDOM;
k.Uri.prototype.toString = function () {
    var a = [],
        b = this.getScheme();
    b && a.push(k.Uri.encodeSpecialChars_(b, k.Uri
        .reDisallowedInSchemeOrUserInfo_, !0), ":");
    var c = this.getDomain();
    if (c || "file" == b) a.push("//"), (b = this.getUserInfo()) && a.push(k
            .Uri.encodeSpecialChars_(b, k.Uri
                .reDisallowedInSchemeOrUserInfo_, !0), "@"), a.push(k.Uri
            .removeDoubleEncoding_(k.string.urlEncode(c))), c = this
        .getPort(), null != c && a.push(":", String(c));
    if (c = this.getPath()) this.domain_ && "/" != c.charAt(0) && a.push(
        "/"), a.push(k.Uri.encodeSpecialChars_(c,
        "/" == c.charAt(0) ? k.Uri.reDisallowedInAbsolutePath_ : k
        .Uri.reDisallowedInRelativePath_, !0));
    (c = this.queryData_.toString()) && a.push("?", c);
    (c = this.getFragment()) && a.push("#", k.Uri.encodeSpecialChars_(c, k
        .Uri.reDisallowedInFragment_));
    return a.join("")
};
k.Uri.prototype.resolve = function (a) {
    var b = this.clone(),
        c = !!a.scheme_;
    c ? ib(b, a.getScheme()) : c = !!a.userInfo_;
    c ? jb(b, a.getUserInfo()) : c = !!a.domain_;
    c ? kb(b, a.getDomain()) : c = null != a.port_;
    var f = a.getPath();
    if (c) lb(b, a.getPort());
    else if (c = !!a.path_) {
        if ("/" != f.charAt(0))
            if (this.domain_ && !this.path_) f = "/" + f;
            else {
                var g = b.getPath().lastIndexOf("/"); - 1 != g && (f = b
                    .getPath().substr(0, g + 1) + f)
            } f = k.Uri.removeDotSegments(f)
    }
    c ? b.setPath(f) : c = "" !== a.queryData_.toString();
    c ? mb(b, a.getQueryData().clone()) : c = !!a.fragment_;
    c && nb(b, a.getFragment());
    return b
};
k.Uri.prototype.clone = function () {
    return new k.Uri(this)
};
k.Uri.prototype.getScheme = function () {
    return this.scheme_
};
var ib = function (a, b, c) {
    u(a);
    a.scheme_ = c ? k.Uri.decodeOrEmpty_(b, !0) : b;
    a.scheme_ && (a.scheme_ = a.scheme_.replace(/:$/, ""))
};
k.Uri.prototype.getUserInfo = function () {
    return this.userInfo_
};
var jb = function (a, b, c) {
    u(a);
    a.userInfo_ = c ? k.Uri.decodeOrEmpty_(b) : b
};
k.Uri.prototype.getDomain = function () {
    return this.domain_
};
var kb = function (a, b, c) {
    u(a);
    a.domain_ = c ? k.Uri.decodeOrEmpty_(b, !0) : b
};
k.Uri.prototype.getPort = function () {
    return this.port_
};
var lb = function (a, b) {
    u(a);
    if (b) {
        b = Number(b);
        if (isNaN(b) || 0 > b) throw Error("Bad port number " + b);
        a.port_ = b
    } else a.port_ = null
};
k.Uri.prototype.getPath = function () {
    return this.path_
};
k.Uri.prototype.setPath = function (a, b) {
    u(this);
    this.path_ = b ? k.Uri.decodeOrEmpty_(a, !0) : a
};
var mb = function (a, b, c) {
    u(a);
    b instanceof k.Uri.QueryData ? (a.queryData_ = b, a.queryData_
        .setIgnoreCase(a.ignoreCase_)) : (c || (b = k.Uri
            .encodeSpecialChars_(b, k.Uri.reDisallowedInQuery_)), a
        .queryData_ = new k.Uri.QueryData(b, a.ignoreCase_))
};
k.Uri.prototype.getQueryData = function () {
    return this.queryData_
};
k.Uri.prototype.getQuery = function () {
    return this.queryData_.toString()
};
k.Uri.prototype.getFragment = function () {
    return this.fragment_
};
var nb = function (a, b, c) {
    u(a);
    a.fragment_ = c ? k.Uri.decodeOrEmpty_(b) : b
};
k.Uri.prototype.makeUnique = function () {
    u(this);
    var a = k.Uri.RANDOM_PARAM,
        b = k.string.getRandomString();
    u(this);
    this.queryData_.set(a, b);
    return this
};
k.Uri.prototype.removeParameter = function (a) {
    u(this);
    this.queryData_.remove(a);
    return this
};
var u = function (a) {
    if (a.isReadOnly_) throw Error("Tried to modify a read-only Uri");
};
k.Uri.prototype.setIgnoreCase = function (a) {
    this.ignoreCase_ = a;
    this.queryData_ && this.queryData_.setIgnoreCase(a)
};
k.Uri.parse = function (a, b) {
    return a instanceof k.Uri ? a.clone() : new k.Uri(a, b)
};
k.Uri.create = function (a, b, c, f, g, h, l, r) {
    r = new k.Uri(null, r);
    a && ib(r, a);
    b && jb(r, b);
    c && kb(r, c);
    f && lb(r, f);
    g && r.setPath(g);
    h && mb(r, h);
    l && nb(r, l);
    return r
};
k.Uri.resolve = function (a, b) {
    a instanceof k.Uri || (a = k.Uri.parse(a));
    b instanceof k.Uri || (b = k.Uri.parse(b));
    return a.resolve(b)
};
k.Uri.removeDotSegments = function (a) {
    if (".." == a || "." == a) return "";
    if (k.string.contains(a, "./") || k.string.contains(a, "/.")) {
        var b = k.string.startsWith(a, "/");
        a = a.split("/");
        for (var c = [], f = 0; f < a.length;) {
            var g = a[f++];
            "." == g ? b && f == a.length && c.push("") : ".." == g ? ((1 <
                    c.length || 1 == c.length && "" != c[0]) && c.pop(),
                b && f == a.length && c.push("")) : (c.push(g), b = !0)
        }
        return c.join("/")
    }
    return a
};
k.Uri.decodeOrEmpty_ = function (a, b) {
    return a ? b ? decodeURI(a.replace(/%25/g, "%2525")) :
        decodeURIComponent(a) : ""
};
k.Uri.encodeSpecialChars_ = function (a, b, c) {
    return "string" === typeof a ? (a = encodeURI(a).replace(b, k.Uri
            .encodeChar_), c && (a = k.Uri.removeDoubleEncoding_(a)), a) :
        null
};
k.Uri.encodeChar_ = function (a) {
    a = a.charCodeAt(0);
    return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
};
k.Uri.removeDoubleEncoding_ = function (a) {
    return a.replace(/%25([0-9a-fA-F]{2})/g, "%$1")
};
k.Uri.reDisallowedInSchemeOrUserInfo_ = /[#\/\?@]/g;
k.Uri.reDisallowedInRelativePath_ = /[#\?:]/g;
k.Uri.reDisallowedInAbsolutePath_ = /[#\?]/g;
k.Uri.reDisallowedInQuery_ = /[#\?@]/g;
k.Uri.reDisallowedInFragment_ = /#/g;
k.Uri.haveSameDomain = function (a, b) {
    a = k.uri.utils.split(a);
    b = k.uri.utils.split(b);
    return a[k.uri.utils.ComponentIndex.DOMAIN] == b[k.uri.utils
            .ComponentIndex.DOMAIN] && a[k.uri.utils.ComponentIndex.PORT] ==
        b[k.uri.utils.ComponentIndex.PORT]
};
k.Uri.QueryData = function (a, b) {
    this.count_ = this.keyMap_ = null;
    this.encodedQuery_ = a || null;
    this.ignoreCase_ = !!b
};
var w = function (a) {
    a.keyMap_ || (a.keyMap_ = new k.structs.Map, a.count_ = 0, a
        .encodedQuery_ && k.uri.utils.parseQueryData(a.encodedQuery_,
            function (b, c) {
                a.add(k.string.urlDecode(b), c)
            }))
};
k.Uri.QueryData.createFromMap = function (a, b) {
    var c = k.structs.getKeys(a);
    if ("undefined" == typeof c) throw Error("Keys are undefined");
    b = new k.Uri.QueryData(null, b);
    a = k.structs.getValues(a);
    for (var f = 0; f < c.length; f++) {
        var g = c[f],
            h = a[f];
        Array.isArray(h) ? ob(b, g, h) : b.add(g, h)
    }
    return b
};
k.Uri.QueryData.createFromKeysValues = function (a, b, c) {
    if (a.length != b.length) throw Error(
        "Mismatched lengths for keys/values");
    c = new k.Uri.QueryData(null, c);
    for (var f = 0; f < a.length; f++) c.add(a[f], b[f]);
    return c
};
d = k.Uri.QueryData.prototype;
d.getCount = function () {
    w(this);
    return this.count_
};
d.add = function (a, b) {
    w(this);
    this.encodedQuery_ = null;
    a = pb(this, a);
    var c = this.keyMap_.get(a);
    c || this.keyMap_.set(a, c = []);
    c.push(b);
    this.count_ = k.asserts.assertNumber(this.count_) + 1;
    return this
};
d.remove = function (a) {
    w(this);
    a = pb(this, a);
    return this.keyMap_.containsKey(a) ? (this.encodedQuery_ = null, this
        .count_ = k.asserts.assertNumber(this.count_) - this.keyMap_
        .get(a).length, this.keyMap_.remove(a)) : !1
};
d.clear = function () {
    this.keyMap_ = this.encodedQuery_ = null;
    this.count_ = 0
};
d.isEmpty = function () {
    w(this);
    return 0 == this.count_
};
d.containsKey = function (a) {
    w(this);
    a = pb(this, a);
    return this.keyMap_.containsKey(a)
};
d.containsValue = function (a) {
    var b = this.getValues();
    return ua(b, a)
};
d.forEach = function (a, b) {
    w(this);
    this.keyMap_.forEach(function (c, f) {
        n(c, function (g) {
            a.call(b, g, f, this)
        }, this)
    }, this)
};
d.getKeys = function () {
    w(this);
    for (var a = this.keyMap_.getValues(), b = this.keyMap_.getKeys(),
        c = [], f = 0; f < b.length; f++)
        for (var g = a[f], h = 0; h < g.length; h++) c.push(b[f]);
    return c
};
d.getValues = function (a) {
    w(this);
    var b = [];
    if ("string" === typeof a) this.containsKey(a) && (b = Ca(b, this
        .keyMap_.get(pb(this, a))));
    else {
        a = this.keyMap_.getValues();
        for (var c = 0; c < a.length; c++) b = Ca(b, a[c])
    }
    return b
};
d.set = function (a, b) {
    w(this);
    this.encodedQuery_ = null;
    a = pb(this, a);
    this.containsKey(a) && (this.count_ = k.asserts.assertNumber(this
        .count_) - this.keyMap_.get(a).length);
    this.keyMap_.set(a, [b]);
    this.count_ = k.asserts.assertNumber(this.count_) + 1;
    return this
};
d.get = function (a, b) {
    if (!a) return b;
    a = this.getValues(a);
    return 0 < a.length ? String(a[0]) : b
};
var ob = function (a, b, c) {
    a.remove(b);
    0 < c.length && (a.encodedQuery_ = null, a.keyMap_.set(pb(a, b), Da(c)),
        a.count_ = k.asserts.assertNumber(a.count_) + c.length)
};
k.Uri.QueryData.prototype.toString = function () {
    if (this.encodedQuery_) return this.encodedQuery_;
    if (!this.keyMap_) return "";
    for (var a = [], b = this.keyMap_.getKeys(), c = 0; c < b.length; c++) {
        var f = b[c],
            g = k.string.urlEncode(f);
        f = this.getValues(f);
        for (var h = 0; h < f.length; h++) {
            var l = g;
            "" !== f[h] && (l += "=" + k.string.urlEncode(f[h]));
            a.push(l)
        }
    }
    return this.encodedQuery_ = a.join("&")
};
k.Uri.QueryData.prototype.clone = function () {
    var a = new k.Uri.QueryData;
    a.encodedQuery_ = this.encodedQuery_;
    this.keyMap_ && (a.keyMap_ = this.keyMap_.clone(), a.count_ = this
        .count_);
    return a
};
var pb = function (a, b) {
    b = String(b);
    a.ignoreCase_ && (b = b.toLowerCase());
    return b
};
k.Uri.QueryData.prototype.setIgnoreCase = function (a) {
    a && !this.ignoreCase_ && (w(this), this.encodedQuery_ = null, this
        .keyMap_.forEach(function (b, c) {
            var f = c.toLowerCase();
            c != f && (this.remove(c), ob(this, f, b))
        }, this));
    this.ignoreCase_ = a
};
k.Uri.QueryData.prototype.extend = function (a) {
    for (var b = 0; b < arguments.length; b++) k.structs.forEach(arguments[
        b], function (c, f) {
        this.add(f, c)
    }, this)
};
var qb = function (a) {
        this.baseUrl_ = a || qb.Environment.SANDBOX;
        this.baseUrlAndPath_ = this.baseUrl_ + qb.WEB_STORE_REQUEST_PATH_
    },
    rb = function (a, b, c, f, g, h, l, r, v, E, H, ia) {
        var xa = c ? c : "",
            fb = r || "application/x-www-form-urlencoded",
            Jb = H || null,
            tc = ia || null,
            uc = function (ba, T) {
                if (T && 200 == ba) {
                    ba = null;
                    try {
                        ba = JSON.parse(T)
                    } catch (vd) {
                        h(ea.INVALID_RESPONSE_ERROR);
                        return
                    }
                    Jb && tc && (console.log(
                            "Updating the licenses cache for appId: " + Jb),
                        tc.cache_.set(Jb, new hb.Entry(ba)));
                    g(ba)
                } else h(ea.INVALID_RESPONSE_ERROR)
            };
        H = function (ba) {
            if (ba) {
                var T =
                    new XMLHttpRequest;
                T.open(f, b);
                T.setRequestHeader("Authorization", "Bearer " + ba);
                T.setRequestHeader("Content-Type", fb);
                T.onreadystatechange = function () {
                    4 == T.readyState && (401 == T.status && ba ? chrome
                        .identity.removeCachedAuthToken({
                            token: ba
                        }, function () {
                            l ? rb(a, f, c, f, g, h, !1, r, v,
                                E) : (console.log(T), uc(T
                                    .status, T.responseText
                                    ))
                        }) : (console.log(T), uc(T.status, T
                            .responseText)))
                };
                T.send(xa)
            } else h(ea.TOKEN_MISSING_ERROR)
        };
        E ? H(E) : chrome.identity.getAuthToken({
            interactive: v || !1
        }, H)
    },
    sb = function (a, b) {
        b = b.parameters || {};
        if ("env" in b) {
            switch (b.env) {
                case "prod":
                    a.baseUrl_ = qb.Environment.PROD;
                    break;
                default:
                    a.baseUrl_ = qb.Environment.SANDBOX
            }
            a.baseUrlAndPath_ = a.baseUrl_ + qb.WEB_STORE_REQUEST_PATH_
        }
    };
qb.prototype.onFailure_ = function (a, b, c) {
    a(fa(c || b))
};
var tb = function (a, b, c, f, g, h) {
        var l = new k.Uri.QueryData;
        l.add("projection", g.projection ? g.projection : "THIN");
        var r = new k.Uri(a.baseUrlAndPath_ + "/items/" + b + "/payments");
        mb(r, l);
        f = k.bind(a.onFailure_, a, f, ea.GET_PURCHASES_ERROR);
        console.log(
            "Making a request to apiary to retrieve licenses for appId: " +
            b);
        rb(a, r.toString(), null, "GET", c, f, !0, void 0, g.interactive,
            void 0, b, h)
    },
    ub = function (a, b, c, f, g, h) {
        b = a.baseUrlAndPath_ + "/items/" + b + "/skus/" + c;
        g = k.bind(a.onFailure_, a, g, ea.CONSUME_PURCHASE_ERROR);
        console.log("Sending consume call to apiary.");
        rb(a, b, null, "DELETE", f, g, !0, void 0, h)
    },
    vb = function (a, b, c, f, g, h) {
        var l = new k.Uri.QueryData;
        l.add("hl", h.hl ? h.hl : window.navigator.language);
        h.gl && l.add("gl", h.gl);
        l.add("projection", h.projection ? h.projection : "THIN");
        b = a.baseUrlAndPath_ + "/items/" + b + "/skus";
        g && (b = b + "/" + g);
        g = new k.Uri(b);
        mb(g, l);
        f = k.bind(a.onFailure_, a, f, ea.GET_SKU_DETAILS_ERROR);
        rb(a, g.toString(), null, "GET", c, f, !0, void 0, h.interactive)
    };
qb.Environment = {
    PROD: "https://www.googleapis.com",
    SANDBOX: "https://www-googleapis-staging.sandbox.google.com"
};
qb.WEB_STORE_REQUEST_PATH_ = "/chromewebstore/v1.1";
da.WebStoreService = qb;
var x = {
    ConstBinaryMessage: function () {}
};
x.BinaryMessage = function () {};
x.ScalarFieldType = void 0;
x.RepeatedFieldType = void 0;
x.AnyFieldType = void 0;
x.BinaryConstants = {};
var y = {
        INVALID: -1,
        DOUBLE: 1,
        FLOAT: 2,
        INT64: 3,
        UINT64: 4,
        INT32: 5,
        FIXED64: 6,
        FIXED32: 7,
        BOOL: 8,
        STRING: 9,
        GROUP: 10,
        MESSAGE: 11,
        BYTES: 12,
        UINT32: 13,
        ENUM: 14,
        SFIXED32: 15,
        SFIXED64: 16,
        SINT32: 17,
        SINT64: 18
    },
    z = {
        INVALID: -1,
        VARINT: 0,
        FIXED64: 1,
        DELIMITED: 2,
        START_GROUP: 3,
        END_GROUP: 4,
        FIXED32: 5
    };
x.BinaryConstants.FieldType = y;
x.BinaryConstants.FieldTypeToWireType = function (a) {
    switch (a) {
        case y.INT32:
        case y.INT64:
        case y.UINT32:
        case y.UINT64:
        case y.SINT32:
        case y.SINT64:
        case y.BOOL:
        case y.ENUM:
            return z.VARINT;
        case y.DOUBLE:
        case y.FIXED64:
        case y.SFIXED64:
            return z.FIXED64;
        case y.STRING:
        case y.MESSAGE:
        case y.BYTES:
            return z.DELIMITED;
        case y.FLOAT:
        case y.FIXED32:
        case y.SFIXED32:
            return z.FIXED32;
        default:
            return z.INVALID
    }
};
x.BinaryConstants.FLOAT32_EPS = 1.401298464324817E-45;
x.BinaryConstants.FLOAT32_MIN = 1.1754943508222875E-38;
x.BinaryConstants.FLOAT32_MAX = 3.4028234663852886E38;
x.BinaryConstants.FLOAT64_EPS = 4.9E-324;
x.BinaryConstants.FLOAT64_MIN = 2.2250738585072014E-308;
x.BinaryConstants.FLOAT64_MAX = 1.7976931348623157E308;
x.BinaryConstants.INVALID_FIELD_NUMBER = -1;
x.BinaryConstants.TWO_TO_20 = 1048576;
x.BinaryConstants.TWO_TO_23 = 8388608;
x.BinaryConstants.TWO_TO_31 = 2147483648;
x.BinaryConstants.TWO_TO_32 = 4294967296;
x.BinaryConstants.TWO_TO_52 = 4503599627370496;
x.BinaryConstants.TWO_TO_63 = 0x7fffffffffffffff;
x.BinaryConstants.TWO_TO_64 = 1.8446744073709552E19;
x.BinaryConstants.WireType = z;
x.BinaryConstants.ZERO_HASH = "\x00\x00\x00\x00\x00\x00\x00\x00";
x.ByteSource = void 0;
k.crypt = {};
k.crypt.stringToByteArray = function (a) {
    for (var b = [], c = 0, f = 0; f < a.length; f++) {
        var g = a.charCodeAt(f);
        255 < g && (b[c++] = g & 255, g >>= 8);
        b[c++] = g
    }
    return b
};
k.crypt.byteArrayToString = function (a) {
    if (8192 >= a.length) return String.fromCharCode.apply(null, a);
    for (var b = "", c = 0; c < a.length; c += 8192) {
        var f = Ea(a, c, c + 8192);
        b += String.fromCharCode.apply(null, f)
    }
    return b
};
k.crypt.byteArrayToHex = function (a, b) {
    return p(a, function (c) {
        c = c.toString(16);
        return 1 < c.length ? c : "0" + c
    }).join(b || "")
};
k.crypt.hexToByteArray = function (a) {
    k.asserts.assert(0 == a.length % 2,
        "Key string length must be multiple of 2");
    for (var b = [], c = 0; c < a.length; c += 2) b.push(parseInt(a
        .substring(c, c + 2), 16));
    return b
};
k.crypt.stringToUtf8ByteArray = function (a) {
    for (var b = [], c = 0, f = 0; f < a.length; f++) {
        var g = a.charCodeAt(f);
        128 > g ? b[c++] = g : (2048 > g ? b[c++] = g >> 6 | 192 : (55296 ==
            (g & 64512) && f + 1 < a.length && 56320 == (a
                .charCodeAt(f + 1) & 64512) ? (g = 65536 + ((g &
                    1023) << 10) + (a.charCodeAt(++f) & 1023), b[
                    c++] = g >> 18 | 240, b[c++] = g >> 12 & 63 |
                128) : b[c++] = g >> 12 | 224, b[c++] = g >> 6 &
            63 | 128), b[c++] = g & 63 | 128)
    }
    return b
};
k.crypt.utf8ByteArrayToString = function (a) {
    for (var b = [], c = 0, f = 0; c < a.length;) {
        var g = a[c++];
        if (128 > g) b[f++] = String.fromCharCode(g);
        else if (191 < g && 224 > g) {
            var h = a[c++];
            b[f++] = String.fromCharCode((g & 31) << 6 | h & 63)
        } else if (239 < g && 365 > g) {
            h = a[c++];
            var l = a[c++],
                r = a[c++];
            g = ((g & 7) << 18 | (h & 63) << 12 | (l & 63) << 6 | r & 63) -
                65536;
            b[f++] = String.fromCharCode(55296 + (g >> 10));
            b[f++] = String.fromCharCode(56320 + (g & 1023))
        } else h = a[c++], l = a[c++], b[f++] = String.fromCharCode((g &
            15) << 12 | (h & 63) << 6 | l & 63)
    }
    return b.join("")
};
k.crypt.xorByteArray = function (a, b) {
    k.asserts.assert(a.length == b.length, "XOR array lengths must match");
    for (var c = [], f = 0; f < a.length; f++) c.push(a[f] ^ b[f]);
    return c
};
x.utils = {};
var A = 0,
    B = 0;

function wb(a) {
    var b = a >>> 0;
    a = Math.floor((a - b) / 4294967296) >>> 0;
    A = b;
    B = a
}

function xb(a) {
    var b = 0 > a;
    a = Math.abs(a);
    var c = a >>> 0;
    a = Math.floor((a - c) / 4294967296);
    a >>>= 0;
    b && (a = ~a >>> 0, c = (~c >>> 0) + 1, 4294967295 < c && (c = 0, a++,
        4294967295 < a && (a = 0)));
    A = c;
    B = a
}

function yb(a) {
    var b = 0 > a ? 1 : 0;
    a = b ? -a : a;
    if (0 === a) B = 0 < 1 / a ? 0 : 2147483648, A = 0;
    else if (isNaN(a)) B = 2147483647, A = 4294967295;
    else if (1.7976931348623157E308 < a) B = (b << 31 | 2146435072) >>> 0, A =
    0;
    else if (2.2250738585072014E-308 > a) a /= Math.pow(2, -1074), B = (b <<
        31 | a / 4294967296) >>> 0, A = a >>> 0;
    else {
        var c = a,
            f = 0;
        if (2 <= c)
            for (; 2 <= c && 1023 > f;) f++, c /= 2;
        else
            for (; 1 > c && -1022 < f;) c *= 2, f--;
        a *= Math.pow(2, -f);
        B = (b << 31 | f + 1023 << 20 | 1048576 * a & 1048575) >>> 0;
        A = 4503599627370496 * a >>> 0
    }
}

function zb(a) {
    var b = a.charCodeAt(4),
        c = a.charCodeAt(5),
        f = a.charCodeAt(6),
        g = a.charCodeAt(7);
    A = a.charCodeAt(0) + (a.charCodeAt(1) << 8) + (a.charCodeAt(2) << 16) + (a
        .charCodeAt(3) << 24) >>> 0;
    B = b + (c << 8) + (f << 16) + (g << 24) >>> 0
}

function Ab(a, b) {
    return 4294967296 * b + (a >>> 0)
}

function Bb(a, b) {
    var c = b & 2147483648;
    c && (a = ~a + 1 >>> 0, b = ~b >>> 0, 0 == a && (b = b + 1 >>> 0));
    a = Ab(a, b);
    return c ? -a : a
}

function Cb(a, b, c) {
    var f = -(a & 1);
    return c((a >>> 1 | b << 31) ^ f, b >>> 1 ^ f)
}

function Db(a, b) {
    var c = 2 * (b >> 31) + 1,
        f = b >>> 20 & 2047;
    a = 4294967296 * (b & 1048575) + a;
    return 2047 == f ? a ? NaN : Infinity * c : 0 == f ? c * Math.pow(2, -
        1074) * a : c * Math.pow(2, f - 1075) * (a + 4503599627370496)
}

function Eb(a, b) {
    return String.fromCharCode(a >>> 0 & 255, a >>> 8 & 255, a >>> 16 & 255,
        a >>> 24 & 255, b >>> 0 & 255, b >>> 8 & 255, b >>> 16 & 255, b >>>
        24 & 255)
}

function Fb(a, b) {
    function c(g, h) {
        g = g ? String(g) : "";
        return h ? "0000000".slice(g.length) + g : g
    }
    if (2097151 >= b) return "" + (4294967296 * b + a);
    var f = (a >>> 24 | b << 8) >>> 0 & 16777215;
    b = b >> 16 & 65535;
    a = (a & 16777215) + 6777216 * f + 6710656 * b;
    f += 8147497 * b;
    b *= 2;
    1E7 <= a && (f += Math.floor(a / 1E7), a %= 1E7);
    1E7 <= f && (b += Math.floor(f / 1E7), f %= 1E7);
    return c(b, 0) + c(f, b) + c(a, 1)
}

function Gb(a, b) {
    var c = b & 2147483648;
    c && (a = ~a + 1 >>> 0, b = ~b + (0 == a ? 1 : 0) >>> 0);
    a = Fb(a, b);
    return c ? "-" + a : a
}

function Hb(a, b) {
    zb(a);
    a = A;
    var c = B;
    return b ? Gb(a, c) : Fb(a, c)
}

function Ib(a) {
    function b(l, r) {
        for (var v = 0; 8 > v && (1 !== l || 0 < r); v++) r = l * g[v] + r, g[
            v] = r & 255, r >>>= 8
    }

    function c() {
        for (var l = 0; 8 > l; l++) g[l] = ~g[l] & 255
    }(0, k.asserts.assert)(0 < a.length);
    var f = !1;
    "-" === a[0] && (f = !0, a = a.slice(1));
    for (var g = [0, 0, 0, 0, 0, 0, 0, 0], h = 0; h < a.length; h++) b(10, a
        .charCodeAt(h) - 48);
    f && (c(), b(1, 1));
    return k.crypt.byteArrayToString(g)
}

function Kb(a) {
    zb(Ib(a))
}

function Lb(a) {
    return String.fromCharCode(10 > a ? 48 + a : 87 + a)
}

function Mb(a) {
    return 97 <= a ? a - 97 + 10 : a - 48
}

function Nb(a, b, c, f, g) {
    var h = 0;
    if (128 > f)
        for (; b < c && a[b++] == f;) h++, b += g;
    else
        for (; b < c;) {
            for (var l = f; 128 < l;) {
                if (a[b++] != (l & 127 | 128)) return h;
                l >>= 7
            }
            if (a[b++] != l) break;
            h++;
            b += g
        }
    return h
}

function Ob(a) {
    if (a.constructor === Uint8Array) return a;
    if (a.constructor === ArrayBuffer) return new Uint8Array(a);
    if (a.constructor === Array) return new Uint8Array(a);
    if (a.constructor === String) return k.crypt.base64
        .decodeStringToUint8Array(a);
    (0, k.asserts.fail)("Type not convertible to Uint8Array.");
    return new Uint8Array(0)
}
x.utils.byteSourceToUint8Array = Ob;
x.utils.countDelimitedFields = function (a, b, c, f) {
    var g = 0;
    for (f = 8 * f + z.DELIMITED; b < c;) {
        for (var h = f; 128 < h;) {
            if (a[b++] != (h & 127 | 128)) return g;
            h >>= 7
        }
        if (a[b++] != h) break;
        g++;
        for (var l = 0, r = 1; h = a[b++], l += (h & 127) * r, r *= 128,
            0 != (h & 128););
        b += l
    }
    return g
};
x.utils.countFixed32Fields = function (a, b, c, f) {
    return Nb(a, b, c, 8 * f + z.FIXED32, 4)
};
x.utils.countFixed64Fields = function (a, b, c, f) {
    return Nb(a, b, c, 8 * f + z.FIXED64, 8)
};
x.utils.countVarintFields = function (a, b, c, f) {
    var g = 0;
    f = 8 * f + z.VARINT;
    if (128 > f)
        for (; b < c && a[b++] == f;)
            for (g++;;) {
                var h = a[b++];
                if (0 == (h & 128)) break
            } else
                for (; b < c;) {
                    for (h = f; 128 < h;) {
                        if (a[b] != (h & 127 | 128)) return g;
                        b++;
                        h >>= 7
                    }
                    if (a[b++] != h) break;
                    for (g++; h = a[b++], 0 != (h & 128););
                }
    return g
};
x.utils.countVarints = function (a, b, c) {
    for (var f = 0, g = b; g < c; g++) f += a[g] >> 7;
    return c - b - f
};
x.utils.debugBytesToTextFormat = function (a) {
    var b = '"';
    if (a) {
        a = Ob(a);
        for (var c = 0; c < a.length; c++) b += "\\x", 16 > a[c] && (b +=
            "0"), b += a[c].toString(16)
    }
    return b + '"'
};
x.utils.debugScalarToTextFormat = function (a) {
    return "string" === typeof a ? k.string.quote(a) : a.toString()
};
x.utils.decimalStringToHash64 = Ib;
x.utils.DIGITS = "0123456789abcdef".split("");
x.utils.fromZigzag64 = Cb;
x.utils.hash64ArrayToDecimalStrings = function (a, b) {
    for (var c = Array(a.length), f = 0; f < a.length; f++) c[f] = Hb(a[f],
        b);
    return c
};
x.utils.hash64ToDecimalString = Hb;
x.utils.hash64ToHexString = function (a) {
    var b = Array(18);
    b[0] = "0";
    b[1] = "x";
    for (var c = 0; 8 > c; c++) {
        var f = a.charCodeAt(7 - c);
        b[2 * c + 2] = Lb(f >> 4);
        b[2 * c + 3] = Lb(f & 15)
    }
    return b.join("")
};
x.utils.hash64ToNumber = function (a, b) {
    zb(a);
    a = A;
    var c = B;
    return b ? Bb(a, c) : Ab(a, c)
};
x.utils.hexStringToHash64 = function (a) {
    a = a.toLowerCase();
    (0, k.asserts.assert)(18 == a.length);
    (0, k.asserts.assert)("0" == a[0]);
    (0, k.asserts.assert)("x" == a[1]);
    for (var b = "", c = 0; 8 > c; c++) b = String.fromCharCode(16 * Mb(a
        .charCodeAt(2 * c + 2)) + Mb(a.charCodeAt(2 * c + 3))) + b;
    return b
};
x.utils.joinFloat64 = Db;
x.utils.joinFloat32 = function (a) {
    var b = 2 * (a >> 31) + 1,
        c = a >>> 23 & 255;
    a &= 8388607;
    return 255 == c ? a ? NaN : Infinity * b : 0 == c ? b * Math.pow(2, -
        149) * a : b * Math.pow(2, c - 150) * (a + Math.pow(2, 23))
};
x.utils.joinHash64 = Eb;
x.utils.joinInt64 = Bb;
x.utils.joinSignedDecimalString = Gb;
x.utils.joinUint64 = Ab;
x.utils.joinUnsignedDecimalString = Fb;
x.utils.joinZigzag64 = function (a, b) {
    return Cb(a, b, Bb)
};
x.utils.numberToHash64 = function (a) {
    xb(a);
    return Eb(A, B)
};
x.utils.splitDecimalString = Kb;
x.utils.splitHash64 = zb;
x.utils.splitFloat64 = yb;
x.utils.splitFloat32 = function (a) {
    var b = 0 > a ? 1 : 0;
    a = b ? -a : a;
    if (0 === a) 0 < 1 / a ? A = B = 0 : (B = 0, A = 2147483648);
    else if (isNaN(a)) B = 0, A = 2147483647;
    else if (3.4028234663852886E38 < a) B = 0, A = (b << 31 |
        2139095040) >>> 0;
    else if (1.1754943508222875E-38 > a) a = Math.round(a / Math.pow(2, -
        149)), B = 0, A = (b << 31 | a) >>> 0;
    else {
        var c = Math.floor(Math.log(a) / Math.LN2);
        a *= Math.pow(2, -c);
        a = Math.round(8388608 * a) & 8388607;
        B = 0;
        A = (b << 31 | c + 127 << 23 | a) >>> 0
    }
};
x.utils.splitZigzag64 = function (a) {
    var b = 0 > a;
    a = 2 * Math.abs(a);
    wb(a);
    a = A;
    var c = B;
    b && (0 == a ? 0 == c ? c = a = 4294967295 : (c--, a = 4294967295) :
        a--);
    A = a;
    B = c
};
x.utils.splitInt64 = xb;
x.utils.splitUint64 = wb;
x.utils.getSplit64Low = function () {
    return A
};
x.utils.getSplit64High = function () {
    return B
};
x.utils.stringToByteArray = function (a) {
    for (var b = new Uint8Array(a.length), c = 0; c < a.length; c++) {
        var f = a.charCodeAt(c);
        if (255 < f) throw Error(
            "Conversion error: string contains codepoint outside of byte range"
            );
        b[c] = f
    }
    return b
};
x.utils.toZigzag64 = function (a, b, c) {
    var f = b >> 31;
    return c(a << 1 ^ f, (b << 1 | a >>> 31) ^ f)
};
var Pb = function (a, b, c) {
    this.bytes_ = null;
    this.cursor_ = this.end_ = this.start_ = 0;
    this.error_ = !1;
    a && this.setBlock(a, b, c)
};
Pb.alloc = function (a, b, c) {
    if (Pb.instanceCache_.length) {
        var f = Pb.instanceCache_.pop();
        a && f.setBlock(a, b, c);
        return f
    }
    return new Pb(a, b, c)
};
d = Pb.prototype;
d.clone = function () {
    return Pb.alloc(this.bytes_, this.start_, this.end_ - this.start_)
};
d.clear = function () {
    this.bytes_ = null;
    this.cursor_ = this.end_ = this.start_ = 0;
    this.error_ = !1
};
d.setBlock = function (a, b, c) {
    this.bytes_ = Ob(a);
    this.start_ = void 0 !== b ? b : 0;
    this.end_ = void 0 !== c ? this.start_ + c : this.bytes_.length;
    this.cursor_ = this.start_
};
d.setEnd = function (a) {
    this.end_ = a
};
d.reset = function () {
    this.cursor_ = this.start_
};
d.getCursor = function () {
    return this.cursor_
};
d.advance = function (a) {
    this.cursor_ += a;
    k.asserts.assert(this.cursor_ <= this.end_)
};
d.getError = function () {
    return this.error_ || 0 > this.cursor_ || this.cursor_ > this.end_
};
d.readSplitVarint64 = function (a) {
    for (var b = 128, c = 0, f = 0, g = 0; 4 > g && 128 <= b; g++) b = this
        .bytes_[this.cursor_++], c |= (b & 127) << 7 * g;
    128 <= b && (b = this.bytes_[this.cursor_++], c |= (b & 127) << 28, f |=
        (b & 127) >> 4);
    if (128 <= b)
        for (g = 0; 5 > g && 128 <= b; g++) b = this.bytes_[this.cursor_++],
            f |= (b & 127) << 7 * g + 3;
    if (128 > b) return a(c >>> 0, f >>> 0);
    k.asserts.fail("Failed to read varint, encoding is invalid.");
    this.error_ = !0
};
var Qb = function (a) {
    var b = a.bytes_;
    var c = b[a.cursor_ + 0];
    var f = c & 127;
    if (128 > c) return a.cursor_ += 1, k.asserts.assert(a.cursor_ <= a
        .end_), f;
    c = b[a.cursor_ + 1];
    f |= (c & 127) << 7;
    if (128 > c) return a.cursor_ += 2, k.asserts.assert(a.cursor_ <= a
        .end_), f;
    c = b[a.cursor_ + 2];
    f |= (c & 127) << 14;
    if (128 > c) return a.cursor_ += 3, k.asserts.assert(a.cursor_ <= a
        .end_), f;
    c = b[a.cursor_ + 3];
    f |= (c & 127) << 21;
    if (128 > c) return a.cursor_ += 4, k.asserts.assert(a.cursor_ <= a
        .end_), f;
    c = b[a.cursor_ + 4];
    f |= (c & 15) << 28;
    if (128 > c) return a.cursor_ += 5, k.asserts.assert(a.cursor_ <=
        a.end_), f >>> 0;
    a.cursor_ += 5;
    128 <= b[a.cursor_++] && 128 <= b[a.cursor_++] && 128 <= b[a
        .cursor_++] && 128 <= b[a.cursor_++] && 128 <= b[a.cursor_++] && k
        .asserts.assert(!1);
    k.asserts.assert(a.cursor_ <= a.end_);
    return f
};
d = Pb.prototype;
d.readSignedVarint32 = function () {
    return Qb(this)
};
d.readUint32 = function () {
    var a = this.bytes_[this.cursor_ + 0],
        b = this.bytes_[this.cursor_ + 1],
        c = this.bytes_[this.cursor_ + 2],
        f = this.bytes_[this.cursor_ + 3];
    this.cursor_ += 4;
    k.asserts.assert(this.cursor_ <= this.end_);
    return (a << 0 | b << 8 | c << 16 | f << 24) >>> 0
};
d.readInt32 = function () {
    var a = this.bytes_[this.cursor_ + 0],
        b = this.bytes_[this.cursor_ + 1],
        c = this.bytes_[this.cursor_ + 2],
        f = this.bytes_[this.cursor_ + 3];
    this.cursor_ += 4;
    k.asserts.assert(this.cursor_ <= this.end_);
    return a << 0 | b << 8 | c << 16 | f << 24
};
d.readInt64 = function () {
    var a = this.readUint32(),
        b = this.readUint32();
    return Bb(a, b)
};
d.readInt64String = function () {
    var a = this.readUint32(),
        b = this.readUint32();
    return Gb(a, b)
};
d.readDouble = function () {
    var a = this.readUint32(),
        b = this.readUint32();
    return Db(a, b)
};
d.readBool = function () {
    return !!this.bytes_[this.cursor_++]
};
d.readEnum = function () {
    return this.readSignedVarint32()
};
d.readString = function (a) {
    var b = this.bytes_,
        c = this.cursor_;
    a = c + a;
    for (var f = [], g = ""; c < a;) {
        var h = b[c++];
        if (128 > h) f.push(h);
        else if (192 > h) continue;
        else if (224 > h) {
            var l = b[c++];
            f.push((h & 31) << 6 | l & 63)
        } else if (240 > h) {
            l = b[c++];
            var r = b[c++];
            f.push((h & 15) << 12 | (l & 63) << 6 | r & 63)
        } else if (248 > h) {
            l = b[c++];
            r = b[c++];
            var v = b[c++];
            h = (h & 7) << 18 | (l & 63) << 12 | (r & 63) << 6 | v & 63;
            h -= 65536;
            f.push((h >> 10 & 1023) + 55296, (h & 1023) + 56320)
        }
        8192 <= f.length && (g += String.fromCharCode.apply(null, f), f
            .length = 0)
    }
    g += k.crypt.byteArrayToString(f);
    this.cursor_ =
        c;
    return g
};
d.readBytes = function (a) {
    if (0 > a || this.cursor_ + a > this.bytes_.length) return this
        .error_ = !0, k.asserts.fail("Invalid byte length!"),
        new Uint8Array(0);
    var b = this.bytes_.subarray(this.cursor_, this.cursor_ + a);
    this.cursor_ += a;
    k.asserts.assert(this.cursor_ <= this.end_);
    return b
};
Pb.instanceCache_ = [];
x.BinaryDecoder = Pb;
var C = function (a, b, c) {
    this.decoder_ = Pb.alloc(a, b, c);
    this.fieldCursor_ = this.decoder_.getCursor();
    this.nextField_ = -1;
    this.nextWireType_ = z.INVALID;
    this.error_ = !1
};
C.alloc = function (a, b, c) {
    if (C.instanceCache_.length) {
        var f = C.instanceCache_.pop();
        a && f.decoder_.setBlock(a, b, c);
        return f
    }
    return new C(a, b, c)
};
C.prototype.getCursor = function () {
    return this.decoder_.getCursor()
};
C.prototype.getFieldNumber = function () {
    return this.nextField_
};
var D = function (a) {
    return a.nextWireType_ == z.END_GROUP
};
C.prototype.getError = function () {
    return this.error_ || this.decoder_.getError()
};
C.prototype.setBlock = function (a, b, c) {
    this.decoder_.setBlock(a, b, c);
    this.nextField_ = -1;
    this.nextWireType_ = z.INVALID
};
C.prototype.reset = function () {
    this.decoder_.reset();
    this.nextField_ = -1;
    this.nextWireType_ = z.INVALID
};
C.prototype.advance = function (a) {
    this.decoder_.advance(a)
};
var F = function (a) {
        var b = a.decoder_;
        if (b.cursor_ == b.end_) return !1;
        if (a.getError()) return k.asserts.fail("Decoder hit an error"), !1;
        a.fieldCursor_ = a.decoder_.getCursor();
        var c = Qb(a.decoder_);
        b = c >>> 3;
        c &= 7;
        if (c != z.VARINT && c != z.FIXED32 && c != z.FIXED64 && c != z
            .DELIMITED && c != z.START_GROUP && c != z.END_GROUP) return k
            .asserts.fail("Invalid wire type: %s (at position %s)", c, a
                .fieldCursor_), a.error_ = !0, !1;
        a.nextField_ = b;
        a.nextWireType_ = c;
        return !0
    },
    G = function (a) {
        switch (a.nextWireType_) {
            case z.VARINT:
                if (a.nextWireType_ !=
                    z.VARINT) k.asserts.fail(
                    "Invalid wire type for skipVarintField"), G(a);
                else {
                    for (a = a.decoder_; a.bytes_[a.cursor_] & 128;) a
                    .cursor_++;
                    a.cursor_++
                }
                break;
            case z.FIXED64:
                a.nextWireType_ != z.FIXED64 ? (k.asserts.fail(
                        "Invalid wire type for skipFixed64Field"), G(a)) : a
                    .decoder_.advance(8);
                break;
            case z.DELIMITED:
                if (a.nextWireType_ != z.DELIMITED) k.asserts.fail(
                    "Invalid wire type for skipDelimitedField"), G(a);
                else {
                    var b = Qb(a.decoder_);
                    a.decoder_.advance(b)
                }
                break;
            case z.FIXED32:
                a.nextWireType_ != z.FIXED32 ? (k.asserts.fail(
                        "Invalid wire type for skipFixed32Field"),
                    G(a)) : a.decoder_.advance(4);
                break;
            case z.START_GROUP:
                b = a.nextField_;
                do {
                    if (!F(a)) {
                        k.asserts.fail("Unmatched start-group tag: stream EOF");
                        a.error_ = !0;
                        break
                    }
                    if (a.nextWireType_ == z.END_GROUP) {
                        a.nextField_ != b && (k.asserts.fail(
                            "Unmatched end-group tag"), a.error_ = !0);
                        break
                    }
                    G(a)
                } while (1);
                break;
            default:
                a.error_ = !0, k.asserts.fail(
                    "Invalid wire encoding for field.")
        }
    };
d = C.prototype;
d.readMessage = function (a, b) {
    k.asserts.assert(this.nextWireType_ == z.DELIMITED);
    var c = this.decoder_.end_,
        f = Qb(this.decoder_);
    f = this.decoder_.getCursor() + f;
    this.decoder_.setEnd(f);
    b(a, this);
    this.decoder_.cursor_ = f;
    this.decoder_.setEnd(c)
};
d.readInt32 = function () {
    k.asserts.assert(this.nextWireType_ == z.VARINT);
    return this.decoder_.readSignedVarint32()
};
d.readInt64 = function () {
    k.asserts.assert(this.nextWireType_ == z.VARINT);
    return this.decoder_.readSplitVarint64(Bb)
};
d.readInt64String = function () {
    k.asserts.assert(this.nextWireType_ == z.VARINT);
    return this.decoder_.readSplitVarint64(Gb)
};
d.readUint32 = function () {
    k.asserts.assert(this.nextWireType_ == z.VARINT);
    return Qb(this.decoder_)
};
d.readDouble = function () {
    k.asserts.assert(this.nextWireType_ == z.FIXED64);
    return this.decoder_.readDouble()
};
d.readBool = function () {
    k.asserts.assert(this.nextWireType_ == z.VARINT);
    return !!Qb(this.decoder_)
};
d.readEnum = function () {
    k.asserts.assert(this.nextWireType_ == z.VARINT);
    return this.decoder_.readSplitVarint64(Bb)
};
d.readString = function () {
    k.asserts.assert(this.nextWireType_ == z.DELIMITED);
    var a = Qb(this.decoder_);
    return this.decoder_.readString(a)
};
d.readBytes = function () {
    k.asserts.assert(this.nextWireType_ == z.DELIMITED);
    var a = Qb(this.decoder_);
    return this.decoder_.readBytes(a)
};
d.readSplitVarint64 = function (a) {
    k.asserts.assert(this.nextWireType_ == z.VARINT);
    return this.decoder_.readSplitVarint64(a)
};
C.instanceCache_ = [];
x.BinaryReader = C;
x.arith = {};
x.arith.UInt64 = function (a, b) {
    this.lo = a;
    this.hi = b
};
x.arith.UInt64.prototype.cmp = function (a) {
    return this.hi < a.hi || this.hi == a.hi && this.lo < a.lo ? -1 : this
        .hi == a.hi && this.lo == a.lo ? 0 : 1
};
var Rb = function (a) {
        return new x.arith.UInt64((a.lo >>> 1 | (a.hi & 1) << 31) >>> 0, a
            .hi >>> 1 >>> 0)
    },
    Sb = function (a) {
        return new x.arith.UInt64(a.lo << 1 >>> 0, (a.hi << 1 | a.lo >>> 31) >>>
            0)
    };
x.arith.UInt64.prototype.add = function (a) {
    return new x.arith.UInt64((this.lo + a.lo & 4294967295) >>> 0 >>> 0, ((
        this.hi + a.hi & 4294967295) >>> 0) + (4294967296 <= this
        .lo + a.lo ? 1 : 0) >>> 0)
};
x.arith.UInt64.prototype.sub = function (a) {
    return new x.arith.UInt64((this.lo - a.lo & 4294967295) >>> 0 >>> 0, ((
        this.hi - a.hi & 4294967295) >>> 0) - (0 > this.lo - a.lo ?
        1 : 0) >>> 0)
};
x.arith.UInt64.mul32x32 = function (a) {
    var b = a & 65535,
        c = a >>> 16;
    a = 10 * b + 65536 * (0 * b & 65535) + 65536 * (10 * c & 65535);
    for (b = 0 * c + (0 * b >>> 16) + (10 * c >>> 16); 4294967296 <= a;)
        a -= 4294967296, b += 1;
    return new x.arith.UInt64(a >>> 0, b >>> 0)
};
x.arith.UInt64.prototype.toString = function () {
    for (var a = "", b = this; 0 != b.lo || 0 != b.hi;) {
        var c = new x.arith.UInt64(0, 0);
        b = new x.arith.UInt64(b.lo, b.hi);
        for (var f = new x.arith.UInt64(10, 0), g = new x.arith.UInt64(1,
            0); !(f.hi & 2147483648);) f = Sb(f), g = Sb(g);
        for (; 0 != g.lo || 0 != g.hi;) 0 >= f.cmp(b) && (c = c.add(g), b =
            b.sub(f)), f = Rb(f), g = Rb(g);
        c = [c, b];
        b = c[0];
        a = c[1].lo + a
    }
    "" == a && (a = "0");
    return a
};
x.arith.UInt64.fromString = function (a) {
    for (var b = new x.arith.UInt64(0, 0), c = new x.arith.UInt64(0, 0), f =
            0; f < a.length; f++) {
        if ("0" > a[f] || "9" < a[f]) return null;
        c.lo = parseInt(a[f], 10);
        var g = x.arith.UInt64.mul32x32(b.lo);
        b = x.arith.UInt64.mul32x32(b.hi);
        b.hi = b.lo;
        b.lo = 0;
        b = g.add(b).add(c)
    }
    return b
};
x.arith.UInt64.prototype.clone = function () {
    return new x.arith.UInt64(this.lo, this.hi)
};
x.arith.Int64 = function (a, b) {
    this.lo = a;
    this.hi = b
};
x.arith.Int64.prototype.add = function (a) {
    return new x.arith.Int64((this.lo + a.lo & 4294967295) >>> 0 >>> 0, ((
        this.hi + a.hi & 4294967295) >>> 0) + (4294967296 <= this
        .lo + a.lo ? 1 : 0) >>> 0)
};
x.arith.Int64.prototype.sub = function (a) {
    return new x.arith.Int64((this.lo - a.lo & 4294967295) >>> 0 >>> 0, ((
        this.hi - a.hi & 4294967295) >>> 0) - (0 > this.lo - a.lo ?
        1 : 0) >>> 0)
};
x.arith.Int64.prototype.clone = function () {
    return new x.arith.Int64(this.lo, this.hi)
};
x.arith.Int64.prototype.toString = function () {
    var a = 0 != (this.hi & 2147483648),
        b = new x.arith.UInt64(this.lo, this.hi);
    a && (b = (new x.arith.UInt64(0, 0)).sub(b));
    return (a ? "-" : "") + b.toString()
};
x.arith.Int64.fromString = function (a) {
    var b = 0 < a.length && "-" == a[0];
    b && (a = a.substring(1));
    a = x.arith.UInt64.fromString(a);
    if (null === a) return null;
    b && (a = (new x.arith.UInt64(0, 0)).sub(a));
    return new x.arith.Int64(a.lo, a.hi)
};
var Tb = function () {
    this.buffer_ = []
};
Tb.prototype.length = function () {
    return this.buffer_.length
};
Tb.prototype.end = function () {
    var a = this.buffer_;
    this.buffer_ = [];
    return a
};
Tb.prototype.writeSplitVarint64 = function (a, b) {
    k.asserts.assert(a == Math.floor(a));
    k.asserts.assert(b == Math.floor(b));
    k.asserts.assert(0 <= a && 4294967296 > a);
    for (k.asserts.assert(0 <= b && 4294967296 > b); 0 < b || 127 < a;) this
        .buffer_.push(a & 127 | 128), a = (a >>> 7 | b << 25) >>> 0, b >>>=
        7;
    this.buffer_.push(a)
};
Tb.prototype.writeSplitFixed64 = function (a, b) {
    k.asserts.assert(a == Math.floor(a));
    k.asserts.assert(b == Math.floor(b));
    k.asserts.assert(0 <= a && 4294967296 > a);
    k.asserts.assert(0 <= b && 4294967296 > b);
    this.writeUint32(a);
    this.writeUint32(b)
};
var Ub = function (a, b) {
        k.asserts.assert(b == Math.floor(b));
        for (k.asserts.assert(0 <= b && 4294967296 > b); 127 < b;) a.buffer_
            .push(b & 127 | 128), b >>>= 7;
        a.buffer_.push(b)
    },
    Vb = function (a, b) {
        k.asserts.assert(b == Math.floor(b));
        k.asserts.assert(-2147483648 <= b && 2147483648 > b);
        if (0 <= b) Ub(a, b);
        else {
            for (var c = 0; 9 > c; c++) a.buffer_.push(b & 127 | 128), b >>= 7;
            a.buffer_.push(1)
        }
    };
d = Tb.prototype;
d.writeUint32 = function (a) {
    k.asserts.assert(a == Math.floor(a));
    k.asserts.assert(0 <= a && 4294967296 > a);
    this.buffer_.push(a >>> 0 & 255);
    this.buffer_.push(a >>> 8 & 255);
    this.buffer_.push(a >>> 16 & 255);
    this.buffer_.push(a >>> 24 & 255)
};
d.writeInt32 = function (a) {
    k.asserts.assert(a == Math.floor(a));
    k.asserts.assert(-2147483648 <= a && 2147483648 > a);
    this.buffer_.push(a >>> 0 & 255);
    this.buffer_.push(a >>> 8 & 255);
    this.buffer_.push(a >>> 16 & 255);
    this.buffer_.push(a >>> 24 & 255)
};
d.writeInt64 = function (a) {
    k.asserts.assert(a == Math.floor(a));
    k.asserts.assert(-9223372036854775808 <= a && 0x7fffffffffffffff > a);
    xb(a);
    this.writeSplitFixed64(A, B)
};
d.writeInt64String = function (a) {
    k.asserts.assert(a == Math.floor(a));
    k.asserts.assert(-9223372036854775808 <= +a && 0x7fffffffffffffff > +a);
    Kb(a);
    this.writeSplitFixed64(A, B)
};
d.writeDouble = function (a) {
    k.asserts.assert(Infinity === a || -Infinity === a || isNaN(a) || -
        1.7976931348623157E308 <= a && 1.7976931348623157E308 >= a);
    yb(a);
    this.writeUint32(A);
    this.writeUint32(B)
};
d.writeBool = function (a) {
    k.asserts.assert("boolean" === typeof a || "number" === typeof a);
    this.buffer_.push(a ? 1 : 0)
};
d.writeEnum = function (a) {
    k.asserts.assert(a == Math.floor(a));
    k.asserts.assert(-2147483648 <= a && 2147483648 > a);
    Vb(this, a)
};
d.writeBytes = function (a) {
    this.buffer_.push.apply(this.buffer_, a)
};
d.writeString = function (a) {
    for (var b = 0; b < a.length; b++) {
        var c = a.charCodeAt(b);
        if (128 > c) this.buffer_.push(c);
        else if (2048 > c) this.buffer_.push(c >> 6 | 192), this.buffer_
            .push(c & 63 | 128);
        else if (65536 > c)
            if (55296 <= c && 56319 >= c && b + 1 < a.length) {
                var f = a.charCodeAt(b + 1);
                56320 <= f && 57343 >= f && (c = 1024 * (c - 55296) + f -
                    56320 + 65536, this.buffer_.push(c >> 18 | 240),
                    this.buffer_.push(c >> 12 & 63 | 128), this.buffer_
                    .push(c >> 6 & 63 | 128), this.buffer_.push(c & 63 |
                        128), b++)
            } else this.buffer_.push(c >> 12 | 224), this.buffer_.push(c >>
                6 & 63 | 128), this.buffer_.push(c &
                63 | 128)
    }
};
x.BinaryEncoder = Tb;
k.userAgent.product = {};
k.userAgent.product.ASSUME_FIREFOX = !1;
k.userAgent.product.ASSUME_IPHONE = !1;
k.userAgent.product.ASSUME_IPAD = !1;
k.userAgent.product.ASSUME_ANDROID = !1;
k.userAgent.product.ASSUME_CHROME = !1;
k.userAgent.product.ASSUME_SAFARI = !1;
k.userAgent.product.PRODUCT_KNOWN_ = k.userAgent.ASSUME_IE || k.userAgent
    .ASSUME_EDGE || k.userAgent.ASSUME_OPERA || k.userAgent.product
    .ASSUME_FIREFOX || k.userAgent.product.ASSUME_IPHONE || k.userAgent.product
    .ASSUME_IPAD || k.userAgent.product.ASSUME_ANDROID || k.userAgent.product
    .ASSUME_CHROME || k.userAgent.product.ASSUME_SAFARI;
k.userAgent.product.OPERA = k.userAgent.OPERA;
k.userAgent.product.IE = k.userAgent.IE;
k.userAgent.product.EDGE = k.userAgent.EDGE;
k.userAgent.product.FIREFOX = k.userAgent.product.PRODUCT_KNOWN_ ? k.userAgent
    .product.ASSUME_FIREFOX : k.labs.userAgent.browser.isFirefox();
k.userAgent.product.isIphoneOrIpod_ = function () {
    return k.labs.userAgent.platform.isIphone() || k.labs.userAgent.platform
        .isIpod()
};
k.userAgent.product.IPHONE = k.userAgent.product.PRODUCT_KNOWN_ ? k.userAgent
    .product.ASSUME_IPHONE : k.userAgent.product.isIphoneOrIpod_();
k.userAgent.product.IPAD = k.userAgent.product.PRODUCT_KNOWN_ ? k.userAgent
    .product.ASSUME_IPAD : k.labs.userAgent.platform.isIpad();
k.userAgent.product.ANDROID = k.userAgent.product.PRODUCT_KNOWN_ ? k.userAgent
    .product.ASSUME_ANDROID : k.labs.userAgent.browser.isAndroidBrowser();
k.userAgent.product.CHROME = k.userAgent.product.PRODUCT_KNOWN_ ? k.userAgent
    .product.ASSUME_CHROME : k.labs.userAgent.browser.isChrome();
k.userAgent.product.isSafariDesktop_ = function () {
    return k.labs.userAgent.browser.isSafari() && !k.labs.userAgent.platform
        .isIos()
};
k.userAgent.product.SAFARI = k.userAgent.product.PRODUCT_KNOWN_ ? k.userAgent
    .product.ASSUME_SAFARI : k.userAgent.product.isSafariDesktop_();
k.crypt.base64 = {};
k.crypt.base64.DEFAULT_ALPHABET_COMMON_ =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
k.crypt.base64.ENCODED_VALS = k.crypt.base64.DEFAULT_ALPHABET_COMMON_ + "+/=";
k.crypt.base64.ENCODED_VALS_WEBSAFE = k.crypt.base64.DEFAULT_ALPHABET_COMMON_ +
    "-_.";
k.crypt.base64.Alphabet = {
    DEFAULT: 0,
    NO_PADDING: 1,
    WEBSAFE: 2,
    WEBSAFE_DOT_PADDING: 3,
    WEBSAFE_NO_PADDING: 4
};
k.crypt.base64.paddingChars_ = "=.";
k.crypt.base64.isPadding_ = function (a) {
    return k.string.contains(k.crypt.base64.paddingChars_, a)
};
k.crypt.base64.byteToCharMaps_ = {};
k.crypt.base64.charToByteMap_ = null;
k.crypt.base64.ASSUME_NATIVE_SUPPORT_ = k.userAgent.GECKO || k.userAgent
    .WEBKIT && !k.userAgent.product.SAFARI || k.userAgent.OPERA;
k.crypt.base64.HAS_NATIVE_ENCODE_ = k.crypt.base64.ASSUME_NATIVE_SUPPORT_ ||
    "function" == typeof k.global.btoa;
k.crypt.base64.HAS_NATIVE_DECODE_ = k.crypt.base64.ASSUME_NATIVE_SUPPORT_ || !k
    .userAgent.product.SAFARI && !k.userAgent.IE && "function" == typeof k
    .global.atob;
k.crypt.base64.encodeByteArray = function (a, b) {
    k.asserts.assert(k.isArrayLike(a),
        "encodeByteArray takes an array as a parameter");
    void 0 === b && (b = k.crypt.base64.Alphabet.DEFAULT);
    k.crypt.base64.init_();
    b = k.crypt.base64.byteToCharMaps_[b];
    for (var c = [], f = 0; f < a.length; f += 3) {
        var g = a[f],
            h = f + 1 < a.length,
            l = h ? a[f + 1] : 0,
            r = f + 2 < a.length,
            v = r ? a[f + 2] : 0,
            E = g >> 2;
        g = (g & 3) << 4 | l >> 4;
        l = (l & 15) << 2 | v >> 6;
        v &= 63;
        r || (v = 64, h || (l = 64));
        c.push(b[E], b[g], b[l] || "", b[v] || "")
    }
    return c.join("")
};
k.crypt.base64.encodeString = function (a, b) {
    return k.crypt.base64.HAS_NATIVE_ENCODE_ && !b ? k.global.btoa(a) : k
        .crypt.base64.encodeByteArray(k.crypt.stringToByteArray(a), b)
};
k.crypt.base64.decodeString = function (a, b) {
    if (k.crypt.base64.HAS_NATIVE_DECODE_ && !b) return k.global.atob(a);
    var c = "";
    k.crypt.base64.decodeStringInternal_(a, function (f) {
        c += String.fromCharCode(f)
    });
    return c
};
k.crypt.base64.decodeStringToByteArray = function (a) {
    var b = [];
    k.crypt.base64.decodeStringInternal_(a, function (c) {
        b.push(c)
    });
    return b
};
k.crypt.base64.decodeStringToUint8Array = function (a) {
    k.asserts.assert(!k.userAgent.IE || k.userAgent.isVersionOrHigher("10"),
        "Browser does not support typed arrays");
    var b = a.length,
        c = 3 * b / 4;
    c % 3 ? c = Math.floor(c) : k.crypt.base64.isPadding_(a[b - 1]) && (c =
        k.crypt.base64.isPadding_(a[b - 2]) ? c - 2 : c - 1);
    var f = new Uint8Array(c),
        g = 0;
    k.crypt.base64.decodeStringInternal_(a, function (h) {
        f[g++] = h
    });
    return f.subarray(0, g)
};
k.crypt.base64.decodeStringInternal_ = function (a, b) {
    function c(v) {
        for (; f < a.length;) {
            var E = a.charAt(f++),
                H = k.crypt.base64.charToByteMap_[E];
            if (null != H) return H;
            if (!k.string.isEmptyOrWhitespace(E)) throw Error(
                "Unknown base64 encoding at char: " + E);
        }
        return v
    }
    k.crypt.base64.init_();
    for (var f = 0;;) {
        var g = c(-1),
            h = c(0),
            l = c(64),
            r = c(64);
        if (64 === r && -1 === g) break;
        b(g << 2 | h >> 4);
        64 != l && (b(h << 4 & 240 | l >> 2), 64 != r && b(l << 6 & 192 |
            r))
    }
};
k.crypt.base64.init_ = function () {
    if (!k.crypt.base64.charToByteMap_) {
        k.crypt.base64.charToByteMap_ = {};
        for (var a = k.crypt.base64.DEFAULT_ALPHABET_COMMON_.split(""),
                b = ["+/=", "+/", "-_=", "-_.", "-_"], c = 0; 5 > c; c++) {
            var f = a.concat(b[c].split(""));
            k.crypt.base64.byteToCharMaps_[c] = f;
            for (var g = 0; g < f.length; g++) {
                var h = f[g],
                    l = k.crypt.base64.charToByteMap_[h];
                void 0 === l ? k.crypt.base64.charToByteMap_[h] = g : k
                    .asserts.assert(l === g)
            }
        }
    }
};
var Wb = function () {
        this.blocks_ = [];
        this.totalLength_ = 0;
        this.encoder_ = new Tb
    },
    Xb = function (a, b) {
        I(a, b, z.DELIMITED);
        b = a.encoder_.end();
        a.blocks_.push(b);
        a.totalLength_ += b.length;
        b.push(a.totalLength_);
        return b
    },
    Yb = function (a, b) {
        var c = b.pop();
        c = a.totalLength_ + a.encoder_.length() - c;
        for ((0, k.asserts.assert)(0 <= c); 127 < c;) b.push(c & 127 | 128),
            c >>>= 7, a.totalLength_++;
        b.push(c);
        a.totalLength_++
    };
Wb.prototype.reset = function () {
    this.blocks_ = [];
    this.encoder_.end();
    this.totalLength_ = 0
};
var I = function (a, b, c) {
        (0, k.asserts.assert)(1 <= b && b == Math.floor(b));
        Ub(a.encoder_, 8 * b + c)
    },
    $b = function (a, b, c) {
        null != c && (Zb(b, c), I(a, b, z.VARINT), Vb(a.encoder_, c))
    };
d = Wb.prototype;
d.writeInt32 = function (a, b) {
    null != b && (ac(a, b, -2147483648 <= b && 2147483648 > b), $b(this, a,
        b))
};
d.writeInt64 = function (a, b) {
    null != b && (ac(a, b, -9223372036854775808 <= b && 0x7fffffffffffffff >
        b), null != b && (I(this, a, z.VARINT), a = this.encoder_, k
        .asserts.assert(b == Math.floor(b)), k.asserts.assert(-
            9223372036854775808 <= b && 0x7fffffffffffffff > b), xb(
            b), a.writeSplitVarint64(A, B)))
};
d.writeInt64String = function (a, b) {
    null != b && (b = x.arith.Int64.fromString(b), I(this, a, z.VARINT),
        this.encoder_.writeSplitVarint64(b.lo, b.hi))
};
d.writeUint32 = function () {};
d.writeDouble = function (a, b) {
    null != b && (I(this, a, z.FIXED64), this.encoder_.writeDouble(b))
};
d.writeBool = function (a, b) {
    null != b && (ac(a, b, "boolean" === typeof b || "number" === typeof b),
        I(this, a, z.VARINT), this.encoder_.writeBool(b))
};
d.writeEnum = function (a, b) {
    null != b && (b = parseInt(b, 10), Zb(a, b), I(this, a, z.VARINT), Vb(
        this.encoder_, b))
};
d.writeString = function (a, b) {
    null != b && (a = Xb(this, a), this.encoder_.writeString(b), Yb(this,
        a))
};
d.writeBytes = function (a, b) {
    null != b && (b = Ob(b), I(this, a, z.DELIMITED), Ub(this.encoder_, b
            .length), a = this.encoder_.end(), this.blocks_.push(a),
        this.blocks_.push(b), this.totalLength_ += a.length + b.length)
};
var J = function (a, b, c, f) {
    null != c && (b = Xb(a, b), f(c, a), Yb(a, b))
};
Wb.prototype.writeMessageSet = function (a, b, c) {
    null != b && (I(this, 1, z.START_GROUP), I(this, 2, z.VARINT), Vb(this
        .encoder_, a), a = Xb(this, 3), c(b, this), Yb(this, a), I(
        this, 1, z.END_GROUP))
};
Wb.prototype.writeSplitFixed64 = function (a, b) {
    I(this, a, z.FIXED64);
    this.encoder_.writeSplitFixed64(b, void 0)
};
Wb.prototype.writeSplitVarint64 = function (a, b) {
    I(this, a, z.VARINT);
    this.encoder_.writeSplitVarint64(b, void 0)
};
var bc = function (a, b, c) {
        if (null != c)
            for (var f = 0; f < c.length; f++) a.writeString(b, c[f])
    },
    K = function (a, b, c, f) {
        if (null != c)
            for (var g = 0; g < c.length; g++) {
                var h = Xb(a, b);
                f(c[g], a);
                Yb(a, h)
            }
    };

function Zb(a, b) {
    ac(a, b, b === Math.floor(b));
    ac(a, b, -2147483648 <= b && 2147483648 > b)
}

function ac(a, b, c) {
    c || (0, k.asserts.fail)("for [" + b + "] at [" + a + "]")
}
x.BinaryWriter = Wb;
var cc = function (a, b, c, f, g) {
    this.fieldIndex = a;
    this.fieldName = b;
    this.ctor = c;
    this.toObjectFn = f;
    this.isRepeated = g
};
x.ExtensionFieldInfo = cc;
var dc = function (a, b, c, f, g, h) {
    this.fieldInfo = a;
    this.binaryReaderFn = b;
    this.binaryWriterFn = c;
    this.binaryMessageSerializeFn = f;
    this.binaryMessageDeserializeFn = g;
    this.isPacked = h || !1
};
x.ExtensionFieldBinaryInfo = dc;
var ec = {
    isFreezerLoaded: !1
};
var gc = function (a, b) {
    this.arr_ = a;
    this.valueCtor = b;
    this.map = {};
    this.arrClean = !0;
    this.markMessageFrozenFn_ = null;
    if (0 < this.arr_.length) {
        for (a = 0; a < this.arr_.length; a++) {
            b = this.arr_[a];
            var c = b[0];
            this.map[c.toString()] = new fc(c, b[1])
        }
        this.arrClean = !0
    }
};
d = gc.prototype;
d.isFrozen = function () {
    return ec.isFreezerLoaded && null != this.markMessageFrozenFn_
};
d.internalMarkFrozen = function (a) {
    k.asserts.assert(ec.isFreezerLoaded);
    this.markMessageFrozenFn_ = a
};
d.checkNotFrozen_ = function () {
    if (ec.isFreezerLoaded && this.isFrozen()) throw Error(
        "Cannot mutate a frozen Map");
};
d.toArray = function () {
    this.checkNotFrozen_();
    return hc(this, !1)
};
d.toArrayInternal = function () {
    return hc(this, !0)
};
d.toArrayHelper_ = function (a, b) {
    return ec.isFreezerLoaded && b ? a.toArrayInternal() : a.toArray()
};
var hc = function (a, b) {
    if (a.arrClean) {
        if (a.valueCtor) {
            var c = a.map,
                f;
            for (f in c)
                if (Object.prototype.hasOwnProperty.call(c, f)) {
                    var g = c[f].valueWrapper;
                    g && a.toArrayHelper_(g, b)
                }
        }
    } else {
        a.arr_.length = 0;
        c = ic(a);
        c.sort();
        for (f = 0; f < c.length; f++) {
            var h = a.map[c[f]];
            (g = h.valueWrapper) && a.toArrayHelper_(g, b);
            a.arr_.push([h.key, h.value])
        }
        a.arrClean = !0
    }
    return a.arr_
};
gc.prototype.toObject = function (a, b) {
    for (var c = this.toArrayInternal(), f = [], g = 0; g < c.length; g++) {
        var h = this.map[c[g][0].toString()];
        jc(this, h);
        var l = h.valueWrapper;
        l ? (k.asserts.assert(b), f.push([h.key, b(a, l)])) : f.push([h.key,
            h.value
        ])
    }
    return f
};
gc.fromObject = function (a, b, c) {
    b = new gc([], b);
    for (var f = 0; f < a.length; f++) {
        var g = a[f][0],
            h = c(a[f][1]);
        b.set(g, h)
    }
    return b
};
d = gc.prototype;
d.clear = function () {
    this.checkNotFrozen_();
    this.map = {};
    this.arrClean = !1
};
d.entries = function () {
    var a = [],
        b = ic(this);
    b.sort();
    for (var c = 0; c < b.length; c++) {
        var f = this.map[b[c]];
        a.push([f.key, jc(this, f)])
    }
    return new kc(a)
};
d.keys = function () {
    var a = [],
        b = ic(this);
    b.sort();
    for (var c = 0; c < b.length; c++) a.push(this.map[b[c]].key);
    return new kc(a)
};
d.values = function () {
    var a = [],
        b = ic(this);
    b.sort();
    for (var c = 0; c < b.length; c++) a.push(jc(this, this.map[b[c]]));
    return new kc(a)
};
d.forEach = function (a, b) {
    var c = ic(this);
    c.sort();
    for (var f = 0; f < c.length; f++) {
        var g = this.map[c[f]];
        a.call(b, jc(this, g), g.key, this)
    }
};
d.set = function (a, b) {
    this.checkNotFrozen_();
    var c = new fc(a);
    this.valueCtor ? (c.valueWrapper = b, c.value = b.toArrayInternal()) : c
        .value = b;
    this.map[a.toString()] = c;
    this.arrClean = !1;
    return this
};
var jc = function (a, b) {
    return a.valueCtor ? (b.valueWrapper || (b.valueWrapper = new a
            .valueCtor(b.value), a.isFrozen() && (k.asserts.assert(
                    null != a.markMessageFrozenFn_), a
                .markMessageFrozenFn_(b.valueWrapper))), b.valueWrapper) : b
        .value
};
gc.prototype.get = function (a) {
    if (a = this.map[a.toString()]) return jc(this, a)
};
gc.prototype.has = function (a) {
    return a.toString() in this.map
};
gc.deserializeBinary = function (a) {
    for (var b = void 0, c = void 0; F(void 0) && !D(void 0);) {
        var f = (void 0).getFieldNumber();
        1 == f ? b = (void 0).call(void 0) : 2 == f && (a.valueCtor ? (k
                .asserts.assert(void 0), c || (c = new a.valueCtor), (
                    void 0).call(void 0, c, void 0)) : c = (void 0)
            .call(void 0))
    }
    k.asserts.assert(void 0 != b);
    k.asserts.assert(void 0 != c);
    a.set(b, c)
};
var ic = function (a) {
        a = a.map;
        var b = [],
            c;
        for (c in a) Object.prototype.hasOwnProperty.call(a, c) && b.push(c);
        return b
    },
    fc = function (a, b) {
        this.key = a;
        this.value = b;
        this.valueWrapper = void 0
    },
    kc = function (a) {
        this.idx_ = 0;
        this.arr_ = a
    };
kc.prototype.next = function () {
    return this.idx_ < this.arr_.length ? {
        done: !1,
        value: this.arr_[this.idx_++]
    } : {
        done: !0,
        value: void 0
    }
};
"undefined" != typeof Symbol && "undefined" != typeof Symbol.iterator && (kc
    .prototype[Symbol.iterator] = function () {
        return this
    });
x.Map = gc;
var L = function () {};
L.GENERATE_TO_OBJECT = !0;
L.GENERATE_FROM_OBJECT = !k.DISALLOW_TEST_ONLY_CODE;
L.GENERATE_TO_STRING = !0;
L.SERIALIZE_EMPTY_TRAILING_FIELDS = !0;
L.SUPPORTS_UINT8ARRAY_ = "function" == typeof Uint8Array;
L.getFieldNumber = function (a, b) {
    return b - a.arrayIndexOffset_
};
var M = function (a, b, c, f, g) {
    a.wrappers_ = null;
    b || (b = []);
    a.messageId_ = void 0;
    a.arrayIndexOffset_ = -1;
    a.array = b;
    a: {
        var h = a.array.length;b = -1;
        if (h && (b = h - 1, h = a.array[b], lc(h))) {
            a.pivot_ = L.getFieldNumber(a, b);
            a.extensionObject_ = h;
            break a
        } - 1 < c ? (a.pivot_ = Math.max(c, L.getFieldNumber(a, b + 1)),
            a.extensionObject_ = null) : a.pivot_ = Number.MAX_VALUE
    }
    a.convertedPrimitiveFields_ = {};
    L.SERIALIZE_EMPTY_TRAILING_FIELDS || (a.repeatedFields = f);
    if (f)
        for (c = 0; c < f.length; c++) b = f[c], b < a.pivot_ ? (b += a
            .arrayIndexOffset_, a.array[b] = a.array[b] ||
            L.EMPTY_LIST_SENTINEL_) : (mc(a), a.extensionObject_[b] = a
            .extensionObject_[b] || L.EMPTY_LIST_SENTINEL_);
    if (g && g.length)
        for (c = 0; c < g.length; c++) nc(a, g[c])
};
L.EMPTY_LIST_SENTINEL_ = k.DEBUG && Object.freeze ? Object.freeze([]) : [];
var lc = function (a) {
        return null !== a && "object" == typeof a && !Array.isArray(a) && !(L
            .SUPPORTS_UINT8ARRAY_ && a instanceof Uint8Array)
    },
    mc = function (a) {
        var b = a.pivot_ + a.arrayIndexOffset_;
        a.array[b] || (L.isFrozen(a) ? (a.extensionObject_ = {}, Object.freeze(a
            .extensionObject_)) : a.extensionObject_ = a.array[b] = {})
    },
    N = function (a, b, c) {
        for (var f = [], g = 0; g < a.length; g++) f[g] = b.call(a[g], c, a[g]);
        return f
    },
    pc = function (a, b, c, f, g) {
        for (var h in c)
            if (oc(c, h)) {
                var l = c[h],
                    r = f.call(a, l);
                if (null != r) {
                    for (var v in l.fieldName)
                        if (l.fieldName.hasOwnProperty(v)) break;
                    b[v] = l.toObjectFn ? l.isRepeated ? N(r, l.toObjectFn, g) :
                        l.toObjectFn(g, r) : r
                }
            }
    },
    qc = function (a, b, c, f) {
        for (var g in c)
            if (oc(c, g)) {
                var h = c[g],
                    l = h.fieldInfo;
                if (!h.binaryWriterFn) throw Error(
                    "Message extension present that was generated without binary serialization support"
                    );
                var r = f.call(a, l);
                if (null != r)
                    if (l.ctor)
                        if (h.binaryMessageSerializeFn) h.binaryWriterFn.call(b,
                            l.fieldIndex, r, h.binaryMessageSerializeFn);
                        else throw Error(
                            "Message extension present holding submessage without binary support enabled, and message is being serialized to binary format"
                            );
                else h.binaryWriterFn.call(b, l.fieldIndex, r)
            }
    },
    rc = function (a, b, c, f, g) {
        var h = c[b.getFieldNumber()];
        if (h) {
            c = h.fieldInfo;
            if (!h.binaryReaderFn) throw Error(
                "Deserializing extension whose generated code does not support binary format"
                );
            if (c.ctor) {
                var l = new c.ctor;
                h.binaryReaderFn.call(b, l, h.binaryMessageDeserializeFn)
            } else l = h.binaryReaderFn.call(b);
            c.isRepeated && !h.isPacked ? (b = f.call(a, c)) ? b.push(l) : g
                .call(a, c, [l]) : g.call(a, c, l)
        } else G(b)
    },
    O = function (a, b) {
        if (b < a.pivot_) {
            b += a.arrayIndexOffset_;
            var c = a.array[b];
            return c !== L.EMPTY_LIST_SENTINEL_ || L.isFrozen(a) ? c : a.array[
                b] = []
        }
        if (a.extensionObject_) return c = a.extensionObject_[b], c === L
            .EMPTY_LIST_SENTINEL_ ? a.extensionObject_[b] = [] : c
    },
    sc = function (a, b) {
        b = O(a, b);
        L.isFrozen(a) && L.internalMarkFrozen(b);
        return b
    },
    vc = function (a, b) {
        a = O(a, b);
        return null == a ? a : +a
    },
    wc = function (a, b) {
        a = O(a, b);
        return null == a ? a : !!a
    },
    xc = function (a) {
        if (null == a || "string" === typeof a) return a;
        if (L.SUPPORTS_UINT8ARRAY_ && a instanceof Uint8Array) return k.crypt
            .base64.encodeByteArray(a);
        k.asserts.fail("Cannot coerce to b64 string: " +
            k.typeOf(a));
        return null
    },
    yc = function (a, b) {
        var c = void 0 === c ? 0 : c;
        a = vc(a, b);
        return null == a ? c : a
    },
    P = function (a, b, c) {
        k.asserts.assertInstanceof(a, L);
        L.checkNotFrozen_(a);
        b < a.pivot_ ? a.array[b + a.arrayIndexOffset_] = c : (mc(a), a
            .extensionObject_[b] = c);
        return a
    },
    zc = function (a, b, c) {
        k.asserts.assertInstanceof(a, L);
        L.checkNotFrozen_(a);
        0 !== c ? P(a, b, c) : b < a.pivot_ ? a.array[b + a.arrayIndexOffset_] =
            null : (mc(a), delete a.extensionObject_[b])
    },
    Ac = function (a, b, c) {
        k.asserts.assertInstanceof(a, L);
        L.checkNotFrozen_(a);
        sc(a, b).push(c)
    },
    Bc = function (a, b, c, f) {
        k.asserts.assertInstanceof(a, L);
        L.checkNotFrozen_(a);
        (c = nc(a, c)) && c !== b && void 0 !== f && (a.wrappers_ && c in a
            .wrappers_ && (a.wrappers_[c] = void 0), P(a, c, void 0));
        P(a, b, f)
    },
    nc = function (a, b) {
        for (var c, f, g = L.isFrozen(a), h = 0; h < b.length; h++) {
            var l = b[h],
                r = O(a, l);
            null != r && (c = l, f = r, g || P(a, l, void 0))
        }
        return c ? (g || P(a, c, f), c) : 0
    },
    Q = function (a, b, c) {
        a.wrappers_ || (a.wrappers_ = {});
        if (!a.wrappers_[c]) {
            var f = O(a, c);
            f && (a.wrappers_[c] = new b(f), L.isFrozen(a) && L
                .internalMarkFrozen(a.wrappers_[c]))
        }
        return a.wrappers_[c]
    },
    R = function (a, b, c) {
        a.wrappers_ || (a.wrappers_ = {});
        if (!a.wrappers_[c]) {
            for (var f = sc(a, c), g = [], h = 0; h < f.length; h++) g[h] =
                new b(f[h]), L.isFrozen(a) && L.internalMarkFrozen(g[h]);
            L.isFrozen(a) && L.internalMarkFrozen(g);
            a.wrappers_[c] = g
        }
        b = a.wrappers_[c];
        b == L.EMPTY_LIST_SENTINEL_ && (b = a.wrappers_[c] = []);
        return b
    },
    S = function (a, b, c) {
        k.asserts.assertInstanceof(a, L);
        L.checkNotFrozen_(a);
        a.wrappers_ || (a.wrappers_ = {});
        var f = c ? L.toArrayHelper_(c, !0) : c;
        a.wrappers_[b] = c;
        return P(a, b, f)
    },
    U = function (a, b, c, f) {
        k.asserts.assertInstanceof(a,
            L);
        L.checkNotFrozen_(a);
        a.wrappers_ || (a.wrappers_ = {});
        var g = f ? L.toArrayHelper_(f, !0) : f;
        a.wrappers_[b] = f;
        Bc(a, b, c, g)
    },
    V = function (a, b, c) {
        k.asserts.assertInstanceof(a, L);
        L.checkNotFrozen_(a);
        a.wrappers_ || (a.wrappers_ = {});
        c = c || [];
        for (var f = [], g = 0; g < c.length; g++) f[g] = L.toArrayHelper_(c[g],
            !0);
        a.wrappers_[b] = c;
        P(a, b, f)
    },
    W = function (a, b, c, f) {
        L.checkNotFrozen_(a);
        var g = R(a, f, b);
        c = c ? c : new f;
        a = sc(a, b);
        g.push(c);
        a.push(L.toArrayHelper_(c, !0))
    },
    Cc = function (a, b) {
        if (a.wrappers_)
            for (var c in a.wrappers_)
                if (oc(a.wrappers_,
                        c)) {
                    var f = a.wrappers_[c];
                    if (Array.isArray(f))
                        for (var g = 0; g < f.length; g++) f[g] && L
                            .toArrayHelper_(f[g], b);
                    else f && L.toArrayHelper_(f, b)
                }
    };
L.toArrayHelper_ = function (a, b) {
    return ec.isFreezerLoaded && b ? a.toArrayInternal() : a.toArray()
};
L.prototype.toArray = function () {
    L.checkNotFrozen_(this);
    Cc(this, !1);
    return this.array
};
L.prototype.toArrayInternal = function () {
    Cc(this, !0);
    return this.array
};
L.prototype.serialize = L.SUPPORTS_UINT8ARRAY_ ? function () {
    var a = Uint8Array.prototype.toJSON;
    Uint8Array.prototype.toJSON = function () {
        return k.crypt.base64.encodeByteArray(this)
    };
    try {
        return JSON.stringify(this.array && Dc(L.toArrayHelper_(this, !0),
            this), L.serializeSpecialNumbers_)
    } finally {
        Uint8Array.prototype.toJSON = a
    }
} : function () {
    return JSON.stringify(this.array && Dc(L.toArrayHelper_(this, !0),
        this), L.serializeSpecialNumbers_)
};
var Dc = function (a, b) {
    if (L.SERIALIZE_EMPTY_TRAILING_FIELDS) return a;
    for (var c, f = a.length, g = !1, h, l = a.length; l--;) {
        var r = a[l];
        if (Array.isArray(r)) r = Dc(r, Array.isArray(b) ? b[l] : b && b
                .wrappers_ ? b.wrappers_[L.getFieldNumber(b, l)] : void 0),
            !r.length && b && (Array.isArray(b) || b.repeatedFields && -1 !=
                b.repeatedFields.indexOf(L.getFieldNumber(b, l)) && (r =
                    null)), r != a[l] && (g = !0);
        else if (lc(r)) {
            a: {
                h = void 0;
                var v = r,
                    E = b && k.asserts.assertInstanceof(b, L),
                    H = {},
                    ia = !1;
                for (h in v)
                    if (oc(v, h)) {
                        var xa = v[h];
                        if (Array.isArray(xa)) {
                            var fb =
                                Dc(xa, E && E.wrappers_ && E.wrappers_[h]);
                            !fb.length && E && E.repeatedFields && -1 != E
                                .repeatedFields.indexOf(+h) || (H[h] = fb);
                            H[h] != xa && (ia = !0)
                        } else null != xa ? H[h] = xa : ia = !0
                    } if (ia) {
                    for (h in H) {
                        h = H;
                        break a
                    }
                    h = null
                } else h = v
            }
            h != r && (g = !0);f--;
            continue
        }
        null == r && f == l + 1 ? (g = !0, f--) : g && (c || (c = a.slice(0,
            f)), c[l] = r)
    }
    if (!g) return a;
    c || (c = a.slice(0, f));
    h && c.push(h);
    return c
};
L.serializeSpecialNumbers_ = function (a, b) {
    return "number" !== typeof b || !isNaN(b) && Infinity !== b && -
        Infinity !== b ? b : String(b)
};
var X = function (a, b) {
    a = new a(b ? JSON.parse(b) : null);
    k.asserts.assertInstanceof(a, L);
    return a
};
L.GENERATE_TO_STRING && (L.prototype.toString = function () {
    return L.toArrayHelper_(this, !0).toString()
});
L.prototype.getExtension = function (a) {
    mc(this);
    this.wrappers_ || (this.wrappers_ = {});
    var b = L.isFrozen(this),
        c = a.fieldIndex;
    return a.isRepeated ? a.ctor ? (this.wrappers_[c] || (this.wrappers_[
                c] = p(this.extensionObject_[c] || [], function (f) {
                    f = new a.ctor(f);
                    b && L.internalMarkFrozen(f);
                    return f
                })), b && L.internalMarkFrozen(this.wrappers_[c]), this
            .wrappers_[c]) : b ? (c = this.extensionObject_[c], c || (
        c = [], L.internalMarkFrozen(c)), c) : this.extensionObject_[c] =
        this.extensionObject_[c] || [] : a.ctor ? (!this.wrappers_[c] &&
            this.extensionObject_[c] &&
            (this.wrappers_[c] = new a.ctor(this.extensionObject_[c]), b &&
                L.internalMarkFrozen(this.wrappers_[c])), this.wrappers_[c]
            ) : this.extensionObject_[c]
};
L.prototype.setExtension = function (a, b) {
    L.checkNotFrozen_(this);
    this.wrappers_ || (this.wrappers_ = {});
    mc(this);
    var c = a.fieldIndex;
    a.isRepeated ? (b = b || [], a.ctor ? (this.wrappers_[c] = b, this
        .extensionObject_[c] = p(b, function (f) {
            return L.toArrayHelper_(f, !0)
        })) : this.extensionObject_[c] = b) : a.ctor ? (this.wrappers_[
        c] = b, this.extensionObject_[c] = b ? L.toArrayHelper_(b, !
        0) : b) : this.extensionObject_[c] = b;
    return this
};
L.difference = function (a, b) {
    if (!(a instanceof b.constructor)) throw Error(
        "Messages have different types.");
    var c = L.toArrayHelper_(a, !0);
    b = L.toArrayHelper_(b, !0);
    var f = [],
        g = 0,
        h = c.length > b.length ? c.length : b.length;
    a.messageId_ && (f[0] = a.messageId_, g = 1);
    for (; g < h; g++) Ec(c[g], b[g]) || (f[g] = b[g]);
    return new a.constructor(f)
};
L.equals = function (a, b) {
    return a == b || !(!a || !b) && a instanceof b.constructor && Ec(L
        .toArrayHelper_(a, !0), L.toArrayHelper_(b, !0))
};
var Fc = function (a, b) {
        a = a || {};
        b = b || {};
        var c = {},
            f;
        for (f in a) oc(a, f) && (c[f] = 0);
        for (f in b) oc(b, f) && (c[f] = 0);
        for (f in c)
            if (oc(c, f) && !Ec(a[f], b[f])) return !1;
        return !0
    },
    Ec = function (a, b) {
        if (a == b) return !0;
        if (!k.isObject(a) || !k.isObject(b)) return "number" === typeof a &&
            isNaN(a) || "number" === typeof b && isNaN(b) ? String(a) ==
            String(b) : !1;
        if (a.constructor != b.constructor) return !1;
        if (L.SUPPORTS_UINT8ARRAY_ && a.constructor === Uint8Array) {
            if (a.length != b.length) return !1;
            for (var c = 0; c < a.length; c++)
                if (a[c] != b[c]) return !1;
            return !0
        }
        if (a.constructor ===
            Array) {
            var f = void 0,
                g = void 0,
                h = Math.max(a.length, b.length);
            for (c = 0; c < h; c++) {
                var l = a[c],
                    r = b[c];
                l && l.constructor == Object && (k.asserts.assert(void 0 === f),
                    k.asserts.assert(c === a.length - 1), f = l, l = void 0);
                r && r.constructor == Object && (k.asserts.assert(void 0 === g),
                    k.asserts.assert(c === b.length - 1), g = r, r = void 0);
                if (!Ec(l, r)) return !1
            }
            return f || g ? (f = f || {}, g = g || {}, Fc(f, g)) : !0
        }
        if (a.constructor === Object) return Fc(a, b);
        throw Error("Invalid type in JSPB array");
    };
L.prototype.cloneMessage = function () {
    return L.cloneMessage(this)
};
L.prototype.clone = function () {
    return L.cloneMessage(this)
};
L.clone = function (a) {
    return L.cloneMessage(a)
};
L.cloneMessage = function (a) {
    return new a.constructor(Gc(L.toArrayHelper_(a, !0)))
};
var Gc = function (a) {
    if (Array.isArray(a)) {
        for (var b = Array(a.length), c = 0; c < a.length; c++) {
            var f = a[c];
            null != f && (b[c] = "object" == typeof f ? Gc(k.asserts.assert(
                f)) : f)
        }
        return b
    }
    if (L.SUPPORTS_UINT8ARRAY_ && a instanceof Uint8Array)
    return new Uint8Array(a);
    b = {};
    for (c in a) oc(a, c) && (f = a[c], null != f && (b[c] = "object" ==
        typeof f ? Gc(k.asserts.assert(f)) : f));
    return b
};
L.messageSetExtensions = {};
L.messageSetExtensionsBinary = {};
L.isFrozen = function (a) {
    if (ec.isFreezerLoaded) {
        var b = !a.extensionObject_ || Object.isFrozen(a.extensionObject_);
        return Object.isFrozen(a.array) && b
    }
    return !1
};
L.internalMarkFrozen = function (a) {
    k.asserts.assert(ec.isFreezerLoaded);
    Array.isArray(a) ? Object.freeze(a) : (Object.freeze(a.array), a
        .extensionObject_ && Object.freeze(a.extensionObject_))
};
L.checkNotFrozen_ = function (a) {
    if (ec.isFreezerLoaded && L.isFrozen(a)) throw Error(
        "Cannot mutate a frozen Message");
};

function oc(a, b) {
    return k.TRUSTED_SITE || Object.prototype.hasOwnProperty.call(a, b)
}
x.Message = L;
var Y = {
    google: {}
};
Y.google.type = {};
Y.google.type.LatLng = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.google.type.LatLng, L);
L.GENERATE_TO_OBJECT && (Y.google.type.LatLng.prototype.toObject = function (
a) {
    return Y.google.type.LatLng.toObject(a, this)
}, Y.google.type.LatLng.toObject = function (a, b) {
    var c = {
        latitude: yc(b, 1),
        longitude: yc(b, 2)
    };
    a && (c.$jspbMessageInstance = b);
    return c
});
L.GENERATE_FROM_OBJECT && (Y.google.type.LatLng.ObjectFormat = function () {}, Y
    .google.type.LatLng.fromObject = function (a) {
        var b = new Y.google.type.LatLng;
        null != a.latitude && P(b, 1, a.latitude);
        null != a.longitude && P(b, 2, a.longitude);
        return b
    });
Y.google.type.LatLng.deserializeBinary = function (a) {
    return Y.google.type.LatLng.deserializeBinaryFromReader(new Y.google
        .type.LatLng, new C(a))
};
Y.google.type.LatLng.deserializeBinaryFromReader = function (a, b) {
    for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
        case 1:
            var c = b.readDouble();
            zc(a, 1, c);
            break;
        case 2:
            c = b.readDouble();
            zc(a, 2, c);
            break;
        default:
            G(b)
    }
    return a
};
Y.google.type.LatLng.serializeBinaryToWriter = function (a, b) {
    var c = yc(a, 1);
    0 !== c && b.writeDouble(1, c);
    c = yc(a, 2);
    0 !== c && b.writeDouble(2, c)
};
Y.google.type.LatLng.deserialize = function (a) {
    return X(Y.google.type.LatLng, a)
};
Y.postaladdress = {};
Y.postaladdress.PostalAddress = function (a) {
    M(this, a, -1, Y.postaladdress.PostalAddress.repeatedFields_, null)
};
k.inherits(Y.postaladdress.PostalAddress, L);
Y.postaladdress.PostalAddress.repeatedFields_ = [14];
L.GENERATE_TO_OBJECT && (Y.postaladdress.PostalAddress.prototype.toObject =
    function (a) {
        return Y.postaladdress.PostalAddress.toObject(a, this)
    }, Y.postaladdress.PostalAddress.toObject = function (a, b) {
        var c, f = {
            countryNameCode: null == (c = O(b, 1)) ? void 0 : c,
            countryName: null == (c = O(b, 2)) ? void 0 : c,
            isDisputed: null == (c = wc(b, 31)) ? void 0 : c,
            languageCode: null == (c = O(b, 26)) ? void 0 : c,
            administrativeAreaName: null == (c = O(b, 3)) ? void 0 : c,
            subAdministrativeAreaName: null == (c = O(b, 4)) ? void 0 :
                c,
            localityName: null == (c = O(b, 5)) ? void 0 : c,
            dependentLocalityName: null ==
                (c = O(b, 17)) ? void 0 : c,
            thoroughfareName: null == (c = O(b, 6)) ? void 0 : c,
            thoroughfareNumber: null == (c = O(b, 11)) ? void 0 : c,
            dependentThoroughfareName: null == (c = O(b, 21)) ? void 0 :
                c,
            postalCodeNumber: null == (c = O(b, 12)) ? void 0 : c,
            postalCodeNumberExtension: null == (c = O(b, 13)) ? void 0 :
                c,
            sortingCode: null == (c = O(b, 29)) ? void 0 : c,
            postBoxNumber: null == (c = O(b, 30)) ? void 0 : c,
            premiseName: null == (c = O(b, 15)) ? void 0 : c,
            subPremiseName: null == (c = O(b, 16)) ? void 0 : c,
            addressLineList: null == (c = sc(b, 14)) ? void 0 : c,
            firmName: null == (c = O(b, 27)) ? void 0 : c,
            recipientName: null == (c = O(b, 28)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.postaladdress.PostalAddress.ObjectFormat =
    function () {}, Y.postaladdress.PostalAddress.fromObject = function (
    a) {
        var b = new Y.postaladdress.PostalAddress;
        null != a.countryNameCode && P(b, 1, a.countryNameCode);
        null != a.countryName && P(b, 2, a.countryName);
        null != a.isDisputed && P(b, 31, a.isDisputed);
        null != a.languageCode && P(b, 26, a.languageCode);
        null != a.administrativeAreaName && P(b, 3, a
            .administrativeAreaName);
        null != a.subAdministrativeAreaName && P(b, 4, a
            .subAdministrativeAreaName);
        null != a.localityName &&
            P(b, 5, a.localityName);
        null != a.dependentLocalityName && P(b, 17, a
        .dependentLocalityName);
        null != a.thoroughfareName && P(b, 6, a.thoroughfareName);
        null != a.thoroughfareNumber && P(b, 11, a.thoroughfareNumber);
        null != a.dependentThoroughfareName && P(b, 21, a
            .dependentThoroughfareName);
        null != a.postalCodeNumber && P(b, 12, a.postalCodeNumber);
        null != a.postalCodeNumberExtension && P(b, 13, a
            .postalCodeNumberExtension);
        null != a.sortingCode && P(b, 29, a.sortingCode);
        null != a.postBoxNumber && P(b, 30, a.postBoxNumber);
        null != a.premiseName && P(b,
            15, a.premiseName);
        null != a.subPremiseName && P(b, 16, a.subPremiseName);
        null != a.addressLineList && P(b, 14, a.addressLineList);
        null != a.firmName && P(b, 27, a.firmName);
        null != a.recipientName && P(b, 28, a.recipientName);
        return b
    });
Y.postaladdress.PostalAddress.deserializeBinary = function (a) {
    return Y.postaladdress.PostalAddress.deserializeBinaryFromReader(new Y
        .postaladdress.PostalAddress, new C(a))
};
Y.postaladdress.PostalAddress.deserializeBinaryFromReader = function (a, b) {
    for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
        case 1:
            var c = b.readString();
            P(a, 1, c);
            break;
        case 2:
            c = b.readString();
            P(a, 2, c);
            break;
        case 31:
            c = b.readBool();
            P(a, 31, c);
            break;
        case 26:
            c = b.readString();
            P(a, 26, c);
            break;
        case 3:
            c = b.readString();
            P(a, 3, c);
            break;
        case 4:
            c = b.readString();
            P(a, 4, c);
            break;
        case 5:
            c = b.readString();
            P(a, 5, c);
            break;
        case 17:
            c = b.readString();
            P(a, 17, c);
            break;
        case 6:
            c = b.readString();
            P(a, 6, c);
            break;
        case 11:
            c = b.readString();
            P(a, 11, c);
            break;
        case 21:
            c = b.readString();
            P(a, 21, c);
            break;
        case 12:
            c = b.readString();
            P(a, 12, c);
            break;
        case 13:
            c = b.readString();
            P(a, 13, c);
            break;
        case 29:
            c = b.readString();
            P(a, 29, c);
            break;
        case 30:
            c = b.readString();
            P(a, 30, c);
            break;
        case 15:
            c = b.readString();
            P(a, 15, c);
            break;
        case 16:
            c = b.readString();
            P(a, 16, c);
            break;
        case 14:
            c = b.readString();
            Ac(a, 14, c);
            break;
        case 27:
            c = b.readString();
            P(a, 27, c);
            break;
        case 28:
            c = b.readString();
            P(a, 28, c);
            break;
        default:
            G(b)
    }
    return a
};
Y.postaladdress.PostalAddress.serializeBinaryToWriter = function (a, b) {
    var c = O(a, 1);
    null != c && b.writeString(1, c);
    c = O(a, 2);
    null != c && b.writeString(2, c);
    c = O(a, 31);
    null != c && b.writeBool(31, c);
    c = O(a, 26);
    null != c && b.writeString(26, c);
    c = O(a, 3);
    null != c && b.writeString(3, c);
    c = O(a, 4);
    null != c && b.writeString(4, c);
    c = O(a, 5);
    null != c && b.writeString(5, c);
    c = O(a, 17);
    null != c && b.writeString(17, c);
    c = O(a, 6);
    null != c && b.writeString(6, c);
    c = O(a, 11);
    null != c && b.writeString(11, c);
    c = O(a, 21);
    null != c && b.writeString(21, c);
    c = O(a, 12);
    null !=
        c && b.writeString(12, c);
    c = O(a, 13);
    null != c && b.writeString(13, c);
    c = O(a, 29);
    null != c && b.writeString(29, c);
    c = O(a, 30);
    null != c && b.writeString(30, c);
    c = O(a, 15);
    null != c && b.writeString(15, c);
    c = O(a, 16);
    null != c && b.writeString(16, c);
    c = sc(a, 14);
    0 < c.length && bc(b, 14, c);
    c = O(a, 27);
    null != c && b.writeString(27, c);
    c = O(a, 28);
    null != c && b.writeString(28, c)
};
Y.postaladdress.PostalAddress.messageSetExtension = new cc(3514611, {
        messageSetExtension: 0
    }, Y.postaladdress.PostalAddress, Y.postaladdress.PostalAddress
    .toObject, 0);
L.messageSetExtensionsBinary[3514611] = new dc(Y.postaladdress.PostalAddress
    .messageSetExtension, C.prototype.readMessage, Wb.prototype
    .writeMessageSet, Y.postaladdress.PostalAddress.serializeBinaryToWriter,
    Y.postaladdress.PostalAddress.deserializeBinaryFromReader, !1);
L.messageSetExtensions[3514611] = Y.postaladdress.PostalAddress
    .messageSetExtension;
Y.postaladdress.PostalAddress.deserialize = function (a) {
    return X(Y.postaladdress.PostalAddress, a)
};
Y.moneta = {};
Y.moneta.integrator = {};
Y.moneta.integrator.common = {};
Y.moneta.integrator.common.FundsGuaranteeId = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.FundsGuaranteeId, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.FundsGuaranteeId.prototype
    .toObject = function (a) {
        return Y.moneta.integrator.common.FundsGuaranteeId.toObject(a, this)
    }, Y.moneta.integrator.common.FundsGuaranteeId.toObject = function (a,
        b) {
        var c, f = {
            billableService: null == (c = O(b, 1)) ? void 0 : c,
            fundsGuaranteeRequestId: null == (c = O(b, 2)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.FundsGuaranteeId
    .ObjectFormat = function () {}, Y.moneta.integrator.common
    .FundsGuaranteeId.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.FundsGuaranteeId;
        null != a.billableService && P(b, 1, a.billableService);
        null != a.fundsGuaranteeRequestId && P(b, 2, a
            .fundsGuaranteeRequestId);
        return b
    });
Y.moneta.integrator.common.FundsGuaranteeId.deserializeBinary = function (a) {
    return Y.moneta.integrator.common.FundsGuaranteeId
        .deserializeBinaryFromReader(new Y.moneta.integrator.common
            .FundsGuaranteeId, new C(a))
};
Y.moneta.integrator.common.FundsGuaranteeId.deserializeBinaryFromReader =
    function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readInt32();
                a.setBillableService(c);
                break;
            case 2:
                c = b.readString();
                P(a, 2, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.FundsGuaranteeId.serializeBinaryToWriter = function (
    a, b) {
    var c = O(a, 1);
    null != c && b.writeInt32(1, c);
    c = O(a, 2);
    null != c && b.writeString(2, c)
};
Y.moneta.integrator.common.FundsGuaranteeId.prototype.setBillableService =
    function (a) {
        P(this, 1, a)
    };
Y.moneta.integrator.common.FundsGuaranteeId.deserialize = function (a) {
    return X(Y.moneta.integrator.common.FundsGuaranteeId, a)
};
Y.moneta.integrator.common.ProductCorrelationId = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.ProductCorrelationId, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.ProductCorrelationId
    .prototype.toObject = function (a) {
        return Y.moneta.integrator.common.ProductCorrelationId.toObject(a,
            this)
    }, Y.moneta.integrator.common.ProductCorrelationId.toObject = function (
        a, b) {
        var c, f = {
            billableService: null == (c = O(b, 1)) ? void 0 : c,
            productAccountKey: null == (c = O(b, 2)) ? void 0 : c,
            productOrderLineKey: null == (c = O(b, 3)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.ProductCorrelationId
    .ObjectFormat = function () {}, Y.moneta.integrator.common
    .ProductCorrelationId.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.ProductCorrelationId;
        null != a.billableService && P(b, 1, a.billableService);
        null != a.productAccountKey && P(b, 2, a.productAccountKey);
        null != a.productOrderLineKey && P(b, 3, a.productOrderLineKey);
        return b
    });
Y.moneta.integrator.common.ProductCorrelationId.deserializeBinary = function (
a) {
    return Y.moneta.integrator.common.ProductCorrelationId
        .deserializeBinaryFromReader(new Y.moneta.integrator.common
            .ProductCorrelationId, new C(a))
};
Y.moneta.integrator.common.ProductCorrelationId.deserializeBinaryFromReader =
    function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readInt32();
                a.setBillableService(c);
                break;
            case 2:
                c = b.readString();
                P(a, 2, c);
                break;
            case 3:
                c = b.readString();
                P(a, 3, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.ProductCorrelationId.serializeBinaryToWriter =
    function (a, b) {
        var c = O(a, 1);
        null != c && b.writeInt32(1, c);
        c = O(a, 2);
        null != c && b.writeString(2, c);
        c = O(a, 3);
        null != c && b.writeString(3, c)
    };
Y.moneta.integrator.common.ProductCorrelationId.prototype.setBillableService =
    function (a) {
        P(this, 1, a)
    };
Y.moneta.integrator.common.ProductCorrelationId.deserialize = function (a) {
    return X(Y.moneta.integrator.common.ProductCorrelationId, a)
};
Y.moneta.integrator.common.SubscriptionId = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.SubscriptionId, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.SubscriptionId.prototype
    .toObject = function (a) {
        return Y.moneta.integrator.common.SubscriptionId.toObject(a, this)
    }, Y.moneta.integrator.common.SubscriptionId.toObject = function (a,
    b) {
        var c, f = {
            billableService: null == (c = O(b, 1)) ? void 0 : c,
            requestId: null == (c = O(b, 2)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.SubscriptionId
    .ObjectFormat = function () {}, Y.moneta.integrator.common
    .SubscriptionId.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.SubscriptionId;
        null != a.billableService && P(b, 1, a.billableService);
        null != a.requestId && P(b, 2, a.requestId);
        return b
    });
Y.moneta.integrator.common.SubscriptionId.deserializeBinary = function (a) {
    return Y.moneta.integrator.common.SubscriptionId
        .deserializeBinaryFromReader(new Y.moneta.integrator.common
            .SubscriptionId, new C(a))
};
Y.moneta.integrator.common.SubscriptionId.deserializeBinaryFromReader =
    function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readInt32();
                a.setBillableService(c);
                break;
            case 2:
                c = b.readString();
                a.setRequestId(c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.SubscriptionId.serializeBinaryToWriter = function (a,
    b) {
    var c = O(a, 1);
    null != c && b.writeInt32(1, c);
    c = O(a, 2);
    null != c && b.writeString(2, c)
};
Y.moneta.integrator.common.SubscriptionId.prototype.setBillableService =
    function (a) {
        P(this, 1, a)
    };
Y.moneta.integrator.common.SubscriptionId.prototype.setRequestId = function (
a) {
    P(this, 2, a)
};
Y.moneta.integrator.common.SubscriptionId.deserialize = function (a) {
    return X(Y.moneta.integrator.common.SubscriptionId, a)
};
Y.moneta.integrator.callbacks = {};
Y.moneta.integrator.callbacks.common = {};
Y.moneta.integrator.callbacks.common.CallbackRequestHeader = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.callbacks.common.CallbackRequestHeader, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.callbacks.common
    .CallbackRequestHeader.prototype.toObject = function (a) {
        return Y.moneta.integrator.callbacks.common.CallbackRequestHeader
            .toObject(a, this)
    }, Y.moneta.integrator.callbacks.common.CallbackRequestHeader.toObject =
    function (a, b) {
        var c, f = {
            productCorrelationId: (c = b.getProductCorrelationId()) && Y
                .moneta.integrator.common.ProductCorrelationId.toObject(
                    a, c),
            fundsGuaranteeId: (c = b.getFundsGuaranteeId()) && Y.moneta
                .integrator.common.FundsGuaranteeId.toObject(a,
                    c),
            subscriptionId: (c = b.getSubscriptionId()) && Y.moneta
                .integrator.common.SubscriptionId.toObject(a, c),
            billingCustomerNumber: null == (c = O(b, 6)) ? void 0 : c,
            billableService: null == (c = O(b, 4)) ? void 0 : c,
            requestSequenceNumber: null == (c = O(b, 2)) ? void 0 : c,
            resourceForPermissionCheck: null == (c = O(b, 5)) ? void 0 :
                c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.callbacks.common
    .CallbackRequestHeader.ObjectFormat = function () {}, Y.moneta
    .integrator.callbacks.common.CallbackRequestHeader.fromObject =
    function (a) {
        var b = new Y.moneta.integrator.callbacks.common
            .CallbackRequestHeader;
        a.productCorrelationId && S(b, 1, Y.moneta.integrator.common
            .ProductCorrelationId.fromObject(a.productCorrelationId));
        a.fundsGuaranteeId && S(b, 3, Y.moneta.integrator.common
            .FundsGuaranteeId.fromObject(a.fundsGuaranteeId));
        a.subscriptionId && S(b, 7,
            Y.moneta.integrator.common.SubscriptionId.fromObject(a
                .subscriptionId));
        null != a.billingCustomerNumber && P(b, 6, a.billingCustomerNumber);
        null != a.billableService && P(b, 4, a.billableService);
        null != a.requestSequenceNumber && P(b, 2, a.requestSequenceNumber);
        null != a.resourceForPermissionCheck && P(b, 5, a
            .resourceForPermissionCheck);
        return b
    });
Y.moneta.integrator.callbacks.common.CallbackRequestHeader.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.callbacks.common.CallbackRequestHeader
            .deserializeBinaryFromReader(new Y.moneta.integrator.callbacks
                .common.CallbackRequestHeader, new C(a))
    };
Y.moneta.integrator.callbacks.common.CallbackRequestHeader
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = new Y.moneta.integrator.common.ProductCorrelationId;
                b.readMessage(c, Y.moneta.integrator.common
                    .ProductCorrelationId.deserializeBinaryFromReader);
                a.setProductCorrelationId(c);
                break;
            case 3:
                c = new Y.moneta.integrator.common.FundsGuaranteeId;
                b.readMessage(c, Y.moneta.integrator.common.FundsGuaranteeId
                    .deserializeBinaryFromReader);
                a.setFundsGuaranteeId(c);
                break;
            case 7:
                c = new Y.moneta.integrator.common.SubscriptionId;
                b.readMessage(c, Y.moneta.integrator.common.SubscriptionId
                    .deserializeBinaryFromReader);
                a.setSubscriptionId(c);
                break;
            case 6:
                c = b.readInt64();
                a.setBillingCustomerNumber(c);
                break;
            case 4:
                c = b.readInt32();
                a.setBillableService(c);
                break;
            case 2:
                c = b.readInt64();
                P(a, 2, c);
                break;
            case 5:
                c = b.readString();
                P(a, 5, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.callbacks.common.CallbackRequestHeader
    .serializeBinaryToWriter = function (a, b) {
        var c = a.getProductCorrelationId();
        null != c && J(b, 1, c, Y.moneta.integrator.common.ProductCorrelationId
            .serializeBinaryToWriter);
        c = a.getFundsGuaranteeId();
        null != c && J(b, 3, c, Y.moneta.integrator.common.FundsGuaranteeId
            .serializeBinaryToWriter);
        c = a.getSubscriptionId();
        null != c && J(b, 7, c, Y.moneta.integrator.common.SubscriptionId
            .serializeBinaryToWriter);
        c = O(a, 6);
        null != c && b.writeInt64(6, c);
        c = O(a, 4);
        null != c && b.writeInt32(4,
            c);
        c = O(a, 2);
        null != c && b.writeInt64(2, c);
        c = O(a, 5);
        null != c && b.writeString(5, c)
    };
d = Y.moneta.integrator.callbacks.common.CallbackRequestHeader.prototype;
d.getProductCorrelationId = function () {
    return Q(this, Y.moneta.integrator.common.ProductCorrelationId, 1)
};
d.setProductCorrelationId = function (a) {
    S(this, 1, a)
};
d.getFundsGuaranteeId = function () {
    return Q(this, Y.moneta.integrator.common.FundsGuaranteeId, 3)
};
d.setFundsGuaranteeId = function (a) {
    S(this, 3, a)
};
d.getSubscriptionId = function () {
    return Q(this, Y.moneta.integrator.common.SubscriptionId, 7)
};
d.setSubscriptionId = function (a) {
    S(this, 7, a)
};
d.setBillingCustomerNumber = function (a) {
    P(this, 6, a)
};
d.setBillableService = function (a) {
    P(this, 4, a)
};
Y.moneta.integrator.callbacks.common.CallbackRequestHeader.deserialize =
    function (a) {
        return X(Y.moneta.integrator.callbacks.common.CallbackRequestHeader, a)
    };
Y.moneta.integrator.common.buyflow = {};
Y.moneta.integrator.common.buyflow.CustomFieldValue = function (a) {
    M(this, a, -1, null, Y.moneta.integrator.common.buyflow.CustomFieldValue
        .oneofGroups_)
};
k.inherits(Y.moneta.integrator.common.buyflow.CustomFieldValue, L);
Y.moneta.integrator.common.buyflow.CustomFieldValue.oneofGroups_ = [
    [2, 3]
];
Y.moneta.integrator.common.buyflow.CustomFieldValue.FieldValueCase = {
    FIELD_VALUE_NOT_SET: 0,
    VALUE: 2,
    BOOLEAN_VALUE: 3
};
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.buyflow.CustomFieldValue
    .prototype.toObject = function (a) {
        return Y.moneta.integrator.common.buyflow.CustomFieldValue.toObject(
            a, this)
    }, Y.moneta.integrator.common.buyflow.CustomFieldValue.toObject =
    function (a, b) {
        var c, f = {
            id: null == (c = O(b, 1)) ? void 0 : c,
            value: null == (c = O(b, 2)) ? void 0 : c,
            booleanValue: null == (c = wc(b, 3)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.buyflow.CustomFieldValue
    .ObjectFormat = function () {}, Y.moneta.integrator.common.buyflow
    .CustomFieldValue.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.buyflow.CustomFieldValue;
        null != a.id && P(b, 1, a.id);
        null != a.value && P(b, 2, a.value);
        null != a.booleanValue && P(b, 3, a.booleanValue);
        return b
    });
Y.moneta.integrator.common.buyflow.CustomFieldValue.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.common.buyflow.CustomFieldValue
            .deserializeBinaryFromReader(new Y.moneta.integrator.common.buyflow
                .CustomFieldValue, new C(a))
    };
Y.moneta.integrator.common.buyflow.CustomFieldValue
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readInt32();
                P(a, 1, c);
                break;
            case 2:
                c = b.readString();
                Bc(a, 2, Y.moneta.integrator.common.buyflow.CustomFieldValue
                    .oneofGroups_[0], c);
                break;
            case 3:
                c = b.readBool();
                Bc(a, 3, Y.moneta.integrator.common.buyflow.CustomFieldValue
                    .oneofGroups_[0], c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.buyflow.CustomFieldValue.serializeBinaryToWriter =
    function (a, b) {
        var c = O(a, 1);
        null != c && b.writeInt32(1, c);
        c = O(a, 2);
        null != c && b.writeString(2, c);
        c = O(a, 3);
        null != c && b.writeBool(3, c)
    };
Y.moneta.integrator.common.buyflow.CustomFieldValue.deserialize = function (a) {
    return X(Y.moneta.integrator.common.buyflow.CustomFieldValue, a)
};
Y.moneta.integrator.common.buyflow.CustomSectionDetailsValue = function (a) {
    M(this, a, -1, Y.moneta.integrator.common.buyflow
        .CustomSectionDetailsValue.repeatedFields_, null)
};
k.inherits(Y.moneta.integrator.common.buyflow.CustomSectionDetailsValue, L);
Y.moneta.integrator.common.buyflow.CustomSectionDetailsValue.repeatedFields_ = [
    1
];
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.buyflow
    .CustomSectionDetailsValue.prototype.toObject = function (a) {
        return Y.moneta.integrator.common.buyflow.CustomSectionDetailsValue
            .toObject(a, this)
    }, Y.moneta.integrator.common.buyflow.CustomSectionDetailsValue
    .toObject = function (a, b) {
        var c, f = {
            fieldValueList: N(R(b, Y.moneta.integrator.common.buyflow
                    .CustomFieldValue, 1), Y.moneta.integrator
                .common.buyflow.CustomFieldValue.toObject, a),
            triggerId: null == (c = O(b, 2)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.buyflow
    .CustomSectionDetailsValue.ObjectFormat = function () {}, Y.moneta
    .integrator.common.buyflow.CustomSectionDetailsValue.fromObject =
    function (a) {
        var b = new Y.moneta.integrator.common.buyflow
            .CustomSectionDetailsValue;
        a.fieldValueList && V(b, 1, a.fieldValueList.map(Y.moneta.integrator
            .common.buyflow.CustomFieldValue.fromObject));
        null != a.triggerId && P(b, 2, a.triggerId);
        return b
    });
Y.moneta.integrator.common.buyflow.CustomSectionDetailsValue.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.common.buyflow.CustomSectionDetailsValue
            .deserializeBinaryFromReader(new Y.moneta.integrator.common.buyflow
                .CustomSectionDetailsValue, new C(a))
    };
Y.moneta.integrator.common.buyflow.CustomSectionDetailsValue
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = new Y.moneta.integrator.common.buyflow
                    .CustomFieldValue;
                b.readMessage(c, Y.moneta.integrator.common.buyflow
                    .CustomFieldValue.deserializeBinaryFromReader);
                W(a, 1, c, Y.moneta.integrator.common.buyflow
                    .CustomFieldValue);
                break;
            case 2:
                c = b.readInt32();
                P(a, 2, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.buyflow.CustomSectionDetailsValue
    .serializeBinaryToWriter = function (a, b) {
        var c = R(a, Y.moneta.integrator.common.buyflow.CustomFieldValue, 1);
        0 < c.length && K(b, 1, c, Y.moneta.integrator.common.buyflow
            .CustomFieldValue.serializeBinaryToWriter);
        c = O(a, 2);
        null != c && b.writeInt32(2, c)
    };
Y.moneta.integrator.common.buyflow.CustomSectionDetailsValue.deserialize =
    function (a) {
        return X(Y.moneta.integrator.common.buyflow.CustomSectionDetailsValue,
            a)
    };
Y.html = {};
Y.html.SafeHtmlProto = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.html.SafeHtmlProto, L);
L.GENERATE_TO_OBJECT && (Y.html.SafeHtmlProto.prototype.toObject = function (
a) {
    return Y.html.SafeHtmlProto.toObject(a, this)
}, Y.html.SafeHtmlProto.toObject = function (a, b) {
    var c, f = {
        privateDoNotAccessOrElseSafeHtmlWrappedValue: null == (c =
            O(b, 2)) ? void 0 : c
    };
    a && (f.$jspbMessageInstance = b);
    return f
});
L.GENERATE_FROM_OBJECT && (Y.html.SafeHtmlProto.ObjectFormat = function () {}, Y
    .html.SafeHtmlProto.fromObject = function (a) {
        var b = new Y.html.SafeHtmlProto;
        null != a.privateDoNotAccessOrElseSafeHtmlWrappedValue && P(b, 2, a
            .privateDoNotAccessOrElseSafeHtmlWrappedValue);
        return b
    });
Y.html.SafeHtmlProto.deserializeBinary = function (a) {
    return Y.html.SafeHtmlProto.deserializeBinaryFromReader(new Y.html
        .SafeHtmlProto, new C(a))
};
Y.html.SafeHtmlProto.deserializeBinaryFromReader = function (a, b) {
    for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
        case 2:
            var c = b.readString();
            P(a, 2, c);
            break;
        default:
            G(b)
    }
    return a
};
Y.html.SafeHtmlProto.serializeBinaryToWriter = function (a, b) {
    a = O(a, 2);
    null != a && b.writeString(2, a)
};
Y.html.SafeHtmlProto.deserialize = function (a) {
    return X(Y.html.SafeHtmlProto, a)
};
Y.moneta.integrator.common.buyflow.FinancingParameters = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.buyflow.FinancingParameters, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.buyflow.FinancingParameters
    .prototype.toObject = function (a) {
        return Y.moneta.integrator.common.buyflow.FinancingParameters
            .toObject(a, this)
    }, Y.moneta.integrator.common.buyflow.FinancingParameters.toObject =
    function (a, b) {
        var c, f = {
            userFacingTransactionId: null == (c = O(b, 6)) ? void 0 : c,
            financingProvider: null == (c = O(b, 9)) ? void 0 : c,
            financingType: null == (c = O(b, 1)) ? void 0 : c,
            financingTypeDurationMonths: null == (c = O(b, 4)) ?
                void 0 : c,
            annualPercentageRate: null == (c = vc(b, 8)) ?
                void 0 : c,
            offerDescriptionHtml: (c = Q(b, Y.html.SafeHtmlProto, 2)) &&
                Y.html.SafeHtmlProto.toObject(a, c),
            offerDescription: null == (c = O(b, 7)) ? void 0 : c,
            detailedDescriptionHtml: (c = Q(b, Y.html.SafeHtmlProto,
                5)) && Y.html.SafeHtmlProto.toObject(a, c),
            availableWithoutOffer: null == (c = wc(b, 3)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.buyflow
    .FinancingParameters.ObjectFormat = function () {}, Y.moneta.integrator
    .common.buyflow.FinancingParameters.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.buyflow.FinancingParameters;
        null != a.userFacingTransactionId && P(b, 6, a
            .userFacingTransactionId);
        null != a.financingProvider && P(b, 9, a.financingProvider);
        null != a.financingType && P(b, 1, a.financingType);
        null != a.financingTypeDurationMonths && P(b, 4, a
            .financingTypeDurationMonths);
        null != a.annualPercentageRate &&
            P(b, 8, a.annualPercentageRate);
        a.offerDescriptionHtml && S(b, 2, Y.html.SafeHtmlProto.fromObject(a
            .offerDescriptionHtml));
        null != a.offerDescription && P(b, 7, a.offerDescription);
        a.detailedDescriptionHtml && S(b, 5, Y.html.SafeHtmlProto
            .fromObject(a.detailedDescriptionHtml));
        null != a.availableWithoutOffer && P(b, 3, a.availableWithoutOffer);
        return b
    });
Y.moneta.integrator.common.buyflow.FinancingParameters.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.common.buyflow.FinancingParameters
            .deserializeBinaryFromReader(new Y.moneta.integrator.common.buyflow
                .FinancingParameters, new C(a))
    };
Y.moneta.integrator.common.buyflow.FinancingParameters
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 6:
                var c = b.readString();
                P(a, 6, c);
                break;
            case 9:
                c = b.readEnum();
                P(a, 9, c);
                break;
            case 1:
                c = b.readString();
                P(a, 1, c);
                break;
            case 4:
                c = b.readInt32();
                P(a, 4, c);
                break;
            case 8:
                c = b.readDouble();
                P(a, 8, c);
                break;
            case 2:
                c = new Y.html.SafeHtmlProto;
                b.readMessage(c, Y.html.SafeHtmlProto
                    .deserializeBinaryFromReader);
                S(a, 2, c);
                break;
            case 7:
                c = b.readString();
                P(a, 7, c);
                break;
            case 5:
                c =
                    new Y.html.SafeHtmlProto;
                b.readMessage(c, Y.html.SafeHtmlProto
                    .deserializeBinaryFromReader);
                S(a, 5, c);
                break;
            case 3:
                c = b.readBool();
                P(a, 3, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.buyflow.FinancingParameters.serializeBinaryToWriter =
    function (a, b) {
        var c = O(a, 6);
        null != c && b.writeString(6, c);
        c = O(a, 9);
        null != c && b.writeEnum(9, c);
        c = O(a, 1);
        null != c && b.writeString(1, c);
        c = O(a, 4);
        null != c && b.writeInt32(4, c);
        c = O(a, 8);
        null != c && b.writeDouble(8, c);
        c = Q(a, Y.html.SafeHtmlProto, 2);
        null != c && J(b, 2, c, Y.html.SafeHtmlProto.serializeBinaryToWriter);
        c = O(a, 7);
        null != c && b.writeString(7, c);
        c = Q(a, Y.html.SafeHtmlProto, 5);
        null != c && J(b, 5, c, Y.html.SafeHtmlProto.serializeBinaryToWriter);
        c = O(a, 3);
        null != c && b.writeBool(3, c)
    };
Y.moneta.integrator.common.buyflow.FinancingParameters.FinancingProvider = {
    UNKNOWN: 0,
    SYNCHRONY: 1,
    KLARNA: 2,
    SPLIT_IT: 3
};
Y.moneta.integrator.common.buyflow.FinancingParameters.deserialize = function (
    a) {
    return X(Y.moneta.integrator.common.buyflow.FinancingParameters, a)
};
Y.moneta.integrator.common.Amount = function (a) {
    M(this, a, 3, null, null)
};
k.inherits(Y.moneta.integrator.common.Amount, L);
Y.moneta.integrator.common.Amount.extensions = {};
Y.moneta.integrator.common.Amount.extensionsBinary = {};
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.Amount.prototype.toObject =
    function (a) {
        return Y.moneta.integrator.common.Amount.toObject(a, this)
    }, Y.moneta.integrator.common.Amount.toObject = function (a, b) {
        var c, f = {
            amountInMicros: null == (c = O(b, 1)) ? void 0 : c,
            currency: null == (c = O(b, 2)) ? void 0 : c
        };
        pc(b, f, Y.moneta.integrator.common.Amount.extensions, Y.moneta
            .integrator.common.Amount.prototype.getExtension, a);
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.Amount.ObjectFormat =
    function () {}, Y.moneta.integrator.common.Amount.fromObject =
    function (a) {
        var b = new Y.moneta.integrator.common.Amount;
        null != a.amountInMicros && P(b, 1, a.amountInMicros);
        null != a.currency && P(b, 2, a.currency);
        return b
    });
Y.moneta.integrator.common.Amount.deserializeBinary = function (a) {
    return Y.moneta.integrator.common.Amount.deserializeBinaryFromReader(
        new Y.moneta.integrator.common.Amount, new C(a))
};
Y.moneta.integrator.common.Amount.deserializeBinaryFromReader = function (a,
b) {
    for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
        case 1:
            var c = b.readInt64();
            P(a, 1, c);
            break;
        case 2:
            c = b.readString();
            P(a, 2, c);
            break;
        default:
            rc(a, b, Y.moneta.integrator.common.Amount.extensionsBinary,
                Y.moneta.integrator.common.Amount.prototype
                .getExtension, Y.moneta.integrator.common.Amount
                .prototype.setExtension)
    }
    return a
};
Y.moneta.integrator.common.Amount.serializeBinaryToWriter = function (a, b) {
    var c = O(a, 1);
    null != c && b.writeInt64(1, c);
    c = O(a, 2);
    null != c && b.writeString(2, c);
    qc(a, b, Y.moneta.integrator.common.Amount.extensionsBinary, Y.moneta
        .integrator.common.Amount.prototype.getExtension)
};
Y.moneta.integrator.common.Amount.deserialize = function (a) {
    return X(Y.moneta.integrator.common.Amount, a)
};
Y.moneta.integrator.common.cart = {};
Y.moneta.integrator.common.cart.TaxDetails = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.cart.TaxDetails, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.cart.TaxDetails.prototype
    .toObject = function (a) {
        return Y.moneta.integrator.common.cart.TaxDetails.toObject(a, this)
    }, Y.moneta.integrator.common.cart.TaxDetails.toObject = function (a,
    b) {
        var c, f = {
            pretaxAmount: (c = Hc(b)) && Y.moneta.integrator.common
                .Amount.toObject(a, c),
            taxAmount: (c = Ic(b)) && Y.moneta.integrator.common.Amount
                .toObject(a, c),
            totalAmount: (c = Jc(b)) && Y.moneta.integrator.common
                .Amount.toObject(a, c)
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.cart.TaxDetails
    .ObjectFormat = function () {}, Y.moneta.integrator.common.cart
    .TaxDetails.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.cart.TaxDetails;
        a.pretaxAmount && S(b, 1, Y.moneta.integrator.common.Amount
            .fromObject(a.pretaxAmount));
        a.taxAmount && S(b, 2, Y.moneta.integrator.common.Amount.fromObject(
            a.taxAmount));
        a.totalAmount && S(b, 3, Y.moneta.integrator.common.Amount
            .fromObject(a.totalAmount));
        return b
    });
Y.moneta.integrator.common.cart.TaxDetails.deserializeBinary = function (a) {
    return Y.moneta.integrator.common.cart.TaxDetails
        .deserializeBinaryFromReader(new Y.moneta.integrator.common.cart
            .TaxDetails, new C(a))
};
Y.moneta.integrator.common.cart.TaxDetails.deserializeBinaryFromReader =
    function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c, Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                a.setPretaxAmount(c);
                break;
            case 2:
                c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c, Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                a.setTaxAmount(c);
                break;
            case 3:
                c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c, Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                a.setTotalAmount(c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.cart.TaxDetails.serializeBinaryToWriter = function (
    a, b) {
    var c = Hc(a);
    null != c && J(b, 1, c, Y.moneta.integrator.common.Amount
        .serializeBinaryToWriter);
    c = Ic(a);
    null != c && J(b, 2, c, Y.moneta.integrator.common.Amount
        .serializeBinaryToWriter);
    c = Jc(a);
    null != c && J(b, 3, c, Y.moneta.integrator.common.Amount
        .serializeBinaryToWriter)
};
var Hc = function (a) {
    return Q(a, Y.moneta.integrator.common.Amount, 1)
};
Y.moneta.integrator.common.cart.TaxDetails.prototype.setPretaxAmount =
    function (a) {
        S(this, 1, a)
    };
var Ic = function (a) {
    return Q(a, Y.moneta.integrator.common.Amount, 2)
};
Y.moneta.integrator.common.cart.TaxDetails.prototype.setTaxAmount = function (
a) {
    S(this, 2, a)
};
var Jc = function (a) {
    return Q(a, Y.moneta.integrator.common.Amount, 3)
};
Y.moneta.integrator.common.cart.TaxDetails.prototype.setTotalAmount = function (
    a) {
    S(this, 3, a)
};
Y.moneta.integrator.common.cart.TaxDetails.deserialize = function (a) {
    return X(Y.moneta.integrator.common.cart.TaxDetails, a)
};
Y.moneta.integrator.common.cart.LineItemDetailComputedInfo = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.cart.LineItemDetailComputedInfo, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.cart
    .LineItemDetailComputedInfo.prototype.toObject = function (a) {
        return Y.moneta.integrator.common.cart.LineItemDetailComputedInfo
            .toObject(a, this)
    }, Y.moneta.integrator.common.cart.LineItemDetailComputedInfo.toObject =
    function (a, b) {
        var c, f = {
            lineItemDetailIndex: null == (c = O(b, 1)) ? void 0 : c,
            taxDetails: (c = b.getTaxDetails()) && Y.moneta.integrator
                .common.cart.TaxDetails.toObject(a, c)
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.cart
    .LineItemDetailComputedInfo.ObjectFormat = function () {}, Y.moneta
    .integrator.common.cart.LineItemDetailComputedInfo.fromObject =
    function (a) {
        var b = new Y.moneta.integrator.common.cart
            .LineItemDetailComputedInfo;
        null != a.lineItemDetailIndex && P(b, 1, a.lineItemDetailIndex);
        a.taxDetails && S(b, 2, Y.moneta.integrator.common.cart.TaxDetails
            .fromObject(a.taxDetails));
        return b
    });
Y.moneta.integrator.common.cart.LineItemDetailComputedInfo.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.common.cart.LineItemDetailComputedInfo
            .deserializeBinaryFromReader(new Y.moneta.integrator.common.cart
                .LineItemDetailComputedInfo, new C(a))
    };
Y.moneta.integrator.common.cart.LineItemDetailComputedInfo
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readInt32();
                P(a, 1, c);
                break;
            case 2:
                c = new Y.moneta.integrator.common.cart.TaxDetails;
                b.readMessage(c, Y.moneta.integrator.common.cart.TaxDetails
                    .deserializeBinaryFromReader);
                a.setTaxDetails(c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.cart.LineItemDetailComputedInfo
    .serializeBinaryToWriter = function (a, b) {
        var c = O(a, 1);
        null != c && b.writeInt32(1, c);
        c = a.getTaxDetails();
        null != c && J(b, 2, c, Y.moneta.integrator.common.cart.TaxDetails
            .serializeBinaryToWriter)
    };
Y.moneta.integrator.common.cart.LineItemDetailComputedInfo.prototype
    .getTaxDetails = function () {
        return Q(this, Y.moneta.integrator.common.cart.TaxDetails, 2)
    };
Y.moneta.integrator.common.cart.LineItemDetailComputedInfo.prototype
    .setTaxDetails = function (a) {
        S(this, 2, a)
    };
Y.moneta.integrator.common.cart.LineItemDetailComputedInfo.deserialize =
    function (a) {
        return X(Y.moneta.integrator.common.cart.LineItemDetailComputedInfo, a)
    };
Y.moneta.integrator.common.cart.PriceDetails = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.cart.PriceDetails, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.cart.PriceDetails.prototype
    .toObject = function (a) {
        return Y.moneta.integrator.common.cart.PriceDetails.toObject(a,
            this)
    }, Y.moneta.integrator.common.cart.PriceDetails.toObject = function (a,
        b) {
        var c, f = {
            pretaxAmount: (c = Hc(b)) && Y.moneta.integrator.common
                .Amount.toObject(a, c),
            taxAmount: (c = Ic(b)) && Y.moneta.integrator.common.Amount
                .toObject(a, c),
            totalAmount: (c = Jc(b)) && Y.moneta.integrator.common
                .Amount.toObject(a, c)
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.cart.PriceDetails
    .ObjectFormat = function () {}, Y.moneta.integrator.common.cart
    .PriceDetails.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.cart.PriceDetails;
        a.pretaxAmount && S(b, 1, Y.moneta.integrator.common.Amount
            .fromObject(a.pretaxAmount));
        a.taxAmount && S(b, 2, Y.moneta.integrator.common.Amount.fromObject(
            a.taxAmount));
        a.totalAmount && S(b, 3, Y.moneta.integrator.common.Amount
            .fromObject(a.totalAmount));
        return b
    });
Y.moneta.integrator.common.cart.PriceDetails.deserializeBinary = function (a) {
    return Y.moneta.integrator.common.cart.PriceDetails
        .deserializeBinaryFromReader(new Y.moneta.integrator.common.cart
            .PriceDetails, new C(a))
};
Y.moneta.integrator.common.cart.PriceDetails.deserializeBinaryFromReader =
    function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c, Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                a.setPretaxAmount(c);
                break;
            case 2:
                c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c, Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                a.setTaxAmount(c);
                break;
            case 3:
                c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c,
                    Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                a.setTotalAmount(c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.cart.PriceDetails.serializeBinaryToWriter =
    function (a, b) {
        var c = Hc(a);
        null != c && J(b, 1, c, Y.moneta.integrator.common.Amount
            .serializeBinaryToWriter);
        c = Ic(a);
        null != c && J(b, 2, c, Y.moneta.integrator.common.Amount
            .serializeBinaryToWriter);
        c = Jc(a);
        null != c && J(b, 3, c, Y.moneta.integrator.common.Amount
            .serializeBinaryToWriter)
    };
Y.moneta.integrator.common.cart.PriceDetails.prototype.setPretaxAmount =
    function (a) {
        S(this, 1, a)
    };
Y.moneta.integrator.common.cart.PriceDetails.prototype.setTaxAmount = function (
    a) {
    S(this, 2, a)
};
Y.moneta.integrator.common.cart.PriceDetails.prototype.setTotalAmount =
    function (a) {
        S(this, 3, a)
    };
Y.moneta.integrator.common.cart.PriceDetails.deserialize = function (a) {
    return X(Y.moneta.integrator.common.cart.PriceDetails, a)
};
Y.moneta.integrator.common.tax = {};
Y.moneta.integrator.common.tax.TaxDisplay = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.tax.TaxDisplay, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.tax.TaxDisplay.prototype
    .toObject = function (a) {
        return Y.moneta.integrator.common.tax.TaxDisplay.toObject(a, this)
    }, Y.moneta.integrator.common.tax.TaxDisplay.toObject = function (a,
    b) {
        var c, f = {
            taxDisplayName: null == (c = O(b, 1)) ? void 0 : c,
            taxRemittedBy: null == (c = O(b, 2)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.tax.TaxDisplay
    .ObjectFormat = function () {}, Y.moneta.integrator.common.tax
    .TaxDisplay.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.tax.TaxDisplay;
        null != a.taxDisplayName && P(b, 1, a.taxDisplayName);
        null != a.taxRemittedBy && P(b, 2, a.taxRemittedBy);
        return b
    });
Y.moneta.integrator.common.tax.TaxDisplay.deserializeBinary = function (a) {
    return Y.moneta.integrator.common.tax.TaxDisplay
        .deserializeBinaryFromReader(new Y.moneta.integrator.common.tax
            .TaxDisplay, new C(a))
};
Y.moneta.integrator.common.tax.TaxDisplay.deserializeBinaryFromReader =
    function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readString();
                P(a, 1, c);
                break;
            case 2:
                c = b.readEnum();
                P(a, 2, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.tax.TaxDisplay.serializeBinaryToWriter = function (a,
    b) {
    var c = O(a, 1);
    null != c && b.writeString(1, c);
    c = O(a, 2);
    null != c && b.writeEnum(2, c)
};
Y.moneta.integrator.common.tax.TaxDisplay.TaxRemittedBy = {
    UNKNOWN: 0,
    THIRD_PARTY: 1,
    GOOGLE: 2
};
Y.moneta.integrator.common.tax.TaxDisplay.deserialize = function (a) {
    return X(Y.moneta.integrator.common.tax.TaxDisplay, a)
};
Y.moneta.integrator.common.tax.TaxDisplayDetails = function (a) {
    M(this, a, -1, Y.moneta.integrator.common.tax.TaxDisplayDetails
        .repeatedFields_, null)
};
k.inherits(Y.moneta.integrator.common.tax.TaxDisplayDetails, L);
Y.moneta.integrator.common.tax.TaxDisplayDetails.repeatedFields_ = [1];
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.tax.TaxDisplayDetails
    .prototype.toObject = function (a) {
        return Y.moneta.integrator.common.tax.TaxDisplayDetails.toObject(a,
            this)
    }, Y.moneta.integrator.common.tax.TaxDisplayDetails.toObject =
    function (a, b) {
        var c = {
            taxDisplayList: N(R(b, Y.moneta.integrator.common.tax
                    .TaxDisplay, 1), Y.moneta.integrator.common.tax
                .TaxDisplay.toObject, a)
        };
        a && (c.$jspbMessageInstance = b);
        return c
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.tax.TaxDisplayDetails
    .ObjectFormat = function () {}, Y.moneta.integrator.common.tax
    .TaxDisplayDetails.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.tax.TaxDisplayDetails;
        a.taxDisplayList && V(b, 1, a.taxDisplayList.map(Y.moneta.integrator
            .common.tax.TaxDisplay.fromObject));
        return b
    });
Y.moneta.integrator.common.tax.TaxDisplayDetails.deserializeBinary = function (
    a) {
    return Y.moneta.integrator.common.tax.TaxDisplayDetails
        .deserializeBinaryFromReader(new Y.moneta.integrator.common.tax
            .TaxDisplayDetails, new C(a))
};
Y.moneta.integrator.common.tax.TaxDisplayDetails.deserializeBinaryFromReader =
    function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = new Y.moneta.integrator.common.tax.TaxDisplay;
                b.readMessage(c, Y.moneta.integrator.common.tax.TaxDisplay
                    .deserializeBinaryFromReader);
                W(a, 1, c, Y.moneta.integrator.common.tax.TaxDisplay);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.tax.TaxDisplayDetails.serializeBinaryToWriter =
    function (a, b) {
        a = R(a, Y.moneta.integrator.common.tax.TaxDisplay, 1);
        0 < a.length && K(b, 1, a, Y.moneta.integrator.common.tax.TaxDisplay
            .serializeBinaryToWriter)
    };
Y.moneta.integrator.common.tax.TaxDisplayDetails.deserialize = function (a) {
    return X(Y.moneta.integrator.common.tax.TaxDisplayDetails, a)
};
Y.moneta.integrator.common.address = {};
Y.moneta.integrator.common.address.AddressDeliveryInstruction = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.address.AddressDeliveryInstruction, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.address
    .AddressDeliveryInstruction.prototype.toObject = function (a) {
        return Y.moneta.integrator.common.address.AddressDeliveryInstruction
            .toObject(a, this)
    }, Y.moneta.integrator.common.address.AddressDeliveryInstruction
    .toObject = function (a, b) {
        var c, f = {
            addressDeliveryInstructionType: null == (c = O(b, 1)) ?
                void 0 : c,
            addressDeliveryInstructionValue: null == (c = O(b, 2)) ?
                void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.address
    .AddressDeliveryInstruction.ObjectFormat = function () {}, Y.moneta
    .integrator.common.address.AddressDeliveryInstruction.fromObject =
    function (a) {
        var b = new Y.moneta.integrator.common.address
            .AddressDeliveryInstruction;
        null != a.addressDeliveryInstructionType && P(b, 1, a
            .addressDeliveryInstructionType);
        null != a.addressDeliveryInstructionValue && P(b, 2, a
            .addressDeliveryInstructionValue);
        return b
    });
Y.moneta.integrator.common.address.AddressDeliveryInstruction
    .deserializeBinary = function (a) {
        return Y.moneta.integrator.common.address.AddressDeliveryInstruction
            .deserializeBinaryFromReader(new Y.moneta.integrator.common.address
                .AddressDeliveryInstruction, new C(a))
    };
Y.moneta.integrator.common.address.AddressDeliveryInstruction
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readEnum();
                P(a, 1, c);
                break;
            case 2:
                c = b.readString();
                P(a, 2, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.address.AddressDeliveryInstruction
    .serializeBinaryToWriter = function (a, b) {
        var c = O(a, 1);
        null != c && b.writeEnum(1, c);
        c = O(a, 2);
        null != c && b.writeString(2, c)
    };
Y.moneta.integrator.common.address.AddressDeliveryInstruction
    .AddressDeliveryInstructionType = {
        UNKNOWN: 0,
        GATE_CODE: 1,
        EXTRA_INSTRUCTIONS: 2
    };
Y.moneta.integrator.common.address.AddressDeliveryInstruction.deserialize =
    function (a) {
        return X(Y.moneta.integrator.common.address.AddressDeliveryInstruction,
            a)
    };
Y.moneta.integrator.common.address.AddressGeocodingInfo = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.address.AddressGeocodingInfo, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.address.AddressGeocodingInfo
    .prototype.toObject = function (a) {
        return Y.moneta.integrator.common.address.AddressGeocodingInfo
            .toObject(a, this)
    }, Y.moneta.integrator.common.address.AddressGeocodingInfo.toObject =
    function (a, b) {
        var c, f = {
            latLng: (c = Q(b, Y.google.type.LatLng, 1)) && Y.google.type
                .LatLng.toObject(a, c)
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.address
    .AddressGeocodingInfo.ObjectFormat = function () {}, Y.moneta.integrator
    .common.address.AddressGeocodingInfo.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.address.AddressGeocodingInfo;
        a.latLng && S(b, 1, Y.google.type.LatLng.fromObject(a.latLng));
        return b
    });
Y.moneta.integrator.common.address.AddressGeocodingInfo.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.common.address.AddressGeocodingInfo
            .deserializeBinaryFromReader(new Y.moneta.integrator.common.address
                .AddressGeocodingInfo, new C(a))
    };
Y.moneta.integrator.common.address.AddressGeocodingInfo
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = new Y.google.type.LatLng;
                b.readMessage(c, Y.google.type.LatLng
                    .deserializeBinaryFromReader);
                S(a, 1, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.address.AddressGeocodingInfo
    .serializeBinaryToWriter = function (a, b) {
        a = Q(a, Y.google.type.LatLng, 1);
        null != a && J(b, 1, a, Y.google.type.LatLng.serializeBinaryToWriter)
    };
Y.moneta.integrator.common.address.AddressGeocodingInfo.deserialize = function (
    a) {
    return X(Y.moneta.integrator.common.address.AddressGeocodingInfo, a)
};
Y.moneta.integrator.common.address.AddressLabel = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.address.AddressLabel, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.address.AddressLabel
    .prototype.toObject = function (a) {
        return Y.moneta.integrator.common.address.AddressLabel.toObject(a,
            this)
    }, Y.moneta.integrator.common.address.AddressLabel.toObject = function (
        a, b) {
        var c, f = null == (c = O(b, 1)) ? void 0 : c,
            g = null == (c = O(b, 2)) ? void 0 : c;
        c = !1;
        c = void 0 === c ? !1 : c;
        var h = wc(b, 3);
        f = {
            labelType: f,
            customLabel: g,
            universalAccess: null == h ? c : h
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.address.AddressLabel
    .ObjectFormat = function () {}, Y.moneta.integrator.common.address
    .AddressLabel.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.address.AddressLabel;
        null != a.labelType && P(b, 1, a.labelType);
        null != a.customLabel && P(b, 2, a.customLabel);
        null != a.universalAccess && P(b, 3, a.universalAccess);
        return b
    });
Y.moneta.integrator.common.address.AddressLabel.deserializeBinary = function (
a) {
    return Y.moneta.integrator.common.address.AddressLabel
        .deserializeBinaryFromReader(new Y.moneta.integrator.common.address
            .AddressLabel, new C(a))
};
Y.moneta.integrator.common.address.AddressLabel.deserializeBinaryFromReader =
    function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readEnum();
                P(a, 1, c);
                break;
            case 2:
                c = b.readString();
                P(a, 2, c);
                break;
            case 3:
                c = b.readBool();
                P(a, 3, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.address.AddressLabel.serializeBinaryToWriter =
    function (a, b) {
        var c = O(a, 1);
        null != c && b.writeEnum(1, c);
        c = O(a, 2);
        null != c && b.writeString(2, c);
        c = O(a, 3);
        null != c && b.writeBool(3, c)
    };
Y.moneta.integrator.common.address.AddressLabel.LabelType = {
    LABEL_TYPE_UNKNOWN: 0,
    LABEL_TYPE_SHIPPING_HOME: 1,
    LABEL_TYPE_SHIPPING_WORK: 2,
    LABEL_TYPE_SHIPPING_PREFERRED: 3,
    LABEL_TYPE_SHIPPING_LAST_USED: 4,
    LABEL_TYPE_CUSTOM: 5,
    LABEL_TYPE_SHIPPING_RESIDENTIAL: 6,
    LABEL_TYPE_SHIPPING_BUSINESS: 7
};
Y.moneta.integrator.common.address.AddressLabel.deserialize = function (a) {
    return X(Y.moneta.integrator.common.address.AddressLabel, a)
};
Y.moneta.integrator.common.address.Address = function (a) {
    M(this, a, -1, Y.moneta.integrator.common.address.Address
        .repeatedFields_, Y.moneta.integrator.common.address.Address
        .oneofGroups_)
};
k.inherits(Y.moneta.integrator.common.address.Address, L);
Y.moneta.integrator.common.address.Address.repeatedFields_ = [4, 6];
Y.moneta.integrator.common.address.Address.oneofGroups_ = [
    [1, 8]
];
Y.moneta.integrator.common.address.Address.IdCase = {
    ID_NOT_SET: 0,
    ADDRESS_ID: 1,
    EXTERNAL_ADDRESS_ID: 8
};
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.address.Address.prototype
    .toObject = function (a) {
        return Y.moneta.integrator.common.address.Address.toObject(a, this)
    }, Y.moneta.integrator.common.address.Address.toObject = function (a,
    b) {
        var c, f = {
            addressId: null == (c = O(b, 1)) ? void 0 : c,
            externalAddressId: null == (c = O(b, 8)) ? void 0 : c,
            address: (c = b.getAddress()) && Y.postaladdress
                .PostalAddress.toObject(a, c),
            addressNormalizationType: null == (c = O(b, 7)) ? void 0 :
                c,
            normalizationResultType: null == (c = O(b, 9)) ? void 0 : c,
            addressAttributes: xc(O(b,
                10)),
            addressSignature: xc(O(b, 11)),
            phoneNumber: null == (c = O(b, 3)) ? void 0 : c,
            addressDeliveryInstructionList: N(R(b, Y.moneta.integrator
                    .common.address.AddressDeliveryInstruction, 4),
                Y.moneta.integrator.common.address
                .AddressDeliveryInstruction.toObject, a),
            addressGeocodingInfo: (c = Q(b, Y.moneta.integrator.common
                    .address.AddressGeocodingInfo, 5)) && Y.moneta
                .integrator.common.address.AddressGeocodingInfo
                .toObject(a, c),
            addressLabelList: N(R(b, Y.moneta.integrator.common.address
                    .AddressLabel, 6), Y.moneta.integrator.common
                .address.AddressLabel.toObject,
                a)
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.address.Address
    .ObjectFormat = function () {}, Y.moneta.integrator.common.address
    .Address.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.address.Address;
        null != a.addressId && P(b, 1, a.addressId);
        null != a.externalAddressId && P(b, 8, a.externalAddressId);
        a.address && S(b, 2, Y.postaladdress.PostalAddress.fromObject(a
            .address));
        null != a.addressNormalizationType && P(b, 7, a
            .addressNormalizationType);
        null != a.normalizationResultType && P(b, 9, a
            .normalizationResultType);
        null != a.addressAttributes && P(b, 10, a.addressAttributes);
        null != a.addressSignature && P(b, 11, a.addressSignature);
        null != a.phoneNumber && P(b, 3, a.phoneNumber);
        a.addressDeliveryInstructionList && V(b, 4, a
            .addressDeliveryInstructionList.map(Y.moneta.integrator
                .common.address.AddressDeliveryInstruction.fromObject));
        a.addressGeocodingInfo && S(b, 5, Y.moneta.integrator.common.address
            .AddressGeocodingInfo.fromObject(a.addressGeocodingInfo));
        a.addressLabelList && V(b, 6, a.addressLabelList.map(Y.moneta
            .integrator.common.address.AddressLabel.fromObject));
        return b
    });
Y.moneta.integrator.common.address.Address.deserializeBinary = function (a) {
    return Y.moneta.integrator.common.address.Address
        .deserializeBinaryFromReader(new Y.moneta.integrator.common.address
            .Address, new C(a))
};
Y.moneta.integrator.common.address.Address.deserializeBinaryFromReader =
    function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readInt64String();
                Bc(a, 1, Y.moneta.integrator.common.address.Address
                    .oneofGroups_[0], c);
                break;
            case 8:
                c = b.readInt64String();
                Bc(a, 8, Y.moneta.integrator.common.address.Address
                    .oneofGroups_[0], c);
                break;
            case 2:
                c = new Y.postaladdress.PostalAddress;
                b.readMessage(c, Y.postaladdress.PostalAddress
                    .deserializeBinaryFromReader);
                a.setAddress(c);
                break;
            case 7:
                c = b.readEnum();
                P(a, 7, c);
                break;
            case 9:
                c = b.readEnum();
                P(a, 9, c);
                break;
            case 10:
                c = b.readBytes();
                P(a, 10, c);
                break;
            case 11:
                c = b.readBytes();
                P(a, 11, c);
                break;
            case 3:
                c = b.readString();
                a.setPhoneNumber(c);
                break;
            case 4:
                c = new Y.moneta.integrator.common.address
                    .AddressDeliveryInstruction;
                b.readMessage(c, Y.moneta.integrator.common.address
                    .AddressDeliveryInstruction
                    .deserializeBinaryFromReader);
                W(a, 4, c, Y.moneta.integrator.common.address
                    .AddressDeliveryInstruction);
                break;
            case 5:
                c = new Y.moneta.integrator.common.address
                    .AddressGeocodingInfo;
                b.readMessage(c, Y.moneta.integrator.common.address
                    .AddressGeocodingInfo.deserializeBinaryFromReader);
                S(a, 5, c);
                break;
            case 6:
                c = new Y.moneta.integrator.common.address.AddressLabel;
                b.readMessage(c, Y.moneta.integrator.common.address
                    .AddressLabel.deserializeBinaryFromReader);
                W(a, 6, c, Y.moneta.integrator.common.address.AddressLabel);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.address.Address.serializeBinaryToWriter = function (
    a, b) {
    var c = O(a, 1);
    null != c && b.writeInt64String(1, c);
    c = O(a, 8);
    null != c && b.writeInt64String(8, c);
    c = a.getAddress();
    null != c && J(b, 2, c, Y.postaladdress.PostalAddress
        .serializeBinaryToWriter);
    c = O(a, 7);
    null != c && b.writeEnum(7, c);
    c = O(a, 9);
    null != c && b.writeEnum(9, c);
    c = O(a, 10);
    null != c && b.writeBytes(10, c);
    c = O(a, 11);
    null != c && b.writeBytes(11, c);
    c = O(a, 3);
    null != c && b.writeString(3, c);
    c = R(a, Y.moneta.integrator.common.address.AddressDeliveryInstruction,
        4);
    0 < c.length && K(b, 4, c, Y.moneta.integrator.common.address
        .AddressDeliveryInstruction.serializeBinaryToWriter);
    c = Q(a, Y.moneta.integrator.common.address.AddressGeocodingInfo, 5);
    null != c && J(b, 5, c, Y.moneta.integrator.common.address
        .AddressGeocodingInfo.serializeBinaryToWriter);
    c = R(a, Y.moneta.integrator.common.address.AddressLabel, 6);
    0 < c.length && K(b, 6, c, Y.moneta.integrator.common.address
        .AddressLabel.serializeBinaryToWriter)
};
Y.moneta.integrator.common.address.Address.prototype.getAddress = function () {
    return Q(this, Y.postaladdress.PostalAddress, 2)
};
Y.moneta.integrator.common.address.Address.prototype.setAddress = function (a) {
    S(this, 2, a)
};
Y.moneta.integrator.common.address.Address.prototype.setPhoneNumber = function (
    a) {
    P(this, 3, a)
};
Y.moneta.integrator.common.address.Address.deserialize = function (a) {
    return X(Y.moneta.integrator.common.address.Address, a)
};
Y.moneta.integrator.common.tax.Tax = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.tax.Tax, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.tax.Tax.prototype.toObject =
    function (a) {
        return Y.moneta.integrator.common.tax.Tax.toObject(a, this)
    }, Y.moneta.integrator.common.tax.Tax.toObject = function (a, b) {
        var c, f = {
            taxType: null == (c = O(b, 6)) ? void 0 : c,
            amount: (c = b.getAmount()) && Y.moneta.integrator.common
                .Amount.toObject(a, c),
            taxCategory: null == (c = O(b, 2)) ? void 0 : c,
            remittanceDestination: null == (c = O(b, 3)) ? void 0 : c,
            effectiveRateInMicros: null == (c = O(b, 4)) ? void 0 : c,
            feeAmountInMicros: null == (c = O(b, 5)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.tax.Tax.ObjectFormat =
    function () {}, Y.moneta.integrator.common.tax.Tax.fromObject =
    function (a) {
        var b = new Y.moneta.integrator.common.tax.Tax;
        null != a.taxType && P(b, 6, a.taxType);
        a.amount && S(b, 1, Y.moneta.integrator.common.Amount.fromObject(a
            .amount));
        null != a.taxCategory && P(b, 2, a.taxCategory);
        null != a.remittanceDestination && P(b, 3, a.remittanceDestination);
        null != a.effectiveRateInMicros && P(b, 4, a.effectiveRateInMicros);
        null != a.feeAmountInMicros && P(b, 5, a.feeAmountInMicros);
        return b
    });
Y.moneta.integrator.common.tax.Tax.deserializeBinary = function (a) {
    return Y.moneta.integrator.common.tax.Tax.deserializeBinaryFromReader(
        new Y.moneta.integrator.common.tax.Tax, new C(a))
};
Y.moneta.integrator.common.tax.Tax.deserializeBinaryFromReader = function (a,
b) {
    for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
        case 6:
            var c = b.readEnum();
            P(a, 6, c);
            break;
        case 1:
            c = new Y.moneta.integrator.common.Amount;
            b.readMessage(c, Y.moneta.integrator.common.Amount
                .deserializeBinaryFromReader);
            a.setAmount(c);
            break;
        case 2:
            c = b.readInt32();
            P(a, 2, c);
            break;
        case 3:
            c = b.readInt32();
            P(a, 3, c);
            break;
        case 4:
            c = b.readInt64();
            P(a, 4, c);
            break;
        case 5:
            c = b.readInt64();
            P(a, 5, c);
            break;
        default:
            G(b)
    }
    return a
};
Y.moneta.integrator.common.tax.Tax.serializeBinaryToWriter = function (a, b) {
    var c = O(a, 6);
    null != c && b.writeEnum(6, c);
    c = a.getAmount();
    null != c && J(b, 1, c, Y.moneta.integrator.common.Amount
        .serializeBinaryToWriter);
    c = O(a, 2);
    null != c && b.writeInt32(2, c);
    c = O(a, 3);
    null != c && b.writeInt32(3, c);
    c = O(a, 4);
    null != c && b.writeInt64(4, c);
    c = O(a, 5);
    null != c && b.writeInt64(5, c)
};
Y.moneta.integrator.common.tax.Tax.TaxType = {
    TAX_TYPE_UNKNOWN: 0,
    TAX_TYPE_RATE: 1,
    TAX_TYPE_FEE: 2
};
Y.moneta.integrator.common.tax.Tax.prototype.getAmount = function () {
    return Q(this, Y.moneta.integrator.common.Amount, 1)
};
Y.moneta.integrator.common.tax.Tax.prototype.setAmount = function (a) {
    S(this, 1, a)
};
Y.moneta.integrator.common.tax.Tax.deserialize = function (a) {
    return X(Y.moneta.integrator.common.tax.Tax, a)
};
Y.moneta.integrator.common.tax.TaxDetails = function (a) {
    M(this, a, -1, Y.moneta.integrator.common.tax.TaxDetails
        .repeatedFields_, null)
};
k.inherits(Y.moneta.integrator.common.tax.TaxDetails, L);
Y.moneta.integrator.common.tax.TaxDetails.repeatedFields_ = [2];
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.tax.TaxDetails.prototype
    .toObject = function (a) {
        return Y.moneta.integrator.common.tax.TaxDetails.toObject(a, this)
    }, Y.moneta.integrator.common.tax.TaxDetails.toObject = function (a,
    b) {
        var c, f = {
            assesseeAddress: (c = Q(b, Y.moneta.integrator.common
                    .address.Address, 1)) && Y.moneta.integrator.common
                .address.Address.toObject(a, c),
            taxList: N(R(b, Y.moneta.integrator.common.tax.Tax, 2), Y
                .moneta.integrator.common.tax.Tax.toObject, a),
            taxSignature: xc(O(b, 3)),
            taxToken: xc(O(b,
                4))
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.tax.TaxDetails
    .ObjectFormat = function () {}, Y.moneta.integrator.common.tax
    .TaxDetails.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.tax.TaxDetails;
        a.assesseeAddress && S(b, 1, Y.moneta.integrator.common.address
            .Address.fromObject(a.assesseeAddress));
        a.taxList && V(b, 2, a.taxList.map(Y.moneta.integrator.common.tax
            .Tax.fromObject));
        null != a.taxSignature && P(b, 3, a.taxSignature);
        null != a.taxToken && P(b, 4, a.taxToken);
        return b
    });
Y.moneta.integrator.common.tax.TaxDetails.deserializeBinary = function (a) {
    return Y.moneta.integrator.common.tax.TaxDetails
        .deserializeBinaryFromReader(new Y.moneta.integrator.common.tax
            .TaxDetails, new C(a))
};
Y.moneta.integrator.common.tax.TaxDetails.deserializeBinaryFromReader =
    function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = new Y.moneta.integrator.common.address.Address;
                b.readMessage(c, Y.moneta.integrator.common.address.Address
                    .deserializeBinaryFromReader);
                S(a, 1, c);
                break;
            case 2:
                c = new Y.moneta.integrator.common.tax.Tax;
                b.readMessage(c, Y.moneta.integrator.common.tax.Tax
                    .deserializeBinaryFromReader);
                W(a, 2, c, Y.moneta.integrator.common.tax.Tax);
                break;
            case 3:
                c = b.readBytes();
                P(a, 3, c);
                break;
            case 4:
                c = b.readBytes();
                P(a, 4, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.tax.TaxDetails.serializeBinaryToWriter = function (a,
    b) {
    var c = Q(a, Y.moneta.integrator.common.address.Address, 1);
    null != c && J(b, 1, c, Y.moneta.integrator.common.address.Address
        .serializeBinaryToWriter);
    c = R(a, Y.moneta.integrator.common.tax.Tax, 2);
    0 < c.length && K(b, 2, c, Y.moneta.integrator.common.tax.Tax
        .serializeBinaryToWriter);
    c = O(a, 3);
    null != c && b.writeBytes(3, c);
    c = O(a, 4);
    null != c && b.writeBytes(4, c)
};
Y.moneta.integrator.common.tax.TaxDetails.deserialize = function (a) {
    return X(Y.moneta.integrator.common.tax.TaxDetails, a)
};
Y.moneta.integrator.common.cart.LineItemComputedInfo = function (a) {
    M(this, a, -1, Y.moneta.integrator.common.cart.LineItemComputedInfo
        .repeatedFields_, null)
};
k.inherits(Y.moneta.integrator.common.cart.LineItemComputedInfo, L);
Y.moneta.integrator.common.cart.LineItemComputedInfo.repeatedFields_ = [2];
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.cart.LineItemComputedInfo
    .prototype.toObject = function (a) {
        return Y.moneta.integrator.common.cart.LineItemComputedInfo
            .toObject(a, this)
    }, Y.moneta.integrator.common.cart.LineItemComputedInfo.toObject =
    function (a, b) {
        var c, f = {
            lineItemIndex: null == (c = O(b, 1)) ? void 0 : c,
            detailInfoList: N(R(b, Y.moneta.integrator.common.cart
                    .LineItemDetailComputedInfo, 2), Y.moneta
                .integrator.common.cart.LineItemDetailComputedInfo
                .toObject, a),
            totalTaxDetails: (c = b.getTotalTaxDetails()) &&
                Y.moneta.integrator.common.cart.TaxDetails.toObject(a,
                    c),
            priceDetails: (c = b.getPriceDetails()) && Y.moneta
                .integrator.common.cart.PriceDetails.toObject(a, c),
            taxDetails: (c = b.getTaxDetails()) && Y.moneta.integrator
                .common.tax.TaxDetails.toObject(a, c),
            taxDisplayDetails: (c = Q(b, Y.moneta.integrator.common.tax
                    .TaxDisplayDetails, 6)) && Y.moneta.integrator
                .common.tax.TaxDisplayDetails.toObject(a, c),
            lineItemType: null == (c = O(b, 7)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.cart.LineItemComputedInfo
    .ObjectFormat = function () {}, Y.moneta.integrator.common.cart
    .LineItemComputedInfo.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.cart.LineItemComputedInfo;
        null != a.lineItemIndex && P(b, 1, a.lineItemIndex);
        a.detailInfoList && V(b, 2, a.detailInfoList.map(Y.moneta.integrator
            .common.cart.LineItemDetailComputedInfo.fromObject));
        a.totalTaxDetails && S(b, 3, Y.moneta.integrator.common.cart
            .TaxDetails.fromObject(a.totalTaxDetails));
        a.priceDetails && S(b, 4, Y.moneta.integrator.common.cart
            .PriceDetails.fromObject(a.priceDetails));
        a.taxDetails && S(b, 5, Y.moneta.integrator.common.tax.TaxDetails
            .fromObject(a.taxDetails));
        a.taxDisplayDetails && S(b, 6, Y.moneta.integrator.common.tax
            .TaxDisplayDetails.fromObject(a.taxDisplayDetails));
        null != a.lineItemType && P(b, 7, a.lineItemType);
        return b
    });
Y.moneta.integrator.common.cart.LineItemComputedInfo.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.common.cart.LineItemComputedInfo
            .deserializeBinaryFromReader(new Y.moneta.integrator.common.cart
                .LineItemComputedInfo, new C(a))
    };
Y.moneta.integrator.common.cart.LineItemComputedInfo
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readInt32();
                a.setLineItemIndex(c);
                break;
            case 2:
                c = new Y.moneta.integrator.common.cart
                    .LineItemDetailComputedInfo;
                b.readMessage(c, Y.moneta.integrator.common.cart
                    .LineItemDetailComputedInfo
                    .deserializeBinaryFromReader);
                W(a, 2, c, Y.moneta.integrator.common.cart
                    .LineItemDetailComputedInfo);
                break;
            case 3:
                c = new Y.moneta.integrator.common.cart.TaxDetails;
                b.readMessage(c, Y.moneta.integrator.common.cart.TaxDetails
                    .deserializeBinaryFromReader);
                a.setTotalTaxDetails(c);
                break;
            case 4:
                c = new Y.moneta.integrator.common.cart.PriceDetails;
                b.readMessage(c, Y.moneta.integrator.common.cart
                    .PriceDetails.deserializeBinaryFromReader);
                a.setPriceDetails(c);
                break;
            case 5:
                c = new Y.moneta.integrator.common.tax.TaxDetails;
                b.readMessage(c, Y.moneta.integrator.common.tax.TaxDetails
                    .deserializeBinaryFromReader);
                a.setTaxDetails(c);
                break;
            case 6:
                c = new Y.moneta.integrator.common.tax.TaxDisplayDetails;
                b.readMessage(c, Y.moneta.integrator.common.tax
                    .TaxDisplayDetails.deserializeBinaryFromReader);
                S(a, 6, c);
                break;
            case 7:
                c = b.readEnum();
                a.setLineItemType(c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.cart.LineItemComputedInfo.serializeBinaryToWriter =
    function (a, b) {
        var c = O(a, 1);
        null != c && b.writeInt32(1, c);
        c = R(a, Y.moneta.integrator.common.cart.LineItemDetailComputedInfo, 2);
        0 < c.length && K(b, 2, c, Y.moneta.integrator.common.cart
            .LineItemDetailComputedInfo.serializeBinaryToWriter);
        c = a.getTotalTaxDetails();
        null != c && J(b, 3, c, Y.moneta.integrator.common.cart.TaxDetails
            .serializeBinaryToWriter);
        c = a.getPriceDetails();
        null != c && J(b, 4, c, Y.moneta.integrator.common.cart.PriceDetails
            .serializeBinaryToWriter);
        c = a.getTaxDetails();
        null != c && J(b, 5, c, Y.moneta.integrator.common.tax.TaxDetails
            .serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.common.tax.TaxDisplayDetails, 6);
        null != c && J(b, 6, c, Y.moneta.integrator.common.tax.TaxDisplayDetails
            .serializeBinaryToWriter);
        c = O(a, 7);
        null != c && b.writeEnum(7, c)
    };
d = Y.moneta.integrator.common.cart.LineItemComputedInfo.prototype;
d.setLineItemIndex = function (a) {
    P(this, 1, a)
};
d.getTotalTaxDetails = function () {
    return Q(this, Y.moneta.integrator.common.cart.TaxDetails, 3)
};
d.setTotalTaxDetails = function (a) {
    S(this, 3, a)
};
d.getPriceDetails = function () {
    return Q(this, Y.moneta.integrator.common.cart.PriceDetails, 4)
};
d.setPriceDetails = function (a) {
    S(this, 4, a)
};
d.getTaxDetails = function () {
    return Q(this, Y.moneta.integrator.common.tax.TaxDetails, 5)
};
d.setTaxDetails = function (a) {
    S(this, 5, a)
};
d.setLineItemType = function (a) {
    P(this, 7, a)
};
Y.moneta.integrator.common.cart.LineItemComputedInfo.deserialize = function (
a) {
    return X(Y.moneta.integrator.common.cart.LineItemComputedInfo, a)
};
Y.moneta.integrator.common.cart.CartComputedInfo = function (a) {
    M(this, a, -1, Y.moneta.integrator.common.cart.CartComputedInfo
        .repeatedFields_, null)
};
k.inherits(Y.moneta.integrator.common.cart.CartComputedInfo, L);
Y.moneta.integrator.common.cart.CartComputedInfo.repeatedFields_ = [1, 6, 5, 7];
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.cart.CartComputedInfo
    .prototype.toObject = function (a) {
        return Y.moneta.integrator.common.cart.CartComputedInfo.toObject(a,
            this)
    }, Y.moneta.integrator.common.cart.CartComputedInfo.toObject =
    function (a, b) {
        var c, f = {
            lineItemComputedInfoList: N(R(b, Y.moneta.integrator.common
                    .cart.LineItemComputedInfo, 1), Y.moneta
                .integrator.common.cart.LineItemComputedInfo
                .toObject, a),
            totalTaxDetails: (c = b.getTotalTaxDetails()) && Y.moneta
                .integrator.common.cart.TaxDetails.toObject(a,
                    c),
            shippingItemComputedInfo: (c = Q(b, Y.moneta.integrator
                    .common.cart.LineItemComputedInfo, 4)) && Y.moneta
                .integrator.common.cart.LineItemComputedInfo.toObject(a,
                    c),
            summaryLineItemComputedInfoList: N(R(b, Y.moneta.integrator
                    .common.cart.LineItemComputedInfo, 6), Y.moneta
                .integrator.common.cart.LineItemComputedInfo
                .toObject, a),
            gratuityItemComputedInfoList: N(R(b, Y.moneta.integrator
                    .common.cart.LineItemComputedInfo, 5), Y.moneta
                .integrator.common.cart.LineItemComputedInfo
                .toObject, a),
            taxItemComputedInfoList: N(R(b,
                    Y.moneta.integrator.common.cart
                    .LineItemComputedInfo, 7), Y.moneta.integrator
                .common.cart.LineItemComputedInfo.toObject, a),
            priceDetails: (c = b.getPriceDetails()) && Y.moneta
                .integrator.common.cart.PriceDetails.toObject(a, c)
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.cart.CartComputedInfo
    .ObjectFormat = function () {}, Y.moneta.integrator.common.cart
    .CartComputedInfo.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.cart.CartComputedInfo;
        a.lineItemComputedInfoList && V(b, 1, a.lineItemComputedInfoList
            .map(Y.moneta.integrator.common.cart.LineItemComputedInfo
                .fromObject));
        a.totalTaxDetails && S(b, 2, Y.moneta.integrator.common.cart
            .TaxDetails.fromObject(a.totalTaxDetails));
        a.shippingItemComputedInfo && S(b, 4, Y.moneta.integrator.common
            .cart.LineItemComputedInfo.fromObject(a
                .shippingItemComputedInfo));
        a.summaryLineItemComputedInfoList && V(b, 6, a
            .summaryLineItemComputedInfoList.map(Y.moneta.integrator
                .common.cart.LineItemComputedInfo.fromObject));
        a.gratuityItemComputedInfoList && V(b, 5, a
            .gratuityItemComputedInfoList.map(Y.moneta.integrator.common
                .cart.LineItemComputedInfo.fromObject));
        a.taxItemComputedInfoList && V(b, 7, a.taxItemComputedInfoList.map(Y
            .moneta.integrator.common.cart.LineItemComputedInfo
            .fromObject));
        a.priceDetails && S(b, 3, Y.moneta.integrator.common.cart
            .PriceDetails.fromObject(a.priceDetails));
        return b
    });
Y.moneta.integrator.common.cart.CartComputedInfo.deserializeBinary = function (
    a) {
    return Y.moneta.integrator.common.cart.CartComputedInfo
        .deserializeBinaryFromReader(new Y.moneta.integrator.common.cart
            .CartComputedInfo, new C(a))
};
Y.moneta.integrator.common.cart.CartComputedInfo.deserializeBinaryFromReader =
    function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = new Y.moneta.integrator.common.cart
                    .LineItemComputedInfo;
                b.readMessage(c, Y.moneta.integrator.common.cart
                    .LineItemComputedInfo.deserializeBinaryFromReader);
                W(a, 1, c, Y.moneta.integrator.common.cart
                    .LineItemComputedInfo);
                break;
            case 2:
                c = new Y.moneta.integrator.common.cart.TaxDetails;
                b.readMessage(c, Y.moneta.integrator.common.cart.TaxDetails
                    .deserializeBinaryFromReader);
                a.setTotalTaxDetails(c);
                break;
            case 4:
                c = new Y.moneta.integrator.common.cart
                .LineItemComputedInfo;
                b.readMessage(c, Y.moneta.integrator.common.cart
                    .LineItemComputedInfo.deserializeBinaryFromReader);
                S(a, 4, c);
                break;
            case 6:
                c = new Y.moneta.integrator.common.cart
                .LineItemComputedInfo;
                b.readMessage(c, Y.moneta.integrator.common.cart
                    .LineItemComputedInfo.deserializeBinaryFromReader);
                W(a, 6, c, Y.moneta.integrator.common.cart
                    .LineItemComputedInfo);
                break;
            case 5:
                c = new Y.moneta.integrator.common.cart
                .LineItemComputedInfo;
                b.readMessage(c, Y.moneta.integrator.common.cart
                    .LineItemComputedInfo.deserializeBinaryFromReader);
                W(a, 5, c, Y.moneta.integrator.common.cart
                    .LineItemComputedInfo);
                break;
            case 7:
                c = new Y.moneta.integrator.common.cart
                .LineItemComputedInfo;
                b.readMessage(c, Y.moneta.integrator.common.cart
                    .LineItemComputedInfo.deserializeBinaryFromReader);
                W(a, 7, c, Y.moneta.integrator.common.cart
                    .LineItemComputedInfo);
                break;
            case 3:
                c = new Y.moneta.integrator.common.cart.PriceDetails;
                b.readMessage(c, Y.moneta.integrator.common.cart
                    .PriceDetails.deserializeBinaryFromReader);
                a.setPriceDetails(c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.cart.CartComputedInfo.serializeBinaryToWriter =
    function (a, b) {
        var c = R(a, Y.moneta.integrator.common.cart.LineItemComputedInfo, 1);
        0 < c.length && K(b, 1, c, Y.moneta.integrator.common.cart
            .LineItemComputedInfo.serializeBinaryToWriter);
        c = a.getTotalTaxDetails();
        null != c && J(b, 2, c, Y.moneta.integrator.common.cart.TaxDetails
            .serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.common.cart.LineItemComputedInfo, 4);
        null != c && J(b, 4, c, Y.moneta.integrator.common.cart
            .LineItemComputedInfo.serializeBinaryToWriter);
        c =
            R(a, Y.moneta.integrator.common.cart.LineItemComputedInfo, 6);
        0 < c.length && K(b, 6, c, Y.moneta.integrator.common.cart
            .LineItemComputedInfo.serializeBinaryToWriter);
        c = R(a, Y.moneta.integrator.common.cart.LineItemComputedInfo, 5);
        0 < c.length && K(b, 5, c, Y.moneta.integrator.common.cart
            .LineItemComputedInfo.serializeBinaryToWriter);
        c = R(a, Y.moneta.integrator.common.cart.LineItemComputedInfo, 7);
        0 < c.length && K(b, 7, c, Y.moneta.integrator.common.cart
            .LineItemComputedInfo.serializeBinaryToWriter);
        c = a.getPriceDetails();
        null !=
            c && J(b, 3, c, Y.moneta.integrator.common.cart.PriceDetails
                .serializeBinaryToWriter)
    };
Y.moneta.integrator.common.cart.CartComputedInfo.prototype.getTotalTaxDetails =
    function () {
        return Q(this, Y.moneta.integrator.common.cart.TaxDetails, 2)
    };
Y.moneta.integrator.common.cart.CartComputedInfo.prototype.setTotalTaxDetails =
    function (a) {
        S(this, 2, a)
    };
Y.moneta.integrator.common.cart.CartComputedInfo.prototype.getPriceDetails =
    function () {
        return Q(this, Y.moneta.integrator.common.cart.PriceDetails, 3)
    };
Y.moneta.integrator.common.cart.CartComputedInfo.prototype.setPriceDetails =
    function (a) {
        S(this, 3, a)
    };
Y.moneta.integrator.common.cart.CartComputedInfo.deserialize = function (a) {
    return X(Y.moneta.integrator.common.cart.CartComputedInfo, a)
};
Y.moneta.integrator.common.fundsguarantee = {};
Y.moneta.integrator.common.fundsguarantee.ApprovalDetails = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.fundsguarantee.ApprovalDetails, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .ApprovalDetails.prototype.toObject = function (a) {
        return Y.moneta.integrator.common.fundsguarantee.ApprovalDetails
            .toObject(a, this)
    }, Y.moneta.integrator.common.fundsguarantee.ApprovalDetails.toObject =
    function (a, b) {
        var c, f = {
            approvedAmount: (c = Q(b, Y.moneta.integrator.common.Amount,
                1)) && Y.moneta.integrator.common.Amount.toObject(a,
                c),
            cancelAvailabilityMillis: null == (c = O(b, 3)) ? void 0 :
                c,
            delayedChargingApproved: null == (c = wc(b, 4)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance =
            b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .ApprovalDetails.ObjectFormat = function () {}, Y.moneta.integrator
    .common.fundsguarantee.ApprovalDetails.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.fundsguarantee
            .ApprovalDetails;
        a.approvedAmount && S(b, 1, Y.moneta.integrator.common.Amount
            .fromObject(a.approvedAmount));
        null != a.cancelAvailabilityMillis && P(b, 3, a
            .cancelAvailabilityMillis);
        null != a.delayedChargingApproved && P(b, 4, a
            .delayedChargingApproved);
        return b
    });
Y.moneta.integrator.common.fundsguarantee.ApprovalDetails.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.common.fundsguarantee.ApprovalDetails
            .deserializeBinaryFromReader(new Y.moneta.integrator.common
                .fundsguarantee.ApprovalDetails, new C(a))
    };
Y.moneta.integrator.common.fundsguarantee.ApprovalDetails
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c, Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                S(a, 1, c);
                break;
            case 3:
                c = b.readInt64();
                P(a, 3, c);
                break;
            case 4:
                c = b.readBool();
                P(a, 4, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.fundsguarantee.ApprovalDetails
    .serializeBinaryToWriter = function (a, b) {
        var c = Q(a, Y.moneta.integrator.common.Amount, 1);
        null != c && J(b, 1, c, Y.moneta.integrator.common.Amount
            .serializeBinaryToWriter);
        c = O(a, 3);
        null != c && b.writeInt64(3, c);
        c = O(a, 4);
        null != c && b.writeBool(4, c)
    };
Y.moneta.integrator.common.fundsguarantee.ApprovalDetails.deserialize =
    function (a) {
        return X(Y.moneta.integrator.common.fundsguarantee.ApprovalDetails, a)
    };
Y.moneta.integrator.common.fundsguarantee.ChargebackDetails = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.fundsguarantee.ChargebackDetails, L);
Y.moneta.integrator.common.fundsguarantee.ChargebackDetails.ReverseDetails =
    function (a) {
        M(this, a, -1, null, null)
    };
k.inherits(Y.moneta.integrator.common.fundsguarantee.ChargebackDetails
    .ReverseDetails, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .ChargebackDetails.prototype.toObject = function (a) {
        return Y.moneta.integrator.common.fundsguarantee.ChargebackDetails
            .toObject(a, this)
    }, Y.moneta.integrator.common.fundsguarantee.ChargebackDetails
    .toObject = function (a, b) {
        var c, f = {
            chargebackAmount: (c = b.getChargebackAmount()) && Y.moneta
                .integrator.common.Amount.toObject(a, c),
            positiveChargebackAmount: (c = Q(b, Y.moneta.integrator
                    .common.Amount, 2)) && Y.moneta.integrator.common
                .Amount.toObject(a,
                    c),
            fraudCategory: null == (c = wc(b, 3)) ? void 0 : c,
            reverseDetails: (c = Q(b, Y.moneta.integrator.common
                    .fundsguarantee.ChargebackDetails
                    .ReverseDetails, 4)) && Y.moneta.integrator.common
                .fundsguarantee.ChargebackDetails.ReverseDetails
                .toObject(a, c)
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .ChargebackDetails.ObjectFormat = function () {}, Y.moneta.integrator
    .common.fundsguarantee.ChargebackDetails.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.fundsguarantee
            .ChargebackDetails;
        a.chargebackAmount && S(b, 1, Y.moneta.integrator.common.Amount
            .fromObject(a.chargebackAmount));
        a.positiveChargebackAmount && S(b, 2, Y.moneta.integrator.common
            .Amount.fromObject(a.positiveChargebackAmount));
        null != a.fraudCategory && P(b, 3, a.fraudCategory);
        a.reverseDetails && S(b, 4, Y.moneta.integrator.common
            .fundsguarantee.ChargebackDetails.ReverseDetails.fromObject(
                a.reverseDetails));
        return b
    });
Y.moneta.integrator.common.fundsguarantee.ChargebackDetails.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.common.fundsguarantee.ChargebackDetails
            .deserializeBinaryFromReader(new Y.moneta.integrator.common
                .fundsguarantee.ChargebackDetails, new C(a))
    };
Y.moneta.integrator.common.fundsguarantee.ChargebackDetails
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c, Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                a.setChargebackAmount(c);
                break;
            case 2:
                c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c, Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                S(a, 2, c);
                break;
            case 3:
                c = b.readBool();
                a.setFraudCategory(c);
                break;
            case 4:
                c =
                    new Y.moneta.integrator.common.fundsguarantee
                    .ChargebackDetails.ReverseDetails;
                b.readMessage(c, Y.moneta.integrator.common.fundsguarantee
                    .ChargebackDetails.ReverseDetails
                    .deserializeBinaryFromReader);
                S(a, 4, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.fundsguarantee.ChargebackDetails
    .serializeBinaryToWriter = function (a, b) {
        var c = a.getChargebackAmount();
        null != c && J(b, 1, c, Y.moneta.integrator.common.Amount
            .serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.common.Amount, 2);
        null != c && J(b, 2, c, Y.moneta.integrator.common.Amount
            .serializeBinaryToWriter);
        c = O(a, 3);
        null != c && b.writeBool(3, c);
        c = Q(a, Y.moneta.integrator.common.fundsguarantee.ChargebackDetails
            .ReverseDetails, 4);
        null != c && J(b, 4, c, Y.moneta.integrator.common.fundsguarantee
            .ChargebackDetails.ReverseDetails.serializeBinaryToWriter)
    };
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .ChargebackDetails.ReverseDetails.prototype.toObject = function (a) {
        return Y.moneta.integrator.common.fundsguarantee.ChargebackDetails
            .ReverseDetails.toObject(a, this)
    }, Y.moneta.integrator.common.fundsguarantee.ChargebackDetails
    .ReverseDetails.toObject = function (a, b) {
        var c, f = {
            reverseChargebackAmount: (c = Q(b, Y.moneta.integrator
                    .common.Amount, 1)) && Y.moneta.integrator.common
                .Amount.toObject(a, c),
            fraudCategory: null == (c = wc(b, 2)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance =
            b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .ChargebackDetails.ReverseDetails.ObjectFormat = function () {}, Y
    .moneta.integrator.common.fundsguarantee.ChargebackDetails
    .ReverseDetails.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.fundsguarantee
            .ChargebackDetails.ReverseDetails;
        a.reverseChargebackAmount && S(b, 1, Y.moneta.integrator.common
            .Amount.fromObject(a.reverseChargebackAmount));
        null != a.fraudCategory && P(b, 2, a.fraudCategory);
        return b
    });
Y.moneta.integrator.common.fundsguarantee.ChargebackDetails.ReverseDetails
    .deserializeBinary = function (a) {
        return Y.moneta.integrator.common.fundsguarantee.ChargebackDetails
            .ReverseDetails.deserializeBinaryFromReader(new Y.moneta.integrator
                .common.fundsguarantee.ChargebackDetails.ReverseDetails, new C(
                    a))
    };
Y.moneta.integrator.common.fundsguarantee.ChargebackDetails.ReverseDetails
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c, Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                S(a, 1, c);
                break;
            case 2:
                c = b.readBool();
                a.setFraudCategory(c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.fundsguarantee.ChargebackDetails.ReverseDetails
    .serializeBinaryToWriter = function (a, b) {
        var c = Q(a, Y.moneta.integrator.common.Amount, 1);
        null != c && J(b, 1, c, Y.moneta.integrator.common.Amount
            .serializeBinaryToWriter);
        c = O(a, 2);
        null != c && b.writeBool(2, c)
    };
Y.moneta.integrator.common.fundsguarantee.ChargebackDetails.ReverseDetails
    .prototype.setFraudCategory = function (a) {
        P(this, 2, a)
    };
Y.moneta.integrator.common.fundsguarantee.ChargebackDetails.ReverseDetails
    .deserialize = function (a) {
        return X(Y.moneta.integrator.common.fundsguarantee.ChargebackDetails
            .ReverseDetails, a)
    };
Y.moneta.integrator.common.fundsguarantee.ChargebackDetails.prototype
    .getChargebackAmount = function () {
        return Q(this, Y.moneta.integrator.common.Amount, 1)
    };
Y.moneta.integrator.common.fundsguarantee.ChargebackDetails.prototype
    .setChargebackAmount = function (a) {
        S(this, 1, a)
    };
Y.moneta.integrator.common.fundsguarantee.ChargebackDetails.prototype
    .setFraudCategory = function (a) {
        P(this, 3, a)
    };
Y.moneta.integrator.common.fundsguarantee.ChargebackDetails.deserialize =
    function (a) {
        return X(Y.moneta.integrator.common.fundsguarantee.ChargebackDetails, a)
    };
Y.moneta.integrator.common.fundsguarantee.ChargeDetails = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.fundsguarantee.ChargeDetails, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.fundsguarantee.ChargeDetails
    .prototype.toObject = function (a) {
        return Y.moneta.integrator.common.fundsguarantee.ChargeDetails
            .toObject(a, this)
    }, Y.moneta.integrator.common.fundsguarantee.ChargeDetails.toObject =
    function (a, b) {
        var c, f = {
            chargedAmount: (c = b.getChargedAmount()) && Y.moneta
                .integrator.common.Amount.toObject(a, c),
            chargeFailedAmount: (c = Q(b, Y.moneta.integrator.common
                    .Amount, 2)) && Y.moneta.integrator.common.Amount
                .toObject(a, c),
            refundAvailabilityMillis: null ==
                (c = O(b, 3)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .ChargeDetails.ObjectFormat = function () {}, Y.moneta.integrator.common
    .fundsguarantee.ChargeDetails.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.fundsguarantee.ChargeDetails;
        a.chargedAmount && S(b, 1, Y.moneta.integrator.common.Amount
            .fromObject(a.chargedAmount));
        a.chargeFailedAmount && S(b, 2, Y.moneta.integrator.common.Amount
            .fromObject(a.chargeFailedAmount));
        null != a.refundAvailabilityMillis && P(b, 3, a
            .refundAvailabilityMillis);
        return b
    });
Y.moneta.integrator.common.fundsguarantee.ChargeDetails.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.common.fundsguarantee.ChargeDetails
            .deserializeBinaryFromReader(new Y.moneta.integrator.common
                .fundsguarantee.ChargeDetails, new C(a))
    };
Y.moneta.integrator.common.fundsguarantee.ChargeDetails
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c, Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                a.setChargedAmount(c);
                break;
            case 2:
                c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c, Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                S(a, 2, c);
                break;
            case 3:
                c = b.readInt64();
                P(a, 3, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.fundsguarantee.ChargeDetails
    .serializeBinaryToWriter = function (a, b) {
        var c = a.getChargedAmount();
        null != c && J(b, 1, c, Y.moneta.integrator.common.Amount
            .serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.common.Amount, 2);
        null != c && J(b, 2, c, Y.moneta.integrator.common.Amount
            .serializeBinaryToWriter);
        c = O(a, 3);
        null != c && b.writeInt64(3, c)
    };
Y.moneta.integrator.common.fundsguarantee.ChargeDetails.prototype
    .getChargedAmount = function () {
        return Q(this, Y.moneta.integrator.common.Amount, 1)
    };
Y.moneta.integrator.common.fundsguarantee.ChargeDetails.prototype
    .setChargedAmount = function (a) {
        S(this, 1, a)
    };
Y.moneta.integrator.common.fundsguarantee.ChargeDetails.deserialize = function (
    a) {
    return X(Y.moneta.integrator.common.fundsguarantee.ChargeDetails, a)
};
Y.moneta.integrator.common.fundsguarantee.DeclineDetails = function (a) {
    M(this, a, -1, null, Y.moneta.integrator.common.fundsguarantee
        .DeclineDetails.oneofGroups_)
};
k.inherits(Y.moneta.integrator.common.fundsguarantee.DeclineDetails, L);
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.ErrorAction =
    function (a) {
        M(this, a, -1, null, null)
    };
k.inherits(Y.moneta.integrator.common.fundsguarantee.DeclineDetails.ErrorAction,
    L);
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.CouponCodeAbuse =
    function (a) {
        M(this, a, -1, Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .CouponCodeAbuse.repeatedFields_, null)
    };
k.inherits(Y.moneta.integrator.common.fundsguarantee.DeclineDetails
    .CouponCodeAbuse, L);
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.DisallowedInstrument =
    function (a) {
        M(this, a, -1, null, null)
    };
k.inherits(Y.moneta.integrator.common.fundsguarantee.DeclineDetails
    .DisallowedInstrument, L);
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.SpendingLimitExceeded =
    function (a) {
        M(this, a, -1, null, null)
    };
k.inherits(Y.moneta.integrator.common.fundsguarantee.DeclineDetails
    .SpendingLimitExceeded, L);
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.DasherPolicy =
    function (a) {
        M(this, a, -1, null, null)
    };
k.inherits(Y.moneta.integrator.common.fundsguarantee.DeclineDetails
    .DasherPolicy, L);
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.IssuerDeclined =
    function (a) {
        M(this, a, -1, null, null)
    };
k.inherits(Y.moneta.integrator.common.fundsguarantee.DeclineDetails
    .IssuerDeclined, L);
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.oneofGroups_ = [
    [5, 6, 7, 10]
];
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.PolicyViolationCase = {
    POLICY_VIOLATION_NOT_SET: 0,
    COUPON_CODE_ABUSE: 5,
    DISALLOWED_INSTRUMENT: 6,
    SPENDING_LIMIT_EXCEEDED: 7,
    DASHER_POLICY: 10
};
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .DeclineDetails.prototype.toObject = function (a) {
        return Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .toObject(a, this)
    }, Y.moneta.integrator.common.fundsguarantee.DeclineDetails.toObject =
    function (a, b) {
        var c, f = {
            declineReason: null == (c = O(b, 2)) ? void 0 : c,
            declineReasonUserMessage: null == (c = O(b, 1)) ? void 0 :
                c,
            primaryAction: (c = Q(b, Y.moneta.integrator.common
                    .fundsguarantee.DeclineDetails.ErrorAction, 4)) && Y
                .moneta.integrator.common.fundsguarantee.DeclineDetails
                .ErrorAction.toObject(a,
                    c),
            couponCodeAbuse: (c = Q(b, Y.moneta.integrator.common
                    .fundsguarantee.DeclineDetails.CouponCodeAbuse,
                    5)) && Y.moneta.integrator.common.fundsguarantee
                .DeclineDetails.CouponCodeAbuse.toObject(a, c),
            disallowedInstrument: (c = Q(b, Y.moneta.integrator.common
                    .fundsguarantee.DeclineDetails
                    .DisallowedInstrument, 6)) && Y.moneta.integrator
                .common.fundsguarantee.DeclineDetails
                .DisallowedInstrument.toObject(a, c),
            spendingLimitExceeded: (c = Q(b, Y.moneta.integrator.common
                    .fundsguarantee.DeclineDetails
                    .SpendingLimitExceeded,
                    7)) && Y.moneta.integrator.common.fundsguarantee
                .DeclineDetails.SpendingLimitExceeded.toObject(a, c),
            dasherPolicy: (c = Q(b, Y.moneta.integrator.common
                        .fundsguarantee.DeclineDetails.DasherPolicy, 10
                        )) && Y.moneta.integrator.common.fundsguarantee
                .DeclineDetails.DasherPolicy.toObject(a, c),
            issuerDeclined: (c = Q(b, Y.moneta.integrator.common
                    .fundsguarantee.DeclineDetails.IssuerDeclined, 9
                    )) && Y.moneta.integrator.common.fundsguarantee
                .DeclineDetails.IssuerDeclined.toObject(a, c)
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .DeclineDetails.ObjectFormat = function () {}, Y.moneta.integrator
    .common.fundsguarantee.DeclineDetails.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.fundsguarantee
        .DeclineDetails;
        null != a.declineReason && P(b, 2, a.declineReason);
        null != a.declineReasonUserMessage && P(b, 1, a
            .declineReasonUserMessage);
        a.primaryAction && S(b, 4, Y.moneta.integrator.common.fundsguarantee
            .DeclineDetails.ErrorAction.fromObject(a.primaryAction));
        a.couponCodeAbuse &&
            S(b, 5, Y.moneta.integrator.common.fundsguarantee.DeclineDetails
                .CouponCodeAbuse.fromObject(a.couponCodeAbuse));
        a.disallowedInstrument && S(b, 6, Y.moneta.integrator.common
            .fundsguarantee.DeclineDetails.DisallowedInstrument
            .fromObject(a.disallowedInstrument));
        a.spendingLimitExceeded && S(b, 7, Y.moneta.integrator.common
            .fundsguarantee.DeclineDetails.SpendingLimitExceeded
            .fromObject(a.spendingLimitExceeded));
        a.dasherPolicy && S(b, 10, Y.moneta.integrator.common.fundsguarantee
            .DeclineDetails.DasherPolicy.fromObject(a.dasherPolicy));
        a.issuerDeclined && S(b, 9, Y.moneta.integrator.common
            .fundsguarantee.DeclineDetails.IssuerDeclined.fromObject(a
                .issuerDeclined));
        return b
    });
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .deserializeBinaryFromReader(new Y.moneta.integrator.common
                .fundsguarantee.DeclineDetails, new C(a))
    };
Y.moneta.integrator.common.fundsguarantee.DeclineDetails
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 2:
                var c = b.readEnum();
                P(a, 2, c);
                break;
            case 1:
                c = b.readString();
                P(a, 1, c);
                break;
            case 4:
                c = new Y.moneta.integrator.common.fundsguarantee
                    .DeclineDetails.ErrorAction;
                b.readMessage(c, Y.moneta.integrator.common.fundsguarantee
                    .DeclineDetails.ErrorAction
                    .deserializeBinaryFromReader);
                S(a, 4, c);
                break;
            case 5:
                c = new Y.moneta.integrator.common.fundsguarantee
                    .DeclineDetails.CouponCodeAbuse;
                b.readMessage(c, Y.moneta.integrator.common.fundsguarantee
                    .DeclineDetails.CouponCodeAbuse
                    .deserializeBinaryFromReader);
                U(a, 5, Y.moneta.integrator.common.fundsguarantee
                    .DeclineDetails.oneofGroups_[0], c);
                break;
            case 6:
                c = new Y.moneta.integrator.common.fundsguarantee
                    .DeclineDetails.DisallowedInstrument;
                b.readMessage(c, Y.moneta.integrator.common.fundsguarantee
                    .DeclineDetails.DisallowedInstrument
                    .deserializeBinaryFromReader);
                U(a, 6, Y.moneta.integrator.common.fundsguarantee
                    .DeclineDetails.oneofGroups_[0], c);
                break;
            case 7:
                c = new Y.moneta.integrator.common.fundsguarantee
                    .DeclineDetails.SpendingLimitExceeded;
                b.readMessage(c, Y.moneta.integrator.common.fundsguarantee
                    .DeclineDetails.SpendingLimitExceeded
                    .deserializeBinaryFromReader);
                U(a, 7, Y.moneta.integrator.common.fundsguarantee
                    .DeclineDetails.oneofGroups_[0], c);
                break;
            case 10:
                c = new Y.moneta.integrator.common.fundsguarantee
                    .DeclineDetails.DasherPolicy;
                b.readMessage(c, Y.moneta.integrator.common.fundsguarantee
                    .DeclineDetails.DasherPolicy
                    .deserializeBinaryFromReader);
                U(a, 10, Y.moneta.integrator.common.fundsguarantee
                    .DeclineDetails.oneofGroups_[0], c);
                break;
            case 9:
                c = new Y.moneta.integrator.common.fundsguarantee
                    .DeclineDetails.IssuerDeclined;
                b.readMessage(c, Y.moneta.integrator.common.fundsguarantee
                    .DeclineDetails.IssuerDeclined
                    .deserializeBinaryFromReader);
                S(a, 9, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.fundsguarantee.DeclineDetails
    .serializeBinaryToWriter = function (a, b) {
        var c = O(a, 2);
        null != c && b.writeEnum(2, c);
        c = O(a, 1);
        null != c && b.writeString(1, c);
        c = Q(a, Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .ErrorAction, 4);
        null != c && J(b, 4, c, Y.moneta.integrator.common.fundsguarantee
            .DeclineDetails.ErrorAction.serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .CouponCodeAbuse, 5);
        null != c && J(b, 5, c, Y.moneta.integrator.common.fundsguarantee
            .DeclineDetails.CouponCodeAbuse.serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .DisallowedInstrument, 6);
        null != c && J(b, 6, c, Y.moneta.integrator.common.fundsguarantee
            .DeclineDetails.DisallowedInstrument.serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .SpendingLimitExceeded, 7);
        null != c && J(b, 7, c, Y.moneta.integrator.common.fundsguarantee
            .DeclineDetails.SpendingLimitExceeded.serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .DasherPolicy, 10);
        null !=
            c && J(b, 10, c, Y.moneta.integrator.common.fundsguarantee
                .DeclineDetails.DasherPolicy.serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .IssuerDeclined, 9);
        null != c && J(b, 9, c, Y.moneta.integrator.common.fundsguarantee
            .DeclineDetails.IssuerDeclined.serializeBinaryToWriter)
    };
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.DeclineReason = {
    DECLINE_REASON_UNKNOWN: 0,
    PAYMENTS_DECLINED: 1,
    PAYMENTS_DECLINED_FIXABLE: 4,
    ISSUER_DECLINED: 2,
    PAYMENTS_DECLINED_PROMO_CODE_POLICY_VIOLATION: 3,
    EXPIRED_BEFORE_USER_ACTION: 5,
    EXCEEDED_SYSTEM_RETRY_LIMITS: 6,
    NOT_AUTO_PULLABLE: 8,
    CLIENT_CAPABILITY_MISSING: 9
};
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .DeclineDetails.ErrorAction.prototype.toObject = function (a) {
        return Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .ErrorAction.toObject(a, this)
    }, Y.moneta.integrator.common.fundsguarantee.DeclineDetails.ErrorAction
    .toObject = function (a, b) {
        var c, f = {
            url: null == (c = O(b, 1)) ? void 0 : c,
            label: null == (c = O(b, 2)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .DeclineDetails.ErrorAction.ObjectFormat = function () {}, Y.moneta
    .integrator.common.fundsguarantee.DeclineDetails.ErrorAction
    .fromObject = function (a) {
        var b = new Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .ErrorAction;
        null != a.url && P(b, 1, a.url);
        null != a.label && P(b, 2, a.label);
        return b
    });
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.ErrorAction
    .deserializeBinary = function (a) {
        return Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .ErrorAction.deserializeBinaryFromReader(new Y.moneta.integrator
                .common.fundsguarantee.DeclineDetails.ErrorAction, new C(a))
    };
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.ErrorAction
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readString();
                P(a, 1, c);
                break;
            case 2:
                c = b.readString();
                P(a, 2, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.ErrorAction
    .serializeBinaryToWriter = function (a, b) {
        var c = O(a, 1);
        null != c && b.writeString(1, c);
        c = O(a, 2);
        null != c && b.writeString(2, c)
    };
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.ErrorAction.prototype
    .getUrl = function () {
        return O(this, 1)
    };
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.ErrorAction
    .deserialize = function (a) {
        return X(Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .ErrorAction, a)
    };
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.CouponCodeAbuse
    .repeatedFields_ = [2];
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .DeclineDetails.CouponCodeAbuse.prototype.toObject = function (a) {
        return Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .CouponCodeAbuse.toObject(a, this)
    }, Y.moneta.integrator.common.fundsguarantee.DeclineDetails
    .CouponCodeAbuse.toObject = function (a, b) {
        var c, f = {
            abuseType: null == (c = O(b, 1)) ? void 0 : c,
            reusedCouponCodeList: null == (c = sc(b, 2)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .DeclineDetails.CouponCodeAbuse.ObjectFormat = function () {}, Y.moneta
    .integrator.common.fundsguarantee.DeclineDetails.CouponCodeAbuse
    .fromObject = function (a) {
        var b = new Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .CouponCodeAbuse;
        null != a.abuseType && P(b, 1, a.abuseType);
        null != a.reusedCouponCodeList && P(b, 2, a.reusedCouponCodeList);
        return b
    });
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.CouponCodeAbuse
    .deserializeBinary = function (a) {
        return Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .CouponCodeAbuse.deserializeBinaryFromReader(new Y.moneta.integrator
                .common.fundsguarantee.DeclineDetails.CouponCodeAbuse, new C(a))
    };
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.CouponCodeAbuse
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readEnum();
                P(a, 1, c);
                break;
            case 2:
                c = b.readString();
                Ac(a, 2, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.CouponCodeAbuse
    .serializeBinaryToWriter = function (a, b) {
        var c = O(a, 1);
        null != c && b.writeEnum(1, c);
        c = sc(a, 2);
        0 < c.length && bc(b, 2, c)
    };
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.CouponCodeAbuse
    .AbuseType = {
        ABUSE_TYPE_UNKNOWN: 0,
        ABUSE_TYPE_INELIGIBLE_INSTRUMENT: 1,
        ABUSE_TYPE_INSTRUMENT_REUSE: 2
    };
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.CouponCodeAbuse
    .deserialize = function (a) {
        return X(Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .CouponCodeAbuse, a)
    };
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .DeclineDetails.DisallowedInstrument.prototype.toObject = function (a) {
        return Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .DisallowedInstrument.toObject(a, this)
    }, Y.moneta.integrator.common.fundsguarantee.DeclineDetails
    .DisallowedInstrument.toObject = function (a, b) {
        var c, f = {
            disallowedInstrumentType: null == (c = O(b, 1)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .DeclineDetails.DisallowedInstrument.ObjectFormat = function () {}, Y
    .moneta.integrator.common.fundsguarantee.DeclineDetails
    .DisallowedInstrument.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .DisallowedInstrument;
        null != a.disallowedInstrumentType && P(b, 1, a
            .disallowedInstrumentType);
        return b
    });
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.DisallowedInstrument
    .deserializeBinary = function (a) {
        return Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .DisallowedInstrument.deserializeBinaryFromReader(new Y.moneta
                .integrator.common.fundsguarantee.DeclineDetails
                .DisallowedInstrument, new C(a))
    };
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.DisallowedInstrument
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readEnum();
                P(a, 1, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.DisallowedInstrument
    .serializeBinaryToWriter = function (a, b) {
        a = O(a, 1);
        null != a && b.writeEnum(1, a)
    };
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.DisallowedInstrument
    .DisallowedInstrumentType = {
        DISALLOWED_INSTRUMENT_TYPE_UNKNOWN: 0,
        DISALLOWED_INSTRUMENT_TYPE_PREPAID_CARD: 1,
        DISALLOWED_INSTRUMENT_TYPE_SHARED_BY_MULTIPLE_CUSTOMERS: 2,
        DISALLOWED_INSTRUMENT_TYPE_TOO_MANY_INSTRUMENTS_ON_FILE: 3,
        DISALLOWED_INSTRUMENT_TYPE_UNVERIFIED_INSTRUMENT: 4,
        DISALLOWED_INSTRUMENT_TYPE_BLACKLISTED_BANK: 5,
        DISALLOWED_INSTRUMENT_TYPE_REPORTED_STOLEN_INSTRUMENT: 6,
        DISALLOWED_INSTRUMENT_TYPE_INSTRUMENT_RELATIONS_VELOCITY_EXCEEDED: 7,
        DISALLOWED_INSTRUMENT_TYPE_ISSUER_DECLINE_VELOCITY_EXCEEDED: 8,
        DISALLOWED_INSTRUMENT_TYPE_ADDRESS_VELOCITY_EXCEEDED: 9,
        DISALLOWED_INSTRUMENT_TYPE_SENDER_INSTRUMENT_USED_BY_FRAUDSTER: 10,
        DISALLOWED_INSTRUMENT_TYPE_RECIPIENT_INSTRUMENT_USED_BY_FRAUDSTER: 11,
        DISALLOWED_INSTRUMENT_TYPE_WITHDRAWALS_NOT_ALLOWED: 12
    };
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.DisallowedInstrument
    .deserialize = function (a) {
        return X(Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .DisallowedInstrument, a)
    };
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .DeclineDetails.SpendingLimitExceeded.prototype.toObject = function (
    a) {
        return Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .SpendingLimitExceeded.toObject(a, this)
    }, Y.moneta.integrator.common.fundsguarantee.DeclineDetails
    .SpendingLimitExceeded.toObject = function (a, b) {
        var c, f = {
            spendingLimitType: null == (c = O(b, 1)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .DeclineDetails.SpendingLimitExceeded.ObjectFormat = function () {}, Y
    .moneta.integrator.common.fundsguarantee.DeclineDetails
    .SpendingLimitExceeded.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .SpendingLimitExceeded;
        null != a.spendingLimitType && P(b, 1, a.spendingLimitType);
        return b
    });
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.SpendingLimitExceeded
    .deserializeBinary = function (a) {
        return Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .SpendingLimitExceeded.deserializeBinaryFromReader(new Y.moneta
                .integrator.common.fundsguarantee.DeclineDetails
                .SpendingLimitExceeded, new C(a))
    };
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.SpendingLimitExceeded
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readEnum();
                P(a, 1, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.SpendingLimitExceeded
    .serializeBinaryToWriter = function (a, b) {
        a = O(a, 1);
        null != a && b.writeEnum(1, a)
    };
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.SpendingLimitExceeded
    .SpendingLimitType = {
        SPENDING_LIMIT_TYPE_UNKNOWN: 0,
        SPENDING_LIMIT_TYPE_DAILY: 1,
        SPENDING_LIMIT_TYPE_WEEKLY: 2
    };
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.SpendingLimitExceeded
    .deserialize = function (a) {
        return X(Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .SpendingLimitExceeded, a)
    };
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .DeclineDetails.DasherPolicy.prototype.toObject = function (a) {
        return Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .DasherPolicy.toObject(a, this)
    }, Y.moneta.integrator.common.fundsguarantee.DeclineDetails.DasherPolicy
    .toObject = function (a, b) {
        var c, f = {
            dasherPolicyType: null == (c = O(b, 1)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .DeclineDetails.DasherPolicy.ObjectFormat = function () {}, Y.moneta
    .integrator.common.fundsguarantee.DeclineDetails.DasherPolicy
    .fromObject = function (a) {
        var b = new Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .DasherPolicy;
        null != a.dasherPolicyType && P(b, 1, a.dasherPolicyType);
        return b
    });
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.DasherPolicy
    .deserializeBinary = function (a) {
        return Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .DasherPolicy.deserializeBinaryFromReader(new Y.moneta.integrator
                .common.fundsguarantee.DeclineDetails.DasherPolicy, new C(a))
    };
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.DasherPolicy
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readEnum();
                P(a, 1, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.DasherPolicy
    .serializeBinaryToWriter = function (a, b) {
        a = O(a, 1);
        null != a && b.writeEnum(1, a)
    };
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.DasherPolicy
    .DasherPolicyType = {
        DASHER_POLICY_TYPE_UNKNOWN: 0,
        DASHER_POLICY_TYPE_DASHER_USERS_CUSTOMER_SUSPENDED: 1
    };
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.DasherPolicy
    .deserialize = function (a) {
        return X(Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .DasherPolicy, a)
    };
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .DeclineDetails.IssuerDeclined.prototype.toObject = function (a) {
        return Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .IssuerDeclined.toObject(a, this)
    }, Y.moneta.integrator.common.fundsguarantee.DeclineDetails
    .IssuerDeclined.toObject = function (a, b) {
        var c, f = {
            issuerDeclineReason: null == (c = O(b, 1)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .DeclineDetails.IssuerDeclined.ObjectFormat = function () {}, Y.moneta
    .integrator.common.fundsguarantee.DeclineDetails.IssuerDeclined
    .fromObject = function (a) {
        var b = new Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .IssuerDeclined;
        null != a.issuerDeclineReason && P(b, 1, a.issuerDeclineReason);
        return b
    });
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.IssuerDeclined
    .deserializeBinary = function (a) {
        return Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .IssuerDeclined.deserializeBinaryFromReader(new Y.moneta.integrator
                .common.fundsguarantee.DeclineDetails.IssuerDeclined, new C(a))
    };
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.IssuerDeclined
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readEnum();
                P(a, 1, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.IssuerDeclined
    .serializeBinaryToWriter = function (a, b) {
        a = O(a, 1);
        null != a && b.writeEnum(1, a)
    };
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.IssuerDeclined
    .IssuerDeclineReason = {
        ISSUER_DECLINE_REASON_UNKNOWN: 0,
        ISSUER_DECLINE_REASON_AUTHENTICATION_REQUIRED: 1
    };
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.IssuerDeclined
    .deserialize = function (a) {
        return X(Y.moneta.integrator.common.fundsguarantee.DeclineDetails
            .IssuerDeclined, a)
    };
Y.moneta.integrator.common.fundsguarantee.DeclineDetails.deserialize =
    function (a) {
        return X(Y.moneta.integrator.common.fundsguarantee.DeclineDetails, a)
    };
Y.moneta.integrator.common.fundsguarantee.FundsAvailability = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.fundsguarantee.FundsAvailability, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .FundsAvailability.prototype.toObject = function (a) {
        return Y.moneta.integrator.common.fundsguarantee.FundsAvailability
            .toObject(a, this)
    }, Y.moneta.integrator.common.fundsguarantee.FundsAvailability
    .toObject = function (a, b) {
        var c, f = {
            fundsAvailabilityMillis: null == (c = O(b, 1)) ? void 0 : c,
            fundsAvailabilityMessage: null == (c = O(b, 3)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .FundsAvailability.ObjectFormat = function () {}, Y.moneta.integrator
    .common.fundsguarantee.FundsAvailability.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.fundsguarantee
            .FundsAvailability;
        null != a.fundsAvailabilityMillis && P(b, 1, a
            .fundsAvailabilityMillis);
        null != a.fundsAvailabilityMessage && P(b, 3, a
            .fundsAvailabilityMessage);
        return b
    });
Y.moneta.integrator.common.fundsguarantee.FundsAvailability.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.common.fundsguarantee.FundsAvailability
            .deserializeBinaryFromReader(new Y.moneta.integrator.common
                .fundsguarantee.FundsAvailability, new C(a))
    };
Y.moneta.integrator.common.fundsguarantee.FundsAvailability
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readInt64();
                P(a, 1, c);
                break;
            case 3:
                c = b.readEnum();
                P(a, 3, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.fundsguarantee.FundsAvailability
    .serializeBinaryToWriter = function (a, b) {
        var c = O(a, 1);
        null != c && b.writeInt64(1, c);
        c = O(a, 3);
        null != c && b.writeEnum(3, c)
    };
Y.moneta.integrator.common.fundsguarantee.FundsAvailability
    .FundsAvailabilityMessage = {
        UNKNOWN: 0,
        DEFAULT: 1,
        WARN_FOR_POTENTIAL_FRAUD: 2
    };
Y.moneta.integrator.common.fundsguarantee.FundsAvailability.deserialize =
    function (a) {
        return X(Y.moneta.integrator.common.fundsguarantee.FundsAvailability, a)
    };
Y.moneta.integrator.common.fundsguarantee.DisburseDetails = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.fundsguarantee.DisburseDetails, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .DisburseDetails.prototype.toObject = function (a) {
        return Y.moneta.integrator.common.fundsguarantee.DisburseDetails
            .toObject(a, this)
    }, Y.moneta.integrator.common.fundsguarantee.DisburseDetails.toObject =
    function (a, b) {
        var c, f = {
            disbursedAmount: (c = b.getDisbursedAmount()) && Y.moneta
                .integrator.common.Amount.toObject(a, c),
            disbursePendingAmount: (c = Q(b, Y.moneta.integrator.common
                    .Amount, 2)) && Y.moneta.integrator.common.Amount
                .toObject(a, c),
            disburseFailedAmount: (c =
                    Q(b, Y.moneta.integrator.common.Amount, 3)) && Y
                .moneta.integrator.common.Amount.toObject(a, c),
            fundsAvailability: (c = b.getFundsAvailability()) && Y
                .moneta.integrator.common.fundsguarantee
                .FundsAvailability.toObject(a, c)
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .DisburseDetails.ObjectFormat = function () {}, Y.moneta.integrator
    .common.fundsguarantee.DisburseDetails.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.fundsguarantee
            .DisburseDetails;
        a.disbursedAmount && S(b, 1, Y.moneta.integrator.common.Amount
            .fromObject(a.disbursedAmount));
        a.disbursePendingAmount && S(b, 2, Y.moneta.integrator.common.Amount
            .fromObject(a.disbursePendingAmount));
        a.disburseFailedAmount && S(b, 3, Y.moneta.integrator.common.Amount
            .fromObject(a.disburseFailedAmount));
        a.fundsAvailability && S(b, 4, Y.moneta.integrator.common
            .fundsguarantee.FundsAvailability.fromObject(a
                .fundsAvailability));
        return b
    });
Y.moneta.integrator.common.fundsguarantee.DisburseDetails.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.common.fundsguarantee.DisburseDetails
            .deserializeBinaryFromReader(new Y.moneta.integrator.common
                .fundsguarantee.DisburseDetails, new C(a))
    };
Y.moneta.integrator.common.fundsguarantee.DisburseDetails
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c, Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                a.setDisbursedAmount(c);
                break;
            case 2:
                c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c, Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                S(a, 2, c);
                break;
            case 3:
                c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c,
                    Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                S(a, 3, c);
                break;
            case 4:
                c = new Y.moneta.integrator.common.fundsguarantee
                    .FundsAvailability;
                b.readMessage(c, Y.moneta.integrator.common.fundsguarantee
                    .FundsAvailability.deserializeBinaryFromReader);
                a.setFundsAvailability(c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.fundsguarantee.DisburseDetails
    .serializeBinaryToWriter = function (a, b) {
        var c = a.getDisbursedAmount();
        null != c && J(b, 1, c, Y.moneta.integrator.common.Amount
            .serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.common.Amount, 2);
        null != c && J(b, 2, c, Y.moneta.integrator.common.Amount
            .serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.common.Amount, 3);
        null != c && J(b, 3, c, Y.moneta.integrator.common.Amount
            .serializeBinaryToWriter);
        c = a.getFundsAvailability();
        null != c && J(b, 4, c, Y.moneta.integrator.common.fundsguarantee
            .FundsAvailability.serializeBinaryToWriter)
    };
Y.moneta.integrator.common.fundsguarantee.DisburseDetails.prototype
    .getDisbursedAmount = function () {
        return Q(this, Y.moneta.integrator.common.Amount, 1)
    };
Y.moneta.integrator.common.fundsguarantee.DisburseDetails.prototype
    .setDisbursedAmount = function (a) {
        S(this, 1, a)
    };
Y.moneta.integrator.common.fundsguarantee.DisburseDetails.prototype
    .getFundsAvailability = function () {
        return Q(this, Y.moneta.integrator.common.fundsguarantee
            .FundsAvailability, 4)
    };
Y.moneta.integrator.common.fundsguarantee.DisburseDetails.prototype
    .setFundsAvailability = function (a) {
        S(this, 4, a)
    };
Y.moneta.integrator.common.fundsguarantee.DisburseDetails.deserialize =
    function (a) {
        return X(Y.moneta.integrator.common.fundsguarantee.DisburseDetails, a)
    };
Y.moneta.integrator.common.fundsguarantee.SystemRetryDetails = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.fundsguarantee.SystemRetryDetails, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .SystemRetryDetails.prototype.toObject = function (a) {
        return Y.moneta.integrator.common.fundsguarantee.SystemRetryDetails
            .toObject(a, this)
    }, Y.moneta.integrator.common.fundsguarantee.SystemRetryDetails
    .toObject = function (a, b) {
        var c, f = {
            declineDetails: (c = b.getDeclineDetails()) && Y.moneta
                .integrator.common.fundsguarantee.DeclineDetails
                .toObject(a, c),
            paymentRetryAttemptCount: null == (c = O(b, 2)) ? void 0 :
                c,
            lastRetryTimeMillis: null == (c = O(b, 3)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .SystemRetryDetails.ObjectFormat = function () {}, Y.moneta.integrator
    .common.fundsguarantee.SystemRetryDetails.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.fundsguarantee
            .SystemRetryDetails;
        a.declineDetails && S(b, 1, Y.moneta.integrator.common
            .fundsguarantee.DeclineDetails.fromObject(a.declineDetails));
        null != a.paymentRetryAttemptCount && P(b, 2, a
            .paymentRetryAttemptCount);
        null != a.lastRetryTimeMillis && P(b, 3, a.lastRetryTimeMillis);
        return b
    });
Y.moneta.integrator.common.fundsguarantee.SystemRetryDetails.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.common.fundsguarantee.SystemRetryDetails
            .deserializeBinaryFromReader(new Y.moneta.integrator.common
                .fundsguarantee.SystemRetryDetails, new C(a))
    };
Y.moneta.integrator.common.fundsguarantee.SystemRetryDetails
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = new Y.moneta.integrator.common.fundsguarantee
                    .DeclineDetails;
                b.readMessage(c, Y.moneta.integrator.common.fundsguarantee
                    .DeclineDetails.deserializeBinaryFromReader);
                a.setDeclineDetails(c);
                break;
            case 2:
                c = b.readInt32();
                P(a, 2, c);
                break;
            case 3:
                c = b.readInt64();
                P(a, 3, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.fundsguarantee.SystemRetryDetails
    .serializeBinaryToWriter = function (a, b) {
        var c = a.getDeclineDetails();
        null != c && J(b, 1, c, Y.moneta.integrator.common.fundsguarantee
            .DeclineDetails.serializeBinaryToWriter);
        c = O(a, 2);
        null != c && b.writeInt32(2, c);
        c = O(a, 3);
        null != c && b.writeInt64(3, c)
    };
Y.moneta.integrator.common.fundsguarantee.SystemRetryDetails.prototype
    .getDeclineDetails = function () {
        return Q(this, Y.moneta.integrator.common.fundsguarantee.DeclineDetails,
            1)
    };
Y.moneta.integrator.common.fundsguarantee.SystemRetryDetails.prototype
    .setDeclineDetails = function (a) {
        S(this, 1, a)
    };
Y.moneta.integrator.common.fundsguarantee.SystemRetryDetails.deserialize =
    function (a) {
        return X(Y.moneta.integrator.common.fundsguarantee.SystemRetryDetails,
            a)
    };
Y.moneta.integrator.common.fundsguarantee.UserActionDetails = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.fundsguarantee.UserActionDetails, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .UserActionDetails.prototype.toObject = function (a) {
        return Y.moneta.integrator.common.fundsguarantee.UserActionDetails
            .toObject(a, this)
    }, Y.moneta.integrator.common.fundsguarantee.UserActionDetails
    .toObject = function (a, b) {
        var c, f = {
            userActionType: null == (c = O(b, 1)) ? void 0 : c,
            instructionExpirationTimeMillis: null == (c = O(b, 2)) ?
                void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .UserActionDetails.ObjectFormat = function () {}, Y.moneta.integrator
    .common.fundsguarantee.UserActionDetails.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.fundsguarantee
            .UserActionDetails;
        null != a.userActionType && P(b, 1, a.userActionType);
        null != a.instructionExpirationTimeMillis && P(b, 2, a
            .instructionExpirationTimeMillis);
        return b
    });
Y.moneta.integrator.common.fundsguarantee.UserActionDetails.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.common.fundsguarantee.UserActionDetails
            .deserializeBinaryFromReader(new Y.moneta.integrator.common
                .fundsguarantee.UserActionDetails, new C(a))
    };
Y.moneta.integrator.common.fundsguarantee.UserActionDetails
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readEnum();
                P(a, 1, c);
                break;
            case 2:
                c = b.readInt64();
                P(a, 2, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.fundsguarantee.UserActionDetails
    .serializeBinaryToWriter = function (a, b) {
        var c = O(a, 1);
        null != c && b.writeEnum(1, c);
        c = O(a, 2);
        null != c && b.writeInt64(2, c)
    };
Y.moneta.integrator.common.fundsguarantee.UserActionDetails.UserActionType = {
    USER_ACTION_UNKNOWN: 0,
    USER_ACTION_COMPLETE_ADDITIONAL_STEP_IN_SESSION: 1,
    USER_ACTION_SHOW_PAYMENT_INSTRUCTION: 2,
    USER_ACTION_FINISH_PAYMENT_OUT_OF_CONTEXT: 3
};
Y.moneta.integrator.common.fundsguarantee.UserActionDetails.deserialize =
    function (a) {
        return X(Y.moneta.integrator.common.fundsguarantee.UserActionDetails, a)
    };
Y.moneta.integrator.common.fundsguarantee.PendingDetails = function (a) {
    M(this, a, -1, null, Y.moneta.integrator.common.fundsguarantee
        .PendingDetails.oneofGroups_)
};
k.inherits(Y.moneta.integrator.common.fundsguarantee.PendingDetails, L);
Y.moneta.integrator.common.fundsguarantee.PendingDetails.oneofGroups_ = [
    [2, 8]
];
Y.moneta.integrator.common.fundsguarantee.PendingDetails
.AdditionalDetailCase = {
    ADDITIONAL_DETAIL_NOT_SET: 0,
    USER_ACTION_DETAILS: 2,
    SYSTEM_RETRY_DETAILS: 8
};
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .PendingDetails.prototype.toObject = function (a) {
        return Y.moneta.integrator.common.fundsguarantee.PendingDetails
            .toObject(a, this)
    }, Y.moneta.integrator.common.fundsguarantee.PendingDetails.toObject =
    function (a, b) {
        var c, f = {
            pendingReason: null == (c = O(b, 1)) ? void 0 : c,
            userActionDetails: (c = Q(b, Y.moneta.integrator.common
                    .fundsguarantee.UserActionDetails, 2)) && Y.moneta
                .integrator.common.fundsguarantee.UserActionDetails
                .toObject(a, c),
            systemRetryDetails: (c =
                    Q(b, Y.moneta.integrator.common.fundsguarantee
                        .SystemRetryDetails, 8)) && Y.moneta.integrator
                .common.fundsguarantee.SystemRetryDetails.toObject(a,
                c),
            fundsAvailability: (c = b.getFundsAvailability()) && Y
                .moneta.integrator.common.fundsguarantee
                .FundsAvailability.toObject(a, c)
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .PendingDetails.ObjectFormat = function () {}, Y.moneta.integrator
    .common.fundsguarantee.PendingDetails.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.fundsguarantee
        .PendingDetails;
        null != a.pendingReason && P(b, 1, a.pendingReason);
        a.userActionDetails && S(b, 2, Y.moneta.integrator.common
            .fundsguarantee.UserActionDetails.fromObject(a
                .userActionDetails));
        a.systemRetryDetails && S(b, 8, Y.moneta.integrator.common
            .fundsguarantee.SystemRetryDetails.fromObject(a
                .systemRetryDetails));
        a.fundsAvailability && S(b, 17, Y.moneta.integrator.common
            .fundsguarantee.FundsAvailability.fromObject(a
                .fundsAvailability));
        return b
    });
Y.moneta.integrator.common.fundsguarantee.PendingDetails.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.common.fundsguarantee.PendingDetails
            .deserializeBinaryFromReader(new Y.moneta.integrator.common
                .fundsguarantee.PendingDetails, new C(a))
    };
Y.moneta.integrator.common.fundsguarantee.PendingDetails
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readEnum();
                P(a, 1, c);
                break;
            case 2:
                c = new Y.moneta.integrator.common.fundsguarantee
                    .UserActionDetails;
                b.readMessage(c, Y.moneta.integrator.common.fundsguarantee
                    .UserActionDetails.deserializeBinaryFromReader);
                U(a, 2, Y.moneta.integrator.common.fundsguarantee
                    .PendingDetails.oneofGroups_[0], c);
                break;
            case 8:
                c = new Y.moneta.integrator.common.fundsguarantee
                    .SystemRetryDetails;
                b.readMessage(c, Y.moneta.integrator.common.fundsguarantee
                    .SystemRetryDetails.deserializeBinaryFromReader);
                U(a, 8, Y.moneta.integrator.common.fundsguarantee
                    .PendingDetails.oneofGroups_[0], c);
                break;
            case 17:
                c = new Y.moneta.integrator.common.fundsguarantee
                    .FundsAvailability;
                b.readMessage(c, Y.moneta.integrator.common.fundsguarantee
                    .FundsAvailability.deserializeBinaryFromReader);
                a.setFundsAvailability(c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.fundsguarantee.PendingDetails
    .serializeBinaryToWriter = function (a, b) {
        var c = O(a, 1);
        null != c && b.writeEnum(1, c);
        c = Q(a, Y.moneta.integrator.common.fundsguarantee.UserActionDetails,
        2);
        null != c && J(b, 2, c, Y.moneta.integrator.common.fundsguarantee
            .UserActionDetails.serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.common.fundsguarantee.SystemRetryDetails,
            8);
        null != c && J(b, 8, c, Y.moneta.integrator.common.fundsguarantee
            .SystemRetryDetails.serializeBinaryToWriter);
        c = a.getFundsAvailability();
        null != c && J(b, 17, c, Y.moneta.integrator.common.fundsguarantee
            .FundsAvailability.serializeBinaryToWriter)
    };
Y.moneta.integrator.common.fundsguarantee.PendingDetails.PendingReason = {
    UNKNOWN: 0,
    WAITING_FOR_USER_ACTION: 1,
    WAITING_FOR_RISK: 2,
    WAITING_FOR_VENDOR: 3,
    WAITING_FOR_SYSTEM_RETRY: 4,
    WAITING_WITH_PLACEHOLDER_INSTRUMENT: 5,
    WAITING_FOR_PRODUCT_ACTION: 6
};
Y.moneta.integrator.common.fundsguarantee.PendingDetails.prototype
    .getFundsAvailability = function () {
        return Q(this, Y.moneta.integrator.common.fundsguarantee
            .FundsAvailability, 17)
    };
Y.moneta.integrator.common.fundsguarantee.PendingDetails.prototype
    .setFundsAvailability = function (a) {
        S(this, 17, a)
    };
Y.moneta.integrator.common.fundsguarantee.PendingDetails.deserialize =
    function (a) {
        return X(Y.moneta.integrator.common.fundsguarantee.PendingDetails, a)
    };
Y.moneta.integrator.common.fundsguarantee.RefundDetails = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.fundsguarantee.RefundDetails, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.fundsguarantee.RefundDetails
    .prototype.toObject = function (a) {
        return Y.moneta.integrator.common.fundsguarantee.RefundDetails
            .toObject(a, this)
    }, Y.moneta.integrator.common.fundsguarantee.RefundDetails.toObject =
    function (a, b) {
        var c, f = {
            refundedAmount: (c = b.getRefundedAmount()) && Y.moneta
                .integrator.common.Amount.toObject(a, c),
            refundFailedAmount: (c = Q(b, Y.moneta.integrator.common
                    .Amount, 2)) && Y.moneta.integrator.common.Amount
                .toObject(a, c)
        };
        a && (f.$jspbMessageInstance =
            b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .RefundDetails.ObjectFormat = function () {}, Y.moneta.integrator.common
    .fundsguarantee.RefundDetails.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.fundsguarantee.RefundDetails;
        a.refundedAmount && S(b, 1, Y.moneta.integrator.common.Amount
            .fromObject(a.refundedAmount));
        a.refundFailedAmount && S(b, 2, Y.moneta.integrator.common.Amount
            .fromObject(a.refundFailedAmount));
        return b
    });
Y.moneta.integrator.common.fundsguarantee.RefundDetails.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.common.fundsguarantee.RefundDetails
            .deserializeBinaryFromReader(new Y.moneta.integrator.common
                .fundsguarantee.RefundDetails, new C(a))
    };
Y.moneta.integrator.common.fundsguarantee.RefundDetails
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c, Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                a.setRefundedAmount(c);
                break;
            case 2:
                c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c, Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                S(a, 2, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.fundsguarantee.RefundDetails
    .serializeBinaryToWriter = function (a, b) {
        var c = a.getRefundedAmount();
        null != c && J(b, 1, c, Y.moneta.integrator.common.Amount
            .serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.common.Amount, 2);
        null != c && J(b, 2, c, Y.moneta.integrator.common.Amount
            .serializeBinaryToWriter)
    };
Y.moneta.integrator.common.fundsguarantee.RefundDetails.prototype
    .getRefundedAmount = function () {
        return Q(this, Y.moneta.integrator.common.Amount, 1)
    };
Y.moneta.integrator.common.fundsguarantee.RefundDetails.prototype
    .setRefundedAmount = function (a) {
        S(this, 1, a)
    };
Y.moneta.integrator.common.fundsguarantee.RefundDetails.deserialize = function (
    a) {
    return X(Y.moneta.integrator.common.fundsguarantee.RefundDetails, a)
};
Y.moneta.integrator.common.fundsguarantee.SystemBlockedDetails = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.fundsguarantee.SystemBlockedDetails, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .SystemBlockedDetails.prototype.toObject = function (a) {
        return Y.moneta.integrator.common.fundsguarantee
            .SystemBlockedDetails.toObject(a, this)
    }, Y.moneta.integrator.common.fundsguarantee.SystemBlockedDetails
    .toObject = function (a, b) {
        var c, f = {
            actionType: null == (c = O(b, 1)) ? void 0 : c,
            blockedAmount: (c = Q(b, Y.moneta.integrator.common.Amount,
                2)) && Y.moneta.integrator.common.Amount.toObject(a,
                c),
            blockedReason: null == (c = O(b, 3)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance =
            b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .SystemBlockedDetails.ObjectFormat = function () {}, Y.moneta.integrator
    .common.fundsguarantee.SystemBlockedDetails.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.fundsguarantee
            .SystemBlockedDetails;
        null != a.actionType && P(b, 1, a.actionType);
        a.blockedAmount && S(b, 2, Y.moneta.integrator.common.Amount
            .fromObject(a.blockedAmount));
        null != a.blockedReason && P(b, 3, a.blockedReason);
        return b
    });
Y.moneta.integrator.common.fundsguarantee.SystemBlockedDetails
    .deserializeBinary = function (a) {
        return Y.moneta.integrator.common.fundsguarantee.SystemBlockedDetails
            .deserializeBinaryFromReader(new Y.moneta.integrator.common
                .fundsguarantee.SystemBlockedDetails, new C(a))
    };
Y.moneta.integrator.common.fundsguarantee.SystemBlockedDetails
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readEnum();
                P(a, 1, c);
                break;
            case 2:
                c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c, Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                S(a, 2, c);
                break;
            case 3:
                c = b.readEnum();
                P(a, 3, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.fundsguarantee.SystemBlockedDetails
    .serializeBinaryToWriter = function (a, b) {
        var c = O(a, 1);
        null != c && b.writeEnum(1, c);
        c = Q(a, Y.moneta.integrator.common.Amount, 2);
        null != c && J(b, 2, c, Y.moneta.integrator.common.Amount
            .serializeBinaryToWriter);
        c = O(a, 3);
        null != c && b.writeEnum(3, c)
    };
Y.moneta.integrator.common.fundsguarantee.SystemBlockedDetails
    .SystemActionType = {
        SYSTEM_ACTION_TYPE_UNKNOWN: 0,
        SYSTEM_ACTION_TYPE_CHARGE: 1,
        SYSTEM_ACTION_TYPE_DISBURSE: 2,
        SYSTEM_ACTION_TYPE_REFUND: 3
    };
Y.moneta.integrator.common.fundsguarantee.SystemBlockedDetails
    .SystemActionBlockedReason = {
        SYSTEM_ACTION_BLOCKED_REASON_UNKNOWN: 0,
        SYSTEM_ACTION_BLOCKED_REASON_PAYMENTS_INTERNAL_ERROR: 1,
        SYSTEM_ACTION_BLOCKED_REASON_NO_VALID_INSTRUMENT: 2,
        SYSTEM_ACTION_BLOCKED_REASON_PAYMENT_NOT_REFUNDABLE: 3,
        SYSTEM_ACTION_BLOCKED_REASON_NO_PAYMENT_TO_REFUND: 4,
        SYSTEM_ACTION_BLOCKED_REASON_CONTROL_POINT_DENIED: 5,
        SYSTEM_ACTION_BLOCKED_REASON_PAYMENT_FAILURE: 6
    };
Y.moneta.integrator.common.fundsguarantee.SystemBlockedDetails.deserialize =
    function (a) {
        return X(Y.moneta.integrator.common.fundsguarantee.SystemBlockedDetails,
            a)
    };
Y.moneta.integrator.common.TillId = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.TillId, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.TillId.prototype.toObject =
    function (a) {
        return Y.moneta.integrator.common.TillId.toObject(a, this)
    }, Y.moneta.integrator.common.TillId.toObject = function (a, b) {
        var c, f = {
            physicalStoreId: null == (c = O(b, 1)) ? void 0 : c,
            tillNumber: null == (c = O(b, 2)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.TillId.ObjectFormat =
    function () {}, Y.moneta.integrator.common.TillId.fromObject =
    function (a) {
        var b = new Y.moneta.integrator.common.TillId;
        null != a.physicalStoreId && P(b, 1, a.physicalStoreId);
        null != a.tillNumber && P(b, 2, a.tillNumber);
        return b
    });
Y.moneta.integrator.common.TillId.deserializeBinary = function (a) {
    return Y.moneta.integrator.common.TillId.deserializeBinaryFromReader(
        new Y.moneta.integrator.common.TillId, new C(a))
};
Y.moneta.integrator.common.TillId.deserializeBinaryFromReader = function (a,
b) {
    for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
        case 1:
            var c = b.readString();
            P(a, 1, c);
            break;
        case 2:
            c = b.readString();
            P(a, 2, c);
            break;
        default:
            G(b)
    }
    return a
};
Y.moneta.integrator.common.TillId.serializeBinaryToWriter = function (a, b) {
    var c = O(a, 1);
    null != c && b.writeString(1, c);
    c = O(a, 2);
    null != c && b.writeString(2, c)
};
Y.moneta.integrator.common.TillId.deserialize = function (a) {
    return X(Y.moneta.integrator.common.TillId, a)
};
Y.moneta.integrator.common.fundsguarantee.CashPurchaseDetails = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.fundsguarantee.CashPurchaseDetails, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .CashPurchaseDetails.prototype.toObject = function (a) {
        return Y.moneta.integrator.common.fundsguarantee.CashPurchaseDetails
            .toObject(a, this)
    }, Y.moneta.integrator.common.fundsguarantee.CashPurchaseDetails
    .toObject = function (a, b) {
        var c, f = {
            paymentSystem: null == (c = O(b, 1)) ? void 0 : c,
            tillId: (c = Q(b, Y.moneta.integrator.common.TillId, 2)) &&
                Y.moneta.integrator.common.TillId.toObject(a, c),
            externalTransactionId: null == (c = O(b, 3)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance =
            b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .CashPurchaseDetails.ObjectFormat = function () {}, Y.moneta.integrator
    .common.fundsguarantee.CashPurchaseDetails.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.fundsguarantee
            .CashPurchaseDetails;
        null != a.paymentSystem && P(b, 1, a.paymentSystem);
        a.tillId && S(b, 2, Y.moneta.integrator.common.TillId.fromObject(a
            .tillId));
        null != a.externalTransactionId && P(b, 3, a.externalTransactionId);
        return b
    });
Y.moneta.integrator.common.fundsguarantee.CashPurchaseDetails
    .deserializeBinary = function (a) {
        return Y.moneta.integrator.common.fundsguarantee.CashPurchaseDetails
            .deserializeBinaryFromReader(new Y.moneta.integrator.common
                .fundsguarantee.CashPurchaseDetails, new C(a))
    };
Y.moneta.integrator.common.fundsguarantee.CashPurchaseDetails
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readEnum();
                P(a, 1, c);
                break;
            case 2:
                c = new Y.moneta.integrator.common.TillId;
                b.readMessage(c, Y.moneta.integrator.common.TillId
                    .deserializeBinaryFromReader);
                S(a, 2, c);
                break;
            case 3:
                c = b.readString();
                P(a, 3, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.fundsguarantee.CashPurchaseDetails
    .serializeBinaryToWriter = function (a, b) {
        var c = O(a, 1);
        null != c && b.writeEnum(1, c);
        c = Q(a, Y.moneta.integrator.common.TillId, 2);
        null != c && J(b, 2, c, Y.moneta.integrator.common.TillId
            .serializeBinaryToWriter);
        c = O(a, 3);
        null != c && b.writeString(3, c)
    };
Y.moneta.integrator.common.fundsguarantee.CashPurchaseDetails.PaymentSystem = {
    PAYMENT_SYSTEM_UNKNOWN: 0,
    PAYMENT_SYSTEM_CLOVER: 1
};
Y.moneta.integrator.common.fundsguarantee.CashPurchaseDetails.deserialize =
    function (a) {
        return X(Y.moneta.integrator.common.fundsguarantee.CashPurchaseDetails,
            a)
    };
Y.moneta.integrator.common.instrument = {};
Y.moneta.integrator.common.instrument.InstrumentDescription = function (a) {
    M(this, a, -1, Y.moneta.integrator.common.instrument
        .InstrumentDescription.repeatedFields_, null)
};
k.inherits(Y.moneta.integrator.common.instrument.InstrumentDescription, L);
Y.moneta.integrator.common.instrument.InstrumentDescription
    .InstrumentLegalDisclaimer = function (a) {
        M(this, a, -1, null, null)
    };
k.inherits(Y.moneta.integrator.common.instrument.InstrumentDescription
    .InstrumentLegalDisclaimer, L);
Y.moneta.integrator.common.instrument.InstrumentDescription.BalanceInfo =
    function (a) {
        M(this, a, -1, Y.moneta.integrator.common.instrument
            .InstrumentDescription.BalanceInfo.repeatedFields_, null)
    };
k.inherits(Y.moneta.integrator.common.instrument.InstrumentDescription
    .BalanceInfo, L);
Y.moneta.integrator.common.instrument.InstrumentDescription.PromotionalBalance =
    function (a) {
        M(this, a, -1, null, null)
    };
k.inherits(Y.moneta.integrator.common.instrument.InstrumentDescription
    .PromotionalBalance, L);
Y.moneta.integrator.common.instrument.InstrumentDescription.repeatedFields_ = [
    8];
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.instrument
    .InstrumentDescription.prototype.toObject = function (a) {
        return Y.moneta.integrator.common.instrument.InstrumentDescription
            .toObject(a, this)
    }, Y.moneta.integrator.common.instrument.InstrumentDescription
    .toObject = function (a, b) {
        var c, f = {
            instrumentType: null == (c = O(b, 1)) ? void 0 : c,
            instrumentDescription: null == (c = O(b, 2)) ? void 0 : c,
            instrumentName: null == (c = O(b, 10)) ? void 0 : c,
            canonicalInstrumentDescription: null == (c = O(b, 6)) ?
                void 0 : c,
            instrumentSubDescription: null ==
                (c = O(b, 7)) ? void 0 : c,
            instrumentLegalDisclaimerList: N(R(b, Y.moneta.integrator
                    .common.instrument.InstrumentDescription
                    .InstrumentLegalDisclaimer, 8), Y.moneta
                .integrator.common.instrument.InstrumentDescription
                .InstrumentLegalDisclaimer.toObject, a),
            logoUri: null == (c = O(b, 3)) ? void 0 : c,
            backgroundUri: null == (c = O(b, 4)) ? void 0 : c,
            balanceInfo: (c = Q(b, Y.moneta.integrator.common.instrument
                    .InstrumentDescription.BalanceInfo, 5)) && Y.moneta
                .integrator.common.instrument.InstrumentDescription
                .BalanceInfo.toObject(a, c),
            accessibilityLabel: null ==
                (c = O(b, 9)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.instrument
    .InstrumentDescription.ObjectFormat = function () {}, Y.moneta
    .integrator.common.instrument.InstrumentDescription.fromObject =
    function (a) {
        var b = new Y.moneta.integrator.common.instrument
            .InstrumentDescription;
        null != a.instrumentType && P(b, 1, a.instrumentType);
        null != a.instrumentDescription && P(b, 2, a.instrumentDescription);
        null != a.instrumentName && P(b, 10, a.instrumentName);
        null != a.canonicalInstrumentDescription && P(b, 6, a
            .canonicalInstrumentDescription);
        null != a.instrumentSubDescription && P(b, 7, a
            .instrumentSubDescription);
        a.instrumentLegalDisclaimerList && V(b, 8, a
            .instrumentLegalDisclaimerList.map(Y.moneta.integrator
                .common.instrument.InstrumentDescription
                .InstrumentLegalDisclaimer.fromObject));
        null != a.logoUri && P(b, 3, a.logoUri);
        null != a.backgroundUri && P(b, 4, a.backgroundUri);
        a.balanceInfo && S(b, 5, Y.moneta.integrator.common.instrument
            .InstrumentDescription.BalanceInfo.fromObject(a.balanceInfo)
            );
        null != a.accessibilityLabel && P(b, 9, a.accessibilityLabel);
        return b
    });
Y.moneta.integrator.common.instrument.InstrumentDescription.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.common.instrument.InstrumentDescription
            .deserializeBinaryFromReader(new Y.moneta.integrator.common
                .instrument.InstrumentDescription, new C(a))
    };
Y.moneta.integrator.common.instrument.InstrumentDescription
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readEnum();
                P(a, 1, c);
                break;
            case 2:
                c = b.readString();
                a.setInstrumentDescription(c);
                break;
            case 10:
                c = b.readString();
                P(a, 10, c);
                break;
            case 6:
                c = b.readString();
                P(a, 6, c);
                break;
            case 7:
                c = b.readString();
                P(a, 7, c);
                break;
            case 8:
                c = new Y.moneta.integrator.common.instrument
                    .InstrumentDescription.InstrumentLegalDisclaimer;
                b.readMessage(c, Y.moneta.integrator.common.instrument
                    .InstrumentDescription.InstrumentLegalDisclaimer
                    .deserializeBinaryFromReader);
                W(a, 8, c, Y.moneta.integrator.common.instrument
                    .InstrumentDescription.InstrumentLegalDisclaimer);
                break;
            case 3:
                c = b.readString();
                P(a, 3, c);
                break;
            case 4:
                c = b.readString();
                P(a, 4, c);
                break;
            case 5:
                c = new Y.moneta.integrator.common.instrument
                    .InstrumentDescription.BalanceInfo;
                b.readMessage(c, Y.moneta.integrator.common.instrument
                    .InstrumentDescription.BalanceInfo
                    .deserializeBinaryFromReader);
                S(a, 5, c);
                break;
            case 9:
                c = b.readString();
                P(a, 9, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.instrument.InstrumentDescription
    .serializeBinaryToWriter = function (a, b) {
        var c = O(a, 1);
        null != c && b.writeEnum(1, c);
        c = O(a, 2);
        null != c && b.writeString(2, c);
        c = O(a, 10);
        null != c && b.writeString(10, c);
        c = O(a, 6);
        null != c && b.writeString(6, c);
        c = O(a, 7);
        null != c && b.writeString(7, c);
        c = R(a, Y.moneta.integrator.common.instrument.InstrumentDescription
            .InstrumentLegalDisclaimer, 8);
        0 < c.length && K(b, 8, c, Y.moneta.integrator.common.instrument
            .InstrumentDescription.InstrumentLegalDisclaimer
            .serializeBinaryToWriter);
        c = O(a, 3);
        null != c && b.writeString(3, c);
        c = O(a, 4);
        null != c && b.writeString(4, c);
        c = Q(a, Y.moneta.integrator.common.instrument.InstrumentDescription
            .BalanceInfo, 5);
        null != c && J(b, 5, c, Y.moneta.integrator.common.instrument
            .InstrumentDescription.BalanceInfo.serializeBinaryToWriter);
        c = O(a, 9);
        null != c && b.writeString(9, c)
    };
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.instrument
    .InstrumentDescription.InstrumentLegalDisclaimer.prototype.toObject =
    function (a) {
        return Y.moneta.integrator.common.instrument.InstrumentDescription
            .InstrumentLegalDisclaimer.toObject(a, this)
    }, Y.moneta.integrator.common.instrument.InstrumentDescription
    .InstrumentLegalDisclaimer.toObject = function (a, b) {
        var c, f = {
            legalMessage: null == (c = O(b, 1)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.instrument
    .InstrumentDescription.InstrumentLegalDisclaimer.ObjectFormat =
    function () {}, Y.moneta.integrator.common.instrument
    .InstrumentDescription.InstrumentLegalDisclaimer.fromObject = function (
        a) {
        var b = new Y.moneta.integrator.common.instrument
            .InstrumentDescription.InstrumentLegalDisclaimer;
        null != a.legalMessage && P(b, 1, a.legalMessage);
        return b
    });
Y.moneta.integrator.common.instrument.InstrumentDescription
    .InstrumentLegalDisclaimer.deserializeBinary = function (a) {
        return Y.moneta.integrator.common.instrument.InstrumentDescription
            .InstrumentLegalDisclaimer.deserializeBinaryFromReader(new Y.moneta
                .integrator.common.instrument.InstrumentDescription
                .InstrumentLegalDisclaimer, new C(a))
    };
Y.moneta.integrator.common.instrument.InstrumentDescription
    .InstrumentLegalDisclaimer.deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readString();
                P(a, 1, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.instrument.InstrumentDescription
    .InstrumentLegalDisclaimer.serializeBinaryToWriter = function (a, b) {
        a = O(a, 1);
        null != a && b.writeString(1, a)
    };
Y.moneta.integrator.common.instrument.InstrumentDescription
    .InstrumentLegalDisclaimer.deserialize = function (a) {
        return X(Y.moneta.integrator.common.instrument.InstrumentDescription
            .InstrumentLegalDisclaimer, a)
    };
Y.moneta.integrator.common.instrument.InstrumentDescription.BalanceInfo
    .repeatedFields_ = [4];
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.instrument
    .InstrumentDescription.BalanceInfo.prototype.toObject = function (a) {
        return Y.moneta.integrator.common.instrument.InstrumentDescription
            .BalanceInfo.toObject(a, this)
    }, Y.moneta.integrator.common.instrument.InstrumentDescription
    .BalanceInfo.toObject = function (a, b) {
        var c, f = {
            availableAmount: (c = Kc(b)) && Y.moneta.integrator.common
                .Amount.toObject(a, c),
            promotionalAmount: (c = Q(b, Y.moneta.integrator.common
                    .Amount, 2)) && Y.moneta.integrator.common.Amount
                .toObject(a,
                    c),
            promotionalExpirationMillis: null == (c = O(b, 3)) ?
                void 0 : c,
            promotionalBalancesList: N(R(b, Y.moneta.integrator.common
                    .instrument.InstrumentDescription
                    .PromotionalBalance, 4), Y.moneta.integrator
                .common.instrument.InstrumentDescription
                .PromotionalBalance.toObject, a)
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.instrument
    .InstrumentDescription.BalanceInfo.ObjectFormat = function () {}, Y
    .moneta.integrator.common.instrument.InstrumentDescription.BalanceInfo
    .fromObject = function (a) {
        var b = new Y.moneta.integrator.common.instrument
            .InstrumentDescription.BalanceInfo;
        a.availableAmount && S(b, 1, Y.moneta.integrator.common.Amount
            .fromObject(a.availableAmount));
        a.promotionalAmount && S(b, 2, Y.moneta.integrator.common.Amount
            .fromObject(a.promotionalAmount));
        null != a.promotionalExpirationMillis &&
            P(b, 3, a.promotionalExpirationMillis);
        a.promotionalBalancesList && V(b, 4, a.promotionalBalancesList.map(Y
            .moneta.integrator.common.instrument
            .InstrumentDescription.PromotionalBalance.fromObject));
        return b
    });
Y.moneta.integrator.common.instrument.InstrumentDescription.BalanceInfo
    .deserializeBinary = function (a) {
        return Y.moneta.integrator.common.instrument.InstrumentDescription
            .BalanceInfo.deserializeBinaryFromReader(new Y.moneta.integrator
                .common.instrument.InstrumentDescription.BalanceInfo, new C(a))
    };
Y.moneta.integrator.common.instrument.InstrumentDescription.BalanceInfo
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c, Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                a.setAvailableAmount(c);
                break;
            case 2:
                c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c, Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                S(a, 2, c);
                break;
            case 3:
                c = b.readInt64();
                P(a, 3, c);
                break;
            case 4:
                c =
                    new Y.moneta.integrator.common.instrument
                    .InstrumentDescription.PromotionalBalance;
                b.readMessage(c, Y.moneta.integrator.common.instrument
                    .InstrumentDescription.PromotionalBalance
                    .deserializeBinaryFromReader);
                W(a, 4, c, Y.moneta.integrator.common.instrument
                    .InstrumentDescription.PromotionalBalance);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.instrument.InstrumentDescription.BalanceInfo
    .serializeBinaryToWriter = function (a, b) {
        var c = Kc(a);
        null != c && J(b, 1, c, Y.moneta.integrator.common.Amount
            .serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.common.Amount, 2);
        null != c && J(b, 2, c, Y.moneta.integrator.common.Amount
            .serializeBinaryToWriter);
        c = O(a, 3);
        null != c && b.writeInt64(3, c);
        c = R(a, Y.moneta.integrator.common.instrument.InstrumentDescription
            .PromotionalBalance, 4);
        0 < c.length && K(b, 4, c, Y.moneta.integrator.common.instrument
            .InstrumentDescription.PromotionalBalance
            .serializeBinaryToWriter)
    };
var Kc = function (a) {
    return Q(a, Y.moneta.integrator.common.Amount, 1)
};
Y.moneta.integrator.common.instrument.InstrumentDescription.BalanceInfo
    .prototype.setAvailableAmount = function (a) {
        S(this, 1, a)
    };
Y.moneta.integrator.common.instrument.InstrumentDescription.BalanceInfo
    .deserialize = function (a) {
        return X(Y.moneta.integrator.common.instrument.InstrumentDescription
            .BalanceInfo, a)
    };
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.instrument
    .InstrumentDescription.PromotionalBalance.prototype.toObject =
    function (a) {
        return Y.moneta.integrator.common.instrument.InstrumentDescription
            .PromotionalBalance.toObject(a, this)
    }, Y.moneta.integrator.common.instrument.InstrumentDescription
    .PromotionalBalance.toObject = function (a, b) {
        var c, f = {
            availableAmount: (c = Kc(b)) && Y.moneta.integrator.common
                .Amount.toObject(a, c),
            expirationMillis: null == (c = O(b, 3)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.instrument
    .InstrumentDescription.PromotionalBalance.ObjectFormat = function () {},
    Y.moneta.integrator.common.instrument.InstrumentDescription
    .PromotionalBalance.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.instrument
            .InstrumentDescription.PromotionalBalance;
        a.availableAmount && S(b, 1, Y.moneta.integrator.common.Amount
            .fromObject(a.availableAmount));
        null != a.expirationMillis && P(b, 3, a.expirationMillis);
        return b
    });
Y.moneta.integrator.common.instrument.InstrumentDescription.PromotionalBalance
    .deserializeBinary = function (a) {
        return Y.moneta.integrator.common.instrument.InstrumentDescription
            .PromotionalBalance.deserializeBinaryFromReader(new Y.moneta
                .integrator.common.instrument.InstrumentDescription
                .PromotionalBalance, new C(a))
    };
Y.moneta.integrator.common.instrument.InstrumentDescription.PromotionalBalance
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c, Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                a.setAvailableAmount(c);
                break;
            case 3:
                c = b.readInt64();
                P(a, 3, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.instrument.InstrumentDescription.PromotionalBalance
    .serializeBinaryToWriter = function (a, b) {
        var c = Kc(a);
        null != c && J(b, 1, c, Y.moneta.integrator.common.Amount
            .serializeBinaryToWriter);
        c = O(a, 3);
        null != c && b.writeInt64(3, c)
    };
Y.moneta.integrator.common.instrument.InstrumentDescription.PromotionalBalance
    .prototype.setAvailableAmount = function (a) {
        S(this, 1, a)
    };
Y.moneta.integrator.common.instrument.InstrumentDescription.PromotionalBalance
    .deserialize = function (a) {
        return X(Y.moneta.integrator.common.instrument.InstrumentDescription
            .PromotionalBalance, a)
    };
Y.moneta.integrator.common.instrument.InstrumentDescription.prototype
    .getInstrumentDescription = function () {
        return O(this, 2)
    };
Y.moneta.integrator.common.instrument.InstrumentDescription.prototype
    .setInstrumentDescription = function (a) {
        P(this, 2, a)
    };
Y.moneta.integrator.common.instrument.InstrumentDescription.deserialize =
    function (a) {
        return X(Y.moneta.integrator.common.instrument.InstrumentDescription, a)
    };
Y.moneta.integrator.common.fundsguarantee.InstallmentDetailsPb = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.fundsguarantee.InstallmentDetailsPb, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .InstallmentDetailsPb.prototype.toObject = function (a) {
        return Y.moneta.integrator.common.fundsguarantee
            .InstallmentDetailsPb.toObject(a, this)
    }, Y.moneta.integrator.common.fundsguarantee.InstallmentDetailsPb
    .toObject = function (a, b) {
        var c, f = {
            initialBackingInstrumentId: null == (c = O(b, 1)) ? void 0 :
                c,
            initialBackingInstrumentDescription: (c = Q(b, Y.moneta
                    .integrator.common.instrument
                    .InstrumentDescription, 2)) && Y.moneta.integrator
                .common.instrument.InstrumentDescription.toObject(a,
                    c)
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .InstallmentDetailsPb.ObjectFormat = function () {}, Y.moneta.integrator
    .common.fundsguarantee.InstallmentDetailsPb.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.fundsguarantee
            .InstallmentDetailsPb;
        null != a.initialBackingInstrumentId && P(b, 1, a
            .initialBackingInstrumentId);
        a.initialBackingInstrumentDescription && S(b, 2, Y.moneta.integrator
            .common.instrument.InstrumentDescription.fromObject(a
                .initialBackingInstrumentDescription));
        return b
    });
Y.moneta.integrator.common.fundsguarantee.InstallmentDetailsPb
    .deserializeBinary = function (a) {
        return Y.moneta.integrator.common.fundsguarantee.InstallmentDetailsPb
            .deserializeBinaryFromReader(new Y.moneta.integrator.common
                .fundsguarantee.InstallmentDetailsPb, new C(a))
    };
Y.moneta.integrator.common.fundsguarantee.InstallmentDetailsPb
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readInt64();
                P(a, 1, c);
                break;
            case 2:
                c = new Y.moneta.integrator.common.instrument
                    .InstrumentDescription;
                b.readMessage(c, Y.moneta.integrator.common.instrument
                    .InstrumentDescription.deserializeBinaryFromReader);
                S(a, 2, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.fundsguarantee.InstallmentDetailsPb
    .serializeBinaryToWriter = function (a, b) {
        var c = O(a, 1);
        null != c && b.writeInt64(1, c);
        c = Q(a, Y.moneta.integrator.common.instrument.InstrumentDescription,
        2);
        null != c && J(b, 2, c, Y.moneta.integrator.common.instrument
            .InstrumentDescription.serializeBinaryToWriter)
    };
Y.moneta.integrator.common.fundsguarantee.InstallmentDetailsPb.deserialize =
    function (a) {
        return X(Y.moneta.integrator.common.fundsguarantee.InstallmentDetailsPb,
            a)
    };
Y.moneta.integrator.common.fundsguarantee.FundsGuaranteePaymentDetails =
    function (a) {
        M(this, a, -1, null, Y.moneta.integrator.common.fundsguarantee
            .FundsGuaranteePaymentDetails.oneofGroups_)
    };
k.inherits(Y.moneta.integrator.common.fundsguarantee
    .FundsGuaranteePaymentDetails, L);
Y.moneta.integrator.common.fundsguarantee.FundsGuaranteePaymentDetails
    .oneofGroups_ = [
        [9, 10]
    ];
Y.moneta.integrator.common.fundsguarantee.FundsGuaranteePaymentDetails
    .AdditionalDetailsCase = {
        ADDITIONAL_DETAILS_NOT_SET: 0,
        CASH_PURCHASE_DETAILS: 9,
        INSTALLMENT_DETAILS: 10
    };
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .FundsGuaranteePaymentDetails.prototype.toObject = function (a) {
        return Y.moneta.integrator.common.fundsguarantee
            .FundsGuaranteePaymentDetails.toObject(a, this)
    }, Y.moneta.integrator.common.fundsguarantee
    .FundsGuaranteePaymentDetails.toObject = function (a, b) {
        var c, f = {
            instrumentId: null == (c = O(b, 4)) ? void 0 : c,
            amount: (c = b.getAmount()) && Y.moneta.integrator.common
                .Amount.toObject(a, c),
            refundedAmount: (c = b.getRefundedAmount()) && Y.moneta
                .integrator.common.Amount.toObject(a,
                    c),
            chargedAmount: (c = b.getChargedAmount()) && Y.moneta
                .integrator.common.Amount.toObject(a, c),
            instrumentDescription: (c = b.getInstrumentDescription()) &&
                Y.moneta.integrator.common.instrument
                .InstrumentDescription.toObject(a, c),
            instrumentRank: null == (c = O(b, 7)) ? void 0 : c,
            carrierRevshareId: null == (c = O(b, 3)) ? void 0 : c,
            refundCapability: null == (c = O(b, 8)) ? void 0 : c,
            cashPurchaseDetails: (c = Q(b, Y.moneta.integrator.common
                    .fundsguarantee.CashPurchaseDetails, 9)) && Y.moneta
                .integrator.common.fundsguarantee.CashPurchaseDetails
                .toObject(a,
                    c),
            installmentDetails: (c = Q(b, Y.moneta.integrator.common
                    .fundsguarantee.InstallmentDetailsPb, 10)) && Y
                .moneta.integrator.common.fundsguarantee
                .InstallmentDetailsPb.toObject(a, c)
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .FundsGuaranteePaymentDetails.ObjectFormat = function () {}, Y.moneta
    .integrator.common.fundsguarantee.FundsGuaranteePaymentDetails
    .fromObject = function (a) {
        var b = new Y.moneta.integrator.common.fundsguarantee
            .FundsGuaranteePaymentDetails;
        null != a.instrumentId && P(b, 4, a.instrumentId);
        a.amount && S(b, 1, Y.moneta.integrator.common.Amount.fromObject(a
            .amount));
        a.refundedAmount && S(b, 5, Y.moneta.integrator.common.Amount
            .fromObject(a.refundedAmount));
        a.chargedAmount && S(b, 6, Y.moneta.integrator.common.Amount
            .fromObject(a.chargedAmount));
        a.instrumentDescription && S(b, 2, Y.moneta.integrator.common
            .instrument.InstrumentDescription.fromObject(a
                .instrumentDescription));
        null != a.instrumentRank && P(b, 7, a.instrumentRank);
        null != a.carrierRevshareId && P(b, 3, a.carrierRevshareId);
        null != a.refundCapability && P(b, 8, a.refundCapability);
        a.cashPurchaseDetails && S(b, 9, Y.moneta.integrator.common
            .fundsguarantee.CashPurchaseDetails.fromObject(a
                .cashPurchaseDetails));
        a.installmentDetails &&
            S(b, 10, Y.moneta.integrator.common.fundsguarantee
                .InstallmentDetailsPb.fromObject(a.installmentDetails));
        return b
    });
Y.moneta.integrator.common.fundsguarantee.FundsGuaranteePaymentDetails
    .deserializeBinary = function (a) {
        return Y.moneta.integrator.common.fundsguarantee
            .FundsGuaranteePaymentDetails.deserializeBinaryFromReader(new Y
                .moneta.integrator.common.fundsguarantee
                .FundsGuaranteePaymentDetails, new C(a))
    };
Y.moneta.integrator.common.fundsguarantee.FundsGuaranteePaymentDetails
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 4:
                var c = b.readInt64();
                P(a, 4, c);
                break;
            case 1:
                c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c, Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                a.setAmount(c);
                break;
            case 5:
                c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c, Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                a.setRefundedAmount(c);
                break;
            case 6:
                c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c, Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                a.setChargedAmount(c);
                break;
            case 2:
                c = new Y.moneta.integrator.common.instrument
                    .InstrumentDescription;
                b.readMessage(c, Y.moneta.integrator.common.instrument
                    .InstrumentDescription.deserializeBinaryFromReader);
                a.setInstrumentDescription(c);
                break;
            case 7:
                c = b.readEnum();
                P(a, 7, c);
                break;
            case 3:
                c = b.readString();
                P(a, 3, c);
                break;
            case 8:
                c = b.readEnum();
                P(a, 8, c);
                break;
            case 9:
                c = new Y.moneta.integrator.common.fundsguarantee
                    .CashPurchaseDetails;
                b.readMessage(c, Y.moneta.integrator.common.fundsguarantee
                    .CashPurchaseDetails.deserializeBinaryFromReader);
                U(a, 9, Y.moneta.integrator.common.fundsguarantee
                    .FundsGuaranteePaymentDetails.oneofGroups_[0], c);
                break;
            case 10:
                c = new Y.moneta.integrator.common.fundsguarantee
                    .InstallmentDetailsPb;
                b.readMessage(c, Y.moneta.integrator.common.fundsguarantee
                    .InstallmentDetailsPb.deserializeBinaryFromReader);
                U(a, 10, Y.moneta.integrator.common.fundsguarantee
                    .FundsGuaranteePaymentDetails.oneofGroups_[0], c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.fundsguarantee.FundsGuaranteePaymentDetails
    .serializeBinaryToWriter = function (a, b) {
        var c = O(a, 4);
        null != c && b.writeInt64(4, c);
        c = a.getAmount();
        null != c && J(b, 1, c, Y.moneta.integrator.common.Amount
            .serializeBinaryToWriter);
        c = a.getRefundedAmount();
        null != c && J(b, 5, c, Y.moneta.integrator.common.Amount
            .serializeBinaryToWriter);
        c = a.getChargedAmount();
        null != c && J(b, 6, c, Y.moneta.integrator.common.Amount
            .serializeBinaryToWriter);
        c = a.getInstrumentDescription();
        null != c && J(b, 2, c, Y.moneta.integrator.common.instrument
            .InstrumentDescription.serializeBinaryToWriter);
        c = O(a, 7);
        null != c && b.writeEnum(7, c);
        c = O(a, 3);
        null != c && b.writeString(3, c);
        c = O(a, 8);
        null != c && b.writeEnum(8, c);
        c = Q(a, Y.moneta.integrator.common.fundsguarantee.CashPurchaseDetails,
            9);
        null != c && J(b, 9, c, Y.moneta.integrator.common.fundsguarantee
            .CashPurchaseDetails.serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.common.fundsguarantee.InstallmentDetailsPb,
            10);
        null != c && J(b, 10, c, Y.moneta.integrator.common.fundsguarantee
            .InstallmentDetailsPb.serializeBinaryToWriter)
    };
Y.moneta.integrator.common.fundsguarantee.FundsGuaranteePaymentDetails
    .RefundCapability = {
        REFUND_CAPABILITY_UNKNOWN: 0,
        REFUND_CAPABILITY_FULL_REFUND_ONLY: 1,
        REFUND_CAPABILITY_SINGLE_PARTIAL_REFUND: 2,
        REFUND_CAPABILITY_MULTIPLE_PARTIAL_REFUND: 3,
        REFUND_CAPABILITY_NONE: 4
    };
d = Y.moneta.integrator.common.fundsguarantee.FundsGuaranteePaymentDetails
    .prototype;
d.getAmount = function () {
    return Q(this, Y.moneta.integrator.common.Amount, 1)
};
d.setAmount = function (a) {
    S(this, 1, a)
};
d.getRefundedAmount = function () {
    return Q(this, Y.moneta.integrator.common.Amount, 5)
};
d.setRefundedAmount = function (a) {
    S(this, 5, a)
};
d.getChargedAmount = function () {
    return Q(this, Y.moneta.integrator.common.Amount, 6)
};
d.setChargedAmount = function (a) {
    S(this, 6, a)
};
d.getInstrumentDescription = function () {
    return Q(this, Y.moneta.integrator.common.instrument
        .InstrumentDescription, 2)
};
d.setInstrumentDescription = function (a) {
    S(this, 2, a)
};
Y.moneta.integrator.common.fundsguarantee.FundsGuaranteePaymentDetails
    .deserialize = function (a) {
        return X(Y.moneta.integrator.common.fundsguarantee
            .FundsGuaranteePaymentDetails, a)
    };
Y.moneta.integrator.common.fundsguarantee.FundsGuarantee = function (a) {
    M(this, a, -1, Y.moneta.integrator.common.fundsguarantee.FundsGuarantee
        .repeatedFields_, null)
};
k.inherits(Y.moneta.integrator.common.fundsguarantee.FundsGuarantee, L);
Y.moneta.integrator.common.fundsguarantee.FundsGuarantee.repeatedFields_ = [7,
    5];
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .FundsGuarantee.prototype.toObject = function (a) {
        return Y.moneta.integrator.common.fundsguarantee.FundsGuarantee
            .toObject(a, this)
    }, Y.moneta.integrator.common.fundsguarantee.FundsGuarantee.toObject =
    function (a, b) {
        var c, f = {
            fundsGuaranteeId: (c = b.getFundsGuaranteeId()) && Y.moneta
                .integrator.common.FundsGuaranteeId.toObject(a, c),
            status: null == (c = O(b, 2)) ? void 0 : c,
            amount: (c = b.getAmount()) && Y.moneta.integrator.common
                .Amount.toObject(a, c),
            chargedAmount: (c =
                    b.getChargedAmount()) && Y.moneta.integrator.common
                .Amount.toObject(a, c),
            refundedAmount: (c = b.getRefundedAmount()) && Y.moneta
                .integrator.common.Amount.toObject(a, c),
            chargebackAmount: (c = b.getChargebackAmount()) && Y.moneta
                .integrator.common.Amount.toObject(a, c),
            disbursedAmount: (c = b.getDisbursedAmount()) && Y.moneta
                .integrator.common.Amount.toObject(a, c),
            paymentDetailsList: N(R(b, Y.moneta.integrator.common
                    .fundsguarantee.FundsGuaranteePaymentDetails, 7
                    ), Y.moneta.integrator.common.fundsguarantee
                .FundsGuaranteePaymentDetails.toObject,
                a),
            creationTimeMillis: null == (c = O(b, 12)) ? void 0 : c,
            expirationTimeMillis: null == (c = O(b, 4)) ? void 0 : c,
            pendingDetailsList: N(R(b, Y.moneta.integrator.common
                    .fundsguarantee.PendingDetails, 5), Y.moneta
                .integrator.common.fundsguarantee.PendingDetails
                .toObject, a),
            declineDetails: (c = b.getDeclineDetails()) && Y.moneta
                .integrator.common.fundsguarantee.DeclineDetails
                .toObject(a, c),
            chargeDetails: (c = Q(b, Y.moneta.integrator.common
                    .fundsguarantee.ChargeDetails, 13)) && Y.moneta
                .integrator.common.fundsguarantee.ChargeDetails
                .toObject(a,
                    c),
            refundDetails: (c = Q(b, Y.moneta.integrator.common
                    .fundsguarantee.RefundDetails, 14)) && Y.moneta
                .integrator.common.fundsguarantee.RefundDetails
                .toObject(a, c),
            disburseDetails: (c = Q(b, Y.moneta.integrator.common
                    .fundsguarantee.DisburseDetails, 15)) && Y.moneta
                .integrator.common.fundsguarantee.DisburseDetails
                .toObject(a, c),
            approvalDetails: (c = Q(b, Y.moneta.integrator.common
                    .fundsguarantee.ApprovalDetails, 16)) && Y.moneta
                .integrator.common.fundsguarantee.ApprovalDetails
                .toObject(a, c),
            systemBlockedDetails: (c = Q(b,
                    Y.moneta.integrator.common.fundsguarantee
                    .SystemBlockedDetails, 17)) && Y.moneta.integrator
                .common.fundsguarantee.SystemBlockedDetails.toObject(a,
                    c),
            chargebackDetails: (c = Q(b, Y.moneta.integrator.common
                    .fundsguarantee.ChargebackDetails, 19)) && Y.moneta
                .integrator.common.fundsguarantee.ChargebackDetails
                .toObject(a, c),
            latestSequenceNumber: null == (c = O(b, 18)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.fundsguarantee
    .FundsGuarantee.ObjectFormat = function () {}, Y.moneta.integrator
    .common.fundsguarantee.FundsGuarantee.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.fundsguarantee
        .FundsGuarantee;
        a.fundsGuaranteeId && S(b, 1, Y.moneta.integrator.common
            .FundsGuaranteeId.fromObject(a.fundsGuaranteeId));
        null != a.status && P(b, 2, a.status);
        a.amount && S(b, 3, Y.moneta.integrator.common.Amount.fromObject(a
            .amount));
        a.chargedAmount && S(b, 8, Y.moneta.integrator.common.Amount
            .fromObject(a.chargedAmount));
        a.refundedAmount && S(b, 9, Y.moneta.integrator.common.Amount
            .fromObject(a.refundedAmount));
        a.chargebackAmount && S(b, 10, Y.moneta.integrator.common.Amount
            .fromObject(a.chargebackAmount));
        a.disbursedAmount && S(b, 11, Y.moneta.integrator.common.Amount
            .fromObject(a.disbursedAmount));
        a.paymentDetailsList && V(b, 7, a.paymentDetailsList.map(Y.moneta
            .integrator.common.fundsguarantee
            .FundsGuaranteePaymentDetails.fromObject));
        null != a.creationTimeMillis && P(b, 12, a.creationTimeMillis);
        null != a.expirationTimeMillis && P(b, 4,
            a.expirationTimeMillis);
        a.pendingDetailsList && V(b, 5, a.pendingDetailsList.map(Y.moneta
            .integrator.common.fundsguarantee.PendingDetails
            .fromObject));
        a.declineDetails && S(b, 6, Y.moneta.integrator.common
            .fundsguarantee.DeclineDetails.fromObject(a.declineDetails));
        a.chargeDetails && S(b, 13, Y.moneta.integrator.common
            .fundsguarantee.ChargeDetails.fromObject(a.chargeDetails));
        a.refundDetails && S(b, 14, Y.moneta.integrator.common
            .fundsguarantee.RefundDetails.fromObject(a.refundDetails));
        a.disburseDetails && S(b, 15,
            Y.moneta.integrator.common.fundsguarantee.DisburseDetails
            .fromObject(a.disburseDetails));
        a.approvalDetails && S(b, 16, Y.moneta.integrator.common
            .fundsguarantee.ApprovalDetails.fromObject(a
                .approvalDetails));
        a.systemBlockedDetails && S(b, 17, Y.moneta.integrator.common
            .fundsguarantee.SystemBlockedDetails.fromObject(a
                .systemBlockedDetails));
        a.chargebackDetails && S(b, 19, Y.moneta.integrator.common
            .fundsguarantee.ChargebackDetails.fromObject(a
                .chargebackDetails));
        null != a.latestSequenceNumber && P(b, 18, a.latestSequenceNumber);
        return b
    });
Y.moneta.integrator.common.fundsguarantee.FundsGuarantee.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.common.fundsguarantee.FundsGuarantee
            .deserializeBinaryFromReader(new Y.moneta.integrator.common
                .fundsguarantee.FundsGuarantee, new C(a))
    };
Y.moneta.integrator.common.fundsguarantee.FundsGuarantee
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = new Y.moneta.integrator.common.FundsGuaranteeId;
                b.readMessage(c, Y.moneta.integrator.common.FundsGuaranteeId
                    .deserializeBinaryFromReader);
                a.setFundsGuaranteeId(c);
                break;
            case 2:
                c = b.readEnum();
                a.setStatus(c);
                break;
            case 3:
                c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c, Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                a.setAmount(c);
                break;
            case 8:
                c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c, Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                a.setChargedAmount(c);
                break;
            case 9:
                c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c, Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                a.setRefundedAmount(c);
                break;
            case 10:
                c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c, Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                a.setChargebackAmount(c);
                break;
            case 11:
                c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c, Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                a.setDisbursedAmount(c);
                break;
            case 7:
                c = new Y.moneta.integrator.common.fundsguarantee
                    .FundsGuaranteePaymentDetails;
                b.readMessage(c, Y.moneta.integrator.common.fundsguarantee
                    .FundsGuaranteePaymentDetails
                    .deserializeBinaryFromReader);
                W(a, 7, c, Y.moneta.integrator.common.fundsguarantee
                    .FundsGuaranteePaymentDetails);
                break;
            case 12:
                c = b.readInt64();
                a.setCreationTimeMillis(c);
                break;
            case 4:
                c = b.readInt64();
                P(a, 4, c);
                break;
            case 5:
                c = new Y.moneta.integrator.common.fundsguarantee
                    .PendingDetails;
                b.readMessage(c, Y.moneta.integrator.common.fundsguarantee
                    .PendingDetails.deserializeBinaryFromReader);
                W(a, 5, c, Y.moneta.integrator.common.fundsguarantee
                    .PendingDetails);
                break;
            case 6:
                c = new Y.moneta.integrator.common.fundsguarantee
                    .DeclineDetails;
                b.readMessage(c, Y.moneta.integrator.common.fundsguarantee
                    .DeclineDetails.deserializeBinaryFromReader);
                a.setDeclineDetails(c);
                break;
            case 13:
                c = new Y.moneta.integrator.common.fundsguarantee
                    .ChargeDetails;
                b.readMessage(c, Y.moneta.integrator.common.fundsguarantee
                    .ChargeDetails.deserializeBinaryFromReader);
                S(a, 13, c);
                break;
            case 14:
                c = new Y.moneta.integrator.common.fundsguarantee
                    .RefundDetails;
                b.readMessage(c, Y.moneta.integrator.common.fundsguarantee
                    .RefundDetails.deserializeBinaryFromReader);
                S(a, 14, c);
                break;
            case 15:
                c = new Y.moneta.integrator.common.fundsguarantee
                    .DisburseDetails;
                b.readMessage(c, Y.moneta.integrator.common.fundsguarantee
                    .DisburseDetails.deserializeBinaryFromReader);
                S(a, 15, c);
                break;
            case 16:
                c = new Y.moneta.integrator.common.fundsguarantee
                    .ApprovalDetails;
                b.readMessage(c, Y.moneta.integrator.common.fundsguarantee
                    .ApprovalDetails.deserializeBinaryFromReader);
                S(a, 16, c);
                break;
            case 17:
                c = new Y.moneta.integrator.common.fundsguarantee
                    .SystemBlockedDetails;
                b.readMessage(c, Y.moneta.integrator.common.fundsguarantee
                    .SystemBlockedDetails.deserializeBinaryFromReader);
                S(a, 17, c);
                break;
            case 19:
                c = new Y.moneta.integrator.common.fundsguarantee
                    .ChargebackDetails;
                b.readMessage(c, Y.moneta.integrator.common.fundsguarantee
                    .ChargebackDetails.deserializeBinaryFromReader);
                S(a, 19, c);
                break;
            case 18:
                c = b.readInt64();
                P(a, 18, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.fundsguarantee.FundsGuarantee
    .serializeBinaryToWriter = function (a, b) {
        var c = a.getFundsGuaranteeId();
        null != c && J(b, 1, c, Y.moneta.integrator.common.FundsGuaranteeId
            .serializeBinaryToWriter);
        c = O(a, 2);
        null != c && b.writeEnum(2, c);
        c = a.getAmount();
        null != c && J(b, 3, c, Y.moneta.integrator.common.Amount
            .serializeBinaryToWriter);
        c = a.getChargedAmount();
        null != c && J(b, 8, c, Y.moneta.integrator.common.Amount
            .serializeBinaryToWriter);
        c = a.getRefundedAmount();
        null != c && J(b, 9, c, Y.moneta.integrator.common.Amount
            .serializeBinaryToWriter);
        c = a.getChargebackAmount();
        null != c && J(b, 10, c, Y.moneta.integrator.common.Amount
            .serializeBinaryToWriter);
        c = a.getDisbursedAmount();
        null != c && J(b, 11, c, Y.moneta.integrator.common.Amount
            .serializeBinaryToWriter);
        c = R(a, Y.moneta.integrator.common.fundsguarantee
            .FundsGuaranteePaymentDetails, 7);
        0 < c.length && K(b, 7, c, Y.moneta.integrator.common.fundsguarantee
            .FundsGuaranteePaymentDetails.serializeBinaryToWriter);
        c = O(a, 12);
        null != c && b.writeInt64(12, c);
        c = O(a, 4);
        null != c && b.writeInt64(4, c);
        c = R(a, Y.moneta.integrator.common.fundsguarantee.PendingDetails,
            5);
        0 < c.length && K(b, 5, c, Y.moneta.integrator.common.fundsguarantee
            .PendingDetails.serializeBinaryToWriter);
        c = a.getDeclineDetails();
        null != c && J(b, 6, c, Y.moneta.integrator.common.fundsguarantee
            .DeclineDetails.serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.common.fundsguarantee.ChargeDetails, 13);
        null != c && J(b, 13, c, Y.moneta.integrator.common.fundsguarantee
            .ChargeDetails.serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.common.fundsguarantee.RefundDetails, 14);
        null != c && J(b, 14, c, Y.moneta.integrator.common.fundsguarantee
            .RefundDetails.serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.common.fundsguarantee.DisburseDetails, 15);
        null != c && J(b, 15, c, Y.moneta.integrator.common.fundsguarantee
            .DisburseDetails.serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.common.fundsguarantee.ApprovalDetails, 16);
        null != c && J(b, 16, c, Y.moneta.integrator.common.fundsguarantee
            .ApprovalDetails.serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.common.fundsguarantee.SystemBlockedDetails,
            17);
        null != c && J(b, 17, c, Y.moneta.integrator.common.fundsguarantee
            .SystemBlockedDetails.serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.common.fundsguarantee.ChargebackDetails,
            19);
        null != c && J(b, 19, c, Y.moneta.integrator.common.fundsguarantee
            .ChargebackDetails.serializeBinaryToWriter);
        c = O(a, 18);
        null != c && b.writeInt64(18, c)
    };
Y.moneta.integrator.common.fundsguarantee.FundsGuarantee
.FundsGuaranteeStatus = {
    UNKNOWN: 0,
    DENIED: 1,
    APPROVED: 2,
    PENDING: 3,
    CANCELLED: 4,
    CHARGED: 5,
    ADDED: 6,
    WAITING_FOR_CLIENT_RETRY: 7,
    EXPIRED: 8,
    DISBURSED: 9,
    CLOSED: 10
};
d = Y.moneta.integrator.common.fundsguarantee.FundsGuarantee.prototype;
d.getFundsGuaranteeId = function () {
    return Q(this, Y.moneta.integrator.common.FundsGuaranteeId, 1)
};
d.setFundsGuaranteeId = function (a) {
    S(this, 1, a)
};
d.getStatus = function () {
    return O(this, 2)
};
d.setStatus = function (a) {
    P(this, 2, a)
};
d.getAmount = function () {
    return Q(this, Y.moneta.integrator.common.Amount, 3)
};
d.setAmount = function (a) {
    S(this, 3, a)
};
d.getChargedAmount = function () {
    return Q(this, Y.moneta.integrator.common.Amount, 8)
};
d.setChargedAmount = function (a) {
    S(this, 8, a)
};
d.getRefundedAmount = function () {
    return Q(this, Y.moneta.integrator.common.Amount, 9)
};
d.setRefundedAmount = function (a) {
    S(this, 9, a)
};
d.getChargebackAmount = function () {
    return Q(this, Y.moneta.integrator.common.Amount, 10)
};
d.setChargebackAmount = function (a) {
    S(this, 10, a)
};
d.getDisbursedAmount = function () {
    return Q(this, Y.moneta.integrator.common.Amount, 11)
};
d.setDisbursedAmount = function (a) {
    S(this, 11, a)
};
d.setCreationTimeMillis = function (a) {
    P(this, 12, a)
};
d.getDeclineDetails = function () {
    return Q(this, Y.moneta.integrator.common.fundsguarantee.DeclineDetails,
        6)
};
d.setDeclineDetails = function (a) {
    S(this, 6, a)
};
Y.moneta.integrator.common.fundsguarantee.FundsGuarantee.deserialize =
    function (a) {
        return X(Y.moneta.integrator.common.fundsguarantee.FundsGuarantee, a)
    };
Y.moneta.integrator.common.buyflow.IntegratorPurchaseOrderResponse = function (
    a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.buyflow.IntegratorPurchaseOrderResponse,
    L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.buyflow
    .IntegratorPurchaseOrderResponse.prototype.toObject = function (a) {
        return Y.moneta.integrator.common.buyflow
            .IntegratorPurchaseOrderResponse.toObject(a, this)
    }, Y.moneta.integrator.common.buyflow.IntegratorPurchaseOrderResponse
    .toObject = function (a, b) {
        var c, f = {
            productCorrelationId: (c = b.getProductCorrelationId()) && Y
                .moneta.integrator.common.ProductCorrelationId.toObject(
                    a, c),
            cartComputedInfo: (c = b.getCartComputedInfo()) && Y.moneta
                .integrator.common.cart.CartComputedInfo.toObject(a,
                    c),
            fundsGuarantee: (c = b.getFundsGuarantee()) && Y.moneta
                .integrator.common.fundsguarantee.FundsGuarantee
                .toObject(a, c)
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.buyflow
    .IntegratorPurchaseOrderResponse.ObjectFormat = function () {}, Y.moneta
    .integrator.common.buyflow.IntegratorPurchaseOrderResponse.fromObject =
    function (a) {
        var b = new Y.moneta.integrator.common.buyflow
            .IntegratorPurchaseOrderResponse;
        a.productCorrelationId && S(b, 1, Y.moneta.integrator.common
            .ProductCorrelationId.fromObject(a.productCorrelationId));
        a.cartComputedInfo && S(b, 2, Y.moneta.integrator.common.cart
            .CartComputedInfo.fromObject(a.cartComputedInfo));
        a.fundsGuarantee && S(b, 3, Y.moneta.integrator.common
            .fundsguarantee.FundsGuarantee.fromObject(a.fundsGuarantee));
        return b
    });
Y.moneta.integrator.common.buyflow.IntegratorPurchaseOrderResponse
    .deserializeBinary = function (a) {
        return Y.moneta.integrator.common.buyflow
            .IntegratorPurchaseOrderResponse.deserializeBinaryFromReader(new Y
                .moneta.integrator.common.buyflow
                .IntegratorPurchaseOrderResponse, new C(a))
    };
Y.moneta.integrator.common.buyflow.IntegratorPurchaseOrderResponse
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = new Y.moneta.integrator.common.ProductCorrelationId;
                b.readMessage(c, Y.moneta.integrator.common
                    .ProductCorrelationId.deserializeBinaryFromReader);
                a.setProductCorrelationId(c);
                break;
            case 2:
                c = new Y.moneta.integrator.common.cart.CartComputedInfo;
                b.readMessage(c, Y.moneta.integrator.common.cart
                    .CartComputedInfo.deserializeBinaryFromReader);
                a.setCartComputedInfo(c);
                break;
            case 3:
                c = new Y.moneta.integrator.common.fundsguarantee
                    .FundsGuarantee;
                b.readMessage(c, Y.moneta.integrator.common.fundsguarantee
                    .FundsGuarantee.deserializeBinaryFromReader);
                a.setFundsGuarantee(c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.buyflow.IntegratorPurchaseOrderResponse
    .serializeBinaryToWriter = function (a, b) {
        var c = a.getProductCorrelationId();
        null != c && J(b, 1, c, Y.moneta.integrator.common.ProductCorrelationId
            .serializeBinaryToWriter);
        c = a.getCartComputedInfo();
        null != c && J(b, 2, c, Y.moneta.integrator.common.cart.CartComputedInfo
            .serializeBinaryToWriter);
        c = a.getFundsGuarantee();
        null != c && J(b, 3, c, Y.moneta.integrator.common.fundsguarantee
            .FundsGuarantee.serializeBinaryToWriter)
    };
d = Y.moneta.integrator.common.buyflow.IntegratorPurchaseOrderResponse
.prototype;
d.getProductCorrelationId = function () {
    return Q(this, Y.moneta.integrator.common.ProductCorrelationId, 1)
};
d.setProductCorrelationId = function (a) {
    S(this, 1, a)
};
d.getCartComputedInfo = function () {
    return Q(this, Y.moneta.integrator.common.cart.CartComputedInfo, 2)
};
d.setCartComputedInfo = function (a) {
    S(this, 2, a)
};
d.getFundsGuarantee = function () {
    return Q(this, Y.moneta.integrator.common.fundsguarantee.FundsGuarantee,
        3)
};
d.setFundsGuarantee = function (a) {
    S(this, 3, a)
};
Y.moneta.integrator.common.buyflow.IntegratorPurchaseOrderResponse.deserialize =
    function (a) {
        return X(Y.moneta.integrator.common.buyflow
            .IntegratorPurchaseOrderResponse, a)
    };
Y.moneta.integrator.common.customer = {};
Y.moneta.integrator.common.customer.Contact = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.customer.Contact, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.customer.Contact.prototype
    .toObject = function (a) {
        return Y.moneta.integrator.common.customer.Contact.toObject(a, this)
    }, Y.moneta.integrator.common.customer.Contact.toObject = function (a,
        b) {
        var c, f = {
            name: null == (c = O(b, 1)) ? void 0 : c,
            phoneNumber: null == (c = O(b, 2)) ? void 0 : c,
            languagePreference: null == (c = O(b, 4)) ? void 0 : c,
            gaiaId: null == (c = O(b, 5)) ? void 0 : c,
            emailAddress: null == (c = O(b, 3)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.customer.Contact
    .ObjectFormat = function () {}, Y.moneta.integrator.common.customer
    .Contact.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.customer.Contact;
        null != a.name && P(b, 1, a.name);
        null != a.phoneNumber && P(b, 2, a.phoneNumber);
        null != a.languagePreference && P(b, 4, a.languagePreference);
        null != a.gaiaId && P(b, 5, a.gaiaId);
        null != a.emailAddress && P(b, 3, a.emailAddress);
        return b
    });
Y.moneta.integrator.common.customer.Contact.deserializeBinary = function (a) {
    return Y.moneta.integrator.common.customer.Contact
        .deserializeBinaryFromReader(new Y.moneta.integrator.common.customer
            .Contact, new C(a))
};
Y.moneta.integrator.common.customer.Contact.deserializeBinaryFromReader =
    function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readString();
                P(a, 1, c);
                break;
            case 2:
                c = b.readString();
                a.setPhoneNumber(c);
                break;
            case 4:
                c = b.readString();
                P(a, 4, c);
                break;
            case 5:
                c = b.readInt64();
                P(a, 5, c);
                break;
            case 3:
                c = b.readString();
                P(a, 3, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.customer.Contact.serializeBinaryToWriter = function (
    a, b) {
    var c = O(a, 1);
    null != c && b.writeString(1, c);
    c = O(a, 2);
    null != c && b.writeString(2, c);
    c = O(a, 4);
    null != c && b.writeString(4, c);
    c = O(a, 5);
    null != c && b.writeInt64(5, c);
    c = O(a, 3);
    null != c && b.writeString(3, c)
};
Y.moneta.integrator.common.customer.Contact.prototype.getName = function () {
    return O(this, 1)
};
Y.moneta.integrator.common.customer.Contact.prototype.setPhoneNumber =
    function (a) {
        P(this, 2, a)
    };
Y.moneta.integrator.common.customer.Contact.deserialize = function (a) {
    return X(Y.moneta.integrator.common.customer.Contact, a)
};
Y.moneta.integrator.common.buyflow.SelectedPickUpDetails = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.buyflow.SelectedPickUpDetails, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.buyflow
    .SelectedPickUpDetails.prototype.toObject = function (a) {
        return Y.moneta.integrator.common.buyflow.SelectedPickUpDetails
            .toObject(a, this)
    }, Y.moneta.integrator.common.buyflow.SelectedPickUpDetails.toObject =
    function (a, b) {
        var c, f = {
            storeId: null == (c = O(b, 1)) ? void 0 : c,
            contact: (c = Q(b, Y.moneta.integrator.common.customer
                    .Contact, 2)) && Y.moneta.integrator.common.customer
                .Contact.toObject(a, c)
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.buyflow
    .SelectedPickUpDetails.ObjectFormat = function () {}, Y.moneta
    .integrator.common.buyflow.SelectedPickUpDetails.fromObject = function (
        a) {
        var b = new Y.moneta.integrator.common.buyflow
        .SelectedPickUpDetails;
        null != a.storeId && P(b, 1, a.storeId);
        a.contact && S(b, 2, Y.moneta.integrator.common.customer.Contact
            .fromObject(a.contact));
        return b
    });
Y.moneta.integrator.common.buyflow.SelectedPickUpDetails.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.common.buyflow.SelectedPickUpDetails
            .deserializeBinaryFromReader(new Y.moneta.integrator.common.buyflow
                .SelectedPickUpDetails, new C(a))
    };
Y.moneta.integrator.common.buyflow.SelectedPickUpDetails
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readString();
                P(a, 1, c);
                break;
            case 2:
                c = new Y.moneta.integrator.common.customer.Contact;
                b.readMessage(c, Y.moneta.integrator.common.customer.Contact
                    .deserializeBinaryFromReader);
                S(a, 2, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.buyflow.SelectedPickUpDetails
    .serializeBinaryToWriter = function (a, b) {
        var c = O(a, 1);
        null != c && b.writeString(1, c);
        c = Q(a, Y.moneta.integrator.common.customer.Contact, 2);
        null != c && J(b, 2, c, Y.moneta.integrator.common.customer.Contact
            .serializeBinaryToWriter)
    };
Y.moneta.integrator.common.buyflow.SelectedPickUpDetails.deserialize =
    function (a) {
        return X(Y.moneta.integrator.common.buyflow.SelectedPickUpDetails, a)
    };
Y.moneta.integrator.common.buyflow.SelectedShippingDetails = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.buyflow.SelectedShippingDetails, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.buyflow
    .SelectedShippingDetails.prototype.toObject = function (a) {
        return Y.moneta.integrator.common.buyflow.SelectedShippingDetails
            .toObject(a, this)
    }, Y.moneta.integrator.common.buyflow.SelectedShippingDetails.toObject =
    function (a, b) {
        var c, f = {
            shippingOptionName: null == (c = O(b, 3)) ? void 0 : c,
            address: (c = b.getAddress()) && Y.moneta.integrator.common
                .address.Address.toObject(a, c),
            integratorShippingOptionDataToken: null == (c = O(b, 5)) ?
                void 0 : c
        };
        a && (f.$jspbMessageInstance =
            b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.buyflow
    .SelectedShippingDetails.ObjectFormat = function () {}, Y.moneta
    .integrator.common.buyflow.SelectedShippingDetails.fromObject =
    function (a) {
        var b = new Y.moneta.integrator.common.buyflow
            .SelectedShippingDetails;
        null != a.shippingOptionName && P(b, 3, a.shippingOptionName);
        a.address && S(b, 4, Y.moneta.integrator.common.address.Address
            .fromObject(a.address));
        null != a.integratorShippingOptionDataToken && P(b, 5, a
            .integratorShippingOptionDataToken);
        return b
    });
Y.moneta.integrator.common.buyflow.SelectedShippingDetails.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.common.buyflow.SelectedShippingDetails
            .deserializeBinaryFromReader(new Y.moneta.integrator.common.buyflow
                .SelectedShippingDetails, new C(a))
    };
Y.moneta.integrator.common.buyflow.SelectedShippingDetails
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 3:
                var c = b.readString();
                P(a, 3, c);
                break;
            case 4:
                c = new Y.moneta.integrator.common.address.Address;
                b.readMessage(c, Y.moneta.integrator.common.address.Address
                    .deserializeBinaryFromReader);
                a.setAddress(c);
                break;
            case 5:
                c = b.readString();
                P(a, 5, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.buyflow.SelectedShippingDetails
    .serializeBinaryToWriter = function (a, b) {
        var c = O(a, 3);
        null != c && b.writeString(3, c);
        c = a.getAddress();
        null != c && J(b, 4, c, Y.moneta.integrator.common.address.Address
            .serializeBinaryToWriter);
        c = O(a, 5);
        null != c && b.writeString(5, c)
    };
Y.moneta.integrator.common.buyflow.SelectedShippingDetails.prototype
    .getAddress = function () {
        return Q(this, Y.moneta.integrator.common.address.Address, 4)
    };
Y.moneta.integrator.common.buyflow.SelectedShippingDetails.prototype
    .setAddress = function (a) {
        S(this, 4, a)
    };
Y.moneta.integrator.common.buyflow.SelectedShippingDetails.deserialize =
    function (a) {
        return X(Y.moneta.integrator.common.buyflow.SelectedShippingDetails, a)
    };
Y.moneta.integrator.ui = {};
Y.moneta.integrator.ui.buyflow = {};
Y.moneta.integrator.ui.buyflow.FundsGuaranteeCallbackData = function (a) {
    M(this, a, 15, Y.moneta.integrator.ui.buyflow.FundsGuaranteeCallbackData
        .repeatedFields_, null)
};
k.inherits(Y.moneta.integrator.ui.buyflow.FundsGuaranteeCallbackData, L);
Y.moneta.integrator.ui.buyflow.FundsGuaranteeCallbackData.extensions = {};
Y.moneta.integrator.ui.buyflow.FundsGuaranteeCallbackData.extensionsBinary = {};
Y.moneta.integrator.ui.buyflow.FundsGuaranteeCallbackData.repeatedFields_ = [11,
    14
];
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.ui.buyflow
    .FundsGuaranteeCallbackData.prototype.toObject = function (a) {
        return Y.moneta.integrator.ui.buyflow.FundsGuaranteeCallbackData
            .toObject(a, this)
    }, Y.moneta.integrator.ui.buyflow.FundsGuaranteeCallbackData.toObject =
    function (a, b) {
        var c, f = {
            productCorrelationId: (c = b.getProductCorrelationId()) && Y
                .moneta.integrator.common.ProductCorrelationId.toObject(
                    a, c),
            integratorSessionData: xc(b.getIntegratorSessionData()),
            cartComputedInfo: (c = b.getCartComputedInfo()) &&
                Y.moneta.integrator.common.cart.CartComputedInfo
                .toObject(a, c),
            fundsGuarantee: (c = b.getFundsGuarantee()) && Y.moneta
                .integrator.common.fundsguarantee.FundsGuarantee
                .toObject(a, c),
            selectedShippingDetails: (c = b
                .getSelectedShippingDetails()) && Y.moneta.integrator
                .common.buyflow.SelectedShippingDetails.toObject(a, c),
            selectedPickUpDetails: (c = Q(b, Y.moneta.integrator.common
                    .buyflow.SelectedPickUpDetails, 12)) && Y.moneta
                .integrator.common.buyflow.SelectedPickUpDetails
                .toObject(a, c),
            billingCustomerNumber: null == (c =
                O(b, 8)) ? void 0 : c,
            guestEmailAddress: null == (c = O(b, 9)) ? void 0 : c,
            userOptOutReauthentication: null == (c = wc(b, 10)) ?
                void 0 : c,
            customSectionDetailsValuesList: N(R(b, Y.moneta.integrator
                    .common.buyflow.CustomSectionDetailsValue, 11),
                Y.moneta.integrator.common.buyflow
                .CustomSectionDetailsValue.toObject, a),
            financingParameters: (c = Q(b, Y.moneta.integrator.common
                    .buyflow.FinancingParameters, 13)) && Y.moneta
                .integrator.common.buyflow.FinancingParameters.toObject(
                    a, c),
            integratorPurchaseOrderResponseList: N(R(b, Y.moneta
                    .integrator.common.buyflow
                    .IntegratorPurchaseOrderResponse,
                    14), Y.moneta.integrator.common.buyflow
                .IntegratorPurchaseOrderResponse.toObject, a)
        };
        pc(b, f, Y.moneta.integrator.ui.buyflow.FundsGuaranteeCallbackData
            .extensions, Y.moneta.integrator.ui.buyflow
            .FundsGuaranteeCallbackData.prototype.getExtension, a);
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.ui.buyflow
    .FundsGuaranteeCallbackData.ObjectFormat = function () {}, Y.moneta
    .integrator.ui.buyflow.FundsGuaranteeCallbackData.fromObject =
    function (a) {
        var b = new Y.moneta.integrator.ui.buyflow
            .FundsGuaranteeCallbackData;
        a.productCorrelationId && S(b, 2, Y.moneta.integrator.common
            .ProductCorrelationId.fromObject(a.productCorrelationId));
        null != a.integratorSessionData && P(b, 3, a.integratorSessionData);
        a.cartComputedInfo && S(b, 4, Y.moneta.integrator.common.cart
            .CartComputedInfo.fromObject(a.cartComputedInfo));
        a.fundsGuarantee && S(b, 6, Y.moneta.integrator.common
            .fundsguarantee.FundsGuarantee.fromObject(a.fundsGuarantee));
        a.selectedShippingDetails && S(b, 7, Y.moneta.integrator.common
            .buyflow.SelectedShippingDetails.fromObject(a
                .selectedShippingDetails));
        a.selectedPickUpDetails && S(b, 12, Y.moneta.integrator.common
            .buyflow.SelectedPickUpDetails.fromObject(a
                .selectedPickUpDetails));
        null != a.billingCustomerNumber && P(b, 8, a.billingCustomerNumber);
        null != a.guestEmailAddress && P(b, 9, a.guestEmailAddress);
        null != a.userOptOutReauthentication &&
            P(b, 10, a.userOptOutReauthentication);
        a.customSectionDetailsValuesList && V(b, 11, a
            .customSectionDetailsValuesList.map(Y.moneta.integrator
                .common.buyflow.CustomSectionDetailsValue.fromObject));
        a.financingParameters && S(b, 13, Y.moneta.integrator.common.buyflow
            .FinancingParameters.fromObject(a.financingParameters));
        a.integratorPurchaseOrderResponseList && V(b, 14, a
            .integratorPurchaseOrderResponseList.map(Y.moneta.integrator
                .common.buyflow.IntegratorPurchaseOrderResponse
                .fromObject));
        return b
    });
Y.moneta.integrator.ui.buyflow.FundsGuaranteeCallbackData.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.ui.buyflow.FundsGuaranteeCallbackData
            .deserializeBinaryFromReader(new Y.moneta.integrator.ui.buyflow
                .FundsGuaranteeCallbackData, new C(a))
    };
Y.moneta.integrator.ui.buyflow.FundsGuaranteeCallbackData
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 2:
                var c = new Y.moneta.integrator.common.ProductCorrelationId;
                b.readMessage(c, Y.moneta.integrator.common
                    .ProductCorrelationId.deserializeBinaryFromReader);
                a.setProductCorrelationId(c);
                break;
            case 3:
                c = b.readBytes();
                a.setIntegratorSessionData(c);
                break;
            case 4:
                c = new Y.moneta.integrator.common.cart.CartComputedInfo;
                b.readMessage(c, Y.moneta.integrator.common.cart
                    .CartComputedInfo.deserializeBinaryFromReader);
                a.setCartComputedInfo(c);
                break;
            case 6:
                c = new Y.moneta.integrator.common.fundsguarantee
                    .FundsGuarantee;
                b.readMessage(c, Y.moneta.integrator.common.fundsguarantee
                    .FundsGuarantee.deserializeBinaryFromReader);
                a.setFundsGuarantee(c);
                break;
            case 7:
                c = new Y.moneta.integrator.common.buyflow
                    .SelectedShippingDetails;
                b.readMessage(c, Y.moneta.integrator.common.buyflow
                    .SelectedShippingDetails.deserializeBinaryFromReader
                    );
                a.setSelectedShippingDetails(c);
                break;
            case 12:
                c = new Y.moneta.integrator.common.buyflow
                    .SelectedPickUpDetails;
                b.readMessage(c, Y.moneta.integrator.common.buyflow
                    .SelectedPickUpDetails.deserializeBinaryFromReader);
                S(a, 12, c);
                break;
            case 8:
                c = b.readInt64String();
                a.setBillingCustomerNumber(c);
                break;
            case 9:
                c = b.readString();
                a.setGuestEmailAddress(c);
                break;
            case 10:
                c = b.readBool();
                P(a, 10, c);
                break;
            case 11:
                c = new Y.moneta.integrator.common.buyflow
                    .CustomSectionDetailsValue;
                b.readMessage(c, Y.moneta.integrator.common.buyflow
                    .CustomSectionDetailsValue
                    .deserializeBinaryFromReader);
                W(a, 11, c, Y.moneta.integrator.common.buyflow
                    .CustomSectionDetailsValue);
                break;
            case 13:
                c = new Y.moneta.integrator.common.buyflow
                    .FinancingParameters;
                b.readMessage(c, Y.moneta.integrator.common.buyflow
                    .FinancingParameters.deserializeBinaryFromReader);
                S(a, 13, c);
                break;
            case 14:
                c = new Y.moneta.integrator.common.buyflow
                    .IntegratorPurchaseOrderResponse;
                b.readMessage(c, Y.moneta.integrator.common.buyflow
                    .IntegratorPurchaseOrderResponse
                    .deserializeBinaryFromReader);
                W(a, 14, c, Y.moneta.integrator.common.buyflow
                    .IntegratorPurchaseOrderResponse);
                break;
            default:
                rc(a, b, Y.moneta.integrator.ui.buyflow
                    .FundsGuaranteeCallbackData.extensionsBinary,
                    Y.moneta.integrator.ui.buyflow
                    .FundsGuaranteeCallbackData.prototype.getExtension,
                    Y.moneta.integrator.ui.buyflow
                    .FundsGuaranteeCallbackData.prototype.setExtension)
        }
        return a
    };
Y.moneta.integrator.ui.buyflow.FundsGuaranteeCallbackData
    .serializeBinaryToWriter = function (a, b) {
        var c = a.getProductCorrelationId();
        null != c && J(b, 2, c, Y.moneta.integrator.common.ProductCorrelationId
            .serializeBinaryToWriter);
        c = O(a, 3);
        null != c && b.writeBytes(3, c);
        c = a.getCartComputedInfo();
        null != c && J(b, 4, c, Y.moneta.integrator.common.cart.CartComputedInfo
            .serializeBinaryToWriter);
        c = a.getFundsGuarantee();
        null != c && J(b, 6, c, Y.moneta.integrator.common.fundsguarantee
            .FundsGuarantee.serializeBinaryToWriter);
        c = a.getSelectedShippingDetails();
        null != c && J(b, 7, c, Y.moneta.integrator.common.buyflow
            .SelectedShippingDetails.serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.common.buyflow.SelectedPickUpDetails, 12);
        null != c && J(b, 12, c, Y.moneta.integrator.common.buyflow
            .SelectedPickUpDetails.serializeBinaryToWriter);
        c = O(a, 8);
        null != c && b.writeInt64String(8, c);
        c = O(a, 9);
        null != c && b.writeString(9, c);
        c = O(a, 10);
        null != c && b.writeBool(10, c);
        c = R(a, Y.moneta.integrator.common.buyflow.CustomSectionDetailsValue,
            11);
        0 < c.length && K(b, 11, c, Y.moneta.integrator.common.buyflow
            .CustomSectionDetailsValue.serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.common.buyflow.FinancingParameters, 13);
        null != c && J(b, 13, c, Y.moneta.integrator.common.buyflow
            .FinancingParameters.serializeBinaryToWriter);
        c = R(a, Y.moneta.integrator.common.buyflow
            .IntegratorPurchaseOrderResponse, 14);
        0 < c.length && K(b, 14, c, Y.moneta.integrator.common.buyflow
            .IntegratorPurchaseOrderResponse.serializeBinaryToWriter);
        qc(a, b, Y.moneta.integrator.ui.buyflow.FundsGuaranteeCallbackData
            .extensionsBinary, Y.moneta.integrator.ui.buyflow
            .FundsGuaranteeCallbackData.prototype.getExtension)
    };
d = Y.moneta.integrator.ui.buyflow.FundsGuaranteeCallbackData.prototype;
d.getProductCorrelationId = function () {
    return Q(this, Y.moneta.integrator.common.ProductCorrelationId, 2)
};
d.setProductCorrelationId = function (a) {
    S(this, 2, a)
};
d.getIntegratorSessionData = function () {
    return O(this, 3)
};
d.setIntegratorSessionData = function (a) {
    P(this, 3, a)
};
d.getCartComputedInfo = function () {
    return Q(this, Y.moneta.integrator.common.cart.CartComputedInfo, 4)
};
d.setCartComputedInfo = function (a) {
    S(this, 4, a)
};
d.getFundsGuarantee = function () {
    return Q(this, Y.moneta.integrator.common.fundsguarantee.FundsGuarantee,
        6)
};
d.setFundsGuarantee = function (a) {
    S(this, 6, a)
};
d.getSelectedShippingDetails = function () {
    return Q(this, Y.moneta.integrator.common.buyflow
        .SelectedShippingDetails, 7)
};
d.setSelectedShippingDetails = function (a) {
    S(this, 7, a)
};
d.setBillingCustomerNumber = function (a) {
    P(this, 8, a)
};
d.setGuestEmailAddress = function (a) {
    P(this, 9, a)
};
Y.moneta.integrator.ui.buyflow.FundsGuaranteeCallbackData.deserialize =
    function (a) {
        return X(Y.moneta.integrator.ui.buyflow.FundsGuaranteeCallbackData, a)
    };
Y.moneta.integrator.common.PurchaseOrderId = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.PurchaseOrderId, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.PurchaseOrderId.prototype
    .toObject = function (a) {
        return Y.moneta.integrator.common.PurchaseOrderId.toObject(a, this)
    }, Y.moneta.integrator.common.PurchaseOrderId.toObject = function (a,
    b) {
        var c, f = {
            billableService: null == (c = O(b, 1)) ? void 0 : c,
            requestId: null == (c = O(b, 2)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.PurchaseOrderId
    .ObjectFormat = function () {}, Y.moneta.integrator.common
    .PurchaseOrderId.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.PurchaseOrderId;
        null != a.billableService && P(b, 1, a.billableService);
        null != a.requestId && P(b, 2, a.requestId);
        return b
    });
Y.moneta.integrator.common.PurchaseOrderId.deserializeBinary = function (a) {
    return Y.moneta.integrator.common.PurchaseOrderId
        .deserializeBinaryFromReader(new Y.moneta.integrator.common
            .PurchaseOrderId, new C(a))
};
Y.moneta.integrator.common.PurchaseOrderId.deserializeBinaryFromReader =
    function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readInt32();
                a.setBillableService(c);
                break;
            case 2:
                c = b.readString();
                a.setRequestId(c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.PurchaseOrderId.serializeBinaryToWriter = function (
    a, b) {
    var c = O(a, 1);
    null != c && b.writeInt32(1, c);
    c = O(a, 2);
    null != c && b.writeString(2, c)
};
Y.moneta.integrator.common.PurchaseOrderId.prototype.setBillableService =
    function (a) {
        P(this, 1, a)
    };
Y.moneta.integrator.common.PurchaseOrderId.prototype.setRequestId = function (
a) {
    P(this, 2, a)
};
Y.moneta.integrator.common.PurchaseOrderId.deserialize = function (a) {
    return X(Y.moneta.integrator.common.PurchaseOrderId, a)
};
Y.moneta.integrator.common.purchaseorder = {};
Y.moneta.integrator.common.purchaseorder.Chargeback = function (a) {
    M(this, a, -1, Y.moneta.integrator.common.purchaseorder.Chargeback
        .repeatedFields_, null)
};
k.inherits(Y.moneta.integrator.common.purchaseorder.Chargeback, L);
Y.moneta.integrator.common.purchaseorder.Chargeback.repeatedFields_ = [1];
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.purchaseorder.Chargeback
    .prototype.toObject = function (a) {
        return Y.moneta.integrator.common.purchaseorder.Chargeback.toObject(
            a, this)
    }, Y.moneta.integrator.common.purchaseorder.Chargeback.toObject =
    function (a, b) {
        var c, f = {
            lineItemIndexList: null == (c = sc(b, 1)) ? void 0 : c,
            amount: (c = b.getAmount()) && Y.moneta.integrator.common
                .Amount.toObject(a, c),
            timeMillis: null == (c = O(b, 3)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.purchaseorder.Chargeback
    .ObjectFormat = function () {}, Y.moneta.integrator.common.purchaseorder
    .Chargeback.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.purchaseorder.Chargeback;
        null != a.lineItemIndexList && P(b, 1, a.lineItemIndexList);
        a.amount && S(b, 2, Y.moneta.integrator.common.Amount.fromObject(a
            .amount));
        null != a.timeMillis && P(b, 3, a.timeMillis);
        return b
    });
Y.moneta.integrator.common.purchaseorder.Chargeback.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.common.purchaseorder.Chargeback
            .deserializeBinaryFromReader(new Y.moneta.integrator.common
                .purchaseorder.Chargeback, new C(a))
    };
Y.moneta.integrator.common.purchaseorder.Chargeback
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                if (b.nextWireType_ == z.DELIMITED) {
                    var c = b;
                    var f = b.decoder_.readSignedVarint32;
                    k.asserts.assert(c.nextWireType_ == z.DELIMITED);
                    var g = Qb(c.decoder_);
                    g = c.decoder_.getCursor() + g;
                    for (var h = []; c.decoder_.getCursor() < g;) h.push(f
                        .call(c.decoder_));
                    c = h
                } else c = [b.readInt32()];
                for (f = 0; f < c.length; f++) Ac(a, 1, c[f]);
                break;
            case 2:
                c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c,
                    Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                a.setAmount(c);
                break;
            case 3:
                c = b.readInt64();
                a.setTimeMillis(c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.purchaseorder.Chargeback.serializeBinaryToWriter =
    function (a, b) {
        var c = sc(a, 1);
        if (0 < c.length && null != c)
            for (var f = 0; f < c.length; f++) $b(b, 1, c[f]);
        c = a.getAmount();
        null != c && J(b, 2, c, Y.moneta.integrator.common.Amount
            .serializeBinaryToWriter);
        c = O(a, 3);
        null != c && b.writeInt64(3, c)
    };
Y.moneta.integrator.common.purchaseorder.Chargeback.prototype.getAmount =
    function () {
        return Q(this, Y.moneta.integrator.common.Amount, 2)
    };
Y.moneta.integrator.common.purchaseorder.Chargeback.prototype.setAmount =
    function (a) {
        S(this, 2, a)
    };
Y.moneta.integrator.common.purchaseorder.Chargeback.prototype.setTimeMillis =
    function (a) {
        P(this, 3, a)
    };
Y.moneta.integrator.common.purchaseorder.Chargeback.deserialize = function (a) {
    return X(Y.moneta.integrator.common.purchaseorder.Chargeback, a)
};
Y.moneta.integrator.common.purchaseorder.LineItemEvent = function (a) {
    M(this, a, -1, null, Y.moneta.integrator.common.purchaseorder
        .LineItemEvent.oneofGroups_)
};
k.inherits(Y.moneta.integrator.common.purchaseorder.LineItemEvent, L);
Y.moneta.integrator.common.purchaseorder.LineItemEvent.Cancel = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.purchaseorder.LineItemEvent.Cancel, L);
Y.moneta.integrator.common.purchaseorder.LineItemEvent.Refund = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.purchaseorder.LineItemEvent.Refund, L);
Y.moneta.integrator.common.purchaseorder.LineItemEvent.oneofGroups_ = [
    [2, 3]
];
Y.moneta.integrator.common.purchaseorder.LineItemEvent.EventCase = {
    EVENT_NOT_SET: 0,
    CANCEL: 2,
    REFUND: 3
};
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.purchaseorder.LineItemEvent
    .prototype.toObject = function (a) {
        return Y.moneta.integrator.common.purchaseorder.LineItemEvent
            .toObject(a, this)
    }, Y.moneta.integrator.common.purchaseorder.LineItemEvent.toObject =
    function (a, b) {
        var c, f = {
            timeMillis: null == (c = O(b, 1)) ? void 0 : c,
            cancel: (c = Q(b, Y.moneta.integrator.common.purchaseorder
                    .LineItemEvent.Cancel, 2)) && Y.moneta.integrator
                .common.purchaseorder.LineItemEvent.Cancel.toObject(a,
                    c),
            refund: (c = Q(b, Y.moneta.integrator.common.purchaseorder
                    .LineItemEvent.Refund,
                    3)) && Y.moneta.integrator.common.purchaseorder
                .LineItemEvent.Refund.toObject(a, c)
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.purchaseorder
    .LineItemEvent.ObjectFormat = function () {}, Y.moneta.integrator.common
    .purchaseorder.LineItemEvent.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.purchaseorder.LineItemEvent;
        null != a.timeMillis && P(b, 1, a.timeMillis);
        a.cancel && S(b, 2, Y.moneta.integrator.common.purchaseorder
            .LineItemEvent.Cancel.fromObject(a.cancel));
        a.refund && S(b, 3, Y.moneta.integrator.common.purchaseorder
            .LineItemEvent.Refund.fromObject(a.refund));
        return b
    });
Y.moneta.integrator.common.purchaseorder.LineItemEvent.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.common.purchaseorder.LineItemEvent
            .deserializeBinaryFromReader(new Y.moneta.integrator.common
                .purchaseorder.LineItemEvent, new C(a))
    };
Y.moneta.integrator.common.purchaseorder.LineItemEvent
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readInt64();
                a.setTimeMillis(c);
                break;
            case 2:
                c = new Y.moneta.integrator.common.purchaseorder
                    .LineItemEvent.Cancel;
                b.readMessage(c, Y.moneta.integrator.common.purchaseorder
                    .LineItemEvent.Cancel.deserializeBinaryFromReader);
                U(a, 2, Y.moneta.integrator.common.purchaseorder
                    .LineItemEvent.oneofGroups_[0], c);
                break;
            case 3:
                c = new Y.moneta.integrator.common.purchaseorder
                    .LineItemEvent.Refund;
                b.readMessage(c, Y.moneta.integrator.common.purchaseorder
                    .LineItemEvent.Refund.deserializeBinaryFromReader);
                U(a, 3, Y.moneta.integrator.common.purchaseorder
                    .LineItemEvent.oneofGroups_[0], c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.purchaseorder.LineItemEvent.serializeBinaryToWriter =
    function (a, b) {
        var c = O(a, 1);
        null != c && b.writeInt64(1, c);
        c = Q(a, Y.moneta.integrator.common.purchaseorder.LineItemEvent.Cancel,
            2);
        null != c && J(b, 2, c, Y.moneta.integrator.common.purchaseorder
            .LineItemEvent.Cancel.serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.common.purchaseorder.LineItemEvent.Refund,
            3);
        null != c && J(b, 3, c, Y.moneta.integrator.common.purchaseorder
            .LineItemEvent.Refund.serializeBinaryToWriter)
    };
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.purchaseorder.LineItemEvent
    .Cancel.prototype.toObject = function (a) {
        return Y.moneta.integrator.common.purchaseorder.LineItemEvent.Cancel
            .toObject(a, this)
    }, Y.moneta.integrator.common.purchaseorder.LineItemEvent.Cancel
    .toObject = function (a, b) {
        var c, f = {
            cancelReason: null == (c = O(b, 1)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.purchaseorder
    .LineItemEvent.Cancel.ObjectFormat = function () {}, Y.moneta.integrator
    .common.purchaseorder.LineItemEvent.Cancel.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.purchaseorder.LineItemEvent
            .Cancel;
        null != a.cancelReason && P(b, 1, a.cancelReason);
        return b
    });
Y.moneta.integrator.common.purchaseorder.LineItemEvent.Cancel
    .deserializeBinary = function (a) {
        return Y.moneta.integrator.common.purchaseorder.LineItemEvent.Cancel
            .deserializeBinaryFromReader(new Y.moneta.integrator.common
                .purchaseorder.LineItemEvent.Cancel, new C(a))
    };
Y.moneta.integrator.common.purchaseorder.LineItemEvent.Cancel
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readEnum();
                P(a, 1, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.purchaseorder.LineItemEvent.Cancel
    .serializeBinaryToWriter = function (a, b) {
        a = O(a, 1);
        null != a && b.writeEnum(1, a)
    };
Y.moneta.integrator.common.purchaseorder.LineItemEvent.Cancel.deserialize =
    function (a) {
        return X(Y.moneta.integrator.common.purchaseorder.LineItemEvent.Cancel,
            a)
    };
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.purchaseorder.LineItemEvent
    .Refund.prototype.toObject = function (a) {
        return Y.moneta.integrator.common.purchaseorder.LineItemEvent.Refund
            .toObject(a, this)
    }, Y.moneta.integrator.common.purchaseorder.LineItemEvent.Refund
    .toObject = function (a, b) {
        var c, f = {
            refundReason: null == (c = O(b, 1)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.purchaseorder
    .LineItemEvent.Refund.ObjectFormat = function () {}, Y.moneta.integrator
    .common.purchaseorder.LineItemEvent.Refund.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.purchaseorder.LineItemEvent
            .Refund;
        null != a.refundReason && P(b, 1, a.refundReason);
        return b
    });
Y.moneta.integrator.common.purchaseorder.LineItemEvent.Refund
    .deserializeBinary = function (a) {
        return Y.moneta.integrator.common.purchaseorder.LineItemEvent.Refund
            .deserializeBinaryFromReader(new Y.moneta.integrator.common
                .purchaseorder.LineItemEvent.Refund, new C(a))
    };
Y.moneta.integrator.common.purchaseorder.LineItemEvent.Refund
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readEnum();
                P(a, 1, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.purchaseorder.LineItemEvent.Refund
    .serializeBinaryToWriter = function (a, b) {
        a = O(a, 1);
        null != a && b.writeEnum(1, a)
    };
Y.moneta.integrator.common.purchaseorder.LineItemEvent.Refund.deserialize =
    function (a) {
        return X(Y.moneta.integrator.common.purchaseorder.LineItemEvent.Refund,
            a)
    };
Y.moneta.integrator.common.purchaseorder.LineItemEvent.prototype.setTimeMillis =
    function (a) {
        P(this, 1, a)
    };
Y.moneta.integrator.common.purchaseorder.LineItemEvent.deserialize = function (
    a) {
    return X(Y.moneta.integrator.common.purchaseorder.LineItemEvent, a)
};
Y.moneta.integrator.common.purchaseorder.PriceDetails = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.purchaseorder.PriceDetails, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.purchaseorder.PriceDetails
    .prototype.toObject = function (a) {
        return Y.moneta.integrator.common.purchaseorder.PriceDetails
            .toObject(a, this)
    }, Y.moneta.integrator.common.purchaseorder.PriceDetails.toObject =
    function (a, b) {
        var c, f = {
            pretaxAmount: (c = Hc(b)) && Y.moneta.integrator.common
                .Amount.toObject(a, c),
            taxAmount: (c = Ic(b)) && Y.moneta.integrator.common.Amount
                .toObject(a, c),
            totalAmount: (c = Jc(b)) && Y.moneta.integrator.common
                .Amount.toObject(a, c)
        };
        a && (f.$jspbMessageInstance =
            b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.purchaseorder.PriceDetails
    .ObjectFormat = function () {}, Y.moneta.integrator.common.purchaseorder
    .PriceDetails.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.purchaseorder.PriceDetails;
        a.pretaxAmount && S(b, 1, Y.moneta.integrator.common.Amount
            .fromObject(a.pretaxAmount));
        a.taxAmount && S(b, 2, Y.moneta.integrator.common.Amount.fromObject(
            a.taxAmount));
        a.totalAmount && S(b, 3, Y.moneta.integrator.common.Amount
            .fromObject(a.totalAmount));
        return b
    });
Y.moneta.integrator.common.purchaseorder.PriceDetails.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.common.purchaseorder.PriceDetails
            .deserializeBinaryFromReader(new Y.moneta.integrator.common
                .purchaseorder.PriceDetails, new C(a))
    };
Y.moneta.integrator.common.purchaseorder.PriceDetails
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c, Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                a.setPretaxAmount(c);
                break;
            case 2:
                c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c, Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                a.setTaxAmount(c);
                break;
            case 3:
                c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c,
                    Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                a.setTotalAmount(c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.purchaseorder.PriceDetails.serializeBinaryToWriter =
    function (a, b) {
        var c = Hc(a);
        null != c && J(b, 1, c, Y.moneta.integrator.common.Amount
            .serializeBinaryToWriter);
        c = Ic(a);
        null != c && J(b, 2, c, Y.moneta.integrator.common.Amount
            .serializeBinaryToWriter);
        c = Jc(a);
        null != c && J(b, 3, c, Y.moneta.integrator.common.Amount
            .serializeBinaryToWriter)
    };
Y.moneta.integrator.common.purchaseorder.PriceDetails.prototype
    .setPretaxAmount = function (a) {
        S(this, 1, a)
    };
Y.moneta.integrator.common.purchaseorder.PriceDetails.prototype.setTaxAmount =
    function (a) {
        S(this, 2, a)
    };
Y.moneta.integrator.common.purchaseorder.PriceDetails.prototype.setTotalAmount =
    function (a) {
        S(this, 3, a)
    };
Y.moneta.integrator.common.purchaseorder.PriceDetails.deserialize = function (
a) {
    return X(Y.moneta.integrator.common.purchaseorder.PriceDetails, a)
};
Y.moneta.integrator.common.Frequency = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.Frequency, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.Frequency.prototype
    .toObject = function (a) {
        return Y.moneta.integrator.common.Frequency.toObject(a, this)
    }, Y.moneta.integrator.common.Frequency.toObject = function (a, b) {
        var c, f = {
            count: null == (c = O(b, 1)) ? void 0 : c,
            period: null == (c = O(b, 2)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.Frequency.ObjectFormat =
    function () {}, Y.moneta.integrator.common.Frequency.fromObject =
    function (a) {
        var b = new Y.moneta.integrator.common.Frequency;
        null != a.count && P(b, 1, a.count);
        null != a.period && P(b, 2, a.period);
        return b
    });
Y.moneta.integrator.common.Frequency.deserializeBinary = function (a) {
    return Y.moneta.integrator.common.Frequency.deserializeBinaryFromReader(
        new Y.moneta.integrator.common.Frequency, new C(a))
};
Y.moneta.integrator.common.Frequency.deserializeBinaryFromReader = function (a,
    b) {
    for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
        case 1:
            var c = b.readInt32();
            a.setCount(c);
            break;
        case 2:
            c = b.readEnum();
            P(a, 2, c);
            break;
        default:
            G(b)
    }
    return a
};
Y.moneta.integrator.common.Frequency.serializeBinaryToWriter = function (a, b) {
    var c = O(a, 1);
    null != c && b.writeInt32(1, c);
    c = O(a, 2);
    null != c && b.writeEnum(2, c)
};
Y.moneta.integrator.common.Frequency.Period = {
    UNKNOWN_FREQUENCY: 0,
    DAILY: 1,
    WEEKLY: 2,
    MONTHLY: 3,
    YEARLY: 4,
    HOURLY: 5,
    MINUTELY: 6
};
Y.moneta.integrator.common.Frequency.prototype.getCount = function () {
    return O(this, 1)
};
Y.moneta.integrator.common.Frequency.prototype.setCount = function (a) {
    P(this, 1, a)
};
Y.moneta.integrator.common.Frequency.deserialize = function (a) {
    return X(Y.moneta.integrator.common.Frequency, a)
};
Y.moneta.integrator.common.subscription = {};
Y.moneta.integrator.common.subscription.SubscriptionFreeTrialDuration =
    function (a) {
        M(this, a, -1, null, null)
    };
k.inherits(Y.moneta.integrator.common.subscription
    .SubscriptionFreeTrialDuration, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.subscription
    .SubscriptionFreeTrialDuration.prototype.toObject = function (a) {
        return Y.moneta.integrator.common.subscription
            .SubscriptionFreeTrialDuration.toObject(a, this)
    }, Y.moneta.integrator.common.subscription.SubscriptionFreeTrialDuration
    .toObject = function (a, b) {
        var c, f = {
            count: null == (c = O(b, 1)) ? void 0 : c,
            unit: null == (c = O(b, 2)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.subscription
    .SubscriptionFreeTrialDuration.ObjectFormat = function () {}, Y.moneta
    .integrator.common.subscription.SubscriptionFreeTrialDuration
    .fromObject = function (a) {
        var b = new Y.moneta.integrator.common.subscription
            .SubscriptionFreeTrialDuration;
        null != a.count && P(b, 1, a.count);
        null != a.unit && P(b, 2, a.unit);
        return b
    });
Y.moneta.integrator.common.subscription.SubscriptionFreeTrialDuration
    .deserializeBinary = function (a) {
        return Y.moneta.integrator.common.subscription
            .SubscriptionFreeTrialDuration.deserializeBinaryFromReader(new Y
                .moneta.integrator.common.subscription
                .SubscriptionFreeTrialDuration, new C(a))
    };
Y.moneta.integrator.common.subscription.SubscriptionFreeTrialDuration
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readInt32();
                a.setCount(c);
                break;
            case 2:
                c = b.readEnum();
                P(a, 2, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.subscription.SubscriptionFreeTrialDuration
    .serializeBinaryToWriter = function (a, b) {
        var c = O(a, 1);
        null != c && b.writeInt32(1, c);
        c = O(a, 2);
        null != c && b.writeEnum(2, c)
    };
Y.moneta.integrator.common.subscription.SubscriptionFreeTrialDuration
.UnitType = {
    UNIT_TYPE_UNKNOWN: 0,
    UNIT_TYPE_DAILY: 1,
    UNIT_TYPE_WEEKLY: 2,
    UNIT_TYPE_MONTHLY: 3,
    UNIT_TYPE_YEARLY: 4,
    UNIT_TYPE_HOURLY: 5
};
Y.moneta.integrator.common.subscription.SubscriptionFreeTrialDuration.prototype
    .getCount = function () {
        return O(this, 1)
    };
Y.moneta.integrator.common.subscription.SubscriptionFreeTrialDuration.prototype
    .setCount = function (a) {
        P(this, 1, a)
    };
Y.moneta.integrator.common.subscription.SubscriptionFreeTrialDuration
    .deserialize = function (a) {
        return X(Y.moneta.integrator.common.subscription
            .SubscriptionFreeTrialDuration, a)
    };
Y.moneta.integrator.common.purchaseorder.InitiatingDetails = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.purchaseorder.InitiatingDetails, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.purchaseorder
    .InitiatingDetails.prototype.toObject = function (a) {
        return Y.moneta.integrator.common.purchaseorder.InitiatingDetails
            .toObject(a, this)
    }, Y.moneta.integrator.common.purchaseorder.InitiatingDetails.toObject =
    function (a, b) {
        var c, f = {
            frequency: (c = Q(b, Y.moneta.integrator.common.Frequency,
                    1)) && Y.moneta.integrator.common.Frequency
                .toObject(a, c),
            gracePeriodMillis: null == (c = O(b, 2)) ? void 0 : c,
            freeTrialDuration: (c = Q(b, Y.moneta.integrator.common
                    .subscription.SubscriptionFreeTrialDuration,
                    3)) && Y.moneta.integrator.common.subscription
                .SubscriptionFreeTrialDuration.toObject(a, c)
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.purchaseorder
    .InitiatingDetails.ObjectFormat = function () {}, Y.moneta.integrator
    .common.purchaseorder.InitiatingDetails.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.purchaseorder
            .InitiatingDetails;
        a.frequency && S(b, 1, Y.moneta.integrator.common.Frequency
            .fromObject(a.frequency));
        null != a.gracePeriodMillis && P(b, 2, a.gracePeriodMillis);
        a.freeTrialDuration && S(b, 3, Y.moneta.integrator.common
            .subscription.SubscriptionFreeTrialDuration.fromObject(a
                .freeTrialDuration));
        return b
    });
Y.moneta.integrator.common.purchaseorder.InitiatingDetails.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.common.purchaseorder.InitiatingDetails
            .deserializeBinaryFromReader(new Y.moneta.integrator.common
                .purchaseorder.InitiatingDetails, new C(a))
    };
Y.moneta.integrator.common.purchaseorder.InitiatingDetails
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = new Y.moneta.integrator.common.Frequency;
                b.readMessage(c, Y.moneta.integrator.common.Frequency
                    .deserializeBinaryFromReader);
                S(a, 1, c);
                break;
            case 2:
                c = b.readInt64();
                P(a, 2, c);
                break;
            case 3:
                c = new Y.moneta.integrator.common.subscription
                    .SubscriptionFreeTrialDuration;
                b.readMessage(c, Y.moneta.integrator.common.subscription
                    .SubscriptionFreeTrialDuration
                    .deserializeBinaryFromReader);
                S(a, 3, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.purchaseorder.InitiatingDetails
    .serializeBinaryToWriter = function (a, b) {
        var c = Q(a, Y.moneta.integrator.common.Frequency, 1);
        null != c && J(b, 1, c, Y.moneta.integrator.common.Frequency
            .serializeBinaryToWriter);
        c = O(a, 2);
        null != c && b.writeInt64(2, c);
        c = Q(a, Y.moneta.integrator.common.subscription
            .SubscriptionFreeTrialDuration, 3);
        null != c && J(b, 3, c, Y.moneta.integrator.common.subscription
            .SubscriptionFreeTrialDuration.serializeBinaryToWriter)
    };
Y.moneta.integrator.common.purchaseorder.InitiatingDetails.deserialize =
    function (a) {
        return X(Y.moneta.integrator.common.purchaseorder.InitiatingDetails, a)
    };
Y.moneta.integrator.common.purchaseorder.SubscriptionDetails = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.purchaseorder.SubscriptionDetails, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.purchaseorder
    .SubscriptionDetails.prototype.toObject = function (a) {
        return Y.moneta.integrator.common.purchaseorder.SubscriptionDetails
            .toObject(a, this)
    }, Y.moneta.integrator.common.purchaseorder.SubscriptionDetails
    .toObject = function (a, b) {
        var c, f = {
            subscriptionId: (c = b.getSubscriptionId()) && Y.moneta
                .integrator.common.SubscriptionId.toObject(a, c),
            subscriptionPurchaseOrderType: null == (c = O(b, 2)) ?
                void 0 : c,
            initiatingDetails: (c = Q(b, Y.moneta.integrator.common
                    .purchaseorder.InitiatingDetails,
                    3)) && Y.moneta.integrator.common.purchaseorder
                .InitiatingDetails.toObject(a, c)
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.purchaseorder
    .SubscriptionDetails.ObjectFormat = function () {}, Y.moneta.integrator
    .common.purchaseorder.SubscriptionDetails.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.purchaseorder
            .SubscriptionDetails;
        a.subscriptionId && S(b, 1, Y.moneta.integrator.common
            .SubscriptionId.fromObject(a.subscriptionId));
        null != a.subscriptionPurchaseOrderType && P(b, 2, a
            .subscriptionPurchaseOrderType);
        a.initiatingDetails && S(b, 3, Y.moneta.integrator.common
            .purchaseorder.InitiatingDetails.fromObject(a
                .initiatingDetails));
        return b
    });
Y.moneta.integrator.common.purchaseorder.SubscriptionDetails.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.common.purchaseorder.SubscriptionDetails
            .deserializeBinaryFromReader(new Y.moneta.integrator.common
                .purchaseorder.SubscriptionDetails, new C(a))
    };
Y.moneta.integrator.common.purchaseorder.SubscriptionDetails
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = new Y.moneta.integrator.common.SubscriptionId;
                b.readMessage(c, Y.moneta.integrator.common.SubscriptionId
                    .deserializeBinaryFromReader);
                a.setSubscriptionId(c);
                break;
            case 2:
                c = b.readEnum();
                P(a, 2, c);
                break;
            case 3:
                c = new Y.moneta.integrator.common.purchaseorder
                    .InitiatingDetails;
                b.readMessage(c, Y.moneta.integrator.common.purchaseorder
                    .InitiatingDetails.deserializeBinaryFromReader);
                S(a, 3, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.purchaseorder.SubscriptionDetails
    .serializeBinaryToWriter = function (a, b) {
        var c = a.getSubscriptionId();
        null != c && J(b, 1, c, Y.moneta.integrator.common.SubscriptionId
            .serializeBinaryToWriter);
        c = O(a, 2);
        null != c && b.writeEnum(2, c);
        c = Q(a, Y.moneta.integrator.common.purchaseorder.InitiatingDetails, 3);
        null != c && J(b, 3, c, Y.moneta.integrator.common.purchaseorder
            .InitiatingDetails.serializeBinaryToWriter)
    };
Y.moneta.integrator.common.purchaseorder.SubscriptionDetails.prototype
    .getSubscriptionId = function () {
        return Q(this, Y.moneta.integrator.common.SubscriptionId, 1)
    };
Y.moneta.integrator.common.purchaseorder.SubscriptionDetails.prototype
    .setSubscriptionId = function (a) {
        S(this, 1, a)
    };
Y.moneta.integrator.common.purchaseorder.SubscriptionDetails.deserialize =
    function (a) {
        return X(Y.moneta.integrator.common.purchaseorder.SubscriptionDetails,
            a)
    };
Y.moneta.integrator.common.purchaseorder.ServicePeriod = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.purchaseorder.ServicePeriod, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.purchaseorder.ServicePeriod
    .prototype.toObject = function (a) {
        return Y.moneta.integrator.common.purchaseorder.ServicePeriod
            .toObject(a, this)
    }, Y.moneta.integrator.common.purchaseorder.ServicePeriod.toObject =
    function (a, b) {
        var c, f = {
            startTimeMillis: null == (c = O(b, 1)) ? void 0 : c,
            endTimeMillis: null == (c = O(b, 2)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.purchaseorder
    .ServicePeriod.ObjectFormat = function () {}, Y.moneta.integrator.common
    .purchaseorder.ServicePeriod.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.purchaseorder.ServicePeriod;
        null != a.startTimeMillis && P(b, 1, a.startTimeMillis);
        null != a.endTimeMillis && P(b, 2, a.endTimeMillis);
        return b
    });
Y.moneta.integrator.common.purchaseorder.ServicePeriod.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.common.purchaseorder.ServicePeriod
            .deserializeBinaryFromReader(new Y.moneta.integrator.common
                .purchaseorder.ServicePeriod, new C(a))
    };
Y.moneta.integrator.common.purchaseorder.ServicePeriod
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readInt64();
                P(a, 1, c);
                break;
            case 2:
                c = b.readInt64();
                P(a, 2, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.purchaseorder.ServicePeriod.serializeBinaryToWriter =
    function (a, b) {
        var c = O(a, 1);
        null != c && b.writeInt64(1, c);
        c = O(a, 2);
        null != c && b.writeInt64(2, c)
    };
Y.moneta.integrator.common.purchaseorder.ServicePeriod.deserialize = function (
    a) {
    return X(Y.moneta.integrator.common.purchaseorder.ServicePeriod, a)
};
Y.moneta.integrator.common.purchaseorder.UnitLevelState = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.purchaseorder.UnitLevelState, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.purchaseorder.UnitLevelState
    .prototype.toObject = function (a) {
        return Y.moneta.integrator.common.purchaseorder.UnitLevelState
            .toObject(a, this)
    }, Y.moneta.integrator.common.purchaseorder.UnitLevelState.toObject =
    function (a, b) {
        var c, f = {
            quantity: null == (c = O(b, 1)) ? void 0 : c,
            priceDetails: (c = b.getPriceDetails()) && Y.moneta
                .integrator.common.purchaseorder.PriceDetails.toObject(
                    a, c),
            servicePeriod: (c = Q(b, Y.moneta.integrator.common
                    .purchaseorder.ServicePeriod, 3)) &&
                Y.moneta.integrator.common.purchaseorder.ServicePeriod
                .toObject(a, c)
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.purchaseorder
    .UnitLevelState.ObjectFormat = function () {}, Y.moneta.integrator
    .common.purchaseorder.UnitLevelState.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.purchaseorder.UnitLevelState;
        null != a.quantity && P(b, 1, a.quantity);
        a.priceDetails && S(b, 2, Y.moneta.integrator.common.purchaseorder
            .PriceDetails.fromObject(a.priceDetails));
        a.servicePeriod && S(b, 3, Y.moneta.integrator.common.purchaseorder
            .ServicePeriod.fromObject(a.servicePeriod));
        return b
    });
Y.moneta.integrator.common.purchaseorder.UnitLevelState.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.common.purchaseorder.UnitLevelState
            .deserializeBinaryFromReader(new Y.moneta.integrator.common
                .purchaseorder.UnitLevelState, new C(a))
    };
Y.moneta.integrator.common.purchaseorder.UnitLevelState
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readInt32();
                a.setQuantity(c);
                break;
            case 2:
                c = new Y.moneta.integrator.common.purchaseorder
                    .PriceDetails;
                b.readMessage(c, Y.moneta.integrator.common.purchaseorder
                    .PriceDetails.deserializeBinaryFromReader);
                a.setPriceDetails(c);
                break;
            case 3:
                c = new Y.moneta.integrator.common.purchaseorder
                    .ServicePeriod;
                b.readMessage(c, Y.moneta.integrator.common.purchaseorder
                    .ServicePeriod.deserializeBinaryFromReader);
                S(a, 3, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.purchaseorder.UnitLevelState
    .serializeBinaryToWriter = function (a, b) {
        var c = O(a, 1);
        null != c && b.writeInt32(1, c);
        c = a.getPriceDetails();
        null != c && J(b, 2, c, Y.moneta.integrator.common.purchaseorder
            .PriceDetails.serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.common.purchaseorder.ServicePeriod, 3);
        null != c && J(b, 3, c, Y.moneta.integrator.common.purchaseorder
            .ServicePeriod.serializeBinaryToWriter)
    };
Y.moneta.integrator.common.purchaseorder.UnitLevelState.prototype.setQuantity =
    function (a) {
        P(this, 1, a)
    };
Y.moneta.integrator.common.purchaseorder.UnitLevelState.prototype
    .getPriceDetails = function () {
        return Q(this, Y.moneta.integrator.common.purchaseorder.PriceDetails, 2)
    };
Y.moneta.integrator.common.purchaseorder.UnitLevelState.prototype
    .setPriceDetails = function (a) {
        S(this, 2, a)
    };
Y.moneta.integrator.common.purchaseorder.UnitLevelState.deserialize = function (
    a) {
    return X(Y.moneta.integrator.common.purchaseorder.UnitLevelState, a)
};
Y.moneta.integrator.common.purchaseorder.LineItem = function (a) {
    M(this, a, -1, Y.moneta.integrator.common.purchaseorder.LineItem
        .repeatedFields_, null)
};
k.inherits(Y.moneta.integrator.common.purchaseorder.LineItem, L);
Y.moneta.integrator.common.purchaseorder.LineItem.repeatedFields_ = [4];
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.purchaseorder.LineItem
    .prototype.toObject = function (a) {
        return Y.moneta.integrator.common.purchaseorder.LineItem.toObject(a,
            this)
    }, Y.moneta.integrator.common.purchaseorder.LineItem.toObject =
    function (a, b) {
        var c, f = {
            lineItemIndex: null == (c = O(b, 1)) ? void 0 : c,
            billableService: null == (c = O(b, 21)) ? void 0 : c,
            purchaseState: null == (c = O(b, 2)) ? void 0 : c,
            lastModifiedTimeMillis: null == (c = O(b, 3)) ? void 0 : c,
            lineItemEventList: N(R(b, Y.moneta.integrator.common
                    .purchaseorder.LineItemEvent,
                    4), Y.moneta.integrator.common.purchaseorder
                .LineItemEvent.toObject, a),
            stockKeepingUnit: null == (c = O(b, 5)) ? void 0 : c,
            purchaseProcessingState: null == (c = O(b, 6)) ? void 0 : c,
            amount: (c = b.getAmount()) && Y.moneta.integrator.common
                .Amount.toObject(a, c),
            amountIncludesTax: null == (c = wc(b, 19)) ? void 0 : c,
            quantity: null == (c = O(b, 8)) ? void 0 : c,
            subscriptionDetails: (c = Q(b, Y.moneta.integrator.common
                    .purchaseorder.SubscriptionDetails, 15)) && Y.moneta
                .integrator.common.purchaseorder.SubscriptionDetails
                .toObject(a, c),
            priceDetails: (c =
                    b.getPriceDetails()) && Y.moneta.integrator.common
                .purchaseorder.PriceDetails.toObject(a, c),
            canceledUnits: (c = Q(b, Y.moneta.integrator.common
                    .purchaseorder.UnitLevelState, 10)) && Y.moneta
                .integrator.common.purchaseorder.UnitLevelState
                .toObject(a, c),
            chargeableUnits: (c = Q(b, Y.moneta.integrator.common
                    .purchaseorder.UnitLevelState, 11)) && Y.moneta
                .integrator.common.purchaseorder.UnitLevelState
                .toObject(a, c),
            chargedUnits: (c = Q(b, Y.moneta.integrator.common
                    .purchaseorder.UnitLevelState, 12)) && Y.moneta
                .integrator.common.purchaseorder.UnitLevelState
                .toObject(a,
                    c),
            declinedUnits: (c = Q(b, Y.moneta.integrator.common
                    .purchaseorder.UnitLevelState, 13)) && Y.moneta
                .integrator.common.purchaseorder.UnitLevelState
                .toObject(a, c),
            refundedUnits: (c = Q(b, Y.moneta.integrator.common
                    .purchaseorder.UnitLevelState, 14)) && Y.moneta
                .integrator.common.purchaseorder.UnitLevelState
                .toObject(a, c),
            localizedTitle: null == (c = O(b, 16)) ? void 0 : c,
            localizedDescriptionHtml: (c = Q(b, Y.html.SafeHtmlProto,
                17)) && Y.html.SafeHtmlProto.toObject(a, c),
            lineItemType: null == (c = O(b, 18)) ? void 0 : c,
            lineItemAvailability: null ==
                (c = O(b, 20)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.purchaseorder.LineItem
    .ObjectFormat = function () {}, Y.moneta.integrator.common.purchaseorder
    .LineItem.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.purchaseorder.LineItem;
        null != a.lineItemIndex && P(b, 1, a.lineItemIndex);
        null != a.billableService && P(b, 21, a.billableService);
        null != a.purchaseState && P(b, 2, a.purchaseState);
        null != a.lastModifiedTimeMillis && P(b, 3, a
            .lastModifiedTimeMillis);
        a.lineItemEventList && V(b, 4, a.lineItemEventList.map(Y.moneta
            .integrator.common.purchaseorder.LineItemEvent
            .fromObject));
        null != a.stockKeepingUnit && P(b, 5, a.stockKeepingUnit);
        null != a.purchaseProcessingState && P(b, 6, a
            .purchaseProcessingState);
        a.amount && S(b, 7, Y.moneta.integrator.common.Amount.fromObject(a
            .amount));
        null != a.amountIncludesTax && P(b, 19, a.amountIncludesTax);
        null != a.quantity && P(b, 8, a.quantity);
        a.subscriptionDetails && S(b, 15, Y.moneta.integrator.common
            .purchaseorder.SubscriptionDetails.fromObject(a
                .subscriptionDetails));
        a.priceDetails && S(b, 9, Y.moneta.integrator.common.purchaseorder
            .PriceDetails.fromObject(a.priceDetails));
        a.canceledUnits && S(b, 10, Y.moneta.integrator.common.purchaseorder
            .UnitLevelState.fromObject(a.canceledUnits));
        a.chargeableUnits && S(b, 11, Y.moneta.integrator.common
            .purchaseorder.UnitLevelState.fromObject(a.chargeableUnits));
        a.chargedUnits && S(b, 12, Y.moneta.integrator.common.purchaseorder
            .UnitLevelState.fromObject(a.chargedUnits));
        a.declinedUnits && S(b, 13, Y.moneta.integrator.common.purchaseorder
            .UnitLevelState.fromObject(a.declinedUnits));
        a.refundedUnits && S(b, 14, Y.moneta.integrator.common.purchaseorder
            .UnitLevelState.fromObject(a.refundedUnits));
        null != a.localizedTitle && P(b, 16, a.localizedTitle);
        a.localizedDescriptionHtml && S(b, 17, Y.html.SafeHtmlProto
            .fromObject(a.localizedDescriptionHtml));
        null != a.lineItemType && P(b, 18, a.lineItemType);
        null != a.lineItemAvailability && P(b, 20, a.lineItemAvailability);
        return b
    });
Y.moneta.integrator.common.purchaseorder.LineItem.deserializeBinary = function (
    a) {
    return Y.moneta.integrator.common.purchaseorder.LineItem
        .deserializeBinaryFromReader(new Y.moneta.integrator.common
            .purchaseorder.LineItem, new C(a))
};
Y.moneta.integrator.common.purchaseorder.LineItem.deserializeBinaryFromReader =
    function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readInt32();
                a.setLineItemIndex(c);
                break;
            case 21:
                c = b.readInt32();
                a.setBillableService(c);
                break;
            case 2:
                c = b.readEnum();
                P(a, 2, c);
                break;
            case 3:
                c = b.readInt64();
                P(a, 3, c);
                break;
            case 4:
                c = new Y.moneta.integrator.common.purchaseorder
                    .LineItemEvent;
                b.readMessage(c, Y.moneta.integrator.common.purchaseorder
                    .LineItemEvent.deserializeBinaryFromReader);
                W(a, 4, c, Y.moneta.integrator.common.purchaseorder
                    .LineItemEvent);
                break;
            case 5:
                c = b.readString();
                P(a, 5, c);
                break;
            case 6:
                c = b.readEnum();
                P(a, 6, c);
                break;
            case 7:
                c = new Y.moneta.integrator.common.Amount;
                b.readMessage(c, Y.moneta.integrator.common.Amount
                    .deserializeBinaryFromReader);
                a.setAmount(c);
                break;
            case 19:
                c = b.readBool();
                P(a, 19, c);
                break;
            case 8:
                c = b.readInt32();
                a.setQuantity(c);
                break;
            case 15:
                c = new Y.moneta.integrator.common.purchaseorder
                    .SubscriptionDetails;
                b.readMessage(c, Y.moneta.integrator.common.purchaseorder
                    .SubscriptionDetails.deserializeBinaryFromReader);
                S(a, 15,
                    c);
                break;
            case 9:
                c = new Y.moneta.integrator.common.purchaseorder
                    .PriceDetails;
                b.readMessage(c, Y.moneta.integrator.common.purchaseorder
                    .PriceDetails.deserializeBinaryFromReader);
                a.setPriceDetails(c);
                break;
            case 10:
                c = new Y.moneta.integrator.common.purchaseorder
                    .UnitLevelState;
                b.readMessage(c, Y.moneta.integrator.common.purchaseorder
                    .UnitLevelState.deserializeBinaryFromReader);
                S(a, 10, c);
                break;
            case 11:
                c = new Y.moneta.integrator.common.purchaseorder
                    .UnitLevelState;
                b.readMessage(c, Y.moneta.integrator.common.purchaseorder
                    .UnitLevelState.deserializeBinaryFromReader);
                S(a, 11, c);
                break;
            case 12:
                c = new Y.moneta.integrator.common.purchaseorder
                    .UnitLevelState;
                b.readMessage(c, Y.moneta.integrator.common.purchaseorder
                    .UnitLevelState.deserializeBinaryFromReader);
                S(a, 12, c);
                break;
            case 13:
                c = new Y.moneta.integrator.common.purchaseorder
                    .UnitLevelState;
                b.readMessage(c, Y.moneta.integrator.common.purchaseorder
                    .UnitLevelState.deserializeBinaryFromReader);
                S(a, 13, c);
                break;
            case 14:
                c = new Y.moneta.integrator.common.purchaseorder
                    .UnitLevelState;
                b.readMessage(c, Y.moneta.integrator.common.purchaseorder
                    .UnitLevelState.deserializeBinaryFromReader);
                S(a, 14, c);
                break;
            case 16:
                c = b.readString();
                P(a, 16, c);
                break;
            case 17:
                c = new Y.html.SafeHtmlProto;
                b.readMessage(c, Y.html.SafeHtmlProto
                    .deserializeBinaryFromReader);
                S(a, 17, c);
                break;
            case 18:
                c = b.readEnum();
                a.setLineItemType(c);
                break;
            case 20:
                c = b.readEnum();
                P(a, 20, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.purchaseorder.LineItem.serializeBinaryToWriter =
    function (a, b) {
        var c = O(a, 1);
        null != c && b.writeInt32(1, c);
        c = O(a, 21);
        null != c && b.writeInt32(21, c);
        c = O(a, 2);
        null != c && b.writeEnum(2, c);
        c = O(a, 3);
        null != c && b.writeInt64(3, c);
        c = R(a, Y.moneta.integrator.common.purchaseorder.LineItemEvent, 4);
        0 < c.length && K(b, 4, c, Y.moneta.integrator.common.purchaseorder
            .LineItemEvent.serializeBinaryToWriter);
        c = O(a, 5);
        null != c && b.writeString(5, c);
        c = O(a, 6);
        null != c && b.writeEnum(6, c);
        c = a.getAmount();
        null != c && J(b,
            7, c, Y.moneta.integrator.common.Amount.serializeBinaryToWriter);
        c = O(a, 19);
        null != c && b.writeBool(19, c);
        c = O(a, 8);
        null != c && b.writeInt32(8, c);
        c = Q(a, Y.moneta.integrator.common.purchaseorder.SubscriptionDetails,
            15);
        null != c && J(b, 15, c, Y.moneta.integrator.common.purchaseorder
            .SubscriptionDetails.serializeBinaryToWriter);
        c = a.getPriceDetails();
        null != c && J(b, 9, c, Y.moneta.integrator.common.purchaseorder
            .PriceDetails.serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.common.purchaseorder.UnitLevelState, 10);
        null !=
            c && J(b, 10, c, Y.moneta.integrator.common.purchaseorder
                .UnitLevelState.serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.common.purchaseorder.UnitLevelState, 11);
        null != c && J(b, 11, c, Y.moneta.integrator.common.purchaseorder
            .UnitLevelState.serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.common.purchaseorder.UnitLevelState, 12);
        null != c && J(b, 12, c, Y.moneta.integrator.common.purchaseorder
            .UnitLevelState.serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.common.purchaseorder.UnitLevelState, 13);
        null != c && J(b,
            13, c, Y.moneta.integrator.common.purchaseorder.UnitLevelState
            .serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.common.purchaseorder.UnitLevelState, 14);
        null != c && J(b, 14, c, Y.moneta.integrator.common.purchaseorder
            .UnitLevelState.serializeBinaryToWriter);
        c = O(a, 16);
        null != c && b.writeString(16, c);
        c = Q(a, Y.html.SafeHtmlProto, 17);
        null != c && J(b, 17, c, Y.html.SafeHtmlProto.serializeBinaryToWriter);
        c = O(a, 18);
        null != c && b.writeEnum(18, c);
        c = O(a, 20);
        null != c && b.writeEnum(20, c)
    };
d = Y.moneta.integrator.common.purchaseorder.LineItem.prototype;
d.setLineItemIndex = function (a) {
    P(this, 1, a)
};
d.setBillableService = function (a) {
    P(this, 21, a)
};
d.getAmount = function () {
    return Q(this, Y.moneta.integrator.common.Amount, 7)
};
d.setAmount = function (a) {
    S(this, 7, a)
};
d.setQuantity = function (a) {
    P(this, 8, a)
};
d.getPriceDetails = function () {
    return Q(this, Y.moneta.integrator.common.purchaseorder.PriceDetails, 9)
};
d.setPriceDetails = function (a) {
    S(this, 9, a)
};
d.setLineItemType = function (a) {
    P(this, 18, a)
};
Y.moneta.integrator.common.purchaseorder.LineItem.deserialize = function (a) {
    return X(Y.moneta.integrator.common.purchaseorder.LineItem, a)
};
Y.moneta.integrator.common.purchaseorder.PlayOrderId = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.common.purchaseorder.PlayOrderId, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.purchaseorder.PlayOrderId
    .prototype.toObject = function (a) {
        return Y.moneta.integrator.common.purchaseorder.PlayOrderId
            .toObject(a, this)
    }, Y.moneta.integrator.common.purchaseorder.PlayOrderId.toObject =
    function (a, b) {
        var c, f = {
            orderId: null == (c = O(b, 1)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.purchaseorder.PlayOrderId
    .ObjectFormat = function () {}, Y.moneta.integrator.common.purchaseorder
    .PlayOrderId.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.purchaseorder.PlayOrderId;
        null != a.orderId && P(b, 1, a.orderId);
        return b
    });
Y.moneta.integrator.common.purchaseorder.PlayOrderId.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.common.purchaseorder.PlayOrderId
            .deserializeBinaryFromReader(new Y.moneta.integrator.common
                .purchaseorder.PlayOrderId, new C(a))
    };
Y.moneta.integrator.common.purchaseorder.PlayOrderId
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readString();
                P(a, 1, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.purchaseorder.PlayOrderId.serializeBinaryToWriter =
    function (a, b) {
        a = O(a, 1);
        null != a && b.writeString(1, a)
    };
Y.moneta.integrator.common.purchaseorder.PlayOrderId.deserialize = function (
a) {
    return X(Y.moneta.integrator.common.purchaseorder.PlayOrderId, a)
};
Y.moneta.integrator.common.purchaseorder.PurchaseOrder = function (a) {
    M(this, a, -1, Y.moneta.integrator.common.purchaseorder.PurchaseOrder
        .repeatedFields_, Y.moneta.integrator.common.purchaseorder
        .PurchaseOrder.oneofGroups_)
};
k.inherits(Y.moneta.integrator.common.purchaseorder.PurchaseOrder, L);
Y.moneta.integrator.common.purchaseorder.PurchaseOrder.repeatedFields_ = [6, 8];
Y.moneta.integrator.common.purchaseorder.PurchaseOrder.oneofGroups_ = [
    [10]
];
Y.moneta.integrator.common.purchaseorder.PurchaseOrder.ProxyIdCase = {
    PROXY_ID_NOT_SET: 0,
    PLAY_ORDER_ID: 10
};
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.common.purchaseorder.PurchaseOrder
    .prototype.toObject = function (a) {
        return Y.moneta.integrator.common.purchaseorder.PurchaseOrder
            .toObject(a, this)
    }, Y.moneta.integrator.common.purchaseorder.PurchaseOrder.toObject =
    function (a, b) {
        var c, f = {
            purchaseOrderId: (c = Lc(b)) && Y.moneta.integrator.common
                .PurchaseOrderId.toObject(a, c),
            creationTimeMillis: null == (c = O(b, 2)) ? void 0 : c,
            initiatingUserGaiaId: null == (c = O(b, 5)) ? void 0 : c,
            lineItemList: N(R(b, Y.moneta.integrator.common
                    .purchaseorder.LineItem,
                    6), Y.moneta.integrator.common.purchaseorder
                .LineItem.toObject, a),
            externalPurchaseOrderId: null == (c = O(b, 7)) ? void 0 : c,
            chargebackList: N(R(b, Y.moneta.integrator.common
                    .purchaseorder.Chargeback, 8), Y.moneta
                .integrator.common.purchaseorder.Chargeback
                .toObject, a),
            additionalFundingSourceUsed: null == (c = wc(b, 9)) ?
                void 0 : c,
            playOrderId: (c = Q(b, Y.moneta.integrator.common
                    .purchaseorder.PlayOrderId, 10)) && Y.moneta
                .integrator.common.purchaseorder.PlayOrderId.toObject(a,
                    c)
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.common.purchaseorder
    .PurchaseOrder.ObjectFormat = function () {}, Y.moneta.integrator.common
    .purchaseorder.PurchaseOrder.fromObject = function (a) {
        var b = new Y.moneta.integrator.common.purchaseorder.PurchaseOrder;
        a.purchaseOrderId && S(b, 1, Y.moneta.integrator.common
            .PurchaseOrderId.fromObject(a.purchaseOrderId));
        null != a.creationTimeMillis && P(b, 2, a.creationTimeMillis);
        null != a.initiatingUserGaiaId && P(b, 5, a.initiatingUserGaiaId);
        a.lineItemList && V(b, 6, a.lineItemList.map(Y.moneta.integrator
            .common.purchaseorder.LineItem.fromObject));
        null != a.externalPurchaseOrderId && P(b, 7, a
            .externalPurchaseOrderId);
        a.chargebackList && V(b, 8, a.chargebackList.map(Y.moneta.integrator
            .common.purchaseorder.Chargeback.fromObject));
        null != a.additionalFundingSourceUsed && P(b, 9, a
            .additionalFundingSourceUsed);
        a.playOrderId && S(b, 10, Y.moneta.integrator.common.purchaseorder
            .PlayOrderId.fromObject(a.playOrderId));
        return b
    });
Y.moneta.integrator.common.purchaseorder.PurchaseOrder.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.common.purchaseorder.PurchaseOrder
            .deserializeBinaryFromReader(new Y.moneta.integrator.common
                .purchaseorder.PurchaseOrder, new C(a))
    };
Y.moneta.integrator.common.purchaseorder.PurchaseOrder
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = new Y.moneta.integrator.common.PurchaseOrderId;
                b.readMessage(c, Y.moneta.integrator.common.PurchaseOrderId
                    .deserializeBinaryFromReader);
                a.setPurchaseOrderId(c);
                break;
            case 2:
                c = b.readInt64();
                a.setCreationTimeMillis(c);
                break;
            case 5:
                c = b.readInt64();
                P(a, 5, c);
                break;
            case 6:
                c = new Y.moneta.integrator.common.purchaseorder.LineItem;
                b.readMessage(c, Y.moneta.integrator.common.purchaseorder
                    .LineItem.deserializeBinaryFromReader);
                W(a, 6, c, Y.moneta.integrator.common.purchaseorder
                    .LineItem);
                break;
            case 7:
                c = b.readString();
                a.setExternalPurchaseOrderId(c);
                break;
            case 8:
                c = new Y.moneta.integrator.common.purchaseorder.Chargeback;
                b.readMessage(c, Y.moneta.integrator.common.purchaseorder
                    .Chargeback.deserializeBinaryFromReader);
                W(a, 8, c, Y.moneta.integrator.common.purchaseorder
                    .Chargeback);
                break;
            case 9:
                c = b.readBool();
                P(a, 9, c);
                break;
            case 10:
                c = new Y.moneta.integrator.common.purchaseorder
                .PlayOrderId;
                b.readMessage(c, Y.moneta.integrator.common.purchaseorder
                    .PlayOrderId.deserializeBinaryFromReader);
                U(a, 10, Y.moneta.integrator.common.purchaseorder
                    .PurchaseOrder.oneofGroups_[0], c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.common.purchaseorder.PurchaseOrder.serializeBinaryToWriter =
    function (a, b) {
        var c = Lc(a);
        null != c && J(b, 1, c, Y.moneta.integrator.common.PurchaseOrderId
            .serializeBinaryToWriter);
        c = O(a, 2);
        null != c && b.writeInt64(2, c);
        c = O(a, 5);
        null != c && b.writeInt64(5, c);
        c = R(a, Y.moneta.integrator.common.purchaseorder.LineItem, 6);
        0 < c.length && K(b, 6, c, Y.moneta.integrator.common.purchaseorder
            .LineItem.serializeBinaryToWriter);
        c = O(a, 7);
        null != c && b.writeString(7, c);
        c = R(a, Y.moneta.integrator.common.purchaseorder.Chargeback,
            8);
        0 < c.length && K(b, 8, c, Y.moneta.integrator.common.purchaseorder
            .Chargeback.serializeBinaryToWriter);
        c = O(a, 9);
        null != c && b.writeBool(9, c);
        c = Q(a, Y.moneta.integrator.common.purchaseorder.PlayOrderId, 10);
        null != c && J(b, 10, c, Y.moneta.integrator.common.purchaseorder
            .PlayOrderId.serializeBinaryToWriter)
    };
var Lc = function (a) {
    return Q(a, Y.moneta.integrator.common.PurchaseOrderId, 1)
};
Y.moneta.integrator.common.purchaseorder.PurchaseOrder.prototype
    .setPurchaseOrderId = function (a) {
        S(this, 1, a)
    };
Y.moneta.integrator.common.purchaseorder.PurchaseOrder.prototype
    .setCreationTimeMillis = function (a) {
        P(this, 2, a)
    };
Y.moneta.integrator.common.purchaseorder.PurchaseOrder.prototype
    .getExternalPurchaseOrderId = function () {
        return O(this, 7)
    };
Y.moneta.integrator.common.purchaseorder.PurchaseOrder.prototype
    .setExternalPurchaseOrderId = function (a) {
        P(this, 7, a)
    };
Y.moneta.integrator.common.purchaseorder.PurchaseOrder.deserialize = function (
    a) {
    return X(Y.moneta.integrator.common.purchaseorder.PurchaseOrder, a)
};
Y.moneta.integrator.ui.buyflow.PurchaseApprovalInfo = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.ui.buyflow.PurchaseApprovalInfo, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.ui.buyflow.PurchaseApprovalInfo
    .prototype.toObject = function (a) {
        return Y.moneta.integrator.ui.buyflow.PurchaseApprovalInfo.toObject(
            a, this)
    }, Y.moneta.integrator.ui.buyflow.PurchaseApprovalInfo.toObject =
    function (a, b) {
        var c, f = {
            state: null == (c = O(b, 1)) ? void 0 : c,
            approverGaiaId: null == (c = O(b, 2)) ? void 0 : c
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.ui.buyflow.PurchaseApprovalInfo
    .ObjectFormat = function () {}, Y.moneta.integrator.ui.buyflow
    .PurchaseApprovalInfo.fromObject = function (a) {
        var b = new Y.moneta.integrator.ui.buyflow.PurchaseApprovalInfo;
        null != a.state && P(b, 1, a.state);
        null != a.approverGaiaId && P(b, 2, a.approverGaiaId);
        return b
    });
Y.moneta.integrator.ui.buyflow.PurchaseApprovalInfo.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.ui.buyflow.PurchaseApprovalInfo
            .deserializeBinaryFromReader(new Y.moneta.integrator.ui.buyflow
                .PurchaseApprovalInfo, new C(a))
    };
Y.moneta.integrator.ui.buyflow.PurchaseApprovalInfo
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readEnum();
                P(a, 1, c);
                break;
            case 2:
                c = b.readInt64();
                P(a, 2, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.ui.buyflow.PurchaseApprovalInfo.serializeBinaryToWriter =
    function (a, b) {
        var c = O(a, 1);
        null != c && b.writeEnum(1, c);
        c = O(a, 2);
        null != c && b.writeInt64(2, c)
    };
Y.moneta.integrator.ui.buyflow.PurchaseApprovalInfo.State = {
    UNKNOWN: 0,
    PENDING_APPROVAL: 1,
    APPROVED: 2,
    DENIED: 3
};
Y.moneta.integrator.ui.buyflow.PurchaseApprovalInfo.prototype.getState =
    function () {
        return O(this, 1)
    };
Y.moneta.integrator.ui.buyflow.PurchaseApprovalInfo.deserialize = function (a) {
    return X(Y.moneta.integrator.ui.buyflow.PurchaseApprovalInfo, a)
};
Y.moneta.integrator.ui.buyflow.ManagedPurchaseCallbackData = function (a) {
    M(this, a, -1, null, null)
};
k.inherits(Y.moneta.integrator.ui.buyflow.ManagedPurchaseCallbackData, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.ui.buyflow
    .ManagedPurchaseCallbackData.prototype.toObject = function (a) {
        return Y.moneta.integrator.ui.buyflow.ManagedPurchaseCallbackData
            .toObject(a, this)
    }, Y.moneta.integrator.ui.buyflow.ManagedPurchaseCallbackData.toObject =
    function (a, b) {
        var c, f = {
            integratorSessionData: xc(b.getIntegratorSessionData()),
            purchaseOrderId: (c = Lc(b)) && Y.moneta.integrator.common
                .PurchaseOrderId.toObject(a, c),
            externalPurchaseOrderId: null == (c = O(b, 3)) ? void 0 : c,
            purchaseOrder: (c = Q(b, Y.moneta.integrator.common
                    .purchaseorder.PurchaseOrder,
                    4)) && Y.moneta.integrator.common.purchaseorder
                .PurchaseOrder.toObject(a, c),
            billingCustomerNumber: null == (c = O(b, 5)) ? void 0 : c,
            guestEmailAddress: null == (c = O(b, 6)) ? void 0 : c,
            customSectionDetailsValue: (c = Q(b, Y.moneta.integrator
                    .common.buyflow.CustomSectionDetailsValue, 7)) && Y
                .moneta.integrator.common.buyflow
                .CustomSectionDetailsValue.toObject(a, c),
            approvalInfo: (c = Q(b, Y.moneta.integrator.ui.buyflow
                    .PurchaseApprovalInfo, 8)) && Y.moneta.integrator.ui
                .buyflow.PurchaseApprovalInfo.toObject(a, c),
            integratorDisplayTitle: null ==
                (c = O(b, 9)) ? void 0 : c,
            integratorDisplayMessage: null == (c = O(b, 10)) ? void 0 :
                c,
            selectedShippingDetails: (c = b
                .getSelectedShippingDetails()) && Y.moneta.integrator
                .common.buyflow.SelectedShippingDetails.toObject(a, c)
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.ui.buyflow
    .ManagedPurchaseCallbackData.ObjectFormat = function () {}, Y.moneta
    .integrator.ui.buyflow.ManagedPurchaseCallbackData.fromObject =
    function (a) {
        var b = new Y.moneta.integrator.ui.buyflow
            .ManagedPurchaseCallbackData;
        null != a.integratorSessionData && P(b, 2, a.integratorSessionData);
        a.purchaseOrderId && S(b, 1, Y.moneta.integrator.common
            .PurchaseOrderId.fromObject(a.purchaseOrderId));
        null != a.externalPurchaseOrderId && P(b, 3, a
            .externalPurchaseOrderId);
        a.purchaseOrder &&
            S(b, 4, Y.moneta.integrator.common.purchaseorder.PurchaseOrder
                .fromObject(a.purchaseOrder));
        null != a.billingCustomerNumber && P(b, 5, a.billingCustomerNumber);
        null != a.guestEmailAddress && P(b, 6, a.guestEmailAddress);
        a.customSectionDetailsValue && S(b, 7, Y.moneta.integrator.common
            .buyflow.CustomSectionDetailsValue.fromObject(a
                .customSectionDetailsValue));
        a.approvalInfo && S(b, 8, Y.moneta.integrator.ui.buyflow
            .PurchaseApprovalInfo.fromObject(a.approvalInfo));
        null != a.integratorDisplayTitle && P(b, 9, a
            .integratorDisplayTitle);
        null != a.integratorDisplayMessage && P(b, 10, a
            .integratorDisplayMessage);
        a.selectedShippingDetails && S(b, 11, Y.moneta.integrator.common
            .buyflow.SelectedShippingDetails.fromObject(a
                .selectedShippingDetails));
        return b
    });
Y.moneta.integrator.ui.buyflow.ManagedPurchaseCallbackData.deserializeBinary =
    function (a) {
        return Y.moneta.integrator.ui.buyflow.ManagedPurchaseCallbackData
            .deserializeBinaryFromReader(new Y.moneta.integrator.ui.buyflow
                .ManagedPurchaseCallbackData, new C(a))
    };
Y.moneta.integrator.ui.buyflow.ManagedPurchaseCallbackData
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 2:
                var c = b.readBytes();
                a.setIntegratorSessionData(c);
                break;
            case 1:
                c = new Y.moneta.integrator.common.PurchaseOrderId;
                b.readMessage(c, Y.moneta.integrator.common.PurchaseOrderId
                    .deserializeBinaryFromReader);
                a.setPurchaseOrderId(c);
                break;
            case 3:
                c = b.readString();
                a.setExternalPurchaseOrderId(c);
                break;
            case 4:
                c = new Y.moneta.integrator.common.purchaseorder
                    .PurchaseOrder;
                b.readMessage(c, Y.moneta.integrator.common.purchaseorder
                    .PurchaseOrder.deserializeBinaryFromReader);
                S(a, 4, c);
                break;
            case 5:
                c = b.readInt64String();
                a.setBillingCustomerNumber(c);
                break;
            case 6:
                c = b.readString();
                a.setGuestEmailAddress(c);
                break;
            case 7:
                c = new Y.moneta.integrator.common.buyflow
                    .CustomSectionDetailsValue;
                b.readMessage(c, Y.moneta.integrator.common.buyflow
                    .CustomSectionDetailsValue
                    .deserializeBinaryFromReader);
                S(a, 7, c);
                break;
            case 8:
                c = new Y.moneta.integrator.ui.buyflow.PurchaseApprovalInfo;
                b.readMessage(c,
                    Y.moneta.integrator.ui.buyflow.PurchaseApprovalInfo
                    .deserializeBinaryFromReader);
                S(a, 8, c);
                break;
            case 9:
                c = b.readString();
                P(a, 9, c);
                break;
            case 10:
                c = b.readString();
                P(a, 10, c);
                break;
            case 11:
                c = new Y.moneta.integrator.common.buyflow
                    .SelectedShippingDetails;
                b.readMessage(c, Y.moneta.integrator.common.buyflow
                    .SelectedShippingDetails.deserializeBinaryFromReader
                    );
                a.setSelectedShippingDetails(c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.ui.buyflow.ManagedPurchaseCallbackData
    .serializeBinaryToWriter = function (a, b) {
        var c = O(a, 2);
        null != c && b.writeBytes(2, c);
        c = Lc(a);
        null != c && J(b, 1, c, Y.moneta.integrator.common.PurchaseOrderId
            .serializeBinaryToWriter);
        c = O(a, 3);
        null != c && b.writeString(3, c);
        c = Q(a, Y.moneta.integrator.common.purchaseorder.PurchaseOrder, 4);
        null != c && J(b, 4, c, Y.moneta.integrator.common.purchaseorder
            .PurchaseOrder.serializeBinaryToWriter);
        c = O(a, 5);
        null != c && b.writeInt64String(5, c);
        c = O(a, 6);
        null != c && b.writeString(6,
            c);
        c = Q(a, Y.moneta.integrator.common.buyflow.CustomSectionDetailsValue,
            7);
        null != c && J(b, 7, c, Y.moneta.integrator.common.buyflow
            .CustomSectionDetailsValue.serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.ui.buyflow.PurchaseApprovalInfo, 8);
        null != c && J(b, 8, c, Y.moneta.integrator.ui.buyflow
            .PurchaseApprovalInfo.serializeBinaryToWriter);
        c = O(a, 9);
        null != c && b.writeString(9, c);
        c = O(a, 10);
        null != c && b.writeString(10, c);
        c = a.getSelectedShippingDetails();
        null != c && J(b, 11, c, Y.moneta.integrator.common.buyflow
            .SelectedShippingDetails.serializeBinaryToWriter)
    };
d = Y.moneta.integrator.ui.buyflow.ManagedPurchaseCallbackData.prototype;
d.getIntegratorSessionData = function () {
    return O(this, 2)
};
d.setIntegratorSessionData = function (a) {
    P(this, 2, a)
};
d.setPurchaseOrderId = function (a) {
    S(this, 1, a)
};
d.getExternalPurchaseOrderId = function () {
    return O(this, 3)
};
d.setExternalPurchaseOrderId = function (a) {
    P(this, 3, a)
};
d.setBillingCustomerNumber = function (a) {
    P(this, 5, a)
};
d.setGuestEmailAddress = function (a) {
    P(this, 6, a)
};
d.getSelectedShippingDetails = function () {
    return Q(this, Y.moneta.integrator.common.buyflow
        .SelectedShippingDetails, 11)
};
d.setSelectedShippingDetails = function (a) {
    S(this, 11, a)
};
Y.moneta.integrator.ui.buyflow.ManagedPurchaseCallbackData.deserialize =
    function (a) {
        return X(Y.moneta.integrator.ui.buyflow.ManagedPurchaseCallbackData, a)
    };
Y.moneta.integrator.callbacks.buyflowcomplete = {};
Y.moneta.integrator.callbacks.buyflowcomplete.BuyFlowCompleteRequest =
    function (a) {
        M(this, a, -1, null, Y.moneta.integrator.callbacks.buyflowcomplete
            .BuyFlowCompleteRequest.oneofGroups_)
    };
k.inherits(Y.moneta.integrator.callbacks.buyflowcomplete.BuyFlowCompleteRequest,
    L);
Y.moneta.integrator.callbacks.buyflowcomplete.BuyFlowCompleteRequest
    .oneofGroups_ = [
        [2, 3]
    ];
Y.moneta.integrator.callbacks.buyflowcomplete.BuyFlowCompleteRequest
    .CallbackDataCase = {
        CALLBACK_DATA_NOT_SET: 0,
        FUNDS_GUARANTEE_CALLBACK_DATA: 2,
        MANAGED_PURCHASE_CALLBACK_DATA: 3
    };
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.callbacks.buyflowcomplete
    .BuyFlowCompleteRequest.prototype.toObject = function (a) {
        return Y.moneta.integrator.callbacks.buyflowcomplete
            .BuyFlowCompleteRequest.toObject(a, this)
    }, Y.moneta.integrator.callbacks.buyflowcomplete.BuyFlowCompleteRequest
    .toObject = function (a, b) {
        var c, f = {
            requestHeader: (c = Q(b, Y.moneta.integrator.callbacks
                    .common.CallbackRequestHeader, 1)) && Y.moneta
                .integrator.callbacks.common.CallbackRequestHeader
                .toObject(a, c),
            fundsGuaranteeCallbackData: (c =
                    Q(b, Y.moneta.integrator.ui.buyflow
                        .FundsGuaranteeCallbackData, 2)) && Y.moneta
                .integrator.ui.buyflow.FundsGuaranteeCallbackData
                .toObject(a, c),
            managedPurchaseCallbackData: (c = Q(b, Y.moneta.integrator
                    .ui.buyflow.ManagedPurchaseCallbackData, 3)) && Y
                .moneta.integrator.ui.buyflow
                .ManagedPurchaseCallbackData.toObject(a, c)
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.callbacks.buyflowcomplete
    .BuyFlowCompleteRequest.ObjectFormat = function () {}, Y.moneta
    .integrator.callbacks.buyflowcomplete.BuyFlowCompleteRequest
    .fromObject = function (a) {
        var b = new Y.moneta.integrator.callbacks.buyflowcomplete
            .BuyFlowCompleteRequest;
        a.requestHeader && S(b, 1, Y.moneta.integrator.callbacks.common
            .CallbackRequestHeader.fromObject(a.requestHeader));
        a.fundsGuaranteeCallbackData && S(b, 2, Y.moneta.integrator.ui
            .buyflow.FundsGuaranteeCallbackData.fromObject(a
                .fundsGuaranteeCallbackData));
        a.managedPurchaseCallbackData && S(b, 3, Y.moneta.integrator.ui
            .buyflow.ManagedPurchaseCallbackData.fromObject(a
                .managedPurchaseCallbackData));
        return b
    });
Y.moneta.integrator.callbacks.buyflowcomplete.BuyFlowCompleteRequest
    .deserializeBinary = function (a) {
        return Y.moneta.integrator.callbacks.buyflowcomplete
            .BuyFlowCompleteRequest.deserializeBinaryFromReader(new Y.moneta
                .integrator.callbacks.buyflowcomplete.BuyFlowCompleteRequest,
                new C(a))
    };
Y.moneta.integrator.callbacks.buyflowcomplete.BuyFlowCompleteRequest
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = new Y.moneta.integrator.callbacks.common
                    .CallbackRequestHeader;
                b.readMessage(c, Y.moneta.integrator.callbacks.common
                    .CallbackRequestHeader.deserializeBinaryFromReader);
                a.setRequestHeader(c);
                break;
            case 2:
                c = new Y.moneta.integrator.ui.buyflow
                    .FundsGuaranteeCallbackData;
                b.readMessage(c, Y.moneta.integrator.ui.buyflow
                    .FundsGuaranteeCallbackData
                    .deserializeBinaryFromReader);
                U(a, 2, Y.moneta.integrator.callbacks.buyflowcomplete
                    .BuyFlowCompleteRequest.oneofGroups_[0], c);
                break;
            case 3:
                c = new Y.moneta.integrator.ui.buyflow
                    .ManagedPurchaseCallbackData;
                b.readMessage(c, Y.moneta.integrator.ui.buyflow
                    .ManagedPurchaseCallbackData
                    .deserializeBinaryFromReader);
                U(a, 3, Y.moneta.integrator.callbacks.buyflowcomplete
                    .BuyFlowCompleteRequest.oneofGroups_[0], c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.callbacks.buyflowcomplete.BuyFlowCompleteRequest
    .serializeBinaryToWriter = function (a, b) {
        var c = Q(a, Y.moneta.integrator.callbacks.common.CallbackRequestHeader,
            1);
        null != c && J(b, 1, c, Y.moneta.integrator.callbacks.common
            .CallbackRequestHeader.serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.ui.buyflow.FundsGuaranteeCallbackData, 2);
        null != c && J(b, 2, c, Y.moneta.integrator.ui.buyflow
            .FundsGuaranteeCallbackData.serializeBinaryToWriter);
        c = Q(a, Y.moneta.integrator.ui.buyflow.ManagedPurchaseCallbackData,
            3);
        null != c && J(b, 3, c, Y.moneta.integrator.ui.buyflow
            .ManagedPurchaseCallbackData.serializeBinaryToWriter)
    };
Y.moneta.integrator.callbacks.buyflowcomplete.BuyFlowCompleteRequest.prototype
    .setRequestHeader = function (a) {
        return S(this, 1, a)
    };
Y.moneta.integrator.callbacks.buyflowcomplete.BuyFlowCompleteRequest
    .deserialize = function (a) {
        return X(Y.moneta.integrator.callbacks.buyflowcomplete
            .BuyFlowCompleteRequest, a)
    };
Y.moneta.integrator.callbacks.buyflowcomplete.BuyFlowCompleteResponse =
    function (a) {
        M(this, a, -1, null, null)
    };
k.inherits(Y.moneta.integrator.callbacks.buyflowcomplete
    .BuyFlowCompleteResponse, L);
Y.moneta.integrator.callbacks.buyflowcomplete.BuyFlowCompleteResponse
    .RetryOverride = function (a) {
        M(this, a, -1, null, null)
    };
k.inherits(Y.moneta.integrator.callbacks.buyflowcomplete.BuyFlowCompleteResponse
    .RetryOverride, L);
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.callbacks.buyflowcomplete
    .BuyFlowCompleteResponse.prototype.toObject = function (a) {
        return Y.moneta.integrator.callbacks.buyflowcomplete
            .BuyFlowCompleteResponse.toObject(a, this)
    }, Y.moneta.integrator.callbacks.buyflowcomplete.BuyFlowCompleteResponse
    .toObject = function (a, b) {
        var c, f = {
            status: null == (c = O(b, 1)) ? void 0 : c,
            errorMessageHtml: (c = Q(b, Y.html.SafeHtmlProto, 2)) && Y
                .html.SafeHtmlProto.toObject(a, c),
            clientCallbackData: xc(O(b, 3)),
            retryOverride: (c = Q(b, Y.moneta.integrator.callbacks
                    .buyflowcomplete.BuyFlowCompleteResponse
                    .RetryOverride,
                    4)) && Y.moneta.integrator.callbacks.buyflowcomplete
                .BuyFlowCompleteResponse.RetryOverride.toObject(a, c)
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.callbacks.buyflowcomplete
    .BuyFlowCompleteResponse.ObjectFormat = function () {}, Y.moneta
    .integrator.callbacks.buyflowcomplete.BuyFlowCompleteResponse
    .fromObject = function (a) {
        var b = new Y.moneta.integrator.callbacks.buyflowcomplete
            .BuyFlowCompleteResponse;
        null != a.status && P(b, 1, a.status);
        a.errorMessageHtml && S(b, 2, Y.html.SafeHtmlProto.fromObject(a
            .errorMessageHtml));
        null != a.clientCallbackData && P(b, 3, a.clientCallbackData);
        a.retryOverride && S(b, 4, Y.moneta.integrator.callbacks
            .buyflowcomplete.BuyFlowCompleteResponse.RetryOverride
            .fromObject(a.retryOverride));
        return b
    });
Y.moneta.integrator.callbacks.buyflowcomplete.BuyFlowCompleteResponse
    .deserializeBinary = function (a) {
        return Y.moneta.integrator.callbacks.buyflowcomplete
            .BuyFlowCompleteResponse.deserializeBinaryFromReader(new Y.moneta
                .integrator.callbacks.buyflowcomplete.BuyFlowCompleteResponse,
                new C(a))
    };
Y.moneta.integrator.callbacks.buyflowcomplete.BuyFlowCompleteResponse
    .deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readEnum();
                a.setStatus(c);
                break;
            case 2:
                c = new Y.html.SafeHtmlProto;
                b.readMessage(c, Y.html.SafeHtmlProto
                    .deserializeBinaryFromReader);
                S(a, 2, c);
                break;
            case 3:
                c = b.readBytes();
                P(a, 3, c);
                break;
            case 4:
                c = new Y.moneta.integrator.callbacks.buyflowcomplete
                    .BuyFlowCompleteResponse.RetryOverride;
                b.readMessage(c, Y.moneta.integrator.callbacks
                    .buyflowcomplete.BuyFlowCompleteResponse
                    .RetryOverride.deserializeBinaryFromReader);
                S(a, 4, c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.callbacks.buyflowcomplete.BuyFlowCompleteResponse
    .serializeBinaryToWriter = function (a, b) {
        var c = O(a, 1);
        null != c && b.writeEnum(1, c);
        c = Q(a, Y.html.SafeHtmlProto, 2);
        null != c && J(b, 2, c, Y.html.SafeHtmlProto.serializeBinaryToWriter);
        c = O(a, 3);
        null != c && b.writeBytes(3, c);
        c = Q(a, Y.moneta.integrator.callbacks.buyflowcomplete
            .BuyFlowCompleteResponse.RetryOverride, 4);
        null != c && J(b, 4, c, Y.moneta.integrator.callbacks.buyflowcomplete
            .BuyFlowCompleteResponse.RetryOverride.serializeBinaryToWriter)
    };
Y.moneta.integrator.callbacks.buyflowcomplete.BuyFlowCompleteResponse.Status = {
    UNKNOWN_STATUS: 0,
    COMPLETE: 1,
    ERROR: 2,
    EXPECTED_ERROR: 3
};
L.GENERATE_TO_OBJECT && (Y.moneta.integrator.callbacks.buyflowcomplete
    .BuyFlowCompleteResponse.RetryOverride.prototype.toObject = function (
    a) {
        return Y.moneta.integrator.callbacks.buyflowcomplete
            .BuyFlowCompleteResponse.RetryOverride.toObject(a, this)
    }, Y.moneta.integrator.callbacks.buyflowcomplete.BuyFlowCompleteResponse
    .RetryOverride.toObject = function (a, b) {
        var c, f = {
            integratorSessionData: xc(b.getIntegratorSessionData()),
            fundsGuaranteeId: (c = b.getFundsGuaranteeId()) && Y.moneta
                .integrator.common.FundsGuaranteeId.toObject(a,
                    c),
            productCorrelationId: (c = b.getProductCorrelationId()) && Y
                .moneta.integrator.common.ProductCorrelationId.toObject(
                    a, c)
        };
        a && (f.$jspbMessageInstance = b);
        return f
    });
L.GENERATE_FROM_OBJECT && (Y.moneta.integrator.callbacks.buyflowcomplete
    .BuyFlowCompleteResponse.RetryOverride.ObjectFormat = function () {}, Y
    .moneta.integrator.callbacks.buyflowcomplete.BuyFlowCompleteResponse
    .RetryOverride.fromObject = function (a) {
        var b = new Y.moneta.integrator.callbacks.buyflowcomplete
            .BuyFlowCompleteResponse.RetryOverride;
        null != a.integratorSessionData && P(b, 1, a.integratorSessionData);
        a.fundsGuaranteeId && S(b, 2, Y.moneta.integrator.common
            .FundsGuaranteeId.fromObject(a.fundsGuaranteeId));
        a.productCorrelationId &&
            S(b, 3, Y.moneta.integrator.common.ProductCorrelationId
                .fromObject(a.productCorrelationId));
        return b
    });
Y.moneta.integrator.callbacks.buyflowcomplete.BuyFlowCompleteResponse
    .RetryOverride.deserializeBinary = function (a) {
        return Y.moneta.integrator.callbacks.buyflowcomplete
            .BuyFlowCompleteResponse.RetryOverride.deserializeBinaryFromReader(
                new Y.moneta.integrator.callbacks.buyflowcomplete
                .BuyFlowCompleteResponse.RetryOverride, new C(a))
    };
Y.moneta.integrator.callbacks.buyflowcomplete.BuyFlowCompleteResponse
    .RetryOverride.deserializeBinaryFromReader = function (a, b) {
        for (; F(b) && !D(b);) switch (b.getFieldNumber()) {
            case 1:
                var c = b.readBytes();
                a.setIntegratorSessionData(c);
                break;
            case 2:
                c = new Y.moneta.integrator.common.FundsGuaranteeId;
                b.readMessage(c, Y.moneta.integrator.common.FundsGuaranteeId
                    .deserializeBinaryFromReader);
                a.setFundsGuaranteeId(c);
                break;
            case 3:
                c = new Y.moneta.integrator.common.ProductCorrelationId;
                b.readMessage(c, Y.moneta.integrator.common
                    .ProductCorrelationId.deserializeBinaryFromReader);
                a.setProductCorrelationId(c);
                break;
            default:
                G(b)
        }
        return a
    };
Y.moneta.integrator.callbacks.buyflowcomplete.BuyFlowCompleteResponse
    .RetryOverride.serializeBinaryToWriter = function (a, b) {
        var c = O(a, 1);
        null != c && b.writeBytes(1, c);
        c = a.getFundsGuaranteeId();
        null != c && J(b, 2, c, Y.moneta.integrator.common.FundsGuaranteeId
            .serializeBinaryToWriter);
        c = a.getProductCorrelationId();
        null != c && J(b, 3, c, Y.moneta.integrator.common.ProductCorrelationId
            .serializeBinaryToWriter)
    };
d = Y.moneta.integrator.callbacks.buyflowcomplete.BuyFlowCompleteResponse
    .RetryOverride.prototype;
d.getIntegratorSessionData = function () {
    return O(this, 1)
};
d.setIntegratorSessionData = function (a) {
    P(this, 1, a)
};
d.getFundsGuaranteeId = function () {
    return Q(this, Y.moneta.integrator.common.FundsGuaranteeId, 2)
};
d.setFundsGuaranteeId = function (a) {
    S(this, 2, a)
};
d.getProductCorrelationId = function () {
    return Q(this, Y.moneta.integrator.common.ProductCorrelationId, 3)
};
d.setProductCorrelationId = function (a) {
    S(this, 3, a)
};
Y.moneta.integrator.callbacks.buyflowcomplete.BuyFlowCompleteResponse
    .RetryOverride.deserialize = function (a) {
        return X(Y.moneta.integrator.callbacks.buyflowcomplete
            .BuyFlowCompleteResponse.RetryOverride, a)
    };
Y.moneta.integrator.callbacks.buyflowcomplete.BuyFlowCompleteResponse.prototype
    .getStatus = function () {
        return O(this, 1)
    };
Y.moneta.integrator.callbacks.buyflowcomplete.BuyFlowCompleteResponse.prototype
    .setStatus = function (a) {
        P(this, 1, a)
    };
Y.moneta.integrator.callbacks.buyflowcomplete.BuyFlowCompleteResponse
    .deserialize = function (a) {
        return X(Y.moneta.integrator.callbacks.buyflowcomplete
            .BuyFlowCompleteResponse, a)
    };
var Z = function () {
    this.licensesCache_ = new hb;
    chrome.runtime.onConnectExternal.addListener(k.bind(this.onConnect_,
        this))
};
e.inherits(Z, aa);
Z.prototype.getWindowBounds = function () {
    return {
        width: 435,
        height: 345
    }
};
var Mc = function (a, b, c, f, g) {
        chrome.identity.getAuthToken({
            interactive: !1
        }, function (h) {
            chrome.app.window.create("/html/craw_window.html", {
                bounds: a.getWindowBounds(),
                frame: "chrome",
                hidden: !1
            }, function (l) {
                c.onDisconnect.addListener(function () {
                    l.close()
                });
                var r = l.contentWindow;
                r.crawConfig_ = new ca(
                    "https://www.google.com/intl/en-US/chrome/blank.html",
                    !1);
                r.iapJwt_ = f;
                r.sku_ = g;
                var v = b.parameters;
                v || (v = {});
                v.userSessionIndex = 0;
                v.fullscreen = !0;
                v.oauthToken = h;
                v.propertyId = "ChromeIAP";
                v.applicationId = c.sender.id;
                r.iapParams_ = v;
                l.onClosed.addListener(function () {
                    var E = r.purchase_result,
                        H = {};
                    !E || "error" in E ? H = fa(ea
                        .PURCHASE_CANCELED) : (E = Y
                        .moneta.integrator.ui
                        .buyflow
                        .ManagedPurchaseCallbackData
                        .deserializeBinary(E
                            .integratorData), H
                        .response = {
                            orderId: E
                                .getExternalPurchaseOrderId()
                        }, (E = r.payment_data) && (
                            H.response.paymentData =
                            E), (E = r.signature) &&
                        (H.response.signature = E),
                        console.log(
                            "Clearing licenses cache value after payment for appId: " +
                            c.sender.id), this
                        .licensesCache_.remove(c
                            .sender.id));
                    c.postMessage(H);
                    c.disconnect()
                }.bind(this))
            }.bind(this))
        }.bind(a))
    },
    Nc = function (a, b, c, f, g) {
        var h = function (r) {
                f({
                    response: {
                        details: r
                    }
                })
            },
            l = a.licensesCache_.get(c);
        l ? (console.log("Retrieving licenses cache value for appId: " + c), h(
            l)) : (l = b.parameters || {}, sb(g, b), tb(g, c, h, f, l, a
            .licensesCache_))
    },
    Oc = function (a, b, c, f) {
        var g = a.parameters || {};
        sb(f, a);
        vb(f, b, function (h) {
            c({
                response: {
                    details: h
                }
            })
        }, c, a.sku, g)
    },
    Pc = function (a, b, c, f, g) {
        a = function (l) {
            console.log(
                "Clearing licenses cache value after payment for appId: " +
                c);
            this.licensesCache_.remove(c);
            f({
                response: {
                    details: l
                }
            })
        }.bind(a);
        var h = b.parameters || {};
        sb(g, b);
        ub(g, c, b.sku, a, f, h.interactive)
    };
Z.prototype.onConnect_ = function (a) {
    var b = function (f) {
            a.postMessage(f);
            a.disconnect()
        },
        c = new qb;
    a.onMessage.addListener(k.bind(function (f) {
        !f.sku && Z.Methods_.GET_SKU_DETAILS != f[Z
                .METHOD_NAME_] && Z.Methods_.GET_PURCHASES != f[
                Z.METHOD_NAME_] && Z.Methods_
            .CONSUME_PURCHASE != f[Z.METHOD_NAME_] || "prod" ==
            (f.parameters || {}).env ? Z.Methods_
            .GET_PURCHASES == f[Z.METHOD_NAME_] ? Nc(this, f, a
                .sender.id, b, c) : Z.Methods_
            .GET_SKU_DETAILS == f[Z.METHOD_NAME_] ? Oc(f, a
                .sender.id, b, c) : Z.Methods_
            .CONSUME_PURCHASE == f[Z.METHOD_NAME_] ?
            Pc(this, f, a.sender.id, b, c) : Mc(this, f, a, f
                .jwt, f.sku) : b(fa(ea.ENV_NOT_SUPPORTED_ERROR))
    }, this))
};
aa.impl_ = Z;
Z.Methods_ = {
    BUY: "buy",
    CONSUME_PURCHASE: "consumePurchase",
    GET_PURCHASES: "getPurchases",
    GET_SKU_DETAILS: "getSkuDetails"
};
Z.METHOD_NAME_ = "method";
da.BackgroundDelegate = Z;
var Qc = function (a) {
    this.delegate_ = a;
    chrome.app.runtime.onLaunched.addListener(k.bind(this.launchWindow_,
        this, null))
};
Qc.prototype.launchWindow_ = function (a) {
    null !== a && chrome.app.window.create("/html/craw_window.html", {
        id: "",
        bounds: this.delegate_.getWindowBounds(),
        frame: "chrome",
        hidden: !1
    }, function (b) {
        b.contentWindow.crawConfig_ = new ca(a, !0)
    })
};
k.craw.AppBackground = Qc;
window.onload = function () {
    var a = new aa.impl_;
    new Qc(a)
};
k.async = {};
k.async.FreeList = function (a, b, c) {
    this.limit_ = c;
    this.create_ = a;
    this.reset_ = b;
    this.occupants_ = 0;
    this.head_ = null
};
k.async.FreeList.prototype.get = function () {
    if (0 < this.occupants_) {
        this.occupants_--;
        var a = this.head_;
        this.head_ = a.next;
        a.next = null
    } else a = this.create_();
    return a
};
k.async.FreeList.prototype.put = function (a) {
    this.reset_(a);
    this.occupants_ < this.limit_ && (this.occupants_++, a.next = this
        .head_, this.head_ = a)
};
k.dom.BrowserFeature = {};
k.dom.BrowserFeature.ASSUME_NO_OFFSCREEN_CANVAS = !1;
k.dom.BrowserFeature.ASSUME_OFFSCREEN_CANVAS = !1;
k.dom.BrowserFeature.detectOffscreenCanvas_ = function () {
    try {
        return !!(new self.OffscreenCanvas(0, 0)).getContext("2d")
    } catch (a) {}
    return !1
};
k.dom.BrowserFeature.OFFSCREEN_CANVAS_2D = !k.dom.BrowserFeature
    .ASSUME_NO_OFFSCREEN_CANVAS && (k.dom.BrowserFeature
        .ASSUME_OFFSCREEN_CANVAS || k.dom.BrowserFeature
        .detectOffscreenCanvas_());
k.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES = !k.userAgent.IE || k
    .userAgent.isDocumentModeOrHigher(9);
k.dom.BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE = !k.userAgent.GECKO && !k
    .userAgent.IE || k.userAgent.IE && k.userAgent.isDocumentModeOrHigher(9) ||
    k.userAgent.GECKO && k.userAgent.isVersionOrHigher("1.9.1");
k.dom.BrowserFeature.CAN_USE_INNER_TEXT = k.userAgent.IE && !k.userAgent
    .isVersionOrHigher("9");
k.dom.BrowserFeature.CAN_USE_PARENT_ELEMENT_PROPERTY = k.userAgent.IE || k
    .userAgent.OPERA || k.userAgent.WEBKIT;
k.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT = k.userAgent.IE;
k.dom.BrowserFeature.LEGACY_IE_RANGES = k.userAgent.IE && !k.userAgent
    .isDocumentModeOrHigher(9);
k.math.Coordinate = function (a, b) {
    this.x = void 0 !== a ? a : 0;
    this.y = void 0 !== b ? b : 0
};
k.math.Coordinate.prototype.clone = function () {
    return new k.math.Coordinate(this.x, this.y)
};
k.DEBUG && (k.math.Coordinate.prototype.toString = function () {
    return "(" + this.x + ", " + this.y + ")"
});
k.math.Coordinate.prototype.equals = function (a) {
    return a instanceof k.math.Coordinate && k.math.Coordinate.equals(this,
        a)
};
k.math.Coordinate.equals = function (a, b) {
    return a == b ? !0 : a && b ? a.x == b.x && a.y == b.y : !1
};
k.math.Coordinate.distance = function (a, b) {
    var c = a.x - b.x;
    a = a.y - b.y;
    return Math.sqrt(c * c + a * a)
};
k.math.Coordinate.magnitude = function (a) {
    return Math.sqrt(a.x * a.x + a.y * a.y)
};
k.math.Coordinate.azimuth = function (a) {
    return k.math.angle(0, 0, a.x, a.y)
};
k.math.Coordinate.squaredDistance = function (a, b) {
    var c = a.x - b.x;
    a = a.y - b.y;
    return c * c + a * a
};
k.math.Coordinate.difference = function (a, b) {
    return new k.math.Coordinate(a.x - b.x, a.y - b.y)
};
k.math.Coordinate.sum = function (a, b) {
    return new k.math.Coordinate(a.x + b.x, a.y + b.y)
};
d = k.math.Coordinate.prototype;
d.ceil = function () {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    return this
};
d.floor = function () {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this
};
d.round = function () {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this
};
d.translate = function (a, b) {
    a instanceof k.math.Coordinate ? (this.x += a.x, this.y += a.y) : (this
        .x += Number(a), "number" === typeof b && (this.y += b));
    return this
};
d.scale = function (a, b) {
    this.x *= a;
    this.y *= "number" === typeof b ? b : a;
    return this
};
k.math.Size = function (a, b) {
    this.width = a;
    this.height = b
};
k.math.Size.equals = function (a, b) {
    return a == b ? !0 : a && b ? a.width == b.width && a.height == b
        .height : !1
};
k.math.Size.prototype.clone = function () {
    return new k.math.Size(this.width, this.height)
};
k.DEBUG && (k.math.Size.prototype.toString = function () {
    return "(" + this.width + " x " + this.height + ")"
});
d = k.math.Size.prototype;
d.aspectRatio = function () {
    return this.width / this.height
};
d.isEmpty = function () {
    return !(this.width * this.height)
};
d.ceil = function () {
    this.width = Math.ceil(this.width);
    this.height = Math.ceil(this.height);
    return this
};
d.floor = function () {
    this.width = Math.floor(this.width);
    this.height = Math.floor(this.height);
    return this
};
d.round = function () {
    this.width = Math.round(this.width);
    this.height = Math.round(this.height);
    return this
};
d.scale = function (a, b) {
    this.width *= a;
    this.height *= "number" === typeof b ? b : a;
    return this
};
k.dom.ASSUME_QUIRKS_MODE = !1;
k.dom.ASSUME_STANDARDS_MODE = !1;
k.dom.COMPAT_MODE_KNOWN_ = k.dom.ASSUME_QUIRKS_MODE || k.dom
    .ASSUME_STANDARDS_MODE;
k.dom.getDomHelper = function (a) {
    return a ? new k.dom.DomHelper(k.dom.getOwnerDocument(a)) : k.dom
        .defaultDomHelper_ || (k.dom.defaultDomHelper_ = new k.dom
            .DomHelper)
};
k.dom.getDocument = function () {
    return document
};
k.dom.getElement = function (a) {
    return k.dom.getElementHelper_(document, a)
};
k.dom.getElementHelper_ = function (a, b) {
    return "string" === typeof b ? a.getElementById(b) : b
};
k.dom.getRequiredElement = function (a) {
    return k.dom.getRequiredElementHelper_(document, a)
};
k.dom.getRequiredElementHelper_ = function (a, b) {
    k.asserts.assertString(b);
    a = k.dom.getElementHelper_(a, b);
    return a = k.asserts.assertElement(a, "No element found with id: " + b)
};
k.dom.$ = k.dom.getElement;
k.dom.getElementsByTagName = function (a, b) {
    return (b || document).getElementsByTagName(String(a))
};
k.dom.getElementsByTagNameAndClass = function (a, b, c) {
    return k.dom.getElementsByTagNameAndClass_(document, a, b, c)
};
k.dom.getElementByTagNameAndClass = function (a, b, c) {
    return k.dom.getElementByTagNameAndClass_(document, a, b, c)
};
k.dom.getElementsByClass = function (a, b) {
    var c = b || document;
    return k.dom.canUseQuerySelector_(c) ? c.querySelectorAll("." + a) : k
        .dom.getElementsByTagNameAndClass_(document, "*", a, b)
};
k.dom.getElementByClass = function (a, b) {
    var c = b || document;
    return (c.getElementsByClassName ? c.getElementsByClassName(a)[0] : k
        .dom.getElementByTagNameAndClass_(document, "*", a, b)) || null
};
k.dom.getRequiredElementByClass = function (a, b) {
    b = k.dom.getElementByClass(a, b);
    return k.asserts.assert(b, "No element found with className: " + a)
};
k.dom.canUseQuerySelector_ = function (a) {
    return !(!a.querySelectorAll || !a.querySelector)
};
k.dom.getElementsByTagNameAndClass_ = function (a, b, c, f) {
    a = f || a;
    b = b && "*" != b ? String(b).toUpperCase() : "";
    if (k.dom.canUseQuerySelector_(a) && (b || c)) return a
        .querySelectorAll(b + (c ? "." + c : ""));
    if (c && a.getElementsByClassName) {
        a = a.getElementsByClassName(c);
        if (b) {
            f = {};
            for (var g = 0, h = 0, l; l = a[h]; h++) b == l.nodeName && (f[
                g++] = l);
            f.length = g;
            return f
        }
        return a
    }
    a = a.getElementsByTagName(b || "*");
    if (c) {
        f = {};
        for (h = g = 0; l = a[h]; h++) b = l.className, "function" ==
            typeof b.split && ua(b.split(/\s+/), c) && (f[g++] = l);
        f.length = g;
        return f
    }
    return a
};
k.dom.getElementByTagNameAndClass_ = function (a, b, c, f) {
    var g = f || a,
        h = b && "*" != b ? String(b).toUpperCase() : "";
    return k.dom.canUseQuerySelector_(g) && (h || c) ? g.querySelector(h + (
        c ? "." + c : "")) : k.dom.getElementsByTagNameAndClass_(a, b,
        c, f)[0] || null
};
k.dom.$$ = k.dom.getElementsByTagNameAndClass;
k.dom.setProperties = function (a, b) {
    k.object.forEach(b, function (c, f) {
        c && "object" == typeof c && c
            .implementsGoogStringTypedString && (c = c
                .getTypedStringValue());
        "style" == f ? a.style.cssText = c : "class" == f ? a
            .className = c : "for" == f ? a.htmlFor = c : k.dom
            .DIRECT_ATTRIBUTE_MAP_.hasOwnProperty(f) ? a
            .setAttribute(k.dom.DIRECT_ATTRIBUTE_MAP_[f], c) : k
            .string.startsWith(f, "aria-") || k.string.startsWith(f,
                "data-") ? a.setAttribute(f, c) : a[f] = c
    })
};
k.dom.DIRECT_ATTRIBUTE_MAP_ = {
    cellpadding: "cellPadding",
    cellspacing: "cellSpacing",
    colspan: "colSpan",
    frameborder: "frameBorder",
    height: "height",
    maxlength: "maxLength",
    nonce: "nonce",
    role: "role",
    rowspan: "rowSpan",
    type: "type",
    usemap: "useMap",
    valign: "vAlign",
    width: "width"
};
k.dom.getViewportSize = function (a) {
    return k.dom.getViewportSize_(a || window)
};
k.dom.getViewportSize_ = function (a) {
    a = a.document;
    a = k.dom.isCss1CompatMode_(a) ? a.documentElement : a.body;
    return new k.math.Size(a.clientWidth, a.clientHeight)
};
k.dom.getDocumentHeight = function () {
    return k.dom.getDocumentHeight_(window)
};
k.dom.getDocumentHeightForWindow = function (a) {
    return k.dom.getDocumentHeight_(a)
};
k.dom.getDocumentHeight_ = function (a) {
    var b = a.document,
        c = 0;
    if (b) {
        c = b.body;
        var f = b.documentElement;
        if (!f || !c) return 0;
        a = k.dom.getViewportSize_(a).height;
        if (k.dom.isCss1CompatMode_(b) && f.scrollHeight) c = f
            .scrollHeight != a ? f.scrollHeight : f.offsetHeight;
        else {
            b = f.scrollHeight;
            var g = f.offsetHeight;
            f.clientHeight != g && (b = c.scrollHeight, g = c.offsetHeight);
            c = b > a ? b > g ? b : g : b < g ? b : g
        }
    }
    return c
};
k.dom.getPageScroll = function (a) {
    return k.dom.getDomHelper((a || k.global || window).document)
        .getDocumentScroll()
};
k.dom.getDocumentScroll = function () {
    return k.dom.getDocumentScroll_(document)
};
k.dom.getDocumentScroll_ = function (a) {
    var b = k.dom.getDocumentScrollElement_(a);
    a = k.dom.getWindow_(a);
    return k.userAgent.IE && k.userAgent.isVersionOrHigher("10") && a
        .pageYOffset != b.scrollTop ? new k.math.Coordinate(b.scrollLeft, b
            .scrollTop) : new k.math.Coordinate(a.pageXOffset || b
            .scrollLeft, a.pageYOffset || b.scrollTop)
};
k.dom.getDocumentScrollElement = function () {
    return k.dom.getDocumentScrollElement_(document)
};
k.dom.getDocumentScrollElement_ = function (a) {
    return a.scrollingElement ? a.scrollingElement : !k.userAgent.WEBKIT &&
        k.dom.isCss1CompatMode_(a) ? a.documentElement : a.body || a
        .documentElement
};
k.dom.getWindow = function (a) {
    return a ? k.dom.getWindow_(a) : window
};
k.dom.getWindow_ = function (a) {
    return a.parentWindow || a.defaultView
};
k.dom.createDom = function (a, b, c) {
    return k.dom.createDom_(document, arguments)
};
k.dom.createDom_ = function (a, b) {
    var c = String(b[0]),
        f = b[1];
    if (!k.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES && f && (f
            .name || f.type)) {
        c = ["<", c];
        f.name && c.push(' name="', k.string.htmlEscape(f.name), '"');
        if (f.type) {
            c.push(' type="', k.string.htmlEscape(f.type), '"');
            var g = {};
            k.object.extend(g, f);
            delete g.type;
            f = g
        }
        c.push(">");
        c = c.join("")
    }
    c = k.dom.createElement_(a, c);
    f && ("string" === typeof f ? c.className = f : Array.isArray(f) ? c
        .className = f.join(" ") : k.dom.setProperties(c, f));
    2 < b.length && k.dom.append_(a, c,
        b, 2);
    return c
};
k.dom.append_ = function (a, b, c, f) {
    function g(l) {
        l && b.appendChild("string" === typeof l ? a.createTextNode(l) : l)
    }
    for (; f < c.length; f++) {
        var h = c[f];
        k.isArrayLike(h) && !k.dom.isNodeLike(h) ? n(k.dom.isNodeList(h) ?
            Da(h) : h, g) : g(h)
    }
};
k.dom.$dom = k.dom.createDom;
k.dom.createElement = function (a) {
    return k.dom.createElement_(document, a)
};
k.dom.createElement_ = function (a, b) {
    b = String(b);
    "application/xhtml+xml" === a.contentType && (b = b.toLowerCase());
    return a.createElement(b)
};
k.dom.createTextNode = function (a) {
    return document.createTextNode(String(a))
};
k.dom.createTable = function (a, b, c) {
    return k.dom.createTable_(document, a, b, !!c)
};
k.dom.createTable_ = function (a, b, c, f) {
    for (var g = k.dom.createElement_(a, k.dom.TagName.TABLE), h = g
            .appendChild(k.dom.createElement_(a, k.dom.TagName.TBODY)), l =
            0; l < b; l++) {
        for (var r = k.dom.createElement_(a, k.dom.TagName.TR), v = 0; v <
            c; v++) {
            var E = k.dom.createElement_(a, k.dom.TagName.TD);
            f && k.dom.setTextContent(E, k.string.Unicode.NBSP);
            r.appendChild(E)
        }
        h.appendChild(r)
    }
    return g
};
k.dom.constHtmlToNode = function (a) {
    var b = p(arguments, k.string.Const.unwrap);
    b = k.html.uncheckedconversions
        .safeHtmlFromStringKnownToSatisfyTypeContract(k.string.Const.from(
            "Constant HTML string, that gets turned into a Node later, so it will be automatically balanced."
            ), b.join(""));
    return k.dom.safeHtmlToNode(b)
};
k.dom.safeHtmlToNode = function (a) {
    return k.dom.safeHtmlToNode_(document, a)
};
k.dom.safeHtmlToNode_ = function (a, b) {
    var c = k.dom.createElement_(a, k.dom.TagName.DIV);
    k.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT ? (k.dom.safe
            .setInnerHtml(c, k.html.SafeHtml.concat(k.html.SafeHtml.BR, b)),
            c.removeChild(k.asserts.assert(c.firstChild))) : k.dom.safe
        .setInnerHtml(c, b);
    return k.dom.childrenToNode_(a, c)
};
k.dom.childrenToNode_ = function (a, b) {
    if (1 == b.childNodes.length) return b.removeChild(k.asserts.assert(b
        .firstChild));
    for (a = a.createDocumentFragment(); b.firstChild;) a.appendChild(b
        .firstChild);
    return a
};
k.dom.isCss1CompatMode = function () {
    return k.dom.isCss1CompatMode_(document)
};
k.dom.isCss1CompatMode_ = function (a) {
    return k.dom.COMPAT_MODE_KNOWN_ ? k.dom.ASSUME_STANDARDS_MODE :
        "CSS1Compat" == a.compatMode
};
k.dom.canHaveChildren = function (a) {
    if (a.nodeType != k.dom.NodeType.ELEMENT) return !1;
    switch (a.tagName) {
        case String(k.dom.TagName.APPLET):
        case String(k.dom.TagName.AREA):
        case String(k.dom.TagName.BASE):
        case String(k.dom.TagName.BR):
        case String(k.dom.TagName.COL):
        case String(k.dom.TagName.COMMAND):
        case String(k.dom.TagName.EMBED):
        case String(k.dom.TagName.FRAME):
        case String(k.dom.TagName.HR):
        case String(k.dom.TagName.IMG):
        case String(k.dom.TagName.INPUT):
        case String(k.dom.TagName.IFRAME):
        case String(k.dom.TagName.ISINDEX):
        case String(k.dom.TagName.KEYGEN):
        case String(k.dom.TagName.LINK):
        case String(k.dom.TagName.NOFRAMES):
        case String(k.dom.TagName.NOSCRIPT):
        case String(k.dom.TagName.META):
        case String(k.dom.TagName.OBJECT):
        case String(k.dom.TagName.PARAM):
        case String(k.dom.TagName.SCRIPT):
        case String(k.dom.TagName.SOURCE):
        case String(k.dom.TagName.STYLE):
        case String(k.dom.TagName.TRACK):
        case String(k.dom.TagName.WBR):
            return !1
    }
    return !0
};
k.dom.appendChild = function (a, b) {
    k.asserts.assert(null != a && null != b,
        "goog.dom.appendChild expects non-null arguments");
    a.appendChild(b)
};
k.dom.append = function (a, b) {
    k.dom.append_(k.dom.getOwnerDocument(a), a, arguments, 1)
};
k.dom.removeChildren = function (a) {
    for (var b; b = a.firstChild;) a.removeChild(b)
};
k.dom.insertSiblingBefore = function (a, b) {
    k.asserts.assert(null != a && null != b,
        "goog.dom.insertSiblingBefore expects non-null arguments");
    b.parentNode && b.parentNode.insertBefore(a, b)
};
k.dom.insertSiblingAfter = function (a, b) {
    k.asserts.assert(null != a && null != b,
        "goog.dom.insertSiblingAfter expects non-null arguments");
    b.parentNode && b.parentNode.insertBefore(a, b.nextSibling)
};
k.dom.insertChildAt = function (a, b, c) {
    k.asserts.assert(null != a,
        "goog.dom.insertChildAt expects a non-null parent");
    a.insertBefore(b, a.childNodes[c] || null)
};
k.dom.removeNode = function (a) {
    return a && a.parentNode ? a.parentNode.removeChild(a) : null
};
k.dom.replaceNode = function (a, b) {
    k.asserts.assert(null != a && null != b,
        "goog.dom.replaceNode expects non-null arguments");
    var c = b.parentNode;
    c && c.replaceChild(a, b)
};
k.dom.copyContents = function (a, b) {
    k.asserts.assert(null != a && null != b,
        "goog.dom.copyContents expects non-null arguments");
    b = b.cloneNode(!0).childNodes;
    for (k.dom.removeChildren(a); b.length;) a.appendChild(b[0])
};
k.dom.flattenElement = function (a) {
    var b, c = a.parentNode;
    if (c && c.nodeType != k.dom.NodeType.DOCUMENT_FRAGMENT) {
        if (a.removeNode) return a.removeNode(!1);
        for (; b = a.firstChild;) c.insertBefore(b, a);
        return k.dom.removeNode(a)
    }
};
k.dom.getChildren = function (a) {
    return k.dom.BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE && void 0 != a
        .children ? a.children : na(a.childNodes, function (b) {
            return b.nodeType == k.dom.NodeType.ELEMENT
        })
};
k.dom.getFirstElementChild = function (a) {
    return void 0 !== a.firstElementChild ? a.firstElementChild : k.dom
        .getNextElementNode_(a.firstChild, !0)
};
k.dom.getLastElementChild = function (a) {
    return void 0 !== a.lastElementChild ? a.lastElementChild : k.dom
        .getNextElementNode_(a.lastChild, !1)
};
k.dom.getNextElementSibling = function (a) {
    return void 0 !== a.nextElementSibling ? a.nextElementSibling : k.dom
        .getNextElementNode_(a.nextSibling, !0)
};
k.dom.getPreviousElementSibling = function (a) {
    return void 0 !== a.previousElementSibling ? a.previousElementSibling :
        k.dom.getNextElementNode_(a.previousSibling, !1)
};
k.dom.getNextElementNode_ = function (a, b) {
    for (; a && a.nodeType != k.dom.NodeType.ELEMENT;) a = b ? a
        .nextSibling : a.previousSibling;
    return a
};
k.dom.getNextNode = function (a) {
    if (!a) return null;
    if (a.firstChild) return a.firstChild;
    for (; a && !a.nextSibling;) a = a.parentNode;
    return a ? a.nextSibling : null
};
k.dom.getPreviousNode = function (a) {
    if (!a) return null;
    if (!a.previousSibling) return a.parentNode;
    for (a = a.previousSibling; a && a.lastChild;) a = a.lastChild;
    return a
};
k.dom.isNodeLike = function (a) {
    return k.isObject(a) && 0 < a.nodeType
};
k.dom.isElement = function (a) {
    return k.isObject(a) && a.nodeType == k.dom.NodeType.ELEMENT
};
k.dom.isWindow = function (a) {
    return k.isObject(a) && a.window == a
};
k.dom.getParentElement = function (a) {
    var b;
    if (k.dom.BrowserFeature.CAN_USE_PARENT_ELEMENT_PROPERTY && !(k
            .userAgent.IE && k.userAgent.isVersionOrHigher("9") && !k
            .userAgent.isVersionOrHigher("10") && k.global.SVGElement &&
            a instanceof k.global.SVGElement) && (b = a.parentElement))
        return b;
    b = a.parentNode;
    return k.dom.isElement(b) ? b : null
};
k.dom.contains = function (a, b) {
    if (!a || !b) return !1;
    if (a.contains && b.nodeType == k.dom.NodeType.ELEMENT) return a == b ||
        a.contains(b);
    if ("undefined" != typeof a.compareDocumentPosition) return a == b || !!
        (a.compareDocumentPosition(b) & 16);
    for (; b && a != b;) b = b.parentNode;
    return b == a
};
k.dom.compareNodeOrder = function (a, b) {
    if (a == b) return 0;
    if (a.compareDocumentPosition) return a.compareDocumentPosition(b) & 2 ?
        1 : -1;
    if (k.userAgent.IE && !k.userAgent.isDocumentModeOrHigher(9)) {
        if (a.nodeType == k.dom.NodeType.DOCUMENT) return -1;
        if (b.nodeType == k.dom.NodeType.DOCUMENT) return 1
    }
    if ("sourceIndex" in a || a.parentNode && "sourceIndex" in a
        .parentNode) {
        var c = a.nodeType == k.dom.NodeType.ELEMENT,
            f = b.nodeType == k.dom.NodeType.ELEMENT;
        if (c && f) return a.sourceIndex - b.sourceIndex;
        var g = a.parentNode,
            h = b.parentNode;
        return g == h ? k.dom.compareSiblingOrder_(a, b) : !c && k.dom
            .contains(g, b) ? -1 * k.dom.compareParentsDescendantNodeIe_(a,
                b) : !f && k.dom.contains(h, a) ? k.dom
            .compareParentsDescendantNodeIe_(b, a) : (c ? a.sourceIndex : g
                .sourceIndex) - (f ? b.sourceIndex : h.sourceIndex)
    }
    f = k.dom.getOwnerDocument(a);
    c = f.createRange();
    c.selectNode(a);
    c.collapse(!0);
    a = f.createRange();
    a.selectNode(b);
    a.collapse(!0);
    return c.compareBoundaryPoints(k.global.Range.START_TO_END, a)
};
k.dom.compareParentsDescendantNodeIe_ = function (a, b) {
    var c = a.parentNode;
    if (c == b) return -1;
    for (; b.parentNode != c;) b = b.parentNode;
    return k.dom.compareSiblingOrder_(b, a)
};
k.dom.compareSiblingOrder_ = function (a, b) {
    for (; b = b.previousSibling;)
        if (b == a) return -1;
    return 1
};
k.dom.findCommonAncestor = function (a) {
    var b, c = arguments.length;
    if (!c) return null;
    if (1 == c) return arguments[0];
    var f = [],
        g = Infinity;
    for (b = 0; b < c; b++) {
        for (var h = [], l = arguments[b]; l;) h.unshift(l), l = l
            .parentNode;
        f.push(h);
        g = Math.min(g, h.length)
    }
    h = null;
    for (b = 0; b < g; b++) {
        l = f[0][b];
        for (var r = 1; r < c; r++)
            if (l != f[r][b]) return h;
        h = l
    }
    return h
};
k.dom.isInDocument = function (a) {
    return 16 == (a.ownerDocument.compareDocumentPosition(a) & 16)
};
k.dom.getOwnerDocument = function (a) {
    k.asserts.assert(a, "Node cannot be null or undefined.");
    return a.nodeType == k.dom.NodeType.DOCUMENT ? a : a.ownerDocument || a
        .document
};
k.dom.getFrameContentDocument = function (a) {
    return a.contentDocument || a.contentWindow.document
};
k.dom.getFrameContentWindow = function (a) {
    try {
        return a.contentWindow || (a.contentDocument ? k.dom.getWindow(a
            .contentDocument) : null)
    } catch (b) {}
    return null
};
k.dom.setTextContent = function (a, b) {
    k.asserts.assert(null != a,
        "goog.dom.setTextContent expects a non-null value for node");
    if ("textContent" in a) a.textContent = b;
    else if (a.nodeType == k.dom.NodeType.TEXT) a.data = String(b);
    else if (a.firstChild && a.firstChild.nodeType == k.dom.NodeType.TEXT) {
        for (; a.lastChild != a.firstChild;) a.removeChild(k.asserts.assert(
            a.lastChild));
        a.firstChild.data = String(b)
    } else {
        k.dom.removeChildren(a);
        var c = k.dom.getOwnerDocument(a);
        a.appendChild(c.createTextNode(String(b)))
    }
};
k.dom.getOuterHtml = function (a) {
    k.asserts.assert(null !== a,
        "goog.dom.getOuterHtml expects a non-null value for element");
    if ("outerHTML" in a) return a.outerHTML;
    var b = k.dom.getOwnerDocument(a);
    b = k.dom.createElement_(b, k.dom.TagName.DIV);
    b.appendChild(a.cloneNode(!0));
    return b.innerHTML
};
k.dom.findNode = function (a, b) {
    var c = [];
    return k.dom.findNodes_(a, b, c, !0) ? c[0] : void 0
};
k.dom.findNodes = function (a, b) {
    var c = [];
    k.dom.findNodes_(a, b, c, !1);
    return c
};
k.dom.findNodes_ = function (a, b, c, f) {
    if (null != a)
        for (a = a.firstChild; a;) {
            if (b(a) && (c.push(a), f) || k.dom.findNodes_(a, b, c, f))
                return !0;
            a = a.nextSibling
        }
    return !1
};
k.dom.findElement = function (a, b) {
    for (a = k.dom.getChildrenReverse_(a); 0 < a.length;) {
        var c = a.pop();
        if (b(c)) return c;
        for (c = c.lastElementChild; c; c = c.previousElementSibling) a
            .push(c)
    }
    return null
};
k.dom.findElements = function (a, b) {
    var c = [];
    for (a = k.dom.getChildrenReverse_(a); 0 < a.length;) {
        var f = a.pop();
        b(f) && c.push(f);
        for (f = f.lastElementChild; f; f = f.previousElementSibling) a
            .push(f)
    }
    return c
};
k.dom.getChildrenReverse_ = function (a) {
    if (a.nodeType == k.dom.NodeType.DOCUMENT) return [a.documentElement];
    var b = [];
    for (a = a.lastElementChild; a; a = a.previousElementSibling) b.push(a);
    return b
};
k.dom.TAGS_TO_IGNORE_ = {
    SCRIPT: 1,
    STYLE: 1,
    HEAD: 1,
    IFRAME: 1,
    OBJECT: 1
};
k.dom.PREDEFINED_TAG_VALUES_ = {
    IMG: " ",
    BR: "\n"
};
k.dom.isFocusableTabIndex = function (a) {
    return k.dom.hasSpecifiedTabIndex_(a) && k.dom.isTabIndexFocusable_(a)
};
k.dom.setFocusableTabIndex = function (a, b) {
    b ? a.tabIndex = 0 : (a.tabIndex = -1, a.removeAttribute("tabIndex"))
};
k.dom.isFocusable = function (a) {
    var b;
    return (b = k.dom.nativelySupportsFocus_(a) ? !a.disabled && (!k.dom
                .hasSpecifiedTabIndex_(a) || k.dom.isTabIndexFocusable_(a)
                ) : k.dom.isFocusableTabIndex(a)) && k.userAgent.IE ? k.dom
        .hasNonZeroBoundingRect_(a) : b
};
k.dom.hasSpecifiedTabIndex_ = function (a) {
    return k.userAgent.IE && !k.userAgent.isVersionOrHigher("9") ? (a = a
            .getAttributeNode("tabindex"), null != a && a.specified) : a
        .hasAttribute("tabindex")
};
k.dom.isTabIndexFocusable_ = function (a) {
    a = a.tabIndex;
    return "number" === typeof a && 0 <= a && 32768 > a
};
k.dom.nativelySupportsFocus_ = function (a) {
    return a.tagName == k.dom.TagName.A && a.hasAttribute("href") || a
        .tagName == k.dom.TagName.INPUT || a.tagName == k.dom.TagName
        .TEXTAREA || a.tagName == k.dom.TagName.SELECT || a.tagName == k.dom
        .TagName.BUTTON
};
k.dom.hasNonZeroBoundingRect_ = function (a) {
    a = "function" !== typeof a.getBoundingClientRect || k.userAgent.IE &&
        null == a.parentElement ? {
            height: a.offsetHeight,
            width: a.offsetWidth
        } : a.getBoundingClientRect();
    return null != a && 0 < a.height && 0 < a.width
};
k.dom.getTextContent = function (a) {
    if (k.dom.BrowserFeature.CAN_USE_INNER_TEXT && null !== a &&
        "innerText" in a) a = k.string.canonicalizeNewlines(a.innerText);
    else {
        var b = [];
        k.dom.getTextContent_(a, b, !0);
        a = b.join("")
    }
    a = a.replace(/ \xAD /g, " ").replace(/\xAD/g, "");
    a = a.replace(/\u200B/g, "");
    k.dom.BrowserFeature.CAN_USE_INNER_TEXT || (a = a.replace(/ +/g, " "));
    " " != a && (a = a.replace(/^\s*/, ""));
    return a
};
k.dom.getRawTextContent = function (a) {
    var b = [];
    k.dom.getTextContent_(a, b, !1);
    return b.join("")
};
k.dom.getTextContent_ = function (a, b, c) {
    if (!(a.nodeName in k.dom.TAGS_TO_IGNORE_))
        if (a.nodeType == k.dom.NodeType.TEXT) c ? b.push(String(a
            .nodeValue).replace(/(\r\n|\r|\n)/g, "")) : b.push(a
            .nodeValue);
        else if (a.nodeName in k.dom.PREDEFINED_TAG_VALUES_) b.push(k.dom
        .PREDEFINED_TAG_VALUES_[a.nodeName]);
    else
        for (a = a.firstChild; a;) k.dom.getTextContent_(a, b, c), a = a
            .nextSibling
};
k.dom.getNodeTextLength = function (a) {
    return k.dom.getTextContent(a).length
};
k.dom.getNodeTextOffset = function (a, b) {
    b = b || k.dom.getOwnerDocument(a).body;
    for (var c = []; a && a != b;) {
        for (var f = a; f = f.previousSibling;) c.unshift(k.dom
            .getTextContent(f));
        a = a.parentNode
    }
    return k.string.trimLeft(c.join("")).replace(/ +/g, " ").length
};
k.dom.getNodeAtOffset = function (a, b, c) {
    a = [a];
    for (var f = 0, g = null; 0 < a.length && f < b;)
        if (g = a.pop(), !(g.nodeName in k.dom.TAGS_TO_IGNORE_))
            if (g.nodeType == k.dom.NodeType.TEXT) {
                var h = g.nodeValue.replace(/(\r\n|\r|\n)/g, "").replace(
                    / +/g, " ");
                f += h.length
            } else if (g.nodeName in k.dom.PREDEFINED_TAG_VALUES_) f += k
        .dom.PREDEFINED_TAG_VALUES_[g.nodeName].length;
    else
        for (h = g.childNodes.length - 1; 0 <= h; h--) a.push(g.childNodes[
            h]);
    k.isObject(c) && (c.remainder = g ? g.nodeValue.length + b - f - 1 : 0,
        c.node = g);
    return g
};
k.dom.isNodeList = function (a) {
    if (a && "number" == typeof a.length) {
        if (k.isObject(a)) return "function" == typeof a.item || "string" ==
            typeof a.item;
        if ("function" === typeof a) return "function" == typeof a.item
    }
    return !1
};
k.dom.getAncestorByTagNameAndClass = function (a, b, c, f) {
    if (!b && !c) return null;
    var g = b ? String(b).toUpperCase() : null;
    return k.dom.getAncestor(a, function (h) {
        return (!g || h.nodeName == g) && (!c || "string" ===
            typeof h.className && ua(h.className.split(/\s+/),
                c))
    }, !0, f)
};
k.dom.getAncestorByClass = function (a, b, c) {
    return k.dom.getAncestorByTagNameAndClass(a, null, b, c)
};
k.dom.getAncestor = function (a, b, c, f) {
    a && !c && (a = a.parentNode);
    for (c = 0; a && (null == f || c <= f);) {
        k.asserts.assert("parentNode" != a.name);
        if (b(a)) return a;
        a = a.parentNode;
        c++
    }
    return null
};
k.dom.getActiveElement = function (a) {
    try {
        var b = a && a.activeElement;
        return b && b.nodeName ? b : null
    } catch (c) {
        return null
    }
};
k.dom.getPixelRatio = function () {
    var a = k.dom.getWindow();
    return void 0 !== a.devicePixelRatio ? a.devicePixelRatio : a
        .matchMedia ? k.dom.matchesPixelRatio_(3) || k.dom
        .matchesPixelRatio_(2) || k.dom.matchesPixelRatio_(1.5) || k.dom
        .matchesPixelRatio_(1) || .75 : 1
};
k.dom.matchesPixelRatio_ = function (a) {
    return k.dom.getWindow().matchMedia("(min-resolution: " + a +
        "dppx),(min--moz-device-pixel-ratio: " + a +
        "),(min-resolution: " + 96 * a + "dpi)").matches ? a : 0
};
k.dom.getCanvasContext2D = function (a) {
    return a.getContext("2d")
};
k.dom.DomHelper = function (a) {
    this.document_ = a || k.global.document || document
};
d = k.dom.DomHelper.prototype;
d.getDomHelper = k.dom.getDomHelper;
d.getDocument = function () {
    return this.document_
};
d.getElement = function (a) {
    return k.dom.getElementHelper_(this.document_, a)
};
d.getRequiredElement = function (a) {
    return k.dom.getRequiredElementHelper_(this.document_, a)
};
d.$ = k.dom.DomHelper.prototype.getElement;
d.getElementsByTagName = function (a, b) {
    return (b || this.document_).getElementsByTagName(String(a))
};
d.getElementsByTagNameAndClass = function (a, b, c) {
    return k.dom.getElementsByTagNameAndClass_(this.document_, a, b, c)
};
d.getElementByTagNameAndClass = function (a, b, c) {
    return k.dom.getElementByTagNameAndClass_(this.document_, a, b, c)
};
d.getElementsByClass = function (a, b) {
    return k.dom.getElementsByClass(a, b || this.document_)
};
d.getElementByClass = function (a, b) {
    return k.dom.getElementByClass(a, b || this.document_)
};
d.getRequiredElementByClass = function (a, b) {
    return k.dom.getRequiredElementByClass(a, b || this.document_)
};
d.$$ = k.dom.DomHelper.prototype.getElementsByTagNameAndClass;
d.setProperties = k.dom.setProperties;
d.getViewportSize = function (a) {
    return k.dom.getViewportSize(a || this.getWindow())
};
d.getDocumentHeight = function () {
    return k.dom.getDocumentHeight_(this.getWindow())
};
d.createDom = function (a, b, c) {
    return k.dom.createDom_(this.document_, arguments)
};
d.$dom = k.dom.DomHelper.prototype.createDom;
d.createElement = function (a) {
    return k.dom.createElement_(this.document_, a)
};
d.createTextNode = function (a) {
    return this.document_.createTextNode(String(a))
};
d.createTable = function (a, b, c) {
    return k.dom.createTable_(this.document_, a, b, !!c)
};
d.safeHtmlToNode = function (a) {
    return k.dom.safeHtmlToNode_(this.document_, a)
};
d.isCss1CompatMode = function () {
    return k.dom.isCss1CompatMode_(this.document_)
};
d.getWindow = function () {
    return k.dom.getWindow_(this.document_)
};
d.getDocumentScrollElement = function () {
    return k.dom.getDocumentScrollElement_(this.document_)
};
d.getDocumentScroll = function () {
    return k.dom.getDocumentScroll_(this.document_)
};
d.getActiveElement = function (a) {
    return k.dom.getActiveElement(a || this.document_)
};
d.appendChild = k.dom.appendChild;
d.append = k.dom.append;
d.canHaveChildren = k.dom.canHaveChildren;
d.removeChildren = k.dom.removeChildren;
d.insertSiblingBefore = k.dom.insertSiblingBefore;
d.insertSiblingAfter = k.dom.insertSiblingAfter;
d.insertChildAt = k.dom.insertChildAt;
d.removeNode = k.dom.removeNode;
d.replaceNode = k.dom.replaceNode;
d.copyContents = k.dom.copyContents;
d.flattenElement = k.dom.flattenElement;
d.getChildren = k.dom.getChildren;
d.getFirstElementChild = k.dom.getFirstElementChild;
d.getLastElementChild = k.dom.getLastElementChild;
d.getNextElementSibling = k.dom.getNextElementSibling;
d.getPreviousElementSibling = k.dom.getPreviousElementSibling;
d.getNextNode = k.dom.getNextNode;
d.getPreviousNode = k.dom.getPreviousNode;
d.isNodeLike = k.dom.isNodeLike;
d.isElement = k.dom.isElement;
d.isWindow = k.dom.isWindow;
d.getParentElement = k.dom.getParentElement;
d.contains = k.dom.contains;
d.compareNodeOrder = k.dom.compareNodeOrder;
d.findCommonAncestor = k.dom.findCommonAncestor;
d.getOwnerDocument = k.dom.getOwnerDocument;
d.getFrameContentDocument = k.dom.getFrameContentDocument;
d.getFrameContentWindow = k.dom.getFrameContentWindow;
d.setTextContent = k.dom.setTextContent;
d.getOuterHtml = k.dom.getOuterHtml;
d.findNode = k.dom.findNode;
d.findNodes = k.dom.findNodes;
d.isFocusableTabIndex = k.dom.isFocusableTabIndex;
d.setFocusableTabIndex = k.dom.setFocusableTabIndex;
d.isFocusable = k.dom.isFocusable;
d.getTextContent = k.dom.getTextContent;
d.getNodeTextLength = k.dom.getNodeTextLength;
d.getNodeTextOffset = k.dom.getNodeTextOffset;
d.getNodeAtOffset = k.dom.getNodeAtOffset;
d.isNodeList = k.dom.isNodeList;
d.getAncestorByTagNameAndClass = k.dom.getAncestorByTagNameAndClass;
d.getAncestorByClass = k.dom.getAncestorByClass;
d.getAncestor = k.dom.getAncestor;
d.getCanvasContext2D = k.dom.getCanvasContext2D;
k.async.nextTick = function (a, b, c) {
    var f = a;
    b && (f = k.bind(a, b));
    f = k.async.nextTick.wrapCallback_(f);
    "function" === typeof k.global.setImmediate && (c || k.async.nextTick
        .useSetImmediate_()) ? k.global.setImmediate(f) : (k.async
        .nextTick.setImmediate_ || (k.async.nextTick.setImmediate_ = k
            .async.nextTick.getSetImmediateEmulator_()), k.async
        .nextTick.setImmediate_(f))
};
k.async.nextTick.useSetImmediate_ = function () {
    return k.global.Window && k.global.Window.prototype && !k.labs.userAgent
        .browser.isEdge() && k.global.Window.prototype.setImmediate == k
        .global.setImmediate ? !1 : !0
};
k.async.nextTick.getSetImmediateEmulator_ = function () {
    var a = k.global.MessageChannel;
    "undefined" === typeof a && "undefined" !== typeof window && window
        .postMessage && window.addEventListener && !k.labs.userAgent.engine
        .isPresto() && (a = function () {
            var g = k.dom.createElement(k.dom.TagName.IFRAME);
            g.style.display = "none";
            document.documentElement.appendChild(g);
            var h = g.contentWindow;
            g = h.document;
            g.open();
            g.close();
            var l = "callImmediate" + Math.random(),
                r = "file:" == h.location.protocol ? "*" : h.location
                .protocol + "//" + h.location.host;
            g = k.bind(function (v) {
                if (("*" == r || v.origin == r) && v.data == l)
                    this.port1.onmessage()
            }, this);
            h.addEventListener("message", g, !1);
            this.port1 = {};
            this.port2 = {
                postMessage: function () {
                    h.postMessage(l, r)
                }
            }
        });
    if ("undefined" !== typeof a && !k.labs.userAgent.browser.isIE()) {
        var b = new a,
            c = {},
            f = c;
        b.port1.onmessage = function () {
            if (void 0 !== c.next) {
                c = c.next;
                var g = c.cb;
                c.cb = null;
                g()
            }
        };
        return function (g) {
            f.next = {
                cb: g
            };
            f = f.next;
            b.port2.postMessage(0)
        }
    }
    return function (g) {
        k.global.setTimeout(g, 0)
    }
};
k.async.nextTick.wrapCallback_ = k.functions.identity;
k.debug.entryPointRegistry.register(function (a) {
    k.async.nextTick.wrapCallback_ = a
});

function Rc(a) {
    k.global.setTimeout(function () {
        throw a;
    }, 0)
}
k.async.throwException = Rc;
var Sc = function () {
    this.workTail_ = this.workHead_ = null
};
Sc.prototype.add = function (a, b) {
    var c = Sc.freelist_.get();
    c.set(a, b);
    this.workTail_ ? this.workTail_.next = c : ((0, k.asserts.assert)(!this
        .workHead_), this.workHead_ = c);
    this.workTail_ = c
};
Sc.prototype.remove = function () {
    var a = null;
    this.workHead_ && (a = this.workHead_, this.workHead_ = this.workHead_
        .next, this.workHead_ || (this.workTail_ = null), a.next = null);
    return a
};
Sc.DEFAULT_MAX_UNUSED = 100;
Sc.freelist_ = new k.async.FreeList(function () {
    return new Tc
}, function (a) {
    return a.reset()
}, Sc.DEFAULT_MAX_UNUSED);
var Tc = function () {
    this.next = this.scope = this.fn = null
};
Tc.prototype.set = function (a, b) {
    this.fn = a;
    this.scope = b;
    this.next = null
};
Tc.prototype.reset = function () {
    this.next = this.scope = this.fn = null
};
k.async.WorkQueue = Sc;
k.ASSUME_NATIVE_PROMISE = !1;
k.async.run = function (a, b) {
    k.async.run.schedule_ || k.async.run.initializeRunner_();
    k.async.run.workQueueScheduled_ || (k.async.run.schedule_(), k.async.run
        .workQueueScheduled_ = !0);
    k.async.run.workQueue_.add(a, b)
};
k.async.run.initializeRunner_ = function () {
    if (k.ASSUME_NATIVE_PROMISE || k.global.Promise && k.global.Promise
        .resolve) {
        var a = k.global.Promise.resolve(void 0);
        k.async.run.schedule_ = function () {
            a.then(k.async.run.processWorkQueue)
        }
    } else k.async.run.schedule_ = function () {
        k.async.nextTick(k.async.run.processWorkQueue)
    }
};
k.async.run.forceNextTick = function (a) {
    k.async.run.schedule_ = function () {
        k.async.nextTick(k.async.run.processWorkQueue);
        a && a(k.async.run.processWorkQueue)
    }
};
k.async.run.workQueueScheduled_ = !1;
k.async.run.workQueue_ = new Sc;
k.DEBUG && (k.async.run.resetQueue = function () {
    k.async.run.workQueueScheduled_ = !1;
    k.async.run.workQueue_ = new Sc
});
k.async.run.processWorkQueue = function () {
    for (var a; a = k.async.run.workQueue_.remove();) {
        try {
            a.fn.call(a.scope)
        } catch (b) {
            Rc(b)
        }
        Sc.freelist_.put(a)
    }
    k.async.run.workQueueScheduled_ = !1
};
k.json = {};
k.json.USE_NATIVE_JSON = !1;
k.json.TRY_NATIVE_JSON = !1;
k.json.isValid = function (a) {
    return /^\s*$/.test(a) ? !1 : /^[\],:{}\s\u2028\u2029]*$/.test(a
        .replace(/\\["\\\/bfnrtu]/g, "@").replace(
            /(?:"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)[\s\u2028\u2029]*(?=:|,|]|}|$)/g,
            "]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, ""))
};
k.json.errorLogger_ = k.nullFunction;
k.json.setErrorLogger = function (a) {
    k.json.errorLogger_ = a
};
k.json.parse = k.json.USE_NATIVE_JSON ? k.global.JSON.parse : function (a) {
    if (k.json.TRY_NATIVE_JSON) try {
        return k.global.JSON.parse(a)
    } catch (f) {
        var b = f
    }
    a = String(a);
    if (k.json.isValid(a)) try {
        var c = eval("(" + a + ")");
        b && k.json.errorLogger_("Invalid JSON: " + a, b);
        return c
    } catch (f) {}
    throw Error("Invalid JSON string: " + a);
};
k.json.serialize = k.json.USE_NATIVE_JSON ? k.global.JSON.stringify : function (
    a, b) {
    return (new k.json.Serializer(b)).serialize(a)
};
k.json.Serializer = function (a) {
    this.replacer_ = a
};
k.json.Serializer.prototype.serialize = function (a) {
    var b = [];
    Uc(this, a, b);
    return b.join("")
};
var Uc = function (a, b, c) {
    if (null == b) c.push("null");
    else {
        if ("object" == typeof b) {
            if (Array.isArray(b)) {
                var f = b;
                b = f.length;
                c.push("[");
                for (var g = "", h = 0; h < b; h++) c.push(g), g = f[h], Uc(
                    a, a.replacer_ ? a.replacer_.call(f, String(h), g) :
                    g, c), g = ",";
                c.push("]");
                return
            }
            if (b instanceof String || b instanceof Number ||
                b instanceof Boolean) b = b.valueOf();
            else {
                c.push("{");
                h = "";
                for (f in b) Object.prototype.hasOwnProperty.call(b, f) && (
                    g = b[f], "function" != typeof g && (c.push(h), Vc(
                        f, c), c.push(":"), Uc(a, a.replacer_ ? a
                        .replacer_.call(b,
                            f, g) : g, c), h = ","));
                c.push("}");
                return
            }
        }
        switch (typeof b) {
            case "string":
                Vc(b, c);
                break;
            case "number":
                c.push(isFinite(b) && !isNaN(b) ? String(b) : "null");
                break;
            case "boolean":
                c.push(String(b));
                break;
            case "function":
                c.push("null");
                break;
            default:
                throw Error("Unknown type: " + typeof b);
        }
    }
};
k.json.Serializer.charToJsonCharCache_ = {
    '"': '\\"',
    "\\": "\\\\",
    "/": "\\/",
    "\b": "\\b",
    "\f": "\\f",
    "\n": "\\n",
    "\r": "\\r",
    "\t": "\\t",
    "\x0B": "\\u000b"
};
k.json.Serializer.charsToReplace_ = /\uffff/.test("\uffff") ?
    /[\\"\x00-\x1f\x7f-\uffff]/g : /[\\"\x00-\x1f\x7f-\xff]/g;
var Vc = function (a, b) {
    b.push('"', a.replace(k.json.Serializer.charsToReplace_, function (c) {
        var f = k.json.Serializer.charToJsonCharCache_[c];
        f || (f = "\\u" + (c.charCodeAt(0) | 65536).toString(16)
            .substr(1), k.json.Serializer
            .charToJsonCharCache_[c] = f);
        return f
    }), '"')
};
k.json.hybrid = {};
k.json.hybrid.stringify = k.json.USE_NATIVE_JSON ? k.global.JSON.stringify :
    function (a) {
        if (k.global.JSON) try {
            return k.global.JSON.stringify(a)
        } catch (b) {}
        return k.json.serialize(a)
    };
k.json.hybrid.parse_ = function (a) {
    var b = k.json.parse;
    if (k.global.JSON) try {
        var c = k.global.JSON.parse(a);
        k.asserts.assert("object" == typeof c);
        return c
    } catch (f) {}
    return b(a)
};
k.json.hybrid.parse = k.json.USE_NATIVE_JSON ? k.global.JSON.parse : function (
    a) {
    return k.json.hybrid.parse_(a)
};
k.log = {};
k.log.ENABLED = k.debug.LOGGING_ENABLED;
k.log.ROOT_LOGGER_NAME = "";
var Wc = function (a, b) {
    this.name = a;
    this.value = b
};
Wc.prototype.toString = function () {
    return this.name
};
k.log.Level = Wc;
k.log.Level.OFF = new k.log.Level("OFF", Infinity);
k.log.Level.SHOUT = new k.log.Level("SHOUT", 1200);
k.log.Level.SEVERE = new k.log.Level("SEVERE", 1E3);
k.log.Level.WARNING = new k.log.Level("WARNING", 900);
k.log.Level.INFO = new k.log.Level("INFO", 800);
k.log.Level.CONFIG = new k.log.Level("CONFIG", 700);
k.log.Level.FINE = new k.log.Level("FINE", 500);
k.log.Level.FINER = new k.log.Level("FINER", 400);
k.log.Level.FINEST = new k.log.Level("FINEST", 300);
k.log.Level.ALL = new k.log.Level("ALL", 0);
k.log.Level.PREDEFINED_LEVELS = [k.log.Level.OFF, k.log.Level.SHOUT, k.log.Level
    .SEVERE, k.log.Level.WARNING, k.log.Level.INFO, k.log.Level.CONFIG, k
    .log.Level.FINE, k.log.Level.FINER, k.log.Level.FINEST, k.log.Level.ALL
];
k.log.Level.predefinedLevelsCache_ = null;
k.log.Level.createPredefinedLevelsCache_ = function () {
    k.log.Level.predefinedLevelsCache_ = {};
    for (var a = 0, b; b = k.log.Level.PREDEFINED_LEVELS[a]; a++) k.log
        .Level.predefinedLevelsCache_[b.value] = b, k.log.Level
        .predefinedLevelsCache_[b.name] = b
};
k.log.Level.getPredefinedLevel = function (a) {
    k.log.Level.predefinedLevelsCache_ || k.log.Level
        .createPredefinedLevelsCache_();
    return k.log.Level.predefinedLevelsCache_[a] || null
};
k.log.Level.getPredefinedLevelByValue = function (a) {
    k.log.Level.predefinedLevelsCache_ || k.log.Level
        .createPredefinedLevelsCache_();
    if (a in k.log.Level.predefinedLevelsCache_) return k.log.Level
        .predefinedLevelsCache_[a];
    for (var b = 0; b < k.log.Level.PREDEFINED_LEVELS.length; ++b) {
        var c = k.log.Level.PREDEFINED_LEVELS[b];
        if (c.value <= a) return c
    }
    return null
};
var Xc = function () {};
Xc.prototype.getName = function () {};
k.log.Logger = Xc;
k.log.Logger.Level = k.log.Level;
var Yc = function (a) {
        this.capacity_ = "number" === typeof a ? a : k.log.LogBuffer.CAPACITY;
        this.clear()
    },
    Zc = function (a, b, c, f) {
        if (!a.isBufferingEnabled()) return new k.log.LogRecord(b, c, f);
        var g = (a.curIndex_ + 1) % a.capacity_;
        a.curIndex_ = g;
        if (a.isFull_) return a = a.buffer_[g], a.reset(b, c, f), a;
        a.isFull_ = g == a.capacity_ - 1;
        return a.buffer_[g] = new k.log.LogRecord(b, c, f)
    };
Yc.prototype.isBufferingEnabled = function () {
    return 0 < this.capacity_
};
Yc.prototype.clear = function () {
    this.buffer_ = Array(this.capacity_);
    this.curIndex_ = -1;
    this.isFull_ = !1
};
k.log.LogBuffer = Yc;
k.log.LogBuffer.CAPACITY = 0;
k.log.LogBuffer.getInstance = function () {
    k.log.LogBuffer.instance_ || (k.log.LogBuffer.instance_ = new k.log
        .LogBuffer(k.log.LogBuffer.CAPACITY));
    return k.log.LogBuffer.instance_
};
k.log.LogBuffer.isBufferingEnabled = function () {
    return k.log.LogBuffer.getInstance().isBufferingEnabled()
};
var $c = function (a, b, c, f, g) {
    this.reset(a || k.log.Level.OFF, b, c, f, g)
};
$c.prototype.reset = function (a, b) {
    this.level_ = a;
    this.msg_ = b
};
$c.prototype.getLevel = function () {
    return this.level_
};
$c.prototype.setLevel = function (a) {
    this.level_ = a
};
$c.prototype.getMessage = function () {
    return this.msg_
};
k.log.LogRecord = $c;
k.log.LogRecord.nextSequenceNumber_ = 0;
var ad = function (a, b) {
    this.level = null;
    this.handlers = [];
    this.parent = (void 0 === b ? null : b) || null;
    this.children = [];
    this.logger = {
        getName: function () {
            return a
        }
    }
};
ad.prototype.getEffectiveLevel = function () {
    if (this.level) return this.level;
    if (this.parent) return this.parent.getEffectiveLevel();
    k.asserts.fail("Root logger has no level set.");
    return k.log.Level.OFF
};
ad.prototype.publish = function (a) {
    for (var b = this; b;) b.handlers.forEach(function (c) {
        c(a)
    }), b = b.parent
};
k.log.LogRegistryEntry = ad;
var bd = function () {
        this.entries = {};
        var a = new k.log.LogRegistryEntry(k.log.ROOT_LOGGER_NAME);
        a.level = k.log.Level.CONFIG;
        this.entries[k.log.ROOT_LOGGER_NAME] = a
    },
    cd = function (a, b, c) {
        var f = a.entries[b];
        if (f) return void 0 !== c && (f.level = c), f;
        f = b.lastIndexOf(".");
        f = cd(a, b.substr(0, f));
        var g = new k.log.LogRegistryEntry(b, f);
        a.entries[b] = g;
        f.children.push(g);
        void 0 !== c && (g.level = c);
        return g
    };
bd.prototype.getAllLoggers = function () {
    var a = this;
    return Object.keys(this.entries).map(function (b) {
        return a.entries[b].logger
    })
};
k.log.LogRegistry = bd;
k.log.LogRegistry.getInstance = function () {
    k.log.LogRegistry.instance_ || (k.log.LogRegistry.instance_ = new k.log
        .LogRegistry);
    return k.log.LogRegistry.instance_
};
k.log.getLogger = function () {
    return k.log.ENABLED ? cd(k.log.LogRegistry.getInstance(),
        "goog.net.XhrIo", void 0).logger : null
};
k.log.getRootLogger = function () {
    return k.log.ENABLED ? cd(k.log.LogRegistry.getInstance(), k.log
        .ROOT_LOGGER_NAME).logger : null
};
k.log.addHandler = function (a, b) {
    k.log.ENABLED && a && cd(k.log.LogRegistry.getInstance(), a.getName())
        .handlers.push(b)
};
k.log.removeHandler = function (a, b) {
    return k.log.ENABLED && a && (a = cd(k.log.LogRegistry.getInstance(), a
        .getName()), b = a.handlers.indexOf(b), -1 !== b) ? (a.handlers
        .splice(b, 1), !0) : !1
};
k.log.setLevel = function (a, b) {
    k.log.ENABLED && a && (cd(k.log.LogRegistry.getInstance(), a.getName())
        .level = b)
};
k.log.getLevel = function () {
    return null
};
k.log.getEffectiveLevel = function (a) {
    return k.log.ENABLED && a ? cd(k.log.LogRegistry.getInstance(), a
        .getName()).getEffectiveLevel() : k.log.Level.OFF
};
k.log.isLoggable = function (a, b) {
    return k.log.ENABLED && a && b ? b.value >= k.log.getEffectiveLevel(a)
        .value : !1
};
k.log.getAllLoggers = function () {
    return k.log.ENABLED ? k.log.LogRegistry.getInstance().getAllLoggers() :
        []
};
k.log.getLogRecord = function (a, b, c) {
    return Zc(k.log.LogBuffer.getInstance(), b || k.log.Level.OFF, c, a
        .getName())
};
k.log.publishLogRecord = function (a, b) {
    k.log.ENABLED && a && k.log.isLoggable(a, b.getLevel()) && cd(k.log
        .LogRegistry.getInstance(), a.getName()).publish(b)
};
k.log.log = function (a, b, c) {
    if (k.log.ENABLED && a && k.log.isLoggable(a, b)) {
        b = b || k.log.Level.OFF;
        var f = cd(k.log.LogRegistry.getInstance(), a.getName());
        "function" === typeof c && (c = c());
        a = Zc(k.log.LogBuffer.getInstance(), b, c, a.getName());
        f.publish(a)
    }
};
k.log.error = function (a, b, c) {
    k.log.ENABLED && a && k.log.log(a, k.log.Level.SEVERE, b, c)
};
k.log.warning = function (a, b, c) {
    k.log.ENABLED && a && k.log.log(a, k.log.Level.WARNING, b, c)
};
k.log.info = function (a, b, c) {
    k.log.ENABLED && a && k.log.log(a, k.log.Level.INFO, b, c)
};
k.log.fine = function (a, b) {
    k.log.ENABLED && a && k.log.log(a, k.log.Level.FINE, b, void 0)
};
k.net = {};
k.net.ErrorCode = {
    NO_ERROR: 0,
    ACCESS_DENIED: 1,
    FILE_NOT_FOUND: 2,
    FF_SILENT_ERROR: 3,
    CUSTOM_ERROR: 4,
    EXCEPTION: 5,
    HTTP_ERROR: 6,
    ABORT: 7,
    TIMEOUT: 8,
    OFFLINE: 9
};
k.net.ErrorCode.getDebugMessage = function (a) {
    switch (a) {
        case k.net.ErrorCode.NO_ERROR:
            return "No Error";
        case k.net.ErrorCode.ACCESS_DENIED:
            return "Access denied to content document";
        case k.net.ErrorCode.FILE_NOT_FOUND:
            return "File not found";
        case k.net.ErrorCode.FF_SILENT_ERROR:
            return "Firefox silently errored";
        case k.net.ErrorCode.CUSTOM_ERROR:
            return "Application custom error";
        case k.net.ErrorCode.EXCEPTION:
            return "An exception occurred";
        case k.net.ErrorCode.HTTP_ERROR:
            return "Http response at 400 or 500 level";
        case k.net.ErrorCode.ABORT:
            return "Request was aborted";
        case k.net.ErrorCode.TIMEOUT:
            return "Request timed out";
        case k.net.ErrorCode.OFFLINE:
            return "The resource is not available offline";
        default:
            return "Unrecognized error code"
    }
};
k.net.EventType = {
    COMPLETE: "complete",
    SUCCESS: "success",
    ERROR: "error",
    ABORT: "abort",
    READY: "ready",
    READY_STATE_CHANGE: "readystatechange",
    TIMEOUT: "timeout",
    INCREMENTAL_DATA: "incrementaldata",
    PROGRESS: "progress",
    DOWNLOAD_PROGRESS: "downloadprogress",
    UPLOAD_PROGRESS: "uploadprogress"
};
k.net.HttpStatus = {
    CONTINUE: 100,
    SWITCHING_PROTOCOLS: 101,
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NON_AUTHORITATIVE_INFORMATION: 203,
    NO_CONTENT: 204,
    RESET_CONTENT: 205,
    PARTIAL_CONTENT: 206,
    MULTI_STATUS: 207,
    MULTIPLE_CHOICES: 300,
    MOVED_PERMANENTLY: 301,
    FOUND: 302,
    SEE_OTHER: 303,
    NOT_MODIFIED: 304,
    USE_PROXY: 305,
    TEMPORARY_REDIRECT: 307,
    PERMANENT_REDIRECT: 308,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    PAYMENT_REQUIRED: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTABLE: 406,
    PROXY_AUTHENTICATION_REQUIRED: 407,
    REQUEST_TIMEOUT: 408,
    CONFLICT: 409,
    GONE: 410,
    LENGTH_REQUIRED: 411,
    PRECONDITION_FAILED: 412,
    REQUEST_ENTITY_TOO_LARGE: 413,
    REQUEST_URI_TOO_LONG: 414,
    UNSUPPORTED_MEDIA_TYPE: 415,
    REQUEST_RANGE_NOT_SATISFIABLE: 416,
    EXPECTATION_FAILED: 417,
    UNPROCESSABLE_ENTITY: 422,
    LOCKED: 423,
    FAILED_DEPENDENCY: 424,
    PRECONDITION_REQUIRED: 428,
    TOO_MANY_REQUESTS: 429,
    REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
    HTTP_VERSION_NOT_SUPPORTED: 505,
    INSUFFICIENT_STORAGE: 507,
    NETWORK_AUTHENTICATION_REQUIRED: 511,
    QUIRK_IE_NO_CONTENT: 1223
};
k.net.HttpStatus.isSuccess = function (a) {
    switch (a) {
        case k.net.HttpStatus.OK:
        case k.net.HttpStatus.CREATED:
        case k.net.HttpStatus.ACCEPTED:
        case k.net.HttpStatus.NO_CONTENT:
        case k.net.HttpStatus.PARTIAL_CONTENT:
        case k.net.HttpStatus.NOT_MODIFIED:
        case k.net.HttpStatus.QUIRK_IE_NO_CONTENT:
            return !0;
        default:
            return !1
    }
};
k.net.XhrLike = function () {};
d = k.net.XhrLike.prototype;
d.open = function () {};
d.send = function () {};
d.abort = function () {};
d.setRequestHeader = function () {};
d.getResponseHeader = function () {};
d.getAllResponseHeaders = function () {};
k.net.XmlHttpFactory = function () {};
k.net.XmlHttpFactory.prototype.cachedOptions_ = null;
k.net.XmlHttpFactory.prototype.getOptions = function () {
    var a;
    (a = this.cachedOptions_) || (a = {}, dd(this) && (a[k.net.XmlHttp
            .OptionType.USE_NULL_FUNCTION] = !0, a[k.net.XmlHttp
            .OptionType.LOCAL_REQUEST_ERROR] = !0), a = this
        .cachedOptions_ = a);
    return a
};
k.net.WrapperXmlHttpFactory = function (a, b) {
    this.xhrFactory_ = a;
    this.optionsFactory_ = b
};
k.inherits(k.net.WrapperXmlHttpFactory, k.net.XmlHttpFactory);
k.net.WrapperXmlHttpFactory.prototype.createInstance = function () {
    return this.xhrFactory_()
};
k.net.WrapperXmlHttpFactory.prototype.getOptions = function () {
    return this.optionsFactory_()
};
k.net.XmlHttp = function () {
    return k.net.XmlHttp.factory_.createInstance()
};
k.net.XmlHttp.ASSUME_NATIVE_XHR = !1;
k.net.XmlHttpDefines = {};
k.net.XmlHttpDefines.ASSUME_NATIVE_XHR = !1;
k.net.XmlHttp.getOptions = function () {
    return k.net.XmlHttp.factory_.getOptions()
};
k.net.XmlHttp.OptionType = {
    USE_NULL_FUNCTION: 0,
    LOCAL_REQUEST_ERROR: 1
};
k.net.XmlHttp.ReadyState = {
    UNINITIALIZED: 0,
    LOADING: 1,
    LOADED: 2,
    INTERACTIVE: 3,
    COMPLETE: 4
};
k.net.XmlHttp.setFactory = function (a, b) {
    k.net.XmlHttp.setGlobalFactory(new k.net.WrapperXmlHttpFactory(k.asserts
        .assert(a), k.asserts.assert(b)))
};
k.net.XmlHttp.setGlobalFactory = function (a) {
    k.net.XmlHttp.factory_ = a
};
k.net.DefaultXmlHttpFactory = function () {};
k.inherits(k.net.DefaultXmlHttpFactory, k.net.XmlHttpFactory);
k.net.DefaultXmlHttpFactory.prototype.createInstance = function () {
    var a = dd(this);
    return a ? new ActiveXObject(a) : new XMLHttpRequest
};
var dd = function (a) {
    if (k.net.XmlHttp.ASSUME_NATIVE_XHR || k.net.XmlHttpDefines
        .ASSUME_NATIVE_XHR) return "";
    if (!a.ieProgId_ && "undefined" == typeof XMLHttpRequest &&
        "undefined" != typeof ActiveXObject) {
        for (var b = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0",
                "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"
            ], c = 0; c < b.length; c++) {
            var f = b[c];
            try {
                return new ActiveXObject(f), a.ieProgId_ = f
            } catch (g) {}
        }
        throw Error(
            "Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed"
            );
    }
    return a.ieProgId_
};
k.net.XmlHttp.setGlobalFactory(new k.net.DefaultXmlHttpFactory);
k.promise = {};
k.promise.Resolver = function () {};
k.Thenable = function () {};
k.Thenable.prototype.then = function () {};
k.Thenable.IMPLEMENTED_BY_PROP = "$goog_Thenable";
k.Thenable.addImplementation = function (a) {
    a.prototype[k.Thenable.IMPLEMENTED_BY_PROP] = !0
};
k.Thenable.isImplementedBy = function (a) {
    if (!a) return !1;
    try {
        return !!a[k.Thenable.IMPLEMENTED_BY_PROP]
    } catch (b) {
        return !1
    }
};
k.Promise = function (a, b) {
    this.state_ = k.Promise.State_.PENDING;
    this.result_ = void 0;
    this.callbackEntriesTail_ = this.callbackEntries_ = this.parent_ = null;
    this.executing_ = !1;
    0 < k.Promise.UNHANDLED_REJECTION_DELAY ? this.unhandledRejectionId_ =
        0 : 0 == k.Promise.UNHANDLED_REJECTION_DELAY && (this
            .hadUnhandledRejection_ = !1);
    k.Promise.LONG_STACK_TRACES && (this.stack_ = [], ed(this, Error(
        "created")), this.currentStep_ = 0);
    if (a != k.nullFunction) try {
        var c = this;
        a.call(b, function (f) {
            fd(c, k.Promise.State_.FULFILLED, f)
        }, function (f) {
            if (k.DEBUG &&
                !(f instanceof k.Promise.CancellationError))
            try {
                if (f instanceof Error) throw f;
                throw Error("Promise rejected.");
            } catch (g) {}
            fd(c, k.Promise.State_.REJECTED, f)
        })
    } catch (f) {
        fd(this, k.Promise.State_.REJECTED, f)
    }
};
k.Promise.LONG_STACK_TRACES = !1;
k.Promise.UNHANDLED_REJECTION_DELAY = 0;
k.Promise.State_ = {
    PENDING: 0,
    BLOCKED: 1,
    FULFILLED: 2,
    REJECTED: 3
};
k.Promise.CallbackEntry_ = function () {
    this.next = this.context = this.onRejected = this.onFulfilled = this
        .child = null;
    this.always = !1
};
k.Promise.CallbackEntry_.prototype.reset = function () {
    this.context = this.onRejected = this.onFulfilled = this.child = null;
    this.always = !1
};
k.Promise.DEFAULT_MAX_UNUSED = 100;
k.Promise.freelist_ = new k.async.FreeList(function () {
    return new k.Promise.CallbackEntry_
}, function (a) {
    a.reset()
}, k.Promise.DEFAULT_MAX_UNUSED);
k.Promise.getCallbackEntry_ = function (a, b, c) {
    var f = k.Promise.freelist_.get();
    f.onFulfilled = a;
    f.onRejected = b;
    f.context = c;
    return f
};
k.Promise.returnEntry_ = function (a) {
    k.Promise.freelist_.put(a)
};
k.Promise.resolve = function (a) {
    if (a instanceof k.Promise) return a;
    var b = new k.Promise(k.nullFunction);
    fd(b, k.Promise.State_.FULFILLED, a);
    return b
};
k.Promise.reject = function (a) {
    return new k.Promise(function (b, c) {
        c(a)
    })
};
k.Promise.resolveThen_ = function (a, b, c) {
    k.Promise.maybeThen_(a, b, c, null) || k.async.run(k.partial(b, a))
};
k.Promise.race = function (a) {
    return new k.Promise(function (b, c) {
        a.length || b(void 0);
        for (var f = 0, g; f < a.length; f++) g = a[f], k.Promise
            .resolveThen_(g, b, c)
    })
};
k.Promise.all = function (a) {
    return new k.Promise(function (b, c) {
        var f = a.length,
            g = [];
        if (f)
            for (var h = function (E, H) {
                    f--;
                    g[E] = H;
                    0 == f && b(g)
                }, l = function (E) {
                    c(E)
                }, r = 0, v; r < a.length; r++) v = a[r], k.Promise
                .resolveThen_(v, k.partial(h, r), l);
        else b(g)
    })
};
k.Promise.allSettled = function (a) {
    return new k.Promise(function (b) {
        var c = a.length,
            f = [];
        if (c)
            for (var g = function (r, v, E) {
                    c--;
                    f[r] = v ? {
                        fulfilled: !0,
                        value: E
                    } : {
                        fulfilled: !1,
                        reason: E
                    };
                    0 == c && b(f)
                }, h = 0, l; h < a.length; h++) l = a[h], k.Promise
                .resolveThen_(l, k.partial(g, h, !0), k.partial(g,
                    h, !1));
        else b(f)
    })
};
k.Promise.firstFulfilled = function (a) {
    return new k.Promise(function (b, c) {
        var f = a.length,
            g = [];
        if (f)
            for (var h = function (E) {
                    b(E)
                }, l = function (E, H) {
                    f--;
                    g[E] = H;
                    0 == f && c(g)
                }, r = 0, v; r < a.length; r++) v = a[r], k.Promise
                .resolveThen_(v, h, k.partial(l, r));
        else b(void 0)
    })
};
k.Promise.withResolver = function () {
    var a, b, c = new k.Promise(function (f, g) {
        a = f;
        b = g
    });
    return new k.Promise.Resolver_(c, a, b)
};
k.Promise.prototype.then = function (a, b, c) {
    null != a && k.asserts.assertFunction(a,
        "opt_onFulfilled should be a function.");
    null != b && k.asserts.assertFunction(b,
        "opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?"
        );
    k.Promise.LONG_STACK_TRACES && ed(this, Error("then"));
    return gd(this, "function" === typeof a ? a : null, "function" ===
        typeof b ? b : null, c)
};
k.Thenable.addImplementation(k.Promise);
var hd = function (a, b) {
    k.Promise.LONG_STACK_TRACES && ed(a, Error("thenCatch"));
    return gd(a, null, b, void 0)
};
k.Promise.prototype.cancel = function (a) {
    if (this.state_ == k.Promise.State_.PENDING) {
        var b = new k.Promise.CancellationError(a);
        k.async.run(function () {
            id(this, b)
        }, this)
    }
};
var id = function (a, b) {
        if (a.state_ == k.Promise.State_.PENDING)
            if (a.parent_) {
                var c = a.parent_;
                if (c.callbackEntries_) {
                    for (var f = 0, g = null, h = null, l = c
                        .callbackEntries_; l && (l.always || (f++, l.child ==
                            a && (g = l), !(g && 1 < f))); l = l.next) g || (h =
                        l);
                    g && (c.state_ == k.Promise.State_.PENDING && 1 == f ? id(c,
                        b) : (h ? (f = h, k.asserts.assert(c
                            .callbackEntries_), k.asserts.assert(
                            null != f), f.next == c
                        .callbackEntriesTail_ && (c
                            .callbackEntriesTail_ = f), f.next = f
                        .next.next) : jd(c), kd(c, g, k.Promise
                        .State_.REJECTED, b)))
                }
                a.parent_ = null
            } else fd(a, k.Promise.State_.REJECTED,
                b)
    },
    md = function (a, b) {
        a.callbackEntries_ || a.state_ != k.Promise.State_.FULFILLED && a
            .state_ != k.Promise.State_.REJECTED || ld(a);
        k.asserts.assert(null != b.onFulfilled);
        a.callbackEntriesTail_ ? a.callbackEntriesTail_.next = b : a
            .callbackEntries_ = b;
        a.callbackEntriesTail_ = b
    },
    gd = function (a, b, c, f) {
        var g = k.Promise.getCallbackEntry_(null, null, null);
        g.child = new k.Promise(function (h, l) {
            g.onFulfilled = b ? function (r) {
                try {
                    var v = b.call(f, r);
                    h(v)
                } catch (E) {
                    l(E)
                }
            } : h;
            g.onRejected = c ? function (r) {
                try {
                    var v = c.call(f, r);
                    void 0 === v &&
                        r instanceof k.Promise.CancellationError ?
                        l(r) : h(v)
                } catch (E) {
                    l(E)
                }
            } : l
        });
        g.child.parent_ = a;
        md(a, g);
        return g.child
    };
k.Promise.prototype.unblockAndFulfill_ = function (a) {
    k.asserts.assert(this.state_ == k.Promise.State_.BLOCKED);
    this.state_ = k.Promise.State_.PENDING;
    fd(this, k.Promise.State_.FULFILLED, a)
};
k.Promise.prototype.unblockAndReject_ = function (a) {
    k.asserts.assert(this.state_ == k.Promise.State_.BLOCKED);
    this.state_ = k.Promise.State_.PENDING;
    fd(this, k.Promise.State_.REJECTED, a)
};
var fd = function (a, b, c) {
    a.state_ == k.Promise.State_.PENDING && (a === c && (b = k.Promise
            .State_.REJECTED, c = new TypeError(
                "Promise cannot resolve to itself")), a.state_ = k
        .Promise.State_.BLOCKED, k.Promise.maybeThen_(c, a
            .unblockAndFulfill_, a.unblockAndReject_, a) || (a.result_ =
            c, a.state_ = b, a.parent_ = null, ld(a), b != k.Promise
            .State_.REJECTED || c instanceof k.Promise
            .CancellationError || k.Promise.addUnhandledRejection_(a, c)
            ))
};
k.Promise.maybeThen_ = function (a, b, c, f) {
    if (a instanceof k.Promise) return null != b && k.asserts
        .assertFunction(b, "opt_onFulfilled should be a function."),
        null != c && k.asserts.assertFunction(c,
            "opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?"
            ), k.Promise.LONG_STACK_TRACES && ed(a, Error("then")), md(
            a, k.Promise.getCallbackEntry_(b || k.nullFunction, c ||
                null, f)), !0;
    if (k.Thenable.isImplementedBy(a)) return a.then(b, c, f), !0;
    if (k.isObject(a)) try {
        var g = a.then;
        if ("function" === typeof g) return k.Promise.tryThen_(a, g, b,
            c, f), !0
    } catch (h) {
        return c.call(f, h), !0
    }
    return !1
};
k.Promise.tryThen_ = function (a, b, c, f, g) {
    var h = !1,
        l = function (v) {
            h || (h = !0, c.call(g, v))
        },
        r = function (v) {
            h || (h = !0, f.call(g, v))
        };
    try {
        b.call(a, l, r)
    } catch (v) {
        r(v)
    }
};
var ld = function (a) {
        a.executing_ || (a.executing_ = !0, k.async.run(a.executeCallbacks_, a))
    },
    jd = function (a) {
        var b = null;
        a.callbackEntries_ && (b = a.callbackEntries_, a.callbackEntries_ = b
            .next, b.next = null);
        a.callbackEntries_ || (a.callbackEntriesTail_ = null);
        null != b && k.asserts.assert(null != b.onFulfilled);
        return b
    };
k.Promise.prototype.executeCallbacks_ = function () {
    for (var a; a = jd(this);) k.Promise.LONG_STACK_TRACES && this
        .currentStep_++, kd(this, a, this.state_, this.result_);
    this.executing_ = !1
};
var kd = function (a, b, c, f) {
    if (c == k.Promise.State_.REJECTED && b.onRejected && !b.always)
        if (0 < k.Promise.UNHANDLED_REJECTION_DELAY)
            for (; a && a.unhandledRejectionId_; a = a.parent_) k.global
                .clearTimeout(a.unhandledRejectionId_), a
                .unhandledRejectionId_ = 0;
        else if (0 == k.Promise.UNHANDLED_REJECTION_DELAY)
        for (; a && a.hadUnhandledRejection_; a = a.parent_) a
            .hadUnhandledRejection_ = !1;
    if (b.child) b.child.parent_ = null, k.Promise.invokeCallback_(b, c, f);
    else try {
        b.always ? b.onFulfilled.call(b.context) : k.Promise
            .invokeCallback_(b,
                c, f)
    } catch (g) {
        k.Promise.handleRejection_.call(null, g)
    }
    k.Promise.returnEntry_(b)
};
k.Promise.invokeCallback_ = function (a, b, c) {
    b == k.Promise.State_.FULFILLED ? a.onFulfilled.call(a.context, c) : a
        .onRejected && a.onRejected.call(a.context, c)
};
var ed = function (a, b) {
        if (k.Promise.LONG_STACK_TRACES && "string" === typeof b.stack) {
            var c = b.stack.split("\n", 4)[3];
            b = b.message;
            b += Array(11 - b.length).join(" ");
            a.stack_.push(b + c)
        }
    },
    nd = function (a, b) {
        if (k.Promise.LONG_STACK_TRACES && b && "string" === typeof b.stack && a
            .stack_.length) {
            for (var c = ["Promise trace:"], f = a; f; f = f.parent_) {
                for (var g = a.currentStep_; 0 <= g; g--) c.push(f.stack_[g]);
                c.push("Value: [" + (f.state_ == k.Promise.State_.REJECTED ?
                    "REJECTED" : "FULFILLED") + "] <" + String(f
                    .result_) + ">")
            }
            b.stack += "\n\n" + c.join("\n")
        }
    };
k.Promise.addUnhandledRejection_ = function (a, b) {
    0 < k.Promise.UNHANDLED_REJECTION_DELAY ? a.unhandledRejectionId_ = k
        .global.setTimeout(function () {
            nd(a, b);
            k.Promise.handleRejection_.call(null, b)
        }, k.Promise.UNHANDLED_REJECTION_DELAY) : 0 == k.Promise
        .UNHANDLED_REJECTION_DELAY && (a.hadUnhandledRejection_ = !0, k
            .async.run(function () {
                a.hadUnhandledRejection_ && (nd(a, b), k.Promise
                    .handleRejection_.call(null, b))
            }))
};
k.Promise.handleRejection_ = Rc;
k.Promise.setUnhandledRejectionHandler = function (a) {
    k.Promise.handleRejection_ = a
};
k.Promise.CancellationError = function (a) {
    ha.call(this, a)
};
k.inherits(k.Promise.CancellationError, ha);
k.Promise.CancellationError.prototype.name = "cancel";
k.Promise.Resolver_ = function (a, b, c) {
    this.promise = a;
    this.resolve = b;
    this.reject = c
};
k.Timer = function (a, b) {
    k.events.EventTarget.call(this);
    this.interval_ = a || 1;
    this.timerObject_ = b || k.Timer.defaultTimerObject;
    this.boundTick_ = k.bind(this.tick_, this);
    this.last_ = k.now()
};
k.inherits(k.Timer, k.events.EventTarget);
k.Timer.MAX_TIMEOUT_ = 2147483647;
k.Timer.INVALID_TIMEOUT_ID_ = -1;
k.Timer.prototype.enabled = !1;
k.Timer.defaultTimerObject = k.global;
k.Timer.intervalScale = .8;
d = k.Timer.prototype;
d.timer_ = null;
d.setInterval = function (a) {
    this.interval_ = a;
    this.timer_ && this.enabled ? (this.stop(), this.start()) : this
        .timer_ && this.stop()
};
d.tick_ = function () {
    if (this.enabled) {
        var a = k.now() - this.last_;
        0 < a && a < this.interval_ * k.Timer.intervalScale ? this.timer_ =
            this.timerObject_.setTimeout(this.boundTick_, this.interval_ -
                a) : (this.timer_ && (this.timerObject_.clearTimeout(this
                .timer_), this.timer_ = null), this.dispatchEvent(k
                .Timer.TICK), this.enabled && (this.stop(), this
            .start()))
    }
};
d.start = function () {
    this.enabled = !0;
    this.timer_ || (this.timer_ = this.timerObject_.setTimeout(this
        .boundTick_, this.interval_), this.last_ = k.now())
};
d.stop = function () {
    this.enabled = !1;
    this.timer_ && (this.timerObject_.clearTimeout(this.timer_), this
        .timer_ = null)
};
d.disposeInternal = function () {
    k.Timer.superClass_.disposeInternal.call(this);
    this.stop();
    delete this.timerObject_
};
k.Timer.TICK = "tick";
k.Timer.callOnce = function (a, b, c) {
    if ("function" === typeof a) c && (a = k.bind(a, c));
    else if (a && "function" == typeof a.handleEvent) a = k.bind(a
        .handleEvent, a);
    else throw Error("Invalid listener argument");
    return Number(b) > k.Timer.MAX_TIMEOUT_ ? k.Timer.INVALID_TIMEOUT_ID_ :
        k.Timer.defaultTimerObject.setTimeout(a, b || 0)
};
k.Timer.clear = function (a) {
    k.Timer.defaultTimerObject.clearTimeout(a)
};
k.Timer.promise = function (a, b) {
    var c = null;
    return hd(new k.Promise(function (f, g) {
        c = k.Timer.callOnce(function () {
            f(b)
        }, a);
        c == k.Timer.INVALID_TIMEOUT_ID_ && g(Error(
            "Failed to schedule timer."))
    }), function (f) {
        k.Timer.clear(c);
        throw f;
    })
};
k.net.XhrIo = function (a) {
    k.events.EventTarget.call(this);
    this.headers = new k.structs.Map;
    this.xmlHttpFactory_ = a || null;
    this.active_ = !1;
    this.xhrOptions_ = this.xhr_ = null;
    this.lastError_ = this.lastMethod_ = this.lastUri_ = "";
    this.inAbort_ = this.inOpen_ = this.inSend_ = this.errorDispatched_ = !
    1;
    this.timeoutInterval_ = 0;
    this.timeoutId_ = null;
    this.responseType_ = k.net.XhrIo.ResponseType.DEFAULT;
    this.useXhr2Timeout_ = this.progressEventsEnabled_ = this
        .withCredentials_ = !1
};
k.inherits(k.net.XhrIo, k.events.EventTarget);
k.net.XhrIo.ResponseType = {
    DEFAULT: "",
    TEXT: "text",
    DOCUMENT: "document",
    BLOB: "blob",
    ARRAY_BUFFER: "arraybuffer"
};
k.net.XhrIo.prototype.logger_ = k.log.getLogger();
k.net.XhrIo.CONTENT_TYPE_HEADER = "Content-Type";
k.net.XhrIo.CONTENT_TRANSFER_ENCODING = "Content-Transfer-Encoding";
k.net.XhrIo.HTTP_SCHEME_PATTERN = /^https?$/i;
k.net.XhrIo.METHODS_WITH_FORM_DATA = ["POST", "PUT"];
k.net.XhrIo.FORM_CONTENT_TYPE =
    "application/x-www-form-urlencoded;charset=utf-8";
k.net.XhrIo.XHR2_TIMEOUT_ = "timeout";
k.net.XhrIo.XHR2_ON_TIMEOUT_ = "ontimeout";
k.net.XhrIo.sendInstances_ = [];
k.net.XhrIo.send = function (a, b, c, f, g, h, l) {
    var r = new k.net.XhrIo;
    k.net.XhrIo.sendInstances_.push(r);
    b && r.listen(k.net.EventType.COMPLETE, b);
    r.listenOnce(k.net.EventType.READY, r.cleanupSend_);
    h && (r.timeoutInterval_ = Math.max(0, h));
    l && (r.withCredentials_ = l);
    r.send(a, c, f, g);
    return r
};
k.net.XhrIo.cleanup = function () {
    for (var a = k.net.XhrIo.sendInstances_; a.length;) a.pop().dispose()
};
k.net.XhrIo.protectEntryPoints = function (a) {
    k.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = a
        .protectEntryPoint(k.net.XhrIo.prototype
            .onReadyStateChangeEntryPoint_)
};
k.net.XhrIo.prototype.cleanupSend_ = function () {
    this.dispose();
    Aa(k.net.XhrIo.sendInstances_, this)
};
k.net.XhrIo.prototype.send = function (a, b, c, f) {
    if (this.xhr_) throw Error(
        "[goog.net.XhrIo] Object is active with another request=" +
        this.lastUri_ + "; newUri=" + a);
    b = b ? b.toUpperCase() : "GET";
    this.lastUri_ = a;
    this.lastError_ = "";
    this.lastMethod_ = b;
    this.errorDispatched_ = !1;
    this.active_ = !0;
    this.xhr_ = this.xmlHttpFactory_ ? this.xmlHttpFactory_
    .createInstance() : k.net.XmlHttp();
    this.xhrOptions_ = this.xmlHttpFactory_ ? this.xmlHttpFactory_
        .getOptions() : k.net.XmlHttp.getOptions();
    this.xhr_.onreadystatechange = k.bind(this.onReadyStateChange_,
        this);
    this.progressEventsEnabled_ && "onprogress" in this.xhr_ && (this.xhr_
        .onprogress = k.bind(function (h) {
            this.onProgressHandler_(h, !0)
        }, this), this.xhr_.upload && (this.xhr_.upload.onprogress = k
            .bind(this.onProgressHandler_, this)));
    try {
        k.log.fine(this.logger_, od(this, "Opening Xhr")), this.inOpen_ = !
            0, this.xhr_.open(b, String(a), !0), this.inOpen_ = !1
    } catch (h) {
        k.log.fine(this.logger_, od(this, "Error opening Xhr: " + h
            .message));
        this.error_(k.net.ErrorCode.EXCEPTION, h);
        return
    }
    a = c || "";
    var g = this.headers.clone();
    f &&
        k.structs.forEach(f, function (h, l) {
            g.set(l, h)
        });
    f = ra(g.getKeys(), k.net.XhrIo.isContentTypeHeader_);
    c = k.global.FormData && a instanceof k.global.FormData;
    !ua(k.net.XhrIo.METHODS_WITH_FORM_DATA, b) || f || c || g.set(k.net
        .XhrIo.CONTENT_TYPE_HEADER, k.net.XhrIo.FORM_CONTENT_TYPE);
    g.forEach(function (h, l) {
        this.xhr_.setRequestHeader(l, h)
    }, this);
    this.responseType_ && (this.xhr_.responseType = this.responseType_);
    "withCredentials" in this.xhr_ && this.xhr_.withCredentials !== this
        .withCredentials_ && (this.xhr_.withCredentials =
            this.withCredentials_);
    try {
        pd(this), 0 < this.timeoutInterval_ && (this.useXhr2Timeout_ = k.net
                .XhrIo.shouldUseXhr2Timeout_(this.xhr_), k.log.fine(this
                    .logger_, od(this, "Will abort after " + this
                        .timeoutInterval_ + "ms if incomplete, xhr2 " + this
                        .useXhr2Timeout_)), this.useXhr2Timeout_ ? (this
                    .xhr_[k.net.XhrIo.XHR2_TIMEOUT_] = this
                    .timeoutInterval_, this.xhr_[k.net.XhrIo
                        .XHR2_ON_TIMEOUT_] = k.bind(this.timeout_, this)) :
                this.timeoutId_ = k.Timer.callOnce(this.timeout_, this
                    .timeoutInterval_, this)), k.log.fine(this.logger_, od(
                this,
                "Sending request")), this.inSend_ = !0, this.xhr_.send(a),
            this.inSend_ = !1
    } catch (h) {
        k.log.fine(this.logger_, od(this, "Send error: " + h.message)), this
            .error_(k.net.ErrorCode.EXCEPTION, h)
    }
};
k.net.XhrIo.shouldUseXhr2Timeout_ = function (a) {
    return k.userAgent.IE && k.userAgent.isVersionOrHigher(9) &&
        "number" === typeof a[k.net.XhrIo.XHR2_TIMEOUT_] && void 0 !== a[k
            .net.XhrIo.XHR2_ON_TIMEOUT_]
};
k.net.XhrIo.isContentTypeHeader_ = function (a) {
    return k.string.caseInsensitiveEquals(k.net.XhrIo.CONTENT_TYPE_HEADER,
        a)
};
k.net.XhrIo.prototype.timeout_ = function () {
    "undefined" != typeof k && this.xhr_ && (this.lastError_ =
        "Timed out after " + this.timeoutInterval_ + "ms, aborting", k
        .log.fine(this.logger_, od(this, this.lastError_)), this
        .dispatchEvent(k.net.EventType.TIMEOUT), this.abort(k.net
            .ErrorCode.TIMEOUT))
};
k.net.XhrIo.prototype.error_ = function (a, b) {
    this.active_ = !1;
    this.xhr_ && (this.inAbort_ = !0, this.xhr_.abort(), this.inAbort_ = !
    1);
    this.lastError_ = b;
    qd(this);
    rd(this)
};
var qd = function (a) {
    a.errorDispatched_ || (a.errorDispatched_ = !0, a.dispatchEvent(k.net
            .EventType.COMPLETE), a.dispatchEvent(k.net.EventType
        .ERROR))
};
k.net.XhrIo.prototype.abort = function () {
    this.xhr_ && this.active_ && (k.log.fine(this.logger_, od(this,
            "Aborting")), this.active_ = !1, this.inAbort_ = !0, this
        .xhr_.abort(), this.inAbort_ = !1, this.dispatchEvent(k.net
            .EventType.COMPLETE), this.dispatchEvent(k.net.EventType
            .ABORT), rd(this))
};
k.net.XhrIo.prototype.disposeInternal = function () {
    this.xhr_ && (this.active_ && (this.active_ = !1, this.inAbort_ = !0,
        this.xhr_.abort(), this.inAbort_ = !1), rd(this, !0));
    k.net.XhrIo.superClass_.disposeInternal.call(this)
};
k.net.XhrIo.prototype.onReadyStateChange_ = function () {
    if (!this.isDisposed())
        if (this.inOpen_ || this.inSend_ || this.inAbort_) sd(this);
        else this.onReadyStateChangeEntryPoint_()
};
k.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = function () {
    sd(this)
};
var sd = function (a) {
    if (a.active_ && "undefined" != typeof k)
        if (a.xhrOptions_[k.net.XmlHttp.OptionType.LOCAL_REQUEST_ERROR] &&
            td(a) == k.net.XmlHttp.ReadyState.COMPLETE && 2 == a.getStatus()
            ) k.log.fine(a.logger_, od(a,
            "Local request error detected and ignored"));
        else if (a.inSend_ && td(a) == k.net.XmlHttp.ReadyState.COMPLETE) k
        .Timer.callOnce(a.onReadyStateChange_, 0, a);
    else if (a.dispatchEvent(k.net.EventType.READY_STATE_CHANGE), ud(a)) {
        k.log.fine(a.logger_, od(a, "Request complete"));
        a.active_ = !1;
        try {
            if (a.isSuccess()) a.dispatchEvent(k.net.EventType.COMPLETE),
                a.dispatchEvent(k.net.EventType.SUCCESS);
            else {
                try {
                    var b = td(a) > k.net.XmlHttp.ReadyState.LOADED ? a.xhr_
                        .statusText : ""
                } catch (c) {
                    k.log.fine(a.logger_, "Can not get status: " + c
                        .message), b = ""
                }
                a.lastError_ = b + " [" + a.getStatus() + "]";
                qd(a)
            }
        } finally {
            rd(a)
        }
    }
};
k.net.XhrIo.prototype.onProgressHandler_ = function (a, b) {
    k.asserts.assert(a.type === k.net.EventType.PROGRESS,
        "goog.net.EventType.PROGRESS is of the same type as raw XHR progress."
        );
    this.dispatchEvent(k.net.XhrIo.buildProgressEvent_(a, k.net.EventType
        .PROGRESS));
    this.dispatchEvent(k.net.XhrIo.buildProgressEvent_(a, b ? k.net
        .EventType.DOWNLOAD_PROGRESS : k.net.EventType
        .UPLOAD_PROGRESS))
};
k.net.XhrIo.buildProgressEvent_ = function (a, b) {
    return {
        type: b,
        lengthComputable: a.lengthComputable,
        loaded: a.loaded,
        total: a.total
    }
};
var rd = function (a, b) {
        if (a.xhr_) {
            pd(a);
            var c = a.xhr_,
                f = a.xhrOptions_[k.net.XmlHttp.OptionType.USE_NULL_FUNCTION] ?
                k.nullFunction : null;
            a.xhr_ = null;
            a.xhrOptions_ = null;
            b || a.dispatchEvent(k.net.EventType.READY);
            try {
                c.onreadystatechange = f
            } catch (g) {
                k.log.error(a.logger_,
                    "Problem encountered resetting onreadystatechange: " + g
                    .message)
            }
        }
    },
    pd = function (a) {
        a.xhr_ && a.useXhr2Timeout_ && (a.xhr_[k.net.XhrIo.XHR2_ON_TIMEOUT_] =
            null);
        a.timeoutId_ && (k.Timer.clear(a.timeoutId_), a.timeoutId_ = null)
    },
    ud = function (a) {
        return td(a) ==
            k.net.XmlHttp.ReadyState.COMPLETE
    };
k.net.XhrIo.prototype.isSuccess = function () {
    var a = this.getStatus(),
        b;
    if (!(b = k.net.HttpStatus.isSuccess(a))) {
        if (a = 0 === a) a = k.uri.utils.getEffectiveScheme(String(this
            .lastUri_)), a = !k.net.XhrIo.HTTP_SCHEME_PATTERN.test(a);
        b = a
    }
    return b
};
var td = function (a) {
    return a.xhr_ ? a.xhr_.readyState : k.net.XmlHttp.ReadyState
        .UNINITIALIZED
};
k.net.XhrIo.prototype.getStatus = function () {
    try {
        return td(this) > k.net.XmlHttp.ReadyState.LOADED ? this.xhr_
            .status : -1
    } catch (a) {
        return -1
    }
};
k.net.XhrIo.prototype.getResponseHeader = function (a) {
    if (this.xhr_ && ud(this)) return a = this.xhr_.getResponseHeader(a),
        null === a ? void 0 : a
};
k.net.XhrIo.prototype.getAllResponseHeaders = function () {
    return this.xhr_ && ud(this) ? this.xhr_.getAllResponseHeaders() || "" :
        ""
};
var od = function (a, b) {
    return b + " [" + a.lastMethod_ + " " + a.lastUri_ + " " + a
    .getStatus() + "]"
};
k.debug.entryPointRegistry.register(function (a) {
    k.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = a(k.net.XhrIo
        .prototype.onReadyStateChangeEntryPoint_)
});
k.craw.AppAuthenticator = function () {};
