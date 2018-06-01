window.VERSION = "0.9.2";

if (getQueryVariable('testnet') == '1' && confirm("Você está acessando a plataforma no modo Testnet. LEIA ATENTAMENTE AS SEGUINTES INFORMAÇÕES PARA NÃO SER VÍTIMA DE GOLPES.\n\nNeste modo, todos os bitcoins depositados NÃO POSSUEM VALOR ALGUM. As contas registradas na plataforma não estão disponíveis no ambiente testnet (é necessário um novo registro), e a base de dados pode ser redefinida a qualquer momento. Além disso, saques e depósitos em reais NÃO SERÃO REALIZADOS.\nEste ambiente é destinado a DESENVOLVEDORES exclusivamente, para testes de algoritmos sem risco de perdas de fundos.\n\nTem certeza que deseja continuar em testnet?")) {
    window.BACKEND = "https://testnet-backend.brecoins.com.br:8443";
    document.title = "TESTNET - " + document.title;
    setInterval(function() {
        if (!document.title.match(/^TESTNET/)) document.title = "TESTNET - " + document.title;
    }, 5000);
} else
    window.BACKEND = "https://backend.brecoins.com.br";

if(getQueryVariable('sess_key')) {
    localStorage.setItem('sess_key', getQueryVariable('sess_key'));
    history.pushState({}, "", "/");
}

window.CDN = "https://brecoins.s3.amazonaws.com/";
window.EXCHANGE = 1;
window.common = {
    crypto_currency: {
        name: "Bitcoin",
        iso: "BTC",
        symbol: "₿"
    },
    fiat_currency: {
        name: "Real",
        iso: "BRL",
        symbol: "R$"
    }
};
window.cb = {};
function utf8_encode (argString) {
  if (argString === null || typeof argString === 'undefined') {
    return ''
  }

  // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  var string = (argString + '')
  var utftext = ''
  var start
  var end
  var stringl = 0

  start = end = 0
  stringl = string.length
  for (var n = 0; n < stringl; n++) {
    var c1 = string.charCodeAt(n)
    var enc = null

    if (c1 < 128) {
      end++
    } else if (c1 > 127 && c1 < 2048) {
      enc = String.fromCharCode(
        (c1 >> 6) | 192, (c1 & 63) | 128
      )
    } else if ((c1 & 0xF800) !== 0xD800) {
      enc = String.fromCharCode(
        (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
      )
    } else {
      // surrogate pairs
      if ((c1 & 0xFC00) !== 0xD800) {
        throw new RangeError('Unmatched trail surrogate at ' + n)
      }
      var c2 = string.charCodeAt(++n)
      if ((c2 & 0xFC00) !== 0xDC00) {
        throw new RangeError('Unmatched lead surrogate at ' + (n - 1))
      }
      c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000
      enc = String.fromCharCode(
        (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
      )
    }
    if (enc !== null) {
      if (end > start) {
        utftext += string.slice(start, end)
      }
      utftext += enc
      start = end = n + 1
    }
  }

  if (end > start) {
    utftext += string.slice(start, stringl)
  }

  return utftext
}

Array.prototype.remove = function() {
    var what, a = arguments,
        L = a.length,
        ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

swal.setDefaults({
    buttonsStyling: false,
    confirmButtonClass: 'button is-dark',
    cancelButtonClass: 'button is-secondary'
});

if (top.location.hostname != self.location.hostname) {
    top.location.href = self.location.href;
}

(function($) {
    $.fn.textBlink = function(new_text) {
        var e, el = this;
        el.each(function() {
            e = $(this);
            if (e.text() != new_text) {
                e.text(new_text).addClass('blink_me');
                setTimeout((function(e) {
                    e.removeClass('blink_me');
                })(e), 1000)
            }
        })
        return el;

    }
    $.fn.htmlBlink = function(new_html) {
        var e, el = this;
        el.each(function() {
            e = $(this);
            if (e.html() != new_html) {
                e.html(new_html).addClass('blink_me');
                setTimeout((function(e) {
                    e.removeClass('blink_me');
                })(e), 1000)
            }
        })
        return el;
    }
    $.fn.blink = function() {
        var e, el = this;
        el.each(function() {
            e = $(this);
            e.addClass('blink_me');
            setTimeout((function(e) {
                e.removeClass('blink_me');
            })(e), 1000)
        })
        return el;
    }
})($);


$(function() {
    w3.includeHTML(function() {

        // disable autocomplete globally
        $("input:not([autocomplete])").attr("autocomplete", "false");

        const socket = io(window.BACKEND, { path: '/ws', transports: ['websocket'] });

        recaptchaLoadCaptchas();

        var soundFile = document.createElement("audio");
        soundFile.preload = "auto";

        //Load the sound file (using a source element for expandability)
        var src = document.createElement("source");
        src.src = "/assets/snd/notify.mp3";
        soundFile.appendChild(src);

        //Load the audio tag
        //It auto plays as a fallback
        soundFile.load();
        soundFile.volume = 0.000000;
        soundFile.play();

        //Plays the sound
        function playNotify() {
            //Set the current time for the audio file to the beginning
            soundFile.currentTime = 0.01;
            soundFile.volume = 0.5;

            //Due to a bug in Firefox, the audio needs to be played after a delay
            setTimeout(function() { soundFile.play(); }, 1);
        }

        loadingOff();

        $("#splash_loading").animate({
            opacity: 0
        }, 700);

        $('.navbar-burger').click(function() {
            var target = $(this).data('target');
            $('#' + target).slideToggle('fast');
        });

        // check if already logged in
        if (localStorage.getItem('sess_key')) {
            socket.emit('member.checklogin', { 'sess_key': localStorage.getItem('sess_key') });
        }

        /*$("#loading-logo")
            .fadeIn(200)
            .animate({
                width: 300
            }, 2000);*/
        $("#splash_account,#splash_attrib")
            //.delay(700)
            .slideDown(1500)
            .animate({
                opacity: 1
            }, 1000);
        setTimeout(function() {
            if (getQueryVariable('p') == 'signup') {
                $("[data-do=linksignup]").click();
            }
            if (getQueryVariable('email')) {
                $("[data-var=signup_email]").val(getQueryVariable('email'));
            }
            history.pushState({}, "", "/");
        }, 900);

        socket.emit('geo.countrylist');

        // algorithm editor
        window.define = ace.define;
        ace.config.set("modePath", "/assets/scripts/ace");
        ace.config.set("workerPath", "/assets/scripts/ace");
        ace.config.set("themePath", "/assets/scripts/ace");
        window.algoeditor = ace.edit("algorithm-editor");
        algoeditor.session.setMode("ace/mode/javascript");

        var loadingonclick = function($el) {
                var default_html = $el.html();
                $el.prop("disabled", true);
                $el.html('<i class="fa fa-circle-o-notch fa-spin fa-fw"></i>');
                setTimeout(function() {
                    $el.prop("disabled", false);
                    $el.html(default_html);
                }, 4000);
                return false;
            }
            //$(".loadingonclick").bind('click', loadingonclick);

        // phone
        $("input[type=tel]").intlTelInput({
            geoIpLookup: function(callback) {
                $.get("https://ipinfo.io", function() {}, "jsonp").always(function(resp) {
                    var countryCode = (resp && resp.country) ? resp.country : "";
                    callback(countryCode);
                });
            },
            preferredCountries: ["br"],
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/12.1.6/js/utils.js"
        });
        $("input[type=tel]").on("keyup change", function() {
            if (typeof intlTelInputUtils !== 'undefined') {
                var currentText = $(this).intlTelInput("getNumber", intlTelInputUtils.numberFormat.E164);
                if (typeof currentText === 'string') {
                    $(this).intlTelInput('setNumber', currentText);
                }
                var numberType = $(this).intlTelInput("getNumberType");
                if (numberType >= 0 && numberType != 1 && numberType != 2) {
                    $(this).intlTelInput('setNumber', '');
                    swal("Apenas celulares", "Para fins de confirmação via SMS, você precisa informar um número de celular.");
                }
            }
        });

        // views
        $("[data-goto]").click(function() {
            $("#main-menu li a.is-active,#navMenu2 .is-active").removeClass("is-active");
            $("#navMenu2").slideUp();
            if (!$(this).hasClass('dropdown-item')) {
                $(this).addClass("is-active");
            }
            loadView($(this).data('goto'));
        });


        if (store('trading_interface') == 'advanced') {
            loadView('main');
            //$("#sidebar-menu").addClass("is-basic");
            $(".trader-button").text("TRADER");
        } else {
            loadView('basic');
            $(".trader-button").text("BÁSICO");
        }

        $("[data-var=version]").text(VERSION);
        $("[data-var=year]").text((new Date()).getFullYear());

        // modals
        $(".close-modal").click(function() {
            $(".modal.is-active").removeClass("is-active");
        });
        $("[data-openmodal]").click(function() {
            showModal($(this).data('openmodal'));
        });

        // tabs
        $("[data-tab][data-group]").click(function() {
            if ($(this).parent("li").length) {
                $("[data-tab][data-group=" + $(this).data('group') + "]").parent("li").removeClass("is-active");
                $(this).parent("li").addClass("is-active");
            } else {
                $("[data-tab][data-group=" + $(this).data('group') + "]").removeClass("is-active");
                $(this).addClass("is-active");
            }
            $("[data-tabgroup=" + $(this).data('group') + "]").addClass('is-invisible').hide();
            $("[data-tabname=" + $(this).data('tab') + "]").removeClass('is-invisible').show();
        });

        // dropdown
        var dropdown = document.querySelector('.dropdown');
        dropdown.addEventListener('click', function(event) {
            //event.stopPropagation();
            dropdown.classList.toggle('is-active');
        });
        $(".dropdown").on('mouseout', function() {
            $(this).removeClass('is-active');
        });

        window.workers = {};
        updatealgo();

        // order types
        $("#ordertypeform input").on('change', function() {
            var ordertypes = store.get('ordertypes' + window.common.UID);
            if (typeof ordertypes != 'object') ordertypes = new Array();
            var thetype = $(this).attr('value');

            if (ordertypes && ordertypes.length)
                ordertypes.remove(thetype);

            if ($(this).is(":checked")) {
                if (ordertypes)
                    ordertypes.push(thetype);
                else
                    ordertypes = [thetype];
            }
            store.set('ordertypes' + window.common.UID, ordertypes);
            updateordertypes();
        });

        // input masks
        $("[data-mask]").each(function() {
            var mask = "mask__" + $(this).data('mask');
            $(this).keyup(function() {
                inputmask($(this)[0], mask);
            });
        })

        /* BOOT FINISHED */

        // io callback
        socket.on('geocountrylist', function(countries) {
            $(".countrylist option:not([disabled])").remove();
            countries.forEach(function(country) {
                $(".countrylist").append('<option value="' + country.id + '" data-iso="' + country.code + '">' + country.name + '</option>');
            });
        });
        socket.on('georegionslist', function(regions) {
            $(".regionlist option:not([disabled])").remove();
            regions.forEach(function(region) {
                $(".regionlist").append('<option value="' + region.id + '">' + region.name + '</option>');
            });
        });
        socket.on('memberloginpasswordfail', function() {
            swal(
                'Senha inválida.',
                'Verifique sua senha.',
                'error'
            )
            gtag('event', 'login_invalid_password');
        });
        socket.on('memberloginaccountfail', function() {
            swal(
                'Conta indisponível',
                'Desculpe, sua conta foi desativada.',
                'error'
            )
            gtag('event', 'login_disabled_account');
        });
        socket.on('memberloginemailfail', function() {
            swal(
                'E-mail inválido',
                'Nenhum usuário encontrado com este endereço de e-mail.',
                'error'
            )
            gtag('event', 'login_invalid_email');
        });
        socket.on('memberloginmustverify', function() {
            swal({
                title: 'Confirmar E-mail',
                text: 'Insira o código enviado ao seu endereço de e-mail:',
                input: 'text',
                showCancelButton: false,
                confirmButtonText: 'Confirmar',
                allowOutsideClick: false
            }).then(function(code) {
                socket.emit('member.confirm', {
                    token: code
                })
                gtag('event', 'login_try_confirm_account');
            })
            gtag('event', 'login_unconfirmed_account');
        });
        socket.on('memberconfirmdatasuccess', function() {
            swal("OK", "E-mail confirmado!", "success");
            gtag('event', 'login_confirm_account_success');
            $("#signupSplash").hide(349);
            $("#loginSplash").delay(350).show();
            if (!window.common.UID) $("[data-do=signin]").click();
        });
        socket.on('memberconfirmdatafail', function() {
            swal({
                title: 'Token Inválido',
                text: 'Insira o código enviado ao seu endereço de e-mail:',
                input: 'text',
                showCancelButton: false,
                confirmButtonText: 'Confirmar',
                allowOutsideClick: false
            }).then(function(code) {
                socket.emit('member.confirm', {
                    token: code
                })
            })
            gtag('event', 'signup_invalid_token');
        });
        socket.on('memberconfirmtokenfail', function() {
            swal({
                title: 'Token Inválido',
                text: 'Insira o código enviado ao seu endereço de e-mail:',
                input: 'text',
                showCancelButton: false,
                confirmButtonText: 'Confirmar',
                allowOutsideClick: false
            }).then(function(code) {
                socket.emit('member.confirm', {
                    token: code
                })
            })
            gtag('event', 'signup_invalid_token');
        });
        socket.on('membersignup_emailfail', function() {
            swal(
                "E-mail já registrado",
                "Já existe uma conta registrada com seu endereço de e-mail. Caso tenha perdido sua senha, utilize a ferramenta \"Esqueci minha senha\".",
                "warning");
            $("#signup_2").hide("drop", { position: "right" }, 300);
            $("#signup_1").delay(301).show("drop", 300);
            gtag('event', 'signup_email_already_exists');
        });
        socket.on('membersignupsuccess', function() {
            swal({
                title: 'Confirmar e-mail',
                text: 'Para finalizar, insira o código enviado ao seu endereço de e-mail:',
                input: 'text',
                showCancelButton: false,
                confirmButtonText: 'Finalizar',
                allowOutsideClick: false
            }).then(function(code) {
                socket.emit('member.confirm', {
                    token: code
                })
                gtag('event', 'signup_try_confirm_account');
            })
            gtag('event', 'signup_success');
        });
        socket.on('memberrequestotptoken', function(args) {
            var requestOtpToken = function(b64) {
                var title = args.wrong ? "Token incorreto" : "Token de Login";
                var text = args.otp ? "Insira o código gerado por seu aplicativo:" : "Insira o código numérico enviado ao seu " + (args.sentby == 'phone' ? 'telefone (via SMS).' : 'e-mail');
                swal({
                    title: title,
                    text: text,
                    input: 'text',
                    showCancelButton: true,
                    confirmButtonText: 'Entrar',
                    cancelButtonText: 'Cancelar',
                    allowOutsideClick: false
                }).then(function(otp_token) {
                    socket.emit('member.login', {
                        "email": $("[data-var=signin-email]").val(),
                        "password": $("[data-var=signin-password]").val(),
                        "otp_token": otp_token,
                        "exchange": EXCHANGE,
                        "browser_id": "1",
                        "b64": b64,
                        "tz": moment.tz.guess()
                    });
                })
            };

            // webcam?
            if (args.webcam) {
                takeWebcamPicture(requestOtpToken);
            } else {
                requestOtpToken();
            }
        })
        socket.on('recover.tokenok', function() {
            $("#recover_2").fadeOut(300);
            $("#recover_3").delay(300).fadeIn(300);
        })
        socket.on('under_lower_limit', function() {
            gtag('event', 'try_low_order');
            swal("Valor Abaixo do Mínimo", "Ordens precisam compreender a um mínimo de 0.0002 BTC.", "error");
        })
        socket.on('recover.wrongtoken', function() {
            gtag('event', 'recover_invalid_token');
            swal("Token inválido", "Um novo token será enviado ao seu e-mail. Copie-o para o campo indicado.", "error");
        });
        socket.on('recover.invaliduser', function() {
            gtag('event', 'recover_invalid_user');
            swal("Usuário inválido", "Não foi encontrado usuário registrado com o endereço de e-mail informado.", "error");
        });
        socket.on('recover.pwdok', function() {
            gtag('event', 'recover_success');
            swal("Senha alterada", "Sua senha foi alterada com sucesso.\nAgora você já consegue entrar com suas novas credenciais.", "success");
            $("#recoverSplash").fadeOut(300);
            $("#loginSplash").delay(300).fadeIn(300);
            $("#recover_3").delay(300).css('display', 'none');
            $("#recover_1").delay(300).css('display', 'block');
        });
        socket.on('memberloginsuccess', function(args) {
            gtag('event', 'login_success');
            //zE.hide();
            localStorage.setItem('sess_key', args.sess_key);
            setTimeout(function() {
                var socketio_emit_loop = function() {
                    socket.emit('balance.getbalance', { sess_key: args.sess_key });
                    socket.emit('orderbook.getbook', { sess_key: args.sess_key });
                    socket.emit('ledger.list', { sess_key: args.sess_key, page: parseInt($("[data-var=ledger_page]").val()) });
                    socket.emit('ledger.trades', { sess_key: args.sess_key, page: parseInt($("[data-var=timeline_page]").val()) });
                    socket.emit('orders.myorders', { sess_key: args.sess_key });
                    socket.emit('orders.myoldorders', { sess_key: args.sess_key });
                    socket.emit('orders.myspecialorders', { sess_key: args.sess_key });
                    socket.emit('limits.get_user_limits', { sess_key: args.sess_key });
                    socket.emit('ticker.get');
                    socket.emit('sessions.listActiveSessions', { sess_key: args.sess_key });
                    socket.emit('notifications.getUnread', { sess_key: args.sess_key });
                };
                var socketio_long_loop = function() {
                    socket.emit('deposit.list_fiat', { sess_key: args.sess_key });
                    socket.emit('deposit.list_crypto', { sess_key: args.sess_key });
                    socket.emit('withdrawals.list_fiat', { sess_key: args.sess_key });
                    socket.emit('withdrawals.list_crypto', { sess_key: args.sess_key });
                    socket.emit('userdocuments.checkprocess', { sess_key: args.sess_key });
                    socket.emit('level.getLevelsData', { sess_key: args.sess_key });
                    socket.emit('profiledetails.getProfileDetails', { sess_key: args.sess_key });
                }
                socketio_emit_loop();
                socketio_long_loop();
                setInterval(socketio_emit_loop, 10000);
                setInterval(socketio_long_loop, 20000);

                socket.emit('profile.getdetails', { sess_key: args.sess_key });
                socket.emit('profiledetails.getProfileDetails', { sess_key: args.sess_key });
                socket.emit('sitebankaccs.list', { exchange: EXCHANGE });
                socket.emit('deposit.list_crypto', { sess_key: args.sess_key });
                socket.emit('deposit.list_fiat', { sess_key: args.sess_key });
                socket.emit('withdrawals.list_fiat', { sess_key: args.sess_key });
                socket.emit('withdrawals.list_crypto', { sess_key: args.sess_key });
                socket.emit('level.getLevelsData', { sess_key: args.sess_key });
                socket.emit('limits.get_user_limits', { sess_key: args.sess_key });
                socket.emit('ticker.register');
                socket.emit('ticker.get');
                socket.emit('sessions.listActiveSessions', { sess_key: args.sess_key });
                var range = [1, 24];
                socket.emit('volume.calc', range);

                socket.emit('common.get', {
                    exchange: EXCHANGE,
                    crypto_currency: window.common.crypto_currency.name,
                    fiat_currency: window.common.fiat_currency.name
                });
            }, 500);

            $("#splash").fadeOut(1000);
            loadView('basic');
            setTimeout(function() {
                $("[data-var=chart]").attr('src', '/chart.html?' + Math.random());
            }, 5000);
        });
        socket.on('order_emitted', function() {
            socket.emit('balance.getbalance', { sess_key: localStorage.getItem('sess_key') });
            socket.emit('orderbook.getbook', { sess_key: localStorage.getItem('sess_key') });
            socket.emit('orders.myorders', { sess_key: localStorage.getItem('sess_key') });
            socket.emit('orders.myoldorders', { sess_key: localStorage.getItem('sess_key') });
            socket.emit('orders.myspecialorders', { sess_key: localStorage.getItem('sess_key') });
            socket.emit('ticker.get');
            notifyme("Ordem enviada!", "success");
        })
        socket.on('btcwallet', function(wallet) {
            $("[data-var=userwallet]").textBlink(wallet);
            $("[data-var=userwallet_qrcode]").attr("src", "https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=" + encodeURIComponent('bitcoin:' + wallet) + "&choe=UTF-8");
        });
        socket.on('depositlist_cryptosuccess', function(data) {
            $("#depositos_crypto_tbl tr").remove();
            data.forEach(function(row) {
                $("#depositos_crypto_tbl").append('<tr>\
                        <td>' + jsmoment(row.created_at).calendar() + '</td>\
                        <td>' + money_format.crypto(row.amount) + '</td>\
                        <td>\
                            <a class="button is-light is-small" style="border: 1px solid #dbdbdb; height: 24px !important;" target="_blank" href="https://blockexplorer.com/tx/' + row.txid + '">Ver</a>\
                        </td>\
                        <td>\
                            <span class="tag is-' + (row.status == 'confirmed' ? 'success' : 'warning') + '">' + (row.status == 'confirmed' ? 'Confirmado' : 'Pendente') + '</span>\
                        </td>\
                    </tr>');
            });
        });
        socket.on('withdrawcrypto_wrongpwd', function() {
            gtag('event', 'withdraw_invalid_password');
            swal("Erro", "Senha inválida.", "error");
        })
        socket.on('user_limits', function(limits) {
            if (limits.deposit === null)
                $("[data-var=fiat_deposit_limit]").textBlink("∞");
            else
                $("[data-var=fiat_deposit_limit]").textBlink(money_format.fiat(limits.deposit));

            if (limits.withdraw === null)
                $("[data-var=fiat_withdraw_limit]").textBlink("∞");
            else
                $("[data-var=fiat_withdraw_limit]").textBlink(money_format.fiat(limits.withdraw));
        });
        socket.on('ticker', function(tickerdata) {
            // up/down favicon
            var old_price = money_format.from.fiat($("#ticker_last").text().substr(3));
            if (old_price && tickerdata.last > old_price) {
                document.querySelectorAll("link[rel*='icon'")[0].href = '/assets/ico/icon_up.ico';
            } else if (old_price && tickerdata.last < old_price) {
                document.querySelectorAll("link[rel*='icon'")[0].href = '/assets/ico/icon_down.ico';
            }

            document.title = money_format.fiat(tickerdata.last) + ' - BRE Coins';

            $("#ticker_last").textBlink(money_format.fiat(tickerdata.last));
            $("#ticker_high").textBlink(money_format.fiat(tickerdata.high));
            $("#ticker_low").textBlink(money_format.fiat(tickerdata.low));
            $("#ticker_vol_fiat").textBlink(money_format.fiat(tickerdata.vol_fiat));
            $("#ticker_vol_crypto").textBlink(money_format.crypto(tickerdata.vol_crypto));
        });
        socket.on('enablefaceerror', function(error) {
            gtag('event', 'enable_facial_recognition_error');
            swal("Verificação Biométrica", error.Description, "error");
        });
        socket.on('upgrade_process_sent', function() {
            swal("Solicitação de Confirmação de Conta", "Seus documentos foram enviados e serão analisados no menor tempo possível.", "success");
            loadingOff();
        })
        socket.on('mobile_upgrade_process_sent', function() {
            pageloaderoff();
            swal("SMS Enviado", "Aguarde o recebimento do SMS e continue o processo seguindo as instruções na tela de seu aparelho.", "info");
        })
        socket.on('profilegetdetailssuccess', function(data) {
            gtag('config', 'GA_TRACKING_ID', {
              'user_id': data.id
            });
            window.common.UID = data.id;
            window.common.udata = data;
            /*zE.identify({
              name: data.fullname,
              email: data.email,
              organization: data.level
            });*/
            $("[data-var=user_fullname]").text(data.fullname);
            $("[data-var=user_fullname_input]").val(data.fullname);
            $("[data-var=user_name]").text(data.fullname.split(" ")[0]);
            $("[data-var=user_email_input]").val(data.email);
            $("[data-var=user_nick]").text(utf8_encode(data.nickname));
            $("[data-var=user_level]").text(data.level);
            $("[data-var=gravatar]").attr("src", data.gravatar + "&s=128");
            $("[data-var=user_telephone_input]").intlTelInput("setNumber", data.phone);
            $("[data-var=user_city]").val(data.city);

            if (data.otp_secret) {
                $("[data-do=enable_otp]").hide();
                $("[data-do=disable_otp]").show();
            } else {
                $("[data-do=enable_otp]").show();
                $("[data-do=disable_otp]").hide();
            }

            $("[data-var=signup_country]").val(data.country_id).trigger("change");
            setTimeout(function() {
                $("[data-var=user_region]").val(data.region);

                // intro
                if (!store.get('intro_' + window.common.UID)) {
                    store.set('intro_' + window.common.UID, 1);
                    /*introJs().setOption("nextLabel", " > ")
                        .setOption("prevLabel", " < ")
                        .setOption("skipLabel", "Sair")
                        .setOption("doneLabel", "Fechar")
                        .start();*/
                }
            }, 2500);

            updateordertypes();
        });
        socket.on('upgrade_success', function(data) {
            gtag('event', 'upgrade_to_'+data.level);
            $("#upgradeWaiting").removeClass('is-active');
        })
        socket.on('profiledetails', function(data) {
            if (data.face) {
                $("[data-do=enable_facial]").hide();
                $("[data-do=disable_facial]").show();
            } else {
                $("[data-do=enable_facial]").show();
                $("[data-do=disable_facial]").hide();
            }
            if (data.gender) {
                $("[data-var=user_gender]").val(data.gender);
            }
            if (data.cpf) {
                if (!$("[data-var=user_cpf]").is(":focus")) $("[data-var=user_cpf]").val(data.cpf).prop("disabled", true);
                $("#usrcpfSaque").val(data.cpf).prop("disabled", true);
            } else {
                $("[data-var=user_cpf]").val("").prop("disabled", false);
            }
            inputmask($("[data-var=user_cpf]")[0], mask__cpfCnpj);
            inputmask($("#usrcpfSaque")[0], mask__cpfCnpj);
        })
        socket.on('ledgerlist', function(data) {
            $("[data-var=ledger_page]").text(data.page + 1);
            $("[data-var=ledger_list] tr").remove();
            data.rows.forEach(function(row) {
                if (row.curr_type == 'crypto') {
                    var amount = money_format.crypto(row.amount*row.movement);
                    var balance = money_format.crypto(row.balance);
                } else {
                    var amount = money_format.fiat(row.amount*row.movement);
                    var balance = money_format.fiat(row.balance);
                }
                if (row.movement === 1)
                    var color = 'success';
                else
                    var color = 'danger';
                $("[data-var=ledger_list]").append('<tr>\
                        <td>' + jsmoment(row.created_at).format('llll') + '</td>\
                        <td>' + row.description + '</td>\
                        <td><span class="tag is-' + color + '">' + amount + '</span></td>\
                        <td><span class="tag is-success">' + balance + '</span></td>\
                    </tr>');
            });
        });
        socket.on('tradeslist', function(data) {
            $("[data-var=timeline_page]").text(data.page + 1);
            $("[data-var=timeline_list] *").remove();
            data.rows.forEach(function(row) {
                var operation;
                if(row.buyer==window.common.UID) {
                    // buy
                    operation = 'Compra';
                } else {
                    // sell
                    operation = 'Venda';
                }
                $("[data-var=timeline_list]").append('<div class="timeline-item is-primary">\
                <div class="timeline-marker is-primary"></div>\
                <div class="timeline-content">\
                  <p class="heading"><b>'+operation+':</b> '+money_format.crypto(row.amount)+' / '+money_format.fiat(row.price)+'</p>\
                  <p>'+jsmoment(row.time).format('llll')+'</p>\
                </div>\
              </div>');
            })
        })
        socket.on('myorders', function(rows) {
            $("[data-var=orderlist] tr,[data-var=user_orders] tr").remove();
            rows.forEach(function(row) {
                var ordertype = row.type == 'sell' ? "Venda" : "Compra";
                $("[data-var=orderlist]").append('\
                    <tr class="myorder_' + row.id + '">\
                        <td>' + jsmoment(row.created_at).format('llll') + '</td>\
                        <td>' + ordertype + '</td>\
                        <td>\
                            ' + money_format.crypto(Math.max(1e8 * row.amount_fiat / Math.max(row.crypto_price_min, row.crypto_price_max), row.amount_crypto)) + '<br>\
                            ' + money_format.fiat(Math.max(row.crypto_price_min, row.crypto_price_max)) + '\
                        </td>\
                        <td>\
                            <div class="tags has-addons">\
                                <a class="tag is-delete" data-do="cancelOrder" data-order-id="' + row.id + '"></a>\
                            </div>\
                        </td>\
                    </tr>');

                $("[data-var=user_orders]").append('<tr class="myorder_' + row.id + '">\
                    <td>\
                        ' + money_format.crypto(Math.max(1e8 * row.amount_fiat / Math.max(row.crypto_price_min, row.crypto_price_max), row.amount_crypto)) + '\
                         • \
                        <b>' + money_format.fiat(Math.max(row.crypto_price_min, row.crypto_price_max)) + '</b>\
                        <div class="is-pulled-right">\
                            <div class="control">\
                                <div class="tags has-addons">\
                                    <span class="tag is-' + (ordertype == 'Venda' ? 'danger' : 'success') + '">' + ordertype + '</span>\
                                    <a class="tag is-delete" data-do="cancelOrder" data-order-id="' + row.id + '"></a>\
                                </div>\
                            </div>\
                        </div>\
                    </td>\
                </tr>');
            });
        });
        socket.on('myoldorders', function(rows) {
            $("[data-var=oldorderlist] tr").remove();
            rows.forEach(function(row) {
                if (!parseInt(row.amount_fiat) && !parseInt(row.amount_crypto)) {
                    var ordertype = row.type == 'sell' ? "Venda" : "Compra";
                    $("[data-var=oldorderlist]").append('\
                        <tr class="myoldorder_' + row.id + '">\
                            <td>' + jsmoment(row.created_at).format('llll') + '</td>\
                            <td>' + ordertype + '</td>\
                            <td>\
                                ' + money_format.crypto(Math.max(1e8 * row.initial_amount_fiat / Math.max(row.crypto_price_min, row.crypto_price_max), row.initial_amount_crypto)) + '<br>\
                                ' + money_format.fiat(Math.max(row.crypto_price_min, row.crypto_price_max)) + '\
                            </td>\
                        </tr>');
                }
            });
        });
        socket.on('myspecialorders', function(rows) {
            $("[data-var=orderspecial] tr").remove();
            rows.forEach(function(row) {
                var ordertype = row.type == 'sell' ? "Venda" : "Compra";
                $("[data-var=orderspecial]").append('\
                    <tr id="myspecialorder_' + row.id + '">\
                        <td>' + money_format.fiat(row.trigger) + '</td>\
                        <td>' + ordertype + '</td>\
                        <td>' + money_format.crypto(Math.max(row.fiat_amount, row.crypto_amount)) + '</td>\
                        <td>' + money_format.fiat(Math.max(row.crypto_price_min, row.crypto_price_max)) + '</td>\
                        <td>\
                            <div class="tags has-addons">\
                                <a class="tag is-delete" data-do="cancelSpecialOrder" data-order-id="' + row.id + '"></a>\
                            </div>\
                        </td>\
                    </tr>');
            });
        });
        socket.on('orderslist', function(rows) {

        });
        socket.on('transactionsbook', function(rows) {

        });
        socket.on('notifications', function(rows) {

        });
        socket.on('alert', function(alert) {
            notifyme(alert.message, alert.template, 'top-right', 3000);
        });
        socket.on('depositslist', function(rows) {

        });
        socket.on('withdrawalslist', function(rows) {

        });
        socket.on('orderbook', function(rows) {
            $("[data-var=offerbook_buy] tr,[data-var=offerbook_sell] tr").remove();
            rows.forEach(function(row) {
                var theprice, theamount;
                if (row.type == 'buy') {
                    theprice = row.crypto_price_max / 1e2;
                    theamount = (row.amount_fiat / row.crypto_price_max);
                } else {
                    theprice = row.crypto_price_min / 1e2;
                    theamount = row.amount_crypto / 1e8;
                }

                var is_acumulado = $(".acumulado").hasClass('is-dark');
                var $possible_row = $("[data-var=offerbook_" + row.type + "] tr[data-price=\"" + theprice + "\"]");

                if (is_acumulado && $possible_row.length) {
                    var newamount = parseFloat($possible_row.data('amount')) + parseFloat(theamount);
                    $possible_row.data('amount', newamount);
                    $possible_row.children("td:nth-child(2)").text(money_format.crypto(newamount * 1e8));
                } else {
                    var table_row = '<tr data-price="' + theprice + '" data-amount="' + theamount + '" data-do="offerclick">\
                            <td>' + row.nick + '</td>\
                            <td>' + money_format.crypto(theamount * 1e8) + '</td>\
                            <td>' + money_format.fiat(theprice * 1e2) + '</td>\
                        </tr>';
                    //if(row.type=='buy')
                    $("[data-var=offerbook_" + row.type + "]").append(table_row);
                    //else
                    //    $("[data-var=offerbook_"+row.type+"]").prepend(table_row);
                }
            });
        });
        socket.on('simulatemarketbuy', function(amount) {
            //$("[data-var=user_funds_brl-btc]").textBlink(money_format.crypto(amount));
            $("[data-var=user_funds_brl-btc]").textBlink(money_format.crypto(money_format.from.fiat($("[data-var=user_funds_fiat]").text().substr(2)) * 1e8 / money_format.from.fiat($("#ticker_last").text().substr(3))));
        });
        socket.on('simulatemarketsell', function(amount) {
            //$("[data-var=user_funds_btc-brl]").textBlink(money_format.fiat(amount));
            $("[data-var=user_funds_btc-brl]").textBlink(money_format.fiat(money_format.from.fiat($("#ticker_last").text().substr(3)) * money_format.from.crypto($("[data-var=user_funds_crypto]").text().substr(2)) / 1e8));
        });
        socket.on('activesessionslist', function(data) {
            $("[data-var=activesessions] tr").remove();
            data.forEach(function(as) {
                $("[data-var=activesessions]").append('<tr>\
                    <td><span aria-label="' + as.ua + '" class="hint--right">' + as.browser + '</span></td>\
                    <td>' + as.ip + '</td>\
                    <td><span aria-label="Localização aproximada, com base no endereço IP" class="hint--top">' + as.location + '</span></td>\
                    <td>' + jsmoment(as.created_at).format('llll') + '</td>\
                    <td>' + jsmoment(as.updated_at).calendar() + '</td>\
                    <td>' + (localStorage.sess_key != as.key ? '<button class="button is-danger is-small" data-do="closeactivesession" data-sess="' + as.key + '">\
                        <i class="fa fa-times fa-fw"></i>\
                    </button>' : '(atual)') + '</td>\
                    </tr>');
            })
        });
        socket.on('notifications.unreadList', function(rows) {
            var old_length = $("[data-var=notifications] a").length;
            if (rows.length) {
                var html_n = '';
                rows.forEach(function(row) {
                    html_n += '<a class="item is-fullwidth" data-do="notification-mark-as-read" data-nid="' + row.id + '">\
                                ' + row.message + '<br><sub>' + jsmoment(row.date).format('llll') + '</sub>\
                            </a>';
                });
                $("[data-var=notifications]").html(html_n);
                $("#notification_icon").addClass('fa-bell').removeClass('fa-bell-o'); // .bell = ringing effect
                $("#notification_icon").attr("data-badge", rows.length).addClass("badge is-badge-small is-badge-danger");

                var new_length = $("[data-var=notifications] a").length;
                if (new_length > old_length) playNotify();
            } else {
                $("#notification_icon").addClass("fa-bell-o").removeClass("bell fa-bell badge is-badge-small is-badge-danger").removeAttr("data-badge");
                $("[data-var=notifications]").html('<div class="item is-fullwidth">\
                                Sem notificações\
                            </div>');
            }
        })
        socket.on('common', function(data) {
            window.common.fiat_currency_id = data.fiat_currency_id;
            window.common.crypto_currency_id = data.crypto_currency_id;
        });
        socket.on('sitebanks', function(rows) {
            $("[data-var=sitebanklist] a,#bankdetail div,[data-var=sitebanknames] option").remove();
            rows.forEach(function(row) {
                $("[data-var=sitebanklist]").append('\
                    <a href="#" class="dropdown-item" data-do="changeActiveBank" data-bank-id="' + row.id + '">\
                        ' + row.bank_name + '\
                    </a>');
                $("#bankdetail").append('\
                    <div id="bankdetail-' + row.id + '" style="display: none">\
                        <h2 class="subtitle">' + row.bank_name + '</h2>\
                        <p class="container">' + row.bank_data + '</p>\
                    </div>');
                $("[data-var=sitebanknames]").append('<option value="' + row.bank_name + '">' + row.bank_name + '</option>');
            });
        });
        socket.on('allbanks', function(rows) {
            $("[data-var=allbanks] option,[data-var=mainbanks] option").remove();
            rows.forEach(function(row) {
                if (!row) return;
                var optgroup;

                if (row.is_favorite)
                    optgroup = 'mainbanks';
                else
                    optgroup = 'allbanks';

                $("[data-var=" + optgroup + "]").append('<option value="' + row.bank_name + '">' + row.bank_name + '</option>');
            });
        });
        socket.on('depositdeposit_fiatsuccess', function(id) {
            socket.emit('depositdeposit_fiatsuccess', { sess_key: localStorage.getItem('sess_key') });
            $("[data-var=lastFiatDepositId]").textBlink(id);
            showModal('depositModal');
        });
        socket.on('withdrawallist_cryptosuccess', function(rows) {
            $("[data-var=saqueslist_crypto_tbl] tr").remove();
            rows.reverse();
            rows.forEach(function(row) {
                var status, color, row_html;
                switch (row.status) {
                    case 'pending':
                        status = 'Pendente';
                        row_html = "-";
                        color = 'info';
                        break;
                    case 'done':
                        status = 'Realizado';
                        color = 'success';
                        row_html = '<a class="button is-small is-light" style="border: 1px solid #dbdbdb; height: 24px !important" target="_blank" href="https://live.blockcypher.com/btc/tx/' + row.txid + '/">Ver</a>';
                        break;
                    case 'working':
                        status = 'Executando...';
                        color = 'info';
                    case 'hold':
                        status = 'A ser realizado';
                        color = 'info';
                    case 'disapproved':
                        status = 'Cancelada';
                        color = 'danger';
                        row_html = "-";
                        break;
                }
                $("[data-var=saqueslist_crypto_tbl]").append('\
                    <tr>\
                        <td>' + jsmoment(row.created_at).calendar() + '</td>\
                        <td>' + money_format.crypto(row.amount) + '</td>\
                        <td>\
                            ' + row_html + '\
                        </td>\
                        <td>\
                            <span class="tag is-' + color + '">' + status + '</span>\
                        </td>\
                    </tr>\
                    ');
            });
        });
        socket.on('withdrawallist_fiatsuccess', function(rows) {
            $("#saqueslist_fiat_tbl tr").remove();
            rows.reverse();
            rows.forEach(function(row) {
                var status, color, row_html, show_date, border = '';
                switch (row.status) {
                    case 'pending':
                        status = 'Pendente';
                        row_html = "-";
                        color = 'light';
                        border = '1px solid #dbdbdb';
                        show_date = false;
                        break;
                    case 'done':
                        status = 'Realizado';
                        color = 'success';
                        row_html = '-';
                        show_date = true;
                        break;
                    case 'disapproved':
                        status = 'Falhou';
                        color = 'danger';
                        row_html = row.reason;
                        show_date = true;
                        break;
                }
                $("#saqueslist_fiat_tbl").append('\
                    <tr>\
                        <td>' + jsmoment(row.created_at).calendar() + '</td>\
                        <td>' + money_format.fiat(row.amount) + '</td>\
                        <td>\
                            ' + row_html + '\
                        </td>\
                        <td>\
                            <span style="height: 24px !important" class="tag is-' + color + '" style="height: 24px !important; ' + (border ? 'border: ' + border : '') + '">' + status + '</span>\
                            ' + (show_date ? '<br><sub>' + jsmoment(row.updated_at).calendar() + '</sub>' : '') + ' \
                        </td>\
                    </tr>\
                    ');
            });
        });
        socket.on('depositlist_fiatsuccess', function(rows) {
            //$("#depositos_fiat_tbl tr").remove();
            var final_html = "";
            rows.reverse();
            rows.forEach(function(row) {
                var status, color, row_html, show_date, border = '';
                switch (row.status) {
                    case 'pending':
                        status = 'Pendente';
                        color = 'gray';
                        show_date = false;
                        border = '1px solid #dbdbdb';
                        row_html = '<code>#' + row.id + '</code>\
                            <div class="file is-small">\
                                <label class="file-label">\
                                    <input class="file-input | fiatdeposit_uploadreceipt" data-deposit-id="' + row.id + '" type="file" data-do="upload_receipt">\
                                    <span class="file-cta">\
                                        <span class="file-icon">\
                                            <i class="fa fa-upload"></i>\
                                        </span>\
                                        <span class="file-label">\
                                            Enviar Comprovante\
                                        </span>\
                                    </span>\
                                </label>\
                            </div>';
                        break;
                    case 'waitingapproval':
                        status = 'Em Análise';
                        show_date = true;
                        row_html = "";
                        color = 'white';
                        border = '1px solid #dbdbdb';
                        break;
                    case 'done':
                        status = 'Aprovado';
                        show_date = true;
                        color = 'success';
                        row_html = "";
                        break;
                    case 'cancelled':
                        return;
                    case 'disapproved':
                        status = 'Reprovado';
                        show_date = true;
                        color = 'danger';
                        row_html = row.reason;
                        break;
                }
                //$("#depositos_fiat_tbl").append('\
                final_html += ('\
                    <tr>\
                        <td>' + jsmoment(row.created_at).calendar() + '</td>\
                        <td>' + money_format.fiat(row.amount) + '</td>\
                        <td>\
                            ' + row_html + '\
                        </td>\
                        <td>\
                            <span class="tags has-addons"><span class="tag is-' + color + '" style="height: 24px !important; ' + (border ? 'border: ' + border : '') + '">' + status + '</span>' + (status == 'Pendente' ? '<a class="tag is-delete" title="Cancelar Ordem" data-id="' + row.id + '" data-do="cancel_fiat_deposit"></a>' : '') + '</span>\
                            ' + (show_date ? '<br><sub>' + jsmoment(row.updated_at).calendar() + '</sub>' : '') + '\
                        </td>\
                    </tr>\
                    ');
            });
            if ($("#depositos_fiat_tbl").html() != final_html) $("#depositos_fiat_tbl").html(final_html);
        });
        socket.on('balance_crypto', function(bal) {
            window.common.max_crypto = bal;
            $("[data-var=user_funds_crypto]").textBlink('฿ ' + (bal / 1e8).toFixed(8));
            socket.emit('balance.simulateMarketSell', { amount_crypto: bal });
        });
        socket.on('balance_fiat', function(bal) {
            window.common.max_fiat = bal;
            $("[data-var=user_funds_fiat]").textBlink(money_format.fiat(bal));
            socket.emit('balance.simulateMarketBuy', { amount_fiat: bal });
        });
        socket.on('memberupdatedatafail', function() {
            gtag('event', 'change_password_invalid_old_password');
            swal("Erro", "Senha antiga inválida.", "warning");
        });
        socket.on('memberupdatepasswordsuccess', function() {
            gtag('event', 'change_password_success');
            swal("Alterado com sucesso", "Seus dados foram alterados com sucesso.", "success");
        });
        socket.on('memberupdateemailfail', function() {
            gtag('event', 'change_email_error_email_already_registered');
            swal("E-mail já existe", "Já existe uma conta registrada neste endereço de e-mail.", "error");
        });
        socket.on('enableotp_error', function(data) {
            if (data.err == 'test') {
                gtag('event', 'enableotp_error_invalid_token');
                swal("Erro", "Token inválido. Tente novamente.", "error");
            } else if (data.err == 'pwd') {
                gtag('event', 'enableotp_error_invalid_password');
                swal("Erro", "Senha incorreta. Tente novamente.", "error");
            }
        });
        socket.on('enableotp_success', function() {
            $("[data-do=enable_otp]").hide();
            $("[data-do=disable_otp]").show();
        });
        socket.on('disableotp_success', function() {
            $("[data-do=enable_otp]").show();
            $("[data-do=disable_otp]").hide();
        });
        socket.on('disableotp_error', function() {
            gtag('event', 'disableotp_error_invalid_password');
            swal("Senha incorreta. Tente novamente.", "error");
        });
        socket.on('insuficientfunds', function() {
            gtag('event', 'insuficient_funds');
            swal("Fundos Insuficientes", "Você não possui fundos suficientes para essa operação. Tente novamente, inserindo um valor menor.", "error");
        });
        socket.on('toosmallamount', function() {
            gtag('event', 'too_small_amount');
            swal("Valor Inválido", "Você não inseriu fundos suficientes para essa operação.", "error");
        });
        socket.on('withdraw_fiat_sent', function() {
            swal("Ordem enviada", "Sua ordem de saque foi enviada.", "success");
            socket.emit('deposit.list_fiat', { sess_key: args.sess_key });
        });
        socket.on('withdrawals.overlimit', function(limitdata) {
            gtag('event', 'withdraw_try_over_limit');
            swal("Limite Diário Excedido", "Seu limite diário de saque foi atingido e esta ordem não pôde ser enviada. Seu limite restante é: " + money_format.fiat(limitdata.limit - limitdata.used));
        });
        socket.on('deposit.overlimit', function(limitdata) {
            gtag('event', 'deposit_try_over_limit');
            swal("Limite Diário Excedido", "Seu limite diário de depósito foi atingido e esta ordem não pôde ser enviada. Seu limite restante é: " + money_format.fiat(limitdata.limit - limitdata.used));
        });
        socket.on('cpfcnpjerr', function(reason) {
            var $cpfinput = $("[data-var=user_cpf]");
            if (reason == 'invalid' && $cpfinput.val()) {
                $cpfinput.prop("disabled", false);
                gtag('event', 'invalid_cpf_cnpj');
                swal("CPF/CNPJ inválido", "O CPF ou CNPJ informado não é válido.", "error");
            } else {
                if ($cpfinput.val()) {
                    gtag('event', 'already_registered_cpf_cnpj');
                    swal("CPF/CNPJ já registrado", "Já existe uma conta utilizando o CPF/CNPJ informado. Por favor, confira seus dados. Se acredita que isto seja um erro, entre em contato com o suporte.", "error");
                }
            }
            $("[data-var=user_cpf]").val("");
            $("[data-var=user_cpf]")[0].focus();
        })
        socket.on('level.getLevelsData', function(data) {
            // stars
            var stars_html = '';
            for (i = 1; i <= data.user_level; i++) {
                stars_html += '<i class="fa fa-star"></i>';
            }
            for (i = data.user_level; i < data.max_level; i++) {
                //stars_html += '<i class="fa fa-star-o"></i>';
            }
            $("[data-var=user_level_stars]").html(stars_html);
            $("[data-var=user_level]").text(data.user_level);
            $("[data-var=user_level_name]").text(data.user_level_name);

            $("[data-var=next_level_description]").html("").append(data.next_level_description).html($($("[data-var=next_level_description]")[0]).text());

            if(data.user_level == 1) { //if (data.user_level < data.next_level) {
                $("#level_upgrade_card").show();
                $("#no_level_upgrade_available").hide();
                var old_next_level_name = $("[data-var=next_level_name]").text();
                $("[data-var=next_level_name]").text("Nível " + data.next_level);


                // form
                if (data.user_level > 0) {
                    var upgrade_form = '<button class="button is-white is-invisible" data-do="level_upgrade_toggle" style="display: none"><i class="fa fa-fw fa-arrow-left"></i> Voltar</button><hr/>';

                    data.required_documents.forEach(function(doc) {
                        upgrade_form += '\
                        <div class="file">\
                            <label class="file-label">\
                                <input class="file-input | docupload" data-do="docselected" data-doc="' + doc.doccode + '" type="file" />\
                                <span class="file-cta">\
                                    <span class="file-icon">\
                                        <i class="fa fa-upload"></i>\
                                    </span>\
                                    <span class="file-label">\
                                        ' + (parseInt(doc.doccode) ? doc.docname : '<select data-var="doc-0-type"><option value="2">RG</option><option value="4">CNH</option><option value="12">Passaporte</option></select>') + '\
                                    </span>\
                                </span>\
                                <span class="file-name" data-var="doc-' + doc.doccode + '-filename"><i class="fa fa-paperclip"></i></span>\
                            </label>\
                        </div><br>';
                    });

                    upgrade_form += '<br><button class="button is-dark" data-do="create_upgrade_process"><b>Enviar Documentos</b></button><button class="button is-secondary" data-do="upgrade__menu">Cancelar</button>';

                    //if(!$(".file-name").text().trim() && ((old_next_level_name.trim() && old_next_level_name != $("[data-var=next_level_name]").text()) || !old_next_level_name.trim())) {
                    if (!$("#level_upgrade_form").text().trim() || ($($("[data-var=user_level]")[0]).text() != data.user_level)) {
                        $("#level_upgrade_form").html(upgrade_form);
                    }
                } else {
                    $("#level_upgrade_btn").hide();
                }
            } else {
                $("#level_upgrade_card").hide();
                $("#no_level_upgrade_available").show();
            }

            // custom: force upgrade
            if(parseInt(data.user_level)==1 && typeof window._hasSentProcess == 'undefined') {
                socket.emit('userdocuments.mobileprocess', {
                    cpf: $("[data-var=user_cpf]").val().replace(/[^0-9]/g, ""),
                    gender: $("[data-var=user_gender]").val(),
                    name: $("[data-var=user_fullname_input]").val(),
                    sess_key: localStorage.getItem('sess_key')
                })
                window._hasSentProcess = true;
                $("#upgradeWaiting").addClass('is-active');
            } else if(parseInt(data.user_level)>1) {
                $("#upgradeWaiting").removeClass('is-active');
            }
            // end custom
        });
        socket.on('volumechart', function(data) {
            $("[data-var=volumechart] tr").remove();
            $("[data-var=volumelow]").textBlink(money_format.fiat(data.low));
            $("[data-var=volumehigh]").textBlink(money_format.fiat(data.high));
            $("[data-var=volumeavg]").textBlink(money_format.fiat((data.low + data.high) / 2));
            $("[data-var=volincrease]").textBlink('Δ ' + money_format.fiat(data.high - data.low) + " " + ((100 * data.high) / data.low).toFixed(1) + "%");
            var j = Object.keys(data.periods).length;
            for (i = 1; i <= j; i++) {
                var x = parseInt((data.periods['p' + i].volume * 100) / data.total_volume);
                var y = 100 - x;
                $("[data-var=volumechart]").append('\
                    <tr class="hint--' + (i >= (j / 2) ? 'top' : 'bottom') + ' hint--medium" aria-label=\"Vol.: ' + money_format.crypto(data.periods['p' + i].volume) + '&#10;&#10;Faixa de ' + money_format.fiat(data.periods['p' + i].price_min) + '&#10;Preço: ' + money_format.fiat(data.periods['p' + i].price_max) + '&#10;&#10;Vol. do dia: ' + (x.toFixed(1)) + '%\" style="background: linear-gradient(to right, #fff 0%, #fff ' + Math.max(1, Math.abs((y / 2) - 1)) + '%, #09a589 ' + (y / 2) + '%, #09a589 ' + Math.min(98, (x + (y / 2))) + '%, #fff ' + Math.min(99, (x + (y / 2))) + '%, #fff 100%);">\
                        <td>&nbsp;</td>\
                    </tr>\
                    ');
            }
        });

        $(".addallbtc").addClass("hint--right").attr("aria-label", "Inserir todo o saldo em BTC").click(function() {
            $("#" + $(this).data('target')).val($($("[data-var=user_funds_crypto]")[0]).text().substr(2));
        });
        /*$(".addallbrl").click(function() {
            $("#"+$(this).data('target')).val($("[data-var=user_funds_fiat]").text());
        });*/

        // preview amount
        $("#limitbuy_maxprice_basic,#limitbuy_amount_basic").on('keyup', function() {
            $("#limitbuy_basic_preview").textBlink((money_format.fiat(money_format.from.fiat(($("#limitbuy_maxprice_basic").val())) * (money_format.from.crypto($("#limitbuy_amount_basic").val()) / 1e8))));
        });
        $("#limitsell_minprice_basic,#limitsell_amount_basic").on('keyup', function() {
            $("#limitsell_basic_preview").textBlink(money_format.fiat(money_format.from.fiat($("#limitsell_minprice_basic").val()) * money_format.from.crypto($("#limitsell_amount_basic").val()) / 1e8));
        });
        $("#basic_orders_buy_amount,#basic_orders_buy_price").on('keyup', function() {
            $("#basic_order_buy_preview").textBlink(money_format.fiat(money_format.from.fiat($("#basic_orders_buy_price").val()) * money_format.from.crypto($("#basic_orders_buy_amount").val()) / 1e8));
        });
        $("#basic_orders_sell_amount,#basic_orders_sell_price").on('keyup', function() {
            $("#basic_order_sell_preview").textBlink(money_format.fiat(money_format.from.fiat($("#basic_orders_sell_price").val()) * money_format.from.crypto($("#basic_orders_sell_amount").val()) / 1e8));
        });
        $("#limitbuy_maxprice,#limitbuy_amount").on('keyup', function() {
            var preview = money_format.from.fiat($("#limitbuy_maxprice").val()) * (money_format.from.crypto($("#limitbuy_amount").val()) / 1e8);
            if (preview)
                $("#limitbuy_preview").textBlink(money_format.fiat(preview)).parent("p.orderform_preview").slideDown();
            else
                $("#limitbuy_preview").parent("p.orderform_preview").slideUp();
        });
        $("#limitsell_minprice,#limitsell_amount").on('keyup', function() {
            var preview = money_format.from.fiat($("#limitsell_minprice").val()) * (money_format.from.crypto($("#limitsell_amount").val()) / 1e8);
            if (preview)
                $("#limitsell_preview").textBlink(money_format.fiat(preview)).parent("p.orderform_preview").slideDown();
            else
                $("#limitsell_preview").parent("p.orderform_preview").slideUp();
        });
        $("#marketbuy_maxprice,#marketbuy_amount").on('keyup', function() {
            var preview = money_format.from.fiat($("#marketbuy_maxprice").val()) * (money_format.from.crypto($("#marketbuy_amount").val()) / 1e8);
            if (preview)
                $("#marketbuy_preview").textBlink(money_format.fiat(preview)).parent("p.orderform_preview").slideDown();
            else
                $("#marketbuy_preview").parent("p.orderform_preview").slideUp();
        });
        $("#marketsell_minprice,#marketsell_amount").on('keyup', function() {
            var preview = money_format.from.fiat($("#marketsell_minprice").val()) * (money_format.from.crypto($("#marketsell_amount").val()) / 1e8);
            if (preview)
                $("#marketsell_preview").textBlink(money_format.fiat(preview)).parent("p.orderform_preview").slideDown();
            else
                $("#marketsell_preview").parent("p.orderform_preview").slideUp();
        });


        // command center
        $(document).on("submit", "[data-alias]", function(e) {
            e.preventDefault();
            var target = $(this).data('alias');
            $("[data-do=" + target + "]").click();
        })
        $(document).on("click change", "[data-do]", function(e) {
            $this = $(this);
            if ($this.hasClass('loadingonclick')) loadingonclick($this);
            var action_do_list = $(this).data('do').split(" ");
            action_do_list.forEach(function(action_do) {
                switch (action_do) {
                    case 'linklogin':
                        $(".splashwnd").fadeOut(300);
                        $("#loginSplash").delay(300).fadeIn(300);
                        break;

                    case 'linksignup':
                        $(".splashwnd").fadeOut(300);
                        $("#signupSplash").delay(300).fadeIn(300);
                        var user_country = navigator.language.substr(3, 2).toLowerCase();
                        $("[data-var=signup_country]").val($("[data-iso=" + user_country + "]").val()).trigger('change');
                        gtag('event', 'click_signup');
                        break;

                    case 'linkrecover':
                        $(".splashwnd,#recover_2,#recover_3").fadeOut(300);
                        $("#recoverSplash,#recover_1").delay(300).fadeIn(300);
                        gtag('event', 'click_recover');
                        break;

                    case 'recover_requesttoken':
                        var email = $("[data-var=recover-email]").val();
                        socket.emit('member.recover', {
                            exchange: EXCHANGE,
                            email: email
                        });
                        $("#recover_1").fadeOut(300);
                        $("#recover_2").delay(300).fadeIn(300);
                        break;

                    case 'recover_verify':
                        socket.emit('member.recover_checktoken', {
                            exchange: EXCHANGE,
                            email: $("[data-var=recover-email]").val(),
                            token: $("[data-var=recover-token]").val()
                        });
                        break;

                    case 'recover_changepwd':
                        var newpwd = $("[data-var=recover-newpwd]").val();
                        if (newpwd == $("[data-var=recover-newpwd-2]").val()) {
                            socket.emit('member.recover_checktoken', {
                                exchange: EXCHANGE,
                                email: $("[data-var=recover-email]").val(),
                                token: $("[data-var=recover-token]").val(),
                                new_password: newpwd
                            });
                            gtag('event', 'password_recovered');
                        } else {
                            swal("Erro", "As duas senhas não conferem.", "warning");
                        }
                        break;

                    case 'go_home':
                        if (store('trading_interface') == 'basic') {
                            loadView('basic');
                            gtag('event', 'view_basic_trader');
                            //$("#sidebar-menu").addClass("is-basic");
                        } else {
                            loadView('main');
                            gtag('event', 'view_advanced_trader');
                            //$("#sidebar-menu").removeClass("is-basic");
                        }
                        break;

                    case 'togglemenu':
                        $("#sidebar-menu").toggleClass('is-colapsed');
                        break;

                    case 'toggleTrader':
                        if (store('trading_interface') == 'basic') {
                            store('trading_interface', 'advanced');
                            $(".trader-button").text("BÁSICO");
                            loadView('main');
                            gtag('event', 'choose_advanced_trader');
                            //$("#sidebar-menu").removeClass("is-basic");
                        } else {
                            store('trading_interface', 'basic');
                            loadView('basic');
                            gtag('event', 'choose_basic_trader');
                            //$("#sidebar-menu").addClass("is-basic");
                            $(".trader-button").text("TRADER");
                        }
                        break;

                    case 'go_main':
                        $("#main-menu li a.is-active,#navMenu2 .is-active").removeClass("is-active");
                        $("#navMenu2").slideUp('fast');
                        $("#main-menu [data-do=go_main],#navMenu2 [data-do=go_main]").addClass("is-active");
                        if (store('trading_interface') == 'basic') {
                            //$("#sidebar-menu").addClass("is-basic");
                            loadView('basic');
                            gtag('event', 'view_basic_trader');
                        } else {
                            //$("#sidebar-menu").removeClass("is-basic");
                            loadView('main');
                            gtag('event', 'view_advanced_trader');
                        }
                        break;

                    case 'notification-mark-as-read':
                        var nid = $this.data('nid');
                        $this.hide('fold');
                        socket.emit('notifications.markAsRead', { sess_key: localStorage.getItem('sess_key'), id: nid });
                        gtag('event', 'read_notification');
                        break;

                    case 'cancelOrder':
                        var order_id = $this.data('order-id');
                        $(".myorder_" + order_id).slideUp();
                        socket.emit('orders.deleteorder', {
                            sess_id: localStorage.getItem('sess_key'),
                            order_id: order_id
                        });
                        gtag('event', 'cancel_offerbook_order');
                        break;

                    case 'cancelSpecialOrder':
                        var order_id = $this.data('order-id');
                        $("#myspecialorder_" + order_id).slideUp();
                        socket.emit('orders.deletespecialorder', {
                            sess_id: localStorage.getItem('sess_key'),
                            order_id: order_id
                        });
                        gtag('event', 'cancel_special_order');
                        break;

                    case 'signin':
                        socket.emit('member.login', {
                            "email": $("[data-var=signin-email]").val(),
                            "password": $("[data-var=signin-password]").val(),
                            "exchange": EXCHANGE,
                            "browser_id": "1",
                            "tz": moment.tz.guess()
                        });
                        gtag('event', 'login');
                        break;

                    case 'logout':
                        socket.emit('member.logout', { sess_key: localStorage.getItem('sess_key') });
                        localStorage.removeItem('sess_key');
                        $("#splash").fadeIn(1000);
                        grecaptcha.reset();
                        //zE.show();
                        gtag('event', 'logout');
                        gtag('config', 'GA_TRACKING_ID', {
                          'user_id': ''
                        });
                        break;

                    case 'offerclick':
                        var type = $this.parent("tbody").data("var").substr(-3, 3);
                        var amount = $($this.children("td")[1]).text().substr(2);
                        var price = $($this.children("td")[2]).text().substr(3);
                        $(".offerbuy_price,.offerbuy_amount,.offersell_price,.offersell_amount").val("");
                        if (type == 'buy') {
                            $(".offersell_price").val(price);
                            $(".offersell_amount").val(amount);
                        } else {
                            $(".offerbuy_price").val(price);
                            $(".offerbuy_amount").val(amount);
                        }
                        gtag('event', 'click_offerbook_offer');
                        break;

                    case 'toggleAcumulado':
                        $(".acumulado").toggleClass("is-dark is-outlined");
                        $("[data-var=offerbook_buy],[data-var=offerbook_sell]").parent("table").toggleClass('is-acumulado');
                        socket.emit('orderbook.getbook');
                        gtag('event', 'accumulated');
                        break;

                    case "copyuserwallet":
                        (function(text) {
                            var node = document.createElement('textarea');
                            var selection = document.getSelection();

                            node.textContent = text;
                            document.body.appendChild(node);

                            selection.removeAllRanges();
                            node.select();
                            document.execCommand('copy');

                            selection.removeAllRanges();
                            document.body.removeChild(node);
                        })($("[data-var=userwallet]").text());
                        notifyme("Endereço copiado!");
                        gtag('event', 'copy_wallet');
                        break;

                    case 'gennewwallet':
                        socket.emit('deposit.gennewwallet', {
                            sess_key: localStorage.getItem('sess_key')
                        });
                        gtag('event', 'generate_new_wallet');
                        //swal("Wallet está sendo gerada", "Sua nova carteira está sendo gerada e estará disponível em alguns segundos.", "success");
                        swal({
                            title: "Gerando Carteira...",
                            html: '<i class="fa fa-refresh fa-spin fa-3x fa-fw"></i>',
                            showCloseButton: false,
                            showCancelButton: false,
                            showConfirmButton: false,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            allowEnterKey: false
                        })
                        setTimeout(function() {
                            swal.close();
                        }, 20000)
                        break;

                    case 'changeActiveBank':
                        var bankid = $this.data('bank-id');
                        var bankname = $this.text();
                        $("#bank_id").val(bankid);
                        $("#bank-name").text(bankname);
                        $("#bankdetail div").hide();
                        $("#bankdetail-" + bankid).show();
                        $("#bankdetail-" + bankid + " div").show();
                        break;

                    case 'go_upgrade_page':
                        $("[data-goto=account],[data-tab=account_docs][data-group=account]").click();
                        break;

                    case 'createFiatDeposit':
                        var bank = $("#bank_id").val();
                        var amount = money_format.from.fiat($("#valorDeposito").val());
                        if (!bank) {
                            swal("Escolha um banco", "Selecione um banco para realizar o depósito.", 'warning');
                        } else {
                            if (amount < 100000) {
                                swal("Abaixo do Mínimo", "O valor mínimo para depósito é de R$ 1.000,00.", "warning");
                                return;
                            }
                            if (amount) {
                                $("#depositModalBank").html($("#bankdetail-" + bank).html());
                                socket.emit('deposit.deposit_fiat', {
                                    sess_key: localStorage.getItem('sess_key'),
                                    bank: $("#bank_id").val(),
                                    amount: amount,
                                    currency: window.common.crypto_currency_id
                                });
                                gtag('event', 'create_fiat_deposit');
                            } else {
                                swal("Valor inválido", "Insira um valor válido", "warning");
                            }
                        }
                        break;

                    case 'basic_buy':
                        var amount = money_format.from.crypto($("#basic_orders_buy_amount").val());

                        var price = money_format.from.fiat($("#basic_orders_buy_price").val());

                        if (price < best.selling() && !confirm("Seu preço está abaixo da melhor pedida (" + money_format.fiat(best.selling()) + "). Continuar?")) return;

                        $("#basic_orders_buy_amount").val("");
                        $("#basic_orders_buy_price").val("");
                        $(".orderform_preview").slideUp();

                        socket.emit('orders.buy', {
                            'crypto_amount': amount,
                            'crypto_price': price,
                            'crypto_id': window.common.crypto_currency_id,
                            'fiat_id': window.common.fiat_currency_id,
                            'sess_key': localStorage.getItem('sess_key')
                        });
                        gtag('event', 'basic_trader_create_buy_order');
                        // notifyme("Enviando ordem...", "info");
                        break;

                    case 'basic_sell':
                        var amount = money_format.from.crypto($("#basic_orders_sell_amount").val());

                        var price = money_format.from.fiat($("#basic_orders_sell_price").val());

                        if (price > best.buying() && !confirm("Seu preço está acima da melhor oferta (" + money_format.fiat(best.buying()) + "). Continuar?")) return;

                        $("#basic_orders_sell_amount").val("");
                        $("#basic_orders_sell_price").val("");
                        $(".orderform_preview").slideUp();

                        socket.emit('orders.sell', {
                            'crypto_amount': amount,
                            'crypto_price': price,
                            'crypto_id': window.common.crypto_currency_id,
                            'fiat_id': window.common.fiat_currency_id,
                            'sess_key': localStorage.getItem('sess_key')
                        });
                        gtag('event', 'basic_trader_create_sell_order');
                        // notifyme("Enviando ordem...", "info");
                        break;

                    case 'limit_buy':
                        var amount = money_format.from.crypto($("#limitbuy_amount").val());

                        var price = money_format.from.fiat($("#limitbuy_maxprice").val());

                        if (price < best.selling() && !confirm("Seu preço está abaixo da melhor pedida (" + money_format.fiat(best.selling()) + "). Continuar?")) return;

                        $("#limitbuy_amount").val("");
                        $("#limitbuy_maxprice").val("");
                        $(".orderform_preview").slideUp();

                        socket.emit('orders.buy', {
                            'crypto_amount': amount,
                            'crypto_price': price,
                            'crypto_id': window.common.crypto_currency_id,
                            'fiat_id': window.common.fiat_currency_id,
                            'sess_key': localStorage.getItem('sess_key')
                        });
                        gtag('event', 'create_limit_buy_order');
                        // notifyme("Enviando ordem...", "info");
                        break;

                    case 'limit_sell':
                        var amount = money_format.from.crypto($("#limitsell_amount").val());

                        var price = money_format.from.fiat($("#limitsell_minprice").val());

                        if (price > best.buying() && !confirm("Seu preço está acima da melhor oferta (" + money_format.fiat(best.buying()) + "). Continuar?")) return;

                        $("#limitsell_amount").val("");
                        $("#limitsell_minprice").val("");
                        $(".orderform_preview").slideUp();

                        socket.emit('orders.sell', {
                            'crypto_amount': amount,
                            'crypto_price': price,
                            'crypto_id': window.common.crypto_currency_id,
                            'fiat_id': window.common.fiat_currency_id,
                            'sess_key': localStorage.getItem('sess_key')
                        });
                        gtag('event', 'create_limit_sell_order');
                        // notifyme("Enviando ordem...", "info");
                        break;

                    case 'limit_buy_basic':
                        var amount = money_format.from.crypto($("#limitbuy_amount_basic").val());

                        var price = money_format.from.fiat($("#limitbuy_maxprice_basic").val());

                        if (price < best.selling() && !confirm("Seu preço está abaixo da melhor pedida (" + money_format.fiat(best.selling()) + "). Continuar?")) return;

                        $("#limitbuy_amount_basic").val("");
                        $("#limitbuy_maxprice_basic").val("");
                        $(".orderform_preview").slideUp();


                        socket.emit('orders.buy', {
                            'crypto_amount': amount,
                            'crypto_price': price,
                            'crypto_id': window.common.crypto_currency_id,
                            'fiat_id': window.common.fiat_currency_id,
                            'sess_key': localStorage.getItem('sess_key')
                        });
                        gtag('event', 'basic_trader_create_limit_buy_order');
                        // notifyme("Enviando ordem...", "info");
                        break;

                    case 'limit_sell_basic':
                        var amount = money_format.from.crypto($("#limitsell_amount_basic").val());

                        var price = money_format.from.fiat($("#limitsell_minprice_basic").val());


                        if (price > best.buying() && !confirm("Seu preço está acima da melhor oferta (" + money_format.fiat(best.buying()) + "). Continuar?")) return;

                        $("#limitsell_amount_basic").val("");
                        $("#limitsell_minprice_basic").val("");
                        $(".orderform_preview").slideUp();


                        socket.emit('orders.sell', {
                            'crypto_amount': amount,
                            'crypto_price': price,
                            'crypto_id': window.common.crypto_currency_id,
                            'fiat_id': window.common.fiat_currency_id,
                            'sess_key': localStorage.getItem('sess_key')
                        });
                        gtag('event', 'basic_trader_create_limit_sell_order');
                        // notifyme("Enviando ordem...", "info");
                        break;

                    case 'market_buy':
                        var amount = money_format.from.crypto($("#marketbuy_amount").val());

                        var price = money_format.from.fiat($("#marketbuy_maxprice").val());

                        if (price < best.selling() && !confirm("Seu preço está abaixo da melhor pedida (" + money_format.fiat(best.selling()) + ") e uma ordem de limite será lançada. Continuar?")) return;

                        $("#marketbuy_amount").val("");
                        $("#marketbuy_maxprice").val("");
                        $(".orderform_preview").slideUp();

                        socket.emit('orders.buy', {
                            'crypto_amount': amount,
                            'crypto_price': price,
                            'crypto_id': window.common.crypto_currency_id,
                            'fiat_id': window.common.fiat_currency_id,
                            'sess_key': localStorage.getItem('sess_key')
                        });
                        gtag('event', 'create_market_buy_order');
                        // notifyme("Enviando ordem...", "info");
                        break;

                    case 'market_sell':
                        var amount = money_format.from.crypto($("#marketsell_amount").val());

                        var price = money_format.from.fiat($("#marketsell_minprice").val());


                        if (price > best.buying() && !confirm("Seu preço está acima da melhor oferta (" + money_format.fiat(best.buying()) + ") e uma ordem de limite será lançada. Continuar?")) return;


                        $("#marketsell_amount").val("");
                        $("#marketsell_minprice").val("");
                        $(".orderform_preview").slideUp();

                        socket.emit('orders.sell', {
                            'crypto_amount': amount,
                            'crypto_price': price,
                            'crypto_id': window.common.crypto_currency_id,
                            'fiat_id': window.common.fiat_currency_id,
                            'sess_key': localStorage.getItem('sess_key')
                        });
                        gtag('event', 'create_market_sell_order');
                        // notifyme("Enviando ordem...", "info");
                        break;

                    case 'stoplimit_buy':
                        var amount = money_format.from.crypto($("#stoplimitbuy_amount").val());

                        var trigger = money_format.from.fiat($("#stoplimitbuy_trigger").val());


                        swal({
                            title: 'Preço máximo de compra',
                            input: 'text',
                            showCancelButton: true,
                            confirmButtonText: 'Criar Ordem',
                            showLoaderOnConfirm: true,
                            allowOutsideClick: true
                        }).then(function(price) {
                            price = money_format.from.fiat(price);
                            $("#stoplimitbuy_amount").val("");
                            $("#stoplimitbuy_trigger").val("");
                            $(".orderform_preview").slideUp();
                            socket.emit('orders.stoplimit', {
                                'type': 'buy',
                                'crypto_amount': amount,
                                'crypto_price': price,
                                'trigger': trigger,
                                'crypto_id': window.common.crypto_currency_id,
                                'fiat_id': window.common.fiat_currency_id,
                                'sess_key': localStorage.getItem('sess_key')
                            });
                            gtag('event', 'create_stop_limit_buy_order');
                            // notifyme("Enviando ordem...", "info");
                        })
                        break;

                    case 'stoplimit_sell':
                        var amount = money_format.from.crypto($("#stoplimitsell_amount").val());

                        var trigger = money_format.from.fiat($("#stoplimitsell_trigger").val());


                        swal({
                            title: 'Preço mínimo de venda',
                            input: 'text',
                            showCancelButton: true,
                            confirmButtonText: 'Criar Ordem',
                            showLoaderOnConfirm: true,
                            allowOutsideClick: true
                        }).then(function(price) {
                            $("#stoplimitsell_amount").val("");
                            $("#stoplimitsell_trigger").val("");
                            $(".orderform_preview").slideUp();
                            price = money_format.from.fiat(price);
                            socket.emit('orders.stoplimit', {
                                'type': 'sell',
                                'crypto_amount': amount,
                                'trigger': trigger,
                                'crypto_price': price,
                                'crypto_id': window.common.crypto_currency_id,
                                'fiat_id': window.common.fiat_currency_id,
                                'sess_key': localStorage.getItem('sess_key')
                            });
                            gtag('event', 'create_stop_limit_sell_order');
                            // notifyme("Enviando ordem...", "info");
                        })
                        break;

                    case 'georegions':
                        if (e.type == 'change') {
                            var country = $this.val();
                            socket.emit('geo.regionslist', { country: country });
                        }
                        break;

                    case 'signup_2':
                        var email_regexp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                        if (!$('[data-var=signup_name]').val()) {
                            swal(
                                'Nome inválido',
                                'Por favor informe seu nome.',
                                'warning'
                            );
                        } else if (!email_regexp.test($('[data-var=signup_email]').val())) {
                            swal(
                                'E-mail inválido',
                                'Por favor informe seu e-mail corretamente.',
                                'warning'
                            );
                        } else if ($('[data-var=signup_password]').val().length <= 5) {
                            swal(
                                'Senha inválida',
                                'Por favor informe uma senha maior que 5 caracteres.',
                                'warning'
                            );
                        } else if(!$("[data-var=signup_cpf]").val() || !valida_cpf_cnpj($("[data-var=signup_cpf]").val())) {
                            swal("CPF/CNPJ inválido", "Por favor, preencha corretamente o CPF/CNPJ.", "warning");
                            gtag('event', 'signup_invalid_cpfcnpj_error');
                        } else if ($('[data-var=signup_password2]').val() != $("[data-var=signup_password]").val()) {
                            swal(
                                'Senhas não conferem.',
                                'Por favor informe a mesma senha em ambos os campos.',
                                'warning'
                            );
                        } else {
                            $("#signup_1").hide('drop', 300);
                            $("#signup_2").delay(350).show('drop', { direction: 'right' }, 300);
                            gtag('event', 'signup_step_1_complete');
                        }
                        break;

                    case 'chartload':
                        $("[data-var=chart]").attr('src', '/chart.html?' + Math.random());
                        break;

                    case 'cancel_fiat_deposit':
                        var the_id = $this.data('id');
                        swal({
                            title: 'Excluir Ordem',
                            text: "Tem certeza que deseja excluir esta ordem?",
                            type: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#d33',
                            cancelButtonColor: '#3085d6',
                            confirmButtonText: 'Sim, excluir.'
                        }).then(function() {
                            $this.closest('tr').slideUp();
                            socket.emit('deposit.cancel_fiat', {
                                f: the_id,
                                sess_key: localStorage.getItem('sess_key')
                            });
                        })
                        break;

                    case 'signup':
                        if (!$("[data-var=signup_telephone]").intlTelInput("isValidNumber")) {
                            swal("Telefone inválido", "Por favor, insira seu telefone corretamente.", "warning");
                            gtag('event', 'signup_invalid_phone_error');
                        } else if (!$("[data-var=accept-tos]").is(":checked")) {
                            swal("Termos e Condições", "É necessário aceitar os termos de uso e a política de privacidade para utilizar a plataforma.", "warning");
                            gtag('event', 'signup_accept_tos_error');
                        } else if(!$("[data-var=signup_cpf]").val()) {
                            swal("CPF/CNPJ inválido", "Por favor, preencha corretamente o CPF/CNPJ.", "warning");
                            gtag('event', 'signup_invalid_cpfcnpj_error');
                        } else if(!$("[data-var=signup_gender]").val()) {
                            swal("Selecione um Gênero", "Por favor, preencha corretamente o gênero.", "warning");
                            gtag('event', 'signup_invalid_gender_error');
                        } else {
                            swal({
                                html: "Nós enviaremos um SMS ao seu número de telefone contendo um código para confirmar sua propriedade sobre o mesmo.<br>Por favor, verifique se o número informado está correto:<br><br><b>"+$("[data-var=signup_telephone]").val()+"</b>",
                                showCancelButton: true,
                                confirmButtonText: "Está correto",
                                cancelButtonText: "Deixe-me corrigir"
                            }).then(function() {
                                var data = {
                                    email: $("[data-var=signup_email]").val(),
                                    password: $("[data-var=signup_password]").val(),
                                    exchange: EXCHANGE,
                                    region: $("[data-var=signup_region]").val(),
                                    city: $("[data-var=signup_city]").val(),
                                    phone: $("[data-var=signup_telephone]").intlTelInput("getNumber"),
                                    fullname: $("[data-var=signup_name]").val(),
                                    cpf: $("[data-var=signup_cpf]").val(),
                                    gender: $("[data-var=signup_gender]").val()
                                };
                                $("[data-var=signin-email]").val(data.email);
                                $("[data-var=signin-password]").val(data.password);
                                socket.emit('member.signup', data);

                                gtag('event', 'signup_complete');
                            })
                        }
                        break;
                    case 'changeEmail':
                        var email_regexp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                        var new_email = $("[data-var=user_email_input]").val();
                        if (!email_regexp.test(new_email)) {
                            swal("E-mail inválido", "Por favor informe um e-mail válido.", "warning");
                        } else {
                            socket.emit('member.update', {
                                sess_key: localStorage.sess_key,
                                exchange: EXCHANGE,
                                email: new_email
                            })
                            gtag('event', 'change_email');
                        }
                        break;
                    case 'change_profile':
                        if (e.type == 'change') {
                            changeprofile_timeout = 0;
                            var data = {
                                fullname: $("[data-var=user_fullname_input]").val(),
                                phone: $("[data-var=user_telephone_input]").intlTelInput("getNumber"),
                                region: $("[data-var=user_region]").val(),
                                city: $("[data-var=user_city]").val()
                            }
                            if (!data.fullname) {
                                swal("Nome inválido", "Por favor, insira seu nome.", "warning");
                            } else if (!$("[data-var=user_telephone_input]").intlTelInput("isValidNumber")) {
                                swal("Telefone inválido", "Por favor, insira seu número de telefone corretamente.", "warning");
                                /*}
                                else if(!data.region) {
                                    swal("Região inválida", "Por favor, insira seu estado ou região.", "warning");
                                }
                                else if(!data.city) {
                                    swal("Cidade inválida", "Por favor, digite o nome de sua cidade.", "warning");*/
                            } else {
                                socket.emit('profile.editdetails', {
                                    sess_key: localStorage.getItem('sess_key'),
                                    new_data: data
                                });
                                notifyme("Informações atualizadas!", "success");
                                gtag('event', 'update_profile_details');
                                clearTimeout(changeprofile_timeout);
                                changeprofile_timeout = setTimeout(function() {
                                    socket.emit('profile.getdetails', { sess_key: localStorage.getItem('sess_key') });
                                }, 1500);
                            }
                        }
                        break;

                    case 'change_password':
                        var current_password = $("[data-var=current_pwd]").val();
                        var new_pwd = $("[data-var=new_pwd]").val();
                        var new_pwd2 = $("[data-var=new_pwd2]").val();
                        if (new_pwd.length < 5) {
                            swal("Senha inválida", "Escolha uma senha maior.", "warning");
                        } else if (new_pwd != new_pwd2) {
                            swal("Senhas não conferem", "A senha não coincide com a confirmação da senha.", "warning");
                        } else {
                            swal("Senha Atualizada", "Sua senha foi modificada com sucesso.", "success");
                            socket.emit('member.update', {
                                sess_key: localStorage.getItem('sess_key'),
                                password: current_password,
                                new_password: new_pwd
                            })
                            gtag('event', 'change_password');
                        }
                        break;

                    case 'statementPrev':
                        gtag('event', 'statement_page_' + parseInt($("[data-var=ledger_page]").text()) + 1);
                        socket.emit('ledger.list', {
                            sess_key: localStorage.sess_key,
                            page: parseInt($("[data-var=ledger_page]").text())
                        })
                        break;

                    case 'statementNext':
                        gtag('event', 'statement_page_' + parseInt($("[data-var=ledger_page]").text()) - 1);
                        socket.emit('ledger.list', {
                            sess_key: localStorage.sess_key,
                            page: parseInt($("[data-var=ledger_page]").text()) - 2
                        })
                        break;

                    case 'timelinePrev':
                        gtag('event', 'timeline_page_' + parseInt($("[data-var=timeline_page]").text()) + 1);
                        socket.emit('ledger.trades', {
                            sess_key: localStorage.sess_key,
                            page: parseInt($("[data-var=timeline_page]").text())
                        })
                        break;

                    case 'timelineNext':
                        gtag('event', 'timeline_page_' + parseInt($("[data-var=timeline_page]").text()) - 1);
                        socket.emit('ledger.trades', {
                            sess_key: localStorage.sess_key,
                            page: parseInt($("[data-var=timeline_page]").text()) - 2
                        })
                        break;

                    case 'upload_receipt':
                        gtag('event', 'upload_fiat_deposit_receipt');
                        break;

                    case 'closeactivesession':
                        $this.closest('tr').slideUp();
                        var sess2close = $this.data('sess');
                        socket.emit('sessions.closeactivesession', {
                            sess2close: sess2close,
                            sess_key: localStorage.sess_key
                        })
                        gtag('event', 'close_active_session');
                        break;

                    case 'upgrade__sendByMobile':
                        $("#upgrade__menu").fadeOut(300);
                        $("#upgrade__mobile_upload").delay(300).fadeIn(300);
                        break;

                    case 'upgrade__sendByComputer':
                        $("#upgrade__menu").fadeOut(300);
                        $("#upgrade__web_upload").delay(300).fadeIn(300);
                        break;

                    case 'upgrade__menu':
                        $("#upgrade__web_upload,#upgrade__mobile_upload").fadeOut(300);
                        $("#upgrade__menu").delay(300).fadeIn(300);
                        break;

                    case 'create_mobile_upgrade_process':
                        pageloaderOn("Enviando SMS...");
                        gtag('event', 'mobile_upgrade_process');
                        socket.emit('userdocuments.mobileprocess', {
                            cpf: $("[data-var=user_cpf]").val().replace(/[^0-9]/g, ""),
                            gender: $("[data-var=user_gender]").val(),
                            name: $("[data-var=user_fullname_input]").val(),
                            sess_key: localStorage.getItem('sess_key')
                        })
                        break;

                    case 'docselected':
                        var doc_type = $this.data('doc');
                        var filename = $this[0].files.length ? $this[0].files[0].name : '';
                        $("[data-var=doc-" + doc_type + "-filename]").text(filename);
                        gtag('event', 'document_select');
                        break;

                    case 'create_upgrade_process':
                        if (!$("[data-var=user_cpf]").val() || !$("[data-var=user_gender]").val()) {
                            return swal("CPF Necessário", "Para realizar upgrade de nível, informe seu CPF e gênero.", "error");
                        }
                        /*if($("[data-var=doc-0-type]").length && !$("[data-var=doc-0-type]").val()) {
                            return swal("Tipo de documento necessário", "Informe o tipo de documento utilizado no campo Identificação.", "error");
                        }*/
                        loadingOn();
                        setTimeout(loadingOff, 10000);
                        var docs = [];

                        var create_upgrade_process_finish = function(docs) {
                            // check if all were uploaded
                            var alluploaded = true;
                            $(".docupload").each(function() {
                                if (!$(this).data('uploaded_url')) alluploaded = false;
                            });
                            if (alluploaded) {
                                takeWebcamPicture(function(b64) {
                                    loadingOn();
                                    setTimeout(loadingOff, 5000);
                                    notifyme("Enviando sua foto...", "info");
                                    socket.emit('userdocuments.sendprocess', {
                                        sess_key: localStorage.getItem('sess_key'),
                                        b64: b64,
                                        cpf: $("[data-var=user_cpf]").val().replace(/[^0-9]/g, ""),
                                        gender: $("[data-var=user_gender]").val(),
                                        name: $("[data-var=user_fullname_input]").val(),
                                        docs: docs
                                    });
                                    //$(".file-name").html('<i class="fa fa-paperclip"></i>');
                                    gtag('event', 'documents_upload');
                                });
                            }
                        }

                        $(".docupload").each(function() {
                            var $up = $(this);
                            var type = $up.data('doc');
                            if (!type) {
                                type = $("[data-var=doc-0-type]").val()
                            }
                            var filename = $("[data-var=doc-" + type + "-filename]").text();
                            if (!$up.data('uploaded_url')) {
                                notifyme("Enviando " + filename, "info");
                                upload($up[0].files[0], function(err, url) {
                                    if (!err) {
                                        notifyme(filename + " enviado", "success");
                                        $up.data('uploaded_url', url);
                                        docs.push({
                                            'type': type,
                                            'url': CDN + url
                                        });

                                        create_upgrade_process_finish(docs);

                                    } else {
                                        loadingOff();
                                        //swal("Erro", "Erro durante o upload. Verifique sua conexão e tente novamente.", "error");
                                    }
                                });
                            } else {
                                docs.push({
                                    'type': type,
                                    'url': CDN + $up.data('uploaded_url')
                                });
                                create_upgrade_process_finish(docs);
                            }
                        });

                        break;

                    case 'disable_otp':
                        swal({
                            title: 'Desabilitar Autenticação em Dois Fatores',
                            text: 'Digite a senha de sua conta para desabilitar a autenticação em dois fatores.',
                            input: 'password',
                            showCancelButton: true,
                            confirmButtonText: 'Desabilitar OTP',
                            showLoaderOnConfirm: true,
                        }).then(function(pwd) {
                            socket.emit('member.disable_otp', {
                                sess_key: localStorage.sess_key,
                                password: pwd
                            });
                            gtag('event', 'disable_otp');
                        });
                        break;

                    case 'enable_otp':
                        var secret = randomString(20);
                        var uri = "otpauth://totp/" + encodeURIComponent('BRECoins' + ":" + window.common.udata.email) + "?secret=" + base32.encode(secret) + "&issuer=BRE+Coins";
                        swal({
                            title: 'Ativar 2FA',
                            text: 'Digite a senha de sua conta para habilitar a autenticação em dois fatores.',
                            input: 'password',
                            showCancelButton: true,
                            confirmButtonText: 'Prosseguir',
                            showLoaderOnConfirm: true,
                            allowOutsideClick: true
                        }).then(function(password) {
                            swal({
                                title: 'Ativar 2FA',
                                html: 'Escaneie o QR Code com o Authy ou o Google Authenticator e insira o código gerado no campo abaixo.\
                                    <br><img src="https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=' + encodeURIComponent(uri) + '" />',
                                input: 'text',
                                showCancelButton: true,
                                confirmButtonText: 'Checar',
                                showLoaderOnConfirm: true,
                                allowOutsideClick: true
                            }).then(function(token) {
                                socket.emit('member.enable_otp', {
                                    secret: secret.toString(),
                                    test: token,
                                    password: password,
                                    sess_key: localStorage.getItem('sess_key')
                                });
                                gtag('event', 'enable_otp');
                            })
                        })
                        break;

                    case 'enable_facial':
                        if ($("[data-var=user_cpf]").val() && $("[data-var=user_gender]").val()) {
                            takeWebcamPicture(function(b64) {
                                loadingOn();
                                setTimeout(loadingOff, 5000);
                                socket.emit('profiledetails.enableface', {
                                    sess_key: localStorage.getItem('sess_key'),
                                    b64: b64,
                                    cpf: $("[data-var=user_cpf]").val().replace(/[^0-9]/g, ""),
                                    gender: $("[data-var=user_gender]").val(),
                                    name: $("[data-var=user_fullname_input]").val()
                                });
                                gtag('event', 'enable_facial_recognition');
                            });
                        } else {
                            swal("CPF necessário", "Para usar a autenticação biométrica, informe seu CPF e gênero na aba \"Documentação\".", "info");
                        }
                        break;

                    case 'disable_facial':
                        socket.emit('profiledetails.setProfileDetail', {
                            sess_key: localStorage.getItem('sess_key'),
                            key: 'face',
                            value: ''
                        });
                        gtag('event', 'disable_facial_recognition');
                        break;

                    case 'update_profile_details':
                        if (e.type == 'change') {
                            socket.emit('profiledetails.setProfileDetail', {
                                sess_key: localStorage.getItem('sess_key'),
                                key: 'gender',
                                value: $("[data-var=user_gender]").val()
                            });
                            if ($("[data-var=user_cpf]").val() && !$("[data-var=user_cpf]").is(":disabled")) {
                                var the_cpf = $("[data-var=user_cpf]").val();
                                swal({
                                    title: 'Confirme seu CPF/CNPJ',
                                    text: "Você digitou o CPF/CNPJ: " + $("[data-var=user_cpf]").val() + "\nNote que não será possível alterar o seu CPF/CNPJ posteriormente. Além disso, você só poderá realizar saques para contas bancárias em contas cadastradas sob o mesmo CPF/CNPJ. Também não será possível o cadastro de outra conta na BRE Coins utilizando este mesmo documento.",
                                    type: 'warning',
                                    showCancelButton: true,
                                    confirmButtonText: 'Confirmar Dados',
                                    cancelButtonText: 'Corrigir',
                                }).then(function() {
                                    socket.emit('profiledetails.setProfileDetail', {
                                        sess_key: localStorage.getItem('sess_key'),
                                        key: 'cpf',
                                        value: the_cpf.replace(/[^0-9]/g, "")
                                    });
                                    $("[data-var=user_cpf]").val(the_cpf).prop("disabled", true);
                                }, function() {
                                    $("[data-var=user_cpf]").val("");
                                })
                            } else {
                                notifyme("Informações atualizadas!", "success");
                            }
                            gtag('event', 'update_profile_details');
                        }
                        break;

                    case 'level_upgrade_toggle':
                        $("[data-do=level_upgrade_toggle]").slideToggle();
                        $("#level_upgrade_form").slideToggle();
                        gtag('event', 'view_next_level_required_documents');
                        break;

                    case 'createFiatWithdraw':
                        var amount = money_format.from.fiat($("#valorFiatSaque").val());
                        if (!amount) return;
                        if (amount < 100000) {
                            swal("Abaixo do Mínimo", "O valor mínimo para saque é de R$ 1.000,00.", "warning");
                            return;
                        }
                        socket.emit('withdrawals.withdraw_fiat', {
                            sess_key: localStorage.getItem('sess_key'),
                            bank: {
                                "Banco": $("#bancoSaque").val(),
                                "Agencia": $("#usragenciaSaque").val(),
                                "Conta": $("#usrcontaSaque").val(),
                                "CPF": $("#usrcpfSaque").val().replace(/[^0-9]/g, ""),
                                "Tipo": $("#usrtipoSaque").val()
                            },
                            amount: amount,
                            currency: window.common.fiat_currency_id
                        });
                        gtag('event', 'create_fiat_withdraw');
                        break;

                    case 'createCryptoWithdraw':
                        var amount = money_format.from.crypto($("#valorCryptoSaque").val());
                        if (!amount) return;
                        swal({
                            title: "Saque de Criptomoedas",
                            text: "Insira sua senha para confirmar.",
                            type: 'question',
                            input: 'password',
                            showCancelButton: true,
                            confirmButtonText: "Confirmar Saque",
                            cancelButtonText: "Cancelar Saque"
                        }).then(function(pwd) {
                            socket.emit('withdrawals.withdraw_crypto', {
                                sess_key: localStorage.getItem('sess_key'),
                                wallet: $("#walletSaque").val(),
                                fee: $("#feeSaque").val(),
                                amount: amount,
                                password: pwd,
                                currency: window.common.crypto_currency_id
                            });
                        });
                        gtag('event', 'create_crypto_withdraw');
                        break;

                    case 'saveAlgorithm':
                        var algodb = store.namespace('algo');
                        var algo_title = $("#algorithmName").val();
                        var algo_code = window.algoeditor.getValue();

                        if (algodb(algo_title)) {
                            swal(
                                'Nome Duplicado',
                                'Já existe um algoritmo neste navegador utilizando o mesmo nome. Por favor, insira outro nome.',
                                'error'
                            )
                        } else if (!algo_title) {
                            swal(
                                'Nome Inválido',
                                'Por favor insira um nome para seu algoritmo.',
                                'error'
                            )
                        } else if (!algo_code) {
                            swal(
                                'Código em Branco',
                                'Por favor insira o código do seu algoritmo.',
                                'error'
                            )
                        } else {
                            closeModal('add-algorithm');
                            $("#algorithmName").val("");
                            window.algoeditor.setValue('');
                            algodb(algo_title, algo_code);
                            updatealgo();
                        }
                        gtag('event', 'save_algorithm');
                        break;

                    case 'editAlgorithm':
                        var algodb = store.namespace('algo');
                        var algoname = $this.data('algo-key');
                        var algocode = algodb(algoname);
                        var sequential = 1;
                        do {
                            sequential++;
                        } while (algodb(algoname + " " + sequential));
                        $("#algorithmName").val(algoname + " " + sequential);
                        window.algoeditor.setValue(algocode);
                        showModal('add-algorithm');
                        gtag('event', 'edit_algorithm');
                        break;

                    case 'runAlgorithm':
                        gtag('event', 'run_algorithm');
                        var algodb = store.namespace('algo');
                        var algoname = $this.data('algo-key');
                        if (typeof window.workers[algoname] != 'undefined') {
                            window.workers[algoname].terminate();
                            delete window.workers[algoname];
                        } else {
                            var algocode = algodb(algoname);
                            var code = "(" + algocode + ")();";
                            /*
                                function() {
                                    
                                    // call postNumber on worker start
                                    onmessage = function(e) {
                                        switch(e.data.cmd) {
                                            case 'start':
                                                postMessage({cmd: 'console', data: 'start called'});
                                                break;
                                            case 'ticker':
                                                postMessage({cmd: 'console', data: 'ticker called'});
                                                break;
                                            case 'offerbook':
                                                postMessage({cmd: 'console', data: 'offerbook called'});
                                                break;
                                            case 'myorders':
                                                postMessage({cmd: 'console', data: 'myorders called'});
                                                break;
                                        }
                                    };
                                    
                                    // FYI: window is undefined in algo
                                    // console.log(typeof(window));
                                };
                            */
                            // Obtain a blob URL reference to our virtual worker 'file'.
                            var blob = new Blob([code]);
                            var blobURL = window.URL.createObjectURL(blob);
                            worker = new Worker(blobURL);
                            worker.onmessage = function(event) {
                                document.getElementById("result").innerHTML = event.data;
                                val = event.data;
                                if (val.cmd == 'cryptowithdraw') {
                                    socket.emit('withdrawals.withdraw_crypto', {
                                        sess_key: localStorage.getItem('sess_key'),
                                        wallet: val.data.wallet,
                                        fee: val.data.fee,
                                        amount: val.data.amount,
                                        password: val.data.pwd,
                                        currency: window.common.crypto_currency_id
                                    });
                                } else if (val.cmd == 'console') {
                                    console.log("Algotrading: ", val.data);
                                }
                            };
                            worker.addEventListener('error', function onError(e) {
                                console.error([
                                    'Algotrading ERROR: Line ', e.lineno, ' in ', e.filename, ': ', e.message
                                ].join(''));
                            }, false);
                            worker.postMessage({ cmd: 'start' });
                        }
                        updatealgo();
                        break;

                    case 'delAlgorithm':
                        var algodb = store.namespace('algo');
                        var algoname = $this.data('algo-key');
                        swal({
                            title: 'Excluir Algoritmo',
                            text: "Tem certeza que deseja excluir este algoritmo?",
                            type: 'question',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Sim, excluir',
                            cancelButtonText: 'Não, cancelar',
                            confirmButtonClass: 'btn btn-success',
                            cancelButtonClass: 'btn btn-danger',
                            buttonsStyling: false
                        }).then(function() {
                            algodb.remove(algoname);
                            updatealgo();
                            gtag('event', 'delete_algorithm');
                        }, function(dismiss) {})
                        break;

                    case 'calculator':
                        $("#calculator").toggle('drop', 'slow');
                        gtag('event', 'calculator');
                        break;

                    default:
                        alert("Not implemented yet.");
                }
            });
        });

        // upload receipt
        $("[data-var=deposits]").on('change', '.fiatdeposit_uploadreceipt', function(event) {
            loadingOn();
            var deposit_id = $(this).data('deposit-id');
            if (event.target.files.length) {
                upload(event.target.files[0], function(err, url) {
                    loadingOff();
                    if (!err) {
                        socket.emit('deposit.send_receipt', {
                            sess_key: localStorage.getItem('sess_key'),
                            file: url,
                            deposit_id: deposit_id
                        });
                        setInterval(function() {
                            socket.emit('deposit.list_fiat', { sess_key: localStorage.getItem('sess_key') });
                        }, 3000);
                    }
                });
            }
        });

        // coinmarketcap price
        (function updateCoinmarketcap() {
            $.getJSON('https://api.coinmarketcap.com/v1/ticker/bitcoin/', function(data) {
                $("[data-var=coinmarketcap]").textBlink('US' + accounting.formatMoney(data[0].price_usd, '$ '));
                setTimeout(updateCoinmarketcap, 15000);
            });
        })();

        $("#volume-slider").bootstrapSlider().on('slideStop', function() {
            gtag('event', 'advanced_trader_volume_chart');
            var range = $("#volume-slider").val().split(",");
            socket.emit('volume.calc', range);
        });

        $("#volume-slider-basic").bootstrapSlider().on('slideStop', function() {
            gtag('event', 'basic_trader_volume_chart');
            var range = $("#volume-slider-basic").val().split(",");
            socket.emit('volume.calc', range);
        });

        $("#volume-slider-modal").bootstrapSlider().on('slideStop', function() {
            gtag('event', 'full_volume_chart');
            var range = $("#volume-slider-modal").val().split(",");
            socket.emit('volume.calc', range);
        });

        // calculator
        var currentNum = '';
        var total = 0;
        var operation = '';

        function updateDisplay(disp) {
            $('#calculator p').text(disp);
        }

        function opPush(op) {
            if (op === 'percent') {
                var currentNumInt = Number(currentNum);
                currentNumInt = currentNumInt / 100;
                currentNum = currentNumInt;
                updateDisplay(currentNumInt);
            } else {
                if (op !== 'ce') {
                    var currentNumInt = Number(currentNum);
                    if (currentNumInt) {
                        switch (operation) {
                            case '':
                                total = currentNumInt;
                                break;
                            case 'divide':
                                total = total / currentNumInt;
                                break;
                            case 'times':
                                total = total * currentNumInt;
                                break;
                            case 'minus':
                                total = total - currentNumInt;
                                break;
                            case 'plus':
                                total = total + currentNumInt;
                                break;
                            case 'equals':
                                break;
                        }
                    }
                    if (op === 'ca') {
                        total = 0;
                        op = '';
                    }
                    operation = op;
                }
                updateDisplay(total);
                currentNum = '';
            }
        }

        function numPush(num) {
            currentNum += num;
            if (currentNum === '.') {
                currentNum = '0.';
            }
            updateDisplay(currentNum);
        }

        function buttonPush(btn) {
            if (btn === 'decimal') {
                numPush('.');
            } else if (isNaN(btn)) {
                opPush(btn);
            } else {
                numPush(btn);
            }
        }

        // superfluous?
        function updateTotal(op, num) {}


        $('#calculator button').click(function() {
            var btn = $(this).attr("id");
            buttonPush(btn);
        });

        $("#calculator").draggable();
        // end calculator
    });
});

window.upload = function(file, cb) {
    var form = new FormData();

    if (!file || typeof file == 'undefined') {
        swal("Nenhum Arquivo Selecionado", "Por favor, selecione um arquivo.", "warning");
        cb(true);
        return;
    }

    form.append('file', file);

    var ext = file.name.split(".");
    ext = String(ext[ext.length - 1]).toLowerCase();

    if (!ext.match(/^(pdf|jpg|jpeg|gif|bmp|png)$/)) {
        swal("Formato Inválido", "Os formatos aceitos para o upload são: PDF, JPEG, GIF, BMP e PNG.", "error");
        cb(true);
        return;
    }

    if (file.size > 25000000) {
        swal("Tamanho Inválido", "Os arquivos enviados não devem ultrapassar o limite de 25MB.", "error");
        cb(true);
        return;
    }

    $.ajax({
        url: window.BACKEND + '/upload?sess_key=' + localStorage.getItem('sess_key'),
        data: form,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function(data) {
            return cb(false, data);
        },
        error: function(exr, sender) {
            return cb(exr);
        }
    });
}

function getQueryVariable(variable, queryString) {
    queryString = queryString || window.location.search;

    var query = queryString.substr(1),
        vars = query.split('&'),
        pairs;

    for (var i = 0, j = vars.length; i < j; i++) {
        pairs = vars[i].split('=');

        if (decodeURIComponent(pairs[0]) == variable) {
            return decodeURIComponent(pairs[1]);
        }
    }
};

function inputmask(o, f) {
    if (typeof f == 'string') f = window[f];
    v_obj = o;
    v_fun = f;
    return execmask(v_obj, v_fun);
}

function execmask(v_obj, v_fun) {
    v_obj.value = v_fun(v_obj.value)
}

function mask__name(v) {
    v = v.split(" ")
    v.forEach(function(p, k) {
        p = p.toLowerCase()

        if(p.length > 3)
            p = p[0].toUpperCase() + p.substr(1)

        v[k] = p
    })
    return v.join(" ")
}

function mask__cpfCnpj(v) {

    //Remove tudo o que não é dígito
    v = v.replace(/\D/g, "")

    if (v.length <= 14) { //CPF

        //Coloca um ponto entre o terceiro e o quarto dígitos
        v = v.replace(/(\d{3})(\d)/, "$1.$2")

        //Coloca um ponto entre o terceiro e o quarto dígitos
        //de novo (para o segundo bloco de números)
        v = v.replace(/(\d{3})(\d)/, "$1.$2")

        //Coloca um hífen entre o terceiro e o quarto dígitos
        v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2")

    } else { //CNPJ

        //Coloca ponto entre o segundo e o terceiro dígitos
        v = v.replace(/^(\d{2})(\d)/, "$1.$2")

        //Coloca ponto entre o quinto e o sexto dígitos
        v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")

        //Coloca uma barra entre o oitavo e o nono dígitos
        v = v.replace(/\.(\d{3})(\d)/, ".$1/$2")

        //Coloca um hífen depois do bloco de quatro dígitos
        v = v.replace(/(\d{4})(\d)/, "$1-$2")

    }

    return v

}

function mask__money_fiat(v) {
    v = v.replace(/\D/g, "");
    v = new String(Number(v));
    var len = v.length;
    if (1 == len)
        v = v.replace(/(\d)/, "0,0$1");
    else if (2 == len)
        v = v.replace(/(\d)/, "0,$1");
    else if (len > 2) {
        v = v.replace(/(\d{2})$/, ',$1');
        v = v.split(",");
        v = v[0].replace(/\d(?=(?:\d{3})+(?:\D|$))/g, "$&.") + "," + v[1];
    }
    if (v == '0,00') v = '';
    return v;
}

function mask__money_crypto(v) {
    v = v.replace(/\D/g, "");
    v = new String(Number(v));
    var len = v.length;
    if (1 == len)
        v = v.replace(/(\d)/, "0.0000000$1");
    else if (2 == len)
        v = v.replace(/(\d)/, "0.000000$1");
    else if (3 == len)
        v = v.replace(/(\d)/, "0.00000$1");
    else if (4 == len)
        v = v.replace(/(\d)/, "0.0000$1");
    else if (5 == len)
        v = v.replace(/(\d)/, "0.000$1");
    else if (6 == len)
        v = v.replace(/(\d)/, "0.00$1");
    else if (7 == len)
        v = v.replace(/(\d)/, "0.0$1");
    else if (8 == len)
        v = v.replace(/(\d)/, "0.$1");
    else if (len > 8) {
        v = v.replace(/(\d{8})$/, '.$1');
    }
    if (v == '0.00000000') v = '';
    return v;
}



window.takeWebcamPicture = function(cb) {
    swal({
        title: 'Agora, precisamos de uma foto sua.',
        text: "Por favor, retire seus óculos, chapéu e objetos que possam ocultar parte de seu rosto.\nQuando estiver pronto, clique em \"Abrir Câmera\".",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Abrir Câmera',
        cancelButtonText: 'Cancelar'
    }).then(function() {
        showModal('webcam');

        AcessoCaptureFrame = new CaptureFrame("https://crediariohomolog.acesso.io/", '7E426BC2-652E-4BCE-B6A1-7922FA44EBC9');;

        var successCallback = function() {
            $("#webcamAction").off('click').on('click', function() {
                AcessoCaptureFrame.takeSnapshot(
                    function(base64, base64_Ir) {
                        AcessoCaptureFrame.stopCamera();
                        swal({
                            title: 'Confirmar Foto',
                            html: '<img src="' + base64 + '" style="max-height: 60vh;" />',
                            showCloseButton: true,
                            showCancelButton: true,
                            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Usar',
                            cancelButtonText: '<i class="fa fa-thumbs-down"></i> Tentar novamente'
                        }).then(function(ret) {
                            closeModal('webcam');
                            if (ret) {
                                cb(base64);
                            } else {
                                window.takeWebcamPicture(cb);
                            }
                        }).catch(function() {
                            closeModal('webcam');
                            window.takeWebcamPicture(cb);
                        })
                    }
                );
            });
        }

        var errorCallback = function(code, description) {
            closeModal('webcam');
            swal("Erro " + code, "Erro ao abrir webcam: " + description, "error");
        }

        AcessoCaptureFrame.create(successCallback, function() {
            AcessoCaptureFrame.create(successCallback, errorCallback, { enableIR: false, crop_on_capture: true, showIR: false, frameType: 'face', mirror: true, width: '320px', height: '240px' });
        }, { enableIR: false, crop_on_capture: true, showIR: true, frameType: 'face', mirror: true, width: '640px', height: '360px' });


        $("#webcamClose").off('click').on('click', function() {
            closeModal('webcam');
            try {
                AcessoCaptureFrame.stopCamera();
            } catch (e) {}
        })
    })
}

// loading animation
window.loadingOn = function() {
    $("#loading").show();
}
window.loadingOff = function() {
    $("#loading").fadeOut();
}
window.pageloaderOn = function(text) {
    $("#pageloader_title").html(text);
    $("#pageloader").addClass('is-active');
}
window.pageloaderoff = function() {
    $("#pageloader_title").html("");
    $("#pageloader").removeClass('is-active');
}

window.recaptchaLoadCaptchas = function() {
    $(".g-recaptcha").each(function() {
        $(this).data('sitekey', '6Ldgjz8UAAAAANvRAcAil8FV4S9S8BMgStr38t0d');
        var el = $(this)[0];
        grecaptcha.render(el, {
            'sitekey': '6Ldgjz8UAAAAANvRAcAil8FV4S9S8BMgStr38t0d'
        });
    });
}

// accounting
window.money_format = {
    "crypto": function(val) {
        return accounting.formatMoney(val / 1e8, '฿ ', 8, '.', ',');
    },
    "fiat": function(val) {
        return accounting.formatMoney(val / 1e2, 'R$ ', 2, '.', ',');
    },
    "from": {
        "crypto": function(amount) {
            amount = String(amount);
            if (amount.indexOf(",") == -1 && amount.indexOf(".") == -1) {
                amount = parseInt(amount.toString() + "00000000");
            } else if (amount.indexOf(",") > -1 && amount.indexOf(".") == -1) {
                amount = parseInt(parseFloat(amount.replace(",", ".")).toFixed(8).replace(".", ""));
            } else {
                amount = parseInt(parseFloat(amount.replace(",", ".")).toFixed(8).replace(".", ""));
            }
            return amount;
        },
        "fiat": function(amount) {
            amount = String(amount);
            if (amount.indexOf(",") == -1 && amount.indexOf(".") == -1) {
                amount = parseInt(parseFloat(amount.replace(/\./g, "").replace(",", ".")).toFixed(2).replace(".", ""));
            } else if (amount.indexOf(",") > -1 && amount.indexOf(".") == -1) {
                amount = parseInt(parseFloat(amount.replace(",", ".")).toFixed(2).replace(".", ""));
            } else {
                amount = parseInt(parseFloat(amount.replace(/\./g, "").replace(",", ".")).toFixed(2).replace(".", ""));
            }
            return amount;
        }
    }
}

// views
function loadView(view) {
    $("[data-view]").hide();
    $("[data-view=" + view + "]").show();
}

// modals
function showModal(modal) {
    $("[data-modal=" + modal + "]").addClass("is-active");
}

function closeModal(modal) {
    $("[data-modal=" + modal + "]").removeClass("is-active");
}

// notifications
window.closesweetalert = function() {
    $(".sweet-overlay, .sweet-alert").remove();
}
window.notifyme = function(message, template, position, duration) {
    if (typeof template == 'undefined') template = "primary";
    if (typeof position == 'undefined') position = "top-right";
    if (typeof duration == 'undefined') duration = 3000;
    if (!template.startsWith("is-")) template = 'is-' + template;
    if (!position.startsWith("is-")) position = 'is-' + position;
    var notification_id = new Date().getTime();
    var $el = $('<div id="notification-' + notification_id + '" class="notification is-floating ' + template + ' ' + position + '">\
<button class="delete" onClick="$(this).parent().fadeOut(300)"></button>\
' + message + '\
</div>');
    $("body").prepend($el);
    setTimeout(function() {
        $("#notification-" + notification_id).fadeOut(300).delay(300).remove();
    }, duration);
};

window.jsmoment = function(datetime) {
    return moment.utc(datetime).tz(moment.tz.guess()).locale('pt-br');
}

window.best = {
    "ask": function() {
        return money_format.from.fiat($("[data-var=offerbook_sell] tr:first td:last").text().substr(3));
    },
    "bid": function() {
        return money_format.from.fiat($("[data-var=offerbook_buy] tr:first td:last").text().substr(3));
    },
    "buying": function() {
        return window.best.bid();
    },
    "selling": function() {
        return window.best.ask();
    }
}

function randomString(length) {
    var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var i;
    var result = "";
    var isOpera = Object.prototype.toString.call(window.opera) == '[object Opera]';
    if (window.crypto && window.crypto.getRandomValues) {
        values = new Uint32Array(length);
        window.crypto.getRandomValues(values);
        for (i = 0; i < length; i++) {
            result += charset[values[i] % charset.length];
        }
        return result;
    } else if (isOpera) //Opera's Math.random is secure, see http://lists.w3.org/Archives/Public/public-webcrypto/2013Jan/0063.html
    {
        for (i = 0; i < length; i++) {
            result += charset[Math.floor(Math.random() * charset.length)];
        }
        return result;
    } else throw new Error("Your browser is out of date.");
}

// order types
window.updateordertypes = function() {
    var ordertypes = store.get('ordertypes' + window.common.UID);
    if (typeof ordertypes != 'object' || !ordertypes || !ordertypes.length) {
        ordertypes = new Array();
        ordertypes.push('buy_limit');
        ordertypes.push('sell_limit');
        ordertypes.push('buy_market');
        ordertypes.push('sell_market');
        ordertypes.push('buy_stop_limit');
        ordertypes.push('sell_stop_limit');
        store.set('ordertypes' + window.common.UID, ordertypes);
    }
    $(".ordertype").each(function() {
        $(this).hide();
    });

    if (ordertypes && ordertypes.length) {
        ordertypes.forEach(function(val) {
            $("#ordertype-" + val).show();
            $("#ordertypeform [value=" + val + "]").prop("checked", true);
        });
    }
}

function verifica_cpf_cnpj(valor) {

    // Garante que o valor Ã© uma string
    valor = valor.toString();

    // Remove caracteres invá¡lidos do valor
    valor = valor.replace(/[^0-9]/g, '');

    // Verifica CPF
    if (valor.length === 11) {
        return 'CPF';
    }

    // Verifica CNPJ
    else if (valor.length === 14) {
        return 'CNPJ';
    }

    // Não retorna nada
    else {
        return false;
    }

} // verifica_cpf_cnpj

/*
 calc_digitos_posicoes
 
 Multiplica dí­gitos vezes posições
 
 @param string digitos Os digitos desejados
 @param string posicoes A posição que vai iniciar a regressão
 @param string soma_digitos A soma das multiplicações entre posições e dígitos
 @return string Os dí­gitos enviados concatenados com o Algorítimo 
 */
function calc_digitos_posicoes(digitos, posicoes, soma_digitos) {

    if (typeof posicoes === 'undefined') posicoes = 10;
    if (typeof soma_digitos === 'undefined') soma_digitos = 0;

    // Garante que o valor são uma string
    digitos = digitos.toString();

    // Faz a soma dos dí­gitos com a posição
    // Ex. para 10 posições:
    //   0    2    5    4    6    2    8    8   4
    // x10   x9   x8   x7   x6   x5   x4   x3  x2
    //   0 + 18 + 40 + 28 + 36 + 10 + 32 + 24 + 8 = 196
    for (var i = 0; i < digitos.length; i++) {
        // Preenche a soma com o dígito vezes a posição
        soma_digitos = soma_digitos + (digitos[i] * posicoes);

        // Subtrai 1 da posição
        posicoes--;

        // Parte  para CNPJ
        // Ex.: 5-4-3-2-9-8-7-6-5-4-3-2
        if (posicoes < 2) {
            // Retorno a posiÃ§Ã£o para 9
            posicoes = 9;
        }
    }

    // Captura o resto da divisão entre soma_digitos dividido por 11
    // Ex.: 196 % 11 = 9
    soma_digitos = soma_digitos % 11;

    // Verifica se soma_digitos são menor que 2
    if (soma_digitos < 2) {
        // soma_digitos agora serÃ¡ zero
        soma_digitos = 0;
    } else {
        // Se for maior que 2, o resultado Ã© 11 menos soma_digitos
        // Ex.: 11 - 9 = 2
        // Nosso dÃ­gito procurado Ã© 2
        soma_digitos = 11 - soma_digitos;
    }

    // Concatena mais um dÃ­gito aos primeiro nove dÃ­gitos
    // Ex.: 025462884 + 2 = 0254628842
    var cpf = digitos + soma_digitos;

    // Retorna
    return cpf;

} // calc_digitos_posicoes

/*
 Valida CPF
 
 Valida se for CPF
 
 @param  string cpf O CPF com ou sem pontos e traÃ§o
 @return bool True para CPF correto - False para CPF incorreto
 */
function valida_cpf(valor) {

    // Garante que o valor Ã© uma string
    valor = valor.toString();

    // Remove caracteres invÃ¡lidos do valor
    valor = valor.replace(/[^0-9]/g, '');


    // Captura os 9 primeiros dÃ­gitos do CPF
    // Ex.: 02546288423 = 025462884
    var digitos = valor.substr(0, 9);

    // Faz o cÃ¡lculo dos 9 primeiros dÃ­gitos do CPF para obter o primeiro dÃ­gito
    var novo_cpf = calc_digitos_posicoes(digitos);

    // Faz o cÃ¡lculo dos 10 dÃ­gitos do CPF para obter o Ãºltimo dÃ­gito
    var novo_cpf = calc_digitos_posicoes(novo_cpf, 11);

    // Verifica se o novo CPF gerado Ã© idÃªntico ao CPF enviado
    if (novo_cpf === valor) {
        // CPF vÃ¡lido
        return true;
    } else {
        // CPF invÃ¡lido
        return false;
    }

} // valida_cpf

/*
 valida_cnpj
 
 Valida se for um CNPJ
 
 @param string cnpj
 @return bool true para CNPJ correto
 */
function valida_cnpj(valor) {

    // Garante que o valor Ã© uma string
    valor = valor.toString();

    // Remove caracteres invÃ¡lidos do valor
    valor = valor.replace(/[^0-9]/g, '');


    // O valor original
    var cnpj_original = valor;

    // Captura os primeiros 12 nÃºmeros do CNPJ
    var primeiros_numeros_cnpj = valor.substr(0, 12);

    // Faz o primeiro cÃ¡lculo
    var primeiro_calculo = calc_digitos_posicoes(primeiros_numeros_cnpj, 5);

    // O segundo cÃ¡lculo Ã© a mesma coisa do primeiro, porÃ©m, comeÃ§a na posiÃ§Ã£o 6
    var segundo_calculo = calc_digitos_posicoes(primeiro_calculo, 6);

    // Concatena o segundo dÃ­gito ao CNPJ
    var cnpj = segundo_calculo;

    // Verifica se o CNPJ gerado Ã© idÃªntico ao enviado
    if (cnpj === cnpj_original) {
        return true;
    }

    // Retorna falso por padrÃ£o
    return false;

} // valida_cnpj

/*
 valida_cpf_cnpj
 
 Valida o CPF ou CNPJ
 
 @access public
 @return bool true para vÃ¡lido, false para invÃ¡lido
 */
function valida_cpf_cnpj(valor) {

    // Verifica se Ã© CPF ou CNPJ
    var valida = verifica_cpf_cnpj(valor);

    // Garante que o valor Ã© uma string
    valor = valor.toString();

    // Remove caracteres invÃ¡lidos do valor
    valor = valor.replace(/[^0-9]/g, '');


    // Valida CPF
    if (valida === 'CPF') {
        // Retorna true para cpf vÃ¡lido
        return valida_cpf(valor);
    }

    // Valida CNPJ
    else if (valida === 'CNPJ') {
        // Retorna true para CNPJ vÃ¡lido
        return valida_cnpj(valor);
    }

    // NÃ£o retorna nada
    else {
        return false;
    }

} // valida_cpf_cnpj

window.updatealgo = function() {
    $("[data-var=algotrading] tr").remove();
    var algodb = store.namespace('algo');
    algodb.each(function(key, data) {
        $("[data-var=algotrading]").append('<tr>\
                                <td>' + key.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</td>\
                                <td>\
                                    <button data-do="runAlgorithm" data-algo-key="' + key.replace(/[\""]/g, '\\"') + '" class="button is-dark is-small">\
                                        ' + (typeof window.workers[key] == 'undefined' ? '<i class="fa fa-fw fa-play"></i> Executar</button>' : '<i class="fa fa-fw fa-stop"></i> Stop</button>') + '\
                                    <button data-do="editAlgorithm" data-algo-key="' + key.replace(/[\""]/g, '\\"') + '" class="button is-dark is-small">\
                                        <i class="fa fa-fw fa-pencil"></i> Editar\
                                    </button>\
                                    <button data-do="delAlgorithm" data-algo-key="' + key.replace(/[\""]/g, '\\"') + '" class="button is-dark is-small">\
                                        <i class="fa fa-fw fa-trash-o"></i> Excluir\
                                    </button>\
                                </td>\
                            </tr>');
    })
}
