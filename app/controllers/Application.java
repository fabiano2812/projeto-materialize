package controllers;

import models.Usuario;
import play.db.jpa.Transactional;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.Security;
import security.AppSecurity;

import static security.AppSecurity.USUARIO_LOGADO;

@Security.Authenticated(AppSecurity.class)
public class Application extends Controller {

    @Transactional
    public static Usuario obterUsuarioLogado() {
        try {
            String strId = Http.Context.current().session().get(USUARIO_LOGADO);
            Long id = Long.valueOf(strId);
            Usuario usuarioId = Usuario.buscarPorId(id);
            return usuarioId;
        } catch (Throwable e){
            return null;
        }
    }

    @Transactional
    public Result segundaPagina() throws Throwable{
        try {
            String strId = Http.Context.current().session().get(USUARIO_LOGADO);
            Long id = Long.valueOf(strId);
            Usuario usuario = Usuario.buscarPorId(id);
            return ok(views.html.page2.render(usuario));
        }catch (Exception e){
            return badRequest();
        }
    }
    @Transactional
    public Result paginaCadastrosUsuarios() throws Throwable{
        try {
            String strId = Http.Context.current().session().get(USUARIO_LOGADO);
            Long id = Long.valueOf(strId);
            Usuario usuario = Usuario.buscarPorId(id);
            return ok(views.html.Cadastro.usuario.render(usuario));
        }catch (Exception e){
            return badRequest();
        }
    }
    @Transactional
    public Result paginaInicial() throws Throwable{
        try {
            String strId = Http.Context.current().session().get(USUARIO_LOGADO);
            Long id = Long.valueOf(strId);
            Usuario usuario = Usuario.buscarPorId(id);
            return ok(views.html.index.render(usuario));
        }catch (Exception e){
            return badRequest();
        }
    }
}
