window.VERSION = "0.1.3b1";
window.BACKEND = "https://backend.brecoins.com.br";
window.CDN = "https://cdn.brecoins.com.br/~bre/";
window.EXCHANGE = 1;
window.common = {
    crypto_currency: {
        name: "Bitcoin",
        iso: "XBT"
    },
    fiat_currency: {
        name: "Real",
        iso: "BRL"
    }
};
window.cb = {};

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

(function($) {
    $.fn.textBlink = function(new_text) {
        var el = this;
        if(el.text()!=new_text) {
            el.text(new_text).addClass('blink_me');
            setTimeout(function() {
                el.removeClass('blink_me');
            }, 1000)
        }

    }
    $.fn.htmlBlink = function(new_html) {
        var el = this;
        if(this.html()!=new_html) {
            el.html(new_html).addClass('blink_me');
            setTimeout(function() {
                el.removeClass('blink_me');
            }, 1000)
        }
    }
    $.fn.blink = function() {
        var el = this;
        this.addClass('blink_me');
        setTimeout(function() {
            el.removeClass('blink_me');
        }, 1000)
    }
})($);


$(function () {
    w3.includeHTML(function () {
        const socket = io(window.BACKEND, { path: '/ws', transports: ['websocket'] } );

        recaptchaLoadCaptchas();

        loadingOff();

        $("#splash_loading").animate({
            opacity: 0
        }, 700);

        $('.navbar-burger').click(function(){
            var target = $(this).data('target');
            $('#'+target).toggleClass('is-active');
        });

        // check if already logged in
        if(localStorage.getItem('sess_key')) {
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
            if(getQueryVariable('p')=='signup') {
                $("[data-do=linksignup]").click();
            }
            if(getQueryVariable('email')) {
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

        // views
        $("[data-goto]").click(function () {
            $("#main-menu li a.is-active").removeClass("is-active");
            if (!$(this).hasClass('dropdown-item')) {
                $(this).addClass("is-active");
            }
            loadView($(this).data('goto'));
        });


        if(store('trading_interface')=='basic') {
            loadView('basic');
            $("#sidebar-menu").addClass("is-basic");
            $(".trader-button").text("TRADER");
        }
        else {
            loadView('main');
            $(".trader-button").text("BÁSICO");
        }

        $("[data-var=version]").text(VERSION);
        $("[data-var=year]").text((new Date()).getFullYear());

        // modals
        $(".close-modal").click(function () {
            $(".modal.is-active").removeClass("is-active");
        });
        $("[data-openmodal]").click(function () {
            showModal($(this).data('openmodal'));
        });

        // tabs
        $("[data-tab][data-group]").click(function () {
            $("[data-tab][data-group=" + $(this).data('group') + "]").parent("li").removeClass("is-active");
            $(this).parent("li").addClass("is-active");
            $("[data-tabgroup=" + $(this).data('group') + "]").addClass('is-invisible').hide();
            $("[data-tabname=" + $(this).data('tab') + "]").removeClass('is-invisible').show();
        });

        // dropdown
        var dropdown = document.querySelector('.dropdown');
        dropdown.addEventListener('click', function (event) {
            //event.stopPropagation();
            dropdown.classList.toggle('is-active');
        });
        $(".dropdown").on('mouseout', function () {
            $(this).removeClass('is-active');
        });

        window.workers = {};
        updatealgo();

        // order types
        $("#ordertypeform input").on('change', function() {
            var ordertypes = store.get('ordertypes'+window.common.UID);
            if(typeof ordertypes != 'object') ordertypes = new Array();
            var thetype = $(this).attr('value');

            if(ordertypes && ordertypes.length)
                ordertypes.remove(thetype);

            if($(this).is(":checked")) {
                if(ordertypes)
                    ordertypes.push(thetype);
                else
                    ordertypes = [thetype];
            }
            store.set('ordertypes'+window.common.UID, ordertypes);
            updateordertypes();
        });

        // io callback
        socket.on('geocountrylist', function(countries) {
            $(".countrylist option:not([disabled])").remove();
            countries.forEach(function(country) {
                $(".countrylist").append('<option value="'+country.id+'" data-iso="'+country.code+'">'+country.name+'</option>');
            });
        });
        socket.on('georegionslist', function(regions) {
            $(".regionlist option:not([disabled])").remove();
            regions.forEach(function(region) {
                $(".regionlist").append('<option value="'+region.id+'">'+region.name+'</option>');
            });
        });
        socket.on('memberloginpasswordfail', function() {
            swal(
              'Senha inválida.',
              'Verifique sua senha.',
              'error'
            )
        });
        socket.on('memberloginaccountfail', function() {
            swal(
              'Conta indisponível',
              'Desculpe, sua conta foi desativada.',
              'error'
            )
        });
        socket.on('memberloginemailfail', function() {
            swal(
              'E-mail inválido',
              'Nenhum usuário encontrado com este endereço de e-mail.',
              'error'
            )
        });
        socket.on('memberloginmustverify', function() {
            swal({
              title: 'Confirmar e-mail',
              text: 'Insira o código enviado ao seu endereço de e-mail:',
              input: 'text',
              showCancelButton: false,
              confirmButtonText: 'Confirmar',
              allowOutsideClick: false
            }).then(function (code) {
              socket.emit('member.confirm', {
                token: code
              })
            })
        });
        socket.on('memberconfirmdatasuccess', function() {
            swal("OK", "E-mail confirmado!", "success");
            if(!window.common.UID) $("[data-do=signin]").click();
        });
        socket.on('memberconfirmdatafail', function() {
            swal({
              title: 'Token Inválido',
              text: 'Insira o código enviado ao seu endereço de e-mail:',
              input: 'text',
              showCancelButton: false,
              confirmButtonText: 'Confirmar',
              allowOutsideClick: false
            }).then(function (code) {
              socket.emit('member.confirm', {
                token: code
              })
            })
        });
        socket.on('memberconfirmtokenfail', function() {
            swal({
              title: 'Token Inválido',
              text: 'Insira o código enviado ao seu endereço de e-mail:',
              input: 'text',
              showCancelButton: false,
              confirmButtonText: 'Confirmar',
              allowOutsideClick: false
            }).then(function (code) {
              socket.emit('member.confirm', {
                token: code
              })
            })
        });
        socket.on('membersignup_emailfail', function() {
            swal(
                "E-mail já registrado",
                "Já existe uma conta registrada com seu endereço de e-mail. Caso tenha perdido sua senha, utilize a ferramenta \"Esqueci minha senha\".",
                "warning");
            $("#signup_2").hide("drop", {position: "right"}, 300);
            $("#signup_1").delay(301).show("drop", 300);
        });
        socket.on('membersignupsuccess', function() {
            swal({
              title: 'Confirmar e-mail',
              text: 'Para finalizar, insira o código enviado ao seu endereço de e-mail:',
              input: 'text',
              showCancelButton: false,
              confirmButtonText: 'Finalizar',
              allowOutsideClick: false
            }).then(function (code) {
              socket.emit('member.confirm', {
                token: code
              })
            })
        });
        socket.on('memberrequestotptoken', function(args) {
            var requestOtpToken = function(b64) {
                var title = args.wrong ? "Token incorreto" : "Token de Login";
                var text = args.otp ? "Insira o código gerado por seu aplicativo OTP:" : "Insira o código numérico enviado ao seu e-mail:"
                swal({
                  title: title,
                  text: text,
                  input: 'text',
                  showCancelButton: false,
                  confirmButtonText: 'Entrar',
                  allowOutsideClick: false
                }).then(function (otp_token) {
                    socket.emit('member.login', {
                        "email": $("[data-var=signin-email]").val(),
                        "password": $("[data-var=signin-password").val(),
                        "otp_token": otp_token,
                        "exchange": EXCHANGE,
                        "browser_id": "1",
                        "b64": b64
                    });
                })
            };

            // webcam?
            if(args.webcam) {
                takeWebcamPicture(requestOtpToken);
            } else {
                requestOtpToken();
            }
        })
        socket.on('recover.tokenok', function() {
            $("#recover_2").fadeOut(300);
            $("#recover_3").delay(300).fadeIn(300);
        })
        socket.on('recover.wrongtoken', function() {
            swal("Token inválido", "Um novo token será enviado ao seu e-mail. Copie-o para o campo indicado.", "error");
        });
        socket.on('recover.invaliduser', function() {
            swal("Usuário inválido", "Não foi encontrado usuário registrado com o endereço de e-mail informado.", "error");
        });
        socket.on('recover.pwdok', function() {
            swal("Senha alterada", "Sua senha foi alterada com sucesso.\nAgora você já consegue entrar com suas novas credenciais.", "success");
            $("#recoverSplash").fadeOut(300);
            $("#loginSplash").delay(300).fadeIn(300);
            $("#recover_3").delay(300).css('display', 'none');
            $("#recover_1").delay(300).css('display', 'block');
        });
        socket.on('memberloginsuccess', function(args) {
            localStorage.setItem('sess_key', args.sess_key);
            setTimeout(function() {
                var socketio_emit_loop = function() {
                    socket.emit('balance.getbalance', { sess_key: args.sess_key });
                    socket.emit('orderbook.getbook', { sess_key: args.sess_key });
                    socket.emit('ledger.list', { sess_key: args.sess_key, page: 0});
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
                }
                socketio_emit_loop();
                socketio_long_loop();
                setInterval(socketio_emit_loop, 10000);
                setInterval(socketio_long_loop, 20000);

                socket.emit('profile.getdetails', { sess_key: args.sess_key });
                socket.emit('profiledetails.getProfileDetails', { sess_key: args.sess_key });
                socket.emit('sitebankaccs.list', {exchange: EXCHANGE});
                socket.emit('deposit.list_crypto', { sess_key: args.sess_key });
                socket.emit('deposit.list_fiat', { sess_key: args.sess_key });
                socket.emit('withdrawals.list_fiat', { sess_key: args.sess_key });
                socket.emit('withdrawals.list_crypto', { sess_key: args.sess_key });
                socket.emit('level.getLevelsData', { sess_key: args.sess_key });
                socket.emit('limits.get_user_limits', { sess_key: args.sess_key });
                socket.emit('ticker.register');
                socket.emit('ticker.get');
                socket.emit('sessions.listActiveSessions', { sess_key: args.sess_key });
                var range = [1,24];
                socket.emit('volume.calc', range);

                socket.emit('common.get', {
                    exchange: EXCHANGE,
                    crypto_currency: window.common.crypto_currency.name,
                    fiat_currency: window.common.fiat_currency.name
                });
            }, 500);
            
            $("#splash").fadeOut(1000);
            setTimeout(function() {
                $("iframe").attr('src', '/chart.html?'+Math.random());
            }, 5000);
        });
        socket.on('order_emitted', function() {
            socket.emit('balance.getbalance', { sess_key: args.sess_key });
            socket.emit('orderbook.getbook', { sess_key: args.sess_key });
            socket.emit('orders.myorders', { sess_key: args.sess_key });
            socket.emit('orders.myoldorders', { sess_key: args.sess_key });
            socket.emit('orders.myspecialorders', { sess_key: args.sess_key });
            socket.emit('ticker.get');
            notifyme("Ordem enviada!", "success");
        })
        socket.on('btcwallet', function(wallet) {
            $("[data-var=userwallet]").textBlink(wallet);
            $("[data-var=userwallet_qrcode]").attr("src", "https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl="+encodeURIComponent('bitcoin:'+wallet)+"&choe=UTF-8");
        });
        socket.on('depositlist_cryptosuccess', function(data) {
            $("#depositos_crypto_tbl tr").remove();
            data.forEach(function(row) {
                $("#depositos_crypto_tbl").append('<tr>\
                        <td>'+moment(row.created_at).locale('pt-br').calendar()+'</td>\
                        <td>'+money_format.crypto(row.amount)+'</td>\
                        <td>\
                            <a class="button is-link" target="_blank" href="https://blockexplorer.com/tx/'+row.txid+'">Ver</a>\
                        </td>\
                        <td>\
                            <span class="tag is-'+(row.status=='confirmed' ? 'success' : 'warning')+'">'+(row.status=='confirmed' ? 'Confirmado' : 'Pendente')+'</span>\
                        </td>\
                    </tr>');
            });
        });
        socket.on('withdrawcrypto_wrongpwd', function() {
            swal("Erro", "Senha inválida.", "error");
        })
        socket.on('user_limits', function(limits) {
            $("[data-var=fiat_deposit_limit]").textBlink(money_format.fiat(limits.deposit));
            $("[data-var=fiat_withdraw_limit]").textBlink(money_format.fiat(limits.withdraw));
        });
        socket.on('ticker', function(tickerdata) {
            $("#ticker_last").textBlink(money_format.fiat(tickerdata.last));
            $("#ticker_high").textBlink(money_format.fiat(tickerdata.high));
            $("#ticker_low").textBlink(money_format.fiat(tickerdata.low));
            $("#ticker_vol_fiat").textBlink(money_format.fiat(tickerdata.vol_fiat));
            $("#ticker_vol_crypto").textBlink(money_format.crypto(tickerdata.vol_crypto));
        });
        socket.on('enablefaceerror', function(error) {
            swal("Verificação Biométrica", error.Description, "error");
        });
        socket.on('upgrade_process_sent', function() {
            swal("Solicitação de Confirmação de Conta", "Seus documentos foram enviados e serão analisados no menor tempo possível.", "success");
            loadingOff();
        })
        socket.on('profilegetdetailssuccess', function(data) {
            window.common.UID = data.id;
            window.common.udata = data;
            $("[data-var=user_fullname]").text(data.fullname);
            $("[data-var=user_fullname_input]").val(data.fullname);
            $("[data-var=user_name]").text(data.fullname.split(" ")[0]);
            $("[data-var=user_email_input]").val(data.email);
            $("[data-var=user_nick]").text(data.nickname);
            $("[data-var=user_level]").text(data.level);
            $("[data-var=gravatar]").attr("src", data.gravatar);
            $("[data-var=user_telephone_input]").val(data.phone);
            $("[data-var=user_city]").val(data.city);

            if(data.otp_secret) {
                $("[data-do=enable_otp]").hide();
                $("[data-do=disable_otp]").show();
            } else {
                $("[data-do=enable_otp]").show();
                $("[data-do=disable_otp]").hide();
            }

            $("[data-var=signup_country]").val(data.country_id).trigger("change");
            setTimeout(function() {
                $("[data-var=signup_region]").val(data.region);
            }, 3000);

            updateordertypes();
        });
        socket.on('profiledetails', function(data) {
            if(data.face) {
                $("[data-do=enable_facial]").hide();
                $("[data-do=disable_facial]").show();
            } else {
                $("[data-do=enable_facial]").show();
                $("[data-do=disable_facial]").hide();
            }
            if(data.gender) {
                $("[data-var=user_gender]").val(data.gender);
            }
            if(data.cpf) {
                $("[data-var=user_cpf]").val(data.cpf);
            }
        })
        socket.on('ledgerlist', function(data) {
            $("[data-var=ledger_page]").text(data.page+1);
            $("[data-var=ledger_list] tr").remove();
            data.rows.forEach(function(row) {
                if(row.curr_type=='crypto') {
                    var amount = money_format.crypto(row.amount);
                    var balance = money_format.crypto(row.amount);
                }
                else {
                    var amount = money_format.fiat(row.amount);
                    var balance = money_format.fiat(row.balance);
                }
                if(row.movement===1)
                    var color = 'success';
                else
                    var color = 'danger';
                $("[data-var=ledger_list]").append('<tr>\
                        <td>'+moment(row.created_at).locale('pt-br').format('llll')+'</td>\
                        <td>'+row.description+'</td>\
                        <td><span class="tag is-'+color+'">'+amount+'</span></td>\
                        <td><span class="tag is-success">'+balance+'</span></td>\
                    </tr>');
            });
        });
        socket.on('myorders', function(rows) {
            $("[data-var=orderlist] tr,[data-var=user_orders] tr").remove();
            rows.forEach(function(row) {
                var ordertype = row.type=='sell' ? "Venda" : "Compra";
                $("[data-var=orderlist]").append('\
                    <tr class="myorder_'+row.id+'">\
                        <td>'+moment(row.created_at).locale('pt-br').format('llll')+'</td>\
                        <td>'+ordertype+'</td>\
                        <td>\
                            <b>Quantidade:</b> '+money_format.crypto(Math.max(row.amount_fiat, row.amount_crypto))+'<br>\
                            <b>Valor por BTC:</b> '+money_format.fiat(Math.max(row.crypto_price_min, row.crypto_price_max))+'\
                        </td>\
                        <td>\
                            <div class="tags has-addons">\
                                <a class="tag is-delete" data-do="cancelOrder" data-order-id="'+row.id+'"></a>\
                            </div>\
                        </td>\
                    </tr>');

                $("[data-var=user_orders]").append('<tr class="myorder_'+row.id+'">\
                    <td>\
                        '+money_format.crypto(Math.max(row.amount_fiat, row.amount_crypto))+'\
                         • \
                        <b>'+money_format.fiat(Math.max(row.crypto_price_min, row.crypto_price_max))+'</b>\
                        <div class="is-pulled-right">\
                            <div class="control">\
                                <div class="tags has-addons">\
                                    <span class="tag is-'+(ordertype=='Venda' ? 'danger' : 'success')+'">'+ordertype+'</span>\
                                    <a class="tag is-delete" data-do="cancelOrder" data-order-id="'+row.id+'"></a>\
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
                var ordertype = row.type=='sell' ? "Venda" : "Compra";
                $("[data-var=oldorderlist]").append('\
                    <tr class="myoldorder_'+row.id+'">\
                        <td>'+moment(row.created_at).locale('pt-br').format('llll')+'</td>\
                        <td>'+ordertype+'</td>\
                        <td>\
                            <b>Quantidade:</b> '+money_format.crypto(Math.max(row.amount_fiat, row.initial_amount_crypto))+'<br>\
                            <b>Valor por BTC:</b> '+money_format.fiat(Math.max(row.crypto_price_min, row.crypto_price_max))+'\
                        </td>\
                    </tr>');
            });
        });
        socket.on('myspecialorders', function(rows) {
            $("[data-var=orderspecial] tr").remove();
            rows.forEach(function(row) {
                var ordertype = row.type=='sell' ? "Venda" : "Compra";
                $("[data-var=orderspecial]").append('\
                    <tr id="myspecialorder_'+row.id+'">\
                        <td>'+money_format.fiat(row.trigger)+'</td>\
                        <td>'+ordertype+'</td>\
                        <td>'+money_format.crypto(Math.max(row.amount_fiat, row.amount_crypto))+'</td>\
                        <td>'+money_format.fiat(Math.max(row.crypto_price_min, row.crypto_price_max))+'</td>\
                        <td>\
                            <div class="tags has-addons">\
                                <a class="tag is-delete" data-do="cancelSpecialOrder" data-order-id="'+row.id+'"></a>\
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
                var theprice,theamount;
                if(row.type=='buy') {
                    theprice = row.crypto_price_max/1e2;
                    theamount = (row.amount_fiat/row.crypto_price_max);
                } else {
                    theprice = row.crypto_price_min/1e2;
                    theamount = row.amount_crypto/1e8;
                }

                var is_acumulado = $(".acumulado").hasClass('is-dark');
                var $possible_row = $("[data-var=offerbook_"+row.type+"] tr[data-price=\""+theprice+"\"]");

                if(is_acumulado && $possible_row.length) {
                    var newamount = parseFloat($possible_row.data('amount'))+parseFloat(theamount);
                    $possible_row.data('amount', newamount);
                    $possible_row.children("td:nth-child(2)").text(money_format.crypto(newamount*1e8));
                } else {
                    var table_row = '<tr data-price="'+theprice+'" data-amount="'+theamount+'" data-do="offerclick">\
                            <td>'+row.nick+'</td>\
                            <td>'+money_format.crypto(theamount*1e8)+'</td>\
                            <td>'+money_format.fiat(theprice*1e2)+'</td>\
                        </tr>';
                    if(row.type=='buy')
                        $("[data-var=offerbook_"+row.type+"]").prepend(table_row);
                    else
                        $("[data-var=offerbook_"+row.type+"]").append(table_row);
                }
            });
        });
        socket.on('simulatemarketbuy', function(amount) {
            $("[data-var=user_funds_brl-btc]").textBlink(money_format.crypto(amount));
        });
        socket.on('simulatemarketsell', function(amount) {
            $("[data-var=user_funds_btc-brl]").textBlink(money_format.fiat(amount));
        });
        socket.on('activesessionslist', function(data) {
            $("[data-var=activesessions] tr").remove();
            data.forEach(function(as) {
                $("[data-var=activesessions]").append('<tr>\
                    <td><span aria-label="'+as.ua+'" class="hint--right">'+as.browser+'</span></td>\
                    <td>'+as.ip+'</td>\
                    <td>'+as.location+'</td>\
                    <td>'+moment(as.created_at).locale('pt-br').format('llll')+'</td>\
                    <td>'+moment(as.updated_at).locale('pt-br').calendar()+'</td>\
                    <td>'+(localStorage.sess_key!=as.key ? '<button class="button is-danger is-small" data-do="closeactivesession" data-sess="'+as.key+'">\
                        <i class="fa fa-times fa-fw"></i>\
                    </button>' : '(atual)')+'</td>\
                    </tr>');
            })
        });
        socket.on('notifications.unreadList', function(rows) {
            if(rows.length) {
                var html_n = '';
                rows.forEach(function(row) {
                    html_n += '<a class="item is-fullwidth" data-do="notification-mark-as-read" data-nid="'+row.id+'">\
                                '+row.message+'<br><sub>'+moment(row.date).locale('pt-br').calendar()+'</sub>\
                            </a>';
                });
                $("[data-var=notifications]").html(html_n);
            } else {
                $("[data-var=notifications]").html('<a class="item is-fullwidth">\
                                Sem notificações\
                            </a>');
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
                    <a href="#" class="dropdown-item" data-do="changeActiveBank" data-bank-id="'+row.id+'">\
                        '+row.bank_name+'\
                    </a>');
                $("#bankdetail").append('\
                    <div id="bankdetail-'+row.id+'" style="display: none">\
                        <h2 class="subtitle">'+row.bank_name+'</h2>\
                        <p class="container">'+row.bank_data+'</p>\
                    </div>');
                $("[data-var=sitebanknames]").append('<option value="'+row.bank_name+'">'+row.bank_name+'</option>');
            });
            $("[data-var=sitebanknames]").append('<option value="Outro">Outro</option>');
        });
        socket.on('depositdeposit_fiatsuccess', function(id) {
            socket.emit('depositdeposit_fiatsuccess', {sess_key: localStorage.getItem('sess_key')});
            $("[data-var=lastFiatDepositId]").textBlink(id);
            showModal('depositModal');
        });
        socket.on('withdrawallist_cryptosuccess', function(rows) {
            $("[data-var=saqueslist_crypto_tbl] tr").remove();
            rows.reverse();
            rows.forEach(function(row) {
                let status,color,row_html;
                switch(row.status) {
                    case 'pending':
                        status = 'Pendente';
                        row_html = "-";
                        color = 'info';
                        break;
                    case 'done':
                        status = 'Realizado';
                        color = 'success';
                        row_html = '<a class="button is-small is-info" target="_blank" href="https://blockcypher.com/btc/tx/'+row.txid+'">Ver</a>';
                        break;
                    case 'disapproved':
                        status = 'Falhou';
                        color = 'danger';
                        row_html = "-";
                        break;
                }
                $("[data-var=saqueslist_crypto_tbl]").append('\
                    <tr>\
                        <td>'+moment(row.created_at).locale('pt-br').calendar()+'</td>\
                        <td>'+money_format.crypto(row.amount)+'</td>\
                        <td>\
                            '+row_html+'\
                        </td>\
                        <td>\
                            <span class="tag is-'+color+'">'+status+'</span>\
                        </td>\
                    </tr>\
                    ');
            });
        });
        socket.on('withdrawallist_fiatsuccess', function(rows) {
            $("#saqueslist_fiat_tbl tr").remove();
            rows.reverse();
            rows.forEach(function(row) {
                let status,color,row_html;
                switch(row.status) {
                    case 'pending':
                        status = 'Pendente';
                        row_html = "-";
                        color = 'info';
                        break;
                    case 'done':
                        status = 'Realizado';
                        color = 'success';
                        row_html = '';
                        break;
                    case 'disapproved':
                        status = 'Falhou';
                        color = 'danger';
                        row_html = "-";
                        break;
                }
                $("#saqueslist_fiat_tbl").append('\
                    <tr>\
                        <td>'+moment(row.created_at).locale('pt-br').calendar()+'</td>\
                        <td>'+money_format.fiat(row.amount)+'</td>\
                        <td>\
                            '+row_html+'\
                        </td>\
                        <td>\
                            <span class="tag is-'+color+'">'+status+'</span>\
                        </td>\
                    </tr>\
                    ');
            });
        });
        socket.on('depositlist_fiatsuccess', function(rows) {
            $("#depositos_fiat_tbl tr").remove();
            rows.reverse();
            rows.forEach(function(row) {
                let status,color,row_html;
                switch(row.status) {
                    case 'pending':
                        status = 'Aguardando comprovante';
                        color = 'warning';
                        row_html = '<code>#'+row.id+'</code>\
                            <div class="file is-small">\
                                <label class="file-label">\
                                    <input class="file-input | fiatdeposit_uploadreceipt" data-deposit-id="'+row.id+'" type="file" data-do="upload_receipt">\
                                    <span class="file-cta">\
                                        <span class="file-icon">\
                                            <i class="fa fa-upload"></i>\
                                        </span>\
                                        <span class="file-label">\
                                            Enviar comprovante\
                                        </span>\
                                    </span>\
                                </label>\
                            </div>';
                        break;
                    case 'waitingapproval':
                        status = 'Em análise';
                        row_html = "";
                        color = 'info';
                        break;
                    case 'done':
                        status = 'Aprovado';
                        color = 'success';
                        row_html = "";
                        break;
                    case 'disapproved':
                        status = 'Reprovado';
                        color = 'danger';
                        row_html = "";
                        break;
                }
                $("#depositos_fiat_tbl").append('\
                    <tr>\
                        <td>'+moment(row.created_at).locale('pt-br').calendar()+'</td>\
                        <td>R$ '+money_format.fiat(row.amount)+'</td>\
                        <td>\
                            '+row_html+'\
                        </td>\
                        <td>\
                            <span class="tag is-'+color+'">'+status+'</span>\
                        </td>\
                    </tr>\
                    ');
            });
        });
        socket.on('balance_crypto', function(bal) {
            window.common.max_crypto = bal;
            $("[data-var=user_funds_crypto]").textBlink('Ƀ ' + (bal/1e8).toFixed(8));
            socket.emit('balance.simulateMarketSell', {amount_crypto: bal});
        });
        socket.on('balance_fiat', function(bal) {
            window.common.max_fiat = bal;
            $("[data-var=user_funds_fiat]").textBlink('R$ '+money_format.fiat(bal));
            socket.emit('balance.simulateMarketBuy', { amount_fiat: bal});
        });
        socket.on('memberupdatedatafail', function() {
            swal("Erro", "Senha antiga inválida.", "warning");
        });
        socket.on('memberupdatepasswordsuccess', function() {
            swal("Alterado com sucesso", "Seus dados foram alterados com sucesso.", "success");
        });
        socket.on('memberupdateemailfail', function() {
            swal("E-mail já existe", "Já existe uma conta registrada neste endereço de e-mail.", "error");
        });
        socket.on('enableotp_error', function(data) {
            if(data.err=='test') {
                swal("Erro", "Token inválido. Tente novamente.", "error");
            }
            else if(data.err=='pwd') {
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
            swal("Erro", "Senha incorreta. Tente novamente.", "error");
        });
        socket.on('insuficientfunds', function() {
            swal("Erro", "Fundos insuficientes", "Você não possui fundos suficientes para essa operação.", "error");
        });
        socket.on('toosmallamount', function() {
            swal("Erro", "Valor muito baixo", "Você não inseriu fundos suficientes para essa operação.", "error");
        });
        socket.on('withdraw_fiat_sent', function() {
            swal("Ordem enviada", "Sua ordem de saque foi enviada.", "success");
            socket.emit('deposit.list_fiat', { sess_key: args.sess_key });
        });
        socket.on('withdrawals.overlimit', function(limitdata) {
            swal("Limite diário atingido", "Seu limite diário de saque foi atingido e esta ordem não pôde ser enviada. Seu limite restante é: "+money_format.fiat(limitdata.limit-limitdata.used));
        });
        socket.on('deposit.overlimit', function(limitdata) {
            swal("Limite diário atingido", "Seu limite diário de depósito foi atingido e esta ordem não pôde ser enviada. Seu limite restante é: "+money_format.fiat(limitdata.limit-limitdata.used));
        });
        socket.on('level.getLevelsData', function(data) {
            // stars
            var stars_html = '';
            for(i = 1; i <= data.user_level; i++) {
                stars_html += '<i class="fa fa-star"></i>';
            }
            for(i = data.user_level; i < data.max_level; i++) {
                stars_html += '<i class="fa fa-star-o"></i>';
            }
            $("[data-var=user_level_stars]").html(stars_html);

            $("[data-var=user_level_name]").text(data.user_level_name);

            if(data.user_level<data.next_level) {
                $("#level_upgrade_card").show();
                $("[data-var=next_level_name]").text("Nível "+data.next_level);
                $("[data-var=next_level_description]").html("").append(data.next_level_description).html($("[data-var=next_level_description]").text());

                // form
                if(data.user_level>0) {
                    var upgrade_form = '<button class="button is-white" data-do="level_upgrade_toggle" style="display: none"><i class="fa fa-fw fa-arrow-left"></i> Voltar</button><hr/>';

                    data.required_documents.forEach(function(doc) {
                        upgrade_form += '\
                        <div class="file">\
                            <label class="file-label">\
                                <input class="file-input | docupload" data-do="docselected" data-doc="'+doc.doccode+'" type="file" />\
                                <span class="file-cta">\
                                    <span class="file-icon">\
                                        <i class="fa fa-upload"></i>\
                                    </span>\
                                    <span class="file-label">\
                                        '+(doc.doccode ? doc.docname : '<select data-var="doc-0-type"><option value="2">RG</option><option value="4">CNH</option><option value="12">Passaporte</option></select>')+'\
                                    </span>\
                                </span>\
                                <span class="file-name" data-var="doc-'+doc.doccode+'-filename"></span>\
                            </label>\
                        </div><br>';
                    });

                    upgrade_form += '<br><button class="button is-primary" data-do="create_upgrade_process">Enviar documentos</button>';

                    $("#level_upgrade_form").html(upgrade_form);
                } else {
                    $("#level_upgrade_btn").hide();
                }
            } else {
                $("#level_upgrade_card").hide();
            }
        });
        socket.on('volumechart', function(data) {
            $("[data-var=volumechart] tr").remove();
            $("[data-var=volumelow]").textBlink(money_format.fiat(data.low));
            $("[data-var=volumehigh]").textBlink(money_format.fiat(data.high));
            $("[data-var=volumeavg]").textBlink(money_format.fiat((data.low+data.high)/2));
            $("[data-var=volincrease").textBlink(money_format.fiat(data.high-data.low)+" "+((100*data.high)/data.low).toFixed(1)+"%");
            var j = Object.keys(data.periods).length;
            for(i = 1; i <= j; i++) {
                var x = parseInt((data.periods['p'+i].volume*100)/data.total_volume);
                var y = 100-x;
                $("[data-var=volumechart]").append('\
                    <tr class="hint--'+(i>=(j/2) ? 'top' : 'bottom')+' hint--medium" aria-label=\"'+money_format.crypto(data.periods['p'+i].volume)+' '+money_format.fiat(data.periods['p'+i].price_min)+' '+money_format.fiat(data.periods['p'+i].price_max)+' '+(x.toFixed(1))+'%\" style="background: linear-gradient(to right, #fff 0%, #fff '+Math.max(1, Math.abs((y/2)-1))+'%, #09a589 '+(y/2)+'%, #09a589 '+Math.min(98, (x+(y/2)))+'%, #fff '+Math.min(99, (x+(y/2)))+'%, #fff 100%);">\
                        <td>&nbsp;</td>\
                    </tr>\
                    ');
            }
        });

        $(".addallbtc").click(function() {
            $("#"+$(this).data('target')).val($("[data-var=user_funds_crypto]").text().substr(2));
        });
        /*$(".addallbrl").click(function() {
            $("#"+$(this).data('target')).val($("[data-var=user_funds_fiat]").text());
        });*/

        // preview amount
        $("#limitbuy_maxprice_basic,#limitbuy_amount_basic").on('keyup', function() {
            $("#limitbuy_basic_preview").textBlink((money_format.fiat(money_format.from.fiat(($("#limitbuy_maxprice_basic").val()))*(money_format.from.crypto($("#limitbuy_amount_basic").val())/1e8))));
        });
        $("#limitsell_minprice_basic,#limitsell_amount_basic").on('keyup', function() {
            $("#limitsell_basic_preview").textBlink(money_format.fiat(money_format.from.fiat($("#limitsell_minprice_basic").val())*money_format.from.crypto($("#limitsell_amount_basic").val())/1e8));
        });
        $("#basic_orders_buy_amount,#basic_orders_buy_price").on('keyup', function() {
            $("#basic_order_buy_preview").textBlink(money_format.fiat(money_format.from.fiat($("#basic_orders_buy_price").val())*money_format.from.crypto($("#basic_orders_buy_amount").val())/1e8));
        });
        $("#basic_orders_sell_amount,#basic_orders_sell_price").on('keyup', function() {
            $("#basic_order_sell_preview").textBlink(money_format.fiat(money_format.from.fiat($("#basic_orders_sell_price").val())*money_format.from.crypto($("#basic_orders_sell_amount").val())/1e8));
        });
        $("#limitbuy_maxprice,#limitbuy_amount").on('keyup', function() {
            var preview = money_format.from.fiat($("#limitbuy_maxprice").val())*(money_format.from.crypto($("#limitbuy_amount").val())/1e8);
            if(preview)
                $("#limitbuy_preview").textBlink(money_format.fiat(preview)).parent("p.orderform_preview").slideDown();
            else
                $("#limitbuy_preview").parent("p.orderform_preview").slideUp();
        });
        $("#limitsell_minprice,#limitsell_amount").on('keyup', function() {
            var preview = money_format.from.fiat($("#limitsell_minprice").val())*(money_format.from.crypto($("#limitsell_amount").val())/1e8);
            if(preview)
                $("#limitsell_preview").textBlink(money_format.fiat(preview)).parent("p.orderform_preview").slideDown();
            else
                $("#limitsell_preview").parent("p.orderform_preview").slideUp();
        });
        $("#marketbuy_maxprice,#marketbuy_amount").on('keyup', function() {
            var preview = money_format.from.fiat($("#marketbuy_maxprice").val())*(money_format.from.crypto($("#marketbuy_amount").val())/1e8);
            if(preview)
                $("#marketbuy_preview").textBlink(money_format.fiat(preview)).parent("p.orderform_preview").slideDown();
            else
                $("#marketbuy_preview").parent("p.orderform_preview").slideUp();
        });
        $("#marketsell_minprice,#marketsell_amount").on('keyup', function() {
            var preview = money_format.from.fiat($("#marketsell_minprice").val())*(money_format.from.crypto($("#marketsell_amount").val())/1e8);
            if(preview)
                $("#marketsell_preview").textBlink(money_format.fiat(preview)).parent("p.orderform_preview").slideDown();
            else
                $("#marketsell_preview").parent("p.orderform_preview").slideUp();
        });


        // command center
        $(document).on("submit", "[data-alias]", function(e) {
            e.preventDefault();
            var target = $(this).data('alias');
            $("[data-do="+target+"]").click();
        })
        $(document).on("click change", "[data-do]", function() {
            $this = $(this);
            let action_do_list = $(this).data('do').split(" ");
            action_do_list.forEach(function(action_do) {
                switch (action_do) {
                    case 'linklogin':
                        $(".splashwnd").fadeOut(300);
                        $("#loginSplash").delay(300).fadeIn(300);
                        break;

                    case 'linksignup':
                        $(".splashwnd").fadeOut(300);
                        $("#signupSplash").delay(300).fadeIn(300);
                        var user_country = navigator.language.substr(3,2).toLowerCase();
                        $("[data-var=signup_country]").val($("[data-iso="+user_country+"]").val()).trigger('change');
                        break;

                    case 'linkrecover':
                        $(".splashwnd").fadeOut(300);
                        $("#recoverSplash").delay(300).fadeIn(300);
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
                        if(newpwd==$("[data-var=recover-newpwd-2").val()) {
                            socket.emit('member.recover_checktoken', {
                                exchange: EXCHANGE,
                                email: $("[data-var=recover-email]").val(),
                                token: $("[data-var=recover-token]").val(),
                                new_password: newpwd
                            });
                        } else {
                            swal("Erro", "As duas senhas não conferem.", "warning");
                        }
                        break;

                    case 'go_home':
                        if(store('trading_interface')=='basic') {
                            loadView('basic');
                            $("#sidebar-menu").addClass("is-basic");
                        } else {
                            loadView('main');
                            $("#sidebar-menu").removeClass("is-basic");
                        }
                        break;

                    case 'togglemenu':
                        $("#sidebar-menu").toggleClass('is-colapsed');
                        break;

                    case 'toggleTrader':
                        if(store('trading_interface')=='basic') {
                            store('trading_interface', 'advanced');
                            $(".trader-button").text("BÁSICO");
                            loadView('main');
                            $("#sidebar-menu").removeClass("is-basic");
                        } else {
                            store('trading_interface', 'basic');
                            loadView('basic');
                            $("#sidebar-menu").addClass("is-basic");
                            $(".trader-button").text("TRADER");
                        }
                        break;

                    case 'go_main':
                        $("#main-menu li a.is-active").removeClass("is-active");
                        $("#main-menu [data-do=go_main]").addClass("is-active");
                        if(store('trading_interface')=='basic') {
                            $("#sidebar-menu").addClass("is-basic");
                            loadView('basic');
                        } else {
                            $("#sidebar-menu").removeClass("is-basic");
                            loadView('main');
                        }
                        break;

                    case 'notification-mark-as-read':
                        var nid = $this.data('nid');
                        $this.hide('fold');
                        socket.emit('notifications.markAsRead', { sess_key: localStorage.getItem('sess_key'), id: nid});
                        break;

                    case 'cancelOrder':
                        var order_id = $this.data('order-id');
                        $(".myorder_"+order_id).slideUp();
                        socket.emit('orders.deleteorder', {
                            sess_id: localStorage.getItem('sess_key'),
                            order_id: order_id
                        });
                        break;

                    case 'cancelSpecialOrder':
                        var order_id = $this.data('order-id');
                        $("#myspecialorder_"+order_id).slideUp();
                        socket.emit('orders.deletespecialorder', {
                            sess_id: localStorage.getItem('sess_key'),
                            order_id: order_id
                        });
                        break;

                    case 'signin':
                        socket.emit('member.login', {
                            "email": $("[data-var=signin-email]").val(),
                            "password": $("[data-var=signin-password").val(),
                            "exchange": EXCHANGE,
                            "browser_id": "1"
                        });
                        break;

                    case 'logout':
                        socket.emit('member.logout', {sess_key: localStorage.getItem('sess_key')});
                        localStorage.removeItem('sess_key');
                        $("#splash").fadeIn(1000);
                        grecaptcha.reset();
                        break;

                    case 'offerclick':
                        var type = $this.parent("tbody").data("var").substr(-3, 3);
                        var amount = $($this.children("td")[1]).text().substr(2);
                        var price = $($this.children("td")[2]).text().substr(3);
                        $(".offerbuy_price,.offerbuy_amount,.offersell_price,.offersell_amount").val("");
                        if(type=='buy') {
                            $(".offersell_price").val(price);
                            $(".offersell_amount").val(amount);
                        } else {
                            $(".offerbuy_price").val(price);
                            $(".offerbuy_amount").val(amount);
                        }
                        break;

                    case 'toggleAcumulado':
                        $(".acumulado").toggleClass("is-dark is-outlined");
                        $("[data-var=offerbook_buy],[data-var=offerbook_sell]").parent("table").toggleClass('is-acumulado');
                        socket.emit('orderbook.getbook');
                        break;

                    case "copyuserwallet":
                        (function (text) {
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
                        notifyme("Copiado!");
                        break;

                    case 'gennewwallet':
                        socket.emit('deposit.gennewwallet', {
                            sess_key: localStorage.getItem('sess_key')
                        });
                        swal("Wallet está sendo gerada", "Sua nova carteira está sendo gerada e estará disponível em alguns segundos.", "success");
                        break;

                    case 'changeActiveBank':
                        var bankid = $this.data('bank-id');
                        $("#bank_id").val(bankid);
                        $("#bankdetail div").hide();
                        $("#bankdetail-" + bankid).show();
                        break;

                    case 'createFiatDeposit':
                        var bank = $("#bank_id").val();
                        if(!bank) {
                            swal("Escolha um banco", "Selecione um banco para realizar o depósito.", 'warning');
                        } else {
                            var amount = money_format.from.fiat($("#valorDeposito").val());
                            if(amount) {
                                $("#depositModalBank").html($("#bankdetail-"+bank).html());
                                socket.emit('deposit.deposit_fiat', {
                                    sess_key: localStorage.getItem('sess_key'),
                                    bank: $("#bank_id").val(),
                                    amount: amount,
                                    currency: window.common.crypto_currency_id
                                });
                            }
                            else {
                                swal("Valor inválido", "Insira um valor válido", "warning");
                            }
                        }
                        break;

                    case 'basic_buy':
                        var amount = money_format.from.crypto($("#basic_orders_buy_amount").val());

                        var price = money_format.from.fiat($("#basic_orders_buy_price").val());

                        socket.emit('orders.buy', {
                            'crypto_amount': amount,
                            'crypto_price': price,
                            'crypto_id': window.common.crypto_currency_id,
                            'fiat_id': window.common.fiat_currency_id,
                            'sess_key': localStorage.getItem('sess_key')
                        });
                        notifyme("Enviando ordem...", "info");
                        break;

                    case 'basic_sell':
                        var amount = money_format.from.crypto($("#basic_orders_sell_amount").val());

                        var price = money_format.from.fiat($("#basic_orders_sell_price").val());

                        socket.emit('orders.sell', {
                            'crypto_amount': amount,
                            'crypto_price': price,
                            'crypto_id': window.common.crypto_currency_id,
                            'fiat_id': window.common.fiat_currency_id,
                            'sess_key': localStorage.getItem('sess_key')
                        });
                        notifyme("Enviando ordem...", "info");
                        break;

                    case 'limit_buy':
                        var amount = money_format.from.crypto($("#limitbuy_amount").val());

                        var price = money_format.from.fiat($("#limitbuy_maxprice").val());

                        socket.emit('orders.buy', {
                            'crypto_amount': amount,
                            'crypto_price': price,
                            'crypto_id': window.common.crypto_currency_id,
                            'fiat_id': window.common.fiat_currency_id,
                            'sess_key': localStorage.getItem('sess_key')
                        });
                        notifyme("Enviando ordem...", "info");
                        break;

                    case 'limit_sell':
                        var amount = money_format.from.crypto($("#limitsell_amount").val());

                        var price = money_format.from.fiat($("#limitsell_minprice").val());

                        socket.emit('orders.sell', {
                            'crypto_amount': amount,
                            'crypto_price': price,
                            'crypto_id': window.common.crypto_currency_id,
                            'fiat_id': window.common.fiat_currency_id,
                            'sess_key': localStorage.getItem('sess_key')
                        });
                        notifyme("Enviando ordem...", "info");
                        break;

                    case 'limit_buy_basic':
                        var amount = money_format.from.crypto($("#limitbuy_amount_basic").val());

                        var price = money_format.from.fiat($("#limitbuy_maxprice_basic").val());

                        socket.emit('orders.buy', {
                            'crypto_amount': amount,
                            'crypto_price': price,
                            'crypto_id': window.common.crypto_currency_id,
                            'fiat_id': window.common.fiat_currency_id,
                            'sess_key': localStorage.getItem('sess_key')
                        });
                        notifyme("Enviando ordem...", "info");
                        break;

                    case 'limit_sell_basic':
                        var amount = money_format.from.crypto($("#limitsell_amount_basic").val());

                        var price = money_format.from.fiat($("#limitsell_minprice_basic").val());

                        socket.emit('orders.sell', {
                            'crypto_amount': amount,
                            'crypto_price': price,
                            'crypto_id': window.common.crypto_currency_id,
                            'fiat_id': window.common.fiat_currency_id,
                            'sess_key': localStorage.getItem('sess_key')
                        });
                        notifyme("Enviando ordem...", "info");
                        break;

                    case 'market_buy':
                        var amount = money_format.from.crypto($("#marketbuy_amount").val());

                        var price = money_format.from.fiat($("#marketbuy_maxprice").val());
                        socket.emit('orders.buy', {
                            'crypto_amount': amount,
                            'crypto_price': price,
                            'crypto_id': window.common.crypto_currency_id,
                            'fiat_id': window.common.fiat_currency_id,
                            'sess_key': localStorage.getItem('sess_key')
                        });
                        notifyme("Enviando ordem...", "info");
                        break;

                    case 'market_sell':
                        var amount = money_format.from.crypto($("#marketsell_amount").val());

                        var price = money_format.from.fiat($("#marketsell_minprice").val());
                        socket.emit('orders.sell', {
                            'crypto_amount': amount,
                            'crypto_price': price,
                            'crypto_id': window.common.crypto_currency_id,
                            'fiat_id': window.common.fiat_currency_id,
                            'sess_key': localStorage.getItem('sess_key')
                        });
                        notifyme("Enviando ordem...", "info");
                        break;

                    case 'stoplimit_buy':
                        var amount = money_format.from.crypto($("#stoplimitbuy_amount").val());

                        var trigger = money_format.from.fiat($("#stoplimitbuy_trigger").val());
                        swal({
                          title: 'Preço máximo de compra',
                          input: 'text',
                          showCancelButton: true,
                          confirmButtonText: 'Submit',
                          showLoaderOnConfirm: true,
                          allowOutsideClick: true
                        }).then(function (price) {
                            price = money_format.from.fiat(price);
                            socket.emit('orders.stoplimit', {
                                'type': 'buy',
                                'crypto_amount': amount,
                                'crypto_price': price,
                                'trigger': trigger,
                                'crypto_id': window.common.crypto_currency_id,
                                'fiat_id': window.common.fiat_currency_id,
                                'sess_key': localStorage.getItem('sess_key')
                            });
                        })
                        notifyme("Enviando ordem...", "info");
                        break;

                    case 'stoplimit_sell':
                        var amount = money_format.from.crypto($("#stoplimitsell_amount").val());

                        var trigger = money_format.from.fiat($("#stoplimitsell_trigger").val());
                        if(trigger.indexOf(",") == -1 && trigger.indexOf(".") == -1) {
                            trigger = trigger.toString()+"00";
                        } else {
                            trigger = trigger.replace(",", "").replace(".", "");
                        }
                        swal({
                          title: 'Preço mínimo de venda',
                          input: 'text',
                          showCancelButton: true,
                          confirmButtonText: 'Submit',
                          showLoaderOnConfirm: true,
                          allowOutsideClick: true
                        }).then(function (price) {
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
                        })
                        notifyme("Enviando ordem...", "info");
                        break;

                    case 'georegions':
                        var country = $this.val();
                        socket.emit('geo.regionslist', { country: country });
                        break;

                    case 'signup_2':
                        var email_regexp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                        if(!$('[data-var=signup_name]').val()) {
                            swal(
                                'Nome inválido',
                                'Por favor informe seu nome.',
                                'warning'
                                );
                        }
                        else if(!email_regexp.test($('[data-var=signup_email]').val())) {
                            swal(
                                'E-mail inválido',
                                'Por favor informe seu e-mail corretamente.',
                                'warning'
                                );
                        }
                        else if($('[data-var=signup_password]').val().length <= 5) {
                            swal(
                                'Senha inválida',
                                'Por favor informe uma senha maior que 5 caracteres.',
                                'warning'
                                );
                        }
                        else if($('[data-var=signup_password2]').val() != $("[data-var=signup_password]").val()) {
                            swal(
                                'Senhas não conferem.',
                                'Por favor informe a mesma senha em ambos os campos.',
                                'warning'
                                );
                        } else {
                            $("#signup_1").hide('drop', 300);
                            $("#signup_2").delay(350).show('drop', {direction: 'right'}, 300);
                        }
                        break;

                    case 'chartload':
                        $("iframe").attr('src', '/chart.html?'+Math.random());
                        break;

                    case 'signup':
                        if(!$("[data-var=signup_telephone]").val()) {
                            swal("Telefone inválido", "Por favor, insira seu telefone.", "warning");
                        } else if(!$("[data-var=accept-tos]").is(":checked")) {
                            swal("Termos e Condições", "É necessário aceitar os termos de uso e a política de privacidade para utilizar a plataforma.", "warning");
                        } else {
                            var data = {
                                 email: $("[data-var=signup_email").val()
                                ,password: $("[data-var=signup_password").val()
                                ,exchange: EXCHANGE
                                ,region: $("[data-var=signup_region").val()
                                ,city: $("[data-var=signup_city]").val()
                                ,phone: $("[data-var=signup_telephone]").val()
                                ,fullname: $("[data-var=signup_name]").val()
                            };
                            $("[data-var=signin-email]").val(data.email);
                            $("[data-var=signin-password]").val(data.password);
                            socket.emit('member.signup', data);
                        }
                        break;
                    case 'changeEmail':
                        var email_regexp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                        var new_email = $("[data-var=user_email_input]").val();
                        if(!email_regexp.test(new_email)) {
                            swal("E-mail inválido", "Por favor informe um e-mail válido.", "warning");
                        } else {
                            socket.emit('member.update', {
                                sess_key: localStorage.sess_key,
                                exchange: EXCHANGE,
                                email: new_email
                            })
                        }
                        break;
                    case 'change_profile':
                        changeprofile_timeout = 0;
                        var data = {
                             fullname: $("[data-var=user_fullname_input]").val()
                            ,phone: $("[data-var=user_telephone_input]").val()
                            ,region: $("[data-var=user_region]").val()
                            ,city: $("[data-var=user_city]").val()
                        }
                        if(!data.fullname) {
                            swal("Nome inválido", "Por favor, insira seu nome.", "warning");
                        /*}
                        else if(!data.phone) {
                            swal("Telefone inválido", "Por favor, insira seu número de telefone.", "warning");
                        }
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
                            clearTimeout(changeprofile_timeout);
                            changeprofile_timeout = setTimeout(function() {
                                socket.emit('profile.getdetails', {sess_key: localStorage.getItem('sess_key')});
                            }, 1500);
                        }
                        break;
                    
                    case 'change_password':
                        var current_password = $("[data-var=current_pwd]").val();
                        var new_pwd = $("[data-var=new_pwd]").val();
                        var new_pwd2 = $("[data-var=new_pwd2]").val();
                        if(new_pwd.length < 5) {
                            swal("Senha inválida", "Escolha uma senha maior.", "warning");
                        }
                        else if(new_pwd!=new_pwd2) {
                            swal("Senhas não conferem", "A senha não coincide com a confirmação da senha.", "warning");
                        } else {
                            socket.emit('member.update', {
                                sess_key: localStorage.getItem('sess_key'),
                                password: current_password,
                                new_password: new_pwd
                            })
                        }
                        break;

                    case 'statementPrev':
                        socket.emit('ledger.list', {
                            sess_key: localStorage.sess_key,
                            page: parseInt($("[data-var=ledger_page]").text())
                        })
                        break;

                    case 'statementNext':
                        socket.emit('ledger.list', {
                            sess_key: localStorage.sess_key,
                            page: parseInt($("[data-var=ledger_page]").text())-2
                        })
                        break;

                    case 'upload_receipt':
                        // this won't do anything
                        // it's just due to a weird jQuery bug
                        // it doesn't work when this is removed
                        break;

                    case 'closeactivesession':
                        $this.closest('tr').slideUp();
                        var sess2close = $this.data('sess');
                        socket.emit('sessions.closeactivesession', {
                            sess2close: sess2close,
                            sess_key: localStorage.sess_key
                        })
                        break;

                    case 'docselected':
                        var doc_type = $this.data('doc');
                        var filename = $this[0].files.length ? $this[0].files[0].name : '';
                        $("[data-var=doc-"+doc_type+"-filename]").text(filename);
                        break;

                    case 'create_upgrade_process':
                        loadingOn();
                        var docs = [];

                        var create_upgrade_process_finish = function(docs) {
                            // check if all were uploaded
                            var alluploaded = true;
                            $(".docupload").each(function() {
                                if(!$(this).data('uploaded_url')) alluploaded = false;
                            });
                            if(alluploaded) {
                                takeWebcamPicture(function(b64) {
                                    loadingOn();
                                    setTimeout(loadingOff, 5000);
                                    notifyme("Enviando sua foto...", "info");
                                    socket.emit('userdocuments.sendprocess', {
                                        sess_key: localStorage.getItem('sess_key'),
                                        b64: b64,
                                        cpf: $("[data-var=user_cpf]").val(),
                                        gender: $("[data-var=user_gender]").val(),
                                        name: $("[data-var=user_fullname_input]").val(),
                                        docs: docs
                                    });
                                });
                            }
                        }

                        $(".docupload").each(function() {
                            var $up = $(this);
                            var type = $up.data('doc');
                            if(!type) {
                                type = $("[data-var=doc-0-type]").val()
                            }
                            var filename = $("[data-var=doc-"+type+"-filename").text();
                            if(!$up.data('uploaded_url')) {
                                notifyme("Enviando "+filename, "info");
                                upload($up[0].files[0], function(err, url) {
                                    if(!err) {
                                        notifyme(filename+" enviado", "success");
                                        $up.data('uploaded_url', url);
                                        docs.push({
                                            'type': type,
                                            'url': CDN+url
                                        });

                                        create_upgrade_process_finish(docs);

                                    } else {
                                        create_upgrade_process_finish(docs);
                                        swal("Erro", "Erro durante o upload. Verifique sua conexão e tente novamente.");
                                    }
                                });
                            } else {
                                docs.push({
                                    'type': type,
                                    'url': CDN+$up.data('uploaded_url')
                                });
                                create_upgrade_process_finish(docs);
                            }
                        });

                        break;

                    case 'disable_otp':
                        swal({
                          title: 'Digite sua senha para desabilitar o OTP',
                          input: 'password',
                          showCancelButton: true,
                          confirmButtonText: 'Desabilitar OTP',
                          showLoaderOnConfirm: true,
                        }).then(function (pwd) {
                          socket.emit('member.disable_otp', {
                            sess_key: localStorage.sess_key,
                            password: pwd
                          });
                        });
                        break;

                    case 'enable_otp':
                        var secret = randomString(20);
                        var uri = "otpauth://totp/" + encodeURIComponent('BRECoins' + ":" + window.common.udata.email) + "?secret=" + base32.encode(secret) + "&issuer=BRE+Coins";
                        swal({
                          title: 'Ativar OTP',
                          text: 'Digite sua senha para confirmar a alteração.',
                          input: 'password',
                          showCancelButton: true,
                          confirmButtonText: 'Prosseguir',
                          showLoaderOnConfirm: true,
                          allowOutsideClick: true
                        }).then(function (password) {
                            swal({
                              title: 'Ativar OTP',
                              html: 'Leia o QR Code com um aplicativo como o Authy ou Google Authenticator e insira o código gerado no campo abaixo.\
                                    <br><img src="https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl='+encodeURIComponent(uri)+'" />',
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
                            })
                        })
                        break;

                    case 'enable_facial':
                        if($("[data-var=user_cpf]").val() && $("[data-var=user_gender]").val()) {
                            takeWebcamPicture(function(b64) {
                                loadingOn();
                                setTimeout(loadingOff, 5000);
                                socket.emit('profiledetails.enableface', {
                                    sess_key: localStorage.getItem('sess_key'),
                                    b64: b64,
                                    cpf: $("[data-var=user_cpf]").val(),
                                    gender: $("[data-var=user_gender]").val(),
                                    name: $("[data-var=user_fullname_input]").val()
                                });
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
                        break;

                    case 'update_profile_details':
                        socket.emit('profiledetails.setProfileDetail', {
                            sess_key: localStorage.getItem('sess_key'),
                            key: 'gender',
                            value: $("[data-var=user_gender]").val()
                        });
                        socket.emit('profiledetails.setProfileDetail', {
                            sess_key: localStorage.getItem('sess_key'),
                            key: 'cpf',
                            value: $("[data-var=user_cpf]").val()
                        });
                        break;

                    case 'level_upgrade_toggle':
                        $("[data-do=level_upgrade_toggle]").slideToggle();
                        $("#level_upgrade_form").slideToggle();
                        break;

                    case 'createFiatWithdraw':
                        var amount = money_format.from.fiat($("#valorFiatSaque").val());
                        socket.emit('withdrawals.withdraw_fiat', {
                            sess_key: localStorage.getItem('sess_key'),
                            bank: {
                                "Banco": $("#bancoSaque").val(),
                                "Agencia": $("#usragenciaSaque").val(),
                                "Conta": $("#usrcontaSaque").val(),
                                "CPF": $("#usrcpfSaque").val(),
                                "Tipo": $("#usrtipoSaque").val()
                            },
                            amount: amount,
                            currency: window.common.fiat_currency_id
                        });
                        break;

                    case 'createCryptoWithdraw':
                        var amount = money_format.from.crypto($("#valorCryptoSaque").val());
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
                        break;

                    case 'saveAlgorithm':
                        var algodb = store.namespace('algo');
                        var algo_title = $("#algorithmName").val();
                        var algo_code = window.algoeditor.getValue();

                        if(algodb(algo_title)) {
                            swal(
                              'Nome Duplicado',
                              'Já existe um algoritmo neste navegador utilizando o mesmo nome. Por favor, insira outro nome.',
                              'error'
                            )
                        } else if(!algo_title) {
                            swal(
                              'Nome Inválido',
                              'Por favor insira um nome para seu algoritmo.',
                              'error'
                            )
                        } else if(!algo_code) {
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
                        break;

                    case 'editAlgorithm':
                        var algodb = store.namespace('algo');
                        var algoname = $this.data('algo-key');
                        var algocode = algodb(algoname);
                        var sequential = 1;
                        do {
                            sequential++;
                        } while(algodb(algoname+" "+sequential));
                        $("#algorithmName").val(algoname+" "+sequential);
                        window.algoeditor.setValue(algocode);
                        showModal('add-algorithm');
                        break;

                    case 'runAlgorithm':
                        var algodb = store.namespace('algo');
                        var algoname = $this.data('algo-key');
                        if(typeof window.workers[algoname]!='undefined') {
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
                            worker.onmessage = function (event) {
                                document.getElementById("result").innerHTML = event.data;
                                val = event.data;
                                if(val.cmd=='cryptowithdraw') {
                                    socket.emit('withdrawals.withdraw_crypto', {
                                        sess_key: localStorage.getItem('sess_key'),
                                        wallet: val.data.wallet,
                                        fee: val.data.fee,
                                        amount: val.data.amount,
                                        password: val.data.pwd,
                                        currency: window.common.crypto_currency_id
                                    });
                                }
                                else if(val.cmd=='console') {
                                    console.log("Algotrading: ",val.data);
                                }
                            };
                            worker.addEventListener('error', function onError(e) {
                                console.error([
                                  'Algotrading ERROR: Line ', e.lineno, ' in ', e.filename, ': ', e.message
                                ].join(''));
                              }, false);
                            worker.postMessage({cmd: 'start'});
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
                        }).then(function () {
                            algodb.remove(algoname);
                            updatealgo();
                        }, function (dismiss) {}
                        )
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
            if(event.target.files.length) {
                upload(event.target.files[0], function(err, url) {
                    loadingOff();
                    if(!err) {
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
            $.getJSON('https://api.coinmarketcap.com/v1/ticker/bitcoin/', function (data) {
                $("[data-var=coinmarketcap]").textBlink(accounting.formatMoney(data[0].price_usd));
                setTimeout(updateCoinmarketcap, 15000);
            });
        })();

        $("#volume-slider").slider().on('slideStop', function() {
            var range = $("#volume-slider").val().split(",");
            socket.emit('volume.calc', range);
        });

        $("#volume-slider-basic").slider().on('slideStop', function() {
            var range = $("#volume-slider-basic").val().split(",");
            socket.emit('volume.calc', range);
        });

        $("#volume-slider-modal").slider().on('slideStop', function() {
            var range = $("#volume-slider-modal").val().split(",");
            socket.emit('volume.calc', range);
        });
    });
});

window.upload = function(file, cb) {
    var form = new FormData();
    form.append('file', file);

    $.ajax({
        url: window.BACKEND+'/upload?sess_key='+localStorage.getItem('sess_key'),
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

window.getQueryVariable = function(variable, queryString){
    queryString = queryString || window.location.search;

    var query = queryString.substr(1),
        vars  = query.split('&'),
        pairs;

    for(var i = 0, j = vars.length; i < j; i++){
        pairs = vars[i].split('=');

        if(decodeURIComponent(pairs[0]) == variable){
            return decodeURIComponent(pairs[1]);
        }
    }
};

window.takeWebcamPicture = function(cb) {
    showModal('webcam');
    var AcessoCaptureFrame = new CaptureFrame("https://crediariohomolog.acesso.io/", '7E426BC2-652E-4BCE-B6A1-7922FA44EBC9');;
    AcessoCaptureFrame.create(successCallback, function(){
        AcessoCaptureFrame.create(sucessCallback, errorCallback, { enableIR: false, crop_on_capture: true, showIR: false, frameType: 'face', mirror: true, width: '320px', height: '240px' });
    }, { enableIR: false, crop_on_capture: true, showIR: true, frameType: 'face', mirror: true, width: '640px', height: '360px' });
    
    function successCallback() {
        $("#webcamAction").off('click').on('click', function() {
            AcessoCaptureFrame.takeSnapshot(
                function (base64, base64_Ir) {
                    swal({
                      title: 'Confirmar foto',
                      html:
                        '<img src="'+base64+'" style="max-height: 60vh;" />',
                      showCloseButton: true,
                      showCancelButton: true,
                      confirmButtonText:
                        '<i class="fa fa-thumbs-up"></i> Usar',
                      cancelButtonText:
                        '<i class="fa fa-thumbs-down"></i> Tentar novamente'
                    }).then(function(ret) {
                        if(ret) {
                            closeModal('webcam');
                            cb(base64);
                        } else {
                            window.takeWebcamPicture(cb);
                        }
                    })
                }
            );
        });
    }
    
    function errorCallback(code, description){
        swal("Erro "+code, "Erro ao abrir webcam: "+description);
    }


}

// loading animation
window.loadingOn = function () {
    $("#loading").show();
}
window.loadingOff = function () {
    $("#loading").fadeOut();
}

window.recaptchaLoadCaptchas = function() {
    $(".g-recaptcha").each(function() {
        $(this).data('sitekey', '6Ldgjz8UAAAAANvRAcAil8FV4S9S8BMgStr38t0d');
        var el = $(this)[0];
        grecaptcha.render(el, {
          'sitekey' : '6Ldgjz8UAAAAANvRAcAil8FV4S9S8BMgStr38t0d'
        });
    });
}

// accounting
window.money_format = {
    "crypto": function(val) {
        return accounting.formatMoney(val/1e8, 'Ƀ ', 8, '.', ',');
    },
    "fiat": function(val) {
        return accounting.formatMoney(val/1e2, 'R$ ', 2, '.', ',');
    },
    "from": {
        "crypto": function(amount) {
            amount = String(amount);
            if(amount.indexOf(",") == -1 && amount.indexOf(".") == -1) {
                amount = parseInt(amount.toString()+"00000000");
            } else if(amount.indexOf(",") > -1 && amount.indexOf(".") == -1) {
                amount = parseInt(parseFloat(amount.replace(",", ".")).toFixed(8).replace(".", ""));
            } else {
                amount = parseInt(parseFloat(amount.replace(",", ".")).toFixed(8).replace(".", ""));
            }
            return amount;
        },
        "fiat": function(amount) {
            amount = String(amount);
            if(amount.indexOf(",") == -1 && amount.indexOf(".") == -1) {
                amount = parseInt(parseFloat(amount.replace(/\./g, "").replace(",", ".")).toFixed(2).replace(".", ""));
            } else if(amount.indexOf(",") > -1 && amount.indexOf(".") == -1) {
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
window.notifyme = function (message, template, position, duration) {
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
    setTimeout(function () {
        $("#notification-" + notification_id).fadeOut(300).delay(300).remove();
    }, duration);
};

function randomString(length)
{
    var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var i;
    var result = "";
    var isOpera = Object.prototype.toString.call(window.opera) == '[object Opera]';
    if(window.crypto && window.crypto.getRandomValues)
    {
        values = new Uint32Array(length);
        window.crypto.getRandomValues(values);
        for(i=0; i<length; i++)
        {
            result += charset[values[i] % charset.length];
        }
        return result;
    }
    else if(isOpera)//Opera's Math.random is secure, see http://lists.w3.org/Archives/Public/public-webcrypto/2013Jan/0063.html
    {
        for(i=0; i<length; i++)
        {
            result += charset[Math.floor(Math.random()*charset.length)];
        }
        return result;
    }
    else throw new Error("Your browser is out of date.");
}

// order types
window.updateordertypes = function() {
    var ordertypes = store.get('ordertypes'+window.common.UID);
    if(typeof ordertypes != 'object' || !ordertypes.length) {
        ordertypes = new Array();
        ordertypes.push('buy_limit');
        ordertypes.push('sell_limit');
        ordertypes.push('buy_market');
        ordertypes.push('sell_market');
        ordertypes.push('buy_stop_limit');
        ordertypes.push('sell_stop_limit');
    }
    $(".ordertype").each(function() {
        $(this).hide();
    });

    if(ordertypes && ordertypes.length) {
        ordertypes.forEach(function(val) {
            $("#ordertype-"+val).show();
            $("#ordertypeform [value="+val+"]").prop("checked", true);
        });
    }
}

window.updatealgo = function() {
    $("[data-var=algotrading] tr").remove();
    var algodb = store.namespace('algo');
    algodb.each(function(key, data) {
        $("[data-var=algotrading]").append('<tr>\
                                <td>'+key.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</td>\
                                <td>\
                                    <button data-do="runAlgorithm" data-algo-key="'+key.replace(/[\""]/g, '\\"')+'" class="button is-primary">\
                                        '+(typeof window.workers[key]=='undefined' ? '<i class="fa fa-fw fa-play"></i> Run</button>' : '<i class="fa fa-fw fa-stop"></i> Stop</button>')+'\
                                    <button data-do="editAlgorithm" data-algo-key="'+key.replace(/[\""]/g, '\\"')+'" class="button is-warning">\
                                        <i class="fa fa-fw fa-pencil"></i>\
                                    </button>\
                                    <button data-do="delAlgorithm" data-algo-key="'+key.replace(/[\""]/g, '\\"')+'" class="button is-danger">\
                                        <i class="fa fa-fw fa-trash-o"></i>\
                                    </button>\
                                </td>\
                            </tr>');
    })
}
