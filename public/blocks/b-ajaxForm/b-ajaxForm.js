(function ($) {
    $.widget("role.b-ajaxForm", {
        _create: function () {
            this.element.roles();
            this.element.submit(this._proxy(function (e) {
                e.preventDefault();
                this._submit();
            }));

            this.$successMessage = this._elem("successMessage");
            this.$errorMessage = this._elem("errorMessage");
            this.element.find('input').on('input propertychange', this._proxy(function (e) {
                this._hideError($(e.currentTarget));
            }));

            this._hideErrors();
        },
        _submit: function () {
            var el = this.element;
            this._trigger(":ready");

            this._delMod("success");
            this._delMod("error");
            this._delMod(this.$successMessage, 'show');
            this._hideErrors();
            this.disableSubmit();

            $.ajax(el.attr("action"), {
                data: el.serialize(),
                type: el.attr("method"),
                dataType: "json",
                success: this._proxy(function (resp) {

                    this.enableSubmit();
                    switch (resp.status) {
                        case "error":
                            this._setMod("error");
                            this._showErrors(resp.message);
                            this._trigger(":error", {}, resp.message);
                            break;
                        case "ok":
                            this._setMod("success");
                            if ("string" == $.type(resp.data)) {
                                this.$successMessage.text(resp.data);
                                this._setMod(this.$successMessage, 'show');
                            }
                            this._trigger(":success", {}, resp.data);
                            break;
                        case "redirect":
                            this.disableSubmit();
                            document.location = resp.url;
                            break;
                        default:
                            this._errorLog("unknown ajax status, arguments: ", arguments)
                    }
                }),
                error: this._proxy(function () {
                    this.enableSubmit();
                    this._trigger(":exception")
                }),
                complete: this._proxy(function () {
                    this._trigger(":complete")
                })})
        },
        _hideErrors: function () {
            this._delMod(this.$errorMessage, 'show');
            this.element.find('input').each(this._proxy(function (n, i) {
                this._hideError($(i));
            }));
        },
        _hideError: function ($input) {
            $input.parents('.form-group').removeClass('has-error');
            if ($input.data('error')) {
                $input.tooltip('destroy');
                $input.data('error', false)
            }
        },

        _showErrors: function (errors) {
            if (typeof errors === 'string') {
                this.$errorMessage.html(errors);
                this._setMod(this.$errorMessage, 'show');
            } else {
                var err,
                    input;
                for (var key in errors) {
                    err = errors[key];
                    input = this.element.find('input[name=' + key + ']');

                    if (input.length) {
                        input.parents('.form-group').addClass('has-error');

                        input.tooltip({
                            title: err,
                            placement: 'right',
                            delay: 100,
                            trigger: 'manual'
                        });
                        input.tooltip('show');
                        input.data('error', true)
                    } else {
                        this._showErrors(err);
                    }
                }
            }
        },

        disableSubmit: function () {
            this._elem("submitButton").attr("disabled", true);
        },
        enableSubmit: function () {
            this._elem("submitButton").attr("disabled", false);
        },

        submit: function () {
            this._submit()
        },
        reset: function () {
            this._hideErrors();
            this._delMod("success");
            this._delMod("error");
            this.element.trigger('reset');
        }
    });
})(jQuery);
