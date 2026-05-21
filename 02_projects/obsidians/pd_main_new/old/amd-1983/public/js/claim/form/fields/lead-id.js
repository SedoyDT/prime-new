/**
 * поле "номер лида"
 * @type {Dimensions}
 */
var LeadId = (function () {
    function LeadId(settings)
    {
        // Параметры скрипта
        /**
         * @type {{
         *  changeBtn: jQuery, 
         *  field: jQuery, 
         *  projectSelect: jQuery, 
         *  text: jQuery, 
         *  dropBtn: jQuery, 
         *  url: jQuery,
         *  projectField: jQuery,
         *  currentProjectOnly?: boolean
         * }}
         */
        this.settings = settings;

        var self = this;
        if (this.settings.changeBtn) {
            this.settings.changeBtn.on('click', function () {
                self.showForm();
            });
        }

        if (this.settings.dropBtn) {
            this.settings.dropBtn.on('click', function () {
                self.dropLeadId();
            });
        }
    }

    /**
     * валидация поля
     * @return {boolean}
     */
    LeadId.prototype.isValid = function ()
    {
        return this.settings.field.val() > 0 || !this.settings.field.prop('required');
    };

    LeadId.prototype.showForm = function ()
    {
        var self = this;

        const eventHandler = function (event) {
            self.eventMessageHandler(event);
        };

        //параметры запроса
        const urlParams = [
            `leadProjectId=${this.settings.projectSelect.val()}`,
            `currentProjectOnly=${this.settings.hasOwnProperty('currentProjectOnly')
                ? String(+this.settings.currentProjectOnly)
                : '0'}`,
        ];

        this.form = new AjaxForm(`
            <section class="filter-forms form-transition-white ajax-forms ajax-forms-normal">
                <form method="post">                        
                    <header>
                        <h1>Выбор лида</h1>
                    </header>
                    
                    <iframe
                        src="/sales-funnel/lead/filter-form/iframe?${urlParams.join('&')}"
                        width="100%"
                        height="860"
                        style="border: none"
                    />
                    
                    <footer>
                        <input type="button" data-form-button="save" value="выбрать"/>
                        <input type="button" data-form-button="hide" value="закрыть"/>
                    </footer>
                </form>
            </section>
        `,
            {
                'width': 1050,
                'disableAjaxHandler': true,
                'hideOnEscape': false,
                'destroyOnHide': true,
                preBuildCallback: function(form, formBuilder) {
                    formBuilder.formButtonActions['save'] = self.save.bind(self);
                },
                postBuildCallback: function (form) {
                    window.addEventListener('message', eventHandler);
                },
                hideCallback: function () {
                    window.removeEventListener('message', eventHandler);
                }
            }
        );
        this.form.show();
    }

    LeadId.prototype.info = function ()
    {
        if (this.form.leadId > 0) {
            if (this.settings.field) {
                this.settings.field.val(this.form.leadId).trigger('change');
                this.settings.projectField.val(this.form.leadProjectId);
            }

            this.settings.text.hide();
            this.settings.url
                .text(this.form.leadId)
                .attr('href', this.form.leadUrl)
                .show();
            this.settings.projectSelect.val(this.form.leadProjectId);
        }

        this.form.hide();
    }

    LeadId.prototype.eventMessageHandler = function (event)
    {
        if (event.data.msg === 'lead chosed') {
            this.form.leadId = event.data.leadId;
            this.form.leadProjectId = event.data.leadProjectId;
            this.form.leadUrl = event.data.leadUrl;
        } else if (event.data.msg === 'lead confirmed') {
            this.form.leadId = event.data.leadId;
            this.form.leadProjectId = event.data.leadProjectId;
            this.form.leadUrl = event.data.leadUrl;
            this.save();
        }
    }

    LeadId.prototype.dropLeadId = function ()
    {
        if (this.settings.field) {
            this.settings.field.val(0).trigger('change');
        }

        this.settings.text.show();
        this.settings.url.hide();
    }

    return LeadId;
})();
