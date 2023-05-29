'use strict';

var Select2Multi = function () {

    var id;
    var placeholder;
    var displayField;
    var searchMethod;
    var name;
    var parentId;
    var count;

    var init = function (options) {
        id = options.id;
        placeholder = options.placeholder;
        displayField = options.displayField;
        searchMethod = options.searchMethod;
        name = options.name;
        parentId = options.parentId;

        var $fields = $('.select-multi-field', '#' + id);

        $fields.each(function (j) {
            initSelect2(id + "_" + j, "Selecione");
        });

        count = $fields.length - 1;
    };

    var initAddButton = function () {
        var $instance = $('#' + id);

        $instance.on('click' , '.select-multi-button-add', function () {
            count++;

            var $firstRow = $('#' + id + ' .select-multi-field:first');

            var idItem = id + '_' + count;
            var idFirstSelect = $firstRow.find('select').attr("id");

            var $select2model = $('#' + idFirstSelect);
            var selectData = $select2model.select2('data')[0];

            $select2model.select2('destroy');

            var $clone = $firstRow.clone(false);
            $clone.find('select').attr("id", idItem).removeAttr('data-select2-id');
            $clone.find('select>option').removeAttr('data-select2-id');
            $clone.insertBefore(this);

            initSelect2(idFirstSelect, "Selecione");
            initSelect2(idItem, "Selecione");

            // Se o select for ajax, temos que recriar a primeira option e seta-la como o valor atual do componente
            if (searchMethod) {
                var selectedOption = new Option(selectData[displayField] ? selectData[displayField] : selectData.text, selectData.id, false, true);
                $select2model.append(selectedOption).trigger('change');
            } else {
                $select2model.trigger('change');
            }

            $('#' + idItem).val(null).trigger('change');

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

    var initSelect2 = function (id, placeholder) {
        new Select2Commons().init({
            id: id,
            searchMethod: searchMethod,
            placeholder: placeholder,
            displayField: displayField,
            allowClear: true
        });
    };

    var renumberInputs = function () {
        var $fields = $('#' + id + ' .select-multi-field');

        $fields.each(function (j) {
            var $select = $(this).find('select');
            var regExp = new RegExp(name + "\\[.+\\]", "g");
            var nameChanged = $select.attr('name').replace(regExp, name + '[' + j + ']');
            $select.attr('name', nameChanged);
        });
    };

    return {
        init: function (options) {
            init(options);
            initAddButton();
            initRemoveButton();
            toggleRemoveButton();
            renumberInputs();
        }
    }

};