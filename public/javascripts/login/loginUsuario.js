var LoginUsuario = function () {

    const URL_SALVAR = '/login/salvarcadastro'
    const URL_VERIFICAR_CONTA_EXISTENTE = '/login/inicio'
    var init = function () {
        validarLogin();
        validarCadastro();
        buscarUsuarios();
    }

    var buscarUsuarios = function () {
        $.ajax({
            method: 'POST',
            url: '/buscar/usuarios',
            data: {},
            success(usuarios) {
                var html = '<ul class="list-unstyled mb-0">'
                for (const usuario of usuarios) {
                    html += '          <li class="mb-3">'
                    html += '  <div class="d-flex align-items-start">'
                    html += '  <div class="d-flex align-items-start">'
                    html += '  <div class="avatar me-3">'
                    html += '  <img src="/assets/img/avatars/2.png" alt="Avatar"  class="rounded-circle"/>'
                    html += '  </div>'
                    html += ' <div class="me-2">'
                    html += '   <h6 class="mb-0">'+usuario.email+'</h6>'
                    html += '    </div>'
                    html += '   </div>'
                    html += '   <div class="ms-auto">'
                    html += '    <button class="btn btn-outline-primary btn-icon">'
                    html += '   <i class="mdi mdi-account-outline mdi-24px"></i>'
                    html += '   </button>'
                    html += '   </div>'
                    html += '  </div>'
                    html += '  </li>'
                }
                html += '</ul>'
                $("#gerarUsuarios").html(html);
            },
            error() {
                console.log("Deu algo de errado no servidor")
            }
        })
    }


    var validarCadastro = function () {
        $('#formNovoCadastro').validate({
            ignore: 'input[type=hidden]',
            rules: {
                username: {
                    required: true
                },
                email: {
                    required: true
                },
                password: {
                    required: true
                },
            },
            messages: {
                username: {
                    required: 'Informe o Nome'
                },
                email: {
                    required: 'Informe a E-mail'
                },
                password: {
                    required: 'Informe a Senha'
                },
            },
            errorClass: "invalid-feedback-error text-danger",
            submitHandler: function (form) {

                var formData = $(form).serializeArray();
                salvarDadosDeCadastro(formData);
            }
        })
    }

    var salvarDadosDeCadastro = function (formData) {
        $.ajax({
            method: 'POST',
            url: URL_SALVAR,
            data: formData,
            success: function () {
                Swal.fire({
                    title: 'Tudo certo!',
                    text: 'usuario salvo com Sucesso',
                    icon: 'success',
                    confirmButtonText: 'Cool'
                })

            },
            error: function (jqXHR, exception) {
                console.log("Ocorreu um erro no servidor")
            }
        });
    }

    var validarLogin = function () {
        $('#formLogin').validate({
            ignore: 'input[type=hidden]',
            rules: {
                email: {
                    required: true
                },
                password: {
                    required: true
                },
            },
            messages: {
                email: {
                    required: 'Informe o Email'
                },
                password: {
                    required: 'Informe a Senha'
                },
            },
            errorClass: "invalid-feedback-error text-danger",
            submitHandler: function (form) {

                var formData = $(form).serializeArray();
                logarContaValida(formData)
            }
        });
    }

    var logarContaValida = function (formData) {
        $.ajax({
            method: 'POST',
            url: URL_VERIFICAR_CONTA_EXISTENTE,
            data: formData,
            success: function (usuario) {
                if (usuario != "") {
                    SnackBar.show("Bem vindo!", 1000);
                    window.location.href = "http://localhost:9000/pagina"
                } else {
                    Swal.fire({
                        title: "Usuário não encontrado"
                    }).then((result) => {
                    })
                }
            },
            error: function (jqXHR, exception) {
                console.log("Ocorreu um erro no servidor")
            }
        });
    }


    return {
        init: function () {
            init();
        }
    }
}()