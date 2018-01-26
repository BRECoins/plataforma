/*! SWFObject + Canvas-to-Blob + JpegCamera */

/*	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
var swfobject = function () {
    var D = "undefined", r = "object", S = "Shockwave Flash", W = "ShockwaveFlash.ShockwaveFlash", q = "application/x-shockwave-flash", R = "SWFObjectExprInst", x = "onreadystatechange", O = window, j = document, t = navigator, T = false, U = [h], o = [], N = [], I = [], l, Q, E, B, J = false, a = false, n, G, m = true, M = function () {
        var aa = typeof j.getElementById != D && typeof j.getElementsByTagName != D && typeof j.createElement != D
          , ah = t.userAgent.toLowerCase()
          , Y = t.platform.toLowerCase()
          , ae = Y ? /win/.test(Y) : /win/.test(ah)
          , ac = Y ? /mac/.test(Y) : /mac/.test(ah)
          , af = /webkit/.test(ah) ? parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false
          , X = !+"\v1"
          , ag = [0, 0, 0]
          , ab = null;
        if (typeof t.plugins != D && typeof t.plugins[S] == r) {
            ab = t.plugins[S].description;
            if (ab && !(typeof t.mimeTypes != D && t.mimeTypes[q] && !t.mimeTypes[q].enabledPlugin)) {
                T = true;
                X = false;
                ab = ab.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
                ag[0] = parseInt(ab.replace(/^(.*)\..*$/, "$1"), 10);
                ag[1] = parseInt(ab.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
                ag[2] = /[a-zA-Z]/.test(ab) ? parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0
            }
        } else {
            if (typeof O.ActiveXObject != D) {
                try {
                    var ad = new ActiveXObject(W);
                    if (ad) {
                        ab = ad.GetVariable("$version");
                        if (ab) {
                            X = true;
                            ab = ab.split(" ")[1].split(",");
                            ag = [parseInt(ab[0], 10), parseInt(ab[1], 10), parseInt(ab[2], 10)]
                        }
                    }
                } catch (Z) { }
            }
        }
        return {
            w3: aa,
            pv: ag,
            wk: af,
            ie: X,
            win: ae,
            mac: ac
        }
    }(), k = function () {
        if (!M.w3) {
            return
        }
        if ((typeof j.readyState != D && j.readyState == "complete") || (typeof j.readyState == D && (j.getElementsByTagName("body")[0] || j.body))) {
            f()
        }
        if (!J) {
            if (typeof j.addEventListener != D) {
                j.addEventListener("DOMContentLoaded", f, false)
            }
            if (M.ie && M.win) {
                j.attachEvent(x, function () {
                    if (j.readyState == "complete") {
                        j.detachEvent(x, arguments.callee);
                        f()
                    }
                });
                if (O == top) {
                    (function () {
                        if (J) {
                            return
                        }
                        try {
                            j.documentElement.doScroll("left")
                        } catch (X) {
                            setTimeout(arguments.callee, 0);
                            return
                        }
                        f()
                    })()
                }
            }
            if (M.wk) {
                (function () {
                    if (J) {
                        return
                    }
                    if (!/loaded|complete/.test(j.readyState)) {
                        setTimeout(arguments.callee, 0);
                        return
                    }
                    f()
                })()
            }
            s(f)
        }
    }();
    function f() {
        if (J) {
            return
        }
        try {
            var Z = j.getElementsByTagName("body")[0].appendChild(C("span"));
            Z.parentNode.removeChild(Z)
        } catch (aa) {
            return
        }
        J = true;
        var X = U.length;
        for (var Y = 0; Y < X; Y++) {
            U[Y]()
        }
    }
    function K(X) {
        if (J) {
            X()
        } else {
            U[U.length] = X
        }
    }
    function s(Y) {
        if (typeof O.addEventListener != D) {
            O.addEventListener("load", Y, false)
        } else {
            if (typeof j.addEventListener != D) {
                j.addEventListener("load", Y, false)
            } else {
                if (typeof O.attachEvent != D) {
                    i(O, "onload", Y)
                } else {
                    if (typeof O.onload == "function") {
                        var X = O.onload;
                        O.onload = function () {
                            X();
                            Y()
                        }
                    } else {
                        O.onload = Y
                    }
                }
            }
        }
    }
    function h() {
        if (T) {
            V()
        } else {
            H()
        }
    }
    function V() {
        var X = j.getElementsByTagName("body")[0];
        var aa = C(r);
        aa.setAttribute("type", q);
        var Z = X.appendChild(aa);
        if (Z) {
            var Y = 0;
            (function () {
                if (typeof Z.GetVariable != D) {
                    var ab = Z.GetVariable("$version");
                    if (ab) {
                        ab = ab.split(" ")[1].split(",");
                        M.pv = [parseInt(ab[0], 10), parseInt(ab[1], 10), parseInt(ab[2], 10)]
                    }
                } else {
                    if (Y < 10) {
                        Y++;
                        setTimeout(arguments.callee, 10);
                        return
                    }
                }
                X.removeChild(aa);
                Z = null;
                H()
            })()
        } else {
            H()
        }
    }
    function H() {
        var ag = o.length;
        if (ag > 0) {
            for (var af = 0; af < ag; af++) {
                var Y = o[af].id;
                var ab = o[af].callbackFn;
                var aa = {
                    success: false,
                    id: Y
                };
                if (M.pv[0] > 0) {
                    var ae = c(Y);
                    if (ae) {
                        if (F(o[af].swfVersion) && !(M.wk && M.wk < 312)) {
                            w(Y, true);
                            if (ab) {
                                aa.success = true;
                                aa.ref = z(Y);
                                ab(aa)
                            }
                        } else {
                            if (o[af].expressInstall && A()) {
                                var ai = {};
                                ai.data = o[af].expressInstall;
                                ai.width = ae.getAttribute("width") || "0";
                                ai.height = ae.getAttribute("height") || "0";
                                if (ae.getAttribute("class")) {
                                    ai.styleclass = ae.getAttribute("class")
                                }
                                if (ae.getAttribute("align")) {
                                    ai.align = ae.getAttribute("align")
                                }
                                var ah = {};
                                var X = ae.getElementsByTagName("param");
                                var ac = X.length;
                                for (var ad = 0; ad < ac; ad++) {
                                    if (X[ad].getAttribute("name").toLowerCase() != "movie") {
                                        ah[X[ad].getAttribute("name")] = X[ad].getAttribute("value")
                                    }
                                }
                                P(ai, ah, Y, ab)
                            } else {
                                p(ae);
                                if (ab) {
                                    ab(aa)
                                }
                            }
                        }
                    }
                } else {
                    w(Y, true);
                    if (ab) {
                        var Z = z(Y);
                        if (Z && typeof Z.SetVariable != D) {
                            aa.success = true;
                            aa.ref = Z
                        }
                        ab(aa)
                    }
                }
            }
        }
    }
    function z(aa) {
        var X = null;
        var Y = c(aa);
        if (Y && Y.nodeName == "OBJECT") {
            if (typeof Y.SetVariable != D) {
                X = Y
            } else {
                var Z = Y.getElementsByTagName(r)[0];
                if (Z) {
                    X = Z
                }
            }
        }
        return X
    }
    function A() {
        return !a && F("6.0.65") && (M.win || M.mac) && !(M.wk && M.wk < 312)
    }
    function P(aa, ab, X, Z) {
        a = true;
        E = Z || null;
        B = {
            success: false,
            id: X
        };
        var ae = c(X);
        if (ae) {
            if (ae.nodeName == "OBJECT") {
                l = g(ae);
                Q = null
            } else {
                l = ae;
                Q = X
            }
            aa.id = R;
            if (typeof aa.width == D || (!/%$/.test(aa.width) && parseInt(aa.width, 10) < 310)) {
                aa.width = "310"
            }
            if (typeof aa.height == D || (!/%$/.test(aa.height) && parseInt(aa.height, 10) < 137)) {
                aa.height = "137"
            }
            j.title = j.title.slice(0, 47) + " - Flash Player Installation";
            var ad = M.ie && M.win ? "ActiveX" : "PlugIn"
              , ac = "MMredirectURL=" + O.location.toString().replace(/&/g, "%26") + "&MMplayerType=" + ad + "&MMdoctitle=" + j.title;
            if (typeof ab.flashvars != D) {
                ab.flashvars += "&" + ac
            } else {
                ab.flashvars = ac
            }
            if (M.ie && M.win && ae.readyState != 4) {
                var Y = C("div");
                X += "SWFObjectNew";
                Y.setAttribute("id", X);
                ae.parentNode.insertBefore(Y, ae);
                ae.style.display = "none";
                (function () {
                    if (ae.readyState == 4) {
                        ae.parentNode.removeChild(ae)
                    } else {
                        setTimeout(arguments.callee, 10)
                    }
                })()
            }
            u(aa, ab, X)
        }
    }
    function p(Y) {
        if (M.ie && M.win && Y.readyState != 4) {
            var X = C("div");
            Y.parentNode.insertBefore(X, Y);
            X.parentNode.replaceChild(g(Y), X);
            Y.style.display = "none";
            (function () {
                if (Y.readyState == 4) {
                    Y.parentNode.removeChild(Y)
                } else {
                    setTimeout(arguments.callee, 10)
                }
            })()
        } else {
            Y.parentNode.replaceChild(g(Y), Y)
        }
    }
    function g(ab) {
        var aa = C("div");
        if (M.win && M.ie) {
            aa.innerHTML = ab.innerHTML
        } else {
            var Y = ab.getElementsByTagName(r)[0];
            if (Y) {
                var ad = Y.childNodes;
                if (ad) {
                    var X = ad.length;
                    for (var Z = 0; Z < X; Z++) {
                        if (!(ad[Z].nodeType == 1 && ad[Z].nodeName == "PARAM") && !(ad[Z].nodeType == 8)) {
                            aa.appendChild(ad[Z].cloneNode(true))
                        }
                    }
                }
            }
        }
        return aa
    }
    function u(ai, ag, Y) {
        var X, aa = c(Y);
        if (M.wk && M.wk < 312) {
            return X
        }
        if (aa) {
            if (typeof ai.id == D) {
                ai.id = Y
            }
            if (M.ie && M.win) {
                var ah = "";
                for (var ae in ai) {
                    if (ai[ae] != Object.prototype[ae]) {
                        if (ae.toLowerCase() == "data") {
                            ag.movie = ai[ae]
                        } else {
                            if (ae.toLowerCase() == "styleclass") {
                                ah += ' class="' + ai[ae] + '"'
                            } else {
                                if (ae.toLowerCase() != "classid") {
                                    ah += " " + ae + '="' + ai[ae] + '"'
                                }
                            }
                        }
                    }
                }
                var af = "";
                for (var ad in ag) {
                    if (ag[ad] != Object.prototype[ad]) {
                        af += '<param name="' + ad + '" value="' + ag[ad] + '" />'
                    }
                }
                aa.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + ah + ">" + af + "</object>";
                N[N.length] = ai.id;
                X = c(ai.id)
            } else {
                var Z = C(r);
                Z.setAttribute("type", q);
                for (var ac in ai) {
                    if (ai[ac] != Object.prototype[ac]) {
                        if (ac.toLowerCase() == "styleclass") {
                            Z.setAttribute("class", ai[ac])
                        } else {
                            if (ac.toLowerCase() != "classid") {
                                Z.setAttribute(ac, ai[ac])
                            }
                        }
                    }
                }
                for (var ab in ag) {
                    if (ag[ab] != Object.prototype[ab] && ab.toLowerCase() != "movie") {
                        e(Z, ab, ag[ab])
                    }
                }
                aa.parentNode.replaceChild(Z, aa);
                X = Z
            }
        }
        return X
    }
    function e(Z, X, Y) {
        var aa = C("param");
        aa.setAttribute("name", X);
        aa.setAttribute("value", Y);
        Z.appendChild(aa)
    }
    function y(Y) {
        var X = c(Y);
        if (X && X.nodeName == "OBJECT") {
            if (M.ie && M.win) {
                X.style.display = "none";
                (function () {
                    if (X.readyState == 4) {
                        b(Y)
                    } else {
                        setTimeout(arguments.callee, 10)
                    }
                })()
            } else {
                X.parentNode.removeChild(X)
            }
        }
    }
    function b(Z) {
        var Y = c(Z);
        if (Y) {
            for (var X in Y) {
                if (typeof Y[X] == "function") {
                    Y[X] = null
                }
            }
            Y.parentNode.removeChild(Y)
        }
    }
    function c(Z) {
        var X = null;
        try {
            X = j.getElementById(Z)
        } catch (Y) { }
        return X
    }
    function C(X) {
        return j.createElement(X)
    }
    function i(Z, X, Y) {
        Z.attachEvent(X, Y);
        I[I.length] = [Z, X, Y]
    }
    function F(Z) {
        var Y = M.pv
          , X = Z.split(".");
        X[0] = parseInt(X[0], 10);
        X[1] = parseInt(X[1], 10) || 0;
        X[2] = parseInt(X[2], 10) || 0;
        return (Y[0] > X[0] || (Y[0] == X[0] && Y[1] > X[1]) || (Y[0] == X[0] && Y[1] == X[1] && Y[2] >= X[2])) ? true : false
    }
    function v(ac, Y, ad, ab) {
        if (M.ie && M.mac) {
            return
        }
        var aa = j.getElementsByTagName("head")[0];
        if (!aa) {
            return
        }
        var X = (ad && typeof ad == "string") ? ad : "screen";
        if (ab) {
            n = null;
            G = null
        }
        if (!n || G != X) {
            var Z = C("style");
            Z.setAttribute("type", "text/css");
            Z.setAttribute("media", X);
            n = aa.appendChild(Z);
            if (M.ie && M.win && typeof j.styleSheets != D && j.styleSheets.length > 0) {
                n = j.styleSheets[j.styleSheets.length - 1]
            }
            G = X
        }
        if (M.ie && M.win) {
            if (n && typeof n.addRule == r) {
                n.addRule(ac, Y)
            }
        } else {
            if (n && typeof j.createTextNode != D) {
                n.appendChild(j.createTextNode(ac + " {" + Y + "}"))
            }
        }
    }
    function w(Z, X) {
        if (!m) {
            return
        }
        var Y = X ? "visible" : "hidden";
        if (J && c(Z)) {
            c(Z).style.visibility = Y
        } else {
            v("#" + Z, "visibility:" + Y)
        }
    }
    function L(Y) {
        var Z = /[\\\"<>\.;]/;
        var X = Z.exec(Y) != null;
        return X && typeof encodeURIComponent != D ? encodeURIComponent(Y) : Y
    }
    var d = function () {
        if (M.ie && M.win) {
            window.attachEvent("onunload", function () {
                var ac = I.length;
                for (var ab = 0; ab < ac; ab++) {
                    I[ab][0].detachEvent(I[ab][1], I[ab][2])
                }
                var Z = N.length;
                for (var aa = 0; aa < Z; aa++) {
                    y(N[aa])
                }
                for (var Y in M) {
                    M[Y] = null
                }
                M = null;
                for (var X in swfobject) {
                    swfobject[X] = null
                }
                swfobject = null
            })
        }
    }();
    return {
        registerObject: function (ab, X, aa, Z) {
            if (M.w3 && ab && X) {
                var Y = {};
                Y.id = ab;
                Y.swfVersion = X;
                Y.expressInstall = aa;
                Y.callbackFn = Z;
                o[o.length] = Y;
                w(ab, false)
            } else {
                if (Z) {
                    Z({
                        success: false,
                        id: ab
                    })
                }
            }
        },
        getObjectById: function (X) {
            if (M.w3) {
                return z(X)
            }
        },
        embedSWF: function (ab, ah, ae, ag, Y, aa, Z, ad, af, ac) {
            var X = {
                success: false,
                id: ah
            };
            if (M.w3 && !(M.wk && M.wk < 312) && ab && ah && ae && ag && Y) {
                w(ah, false);
                K(function () {
                    ae += "";
                    ag += "";
                    var aj = {};
                    if (af && typeof af === r) {
                        for (var al in af) {
                            aj[al] = af[al]
                        }
                    }
                    aj.data = ab;
                    aj.width = ae;
                    aj.height = ag;
                    var am = {};
                    if (ad && typeof ad === r) {
                        for (var ak in ad) {
                            am[ak] = ad[ak]
                        }
                    }
                    if (Z && typeof Z === r) {
                        for (var ai in Z) {
                            if (typeof am.flashvars != D) {
                                am.flashvars += "&" + ai + "=" + Z[ai]
                            } else {
                                am.flashvars = ai + "=" + Z[ai]
                            }
                        }
                    }
                    if (F(Y)) {
                        var an = u(aj, am, ah);
                        if (aj.id == ah) {
                            w(ah, true)
                        }
                        X.success = true;
                        X.ref = an
                    } else {
                        if (aa && A()) {
                            aj.data = aa;
                            P(aj, am, ah, ac);
                            return
                        } else {
                            w(ah, true)
                        }
                    }
                    if (ac) {
                        ac(X)
                    }
                })
            } else {
                if (ac) {
                    ac(X)
                }
            }
        },
        switchOffAutoHideShow: function () {
            m = false
        },
        ua: M,
        getFlashPlayerVersion: function () {
            return {
                major: M.pv[0],
                minor: M.pv[1],
                release: M.pv[2]
            }
        },
        hasFlashPlayerVersion: F,
        createSWF: function (Z, Y, X) {
            if (M.w3) {
                return u(Z, Y, X)
            } else {
                return undefined
            }
        },
        showExpressInstall: function (Z, aa, X, Y) {
            if (M.w3 && A()) {
                P(Z, aa, X, Y)
            }
        },
        removeSWF: function (X) {
            if (M.w3) {
                y(X)
            }
        },
        createCSS: function (aa, Z, Y, X) {
            if (M.w3) {
                v(aa, Z, Y, X)
            }
        },
        addDomLoadEvent: K,
        addLoadEvent: s,
        getQueryParamValue: function (aa) {
            var Z = j.location.search || j.location.hash;
            if (Z) {
                if (/\?/.test(Z)) {
                    Z = Z.split("?")[1]
                }
                if (aa == null) {
                    return L(Z)
                }
                var Y = Z.split("&");
                for (var X = 0; X < Y.length; X++) {
                    if (Y[X].substring(0, Y[X].indexOf("=")) == aa) {
                        return L(Y[X].substring((Y[X].indexOf("=") + 1)))
                    }
                }
            }
            return ""
        },
        expressInstallCallback: function () {
            if (a) {
                var X = c(R);
                if (X && l) {
                    X.parentNode.replaceChild(l, X);
                    if (Q) {
                        w(Q, true);
                        if (M.ie && M.win) {
                            l.style.display = "block"
                        }
                    }
                    if (E) {
                        E(B)
                    }
                }
                a = false
            }
        }
    }
}();
!function (t) {
    "use strict";
    var e = t.HTMLCanvasElement && t.HTMLCanvasElement.prototype
      , o = t.Blob && function () {
          try {
              return Boolean(new Blob)
          } catch (t) {
              return !1
          }
      }()
      , n = o && t.Uint8Array && function () {
          try {
              return 100 === new Blob([new Uint8Array(100)]).size
          } catch (t) {
              return !1
          }
      }()
      , r = t.BlobBuilder || t.WebKitBlobBuilder || t.MozBlobBuilder || t.MSBlobBuilder
      , a = /^data:((.*?)(;charset=.*?)?)(;base64)?,/
      , i = (o || r) && t.atob && t.ArrayBuffer && t.Uint8Array && function (t) {
          var e, i, l, u, b, c, d, B, f;
          if (e = t.match(a),
          !e)
              throw new Error("invalid data URI");
          for (i = e[2] ? e[1] : "text/plain" + (e[3] || ";charset=US-ASCII"),
          l = !!e[4],
          u = t.slice(e[0].length),
          b = l ? atob(u) : decodeURIComponent(u),
          c = new ArrayBuffer(b.length),
          d = new Uint8Array(c),
          B = 0; B < b.length; B += 1)
              d[B] = b.charCodeAt(B);
          return o ? new Blob([n ? d : c], {
              type: i
          }) : (f = new r,
          f.append(c),
          f.getBlob(i))
      }
    ;
    t.HTMLCanvasElement && !e.toBlob && (e.mozGetAsFile ? e.toBlob = function (t, o, n) {
        t(n && e.toDataURL && i ? i(this.toDataURL(o, n)) : this.mozGetAsFile("blob", o))
    }
    : e.toDataURL && i && (e.toBlob = function (t, e, o) {
        t(i(this.toDataURL(e, o)))
    }
    )),
    "function" == typeof define && define.amd ? define(function () {
        return i
    }) : "object" == typeof module && module.exports ? module.exports = i : t.dataURLtoBlob = i
}(window);

/*! JpegCamera 1.3.3 | 2016-09-18
    (c) 2013 Adam Wrobel
    https://amw.github.io/jpeg_camera */
(function () {
    var JpegCamera, JpegCameraFlash, JpegCameraHtml5, Snapshot, Stats, can_play, can_use_flash, check_canvas_to_blob, mpeg_audio, should_try_flash, supported_flash_version, vorbis_audio, _ref, _ref1,
      __hasProp = {}.hasOwnProperty,
      __extends = function (child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    JpegCamera = (function () {
        JpegCamera.DefaultOptions = {
            shutter_ogg_url: "/jpeg_camera/shutter.ogg",
            shutter_mp3_url: "/jpeg_camera/shutter.mp3",
            swf_url: "/jpeg_camera/jpeg_camera.swf",
            on_debug: function (message) {
                if (console && console.log) {
                    return console.log("JpegCamera: " + message);
                }
            },
            quality: 0.9,
            shutter: true,
            mirror: false,
            timeout: 0,
            retry_success: false,
            scale: 1.0,
            frameType: 'a4',
            crop_on_capture: false,
            cameraType: 'normal',
            deviceUserMedia: null,
            devices_in_use: [],
            orientation: 'landscape'
        };

        JpegCamera._canvas_supported = !!document.createElement('canvas').getContext;

        JpegCamera.canvas_supported = function () {
            return this._canvas_supported;
        };

        function JpegCamera(container, options) {
            if ("string" === typeof container) {
                container = document.getElementById(container.replace("#", ""));
            }
            if (!(container && container.offsetWidth)) {
                throw "JpegCamera: invalid container";
            }
            container.innerHTML = "";
            this.view_width = parseInt(container.offsetWidth, 10);
            this.view_height = parseInt(container.offsetHeight, 10);
            this.container = document.createElement("div");
            this.container.style.width = "100%";
            this.container.style.height = "100%";
            this.container.style.position = "relative";
            container.appendChild(this.container);
            this.overlay_children = {
                left: null,
                right: null,
                top: null,
                bottom: null,
                dash: null
            }
            this.options = this._extend({}, this.constructor.DefaultOptions, options);

            var that = this;
            this._engine_init(function (engine) {
                that.options.deviceUserMedia = engine.userMedia;
            });

        }

        JpegCamera.prototype.ready = function (callback) {
            this.options.on_ready = callback;
            if (this.options.on_ready && this._is_ready) {
                this.options.on_ready.call(this, {
                    video_width: this.video_width,
                    video_height: this.video_height
                });
            }
            return this;
        };
		
		JpegCamera.prototype.stop = function (callback) {
            this.video.srcObject.getTracks().forEach(track => track.stop());
        };

        JpegCamera.prototype._is_ready = false;

        JpegCamera.prototype.error = function (callback) {
            this.options.on_error = callback;
            if (this.options.on_error && this._error_occured) {
                this.options.on_error.call(this, this._error_occured);
            }
            return this;
        };

        JpegCamera.prototype._error_occured = false;

        JpegCamera.StatsCaptureScale = 0.2;

        JpegCamera.prototype.get_stats = function (callback) {
            var snapshot, that;
            snapshot = new Snapshot(this, {});
            this._engine_capture(snapshot, false, 0.1, JpegCamera.StatsCaptureScale);
            that = this;
            return snapshot.get_stats(function (stats) {
                return callback.call(that, stats);
            });
        };

        JpegCamera.prototype.capture = function (options) {
            var scale, snapshot, _options;
            if (options == null) {
                options = {};
            }
            snapshot = new Snapshot(this, options);
            this._snapshots[snapshot.id] = snapshot;
            _options = snapshot._options();
            if (_options.shutter) {
                this._engine_play_shutter_sound();
            }
            scale = Math.min(1.0, _options.scale);
            scale = Math.max(0.01, scale);
            this._engine_capture(snapshot, _options.mirror, _options.quality, scale, _options.crop_on_capture);
            return snapshot;
        };

        JpegCamera.prototype._snapshots = {};

        JpegCamera.prototype.show_stream = function () {
            this._engine_show_stream();
            this._displayed_snapshot = null;
            return this;
        };

        JpegCamera.prototype.discard_all = function () {
            var id, snapshot, _ref;
            if (this._displayed_snapshot) {
                this.show_stream();
            }
            _ref = this._snapshots;
            for (id in _ref) {
                snapshot = _ref[id];
                this._engine_discard(snapshot);
                snapshot._discarded = true;
            }
            this._snapshots = {};
            return this;
        };

        JpegCamera.prototype._extend = function (object) {
            var key, source, sources, value, _i, _len;
            sources = Array.prototype.slice.call(arguments, 1);
            for (_i = 0, _len = sources.length; _i < _len; _i++) {
                source = sources[_i];
                if (source) {
                    for (key in source) {
                        value = source[key];
                        object[key] = value;
                    }
                }
            }
            return object;
        };

        JpegCamera.prototype._debug = function (message) {
            if (this.options.on_debug) {
                return this.options.on_debug.call(this, message);
            }
        };

        JpegCamera.prototype._display = function (snapshot) {
            this._engine_display(snapshot);
            return this._displayed_snapshot = snapshot;
        };

        JpegCamera.prototype._displayed_snapshot = null;

        JpegCamera.prototype._discard = function (snapshot) {
            if (this._displayed_snapshot === snapshot) {
                this.show_stream();
            }
            this._engine_discard(snapshot);
            snapshot._discarded = true;
            return delete this._snapshots[snapshot.id];
        };

        JpegCamera.prototype._prepared = function (video_width, video_height) {
            var that;
            this.video_width = video_width;
            this.video_height = video_height;
            this._debug("Camera resolution " + this.video_width + "x" + this.video_height + "px");
            that = this;

            this.overlay_children.left.style.display = "block";
            this.overlay_children.right.style.display = "block";
            this.overlay_children.top.style.display = "block";
            this.overlay_children.bottom.style.display = "block";
            this.overlay_children.dash.style.display = "block";
            return setTimeout((function () {
                return that._wait_until_stream_looks_ok(true);
            }), 1);
        };

        JpegCamera.prototype._wait_until_stream_looks_ok = function (show_debug) {
            return this.get_stats(function (stats) {
                var that;
                if (stats.std > 2) {
                    this._debug("Stream mean gray value = " + stats.mean + " standard deviation = " + stats.std);
                    this._debug("Camera is ready");
                    this._is_ready = true;
                    if (this.options.on_ready) {
                        return this.options.on_ready.call(this, {
                            video_width: this.video_width,
                            video_height: this.video_height
                        });
                    }
                } else {
                    if (show_debug) {
                        this._debug("Stream mean gray value = " + stats.mean + " standard deviation = " + stats.std);
                    }
                    that = this;
                    return setTimeout((function () {
                        return that._wait_until_stream_looks_ok(false);
                    }), 100);
                }
            });
        };

        JpegCamera.prototype._got_error = function (error) {
            this._debug("Error - " + error);
            this._error_occured = error;
            if (this.options.on_error) {
                return this.options.on_error.call(this, this._error_occured);
            }
        };

        JpegCamera.prototype._block_element_access = function () {
            var overlay = document.createElement("div");
            var bgcolor
            try {
                overlay.style.backgroundColor = "rgba(255, 255, 255, 0.75)";
                bgcolor = "rgba(255, 255, 255, 0.75)";
                overlay.style.backgroundColor = "rgba(255, 255, 255, 0)";
            } catch (ex) {
                bgcolor = "rgb(255, 255, 255)";
            }

            if (this.options.frameType == 'face') {
                if (this.options.orientation == 'landscape') {
                    if (this.options.baseResolution == 'vga') {
                        //VGA Landscape
                        this.overlay_children.left = document.createElement("div");
                        this.overlay_children.left.style.width = '22%';
                        this.overlay_children.left.style.height = '100%';
                        this.overlay_children.left.style.position = "absolute";
                        this.overlay_children.left.style.top = 0;
                        this.overlay_children.left.style.left = 0;
                        this.overlay_children.left.style.backgroundColor = bgcolor;
                        this.overlay_children.right = document.createElement("div");
                        this.overlay_children.right.style.width = '22%';
                        this.overlay_children.right.style.height = '100%';
                        this.overlay_children.right.style.position = "absolute";
                        this.overlay_children.right.style.top = 0;
                        this.overlay_children.right.style.right = 0;
                        this.overlay_children.right.style.backgroundColor = bgcolor;
                        this.overlay_children.top = document.createElement("div");
                        this.overlay_children.top.style.width = '56%';
                        this.overlay_children.top.style.height = '4%';
                        this.overlay_children.top.style.position = "absolute";
                        this.overlay_children.top.style.top = 0;
                        this.overlay_children.top.style.left = '22%';
                        this.overlay_children.top.style.backgroundColor = bgcolor;
                        this.overlay_children.bottom = document.createElement("div");
                        this.overlay_children.bottom.style.width = '56%';
                        this.overlay_children.bottom.style.height = '4%';
                        this.overlay_children.bottom.style.position = "absolute";
                        this.overlay_children.bottom.style.bottom = 0;
                        this.overlay_children.bottom.style.left = '22%';
                        this.overlay_children.bottom.style.backgroundColor = bgcolor;
                        this.overlay_children.dash = document.createElement("div");
                        this.overlay_children.dash.style.width = '56%';
                        this.overlay_children.dash.style.height = '92%';
                        this.overlay_children.dash.style.position = "absolute";
                        this.overlay_children.dash.style.top = '4%';
                        this.overlay_children.dash.style.left = '22%';
                        this.overlay_children.dash.style.boxSizing = "border-box";
                        this.overlay_children.dash.style.border = "5px dashed red";
                        var dashimage = document.createElement("img");
                        dashimage.style.width = '100%';
                        dashimage.style.height = '100%';
                        dashimage.style.padding = '15%';
                        dashimage.style.verticalAlign = 'middle';
                        dashimage.style.border = 0
                        dashimage.style.boxSizing = "border-box";
                        dashimage.src = "data:image/png;base64,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";
                        this.overlay_children.dash.appendChild(dashimage);

                        overlay.appendChild(this.overlay_children.left);
                        overlay.appendChild(this.overlay_children.right);
                        overlay.appendChild(this.overlay_children.top);
                        overlay.appendChild(this.overlay_children.bottom);
                        overlay.appendChild(this.overlay_children.dash);
                    } else {
                        //HD Landscape
                        this.overlay_children.left = document.createElement("div");
                        this.overlay_children.left.style.width = '30%';
                        this.overlay_children.left.style.height = '100%';
                        this.overlay_children.left.style.position = "absolute";
                        this.overlay_children.left.style.top = 0;
                        this.overlay_children.left.style.left = 0;
                        this.overlay_children.left.style.backgroundColor = bgcolor;
                        this.overlay_children.right = document.createElement("div");
                        this.overlay_children.right.style.width = '30%';
                        this.overlay_children.right.style.height = '100%';
                        this.overlay_children.right.style.position = "absolute";
                        this.overlay_children.right.style.top = 0;
                        this.overlay_children.right.style.right = 0;
                        this.overlay_children.right.style.backgroundColor = bgcolor;
                        this.overlay_children.top = document.createElement("div");
                        this.overlay_children.top.style.width = '40%';
                        this.overlay_children.top.style.height = '4%';
                        this.overlay_children.top.style.position = "absolute";
                        this.overlay_children.top.style.top = 0;
                        this.overlay_children.top.style.left = '30%';
                        this.overlay_children.top.style.backgroundColor = bgcolor;
                        this.overlay_children.bottom = document.createElement("div");
                        this.overlay_children.bottom.style.width = '40%';
                        this.overlay_children.bottom.style.height = '4%';
                        this.overlay_children.bottom.style.position = "absolute";
                        this.overlay_children.bottom.style.bottom = 0;
                        this.overlay_children.bottom.style.left = '30%';
                        this.overlay_children.bottom.style.backgroundColor = bgcolor;
                        this.overlay_children.dash = document.createElement("div");
                        this.overlay_children.dash.style.width = '40%';
                        this.overlay_children.dash.style.height = '92%';
                        this.overlay_children.dash.style.position = "absolute";
                        this.overlay_children.dash.style.top = '4%';
                        this.overlay_children.dash.style.left = '30%';
                        this.overlay_children.dash.style.boxSizing = "border-box";
                        this.overlay_children.dash.style.border = "5px dashed red";
                        var dashimage = document.createElement("img");
                        dashimage.style.width = '100%';
                        dashimage.style.height = '100%';
                        dashimage.style.padding = '15%';
                        dashimage.style.verticalAlign = 'middle';
                        dashimage.style.border = 0
                        dashimage.style.boxSizing = "border-box";
                        dashimage.src = "data:image/png;base64,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";
                        this.overlay_children.dash.appendChild(dashimage);

                        overlay.appendChild(this.overlay_children.left);
                        overlay.appendChild(this.overlay_children.right);
                        overlay.appendChild(this.overlay_children.top);
                        overlay.appendChild(this.overlay_children.bottom);
                        overlay.appendChild(this.overlay_children.dash);
                    }
                } else {
                    if (this.options.baseResolution == 'vga') {
                        //HD Portrait
                        this.overlay_children.left = document.createElement("div");
                        this.overlay_children.left.style.width = '5%';
                        this.overlay_children.left.style.height = '100%';
                        this.overlay_children.left.style.position = "absolute";
                        this.overlay_children.left.style.top = 0;
                        this.overlay_children.left.style.left = 0;
                        this.overlay_children.left.style.backgroundColor = bgcolor;
                        this.overlay_children.right = document.createElement("div");
                        this.overlay_children.right.style.width = '5%';
                        this.overlay_children.right.style.height = '100%';
                        this.overlay_children.right.style.position = "absolute";
                        this.overlay_children.right.style.top = 0;
                        this.overlay_children.right.style.right = 0;
                        this.overlay_children.right.style.backgroundColor = bgcolor;
                        this.overlay_children.top = document.createElement("div");
                        this.overlay_children.top.style.width = '90%';
                        this.overlay_children.top.style.height = '5%';
                        this.overlay_children.top.style.position = "absolute";
                        this.overlay_children.top.style.top = 0;
                        this.overlay_children.top.style.left = '5%';
                        this.overlay_children.top.style.backgroundColor = bgcolor;
                        this.overlay_children.bottom = document.createElement("div");
                        this.overlay_children.bottom.style.width = '90%';
                        this.overlay_children.bottom.style.height = '5%';
                        this.overlay_children.bottom.style.position = "absolute";
                        this.overlay_children.bottom.style.bottom = 0;
                        this.overlay_children.bottom.style.left = '5%';
                        this.overlay_children.bottom.style.backgroundColor = bgcolor;
                        this.overlay_children.dash = document.createElement("div");
                        this.overlay_children.dash.style.width = '90%';
                        this.overlay_children.dash.style.height = '90%';
                        this.overlay_children.dash.style.position = "absolute";
                        this.overlay_children.dash.style.top = '5%';
                        this.overlay_children.dash.style.left = '5%';
                        this.overlay_children.dash.style.boxSizing = "border-box";
                        this.overlay_children.dash.style.border = "5px dashed red";
                        var dashimage = document.createElement("img");
                        dashimage.style.width = '100%';
                        dashimage.style.height = '100%';
                        dashimage.style.padding = '10%';
                        dashimage.style.verticalAlign = 'middle';
                        dashimage.style.border = 0
                        dashimage.style.boxSizing = "border-box";
                        dashimage.src = "data:image/png;base64,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";
                        this.overlay_children.dash.appendChild(dashimage);

                        overlay.appendChild(this.overlay_children.left);
                        overlay.appendChild(this.overlay_children.right);
                        overlay.appendChild(this.overlay_children.top);
                        overlay.appendChild(this.overlay_children.bottom);
                        overlay.appendChild(this.overlay_children.dash);
                    } else {
                        //HD Portrait
                        this.overlay_children.left = document.createElement("div");
                        this.overlay_children.left.style.width = '5%';
                        this.overlay_children.left.style.height = '100%';
                        this.overlay_children.left.style.position = "absolute";
                        this.overlay_children.left.style.top = 0;
                        this.overlay_children.left.style.left = 0;
                        this.overlay_children.left.style.backgroundColor = bgcolor;
                        this.overlay_children.right = document.createElement("div");
                        this.overlay_children.right.style.width = '5%';
                        this.overlay_children.right.style.height = '100%';
                        this.overlay_children.right.style.position = "absolute";
                        this.overlay_children.right.style.top = 0;
                        this.overlay_children.right.style.right = 0;
                        this.overlay_children.right.style.backgroundColor = bgcolor;
                        this.overlay_children.top = document.createElement("div");
                        this.overlay_children.top.style.width = '90%';
                        this.overlay_children.top.style.height = '18%';
                        this.overlay_children.top.style.position = "absolute";
                        this.overlay_children.top.style.top = 0;
                        this.overlay_children.top.style.left = '5%';
                        this.overlay_children.top.style.backgroundColor = bgcolor;
                        this.overlay_children.bottom = document.createElement("div");
                        this.overlay_children.bottom.style.width = '90%';
                        this.overlay_children.bottom.style.height = '18%';
                        this.overlay_children.bottom.style.position = "absolute";
                        this.overlay_children.bottom.style.bottom = 0;
                        this.overlay_children.bottom.style.left = '5%';
                        this.overlay_children.bottom.style.backgroundColor = bgcolor;
                        this.overlay_children.dash = document.createElement("div");
                        this.overlay_children.dash.style.width = '90%';
                        this.overlay_children.dash.style.height = '64%';
                        this.overlay_children.dash.style.position = "absolute";
                        this.overlay_children.dash.style.top = '18%';
                        this.overlay_children.dash.style.left = '5%';
                        this.overlay_children.dash.style.boxSizing = "border-box";
                        this.overlay_children.dash.style.border = "5px dashed red";
                        var dashimage = document.createElement("img");
                        dashimage.style.width = '100%';
                        dashimage.style.height = '100%';
                        dashimage.style.padding = '10%';
                        dashimage.style.verticalAlign = 'middle';
                        dashimage.style.border = 0
                        dashimage.style.boxSizing = "border-box";
                        dashimage.src = "data:image/png;base64,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";
                        this.overlay_children.dash.appendChild(dashimage);

                        overlay.appendChild(this.overlay_children.left);
                        overlay.appendChild(this.overlay_children.right);
                        overlay.appendChild(this.overlay_children.top);
                        overlay.appendChild(this.overlay_children.bottom);
                        overlay.appendChild(this.overlay_children.dash);
                    }
                }
            } else if (this.options.frameType == 'cpf') {
                this.overlay_children.left = document.createElement("div");
                this.overlay_children.left.style.width = '28%';
                this.overlay_children.left.style.height = '100%';
                this.overlay_children.left.style.position = "absolute";
                this.overlay_children.left.style.top = 0;
                this.overlay_children.left.style.left = 0;
                this.overlay_children.left.style.backgroundColor = bgcolor;
                this.overlay_children.right = document.createElement("div");
                this.overlay_children.right.style.width = '28%';
                this.overlay_children.right.style.height = '100%';
                this.overlay_children.right.style.position = "absolute";
                this.overlay_children.right.style.top = 0;
                this.overlay_children.right.style.right = 0;
                this.overlay_children.right.style.backgroundColor = bgcolor;
                this.overlay_children.top = document.createElement("div");
                this.overlay_children.top.style.width = '44%';
                this.overlay_children.top.style.height = '25%';
                this.overlay_children.top.style.position = "absolute";
                this.overlay_children.top.style.top = 0;
                this.overlay_children.top.style.left = '28%';
                this.overlay_children.top.style.backgroundColor = bgcolor;
                this.overlay_children.bottom = document.createElement("div");
                this.overlay_children.bottom.style.width = '44%';
                this.overlay_children.bottom.style.height = '25%';
                this.overlay_children.bottom.style.position = "absolute";
                this.overlay_children.bottom.style.bottom = 0;
                this.overlay_children.bottom.style.left = '28%';
                this.overlay_children.bottom.style.backgroundColor = bgcolor;
                this.overlay_children.dash = document.createElement("div");
                this.overlay_children.dash.style.width = '44%';
                this.overlay_children.dash.style.height = '52%';
                this.overlay_children.dash.style.position = "absolute";
                this.overlay_children.dash.style.top = '24%';
                this.overlay_children.dash.style.left = '28%';
                this.overlay_children.dash.style.border = "5px dashed red";
                this.overlay_children.dash.style.boxSizing = "border-box";
                overlay.appendChild(this.overlay_children.left);
                overlay.appendChild(this.overlay_children.right);
                overlay.appendChild(this.overlay_children.top);
                overlay.appendChild(this.overlay_children.bottom);
                overlay.appendChild(this.overlay_children.dash);
            } else if (this.options.frameType == 'rg') {
                this.overlay_children.left = document.createElement("div");
                this.overlay_children.left.style.width = '31%';
                this.overlay_children.left.style.height = '100%';
                this.overlay_children.left.style.position = "absolute";
                this.overlay_children.left.style.top = 0;
                this.overlay_children.left.style.left = 0;
                this.overlay_children.left.style.backgroundColor = bgcolor;
                this.overlay_children.right = document.createElement("div");
                this.overlay_children.right.style.width = '31%';
                this.overlay_children.right.style.height = '100%';
                this.overlay_children.right.style.position = "absolute";
                this.overlay_children.right.style.top = 0;
                this.overlay_children.right.style.right = 0;
                this.overlay_children.right.style.backgroundColor = bgcolor;
                this.overlay_children.top = document.createElement("div");
                this.overlay_children.top.style.width = '38%';
                this.overlay_children.top.style.height = '3%';
                this.overlay_children.top.style.position = "absolute";
                this.overlay_children.top.style.top = 0;
                this.overlay_children.top.style.left = '31%';
                this.overlay_children.top.style.backgroundColor = bgcolor;
                this.overlay_children.bottom = document.createElement("div");
                this.overlay_children.bottom.style.width = '38%';
                this.overlay_children.bottom.style.height = '3%';
                this.overlay_children.bottom.style.position = "absolute";
                this.overlay_children.bottom.style.bottom = 0;
                this.overlay_children.bottom.style.left = '31%';
                this.overlay_children.bottom.style.backgroundColor = bgcolor;
                this.overlay_children.dash = document.createElement("div");
                this.overlay_children.dash.style.width = '40%';
                this.overlay_children.dash.style.height = '96%';
                this.overlay_children.dash.style.position = "absolute";
                this.overlay_children.dash.style.top = '2%';
                this.overlay_children.dash.style.left = '30%';
                this.overlay_children.dash.style.border = "5px dashed red";
                this.overlay_children.dash.style.boxSizing = "border-box";
                overlay.appendChild(this.overlay_children.left);
                overlay.appendChild(this.overlay_children.right);
                overlay.appendChild(this.overlay_children.top);
                overlay.appendChild(this.overlay_children.bottom);
                overlay.appendChild(this.overlay_children.dash);
            } else if (this.options.frameType == 'cnh') {
                this.overlay_children.left = document.createElement("div");
                this.overlay_children.left.style.width = '28%';
                this.overlay_children.left.style.height = '100%';
                this.overlay_children.left.style.position = "absolute";
                this.overlay_children.left.style.top = 0;
                this.overlay_children.left.style.left = 0;
                this.overlay_children.left.style.backgroundColor = bgcolor;
                this.overlay_children.right = document.createElement("div");
                this.overlay_children.right.style.width = '28%';
                this.overlay_children.right.style.height = '100%';
                this.overlay_children.right.style.position = "absolute";
                this.overlay_children.right.style.top = 0;
                this.overlay_children.right.style.right = 0;
                this.overlay_children.right.style.backgroundColor = bgcolor;
                this.overlay_children.top = document.createElement("div");
                this.overlay_children.top.style.width = '42%';
                this.overlay_children.top.style.height = '0%';
                this.overlay_children.top.style.position = "absolute";
                this.overlay_children.top.style.top = 0;
                this.overlay_children.top.style.left = '29%';
                this.overlay_children.top.style.backgroundColor = bgcolor;
                this.overlay_children.bottom = document.createElement("div");
                this.overlay_children.bottom.style.width = '42%';
                this.overlay_children.bottom.style.height = '0%';
                this.overlay_children.bottom.style.position = "absolute";
                this.overlay_children.bottom.style.bottom = 0;
                this.overlay_children.bottom.style.left = '29%';
                this.overlay_children.bottom.style.backgroundColor = bgcolor;
                this.overlay_children.dash = document.createElement("div");
                this.overlay_children.dash.style.width = '44%';
                this.overlay_children.dash.style.height = '100%';
                this.overlay_children.dash.style.position = "absolute";
                this.overlay_children.dash.style.top = '0%';
                this.overlay_children.dash.style.left = '28%';
                this.overlay_children.dash.style.border = "5px dashed red";
                this.overlay_children.dash.style.boxSizing = "border-box";
                overlay.appendChild(this.overlay_children.left);
                overlay.appendChild(this.overlay_children.right);
                overlay.appendChild(this.overlay_children.top);
                overlay.appendChild(this.overlay_children.bottom);
                overlay.appendChild(this.overlay_children.dash);
            } else if (this.options.frameType == 'a4') {
                this.overlay_children.left = document.createElement("div");
                this.overlay_children.left.style.width = '0%';
                this.overlay_children.left.style.height = '0%';
                this.overlay_children.left.style.position = "absolute";
                this.overlay_children.left.style.top = 0;
                this.overlay_children.left.style.left = 0;
                this.overlay_children.left.style.backgroundColor = bgcolor;
                this.overlay_children.right = document.createElement("div");
                this.overlay_children.right.style.width = '0%';
                this.overlay_children.right.style.height = '0%';
                this.overlay_children.right.style.position = "absolute";
                this.overlay_children.right.style.top = 0;
                this.overlay_children.right.style.right = 0;
                this.overlay_children.right.style.backgroundColor = bgcolor;
                this.overlay_children.top = document.createElement("div");
                this.overlay_children.top.style.width = '100%';
                this.overlay_children.top.style.height = '0%';
                this.overlay_children.top.style.position = "absolute";
                this.overlay_children.top.style.top = 0;
                this.overlay_children.top.style.left = '0%';
                this.overlay_children.top.style.backgroundColor = bgcolor;
                this.overlay_children.bottom = document.createElement("div");
                this.overlay_children.bottom.style.width = '100%';
                this.overlay_children.bottom.style.height = '0%';
                this.overlay_children.bottom.style.position = "absolute";
                this.overlay_children.bottom.style.bottom = 0;
                this.overlay_children.bottom.style.left = '0%';
                this.overlay_children.bottom.style.backgroundColor = bgcolor;
                this.overlay_children.dash = document.createElement("div");
                this.overlay_children.dash.style.width = '100%';
                this.overlay_children.dash.style.height = '100%';
                this.overlay_children.dash.style.position = "absolute";
                this.overlay_children.dash.style.top = '0%';
                this.overlay_children.dash.style.left = '0%';
                this.overlay_children.dash.style.border = "5px dashed red";
                this.overlay_children.dash.style.boxSizing = "border-box";
                overlay.appendChild(this.overlay_children.left);
                overlay.appendChild(this.overlay_children.right);
                overlay.appendChild(this.overlay_children.top);
                overlay.appendChild(this.overlay_children.bottom);
                overlay.appendChild(this.overlay_children.dash);
            }

            overlay.style.width = "100%";
            overlay.style.height = "100%";
            overlay.style.position = "absolute";
            overlay.style.top = 0;
            overlay.style.left = 0;
            overlay.style.zIndex = 2;

            this.overlay_children.left.style.display = "none";
            this.overlay_children.right.style.display = "none";
            this.overlay_children.top.style.display = "none";
            this.overlay_children.bottom.style.display = "none";
            this.overlay_children.dash.style.display = "none";

            this._overlay = overlay;
            this.container.appendChild(this._overlay);

            return this._overlay;
        };

        JpegCamera.prototype._overlay = null;

        JpegCamera.prototype.view_width = null;

        JpegCamera.prototype.view_height = null;

        JpegCamera._add_prefixed_style = function (element, style, value) {
            var uppercase_style;
            uppercase_style = style.charAt(0).toUpperCase() + style.slice(1);
            element.style[style] = value;
            element.style["Webkit" + uppercase_style] = value;
            element.style["Moz" + uppercase_style] = value;
            element.style["ms" + uppercase_style] = value;
            return element.style["O" + uppercase_style] = value;
        };

        return JpegCamera;

    })();

    navigator.getUserMedia || (navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

    window.AudioContext || (window.AudioContext = window.webkitAudioContext);

    check_canvas_to_blob = function () {
        var canvas;
        canvas = document.createElement("canvas");
        if (canvas.getContext && !canvas.toBlob) {
            throw "JpegCamera: Canvas-to-Blob is not loaded";
        }
    };

    if (navigator.getUserMedia) {
        check_canvas_to_blob();
        vorbis_audio = "audio/ogg; codecs=vorbis";
        mpeg_audio = "audio/mpeg; ";
        can_play = function (type) {
            var elem;
            elem = document.createElement("video");
            return !!(elem.canPlayType && elem.canPlayType(type).replace(/no/, ''));
        };
        JpegCameraHtml5 = (function (_super) {
            __extends(JpegCameraHtml5, _super);

            function JpegCameraHtml5() {
                _ref = JpegCameraHtml5.__super__.constructor.apply(this, arguments);
                return _ref;
            }
            JpegCameraHtml5.prototype.define_camera = function (callback) {
                var that = this;
                if (navigator.mediaDevices && navigator.userAgent.toLowerCase().indexOf("linux") == -1) {
                    getAcessoUserMedia(that, callback);
                } else if (navigator.userAgent.toLowerCase().indexOf("linux") > -1) {
                    that.deviceUserMedia = {
                        video: {
                            width: { exact: 640 },
                            height: { exact: 480 }
                        }
                    }
                    callback();
                } else {
                    callback();
                }
            }


            JpegCameraHtml5.prototype._engine_init = function (callback) {
                var error, failure, get_user_media_options, horizontal_padding, success, that, vertical_padding;
                this._debug("Using HTML5 engine");
                var that = this
                this.define_camera(function () {
                    vertical_padding = Math.floor(that.view_height * 0.2);
                    horizontal_padding = Math.floor(that.view_width * 0.2);
                    that.message = document.createElement("div");
                    that.message["class"] = "message";
                    that.message.style.width = "100%";
                    that.message.style.height = "100%";
                    JpegCamera._add_prefixed_style(that.message, "boxSizing", "border-box");
                    that.message.style.overflow = "hidden";
                    that.message.style.textAlign = "center";
                    that.message.style.paddingTop = "" + vertical_padding + "px";
                    that.message.style.paddingBottom = "" + vertical_padding + "px";
                    that.message.style.paddingLeft = "" + horizontal_padding + "px";
                    that.message.style.paddingRight = "" + horizontal_padding + "px";
                    that.message.style.position = "absolute";
                    that.message.style.zIndex = 3;
                    if (that.options.cameraType == "normal")
                        that.message.innerHTML = "Por favor, permita o acesso à câmera quando solicitado polo navegador.<br><br>" + "Procure por um icone de câmera perto da barra de endereço.";
                    that.container.appendChild(that.message);
                    that.video_container = document.createElement("div");
                    that.video_container.style.width = "" + that.view_width + "px";
                    that.video_container.style.height = "" + that.view_height + "px";
                    that.video_container.style.overflow = "hidden";
                    that.video_container.style.position = "absolute";
                    that.video_container.style.zIndex = 1;
                    that.container.appendChild(that.video_container);
                    that.video = document.createElement('video');
                    that.video.autoplay = true;

                    JpegCamera._add_prefixed_style(that.video, "transform", "scalex(1.0)");
                    if (window.AudioContext) {
                        if (can_play(vorbis_audio)) {
                            that._load_shutter_sound(that.options.shutter_ogg_url);
                        } else if (can_play(mpeg_audio)) {
                            that._load_shutter_sound(that.options.shutter_mp3_url);
                        }
                    }
                    get_user_media_options = that.deviceUserMedia

                    //that = this;
                    success = function (stream) {
                        that._remove_message();
                        if (window.URL) {
                            that.video.srcObject = stream;
                        } else {
                            that.video.srcObject = stream;
                        }
                        that._block_element_access();
                        return that._wait_for_video_ready();
                    };
                    failure = function (error) {
                        var code, key, value;
                        that.message.innerHTML = "<span style=\"color: red;\">" + "Você negou a permissão de uso da câmera." + "</span><br><br>" + "Procure o icone de câmera perto da barra de endereço e mude sua decisão.";
                        code = error.code;
                        for (key in error) {
                            value = error[key];
                            if (key === "code") {
                                continue;
                            }
                            that._got_error(key);
                            return;
                        }
                        return that._got_error("UNKNOWN ERROR");
                    };
                    try {
                        callback(get_user_media_options);
                        return navigator.getUserMedia(get_user_media_options, success, failure);
                    } catch (_error) {
                        error = _error;
                        callback(get_user_media_options);
                        return navigator.getUserMedia("video", success, failure);
                    }
                });


            };

            JpegCameraHtml5.prototype._engine_play_shutter_sound = function () {
                var source;
                if (!this.shutter_buffer) {
                    return;
                }
                source = this.audio_context.createBufferSource();
                source.buffer = this.shutter_buffer;
                source.connect(this.audio_context.destination);
                return source.start(0);
            };

            JpegCameraHtml5.prototype._engine_capture = function (snapshot, mirror, quality, scale, crop_on_capture) {
                //Gera o canvas na scala correta
                var canvas, context, crop;
                crop = this._get_capture_crop();
                canvas = document.createElement("canvas");
                canvas.width = Math.round(crop.width * scale);
                canvas.height = Math.round(crop.height * scale);
                context = canvas.getContext("2d");
                context.drawImage(this.video, crop.x_offset, crop.y_offset, crop.width, crop.height, 0, 0, Math.round(crop.width * scale), Math.round(crop.height * scale));

                snapshot._canvas = canvas;
                snapshot._mirror = mirror;
                snapshot._quality = quality;
                if (crop_on_capture) {
                    //Cropa a imagem no frame definido
                    var canvascroped = document.createElement('canvas');
                    var ctx = canvascroped.getContext('2d');
                    var myscale = this.video_width / this.container.offsetWidth;

                    var frameX = this.overlay_children.left.offsetWidth * myscale
                    var frameY = this.overlay_children.top.offsetHeight * myscale;

                    canvascroped.width = this.overlay_children.dash.offsetWidth * myscale
                    canvascroped.height = this.overlay_children.dash.offsetHeight * myscale;


                    ctx.drawImage(canvas, frameX, frameY, canvascroped.width, canvascroped.height, 0, 0, canvascroped.width, canvascroped.height);

                    snapshot._canvas = canvascroped
                } else {
                    //Retorna a imagem sem cropar
                    return snapshot
                }

            };

            JpegCameraHtml5.prototype._engine_display = function (snapshot) {
                if (this.displayed_canvas) {
                    this.container.removeChild(this.displayed_canvas);
                }
                this.displayed_canvas = snapshot._canvas;
                this.displayed_canvas.style.width = "" + this.view_width + "px";
                this.displayed_canvas.style.height = "" + this.view_height + "px";
                this.displayed_canvas.style.top = 0;
                this.displayed_canvas.style.left = 0;
                this.displayed_canvas.style.position = "absolute";
                this.displayed_canvas.style.zIndex = 2;
                JpegCamera._add_prefixed_style(this.displayed_canvas, "transform", "scalex(1.0)");
                return this.container.appendChild(this.displayed_canvas);
            };

            JpegCameraHtml5.prototype._engine_get_canvas = function (snapshot) {
                var canvas, context;
                canvas = document.createElement("canvas");
                canvas.width = snapshot._canvas.width;
                canvas.height = snapshot._canvas.height;
                context = canvas.getContext("2d");
                context.drawImage(snapshot._canvas, 0, 0);
                return canvas;
            };

            JpegCameraHtml5.prototype._engine_get_image_data = function (snapshot) {
                var canvas, context;
                canvas = snapshot._canvas;
                context = canvas.getContext("2d");
                return context.getImageData(0, 0, canvas.width, canvas.height);
            };

            JpegCameraHtml5.prototype._engine_get_blob = function (snapshot, mime, mirror, quality, callback) {
                var canvas, context;
                if (mirror) {
                    canvas = document.createElement("canvas");
                    canvas.width = snapshot._canvas.width;
                    canvas.height = snapshot._canvas.height;
                    context = canvas.getContext("2d");
                    context.setTransform(1, 0, 0, 1, 0, 0);
                    context.translate(canvas.width, 0);
                    context.scale(-1, 1);
                    context.drawImage(snapshot._canvas, 0, 0);
                } else {
                    canvas = snapshot._canvas;
                }
                return canvas.toBlob((function (blob) {
                    return callback(blob);
                }), mime, quality);
            };

            JpegCameraHtml5.prototype._engine_discard = function (snapshot) {
                if (snapshot._xhr) {
                    snapshot._xhr.abort();
                }
                delete snapshot._xhr;
                return delete snapshot._canvas;
            };

            JpegCameraHtml5.prototype._engine_show_stream = function () {
                if (this.displayed_canvas) {
                    this.container.removeChild(this.displayed_canvas);
                    this.displayed_canvas = null;
                }
                return this.video_container.style.display = "block";
            };

            JpegCameraHtml5.prototype._engine_upload = function (snapshot, api_url, csrf_token, timeout) {
                this._debug("Uploading the file");
                return snapshot.get_blob(function (blob) {
                    var handler, xhr;
                    handler = function (event) {
                        delete snapshot._xhr;
                        snapshot._status = event.target.status;
                        snapshot._response = event.target.responseText;
                        if (snapshot._status >= 200 && snapshot._status < 300) {
                            return snapshot._upload_done();
                        } else {
                            snapshot._error_message = event.target.statusText || "Unknown error";
                            return snapshot._upload_fail();
                        }
                    };
                    xhr = new XMLHttpRequest();
                    xhr.open('POST', api_url);
                    xhr.timeout = timeout;
                    if (csrf_token) {
                        xhr.setRequestHeader("X-CSRF-Token", csrf_token);
                    }
                    xhr.onload = handler;
                    xhr.onerror = handler;
                    xhr.onabort = handler;
                    xhr.send(blob);
                    return snapshot._xhr = xhr;
                }, "image/jpeg");
            };

            JpegCameraHtml5.prototype._remove_message = function () {
                return this.message.style.display = "none";
            };

            JpegCameraHtml5.prototype._load_shutter_sound = function (url) {
                var request, that;
                if (this.audio_context) {
                    return;
                }
                this.audio_context = new AudioContext();
                request = new XMLHttpRequest();
                request.open('GET', url, true);
                request.responseType = 'arraybuffer';
                that = this;
                request.onload = function () {
                    return that.audio_context.decodeAudioData(request.response, function (buffer) {
                        return that.shutter_buffer = buffer;
                    });
                };
                return request.send();
            };

            JpegCameraHtml5.prototype._wait_for_video_ready = function () {
                var crop, that, video_height, video_width;
                video_width = parseInt(this.video.videoWidth);
                video_height = parseInt(this.video.videoHeight);
                if (video_width > 0 && video_height > 0) {
                    this.video_container.appendChild(this.video);
                    //Se for ir e estiver setado como esconder, esconde o frame
                    if (this.options.cameraType == "infrared" && this.options.hidden) {
                        this.video_container.style.display = "none";
                    } else {
                        this.overlay_children.left.style.display = "block";
                        this.overlay_children.right.style.display = "block";
                        this.overlay_children.top.style.display = "block";
                        this.overlay_children.bottom.style.display = "block";
                        this.overlay_children.dash.style.display = "block";
                    }

                    this.video_width = video_width;
                    this.video_height = video_height;
                    crop = this._get_video_crop();
                    this.video.style.position = "relative";
                    this.video.style.width = "" + crop.width + "px";
                    this.video.style.height = "" + crop.height + "px";
                    this.video.style.left = "" + crop.x_offset + "px";
                    this.video.style.top = "" + crop.y_offset + "px";

                    return this._prepared(this.video_width, this.video_height);
                } else if (this._status_checks_count > 100) {
                    return this._got_error("Camera failed to initialize in 10 seconds");
                } else {
                    this._status_checks_count++;
                    that = this;
                    return setTimeout((function () {
                        return that._wait_for_video_ready();
                    }), 100);
                }
            };

            JpegCameraHtml5.prototype._status_checks_count = 0;

            JpegCameraHtml5.prototype._get_video_crop = function () {
                var scaled_video_height, scaled_video_width, video_ratio, video_scale, view_ratio;
                video_ratio = this.video_width / this.video_height;
                view_ratio = this.view_width / this.view_height;
                if (video_ratio >= view_ratio) {
                    this._debug("Filling height");
                    video_scale = this.view_height / this.video_height;
                    scaled_video_width = Math.round(this.video_width * video_scale);
                    return {
                        width: scaled_video_width,
                        height: this.view_height,
                        x_offset: -Math.floor((scaled_video_width - this.view_width) / 2.0),
                        y_offset: 0
                    };
                } else {
                    this._debug("Filling width");
                    video_scale = this.view_width / this.video_width;
                    scaled_video_height = Math.round(this.video_height * video_scale);
                    return {
                        width: this.view_width,
                        height: scaled_video_height,
                        x_offset: 0,
                        y_offset: -Math.floor((scaled_video_height - this.view_height) / 2.0)
                    };
                }
            };

            JpegCameraHtml5.prototype._get_capture_crop = function () {
                var snapshot_height, snapshot_width, video_ratio, view_ratio;
                video_ratio = this.video_width / this.video_height;
                view_ratio = this.view_width / this.view_height;
                if (video_ratio >= view_ratio) {
                    snapshot_width = Math.round(this.video_height * view_ratio);
                    return {
                        width: snapshot_width,
                        height: this.video_height,
                        x_offset: Math.floor((this.video_width - snapshot_width) / 2.0),
                        y_offset: 0
                    };
                } else {
                    snapshot_height = Math.round(this.video_width / view_ratio);
                    return {
                        width: this.video_width,
                        height: snapshot_height,
                        x_offset: 0,
                        y_offset: Math.floor((this.video_height - snapshot_height) / 2.0)
                    };
                }
            };

            return JpegCameraHtml5;

        })(JpegCamera);
        ({
            video_width: null,
            video_height: null
        });
        window.JpegCamera = JpegCameraHtml5;
    }

    if (!window.swfobject) {
        throw "JpegCamera: SWFObject is not loaded";
    }

    supported_flash_version = '9';

    should_try_flash = !window.JpegCamera || !window.AudioContext || window.jpeg_camera_force_flash;

    can_use_flash = function () {
        return window.swfobject && swfobject.hasFlashPlayerVersion(supported_flash_version);
    };

    if (should_try_flash && can_use_flash()) {
        JpegCameraFlash = (function (_super) {
            __extends(JpegCameraFlash, _super);

            function JpegCameraFlash() {
                _ref1 = JpegCameraFlash.__super__.constructor.apply(this, arguments);
                return _ref1;
            }

            JpegCameraFlash._send_message = function (id, method) {
                var args, instance;
                instance = this._instances[parseInt(id)];
                if (!instance) {
                    return;
                }
                args = Array.prototype.slice.call(arguments, 2);
                return this.prototype[method].apply(instance, args);
            };

            JpegCameraFlash._instances = {};

            JpegCameraFlash._next_id = 1;

            JpegCameraFlash.prototype._engine_init = function () {
                var attributes, callback, container_to_be_replaced, flash_object_id, flashvars, params, that;
                this._debug("Using Flash engine");
                this._id = this.constructor._next_id++;
                this.constructor._instances[this._id] = this;
                if (this.view_width < 215 || this.view_height < 138) {
                    this._got_error("camera is too small to display privacy dialog");
                    return;
                }
                flash_object_id = "flash_object_" + this._id;
                params = {
                    loop: "false",
                    allowScriptAccess: "always",
                    allowFullScreen: "false",
                    quality: "best",
                    wmode: "opaque",
                    menu: "false"
                };
                attributes = {
                    id: flash_object_id,
                    align: "middle"
                };
                flashvars = {
                    id: this._id,
                    width: this.view_width,
                    height: this.view_height,
                    shutter_url: this.options.shutter_mp3_url
                };
                that = this;
                callback = function (event) {
                    if (!event.success) {
                        return that._got_error("Flash loading failed.");
                    } else {
                        that._debug("Flash loaded");
                        return that._flash = document.getElementById(flash_object_id);
                    }
                };
                container_to_be_replaced = document.createElement("div");
                container_to_be_replaced.id = "jpeg_camera_flash_" + this._id;
                container_to_be_replaced.style.width = "100%";
                container_to_be_replaced.style.height = "100%";
                this.container.appendChild(container_to_be_replaced);
                return swfobject.embedSWF(this.options.swf_url, container_to_be_replaced.id, this.view_width, this.view_height, '9', null, flashvars, params, attributes, callback);
            };

            JpegCameraFlash.prototype._engine_play_shutter_sound = function () {
                return this._flash._play_shutter();
            };

            JpegCameraFlash.prototype._engine_capture = function (snapshot, mirror, quality, scale) {
                return this._flash._capture(snapshot.id, mirror, quality, scale);
            };

            JpegCameraFlash.prototype._engine_display = function (snapshot) {
                return this._flash._display(snapshot.id);
            };

            JpegCameraFlash.prototype._engine_get_canvas = function (snapshot) {
                var canvas, context;
                snapshot._image_data || (snapshot._image_data = this._engine_get_image_data(snapshot));
                canvas = document.createElement("canvas");
                canvas.width = snapshot._image_data.width;
                canvas.height = snapshot._image_data.height;
                context = canvas.getContext("2d");
                context.putImageData(snapshot._image_data, 0, 0);

                if (this.options.crop_on_capture) {

                    //Cropa a imagem no frame definido
                    var canvascroped = document.createElement('canvas');
                    var ctx = canvascroped.getContext('2d');
                    var myscale = this.video_width / this.container.offsetWidth


                    var frameX = this.overlay_children.left.offsetWidth * myscale
                    var frameY = this.overlay_children.top.offsetHeight * myscale;

                    canvascroped.width = this.overlay_children.dash.offsetWidth * myscale
                    canvascroped.height = this.overlay_children.dash.offsetHeight * myscale;


                    ctx.drawImage(canvas, frameX, frameY, canvascroped.width, canvascroped.height, 0, 0, canvascroped.width, canvascroped.height);

                    return canvascroped
                } else {
                    //Retorna a imagem sem cropar
                    return canvas
                }
            };

            JpegCameraFlash.prototype._engine_get_image_data = function (snapshot) {
                var blue, canvas, context, flash_data, green, i, index, pixel, red, result, _i, _len, _ref2;
                flash_data = this._flash._get_image_data(snapshot.id);
                if (JpegCamera.canvas_supported()) {
                    canvas = document.createElement("canvas");
                    canvas.width = flash_data.width;
                    canvas.height = flash_data.height;
                    context = canvas.getContext("2d");
                    result = context.createImageData(flash_data.width, flash_data.height);
                } else {
                    result = {
                        data: [],
                        width: flash_data.width,
                        height: flash_data.height
                    };
                }
                _ref2 = flash_data.data;
                for (i = _i = 0, _len = _ref2.length; _i < _len; i = ++_i) {
                    pixel = _ref2[i];
                    index = i * 4;
                    red = pixel >> 16 & 0xff;
                    green = pixel >> 8 & 0xff;
                    blue = pixel & 0xff;
                    result.data[index + 0] = red;
                    result.data[index + 1] = green;
                    result.data[index + 2] = blue;
                    result.data[index + 3] = 255;
                }
                return result;
            };

            JpegCameraFlash.prototype._engine_get_blob = function (snapshot, mime, mirror, quality, callback) {
                var canvas, context;
                snapshot._extra_canvas || (snapshot._extra_canvas = this._engine_get_canvas(snapshot));
                if (mirror) {
                    canvas = document.createElement("canvas");
                    canvas.width = snapshot._canvas.width;
                    canvas.height = snapshot._canvas.height;
                    context = canvas.getContext("2d");
                    context.setTransform(1, 0, 0, 1, 0, 0);
                    context.translate(canvas.width, 0);
                    context.scale(-1, 1);
                    context.drawImage(snapshot._extra_canvas, 0, 0);
                } else {
                    canvas = snapshot._extra_canvas;
                }
                return canvas.toBlob((function (blob) {
                    return callback(blob);
                }), mime, quality);
            };

            JpegCameraFlash.prototype._engine_discard = function (snapshot) {
                return this._flash._discard(snapshot.id);
            };

            JpegCameraFlash.prototype._engine_show_stream = function () {
                return this._flash._show_stream();
            };

            JpegCameraFlash.prototype._engine_upload = function (snapshot, api_url, csrf_token, timeout) {
                return this._flash._upload(snapshot.id, api_url, csrf_token, timeout);
            };

            JpegCameraFlash.prototype._flash_prepared = function (width, height) {
                this._block_element_access();
                document.body.tabIndex = 0;
                document.body.focus();
                return this._prepared(width, height);
            };

            JpegCameraFlash.prototype._flash_upload_complete = function (snapshot_id, status_code, error, response) {
                var snapshot;
                snapshot_id = parseInt(snapshot_id);
                snapshot = this._snapshots[snapshot_id];
                snapshot._status = parseInt(status_code);
                snapshot._response = response;
                if (snapshot._status >= 200 && snapshot._status < 300) {
                    return snapshot._upload_done();
                } else {
                    snapshot._error_message = error;
                    return snapshot._upload_fail();
                }
            };

            return JpegCameraFlash;

        })(JpegCamera);
        window.JpegCamera = JpegCameraFlash;
    }

    Snapshot = (function () {
        Snapshot._next_snapshot_id = 1;

        function Snapshot(camera, options) {
            this.camera = camera;
            this.options = options;
            this.id = this.constructor._next_snapshot_id++;
        }

        Snapshot.prototype._discarded = false;

        Snapshot.prototype.show = function () {
            if (this._discarded) {
                raise("discarded snapshot cannot be used");
            }
            this.camera._display(this);
            return this;
        };

        Snapshot.prototype.hide = function () {
            if (this.camera.displayed_snapshot() === this) {
                this.camera.show_stream();
            }
            return this;
        };

        Snapshot.prototype.get_stats = function (callback) {
            if (this._discarded) {
                raise("discarded snapshot cannot be used");
            }
            return this.get_image_data(function (data) {
                return this._get_stats(data, callback);
            });
        };

        Snapshot.prototype.get_canvas = function (callback) {
            var that;
            if (this._discarded) {
                raise("discarded snapshot cannot be used");
            }
            if (!JpegCamera._canvas_supported) {
                false;
            }
            that = this;
            setTimeout(function () {
                that._extra_canvas || (that._extra_canvas = that.camera._engine_get_canvas(that));
                JpegCamera._add_prefixed_style(that._extra_canvas, "transform", "scalex(1.0)");
                return callback.call(that, that._extra_canvas);
            }, 1);
            return true;
        };

        Snapshot.prototype._extra_canvas = null;

        Snapshot.prototype.get_blob = function (callback, mime_type) {
            var that;
            if (mime_type == null) {
                mime_type = "image/jpeg";
            }
            if (this._discarded) {
                raise("discarded snapshot cannot be used");
            }
            if (!JpegCamera._canvas_supported) {
                false;
            }
            that = this;
            setTimeout(function () {
                var mirror, quality;
                if (that._blob_mime !== mime_type) {
                    that._blob = null;
                }
                that._blob_mime = mime_type;
                if (that._blob) {
                    return callback.call(that, that._blob);
                } else {
                    mirror = that.options.mirror;
                    quality = that.options.quality;
                    return that.camera._engine_get_blob(that, mime_type, mirror, quality, function (b) {
                        that._blob = b;
                        return callback.call(that, that._blob);
                    });
                }
            }, 1);
            return true;
        };

        Snapshot.prototype._blob = null;

        Snapshot.prototype._blob_mime = null;

        Snapshot.prototype.get_image_data = function (callback) {
            var that;
            if (this._discarded) {
                raise("discarded snapshot cannot be used");
            }
            that = this;
            setTimeout(function () {
                that._image_data || (that._image_data = that.camera._engine_get_image_data(that));
                return callback.call(that, that._image_data);
            }, 1);
            return null;
        };

        Snapshot.prototype._image_data = null;

        Snapshot.prototype.upload = function (options) {
            var cache;
            if (options == null) {
                options = {};
            }
            if (this._discarded) {
                raise("discarded snapshot cannot be used");
            }
            if (this._uploading) {
                this.camera._debug("Upload already in progress");
                return;
            }
            this._uploading = true;
            this._retry = 1;
            this._upload_options = options;
            cache = this._options();
            if (!cache.api_url) {
                this.camera._debug("Snapshot#upload called without valid api_url");
                throw "Snapshot#upload called without valid api_url";
            }
            this._start_upload(cache);
            return this;
        };

        Snapshot.prototype._upload_options = {};

        Snapshot.prototype._uploading = false;

        Snapshot.prototype._retry = 1;

        Snapshot.prototype.done = function (callback) {
            var cache;
            if (this._discarded) {
                raise("discarded snapshot cannot be used");
            }
            this._upload_options.on_upload_done = callback;
            cache = this._options();
            if (cache.on_upload_done && this._done) {
                cache.on_upload_done.call(this, this._response);
            }
            return this;
        };

        Snapshot.prototype._done = false;

        Snapshot.prototype._response = null;

        Snapshot.prototype.fail = function (callback) {
            var cache;
            if (this._discarded) {
                raise("discarded snapshot cannot be used");
            }
            this._upload_options.on_upload_fail = callback;
            cache = this._options();
            if (cache.on_upload_fail && this._fail) {
                cache.on_upload_fail.call(this, this._status, this._error_message, this._response);
            }
            return this;
        };

        Snapshot.prototype._fail = false;

        Snapshot.prototype._status = null;

        Snapshot.prototype._error_message = null;

        Snapshot.prototype.discard = function () {
            this.camera._discard(this);
            delete this._extra_canvas;
            delete this._image_data;
            delete this._blob;
            return void 0;
        };

        Snapshot.prototype._options = function () {
            return this.camera._extend({}, this.camera.options, this.options, this._upload_options);
        };

        Snapshot.prototype._start_upload = function (cache) {
            var csrf_token;
            if ("string" === typeof cache.csrf_token && cache.csrf_token.length > 0) {
                csrf_token = cache.csrf_token;
            } else {
                csrf_token = null;
            }
            this._done = false;
            this._response = null;
            this._fail = false;
            this._status = null;
            this._error_message = null;
            return this.camera._engine_upload(this, cache.api_url, csrf_token, cache.timeout);
        };

        Snapshot.prototype._get_stats = function (data, callback) {
            var gray, gray_values, i, index, mean, n, sum, sum_of_square_distances, _i, _j, _len;
            if (!this._stats) {
                n = data.width * data.height;
                sum = 0.0;
                gray_values = new Array(n);
                for (i = _i = 0; _i < n; i = _i += 1) {
                    index = i * 4;
                    gray = 0.2126 * data.data[index + 0] + 0.7152 * data.data[index + 1] + 0.0722 * data.data[index + 2];
                    gray = Math.round(gray);
                    sum += gray;
                    gray_values[i] = gray;
                }
                mean = Math.round(sum / n);
                sum_of_square_distances = 0;
                for (_j = 0, _len = gray_values.length; _j < _len; _j++) {
                    gray = gray_values[_j];
                    sum_of_square_distances += Math.pow(gray - mean, 2);
                }
                this._stats = new Stats();
                this._stats.mean = mean;
                this._stats.std = Math.round(Math.sqrt(sum_of_square_distances / n));
            }
            return callback.call(this, this._stats);
        };

        Snapshot.prototype._stats = null;

        Snapshot.prototype._upload_done = function () {
            var cache, delay, retry_decision, that;
            this.camera._debug("Upload completed with status " + this._status);
            this._done = true;
            cache = this._options();
            retry_decision = cache.retry_success && cache.retry_if && cache.retry_if.call(this, this._status, this._error_message, this._response, this._retry);
            if (true === retry_decision) {
                retry_decision = 0;
            }
            if ("number" === typeof retry_decision) {
                this._retry++;
                if (retry_decision > 0) {
                    delay = parseInt(retry_decision);
                    this.camera._debug("Will retry the upload in " + delay + "ms (attempt #" + this._retry + ")");
                    that = this;
                    return setTimeout((function () {
                        return that._start_upload(cache);
                    }), delay);
                } else {
                    this.camera._debug("Will retry the upload immediately (attempt #" + this._retry + ")");
                    return this._start_upload(cache);
                }
            } else {
                this._uploading = false;
                if (cache.on_upload_done) {
                    return cache.on_upload_done.call(this, this._response);
                }
            }
        };

        Snapshot.prototype._upload_fail = function () {
            var cache, delay, retry_decision, that;
            this.camera._debug("Upload failed with status " + this._status);
            this._fail = true;
            cache = this._options();
            retry_decision = cache.retry_if && cache.retry_if.call(this, this._status, this._error_message, this._response, this._retry);
            if (true === retry_decision) {
                retry_decision = 0;
            }
            if ("number" === typeof retry_decision) {
                this._retry++;
                if (retry_decision > 0) {
                    delay = parseInt(retry_decision);
                    this.camera._debug("Will retry the upload in " + delay + "ms (attempt #" + this._retry + ")");
                    that = this;
                    return setTimeout((function () {
                        return that._start_upload(cache);
                    }), delay);
                } else {
                    this.camera._debug("Will retry the upload immediately (attempt #" + this._retry + ")");
                    return this._start_upload(cache);
                }
            } else {
                this._uploading = false;
                if (cache.on_upload_fail) {
                    return cache.on_upload_fail.call(this, this._status, this._error_message, this._response);
                }
            }
        };

        return Snapshot;

    })();

    Stats = (function () {
        function Stats() { }

        Stats.prototype.mean = null;

        Stats.prototype.std = null;

        return Stats;

    })();

}).call(this);

/*! Acesso Frame 1.0.0 | 2017-08-01
    (c) 2017 Mateus Perdigão */
function CaptureFrame(url, apikey, authToken, renewauthToken) {
    this.apikey = apikey;
    this.url = url;
    this.authToken = authToken;
    this.renewauthToken = renewauthToken;

    this.isIEBrowser = /*@cc_on!@*/false || !!document.documentMode;

    this.processEnum = { "waiting_for_documents": 1, "capturing_documents": 1, "proccessed_with_conflict": 2, "proccessed_without_conflict": 3, "cancelled": 4 };
    this.documentTypeEnum = {
        "foto_do_cliente": 1, "foto_do_cliente_divergencia": 100, "rg": 2, "cpf": 3, "cnh": 4, "comprovante_renda": 5, "comprovante_endereco": 6, "imposto_renda": 7, "certidao_casamento": 8, "certidao_obito": 9, "certidao_pagamento_debitos": 10,
        "identificacao_internacional": 11, "passaporte": 12, "cartao_cnpj": 13, "contrato_social": 14, "documentos_socios": 15, "declaracao_faturamento": 16, "ordem_compra": 17, "procuracoes": 18, "digital_do_cliente": 19, "carteira_de_trabalho": 20,
        "pac": 21, "ctps": 22, "comprovante_renda_complementar": 23, "identidade_classe": 24, "certidao_nascimento": 25, "extrato_inss": 26, "carte_iptu": 27, "decore": 28, "foto_cliente_liveness": 50, "foto_cliente_liveness_ir": 51, "formulario_aumento_limite": 101,
        "formulario_solicitacao_adicional": 102, "fatura_cartao": 103, "extrato_bancario": 105, "extrato_beneficio": 106, "tad": 107, "formulario_alteracao_endereco": 108, "formulario_alteracao_vencimento": 109, "formulario_extorno_inclusao_transacao": 110,
        "documentos_alteracao_limite": 11, "assinatura_digital": 112, "outros": 999, "outros1": 998, "outros2": 997, "outros3": 996, "outros4": 995, "outros5": 994
    };

    //Controladores das cameras
    this.JpegCamera = null;
    this.JpegCamera_IR = null;

    //Elementos
    this.elementId = 'AcessoFrame';
    this.elementId_IR = this.elementId + "_IR";
    this.isWindows = navigator.userAgent.toLowerCase().indexOf("linux") == -1 ? true : false;

    //Configurações
    this.isDebuging = true;
    this.currentResolution = {
        width: null,
        height: null,
    }

    //Controle de cameras em uso
    this.usedDevices = [];

    //Outros dados
    this.getStreamStats = false;
    this.updateStreamStats = null;
    this.currentMean = null;
    this.currentStandardDerivation = null;

    //Define Opções das cameras
    this.options = {
        shutter_ogg_url: "Dependency/shutter.ogg",
        //shutter_mp3_url: "Dependency/shutter.mp3",
        swf_url: "Dependency/jpeg_camera.swf",
        mirror: false,
        frameType: 'face',
        crop_on_capture: true,
        cameraType: 'normal',
        width: '640px',
        height: '360px',
        orientation: 'landscape',
        hidden: false,
        centralizeOnParent: true,
    };
    this.options_ir = {
        shutter_ogg_url: "Dependency/shutter.ogg",
        //shutter_mp3_url: "Dependency/shutter.mp3",
        swf_url: "Dependency/jpeg_camera.swf",
        mirror: false,
        frameType: 'a4',
        crop_on_capture: false,
        cameraType: 'infrared',
        hidden: true,
        width: '120px',
        height: '160px',
        orientation: 'portrait',
    };

    if (!this.isDebuging) JpegCamera.DefaultOptions.on_debug = null;
}
CaptureFrame.prototype.create = function (sucess, error, options) {
    var that = this;

    function Map(options) {
        if (options) {
            that.options.cameraType = options.cameraType != undefined ? options.cameraType : 'normal';
            that.options.frameType = options.frameType != undefined ? options.frameType : "face";
            that.options.crop_on_capture = options.crop_on_capture != undefined ? options.crop_on_capture : true;
            that.options.mirror = options.mirror != undefined ? options.mirror : false;
            that.options.centralizeOnParent = options.centralizeOnParent != undefined ? options.centralizeOnParent : true;

            that.options.width = options.width != undefined ? options.width : '640px';
            that.options.height = options.height != undefined ? options.height : '360px';

            that.options.orientation = parseInt(that.options.width.replace("px", "")) > parseInt(that.options.height.replace("px", "")) ? 'landscape' : 'portrait';

            if (that.options.orientation == 'landscape') {
                if (1280 / 720 == parseInt(that.options.width.replace("px", "")) / parseInt(that.options.height.replace("px", ""))) {
                    that.options.baseResolution = 'hd';
                } else {
                    that.options.baseResolution = 'vga';
                }
            } else {
                if (720 / 1280 == parseInt(that.options.width.replace("px", "")) / parseInt(that.options.height.replace("px", ""))) {
                    that.options.baseResolution = 'hd';
                } else {
                    that.options.baseResolution = 'vga';
                }
            }

            if (!options.enableIR) {
                that.options_ir = null;
            } else {
                that.options_ir = {
                    shutter_ogg_url: "Dependency/shutter.ogg",
                    //shutter_mp3_url: "Dependency/shutter.mp3",
                    swf_url: "Dependency/jpeg_camera.swf",
                    mirror: false,
                    frameType: 'a4',
                    crop_on_capture: false,
                    cameraType: 'infrared',
                    hidden: true,
                    width: '120px',
                    height: '160px',
                    orientation: 'portrait'
                };
            }

            if (options.showIR && that.options_ir != null) {
                that.options_ir.hidden = !options.showIR;
            }
        } else {
            that.options_ir = null;
        }
    }

    //Mapeia as opções enviada pelo usuário
    Map(options);

    document.getElementById(that.elementId).style.width = this.options.width;
    document.getElementById(that.elementId).style.height = this.options.height;

    //Valida se precisa centralizar o frame com o pai 
    if (this.options.centralizeOnParent)
        this.centralizeOnParent();

    if (!that.isIEBrowser && that.isWindows) {
        $.getScript("Dependency/getAcessoUserMedia.js")
		  .done(function (script, textStatus) {
		      //Verifica se tem as cameras disponiveis
		      getDevices(function (devices) {
		          if (that.isWindows) {
		              if (that.options_ir) {
		                  //Precisa ter duas cameras
		                  if (devices.length != 2) {
		                      error('99999', 'Não foi encontrado o dispositivo de captura da Acesso.');
		                      return;
		                  }
		              } else {
		                  //Precisa ter uma camera
		                  if (devices.length == 0) {
		                      error('99999', 'Não foi encontrado um dispositivo de captura');
		                      return;
		                  }
		              }
		          }

		          //Inicia o JpegCamera

		          that.JpegCamera = new JpegCamera(that.elementId, that.options).ready(function (info) {
		              try {
		                  //Se a infrared estiver setada com ON tenta ligar ela
		                  if (that.options_ir) {
		                      that.options_ir.devices_in_use = [];
		                      that.options_ir.devices_in_use.push(that.JpegCamera.deviceUserMedia);

		                      var infraredElementId = document.createElement("div");
		                      infraredElementId.id = that.elementId_IR;
		                      document.getElementById(that.elementId).children[0].appendChild(infraredElementId);

		                      document.getElementById(that.elementId_IR).style.width = that.options_ir.width;
		                      document.getElementById(that.elementId_IR).style.height = that.options_ir.height;
		                      document.getElementById(that.elementId_IR).style.zIndex = 4;
		                      document.getElementById(that.elementId_IR).style.right = 0;
		                      document.getElementById(that.elementId_IR).style.bottom = 0;
		                      document.getElementById(that.elementId_IR).style.position = "absolute";

		                      //Inicia o JpegCamera IR
		                      that.JpegCamera_IR = new JpegCamera(that.elementId_IR, that.options_ir).ready(function (info) {
		                          if (that.options_ir.hidden) {
		                              document.getElementById(that.elementId_IR).style.display = "none";
		                          }
		                          sucess();
		                      });
		                  } else {
		                      sucess();
		                  }
		              } catch (ex) {
		                  error(99999, 'Erro ao iniciar a câmera. Verifique as conexões e tente novamente')
		              }
		          });
		      });
		  })
		  .fail(function (jqxhr, settings, exception) {
		  });
    } else if (!that.isWindows) {
        //Linux		
        that.JpegCamera = new JpegCamera(that.elementId, that.options).ready(function (info) {
            try {
                sucess();
            } catch (ex) {
                error(99999, 'Erro ao iniciar a câmera. Verifique as conexões e tente novamente')
            }
        });
    } else {
        if (that.options_ir) {
            error('99999', 'Este browser não suporta o dispositivo de captura da Acesso');
            return;
        }

        //Inicia o JpegCamera
        that.JpegCamera = new JpegCamera(that.elementId, that.options).ready(function (info) {
            try {
                if (that.isDebuging) console.log("AcesoFrame: Instância criada.", that);

                //Se a infrared estiver setada com ON tenta ligar ela
                if (that.options_ir) {
                    that.options_ir.devices_in_use = [];
                    that.options_ir.devices_in_use.push(that.JpegCamera.deviceUserMedia);

                    var infraredElementId = document.createElement("div");
                    infraredElementId.id = that.elementId_IR;
                    document.getElementById(that.elementId).children[0].appendChild(infraredElementId);

                    document.getElementById(that.elementId_IR).style.width = that.options_ir.width;
                    document.getElementById(that.elementId_IR).style.height = that.options_ir.height;
                    document.getElementById(that.elementId_IR).style.zIndex = 4;
                    document.getElementById(that.elementId_IR).style.right = 0;
                    document.getElementById(that.elementId_IR).style.bottom = 0;
                    document.getElementById(that.elementId_IR).style.position = "absolute";

                    //Inicia o JpegCamera IR
                    that.JpegCamera_IR = new JpegCamera(that.elementId_IR, that.options_ir).ready(function (info) {
                        if (that.isDebuging) console.log("AcesoFrame: Instância IR criada.", that);

                        if (that.options_ir.hidden) {
                            document.getElementById(that.elementId_IR).style.display = "none";
                        }

                        sucess();
                    });
                } else {
                    sucess();
                }
            } catch (ex) {
                error(99999, 'Erro ao iniciar a câmera. Verifique as conexões e tente novamente')
            }
        });
    }
}

CaptureFrame.prototype.stopCamera = function (){
	this.JpegCamera.stop();
}

CaptureFrame.prototype.takeSnapshot = function (callback) {
    var that = this;
    if (this.isDebuging) console.log("AcesoFrame: Capturando frame normal");
    var snapshot = this.JpegCamera.capture(this.options);
    if (this.options_ir) {
        if (this.isDebuging) console.log("AcesoFrame: Capturando frame IR");
        var snapshot2 = this.JpegCamera_IR.capture(this.options_ir);
    }

    var myCanvas1 = null;
    var myCanvas2 = null;

    //Verifica se o browser suporta canvas
    if (JpegCamera.canvas_supported()) {
        snapshot.get_canvas(function (canvas) {
            myCanvas1 = canvas.toDataURL("image/jpeg");

            if (that.options_ir) {
                snapshot2.get_canvas(function (canvas_ir) {
                    myCanvas2 = canvas_ir.toDataURL("image/jpeg");

                    callback(myCanvas1, myCanvas2);
                })
            } else {
                callback(myCanvas1, null);
            }
        });
    } else {
        console.log("AcessoFrame: Navegador não suportado!")
    }
}
CaptureFrame.prototype.createProcess = function (subject, sucess, error) {
    var that = this;
    if (this.authToken == null) {
        error(99999, "O token de acesso não foi informado. Execute o método getAuthToken"); return
    } else if (subject == null) {
        error(99999, "O cliente não foi informado"); return
    } else if (subject.Code == null) {
        error(99999, "O CPF do cliente não foi informado"); return
    } else if (subject.Code.length != 11) {
        error(99999, "A CPF do cliente deve conter 11 caracteres"); return
    } else if (subject.Name == null) {
        error(99999, "O nome do cliente não foi informado"); return
    } else if (subject.Gender.toUpperCase() != "M" && subject.Gender.toUpperCase != "F") {
        error(99999, "A sexo do cliente não foi informado"); return
    }

    var params = {
        subject: {
            Code: subject.Code,
            Name: subject.Name,
            Gender: subject.Gender.toUpperCase()
        }
    }

    $.ajax({
        type: 'POST',
        url: this.url + "/Services/v2/credservice.svc/process",
        contentType: 'application/json; charset=utf-8',
        crossDomain: true,
        headers: {
            "x-acessobio-apikey": this.apikey,
            "Authentication": this.authToken
        },
        data: JSON.stringify(params),
        success: function (data) {
            sucess(data.CreateProcessResult.Process);
        },
        error: function (request, textStatus, errorThrown) {
            var createProcess = request.responseJSON
            if (createProcess.Error.Code == 10502) {
                that.renewAuthToken(function () {
                    that.createProcess(subject, sucess, error);
                })
            } else {
                error(createProcess.Error.Code, createProcess.Error.Description);
            }
        },
        dataType: 'json'
    });

}
CaptureFrame.prototype.faceInsert = function (process, base64, sucess, error) {
    var that = this;
    if (this.authToken == null) {
        error(99999, "O token de acesso não foi informado. Execute o método getAuthToken"); return
    } else if (process == null) {
        error(99999, "O processo não foi informado"); return
    } else if (process.Id == null) {
        error(99999, "O id do processo não foi informado"); return
    } else if (base64 == null) {
        error(99999, "O base64 não foi informado"); return
    }

    if (base64.indexOf(',') != -1)
        base64 = base64 = base64.split(",")[1];

    var params = {
        imagebase64: base64,
    }

    $.ajax({
        type: 'POST',
        url: this.url + "/Services/v2/credservice.svc/process/" + process.Id + "/faceinsert",
        contentType: 'application/json; charset=utf-8',
        crossDomain: true,
        data: JSON.stringify(params),
        headers: {
            "x-acessobio-apikey": this.apikey,
            "Authentication": this.authToken
        },
        success: function (data) {
            sucess(data.FaceInsertResult.Process);
        },
        error: function (request, textStatus, errorThrown) {
            var faceInsertResult = request.responseJSON
            if (faceInsertResult.Error.Code == 10502) {
                that.renewAuthToken(function () {
                    that.faceInsert(process, base64, sucess, error);
                })
            } else {
                error(faceInsertResult.Error.Code, faceInsertResult.Error.Description);
            }
        },
        dataType: 'json'
    });
}
CaptureFrame.prototype.documentInsert = function (process, base64, documenttype, sucess, error) {
    var that = this;
    if (this.authToken == null) {
        error(99999, "O token de acesso não foi informado. Execute o método getAuthToken"); return
    } else if (process == null) {
        error(99999, "O processo não foi informado"); return
    } else if (process.Id == null) {
        error(99999, "O id do processo não foi informado"); return
    } else if (base64 == null) {
        error(99999, "O base64 não foi informado"); return
    } else if (documenttype == null) {
        error(99999, "O tipo de documento não foi informado"); return
    }

    if (base64.indexOf(',') != -1)
        base64 = base64 = base64.split(",")[1];

    var params = {
        imagebase64: base64,
    }

    $.ajax({
        type: 'POST',
        url: this.url + "/Services/v2/credservice.svc/process/" + process.Id + "/documentinsert/" + documenttype,
        contentType: 'application/json; charset=utf-8',
        crossDomain: true,
        data: JSON.stringify(params),
        headers: {
            "x-acessobio-apikey": this.apikey,
            "Authentication": this.authToken
        },
        success: function (data) {
            sucess(data.DocumentInsertResult.Process);
        },
        error: function (request, textStatus, errorThrown) {
            var getProcessResult = request.responseJSON
            if (getProcessResult.Error.Code == 10502) {
                that.renewAuthToken(function () {
                    that.documentInsert(process, base64, documenttype, sucess, error);
                })
            } else {
                error(getProcessResult.Error.Code, getProcessResult.Error.Description);
            }
        },
        dataType: 'json'
    });
}
CaptureFrame.prototype.executeProcess = function (process, sucess, error) {
    var that = this;
    if (this.authToken == null) {
        error(99999, "O token de acesso não foi informado. Execute o método getAuthToken"); return
    } else if (process == null) {
        error(99999, "O processo não foi informado"); return
    } else if (process.Id == null) {
        error(99999, "O id do processo não foi informado"); return
    }

    $.ajax({
        type: 'GET',
        url: this.url + "/Services/v2/credservice.svc/process/" + process.Id + "/execute",
        contentType: 'application/json; charset=utf-8',
        crossDomain: true,
        headers: {
            "x-acessobio-apikey": this.apikey,
            "Authentication": this.authToken
        },
        success: function (data) {
            sucess(data.ExecuteProcessResult.Process);
        },
        error: function (request, textStatus, errorThrown) {
            var getProcessResult = request.responseJSON
            if (getProcessResult.Error.Code == 10502) {
                that.renewAuthToken(function () {
                    that.executeProcess(process, sucess, error);
                })
            } else {
                error(getProcessResult.Error.Code, getProcessResult.Error.Description);
            }
        },
        dataType: 'json'
    });
}
CaptureFrame.prototype.getProcess = function (process, sucess, error) {
    var that = this;
    if (this.authToken == null) {
        error(99999, "O token de acesso não foi informado. Execute o método getAuthToken"); return
    } else if (process == null) {
        error(99999, "O processo não foi informado"); return
    } else if (process.Id == null) {
        error(99999, "O id do processo não foi informado"); return
    }

    $.ajax({
        type: 'GET',
        url: this.url + "/Services/v2/credservice.svc/process/" + process.Id,
        contentType: 'application/json; charset=utf-8',
        crossDomain: true,
        headers: {
            "x-acessobio-apikey": this.apikey,
            "Authentication": this.authToken
        },
        success: function (data) {
            sucess(data.GetProcessResult.Process);
        },
        error: function (request, textStatus, errorThrown) {
            var getProcessResult = request.responseJSON;
            if (getProcessResult.Error.Code == 10502) {
                that.renewAuthToken(function () {
                    that.getProcess(process, sucess, error);
                })
            } else {
                error(getProcessResult.Error.Code, getProcessResult.Error.Description);
            }
        },
        dataType: 'json'
    });

}
CaptureFrame.prototype.getSubject = function (code, sucess, error) {
    if (this.authToken == null) {
        error(99999, "O token de acesso não foi informado. Execute o método getAuthToken"); return
    }

    if (code.length != 11) {
        error(99999, "O cpf informado é inválido ele deve ter 11 caracteres"); return
    }

    $.ajax({
        type: 'GET',
        url: this.url + "/Services/v2/credservice.svc/subject/" + code,
        contentType: 'application/json; charset=utf-8',
        crossDomain: true,
        headers: {
            "x-acessobio-apikey": this.apikey,
            "Authentication": this.authToken,
        },
        success: function (data) {
            sucess(data.GetSubjectResult.Subject);
        },
        error: function (request, textStatus, errorThrown) {
            var getSubjectResult = request.responseJSON
            if (getSubjectResult.Error.Code == 10502) {
                that.renewAuthToken(function () {
                    that.getSubject(code, sucess, error);
                })
            } else {
                error(getSubjectResult.Error.Code, getSubjectResult.Error.Description);
            }
        },
        dataType: 'json'
    });
}
CaptureFrame.prototype.getAuthToken = function (user, sucess, error) {
    var that = this;
    if (user == null) {
        error(99999, "O usuário não foi informado"); return
    } else if (user.login == null) {
        error(99999, "O login não foi informado"); return
    } else if (user.password == null) {
        error(99999, "A senha não foi informada"); return
    }

    $.ajax({
        type: 'GET',
        url: this.url + "/Services/v2/credservice.svc/user/authtoken",
        contentType: 'application/json; charset=utf-8',
        crossDomain: true,
        headers: {
            "x-acessobio-apikey": this.apikey,
            "x-login": user.login,
            "x-password": user.password
        },
        success: function (data) {
            that.authToken = data.GetAuthTokenResult.AuthToken;
            that.renewauthToken = data.GetAuthTokenResult.RenewAuthToken;
            sucess();
        },
        error: function (request, textStatus, errorThrown) {
            var getAuthTokenResult = request.responseJSON
            error(getAuthTokenResult.Error.Code, getAuthTokenResult.Error.Description);
        },
        dataType: 'json'
    });
}

CaptureFrame.prototype.renewAuthToken = function (callback) {
    var that = this;
    $.ajax({
        type: 'GET',
        url: this.url + "/Services/v2/credservice.svc/user/authtoken/" + this.renewauthToken,
        contentType: 'application/json; charset=utf-8',
        crossDomain: true,
        headers: {
            "x-acessobio-apikey": this.apikey,
        },
        success: function (data) {
            that.authToken = data.RenewAuthTokenResult.AuthToken;
            that.renewauthToken = data.RenewAuthTokenResult.RenewAuthToken;
            callback();
        },
        error: function (request, textStatus, errorThrown) {
            var getAuthTokenResult = request.responseJSON
            error(getAuthTokenResult.Error.Code, getAuthTokenResult.Error.Description);
        },
        dataType: 'json'
    });
}

CaptureFrame.prototype.centralizeOnParent = function () {
    var that = this;
    $(window).resize(function () {
        document.getElementById(that.elementId).style.marginLeft = ($('#' + that.elementId).parent().width() - that.options.width.replace("px", "")) / 2 + "px";
    })
    document.getElementById('AcessoFrame').style.marginLeft = ($('#' + that.elementId).parent().width() - that.options.width.replace("px", "")) / 2 + "px";
}

function AcessoBio() {
    this.captureFrame = new CaptureFrame();
}
