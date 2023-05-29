'use strict';

var Contact = function () {

    var id;
    var name;
    var count;

    var init = function (options) {
        id = options.id;
        name = options.name;

        var $fields = $('.select-multi-field', '#' + id);

        $fields.each(function (j) {
            initSelect2(id + "_tipo" + j, "Selecione");

            var $tipo = $("#" + id + "_tipo" + j);
            var $valor = $("#" + id + "_valor" + j);

            $tipo.on('change', function () {
                setMask($valor, this);
                setPlaceHolderDescricao($valor, this);
            });

            if ($tipo.val() != null) {
                setMask($valor, $tipo);
                setPlaceHolderDescricao($valor, $tipo);
            }
        });

        count = $fields.length - 1;
    };

    var initAddButton = function () {
        var $instance = $('#' + id);

        $instance.on('click' , '.select-multi-button-add', function () {
            count++;

            var idItem = id + '_id' + count;
            var idTipo = id + '_tipo' + count;
            var idValor = id + '_valor' + count;
            var idObservacao = id + '_observacao' + count;

            var $select2model = $('#' + id + '_tipo0');
            var selectData = $select2model.select2('data')[0];

            $select2model.select2('destroy');

            var $clone = $('#' + id + ' .select-multi-field:first').clone(false);
            $clone.find('input[name$=id]').attr("id", idItem);
            $clone.find('select[name$=tipoContato]').attr("id", idTipo).removeAttr('data-select2-id');
            $clone.find('select>option').removeAttr('data-select2-id');
            $clone.find('input[name$=valor]').attr("id", idValor);
            $clone.find('input[name$=observacao]').attr("id", idObservacao);
            $clone.insertBefore(this);

            initSelect2(id + '_tipo0', "Selecione");
            initSelect2(idTipo, "Selecione");

            $("#" + idItem).val("");
            $('#' + idTipo).val(null).trigger('change');
            $("#" + idValor).val("");
            $("#" + idObservacao).val("");

            var $tipo = $("#" + idTipo);
            var $valor = $("#" + idValor);

            $tipo.on('change', function () {
                setMask($valor, this);
                setPlaceHolderDescricao($valor, this);
            });

            if ($tipo.val() != null) {
                setMask($valor, $tipo);
                setPlaceHolderDescricao($valor, $tipo);
            }

            toggleRemoveButton();
            renumberInputs();
        });
    };

    var initRemoveButton = function () {
        var $instance = $('#' + id);

        $instance.on('click', '.select-multi-button-remove', function () {
            $(this).closest('.select-multi-field').remove();
            toggleRemoveButton();
            renumberInputs();
        });
    };

    var toggleRemoveButton = function () {
        var $instance = $('#' + id);
        var $fields = $('#' + id + ' .select-multi-field');

        if ($fields.length === 1) {
            $('.select-multi-button-remove', $instance).css("display", "none");
            $('.select-multi-button-group', $instance).css("display", "block");
        } else {
            $('.select-multi-button-remove', $instance).css("display", "table-cell");
            $('.select-multi-button-group', $instance).css("display", "table");
        }
    };

    var renumberInputs = function () {
        var $fields = $('#' + id + ' .select-multi-field');

        $fields.each(function (j) {
            var regExp = new RegExp(name + "\\[.+\\]", "g");

            var $inputId = $(this).find('input[name$=id]');
            $inputId.attr('name', ("" + $inputId.attr('name')).replace(regExp, name + '[' + j + ']'));

            var $inputTipo = $(this).find('select[name$=tipoContato]');
            $inputTipo.attr('name', ("" + $inputTipo.attr('name')).replace(regExp, name + '[' + j + ']'));

            var $inputValor = $(this).find('input[name$=valor]');
            $inputValor.attr('name', ("" + $inputValor.attr('name')).replace(regExp, name + '[' + j + ']'));

            var $inputObservacao = $(this).find('input[name$=observacao]');
            $inputObservacao.attr('name', ("" + $inputObservacao.attr('name')).replace(regExp, name + '[' + j + ']'));
        });
    };

    var initSelect2 = function (id, placeholder) {
        new Select2Commons().init({
            id: id,
            placeholder: placeholder,
            allowClear: false
        });
    };

    var setMask = function (id, tipo) {
        var $mascara = $('option:selected', tipo).attr('mascara');

        if ($mascara && $mascara !== "") {
            $(id).inputmask(undefined, { "clearIncomplete": true, "mask" : $mascara });
        } else {
            $(id).inputmask('remove');
        }
    };

    var setPlaceHolderDescricao = function (valor, tipo) {
        valor.attr("placeholder", "Informe um " + $('option:selected', tipo).text().trim());
    };

    return {
        init: function (options) {
            Contact();
            init(options);
            initAddButton();
            initRemoveButton();
            toggleRemoveButton();
            renumberInputs();
        }
    }

};