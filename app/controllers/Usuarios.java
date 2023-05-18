package controllers;

import beans.FiltroUsuario;
import beans.UsuarioBean;
import beans.search.SearchResult;
import models.Usuario;
import play.data.DynamicForm;
import play.data.Form;
import play.db.jpa.Transactional;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

import java.util.ArrayList;
import java.util.List;

public class Usuarios extends Controller {

    private static Form<FiltroUsuario> formFiltro = Form.form(FiltroUsuario.class);

    @Transactional
    public Result filtrar() {
        try {

            List<Usuario> usuario = Usuario.buscarTodosUsuarios();
            List<UsuarioBean> bean = new ArrayList<>();
            for (Usuario usuarioResultado : usuario) {
                UsuarioBean usuarios = new UsuarioBean();
                usuarios.setNome(usuarioResultado.getNome());
                usuarios.setId(usuarioResultado.getId());
                bean.add(usuarios);
            }
            Form<FiltroUsuario> form = formFiltro.bindFromRequest();
            FiltroUsuario filtro = form.get();

            return ok(Json.toJson(new SearchResult<UsuarioBean>(1L, bean, 2L, filtro)));
        } catch (Exception e){
            return badRequest();
        }
    }


    @Transactional
    public Result excluir(){
        try {
            DynamicForm dynamicForm = DynamicForm.form().bindFromRequest();
            String strId = dynamicForm.get("id");
            Long Id = Long.valueOf(strId);

            Usuario usuario = Usuario.buscarPorId(Id);
            usuario.excluir();

            return ok();
        }catch (Exception e){
            return badRequest();
        }
    }

}
