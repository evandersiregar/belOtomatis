(function() {
var on = addEventListener,
    off = removeEventListener,
    $ = function(q) {
        return document.querySelector(q);
    },
    $$ = function(q) {
        return document.querySelectorAll(q);
    },
    $body = document.body,
    $inner = $(".inner"),
    client = (function() {
        var o = {
                browser: "other",
                browserVersion: 0,
                os: "other",
                osVersion: 0,
                mobile: false,
                canUse: null,
                flags: {
                    lsdUnits: false
                },
            },
            ua = navigator.userAgent,
            a,
            i;
        a = [
            ["firefox", /Firefox\/([0-9\.]+)/],
            ["edge", /Edge\/([0-9\.]+)/],
            ["safari", /Version\/([0-9\.]+).+Safari/],
            ["chrome", /Chrome\/([0-9\.]+)/],
            ["chrome", /CriOS\/([0-9\.]+)/],
            ["ie", /Trident\/.+rv:([0-9]+)/],
        ];
        for (i = 0; i < a.length; i++) {
            if (ua.match(a[i][1])) {
                o.browser = a[i][0];
                o.browserVersion = parseFloat(RegExp.$1);
                break;
            }
        }
        a = [
            [
                "ios",
                /([0-9_]+) like Mac OS X/,
                function(v) {
                    return v.replace("_", ".").replace("_", "");
                },
            ],
            [
                "ios",
                /CPU like Mac OS X/,
                function(v) {
                    return 0;
                },
            ],
            [
                "ios",
                /iPad; CPU/,
                function(v) {
                    return 0;
                },
            ],
            ["android", /Android ([0-9\.]+)/, null],
            [
                "mac",
                /Macintosh.+Mac OS X ([0-9_]+)/,
                function(v) {
                    return v.replace("_", ".").replace("_", "");
                },
            ],
            ["windows", /Windows NT ([0-9\.]+)/, null],
            ["undefined", /Undefined/, null],
        ];
        for (i = 0; i < a.length; i++) {
            if (ua.match(a[i][1])) {
                o.os = a[i][0];
                o.osVersion = parseFloat(
                    a[i][2] ? a[i][2](RegExp.$1) : RegExp.$1
                );
                break;
            }
        }
        if (
            o.os == "mac" &&
            "ontouchstart" in window &&
            ((screen.width == 1024 && screen.height == 1366) ||
                (screen.width == 834 && screen.height == 1112) ||
                (screen.width == 810 && screen.height == 1080) ||
                (screen.width == 768 && screen.height == 1024))
        )
            o.os = "ios";
        o.mobile = o.os == "android" || o.os == "ios";
        var _canUse = document.createElement("div");
        o.canUse = function(property, value) {
            var style;
            style = _canUse.style;
            if (!(property in style)) return false;
            if (typeof value !== "undefined") {
                style[property] = value;
                if (style[property] == "") return false;
            }
            return true;
        };
        o.flags.lsdUnits = o.canUse("width", "100dvw");
        return o;
    })(),
    trigger = function(t) {
        dispatchEvent(new Event(t));
    },
    cssRules = function(selectorText) {
        var ss = document.styleSheets,
            a = [],
            f = function(s) {
                var r = s.cssRules,
                    i;
                for (i = 0; i < r.length; i++) {
                    if (
                        r[i] instanceof CSSMediaRule &&
                        matchMedia(r[i].conditionText).matches
                    )
                        f(r[i]);
                    else if (
                        r[i] instanceof CSSStyleRule &&
                        r[i].selectorText == selectorText
                    )
                        a.push(r[i]);
                }
            },
            x,
            i;
        for (i = 0; i < ss.length; i++) f(ss[i]);
        return a;
    },
    thisHash = function() {
        var h = location.hash ? location.hash.substring(1) : null,
            a;
        if (!h) return null;
        if (h.match(/\?/)) {
            a = h.split("?");
            h = a[0];
            history.replaceState(undefined, undefined, "#" + h);
            window.location.search = a[1];
        }
        if (h.length > 0 && !h.match(/^[a-zA-Z]/)) h = "x" + h;
        if (typeof h == "string") h = h.toLowerCase();
        return h;
    },
    scrollToElement = function(e, style, duration) {
        var y, cy, dy, start, easing, offset, f;
        if (!e) y = 0;
        else {
            offset =
                (e.dataset.scrollOffset ?
                    parseInt(e.dataset.scrollOffset) :
                    0) *
                parseFloat(getComputedStyle(document.documentElement).fontSize);
            switch (
                e.dataset.scrollBehavior ? e.dataset.scrollBehavior : "default"
            ) {
                case "default":
                default:
                    y = e.offsetTop + offset;
                    break;
                case "center":
                    if (e.offsetHeight < window.innerHeight)
                        y =
                        e.offsetTop -
                        (window.innerHeight - e.offsetHeight) / 2 +
                        offset;
                    else y = e.offsetTop - offset;
                    break;
                case "previous":
                    if (e.previousElementSibling)
                        y =
                        e.previousElementSibling.offsetTop +
                        e.previousElementSibling.offsetHeight +
                        offset;
                    else y = e.offsetTop + offset;
                    break;
            }
        }
        if (!style) style = "smooth";
        if (!duration) duration = 750;
        if (style == "instant") {
            window.scrollTo(0, y);
            return;
        }
        start = Date.now();
        cy = window.scrollY;
        dy = y - cy;
        switch (style) {
            case "linear":
                easing = function(t) {
                    return t;
                };
                break;
            case "smooth":
                easing = function(t) {
                    return t < 0.5 ?
                        4 * t * t * t :
                        (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
                };
                break;
        }
        f = function() {
            var t = Date.now() - start;
            if (t >= duration) window.scroll(0, y);
            else {
                window.scroll(0, cy + dy * easing(t / duration));
                requestAnimationFrame(f);
            }
        };
        f();
    },
    scrollToTop = function() {
        scrollToElement(null);
    },
    loadElements = function(parent) {
        var a, e, x, i;
        a = parent.querySelectorAll('iframe[data-src]:not([data-src=""])');
        for (i = 0; i < a.length; i++) {
            a[i].contentWindow.location.replace(a[i].dataset.src);
            a[i].dataset.initialSrc = a[i].dataset.src;
            a[i].dataset.src = "";
        }
        a = parent.querySelectorAll("video[autoplay]");
        for (i = 0; i < a.length; i++) {
            if (a[i].paused) a[i].play();
        }
        e = parent.querySelector('[data-autofocus="1"]');
        x = e ? e.tagName : null;
        switch (x) {
            case "FORM":
                e = e.querySelector(
                    ".field input, .field select, .field textarea"
                );
                if (e) e.focus();
                break;
            default:
                break;
        }
    },
    unloadElements = function(parent) {
        var a, e, x, i;
        a = parent.querySelectorAll('iframe[data-src=""]');
        for (i = 0; i < a.length; i++) {
            if (a[i].dataset.srcUnload === "0") continue;
            if ("initialSrc" in a[i].dataset)
                a[i].dataset.src = a[i].dataset.initialSrc;
            else a[i].dataset.src = a[i].src;
            a[i].contentWindow.location.replace("about:blank");
        }
        a = parent.querySelectorAll("video");
        for (i = 0; i < a.length; i++) {
            if (!a[i].paused) a[i].pause();
        }
        e = $(":focus");
        if (e) e.blur();
    };
window._scrollToTop = scrollToTop;
var thisURL = function() {
    return window.location.href
        .replace(window.location.search, "")
        .replace(/#$/, "");
};
var getVar = function(name) {
    var a = window.location.search.substring(1).split("&"),
        b,
        k;
    for (k in a) {
        b = a[k].split("=");
        if (b[0] == name) return b[1];
    }
    return null;
};
var errors = {
    handle: function(handler) {
        window.onerror = function(message, url, line, column, error) {
            handler(error.message);
            return true;
        };
    },
    unhandle: function() {
        window.onerror = null;
    },
};
var db = {
    open: function(objectStoreName, handler) {
        var request = indexedDB.open("carrd.html");
        request.onupgradeneeded = function(event) {
            event.target.result.createObjectStore(objectStoreName, {
                keyPath: "id",
            });
        };
        request.onsuccess = function(event) {
            handler(
                event.target.result
                .transaction([objectStoreName], "readwrite")
                .objectStore(objectStoreName)
            );
        };
    },
    put: function(objectStore, values, handler) {
        var request = objectStore.put(values);
        request.onsuccess = function(event) {
            handler();
        };
        request.onerror = function(event) {
            throw new Error("db.put: error");
        };
    },
    get: function(objectStore, id, handler) {
        var request = objectStore.get(id);
        request.onsuccess = function(event) {
            if (!event.target.result)
                throw new Error(
                    'db.get: could not retrieve object with id "' + id + '"'
                );
            handler(event.target.result);
        };
        request.onerror = function(event) {
            throw new Error("db.get: error");
        };
    },
    delete: function(objectStore, id, handler) {
        objectStore.delete(id).onsuccess = function(event) {
            handler(event.target.result);
        };
    },
};
var loadHandler = function() {
    setTimeout(function() {
        $body.classList.remove("is-loading");
        $body.classList.add("is-playing");
        setTimeout(function() {
            $body.classList.remove("is-playing");
            $body.classList.add("is-ready");
        }, 2625);
    }, 100);
};
on("load", loadHandler);
loadElements(document.body);
var style, sheet, rule;
style = document.createElement("style");
style.appendChild(document.createTextNode(""));
document.head.appendChild(style);
sheet = style.sheet;
if (client.mobile) {
    (function() {
        if (client.flags.lsdUnits) {
            document.documentElement.style.setProperty(
                "--viewport-height",
                "100svh"
            );
            document.documentElement.style.setProperty(
                "--background-height",
                "100dvh"
            );
        } else {
            var f = function() {
                document.documentElement.style.setProperty(
                    "--viewport-height",
                    window.innerHeight + "px"
                );
                document.documentElement.style.setProperty(
                    "--background-height",
                    window.innerHeight + 250 + "px"
                );
            };
            on("load", f);
            on("orientationchange", function() {
                setTimeout(function() {
                    f();
                }, 100);
            });
        }
    })();
}
if (client.os == "android") {
    (function() {
        sheet.insertRule("body::after { }", 0);
        rule = sheet.cssRules[0];
        var f = function() {
            rule.style.cssText =
                "height: " + Math.max(screen.width, screen.height) + "px";
        };
        on("load", f);
        on("orientationchange", f);
        on("touchmove", f);
    })();
    $body.classList.add("is-touch");
} else if (client.os == "ios") {
    if (client.osVersion <= 11)
        (function() {
            sheet.insertRule("body::after { }", 0);
            rule = sheet.cssRules[0];
            rule.style.cssText = "-webkit-transform: scale(1.0)";
        })();
    if (client.osVersion <= 11)
        (function() {
            sheet.insertRule("body.ios-focus-fix::before { }", 0);
            rule = sheet.cssRules[0];
            rule.style.cssText = "height: calc(100% + 60px)";
            on(
                "focus",
                function(event) {
                    $body.classList.add("ios-focus-fix");
                },
                true
            );
            on(
                "blur",
                function(event) {
                    $body.classList.remove("ios-focus-fix");
                },
                true
            );
        })();
    $body.classList.add("is-touch");
}

function form(id, settings) {
    var _this = this;
    this.id = id;
    this.mode = settings.mode;
    this.method = settings.method;
    this.code = "code" in settings ? settings.code : null;
    this.success = settings.success;
    this.initHandler =
        "initHandler" in settings ? settings.initHandler : null;
    this.presubmitHandler =
        "presubmitHandler" in settings ? settings.presubmitHandler : null;
    this.failure = "failure" in settings ? settings.failure : null;
    this.optional = "optional" in settings ? settings.optional : [];
    this.events = "events" in settings ? settings.events : {};
    this.recaptcha = "recaptcha" in settings ? settings.recaptcha : null;
    this.exportVariables =
        "exportVariables" in settings ? settings.exportVariables : false;
    this.$form = $("#" + this.id);
    this.$form.addEventListener("change", function(event) {
        if (event.target.tagName != "INPUT") return;
        _this.refreshInput(event.target);
    });
    this.$form.addEventListener("submit", function(event) {
        event.preventDefault();
        event.stopPropagation();
        _this.triggerSubmit();
    });
    this.$form.addEventListener("reset", function(event) {
        setTimeout(function() {
            _this.refreshInputs();
        }, 0);
    });
    this.$form.addEventListener("keydown", function(event) {
        if (event.keyCode == 13 && event.ctrlKey) {
            event.preventDefault();
            event.stopPropagation();
            _this.triggerSubmit();
        }
    });
    var x = $("#" + this.id + ' input[name="' + settings.hid + '"]');
    if (x) {
        x.disabled = true;
        x.parentNode.style.display = "none";
    }
    this.$submit = $("#" + this.id + ' .actions button[type="submit"]');
    this.$submit.disabled = false;
    this.initInputs();
    if (this.initHandler) {
        errors.handle(function(message) {
            return _this.failureHandler(message);
        });
        if (!this.initHandler()) errors.unhandle();
    }
    if (this.recaptcha) {
        grecaptcha.ready(function() {
            var id;
            id = grecaptcha.render(_this.$submit, {
                sitekey: _this.recaptcha.key,
                isolated: true,
                theme: _this.recaptcha.darkMode ? "dark" : "light",
                callback: function(token) {
                    _this.submit({
                        recaptchaToken: token
                    }, [
                        "g-recaptcha-response",
                    ]);
                    grecaptcha.reset(id);
                },
            });
        });
    }
}
form.prototype.completionHandler = function(
    properties,
    eventHandler,
    response
) {
    if (eventHandler !== null) eventHandler.apply(this.$form, [response]);
    switch (properties.mode) {
        default:
        case 1:
            alert(this.expandVariables(properties.value));
            break;
        case 2:
            location.href = this.expandVariables(properties.value);
            break;
        case 3:
            properties.value.apply(this.$form, [response]);
            break;
        case 4:
            break;
    }
};
form.prototype.failureHandler = function(message) {
    var eventHandler;
    console.log("failed (" + message + ")");
    eventHandler =
        "onfailure" in this.events ? this.events.onfailure : null;
    if (message.match(/ALERT:/))
        this.completionHandler({
                mode: 1,
                value: message.substring(message.indexOf("ALERT:") + 7),
            },
            eventHandler,
            null
        );
    else if (this.failure)
        this.completionHandler(this.failure, eventHandler, null);
    else
        this.completionHandler({
                mode: 1,
                value: message
            },
            eventHandler,
            null
        );
    this.waiting(false);
    errors.unhandle();
    return true;
};
form.prototype.finalizeInput = function(input) {
    try {
        if (!input || typeof input != "object" || !("name" in input))
            throw "Not an input.";
        if (!("value" in input)) throw 'Missing "value" property.';
        if (
            input.type == "text" ||
            input.type == "email" ||
            input.type == "textarea" ||
            input.type == "hidden"
        )
            input.value = input.value.replace(/^\s+/, "").replace(/\s+$/, "");
    } catch (e) {}
};
form.prototype.getAmount = function() {
    var x;
    x = this.getRequiredInputValue("amount", ["select-one", "number"]);
    if (!x) return null;
    x = parseFloat(x);
    if (isNaN(x) || x < 1.0 || x > 100000.0) return null;
    return x;
};
form.prototype.getEmail = function() {
    return this.getRequiredInputValue("email", "email");
};
form.prototype.getRequiredInputValue = function(name, type) {
    var input;
    for (input of this.$form.elements) {
        if (
            ((Array.isArray(type) && type.includes(input.type)) ||
                input.type == type) &&
            input.name == name &&
            input.value !== "" &&
            input.value !== null
        )
            return input.value;
    }
    return null;
};
form.prototype.initInputs = function() {
    var _this = this,
        i,
        input;
    for (i = 0; i < this.$form.elements.length; i++) {
        input = this.$form.elements[i];
        switch (input.type) {
            case "number":
                (function(input) {
                    var p = input.parentNode,
                        decrement = p.querySelector("button.decrement"),
                        increment = p.querySelector("button.increment");
                    input.addEventListener("blur", function(event) {
                        _this.normalizeNumberInput(input);
                    });
                    if (decrement && increment) {
                        decrement.addEventListener("click", function(event) {
                            event.preventDefault();
                            _this.normalizeNumberInput(input);
                            input.stepDown(1);
                            _this.normalizeNumberInput(input);
                        });
                        increment.addEventListener("click", function(event) {
                            event.preventDefault();
                            _this.normalizeNumberInput(input);
                            input.stepUp(1);
                            _this.normalizeNumberInput(input);
                        });
                    }
                })(input);
                break;
            case "file":
                (function(input) {
                    var p = input.parentNode,
                        select = p.querySelector("button.select");
                    select.addEventListener("click", function(event) {
                        event.preventDefault();
                        input.click();
                    });
                    input.addEventListener("focus", function(event) {
                        event.target.parentNode.classList.add("focus");
                    });
                    input.addEventListener("blur", function(event) {
                        event.target.parentNode.classList.remove("focus");
                    });
                })(input);
                break;
            case "text":
            case "textarea":
            case "email":
                input.addEventListener("blur", function(event) {
                    this.value = this.value
                        .replace(/^\s+/, "")
                        .replace(/\s+$/, "");
                });
                break;
        }
        this.refreshInput(input);
    }
};
form.prototype.isAllowedInput = function(input, ignore) {
    try {
        if (!input || typeof input != "object" || !("name" in input))
            throw "Not an input.";
        if (ignore && ignore.indexOf(input.name) != -1)
            throw "Input is ignored.";
        if (input.disabled) throw "Input is disabled.";
        switch (input.type) {
            case "text":
            case "email":
            case "textarea":
            case "select-one":
            case "checkbox":
            case "number":
            case "tel":
            case "file":
            case "hidden":
                break;
            default:
                throw "Not an allowed input.";
        }
    } catch (e) {
        return false;
    }
    return true;
};
form.prototype.isValidInput = function(input) {
    var result = false;
    switch (input.type) {
        case "email":
            result = input.value.match(
                new RegExp(
                    "^([a-zA-Z0-9\\_\\-\\.\\+]+)@([a-zA-Z0-9\\-\\.]+)\\.([a-zA-Z]+)$"
                )
            );
            break;
        case "select-one":
            result = input.value.match(new RegExp("^[^\\<\\>]+$"));
            break;
        case "checkbox":
            result = true;
            break;
        case "number":
            result = input.value.match(new RegExp("^[0-9\\-\\.]+$"));
            break;
        case "tel":
            result = input.value.match(
                new RegExp("^[0-9\\-\\+\\(\\)\\ \\#\\*]+$")
            );
            break;
        case "file":
            result = true;
            break;
        default:
        case "text":
        case "textarea":
        case "hidden":
            result = input.value.match(new RegExp("^[^\\<\\>]+$"));
            break;
    }
    return result;
};
form.prototype.normalizeNumberInput = function(input) {
    var min = parseFloat(input.min),
        max = parseFloat(input.max),
        step = parseFloat(input.step),
        v = parseFloat(input.value);
    if (isNaN(v)) {
        if (!input.required) {
            input.value = null;
            return;
        }
        v = isNaN(min) ? 0 : min;
    }
    if (!isNaN(min) && v < min) v = min;
    if (!isNaN(max) && v > max) v = max;
    if (!isNaN(step) && v % step !== 0) v = Math.round(v / step) * step;
    switch (input.dataset.category) {
        case "currency":
            v = parseFloat(v).toFixed(2);
            break;
        default:
        case "decimal":
            v = parseFloat(v);
            break;
        case "integer":
            v = parseInt(v);
            break;
    }
    input.value = v;
};
form.prototype.expandVariables = function(s) {
    if (typeof variables === "undefined") return s;
    if (variables.hasVariables(s)) {
        for (input of this.$form.elements) {
            if (!this.isAllowedInput(input)) continue;
            value = "";
            if (this.isValidInput(input)) {
                switch (input.type) {
                    case "checkbox":
                        value = input.checked ? "true" : "false";
                        break;
                    case "email":
                    case "select-one":
                    case "number":
                    case "tel":
                    case "text":
                    case "textarea":
                    case "hidden":
                        value = input.value;
                        break;
                    default:
                        value = "";
                        break;
                }
            } else value = "";
            if (
                !!s.match(
                    /^(#[a-zA-Z0-9\_\-]+|[a-z0-9\-\.]+:[a-zA-Z0-9\~\!\@\#$\%\&\-\_\+\=\;\,\.\?\/\:\{\}\|]+)$/
                )
            )
                value = encodeURIComponent(value);
            s = variables.expandVariable(s, input.name, value);
        }
    }
    s = variables.expandVariableString(this.$form, s);
    return s;
};
form.prototype.exportVariableValues = function(source, values) {
    if (typeof variables === "undefined" || this.exportVariables !== true)
        return;
    variables.import(source, values);
};
form.prototype.pause = function(values, handler) {
    var _this = this;
    this.waiting(true);
    db.open("formData.html", function(objectStore) {
        db.delete(objectStore, _this.id, function() {
            db.put(objectStore, values, function() {
                handler.call(_this);
            });
        });
    });
};
form.prototype.refreshInput = function(input) {
    var a = [],
        p;
    switch (input.type) {
        case "file":
            p = input.parentNode;
            if (input.files.length > 0)
                p.setAttribute("data-filename", input.files[0].name);
            else p.setAttribute("data-filename", "");
            break;
        default:
            break;
    }
};
form.prototype.refreshInputs = function() {
    var i;
    for (i = 0; i < this.$form.elements.length; i++)
        this.refreshInput(this.$form.elements[i]);
};
form.prototype.resume = function(handler) {
    var _this = this;
    this.waiting(true);
    this.scrollIntoView();
    db.open("formData.html", function(objectStore) {
        db.get(objectStore, _this.id, function(values) {
            db.delete(objectStore, _this.id, function() {
                var e, i, v;
                for (i in _this.$form.elements) {
                    e = _this.$form.elements[i];
                    if (!e.name) continue;
                    v = e.name in values ? values[e.name] : null;
                    switch (e.type) {
                        case "checkbox":
                            e.checked = v == "checked" ? true : false;
                            break;
                        case "file":
                            if (v) e.parentNode.setAttribute("data-filename", v
                                .name);
                            break;
                        default:
                            e.value = v;
                            break;
                    }
                }
                handler.call(_this, values);
            });
        });
    });
};
form.prototype.scrollIntoView = function() {
    window.scrollTo(0, this.$form.offsetTop);
};
form.prototype.submit = function(values, ignore) {
    var _this = this,
        input,
        result,
        _success,
        _failure,
        a,
        i,
        e,
        fd,
        k,
        x;
    try {
        for (input of this.$form.elements) {
            if (!this.isAllowedInput(input, ignore)) continue;
            if (
                this.optional.indexOf(input.name) !== -1 &&
                (input.value === "" ||
                    input.value === null ||
                    (input.type == "checkbox" && !input.checked))
            )
                continue;
            this.finalizeInput(input);
            if (!this.isValidInput(input)) throw "Not valid.";
        }
    } catch (e) {
        this.notify(
            "failure",
            "Missing or invalid fields. Please try again."
        );
        return;
    }
    if ("onsubmit" in this.events) {
        if (this.events.onsubmit.apply(this.$form) === false) return;
    }
    switch (this.method) {
        default:
        case "ajax":
            break;
        case "get":
        case "post":
            this.$form.submit();
            return;
        case "code":
            if (typeof this.code == "function") {
                this.waiting(true);
                _success = function() {
                    _this.completionHandler(
                        _this.success,
                        "onsuccess" in _this.events ? _this.events.onsuccess : null,
                        null
                    );
                    _this.waiting(false);
                };
                _failure = function() {
                    _this.completionHandler(
                        _this.failure,
                        "onfailure" in _this.events ? _this.events.onfailure : null,
                        null
                    );
                    _this.waiting(false);
                };
                result = this.code.apply(this.$form, [_success, _failure]);
                if (result === true) _success();
                else if (result === false) _failure();
            }
            return;
    }
    if ((x = $(":focus"))) x.blur();
    errors.handle(function(message) {
        return _this.failureHandler(message);
    });
    a = this.values();
    if (values) {
        for (k in values) a[k] = values[k];
    }
    if (this.presubmitHandler) this.presubmitHandler.call(this, a);
    else this.submitHandler(a);
};
form.prototype.submitHandler = function(values) {
    var _this = this,
        x,
        k,
        data;
    this.waiting(true);
    data = new FormData();
    for (k in values) {
        if (
            values[k] &&
            typeof values[k] == "object" &&
            "blob" in values[k]
        )
            data.append(k, values[k].blob, values[k].name);
        else data.append(k, values[k]);
    }
    x = new XMLHttpRequest();
    x.open("POST.html", ["", "post", this.mode].join("index.html"));
    x.send(data);
    x.onreadystatechange = function() {
        var o;
        if (x.readyState != 4) return;
        if (x.status != 200)
            throw new Error("Failed server response (" + x.status + ")");
        try {
            o = JSON.parse(x.responseText);
        } catch (e) {
            throw new Error("Invalid server response");
        }
        if (!("result" in o) || !("message" in o))
            throw new Error("Incomplete server response");
        if (o.result !== true) throw new Error(o.message);
        _this.exportVariableValues(_this.id, values);
        if ("response" in o)
            _this.exportVariableValues(_this.id + "_response", o.response);
        _this.completionHandler(
            _this.success,
            "onsuccess" in _this.events ? _this.events.onsuccess : null,
            "response" in o ? o.response : null
        );
        _this.$form.reset();
        _this.waiting(false);
        errors.unhandle();
    };
};
form.prototype.triggerSubmit = function() {
    if (this.recaptcha) this.$submit.click();
    else if (!this.$submit.disabled) this.submit();
};
form.prototype.values = function() {
    var a = {};
    for (i in this.$form.elements) {
        e = this.$form.elements[i];
        if (!e.name || !e.value) continue;
        switch (e.type) {
            case "checkbox":
                a[e.name] = e.checked ? "checked" : null;
                break;
            case "file":
                a[e.name] = {
                    name: e.files[0].name,
                    blob: new Blob([e.files[0]], {
                        type: e.files[0].type
                    }),
                };
                break;
            default:
                a[e.name] = e.value;
                break;
        }
    }
    a["id"] = this.id;
    return a;
};
form.prototype.waiting = function(x) {
    var _this = this;
    if (x) {
        $body.classList.add("is-instant");
        this.$submit.disabled = true;
        this.$submit.classList.add("waiting");
        if (this.recaptcha)
            setTimeout(function() {
                _this.$submit.disabled = true;
            }, 0);
    } else {
        $body.classList.remove("is-instant");
        this.$submit.classList.remove("waiting");
        this.$submit.disabled = false;
    }
};
new form("form01", {
    mode: "custom",
    method: "ajax",
    hid: "www",
    success: {
        mode: 2,
        value: "#done"
    },
    failure: {
        mode: 1,
        value: "Sorry, something went wrong. Please try again later.",
    },
    optional: [],
});
})();