window.hjSiteSettings = window.hjSiteSettings || {
    "site_id": 3538161,
    "r": 1.0,
    "rec_value": 0.1,
    "state_change_listen_mode": "automatic",
    "record": true,
    "continuous_capture_enabled": true,
    "recording_capture_keystrokes": true,
    "session_capture_console_consent": true,
    "anonymize_digits": true,
    "anonymize_emails": true,
    "suppress_all": false,
    "suppress_all_on_specific_pages": [],
    "suppress_text": false,
    "suppress_location": false,
    "user_attributes_enabled": false,
    "legal_name": null,
    "privacy_policy_url": null,
    "deferred_page_contents": [],
    "record_targeting_rules": [],
    "feedback_widgets": [],
    "heatmaps": [],
    "polls": [{
        "id": 913820,
        "created_epoch_time": 1687135334,
        "skin": "light",
        "background": "#FFFFFF",
        "effective_show_branding": true,
        "position": "right",
        "content": {
            "version": 2,
            "questions": [{
                "uuid": "4050a8f9-ba37-4487-bbe9-972642d475bd",
                "type": "rating-scale-5",
                "text": "How would you rate your experience on Scriptchess.com",
                "required": false,
                "nextIfSkipped": "byOrder",
                "scaleCount": 5,
                "labels": [{
                    "text": "Very Bad"
                }, {
                    "text": "Very Good"
                }],
                "next": "byOrder"
            }],
            "thankyou": "Thank you for answering this survey. Your feedback is highly appreciated!"
        },
        "connect_visit_data": "always",
        "ask_for_consent": false,
        "language": "en",
        "display_condition": "immediate",
        "display_delay": 0,
        "persist_condition": "always",
        "targeting_percentage": 100,
        "targeting": [{
            "component": "url",
            "match_operation": "contains",
            "negate": false,
            "pattern": "/",
            "name": null,
            "rule_type": null
        }, {
            "component": "device",
            "match_operation": "exact",
            "negate": false,
            "pattern": "phone",
            "name": null,
            "rule_type": null
        }, {
            "component": "device",
            "match_operation": "exact",
            "negate": false,
            "pattern": "tablet",
            "name": null,
            "rule_type": null
        }, {
            "component": "device",
            "match_operation": "exact",
            "negate": false,
            "pattern": "desktop",
            "name": null,
            "rule_type": null
        }],
        "uuid": "b5615d5a-d148-4578-b75a-53e8e2cb7714",
        "invite": {
            "title": "Your feedback is important to us!",
            "description": "Tell us what you think about this page by taking our quick Survey.",
            "button": "Yes, I will give feedback",
            "close": "No thanks"
        },
        "invite_enabled": false,
        "display_type": "popover",
        "show_legal": false,
        "logo_url": null,
        "button_color": "#324FBE"
    }],
    "integrations": {
        "optimizely": {
            "tag_recordings": false
        },
        "abtasty": {
            "tag_recordings": false
        },
        "mixpanel": {
            "send_events": false
        },
        "unbounce": {
            "tag_recordings": false
        },
        "google_optimize": {
            "tag_recordings": false
        },
        "hubspot": {
            "enabled": false,
            "send_recordings": false,
            "send_surveys": false
        }
    },
    "features": ["ask.separate_service", "ask.use_insights_internal_api", "client_script.compression.pc", "client_script.safe_date", "error_reporting", "feedback.embeddable_widget", "feedback.widgetV2", "heatmap.continuous.manual_retaker", "ingestion.events_v2", "ingestion.http.page_content", "settings.billing_v2", "survey.image_question", "survey.type_button"]
};

! function(e) {
    var t = {};

    function r(n) {
        if (t[n]) return t[n].exports;
        var i = t[n] = {
            i: n,
            l: !1,
            exports: {}
        };
        return e[n].call(i.exports, i, i.exports, r), i.l = !0, i.exports
    }
    r.m = e, r.c = t, r.d = function(e, t, n) {
        r.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: n
        })
    }, r.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }, r.t = function(e, t) {
        if (1 & t && (e = r(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var n = Object.create(null);
        if (r.r(n), Object.defineProperty(n, "default", {
                enumerable: !0,
                value: e
            }), 2 & t && "string" != typeof e)
            for (var i in e) r.d(n, i, function(t) {
                return e[t]
            }.bind(null, i));
        return n
    }, r.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        } : function() {
            return e
        };
        return r.d(t, "a", t), t
    }, r.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, r.p = "", r(r.s = 261)
}({
    261: function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            for (var r = 0; r < t.length; r++) {
                var n = t[r];
                n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
            }
        }
        r.r(t);
        var a, o = function() {
            function e(t) {
                var r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 10,
                    i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1e3;
                n(this, e), this.send = t, this.batchSize = r, this.flushInterval = i, this.buffer = [], this.flushTimer = null
            }
            var t, r, a;
            return t = e, (r = [{
                key: "getBuffer",
                value: function() {
                    return this.buffer
                }
            }, {
                key: "add",
                value: function(e) {
                    var t = this;
                    this.buffer.push(e), this.buffer.length >= this.batchSize ? this.flush() : this.flushTimer || (this.flushTimer = setTimeout((function() {
                        t.flush()
                    }), this.flushInterval))
                }
            }, {
                key: "flush",
                value: function() {
                    this.buffer.length > 0 && (this.send(this.buffer), this.buffer = []), this.flushTimer && (clearTimeout(this.flushTimer), this.flushTimer = null)
                }
            }]) && i(t.prototype, r), a && i(t, a), e
        }();

        function s(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter((function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                }))), r.push.apply(r, n)
            }
            return r
        }

        function u(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? s(Object(r), !0).forEach((function(t) {
                    c(e, t, r[t])
                })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : s(Object(r)).forEach((function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                }))
            }
            return e
        }

        function c(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }
        var l, f = function() {
                try {
                    return "performance" in window && "now" in window.performance
                } catch (e) {
                    return !1
                }
            },
            d = {
                version: 4,
                metricsUrl: (null === (a = window._hjSettings) || void 0 === a ? void 0 : a.metricsUrl) || "https://csmetrics.hotjar.com",
                features: {
                    metrics: {
                        sampling: .1
                    },
                    debug: {
                        flag: "client_script.metrics.debug",
                        sampling: .5
                    }
                },
                browser: {
                    hasPerformance: !1,
                    hasDebug: !1
                },
                buffer: {
                    bufferSize: 40,
                    flushInterval: 2e3
                }
            },
            h = {
                isDebugEnabled: !1,
                isMetricsEnabled: !1,
                loggedMetrics: {},
                genericTags: {}
            },
            g = function(e, t, r) {
                h.loggedMetrics[e] = u(u({}, h.loggedMetrics[e]), {}, c({}, t, r || {}))
            },
            b = function(e) {
                return e && (e.task || e.reason || e.module) || "value"
            },
            v = function(e, t) {
                var r = b(t),
                    n = h.loggedMetrics[e],
                    i = n && n[r] || {};
                return {
                    tagName: r,
                    start: i.start,
                    total: i.total
                }
            },
            p = function(e) {
                var t, r = null !== (t = e.tag) && void 0 !== t ? t : void 0;
                return h.isDebugEnabled ? u(u(u({}, r), e.extraTags), h.genericTags) : r
            },
            m = function(e) {
                if (!l) return !1;
                var t = h.isMetricsEnabled || h.isDebugEnabled;
                return e ? t && e.flush : t
            },
            w = function(e) {
                var t = !1,
                    r = "v=".concat(d.version),
                    n = h.isDebugEnabled ? "".concat(d.metricsUrl, "?").concat(r, "&debug=true") : "".concat(d.metricsUrl, "?").concat(r),
                    i = JSON.stringify(e);
                if ("sendBeacon" in navigator) try {
                    t = navigator.sendBeacon.bind(navigator)(n, i)
                } catch (e) {}
                if (!1 === t) try {
                    var a = new XMLHttpRequest;
                    a.open("POST", n), a.timeout = 1e4, a.send(i)
                } catch (e) {}
                d.browser.hasDebug && console.debug("New metric/log: ", e)
            },
            j = {
                getState: function() {
                    return u({}, h)
                },
                start: function() {
                    try {
                        d.browser = {
                            hasPerformance: f(),
                            hasDebug: /hjDebug=1/.test(location.search)
                        };
                        var e = window.hjSiteSettings || {},
                            t = e.features,
                            r = e.site_id,
                            n = new Set(t),
                            i = d.features,
                            a = i.debug,
                            s = i.metrics;
                        h.genericTags = {
                            site_id: r
                        }, h.isDebugEnabled = n.has(a.flag) && Math.random() <= a.sampling, h.isMetricsEnabled = Math.random() <= s.sampling, l = new o(w, d.buffer.bufferSize, d.buffer.flushInterval)
                    } catch (e) {
                        console.debug("Error in metrics.start", {
                            error: e
                        })
                    }
                },
                reset: function() {
                    h.loggedMetrics = {}
                },
                stop: function() {
                    h.isDebugEnabled = !1, h.isMetricsEnabled = !1, h.genericTags = {}
                },
                count: function(e, t) {
                    var r = t.incr,
                        n = t.tag,
                        i = t.extraTags;
                    try {
                        var a = b(n),
                            o = h.loggedMetrics[e],
                            s = 0;
                        if (r) s = (o && o[a] || 0) + (r.value || 1), h.loggedMetrics[e] = u(u({}, o), {}, c({}, a, (null == r ? void 0 : r.flush) ? 0 : s));
                        else s = 1;
                        if (m(r)) {
                            var f = {
                                name: e,
                                type: "count",
                                value: s,
                                tags: p({
                                    tag: n,
                                    extraTags: i
                                })
                            };
                            l.add(f)
                        }
                    } catch (e) {}
                },
                distr: function(e, t) {
                    var r = t.task,
                        n = t.value,
                        i = t.extraTags;
                    m() && l.add({
                        name: e,
                        type: "distribution",
                        value: n,
                        tags: p({
                            tag: {
                                task: r
                            },
                            extraTags: i
                        })
                    })
                },
                time: function() {
                    try {
                        if (!d.browser.hasPerformance) return;
                        return performance.now()
                    } catch (e) {}
                },
                timeStart: function(e, t) {
                    try {
                        var r = j.time(),
                            n = v(e, t).tagName;
                        return g(e, n, {
                            start: r
                        }), r
                    } catch (e) {}
                },
                timeEnd: function(e, t) {
                    var r = t.tag,
                        n = t.incr,
                        i = t.extraTags;
                    try {
                        var a = j.time();
                        if (!a) return;
                        var o, s = v(e, r),
                            u = s.start,
                            c = s.tagName,
                            f = s.total;
                        if (n) {
                            var d, h = null !== (d = n.total) && void 0 !== d ? d : n.start && a - n.start;
                            o = h ? (f || 0) + h : f;
                            var b = n.flush ? void 0 : {
                                total: o
                            };
                            g(e, c, b)
                        } else o = u ? a - u : void 0, g(e, c);
                        if (o && m(n)) {
                            var w = {
                                name: e,
                                type: "distribution",
                                value: Math.round(o),
                                tags: p({
                                    tag: r,
                                    extraTags: i
                                })
                            };
                            l.add(w)
                        }
                        return a
                    } catch (t) {
                        console.debug("Failed to send timer metric: ", {
                            name: e,
                            tag: r,
                            error: t
                        })
                    }
                },
                timeWatcher: function() {
                    var e, t = 0,
                        r = !1,
                        n = function() {
                            var r, n = j.time();
                            return t += null !== (r = e && n && n - e) && void 0 !== r ? r : 0, e = j.time(), t
                        };
                    return {
                        start: function() {
                            if (!r) return r = !0, e = j.time()
                        },
                        incr: n,
                        end: function() {
                            var r = n();
                            return t = 0, e = void 0, r
                        }
                    }
                }
            };
        window.hj = window.hj || function() {
            for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++) t[r] = arguments[r];
            (window.hj.q = window.hj.q || []).push(t)
        }, window.hj.metrics = j, hj.metrics.start(), hj.metrics.timeStart("time-to-first-event", null), window.hjBootstrap = window.hjBootstrap || function(e, t, r) {
            var n = ["bot", "google", "headless", "baidu", "bing", "msn", "duckduckbot", "teoma", "slurp", "yandex", "phantomjs", "pingdom", "ahrefsbot"].join("|"),
                i = new RegExp(n, "i"),
                a = window.navigator || {
                    userAgent: "unknown"
                },
                o = a.userAgent ? a.userAgent : "unknown";
            if (i.test(o)) return hj.metrics.count("session-rejection", {
                tag: {
                    reason: "bot"
                }
            }), void console.warn("Hotjar not launching due to suspicious userAgent:", o);
            
            
            var c = function(e, t, r) {
                window.hjBootstrapCalled = (window.hjBootstrapCalled || []).concat(r), window.hj && window.hj._init && window.hj._init._verifyInstallation && hj._init._verifyInstallation()
            };
            c(0, 0, r);
            var l = window.document,
                f = l.head || l.getElementsByTagName("head")[0];
            hj.scriptDomain = e;
            var d = l.createElement("script");
            d.async = 1, d.src = hj.scriptDomain + t, d.charset = "utf-8", f.appendChild(d), c.revision = "08305ca", window.hjBootstrap = c
        }, window.hjBootstrap("/assets/js/", "modules.d300ab0f8311d57bf5d6.js", "3538161"), window.hjLazyModules = window.hjLazyModules || {
            SURVEY_V2: {
                js: "survey-v2.3c47d1f50cc0477e851b.js"
            },
            SURVEY_BOOTSTRAPPER: {
                js: "survey-bootstrapper.b3d222c026ccdc2df6eb.js"
            },
            SURVEY_ISOLATED: {
                js: "survey-isolated.caf2882ed241e9a79825.js"
            },
            HEATMAP_RETAKER: {
                js: "heatmap-retaker.64f646f2511bbbcda730.js"
            },
            SURVEY_INVITATION: {
                js: "survey-invitation.63900c84c0e4a87bd9b0.js"
            },
            NOTIFICATION: {
                js: "notification.751ff0456424e2536c25.js"
            },
            INCOMING_FEEDBACK: {
                js: "incoming-feedback.51bbe0ab1b737fa2727e.js"
            },
            PREACT_INCOMING_FEEDBACK: {
                js: "preact-incoming-feedback.37678575514baf421b13.js"
            },
            SENTRY: {
                js: "sentry.8ac7f7801862d591422a.js"
            }
        }
    }
});