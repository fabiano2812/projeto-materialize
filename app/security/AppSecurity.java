package security;

import play.mvc.Http;
import play.mvc.Result;
import play.mvc.Security;

public class AppSecurity extends Security.Authenticator {

    public static final String USUARIO_LOGADO = "USUARIO_LOGADO";

    @Override
    public String getUsername(Http.Context ctx) {
        return ctx.session().get(USUARIO_LOGADO);
    }

    @Override
    public Result onUnauthorized(Http.Context ctx) {
        return redirect("/");
    }
}
