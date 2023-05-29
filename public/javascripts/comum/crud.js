'use strict';

var Crud = function () {

    var SEARCH_MODE = 0;
    var INCLUDE_MODE = 1;
    var EDIT_MODE = 2;
    var VIEW_MODE = 3;

    var clipboard;
    var searchTitle;
    var editTitle;
    var viewTitle;
    var searchMethod;
    var includeMethod;
    var editMethod;
    var viewMethod;
    var saveMethod;
    var removeMethod;
    var columns;
    var query;
    var columnDefs;
    var rowCreatedCallback;
    var validationRules;
    var validationMessages;
    var editInsteadOfViewing = false;
    var beforeIncludeCallback;
    var ignoreDefaultBeforeIncludeBehavior = false;
    var afterIncludeCallback;
    var ignoreDefaultAfterIncludeBehavior = false;
    var beforeEditCallback;
    var ignoreDefaultBeforeEditBehavior = false;
    var afterEditCallback;
    var ignoreDefaultAfterEditBehavior = false;
    var beforeViewCallback;
    var ignoreDefaultBeforeViewBehavior = false;
    var afterViewCallback;
    var ignoreDefaultAfterViewBehavior = false;
    var beforeSaveCallback;
    var ignoreDefaultBeforeSaveBehavior = false;
    var afterSaveCallback;
    var ignoreDefaultAfterSaveBehavior = false;
    var beforeRemoveCallback;
    var ignoreDefaultBeforeRemoveBehavior = false;
    var afterRemoveCallback;
    var ignoreDefaultAfterRemoveBehavior = false;
    var beforeBackCallback;
    var initSearchComponentsCallback;
    var initEditComponentsCallback;
    var beforeRemoveMessage;
    var afterRemoveMessage;
    var beforeSaveMessage;
    var afterSaveMessage;
    var isMultipartFormData = false;
    var pendingUpdatedRecordId = -1;


    var $dataTable;
    var $searchForm;
    var $editForm;

    var setOptions = function (options) {
        $searchForm = $('#formPesquisa');
        $editForm = $('#formEdicao');
        clipboard = new ClipboardJS('.clipboard-copy');

        searchTitle = options.searchTitle;
        editTitle = options.editTitle;
        viewTitle = options.viewTitle;
        searchMethod = options.searchMethod;
        includeMethod = options.includeMethod;
        editMethod = options.editMethod;
        viewMethod = options.viewMethod;
        saveMethod = options.saveMethod;
        removeMethod = options.removeMethod;
        columns = options.columns;
        query = options.initialQuery;
        columnDefs = options.columnDefs;
        rowCreatedCallback = options.rowCreatedCallback;
        validationRules = options.validationRules;
        validationMessages = options.validationMessages;
        editInsteadOfViewing = options.editInsteadOfViewing;
        beforeIncludeCallback = options.beforeIncludeCallback;
        ignoreDefaultBeforeIncludeBehavior = options.ignoreDefaultBeforeIncludeBehavior;
        afterIncludeCallback = options.afterIncludeCallback;
        ignoreDefaultAfterIncludeBehavior = options.ignoreDefaultAfterIncludeBehavior;
        beforeEditCallback = options.beforeEditCallback;
        ignoreDefaultBeforeEditBehavior = options.ignoreDefaultBeforeEditBehavior;
        afterEditCallback = options.afterEditCallback;
        ignoreDefaultAfterEditBehavior = options.ignoreDefaultAfterEditBehavior;
        beforeViewCallback = options.beforeViewCallback;
        ignoreDefaultBeforeViewBehavior = options.ignoreDefaultBeforeViewBehavior;
        afterViewCallback = options.afterViewCallback;
        ignoreDefaultAfterViewBehavior = options.ignoreDefaultAfterViewBehavior;
        beforeSaveCallback = options.beforeSaveCallback;
        ignoreDefaultBeforeSaveBehavior = options.ignoreDefaultBeforeSaveBehavior;
        afterSaveCallback = options.afterSaveCallback;
        beforeBackCallback = options.beforeBackCallback;
        ignoreDefaultAfterSaveBehavior = options.ignoreDefaultAfterSaveBehavior;
        beforeRemoveCallback = options.beforeRemoveCallback;
        ignoreDefaultBeforeRemoveBehavior = options.ignoreDefaultBeforeRemoveBehavior;
        afterRemoveCallback = options.afterRemoveCallback;
        ignoreDefaultAfterRemoveBehavior = options.ignoreDefaultAfterRemoveBehavior;
        initSearchComponentsCallback = options.initSearchComponentsCallback;
        initEditComponentsCallback = options.initEditComponentsCallback;
        beforeRemoveMessage = options.beforeRemoveMessage;
        afterRemoveMessage = options.afterRemoveMessage;
        beforeSaveMessage = options.beforeSaveMessage;
        afterSaveMessage = options.afterSaveMessage;
        isMultipartFormData = options.isMultipartFormData;

        var queryString = window.location.search;
        var urlParams = new URLSearchParams(queryString);

        if (urlParams.has('id')) {
            var id = urlParams.get('id');
            //caso tenha configurado visualizacao ele abre como padrao essa opcao
            if(viewMethod){
                viewRecord(id);
            }else{
                editRecord(id);
            }
        } else {
            $('#tituloPagina').html(searchTitle);
            toggleVisibility(SEARCH_MODE);
        }

    };

    var initDataTable = function () {
        $dataTable = $('#dataTable').DataTable({
            responsive: true,
            dom: 't<"dt-panelfooter clearfix"<"row m-0"<"col-md-6 p-0" i><"col-md-6 p-0 dataTables_pager" p>>>',
            pageLength: 20,
            "processing": true,
            "serverSide": true,
            "autoWidth": false,
            "ajax": {
                "url": searchMethod,
                "type": "POST",
                "data": function (d) {
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
                },
                "error": function (jqXHR, exception) {
                    ErrorHandler.customException(jqXHR, exception);
                }
            },
            "columnDefs": columnDefs,
            "columns": columns,
            "ordering": true,
            "sorting": [],
            "language": {
                "url": "/commons/custom/i18n/dataTables.pt-BR.js"
            },
            "createdRow": rowCreatedCallback
        });

        $dataTable.on('dblclick', 'tr[id]', function () {
            var rowData = $dataTable.row(this).data();
            var recordId = rowData.id;

            if (editInsteadOfViewing) {
                editRecord(recordId);
            } else {
                viewRecord(recordId);
            }
        });


    };

    var initSearchForm = function () {
        $searchForm.submit(function (e) {
            e.preventDefault();
            refreshDataTable(true);
        });

        $searchForm.on('click', '#buttonPesquisar', function (e) {
            $searchForm.submit();
        });

        $searchForm.on('click', '#buttonLimpar', function (e) {
            e.preventDefault();

            $searchForm.trigger("reset");

            // Limpa todos os componentes Select2
            $("select", $searchForm).each(function () {
                $(this).val(null).trigger('change');
            });

            // Limpa todos os componentes DatePicker
            $('.datepicker', $searchForm).datepicker('update', '');

            refreshDataTable(true);
            setSearchFocus();
        });

        GenericComponents.init();

        if (initSearchComponentsCallback) {
            initSearchComponentsCallback();
        }
    };

    var initButtonBar = function () {
        $('#buttonNovo').on('click', function () {
            includeRecord();
        });
    };

    var refreshDataTable = function (resetPaging) {
        $dataTable.ajax.reload(null, resetPaging);
    };

    var initEditForm = function () {
        validate(validationRules, validationMessages, saveMethod);

        $editForm.on('click', '#buttonSalvar', function () {
            $editForm.submit();
        });

        $editForm.on('click', '#buttonCancelar', function () {
            back();
        });
    };

    var includeRecord = function () {
        if (beforeIncludeCallback && ignoreDefaultBeforeIncludeBehavior == true) {
            beforeIncludeCallback();
        } else {
            if (beforeIncludeCallback) {
                beforeIncludeCallback();
            }

            BlockUI.block();

            $.ajax({
                method: "POST",
                url: includeMethod,
                success: function (data) {
                    openInIncludeMode(data);
                },
                complete: function () {
                    BlockUI.unblock();
                }
            });
        }
    };

    var openInIncludeMode = function (htmlContent) {
        if (afterIncludeCallback && ignoreDefaultAfterIncludeBehavior == true) {
            afterIncludeCallback();
        } else {
            $editForm.html(htmlContent);

            if (afterIncludeCallback) {
                afterIncludeCallback();
            }

            $('#tituloPagina').html("Incluir " + editTitle);
            toggleVisibility(INCLUDE_MODE);

            KTApp.initComponents();

            GenericComponents.init();

            if (initEditComponentsCallback) {
                initEditComponentsCallback();
            }

            $('input[maxlength], textarea[maxlength]').maxlength({
                alwaysShow: true,
                threshold: 20,
                warningClass: "label label-primary label-inline font-weight-bold",
                limitReachedClass: "label label-danger label-inline font-weight-bold"
            });

            setEditFocus();
        }
    };

    var editRecord = function (id) {
        if (beforeEditCallback && ignoreDefaultBeforeEditBehavior == true) {
            beforeEditCallback();
        } else {
            if (beforeEditCallback) {
                beforeEditCallback();
            }

            BlockUI.block();

            $.ajax({
                method: "POST",
                url: editMethod,
                data: {
                    "id": id
                },
                success: function (data) {
                    openInEditMode(id, data);
                },
                complete: function () {
                    BlockUI.unblock();
                }
            });
        }
    };

    var openInEditMode = function (id, htmlContent) {
        if (afterEditCallback && ignoreDefaultAfterEditBehavior == true) {
            afterEditCallback();
        } else {
            $editForm.html(htmlContent);

            if (afterEditCallback) {
                afterEditCallback();
            }

            $('#tituloPagina').html("Editar " + editTitle);
            toggleVisibility(EDIT_MODE);

            KTApp.initComponents();

            GenericComponents.init();

            if (initEditComponentsCallback !== undefined) {
                initEditComponentsCallback();
            }

            $('input[maxlength], textarea[maxlength]').maxlength({
                alwaysShow: true,
                threshold: 20,
                warningClass: "label label-primary label-inline font-weight-bold",
                limitReachedClass: "label label-danger label-inline font-weight-bold"
            });

            $('#buttonExcluir').on('click', function () {
                removeRecord(id);
            });

            setEditFocus();
        }
    };

    var viewRecord = function (id) {
        if (beforeViewCallback && ignoreDefaultBeforeViewBehavior == true) {
            beforeViewCallback();
        } else {
            if (beforeViewCallback) {
                beforeViewCallback();
            }

            BlockUI.block();

            $.ajax({
                method: "POST",
                url: viewMethod,
                data: {
                    "id": id
                },
                success: function (data) {
                    openInViewMode(id, data);
                },
                complete: function () {
                    BlockUI.unblock();
                }
            });
        }
    };

    var openInViewMode = function (id, htmlContent) {
        if (afterViewCallback && ignoreDefaultAfterViewBehavior == true) {
            afterViewCallback();
        } else {
            $editForm.html(htmlContent);

            if (afterViewCallback) {
                afterViewCallback();
            }

            $('#tituloPagina').html("Visualizar " + ((viewTitle && viewTitle != "") ? viewTitle : editTitle));
            toggleVisibility(VIEW_MODE);

            KTApp.initComponents();

            $('input[maxlength], textarea[maxlength]').maxlength({
                alwaysShow: true,
                threshold: 20,
                warningClass: "label label-primary label-inline font-weight-bold",
                limitReachedClass: "label label-danger label-inline font-weight-bold"
            });

            $("#buttonEditar").unbind('click');
            $('#buttonEditar').on('click', function () {
                editRecord(id);
            });

            $("#buttonExcluir").unbind('click');
            $('#buttonExcluir').on('click', function () {
                removeRecord(id);
            });

            setEditFocus();
        }
    };

    var removeRecord = function (id) {
        if (beforeRemoveCallback && ignoreDefaultBeforeRemoveBehavior == true) {
            beforeRemoveCallback();
        } else {
            if (beforeRemoveCallback) {
                beforeRemoveCallback();
            }

            var message = "Confirma a exclusão deste registro?\n(Atenção: Esta operação NÃO poderá ser desfeita)";

            if (beforeRemoveMessage && beforeRemoveMessage != "") {
                message = beforeRemoveMessage;
            }

            Dialog.showConfirmation("Atenção!", message, doRemove, id);
        }
    };

    function doRemove (id) {
        BlockUI.block();

        $.ajax({
            method: "POST",
            url: removeMethod,
            data: {
                id: id
            },
            success: function (data, textStatus, jqXHR) {
                if (afterRemoveCallback && ignoreDefaultAfterRemoveBehavior == true) {
                    afterRemoveCallback();
                } else {
                    if (afterRemoveCallback) {
                        afterRemoveCallback();
                    }

                    var message = "Registro excluído com sucesso!";

                    if (afterRemoveMessage && afterRemoveMessage != "") {
                        message = afterRemoveMessage;
                    }

                    setTimeout(function() {
                        Swal.fire({
                            title: "Tudo certo :)",
                            text: message,
                            icon: "success",
                            hideClass: {
                                popup: 'animate__animated animate__hinge'
                            }
                        });
                    }, 250);

                    refreshDataTable(true);

                    if ($('#modoEdicao').hasClass('active')) {
                        back();
                    }
                }
            },
            complete: function () {
                BlockUI.unblock();
            }
        });
    }

    var validate = function () {
        $editForm.validate({
            ignore: 'input[type=hidden], .note-editor *',
            rules: validationRules,
            messages: validationMessages,
            invalidHandler: function (event, validator) {
                Alert.showError('Atenção!', 'Os dados mínimos necessários não foram informados ou foram preenchidos ' +
                    'incorretamente. Corrija os campos destacados em vermelho e tente novamente.');
            },
            highlight: function (element, errorClass, validClass) {
                ValidationUI.highlight(element, "is-invalid", validClass);
            },
            unhighlight: function (element, errorClass, validClass) {
                ValidationUI.unhighlight(element, "is-invalid", validClass);
            },
            errorPlacement: function (error, element) {
                ValidationUI.errorPlacement(error, element);
            },
            errorClass: "invalid-feedback-error",
            submitHandler: function (form) {
                if (beforeSaveMessage && beforeSaveMessage != "") {
                    Dialog.showConfirmation("Atenção!", beforeSaveMessage, function () {
                        if (beforeSaveCallback && ignoreDefaultBeforeSaveBehavior == true) {
                            beforeSaveCallback();
                        } else {
                            if (beforeSaveCallback) {
                                beforeSaveCallback();
                            }

                            doSave(saveMethod);
                        }
                    });
                } else {
                    if (beforeSaveCallback && ignoreDefaultBeforeSaveBehavior == true) {
                        beforeSaveCallback();
                    } else {
                        if (beforeSaveCallback) {
                            beforeSaveCallback();
                        }

                        doSave(saveMethod);
                    }
                }
            }
        });
    };

    var doSave = function () {
        var $submitButton = $('button[type="submit"]', $editForm);
        $submitButton.prop("disabled", true);

        var formData;

        if (isMultipartFormData) {
            formData = new FormData($editForm[0]);
        } else {
            formData = $editForm.serializeArray();
        }

        BlockUI.block();

        if (isMultipartFormData) {
            $.ajax({
                method: "POST",
                enctype: 'multipart/form-data',
                url: saveMethod,
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                    onAfterSave(data);
                },
                complete: function() {
                    BlockUI.unblock();
                    $submitButton.prop("disabled", false);
                }
            });
        } else {
            $.ajax({
                method: "POST",
                url: saveMethod,
                data: formData,
                success: function (data) {
                    onAfterSave(data);
                },
                complete: function() {
                    BlockUI.unblock();
                    $submitButton.prop("disabled", false);
                }
            });
        }
    };

    var onAfterSave = function (data) {
        pendingUpdatedRecordId = data.id;
        // $dataTable.ajax.reload(); Comentado pois um refresh ja esta sendo chamado ao ajustar as colunas (draw)

        if (afterSaveCallback && ignoreDefaultAfterSaveBehavior == true) {
            afterSaveCallback();
        } else {
            back();

            setTimeout(function() {
                Swal.fire({
                    title: "Tudo certo :)",
                    text: afterSaveMessage != undefined ? afterSaveMessage : "Registro salvo com sucesso!",
                    icon: "success",
                    showCancelButton: false,
                    confirmButtonText: "OK"
                }).then(function(result) {
                    if (afterSaveCallback) {
                        afterSaveCallback(data);
                    }

                    // Marca o registro salvo na grid, caso exista
                    if (pendingUpdatedRecordId != -1) {
                        setTimeout(function () {
                            var $row = $('#ROW_' + pendingUpdatedRecordId + ' > td');

                            if ($row) {
                                $row.addClass("animate-crud-row");

                                setTimeout(function () {
                                    $row.removeClass("animate-crud-row");
                                }, 2000);
                            }

                            pendingUpdatedRecordId = -1;
                        }, 500);
                    }
                });
            }, 250);
        }
    };

    var back = function () {
        if (beforeBackCallback) {
            beforeBackCallback();
        }

        $('#tituloPagina').html(searchTitle);
        toggleVisibility(SEARCH_MODE);
        $editForm.html('');

        setTimeout(function() {
            $dataTable.columns.adjust().draw(false);
        }, 500);
    };

    var toggleVisibility = function (mode) {
        var $modoPesquisa = $('#modoPesquisa');
        var $modoEdicao = $('#modoEdicao');
        var $buttonBar = $('#buttonBar');

        if (mode === SEARCH_MODE) {
            $modoPesquisa.addClass('active');
            $modoEdicao.removeClass('active');
            $buttonBar.removeClass("bb-include bb-edit bb-view").addClass("bb-search");

            setTimeout(function () {
                setSearchFocus();
            }, 1000);
        } else {
            $modoPesquisa.removeClass('active');
            $modoEdicao.addClass('active');

            if (mode === INCLUDE_MODE) {
                $buttonBar.removeClass("bb-search bb-edit bb-view").addClass("bb-include");
            } else if (mode === EDIT_MODE) {
                $buttonBar.removeClass("bb-search bb-include bb-view").addClass("bb-edit");
            } else {
                $buttonBar.removeClass("bb-search bb-include bb-edit").addClass("bb-view");
            }
        }

        $('[data-toggle="kt-popover"]').popover('hide');
        $('[data-toggle="kt-tooltip"]').tooltip('hide');

        $('html, body').scrollTop(0);
    };

    var setSearchFocus = function () {
        // Comentado pois afeta a rolagem no mobile
        //$searchForm.find('input[type=text],select').filter(':visible:first').focus();
    };

    var setEditFocus = function () {
        $editForm.find('input[type=text],select').filter(':visible:first').focus();
    };

    return {
        init: function (options) {
            ErrorHandler.setup();
            setOptions(options);
            initDataTable();
            initSearchForm();
            initButtonBar();
            initEditForm();
            setSearchFocus();
        },
        refreshDataTable: function (resetPaging) {
            refreshDataTable(resetPaging);
        },
        openInIncludeMode: function (htmlContent) {
            openInIncludeMode(htmlContent)
        },
        edit: function (id) {
            editRecord(id)
        },
        openInEditMode: function (id, htmlContent) {
            openInEditMode(id, htmlContent)
        },
        view: function (id) {
            viewRecord(id)
        },
        openInViewMode: function (id, htmlContent) {
            openInViewMode(id, htmlContent)
        },
        remove: function (id) {
            removeRecord(id)
        },
        back: function () {
            back();
        },
        getDataTable: function () {
            return $dataTable;
        }
    };

}();