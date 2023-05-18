var LoginUsuario = function () {

    const URL_SALVAR = '/login/salvarcadastro'
    const URL_VERIFICAR_CONTA_EXISTENTE = '/login/inicio'
    var init = function () {
        validarLogin();
        validarCadastro();
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
                    text: 'Do you want to continue',
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