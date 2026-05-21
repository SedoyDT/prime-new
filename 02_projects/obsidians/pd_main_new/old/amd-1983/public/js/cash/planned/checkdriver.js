/**
 * Класс для работы с проверкой водителей
 */
var Cash_Planned_CheckDriver = (function ()
{
    /**
     * Конструктор
     * @param {string} selector - селектор для выбора контейнера
     * @returns {checkDriver_L4.Cash_Planned_CheckDriver}
     */
    function Cash_Planned_CheckDriver(selector)
    {
        var container = $(selector);

        /**
         * Время нажатия кнопки Подтвердить
         */
        this.startTime = 0;
        /**
         * URL отправки сообщения водителю
         */
        this.sendUrl = '/cash/ajax/call-driver';
        /**
         * URL для подтверждения авторизованных номеров
         */
        this.processIfAuthorized = '/cash/ajax/process-if-authorized';
        /**
         * URL проверки кода водителя
         */
        this.checkUrl = '/cash/ajax/check-driver';
        /**
         * input ввода проверочного кода
         */
        this.inputCode = container.find('input[data-smsc="input-code"]');
        /**
         * Кнопка Подтвердить
         */
        this.buttonSend = container.find('button[data-smsc="button-send"]');
        this.buttonWaitCall = container.find('button[data-smsc="button-wait-call"]');
        /**
         * Кнопка Проверить
         */
        this.buttonCheck = container.find('button[data-smsc="button-check"]');
        /**
         * div с сообщении об удачной проверке
         */
        this.msgSuccess = container.find('div.check-success');
        /**
         * div со всеми элементами проверки
         */
        this.blockCheck = container.find('div.check');
        /**
         * div с элементами ввода и отправки кода
         */
        this.blockInputCode = container.find('div.block-input-code');
        /**
         * Время до следующей попытки в секундах
         */
        this.timeOut = this.buttonSend.data('time-out');
        /**
         * Данные для передачи
         */
        this.data = container.data();
        /**
         * Текущий статус проверки
         */
        this.currentStatus = parseInt($('#tr-car').data('check-driver'));
        /**
         * Проверки по 4 цифрам номера. div с разметкой.
         */
        this.phoneCheckWrapper = container.find('div.phone-check-wrapper');
        /**
         * Проверки по 4 цифрам номера. Кнопка "Проверить"
         * @type {JQuery}
         */
        this.phoneCheckButton = container.find('button.phone-check-button');
        /**
         * Проверки по 4 цифрам номера. Поле для ввода кода (четырех цифр)
         * @type {JQuery}
         */
        this.phoneCheckInput = container.find('input.phone-check-input');
        /**
         * Проверки по 4 цифрам номера. Счётчик отправки сообщений водителю
         * @type {number}
         */
        this.phoneCheckCounter = 0;

        this.bind();

        this.updateBlock(this._getStatus());

        // console.info('Инициализация завершена:', this, this.data);
    }

    /**
     * Вешаем события
     * @returns {undefined}
     */
    Cash_Planned_CheckDriver.prototype.bind = function ()
    {
        var _self = this;

        // кнопка Проверить
        this.buttonSend.click(function ()
        {
            // console.info('Событие: клик по кнопке "Проверить"');
            _self.phoneCheckCounter++;

            if (!parseInt(_self.data.phone)) {
                return alert('Нет номера телефона');
            }

            $(this).prop('disabled', true);

            if (_self._processIfAuthorized()) {
                $('#tr-car').data('check-driver', 1);
                _self.updateBlock(_self._getStatus());
            } else {
                _self.startTime = new Date();
                _self.blockInputCode.show();
                _self._send();
                _self._wait();
            }
        });

        this.buttonWaitCall.click(() =>
        {
            if (_self._processIfAuthorized()) {
                $('#tr-car').data('check-driver', 1);
                _self.updateBlock(_self._getStatus());
            } else {
                this.waitCall();
            }
        });

        // кнопка Подтвердить
        this.buttonCheck.click(function ()
        {
            // console.info('Событие: клик по кнопке "Подтвердить"');
            _self._check();
        });

        this.phoneCheckButton.click(() =>
        {
            this.checkByPhoneCheck();
        });

        // клик по чекбоксам
        $('input[type="checkbox"].special').click(function ()
        {
            // console.info('Событие: клик по чекбоксу -', this.name);
            // console.info('Статус: ', _self._getStatus());
            _self.updateBlock(_self._getStatus());
        });
        // console.info('События подключены');
    };

    /**
     * Начать проверку через звонок водителя на проверочный номер
     * @returns {undefined}
     */
    Cash_Planned_CheckDriver.prototype.waitCall = function ()
    {
        let timer = new (function ()
        {
            this.start = function (startTime, cb)
            {
                this.startTime = startTime;
                this.timer     = window.setInterval(() =>
                {
                    this.tick();
                    cb();
                }, 5000);

            };

            this.stop = function ()
            {
                if (this.timer) {
                    window.clearInterval(this.timer);
                }
            }

            this.tick = function ()
            {
                let d = Math.max(15 * 60 - Math.round(((new Date()) - this.startTime) / 1000), 0);

                let m = String(Math.floor(d / 60));
                let s = String(d % 60);

                if (m.length < 2) {
                    m = `0${m}`;
                }

                if (s.length < 2) {
                    s = `0${s}`;
                }

                this.text = `${m}:${s}`;

                if (!d) {
                    this.stop();
                }
            };
        });

        const template = `
        <section>
            <form>
                <header>
                    <h1>Номер для проверки</h1>
                </header>
    
                <article class="text-align_center">
                    <div class="js-phone" style="font-size: 200%"></div>
                    <div class="js-timer">15:00</div>
                </article>
    
                <footer>
                    <input data-form-button="hide" class="amd-btn amd-btn_primary" value="закрыть" type="button">
                </footer>
            </form>
        </section>`;
        const form = new AjaxForm(template, {
            width            : 400,
            style            : 'normal',
            destroyOnHide    : true,
            hideOnEscape     : true,
            postBuildCallback: (form) =>
            {
                const dom           = form.getDomObject();
                const transactionId = this.data.transaction;
                const phone         = this.data.phone;

                form.ajax(
                    {
                        url     : '/cash/planned_driver-phone-validator/wait-call',
                        data    : {
                            phone: phone
                        },
                        type    : 'POST',
                        dataType: 'json',
                        success : (response) =>
                        {
                            if (!response.success) {
                                form.hide();
                                return;
                            }
                            dom.find('.js-phone').text(response.request.phone.replace(/^(\d)(\d{3})(\d{3})(\d{2})(\d{2})/, '$1($2)$3-$4-$5'));
                            const createdAt = new Date(response.request.createdAt.date);
                            let checkTime   = true;

                            timer.start(createdAt, () =>
                            {
                                if (checkTime) {
                                    checkTime = false;
                                    $.ajax({
                                        url     : '/cash/planned_driver-phone-validator/check-status-wait-call',
                                        data    : {
                                            requestId    : response.request.id,
                                            transactionId: transactionId,
                                        },
                                        dataType: 'json',
                                        type    : 'POST',
                                        success : (data) =>
                                        {
                                            if (data.success) {
                                                $('#tr-car').data('check-driver', 1);
                                                this.updateBlock(this._getStatus());
                                                form.hide();
                                            } else {
                                                if (data.status == -1) {
                                                    alert('Не удалось подтвердить номер телефона.');
                                                    form.hide();
                                                }
                                            }
                                        },
                                        complete: () => checkTime = true,
                                        error   : () =>
                                        {
                                            alert('Непредвиденная ошибка');
                                            timer.stop();
                                            form.hide();
                                        }
                                    });
                                }

                                dom.find('.js-timer').text(timer.text);
                            });
                        },
                    },
                    {
                        fail: () => form.hide(),
                    }
                );
            }
        });

        form.setHideCallback(() => timer.stop());

        form.show();
    };

    /**
     * Ожидание до следующей попытки
     * @returns {undefined}
     */
    Cash_Planned_CheckDriver.prototype._wait = function ()
    {
        var _self = this;
        var diff  = (new Date() - this.startTime) / 1000;

        if (diff > this.timeOut) {
            this.buttonSend.html('<i class="fa-solid fa-phone-arrow-down-left"></i>');
            this.buttonSend.prop('disabled', false);

            // Кнопка "Проверить подлинность" была нажата 3 раза (при активации кнопки показать поле для номера)
            if (_self.phoneCheckCounter === 3) {
                _self.phoneCheckWrapper.show();
            }
        } else {
            this.buttonSend.text('Повтор через ' + Math.round(this.timeOut - diff) + '...');
            window.setTimeout(function ()
            {
                _self._wait();
            }, 272);
        }
    };

    /**
     * Отправить код водителю
     * @returns {undefined}
     */
    Cash_Planned_CheckDriver.prototype._send = function ()
    {
        $.ajax({
            url     : this.sendUrl,
            data    : this.data,
            dataType: 'json',
            success : function (data)
            {
                alert(data.msg);
                if (!data.success) {
                    this.startTime = 0;
                }
            }
        });
    };


    Cash_Planned_CheckDriver.prototype._processIfAuthorized = function ()
    {
        let isProcessed = false;

        $.ajax({
            url     : this.processIfAuthorized,
            data    : this.data,
            dataType: 'json',
            async   : false,
            success : function (response)
            {
                if (response.success) {
                    isProcessed = response.isProcessed;
                } else {
                    alert("Ошибка: " + response.error);
                }
            }
        });

        return isProcessed;
    };


    /**
     * Проверить код
     * @returns {undefined}
     */
    Cash_Planned_CheckDriver.prototype._check = function (customCode)
    {
        let _self = this;
        let code  = customCode ? customCode : this.inputCode.val();

        if (!code.length) {
            return alert('Введите проверочный код');
        }

        $.ajax({
            url     : this.checkUrl,
            data    : {transaction: this.data.transaction, code: code},
            dataType: 'json',
            success : function (data)
            {
                if (!data.success) {
                    alert('Код не прошёл проверку');
                } else {
                    $('#tr-car').data('check-driver', 1);
                    _self.updateBlock(_self._getStatus());
                }
            }
        });
    };


    /**
     * Проверить код
     * @returns {undefined}
     */
    Cash_Planned_CheckDriver.prototype.checkByPhoneCheck = function ()
    {
        let code = this.phoneCheckInput.val().trim();

        if (code.length !== 4) {
            return alert('Проверочный код должен содержать 4 цифры');
        }

        if (!/^\d+$/.test(code)) {
            return alert('Код должен содержать только цифры');
        }

        $.ajax({
            url     : '/cash/ajax/phone-check-driver',
            dataType: 'json',
            data    : {
                transactionId: this.data.transaction,
                code         : code
            },
            success : (response) =>
            {
                if (response.success !== true) {
                    alert(response.error);
                } else {
                    this._check(response.code);
                }
            }
        });
    };


    /**
     * Обновить блок проверки водителя
     * @param {int} status
     * @returns {undefined}
     */
    Cash_Planned_CheckDriver.prototype.updateBlock = function (status)
    {
        // console.info('Обновление блока проверки:' + status);
        status = parseInt(status);
        if (status) {
            this.msgSuccess.attr('class', 'check-success status-' + status);
            this.msgSuccess.show();
            if (status === 3 && !this.currentStatus) {
                this.blockCheck.find('#check-driver-phone').hide();
                this.blockCheck.show();
            } else {
                this.blockCheck.hide();
            }
        } else {
            this.msgSuccess.hide();
            this.blockCheck.find('#check-driver-phone').show();
            this.blockCheck.show();
        }
    };
    /**
     * Возможно ли сохранить
     * @returns {Boolean}
     */
    Cash_Planned_CheckDriver.prototype.info = function ()
    {
        // console.info('Проверка перед сохранением');
        return this._getStatus() > 0 ? true : 'Необходимо проверить подлинность водителя';
    };
    /**
     * Получить статус
     * @returns {Boolean}
     */
    Cash_Planned_CheckDriver.prototype._getStatus = function ()
    {
        // console.info('Получить статус');
        var status = parseInt($('#tr-car').data('check-driver')); // статус проверки

        if (status === 1) {
            return status;
        }

        // наша компания, образцы, деньги уже есть
        if ($('#ourCompany').is(':checked') || $('#samples').is(':checked') || $('#alreadyPaid').is(':checked') || $('#exchange').is(':checked')) {
            status = 2;
        }  // или если подгружены оригиналы документов
        else if ($('tr[data-type2=1]:first').length || $('tr[data-type2=3]:first').length || $('input.type2[type="checkbox"][value="1"]:checked').length) {
            status = 3
        }
        return status;
    };

    return Cash_Planned_CheckDriver;
})();

$(document).ready(function ()
{
    CashPlannedObject._modules.checkDriver = new Cash_Planned_CheckDriver('#check-driver');
    //console.log(checkDriver);
});
