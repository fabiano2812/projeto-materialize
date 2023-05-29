/**
 * Page User List
 */
'use strict';

// Datatable (jquery)

$(function () {

    // Variable declaration for table
    var dt_user_table = $('.datatables-users');

    // Users datatable
    if (dt_user_table.length) {
        var dt_user = dt_user_table.DataTable({
            pageLength: 20,
            dom: 't<"dt-panelfooter clearfix"<"row m-0"<"col-md-6 p-0" i><"col-md-6 p-0 dataTables_pager" p>>>',
            "processing": true,
            "serverSide": true,
            "autoWidth": false,
            "ajax": {
                "url": '/usuarios/filtrar',
                "type": "POST",
                "data": function (d) {
                    var $searchForm = $('#formPesquisa');

                    var formData = $searchForm.serializeArray();

                    for (var i = 0; i < formData.length; i++) {
                        d[formData[i].name] = formData[i].value;
                    }

                    if (d.order !== undefined) {
                        for (var j = 0; j < d.order.length; j++) {
                            d["orderBy[" + j + "].column"] = d.order[j].column;
                            d["orderBy[" + j + "].dir"] = d.order[j].dir;
                        }
                    }

                    delete (d.columns);
                    delete (d.search);
                    delete (d.order);
                }
            },
            columns: [
                {data: 'id'},
                {data: 'nome'},
                {data: 'menu'}
            ],
            columnDefs: [
                {
                    targets: -1,
                    orderable: false,
                    render: function (data, type, full, meta) {
                        var acoesHtml = '';
                        acoesHtml += '<select id="edicao" class="btn btn-success" onchange="getSelectedValue('+full.id+')">' +
                            '    <option>Editar</option>' +
                            '    <option value="view">View</option>' +
                            '    <option value="Alterar">Alterar</option>' +
                            '    <option value="Deletar">Deletar</option>' +
                            '  </select>';
                        return acoesHtml;
                    }
                },
            ]
        });
    }
});

function getSelectedValue(id) {
    var selectElement = document.getElementById('edicao');
    var SelectEdicao = selectElement.value;

    if (SelectEdicao == "view") {
        visualizacao(id)
    } else if (SelectEdicao == "Alterar") {
        alterarDadosUsuario(id)
    } else if (SelectEdicao == "Deletar") {
        deletarUsuario(id);
    }
}


   var visualizacao = function (id){
    console.log("to vendo")
    console.log(id)
   }


var alterarDadosUsuario = function (id){
    console.log("to alterando")
    console.log(id)
}

var deletarUsuario = function (id){
    $.ajax({
        method: 'POST',
        url: '/excluir/usuario',
        data: {
            id: id
        },
        success: function () {
            alert('Arquivo excluido com suceso...')
        },
        error: function (jqXHR, exception) {
            console.log("Erro no servidor ao excluir.");
        }
    });
}



