'use strict';

var Select2Commons = function () {

    var id;
    var searchMethod;
    var placeholder;
    var placeholderEmptyParent;
    var parentId;
    var displayField;
    var allowClear = true;
    var required = false;
    var parameters;

    var init = function (options) {
        id = options.id;
        searchMethod = options.searchMethod;
        placeholder = options.placeholder;
        placeholderEmptyParent = options.placeholderEmptyParent;
        parentId = options.parentId;
        displayField = options.displayField;
        allowClear = options.allowClear != null ? options.allowClear : allowClear;
        required = options.required;
        parameters = options.parameters;

        var $select2;

        // Se o searchMethod nao for passado, nao iniciar ajax
        if (searchMethod == undefined || searchMethod == "" || searchMethod == null) {
            $select2 = createSelect();
        } else {
            $select2 = createSelectAjax();
        }

        if (required) {
            $select2.on("change", function() {
                $(this).valid();
            });
        }

        // Escuta por alteracoes feitas no componente pai
        if (parentId) {
            var $parent = $("#" + parentId);
            var parentPlaceholderText = (placeholderEmptyParent && placeholderEmptyParent != "") ? placeholderEmptyParent : placeholder;

            // se parent nao estiver selecionado desabilitar filho
            if($parent.val() == undefined || $parent.val() == "" || $parent.val() == null){
                $select2.parent().find('.select2').find('.select2-selection__placeholder').html(parentPlaceholderText);
                $select2.parent().find('.select2').find('input').attr('placeholder', parentPlaceholderText);
                //$select2.parent().find('.select2').find('.select2-selection__clear').remove();
                $select2.prop("disabled", true);
            }

            $parent.on("select2:select", function() {
                $select2.parent().find('.select2').find('.select2-selection__placeholder').html(placeholder);
                $select2.parent().find('.select2').find('input').attr('placeholder', placeholder);
                //$select2.parent().find('.select2').find('.select2-selection__clear').remove();
                $select2.prop("disabled", false);
            });

            $parent.on("change", function() {
                $select2.val(null).trigger('change');

                if(this.value == undefined || this.value == "" || this.value == null){
                    // Caso o componente pai esteja com o valor nulo, desabilitamos o filho
                    $select2.parent().find('.select2').find('.select2-selection__placeholder').html(parentPlaceholderText);
                    $select2.parent().find('.select2').find('input').attr('placeholder', parentPlaceholderText);
                    //$select2.parent().find('.select2').find('.select2-selection__clear').remove();
                    $select2.prop("disabled", true);
                }
            });
        }
    };

    var createSelectAjax = function () {
        return $("#" + id).select2({
            ajax: {
                url: searchMethod,
                dataType: 'json',
                delay: 800,
                data: function (params) {
                    var queryParameters = {
                        query: params.term
                    };

                    if (parentId) {
                        queryParameters["parentId"] = $("#" + parentId).val();
                    }

                    if(parameters){
                        queryParameters= $.extend({}, queryParameters, parameters);
                    }

                    return queryParameters;
                },
                processResults: function (data, page) {
                    return {
                        results: data
                    };
                },
                cache: true
            },
            language: 'pt-BR',
            placeholder: placeholder,
            allowClear: allowClear,
            minimumInputLength: 1,
            templateResult: function (item) {
                if(item.id > 0 && item[displayField]) {
                    return item[displayField];
                }
                return item.text;
            },
            templateSelection: function (item) {
                if(item.id > 0 && item[displayField]) {
                    return item[displayField];
                }
                return item.text.trim();
            },
            width: "100%"
        });
    };

    var createSelect = function() {
        return $("#" + id).select2({
            language: 'pt-BR',
            placeholder: placeholder,
            allowClear: allowClear,
            templateSelection: function (item) {
                return item.text.trim();
            },
            width: "100%"
        });
    };

    return {
        init: function (options) {
            init(options);
        }
    }

};