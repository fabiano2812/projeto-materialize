'use strict';

var MenuBar = function () {

    var set = function(key) {
        var $selectedMenu = $("." + key);

        if ($selectedMenu.length) {
            var $parentMenu = $selectedMenu.parents('.menu-item-submenu');

            var $tabPane = $parentMenu.parents('.tab-pane');

            if (!$tabPane.length) {
                $tabPane = $selectedMenu.parents('.tab-pane');
            }

            var $headerTab = $('a[data-target="#' + $tabPane.attr("id") + '"]');

            if ($selectedMenu.length) {
                $selectedMenu.addClass("menu-item-here");
            }

            if ($parentMenu.length) {
                $parentMenu.addClass("menu-item-here");
            }

            if ($tabPane.length) {
                $tabPane.addClass("show active");
            }

            if ($headerTab.length) {
                $headerTab.addClass("active");
            }
        } else {
            $('#header_tab_curso').addClass("show active");
            $('a[data-target="#header_tab_curso"]').addClass("active");
        }
    };

    return {
        set: function (key) {
            set(key);
        }
    };

}();


var ErrorHandler = function () {

    var setup = function() {
        $.ajaxSetup({
            error: function(jqXHR, exception) {
                customException(jqXHR, exception);
            }
        });
    };

    var customException = function(jqXHR, exception) {
        if (exception !== 'abort') {
            var message = "";

            if (jqXHR.status === 0) {
                message = 'Não foi possível estabelecer conexão com o servidor. Verifique sua conexão com a internet e tente novamente.';
            } else if (jqXHR.status == 404) {
                message = 'O recurso solicitado não foi encontrado.';
            } else if (jqXHR.status == 500) {
                message = 'Ocorreu um erro ao realizar esta operação, nossa equipe já foi avisada e tudo deve estar funcionando em alguns minutos. Tente novamente mais tarde.';
            } else if (exception === 'parsererror') {
                message = 'Falha ao converter o JSON de retorno.';
            } else if (exception === 'timeout') {
                message = 'Tempo limite atingido para esta requisição. Tente novamente mais tarde.';
            } else {
                if (jqXHR.responseText && jqXHR.responseText.indexOf("html") == -1) {
                    message = jqXHR.responseText;
                } else {
                    if (jqXHR.status == 400) {
                        message = 'Ocorreu um erro ao realizar esta operação, nossa equipe já foi avisada e tudo deve estar funcionando em alguns minutos. Tente novamente mais tarde.';
                    } else {
                        message = 'Ocorreu um erro desconhecido ao realizar esta operação, nossa equipe já foi avisada e tudo deve estar funcionando em alguns minutos. Tente novamente mais tarde.';
                    }
                }
            }

            // Adicionado setTimeout para exibir a mensagem corretamente em caso de erro numa operação com popup de confirmação
            setTimeout(function() {
                Alert.showError('Ooops', message);
            }, 250);
        }
    };

    return {
        setup: function () {
            setup();
        },
        customException: function (jqXHR, exception) {
            customException(jqXHR, exception);
        }
    };

}();


var Alert = function () {

    var showError = function (title, message) {
        displayNotification(title, message, 'error');
    };

    var showInformation = function (title, message) {
        displayNotification(title, message, 'info');
    };

    var showWarning = function (title, message) {
        displayNotification(title, message, 'warning');
    };

    var showSuccess = function (title, message) {
        displayNotification(title, message, 'success');
    };

    var displayNotification = function (title, message, style) {
        Swal.fire({
            title: title,
            text: message,
            icon: style
        });
    };

    return {
        showError: function (title, message) {
            showError(title, message);
        },
        showInformation: function (title, message) {
            showInformation(title, message);
        },
        showWarning: function (title, message) {
            showWarning(title, message);
        },
        showSuccess: function (title, message) {
            showSuccess(title, message);
        }
    };

}();


var Tooltip = function () {

    var refresh = function () {
        $('[data-toggle="kt-tooltip"]').each(function() {
            initTooltip($(this));
        });
    };

    var destroy = function () {
        $('[data-toggle="kt-tooltip"]').tooltip('dispose');
    };

    return {
        refresh: function () {
            refresh();
        },
        destroy: function () {
            destroy();
        }
    };

}();


var ValidationUI = function () {

    var highlight = function(element, errorClass, validClass) {
        var $element = $(element);

        if ($element.is("select")) {
            $element.next('.select2').addClass(errorClass);
        }

        if ($element.is(".ck-editor-required")) {
            $element.next('.ck-editor').addClass(errorClass);
        }

        $element.addClass(errorClass);
    };

    var unhighlight = function(element, errorClass, validClass) {
        var $element = $(element);

        if ($element.is("select")) {
            $element.next('.select2').removeClass(errorClass);
        }

        if ($element.is(".ck-editor-required")) {
            $element.next('.ck-editor').removeClass(errorClass);
        }

        $element.removeClass(errorClass);
    };

    var errorPlacement = function (error, element) {
        if (element.is(":radio") || element.is(":checkbox")) {
            element.closest('.radio-inline').after(error);
        } else if (element.is("select")) {
            element.next('.select2').after(error);
        } else if (element.parent().is('.bootstrap-touchspin') || element.parent().is('.input-group')) {
            error.insertAfter(element.parent());
        } else if (element.is(".ck-editor-required")) {
            element.next('.ck-editor').after(error);
        } else {
            error.insertAfter(element);
        }
    };

    return {
        highlight: function (element, errorClass, validClass) {
            highlight(element, errorClass, validClass);
        },
        unhighlight: function (element, errorClass, validClass) {
            unhighlight(element, errorClass, validClass);
        },
        errorPlacement: function(error, element) {
            errorPlacement(error, element);
        }
    };

}();


var Popup = function () {

    var style;
    var bodyStyle;
    var icon;
    var title;
    var buttons;
    var onBeforeOpen;
    var onBeforeClose;
    var onOpen;
    var onClose;
    var closeOnBgClick;
    var enableEscapeKey;
    var hideFooter;

    var show = function (container, data, options) {
        var defCloseButton = '';
        defCloseButton += '<span></span>'; //Forca o botao a flutuar para a direita com layout flex
        defCloseButton += '<a href="javascript:;" class="btn btn-light-dark mnw150" onclick="Popup.close()">';
        defCloseButton += '    <i class="fa fa-times"></i> Fechar';
        defCloseButton += '</a>';

        style = options.style ? options.style : '';
        bodyStyle = options.bodyStyle ? options.bodyStyle : '';
        icon = options.icon;
        title = options.title;
        closeOnBgClick = options.closeOnBgClick;
        enableEscapeKey = options.enableEscapeKey;
        onBeforeOpen = options.onBeforeOpen;
        onBeforeClose = options.onBeforeClose;
        onOpen = options.onOpen;
        onClose = options.onClose;
        hideFooter = options.hideFooter;
        buttons = options.buttons != null && options.buttons != undefined ? options.buttons : defCloseButton;

        var htmlRetorno = "";

        htmlRetorno += '<div class="card card-custom mt-5">';
        htmlRetorno += '    <div class="card-header">';
        htmlRetorno += '        <div class="card-title">';
        htmlRetorno += '            <span class="card-icon"><i class="fa ' + icon + ' text-primary"></i></span>';
        htmlRetorno += '            <h3 class="card-label">' + title + '</h3>';
        htmlRetorno += '        </div>';
        htmlRetorno += '    </div>';

        if (bodyStyle && bodyStyle.length) {
            htmlRetorno += '    <div class="card-body pb-3 ' + bodyStyle + '">';
        } else {
            htmlRetorno += '    <div class="card-body pb-3">';
        }

        htmlRetorno += data;
        htmlRetorno += '    </div>';

        if (!(hideFooter && hideFooter === true)) {
            htmlRetorno += '    <div class="card-footer d-flex justify-content-between">';
            htmlRetorno += '        ' + buttons;
            htmlRetorno += '    </div>';
        }

        htmlRetorno += '</div>';

        var $popupWindow = $(container);
        $popupWindow.html(htmlRetorno);

        if ($popupWindow.length) {
            $popupWindow.append('<button title="Fechar (Esc)" type="button" class="mfp-close" style="top: 10px;">×</button>');

            if (!$popupWindow.hasClass("mfp-with-anim")) {
                $popupWindow.addClass("mfp-with-anim");
            }

            if (!$popupWindow.hasClass("popup-basic")) {
                $popupWindow.addClass("popup-basic");
            }

            if (style.length > 0) {
                $popupWindow.addClass(style);
            }

            $.magnificPopup.open({
                removalDelay: 500,
                items: {
                    src: $popupWindow
                },
                tClose: 'Fechar (Esc)',
                closeOnBgClick: closeOnBgClick,
                enableEscapeKey: enableEscapeKey,
                callbacks: {
                    beforeOpen: function () {
                        $('body').addClass('mfp-bg-open');
                        this.st.mainClass = "mfp-flipInY";

                        if (onBeforeOpen) {
                            onBeforeOpen();
                        }
                    },
                    open: function () {
                        KTApp.initComponents();

                        if (onOpen) {
                            onOpen();
                        }
                    },
                    close: function () {
                        if (onClose) {
                            onClose();
                        }
                    },
                    afterClose: function () {
                        if (onBeforeClose) {
                            onBeforeClose();
                        }

                        $('body').removeClass('mfp-bg-open');
                        $popupWindow.removeClass(style);
                        $popupWindow.html("");
                    }
                }
            });
        }
    };

    var close = function () {
        $.magnificPopup.close();
    };

    return {
        show: function (container, data, options) {
            show(container, data, options);
        },
        close: function () {
            close();
        }
    }

}();


var UploadUtils = function () {

    var ajustarArquivoUpload = function (file, input) {
        var $file = $(file);
        var $selected = $(input);
        $selected.val($file.val().replace(/C:\\fakepath\\/i, ''));
    };

    return {
        ajustarArquivoUpload: function (file, input) {
            ajustarArquivoUpload(file, input);
        }
    }

}();


var SummernoteUtils = function () {

    var init = function (id, customHeight, customToolbar) {
        var $component = $("#" + id);

        if ($component.length) {
            var toolbar = [
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['table', ['table']],
                ['insert', ['link', 'picture', 'video']],
                ['height', ['height']],
                ['view', ['fullscreen', 'codeview']]
            ];

            if (customToolbar) {
                toolbar = customToolbar;
            }

            $component.summernote({
                minHeight: customHeight ? customHeight : 150,
                lang: 'pt-BR',
                toolbar: toolbar
            });
        }
    };

    var initSimple = function (id, customHeight) {
        var $component = $("#" + id);

        if ($component.length) {
            $component.summernote({
                minHeight: customHeight ? customHeight : 150,
                lang: 'pt-BR',
                toolbar: [
                    ['style', ['bold', 'italic', 'underline', 'clear']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['table', ['table']],
                    ['insert', ['link', 'picture', 'video']],
                    ['view', ['fullscreen', 'codeview']]
                ]
            });
        }
    };

    var initOnlyText = function (id, customHeight) {
        var $component = $("#" + id);

        if ($component.length) {
            $component.summernote({
                minHeight: customHeight ? customHeight : 150,
                lang: 'pt-BR',
                toolbar: [
                    ['style', ['bold', 'italic', 'underline', 'clear']],
                    ['view', ['fullscreen', 'codeview']]
                ]
            });
        }
    };

    var bindValue = function (id) {
        var $component = $("#" + id);

        if ($component.length) {
            var conteudoHtml = $component.summernote('code');
            $("input[name='" + id + "']").val(conteudoHtml);
        }
    };

    return {
        init: function (id, customHeight, customToolbar) {
            init(id, customHeight, customToolbar);
        },
        initSimple: function (id, customHeight) {
            initSimple(id, customHeight);
        },
        initOnlyText: function (id, customHeight) {
            initOnlyText(id, customHeight);
        },
        bindValue: function (id) {
            bindValue(id);
        }
    }

}();


var FormUtils = function () {

    var serializarForm = function (formElement, d) {
        var $searchForm = $(formElement);
        var formData = $searchForm.serializeArray();

        for (var i = 0; i < formData.length; i++) {
            d[formData[i].name] = formData[i].value;
        }

        // Preparação dos selects multiplos para envio
        // O metodo serializeArray nao recupera selects multiplos sem este trecho de codigo
        $("select[multiple]", $searchForm).each(
            function () {
                var $select = $('#' + this.id);

                if ($select.val() != null) {
                    for (var i = 0; i < $select.val().length; i++) {
                        d[this.name + "[" + i + "]"] = $select.val()[i];
                    }
                }

                delete(d[this.name]);
            }
        );

        if (d.order !== undefined) {
            for (var j = 0; j < d.order.length; j++) {
                d["orderBy[" + j + "].column"] = d.order[j].column;
                d["orderBy[" + j + "].dir"] = d.order[j].dir;
            }
        }

        delete(d.columns);
        delete(d.search);
        delete(d.order);
    };

    return {
        serializarForm: function (formElement, data) {
            serializarForm(formElement, data);
        }
    }

}();


var Dialog = function () {

    var yesLabel = "Sim";
    var noLabel = "Não";
    var okLabel = "OK";
    var defYesCallback, defYesArgs;
    var defNoCallback, defNoArgs;
    var defOkCallback, defOkArgs;

    var setup = function (options) {
        if (options) {
            if (options.yesLabel) {
                yesLabel = options.yesLabel;
            }

            if (options.noLabel) {
                noLabel = options.noLabel;
            }

            if (options.okLabel) {
                okLabel = options.okLabel;
            }
        }
    };

    var resetLabels = function () {
        yesLabel = "Sim";
        noLabel = "Não";
        okLabel = "OK";
    };

    var onYesClick = function () {
        if (defYesCallback) {
            if (defYesArgs) {
                defYesCallback(defYesArgs);
            } else {
                defYesCallback();
            }
        }
    };

    var onNoClick = function () {
        if (defNoCallback) {
            if (defNoArgs) {
                defNoCallback(defNoArgs);
            } else {
                defNoCallback();
            }
        }
    };

    var onOkClick = function () {
        if (defOkCallback) {
            if (defOkArgs) {
                defOkCallback(defOkArgs);
            } else {
                defOkCallback();
            }
        }
    };

    var showInformation = function (title, message, okCallback, okArgs) {
        defOkCallback = okCallback;
        defOkArgs = okArgs;

        Swal.fire({
            title: title,
            text: message,
            icon: "info",
            showCancelButton: false,
            confirmButtonText: okLabel
        }).then(function(result) {
            onOkClick();
        });
    };

    var showError = function (title, message, okCallback, okArgs) {
        defOkCallback = okCallback;
        defOkArgs = okArgs;

        Swal.fire({
            title: title,
            text: message,
            icon: "error",
            showCancelButton: false,
            confirmButtonText: okLabel
        }).then(function(result) {
            onOkClick();
        });
    };

    var showConfirmation = function (title, message, yesCallback, yesArgs, noCallback, noArgs) {
        defYesCallback = yesCallback;
        defYesArgs = yesArgs;

        defNoCallback = noCallback;
        defNoArgs = noArgs;

        Swal.fire({
            title: title,
            text: message,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: yesLabel,
            cancelButtonText: noLabel,
            focusConfirm: false,
            focusCancel: true,
            showClass: {
                popup: 'animate__animated animate__shakeX'
            }
        }).then(function(result) {
            if (result.value) {
                onYesClick();
            } else {
                onNoClick();
            }
        });
    };

    return {
        setup: function (options) {
            setup(options);
        },
        resetLabels: function () {
            resetLabels();
        },
        showInformation: function (title, message, okCallback, okArgs) {
            showInformation(title, message, okCallback, okArgs);
        },
        showError: function (title, message, okCallback, okArgs) {
            showError(title, message, okCallback, okArgs);
        },
        showConfirmation: function (title, message, yesCallback, yesArgs, noCallback, noArgs) {
            showConfirmation(title, message, yesCallback, yesArgs, noCallback, noArgs);
        }
    }

}();


var GridRenderer = function () {

    var emptyMessage = function (color) {
        var html = '';

        html += '<div class="row grid-empty-message m--font-brand">';
        html += '   <i class="la la-times-circle fs30"></i>';
        html += '   <p class="fs16">Nenhum registro encontrado.</p>';
        html += '</div>';

        return html;
    };

    var colorBadge = function (color) {
        return '<span class="label label-dot" style="background-color: ' + color + ' !important"></span>';
    };

    var statusBadge = function (color, text) {
        return '<span class="label text-white label-pill label-inline" style="background-color: ' + color + ' !important">' + text + '</span>';
    };

    var statusBadgeBoolean = function (value, trueText, falseText) {
        var badgeColor = value ? 'label-light-success' : 'label-light-danger';
        var text = value ? trueText : falseText;

        return '<span class="font-weight-bold label label-lg label-pill label-inline ' + badgeColor + '">' + text + '</span>';
    };

    var randomLetterColorBadge = function (letter) {
        var color = {
            0: {'class': 'symbol-success'},
            1: {'class': 'symbol-primary'},
            2: {'class': 'symbol-danger'},
            3: {'class': 'symbol-info'},
            4: {'class': 'symbol-warning'},
            5: {'class': 'symbol-dark'}
        };

        var index = Math.floor(Math.random() * 6);

        var htmlRetorno = '';
        htmlRetorno += '<div class="symbol symbol-40 symbol-circle ' + color[index].class + '">';
        htmlRetorno += '    <span class="symbol-label font-size-h5">' + letter + '</span>';
        htmlRetorno += '</div>';

        return htmlRetorno;
    };

    var imageWithInfo = function (image, textLine1, textLine2) {
        var html = '';
        html += '<div class="d-flex align-items-center">';
        html += '    <div class="symbol symbol-60 symbol-2by3">';
        html += '        <div class="symbol-label" style="background-image: url(' + image + ')"></div>';
        html += '    </div>';
        html += '    <div class="ml-4">';
        html += '        <div class="text-dark-75 font-weight-bold font-size-lg mb-0">' + textLine1 + '</div>';

        if (textLine2) {
            html += '        <span class="text-muted">' + textLine2 + '</span>';
        }

        html += '    </div>';
        html += '</div>';
        return html;
    };

    var iconWithInfo = function (icon, color, textLine1, textLine2) {
        var html = '';
        html += '<div class="d-flex align-items-center">';
        html += '    <div class="symbol symbol-40 symbol-circle">';
        html += '        <span class="symbol-label" style="background-color: ' + color + '">';
        html += '            <i class="fa ' + icon + ' iconfix-top-n1 iconfix-left-1 text-white"></i>';
        html += '        </span>';
        html += '    </div>';
        html += '    <div class="ml-4">';
        html += '        <div class="text-dark-75 font-weight-bold font-size-lg mb-0">' + textLine1 + '</div>';

        if (textLine2) {
            html += '        <span class="text-muted">' + textLine2 + '</span>';
        }

        html += '    </div>';
        html += '</div>';
        return html;
    };

    var letterWithInfo = function (color, letter, textLine1, textLine2) {
        var html = '';
        html += '<div class="d-flex align-items-center">';

        if (color && color !== "") {
            html += '    <div class="symbol symbol-40 symbol-circle">';
            html += '        <span class="symbol-label text-white font-size-h5" style="background-color: ' + color + '">' + letter + '</span>';
            html += '    </div>';
        } else {
            html += '    <div class="symbol symbol-40 symbol-circle">';
            html += '        <span class="symbol-label font-size-h5">' + letter + '</span>';
            html += '    </div>';
        }

        html += '    <div class="ml-4">';
        html += '        <div class="text-dark-75 font-weight-bold font-size-lg mb-0">' + textLine1 + '</div>';

        if (textLine2) {
            html += '        <span class="text-muted">' + textLine2 + '</span>';
        }

        html += '    </div>';
        html += '</div>';
        return html;
    };

    var letterWithInfoRandomColor = function (letter, textLine1, textLine2) {
        var color = {
            0: {'class': 'symbol-success'},
            1: {'class': 'symbol-primary'},
            2: {'class': 'symbol-danger'},
            3: {'class': 'symbol-info'},
            4: {'class': 'symbol-warning'},
            5: {'class': 'symbol-dark'}
        };

        var index = Math.floor(Math.random() * 6);

        var html = '';
        html += '<div class="d-flex align-items-center">';
        html += '    <div class="symbol symbol-40 symbol-circle ' + color[index].class + '">';
        html += '        <span class="symbol-label font-size-h5">' + letter + '</span>';
        html += '    </div>';
        html += '    <div class="ml-4">';
        html += '        <div class="text-dark-75 font-weight-bold font-size-lg mb-0">' + textLine1 + '</div>';

        if (textLine2) {
            html += '        <span class="text-muted">' + textLine2 + '</span>';
        }

        html += '    </div>';
        html += '</div>';
        return html;
    };

    var editButton = function (id, className) {
        var html = '';
        html += '<a href="javascript:;" class="btn btn-icon btn-clean btn-hover-primary btn-sm ' + className + '" title="Editar" onclick="Crud.edit(' + id + ')">';
        html += '    <i class="fa fa-pen"></i>';
        html += '</a>';
        return html;
    };

    var removeButton = function (id, className) {
        var html = '';
        html += '<a href="javascript:;" class="btn btn-icon btn-clean btn-hover-danger btn-sm ' + className + '" title="Excluir/Desativar" onclick="Crud.remove(' + id + ')">';
        html += '    <i class="fa fa-trash-alt"></i>';
        html += '</a>';
        return html;
    };

    var viewButton = function (id, className) {
        var html = '';
        html += '<a href="javascript:;" class="btn btn-icon btn-clean btn-hover-primary btn-sm ' + className + '" title="Visualizar" onclick="Crud.view(' + id + ')">';
        html += '    <i class="fa fa-eye"></i>';
        html += '</a>';
        return html;
    };

    return {
        emptyMessage: function () {
            return emptyMessage();
        },
        colorBadge: function (color) {
            return colorBadge(color);
        },
        statusBadge: function (color, text) {
            return statusBadge(color, text);
        },
        statusBadgeBoolean: function (value, trueText, falseText) {
            return statusBadgeBoolean(value, trueText, falseText);
        },
        randomLetterColorBadge: function (letter) {
            return randomLetterColorBadge(letter);
        },
        imageWithInfo: function (image, textLine1, textLine2) {
            return imageWithInfo(image, textLine1, textLine2);
        },
        iconWithInfo: function (icon, color, textLine1, textLine2) {
            return iconWithInfo(icon, color, textLine1, textLine2);
        },
        letterWithInfo: function (color, letter, textLine1, textLine2) {
            return letterWithInfo(color, letter, textLine1, textLine2);
        },
        letterWithInfoRandomColor: function (letter, textLine1, textLine2) {
            return letterWithInfoRandomColor(letter, textLine1, textLine2);
        },
        editButton: function (row, className) {
            return editButton(row, className);
        },
        removeButton: function (row, className) {
            return removeButton(row, className);
        },
        viewButton: function (row, className) {
            return viewButton(row, className);
        }
    }

}();

var GenericComponents = function () {

    var init = function () {
        // DATE PICKER
        var $datePickers = $('.datepicker');

        if ($datePickers.length) {
            $datePickers.inputmask(undefined, { "clearIncomplete": true });

            $datePickers.datepicker({
                language: 'pt-BR',
                format: 'dd/mm/yyyy',
                orientation: "bottom left",
                autoclose: true,
                //todayBtn: true, comentado por conflito com componente de mascara
                clearBtn: true,
                todayHighlight: true,
                showOnFocus: true,
                assumeNearbyYear: true,
                templates: {
                    leftArrow: '<i class="la la-angle-left"></i>',
                    rightArrow: '<i class="la la-angle-right"></i>'
                }
            });

            $datePickers.parent('.input-group').on('click', '.input-group-append', function(e){
                e.preventDefault();
                $(this).parent('.input-group').find('.datepicker').datepicker('show');
            });
        }

        var $timePickers = $('.timepicker');

        if ($timePickers.length) {
            $timePickers.inputmask(undefined, { "clearIncomplete": true });

            // FIXME: Desabilitamos o timepicker devido a formatação incorreta na máscara

            // $timePickers.timepicker({
            //     minuteStep: 1,
            //     showMeridian: false,
            //     explicitMode: true
            // });
            //
            // $timePickers.parent('.input-group').on('click', '.input-group-append', function(e){
            //     e.preventDefault();
            //     $(this).parent('.input-group').find('.timepicker').timepicker('showWidget');
            // });
        }

        // COLOR INPUT
        var $colorInputs = $('.color-input');

        if ($colorInputs.length) {
            $colorInputs.minicolors({
                position: 'bottom right',
                theme: 'bootstrap'
            });
        }

        // DECIMAL INPUT
        var $decimalInputs = $('.decimal-input');

        if ($decimalInputs.length) {
            $decimalInputs.maskMoney({
                thousands:'.',
                decimal:',',
                allowZero: true,
                affixesStay: false
            });
        }

        // INTEGER INPUT
        var $integerInputs = $('.integer-input');

        if ($integerInputs.length) {
            $integerInputs.on('input blur paste', function(){
                $(this).val($(this).val().replace(/\D/g, ''))
            });
        }

        // SPINNER INPUT
        $(".spinner-input").each(function() {
            var $input = $(this);
            var min = $input.data("min");
            var max = $input.data("max");

            if (!min) {
                min = 0;
            }

            if (!max) {
                max = 999999;
            }

            $input.TouchSpin({
                min: min,
                max: max,
                buttondown_class: "btn btn-secondary",
                buttonup_class: "btn btn-secondary",
                firstclickvalueifempty: min
            });
        });

        // MASK INPUT
        var $maskInputs = $('.mask-input');

        if ($maskInputs.length) {
            $maskInputs.inputmask(undefined, { "clearIncomplete": true });
        }

        // CLIPBOARD



        var clipboard = new ClipboardJS('[data-clipboard=true]');

        clipboard.on('success', function(e) {
            SnackBar.show("Copiado!", 4000);
        });
    };

    return {
        init: function () {
            init();
        }
    }

}();

var SnackBar = function () {

    var show = function (text, duration) {
        Snackbar.show({
            text: text,
            pos: 'bottom-center',
            showAction: true,
            actionText: 'Fechar',
            actionTextColor: '#22b9ff',
            duration: duration ? duration : 4000
        });
    };

    return {
        show: function (text, duration) {
            show(text, duration);
        }
    }

}();