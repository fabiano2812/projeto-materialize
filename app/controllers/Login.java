package controllers;

import beans.UsuarioBean;
import exceptions.EmailJaUtilizadoException;
import models.Usuario;
import play.data.DynamicForm;
import play.db.jpa.Transactional;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import security.AppSecurity;

public class Login extends Controller {


    public Result salvarPessoa(){
        try{
            DynamicForm dynamicForm = DynamicForm.form().bindFromRequest();
            String STRID = dynamicForm.get("id");
            Long id = Long.valueOf(STRID);
            Usuario usuario = Usuario.buscarPorId(id);

            return ok();
        }catch (Exception e){
            return badRequest();
        }
    }

    public Result paginaInicial(){
        try {
            session().clear();
            return ok(views.html.PaginaLogin.login.render());
        }catch (Exception e){
            return badRequest();
        }
    }

    public Result novoCadastro(){
        try {
            return ok(views.html.PaginaLogin.PaginaCadastro.render());
        }catch (Exception e){
            return badRequest();
        }
    }

    @Transactional
    public Result salvarNovoCadastro(){
        try {
            DynamicForm dynamicForm = DynamicForm.form().bindFromRequest();
            String strSenha = dynamicForm.get("password");
            String strEmail = dynamicForm.get("email");
            String strNome = dynamicForm.get("username");
            UsuarioBean usuarioBean = new UsuarioBean();
                Usuario usuario = new Usuario();
                usuario.setNome(strNome);
                usuario.setEmail(strEmail);
                usuario.setSenha(strSenha);
                usuario = (Usuario) usuario.alterar();
            return ok();
        }catch (Exception e){
            return badRequest();
        }
    }

    @Transactional
    public Result logarContaInicio(){
        try {
            DynamicForm dynamicForm = DynamicForm.form().bindFromRequest();
            String strEmail = dynamicForm.get("email");
            String strSenha = dynamicForm.get("password");
            UsuarioBean bean = new UsuarioBean();
            Usuario usuario = Usuario.buscarUsuarioPorEmailSenha(strEmail,strSenha);
            if (usuario != null) {
                session().put(AppSecurity.USUARIO_LOGADO, usuario.getId().toString());
                bean.setNome(usuario.getNome());
                return ok(Json.toJson(usuario));
            }
            return ok();
        }catch (Exception e){
            return badRequest();
        }
    }
}
