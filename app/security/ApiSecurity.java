package security;

import play.mvc.Http;
import play.mvc.Security;
import utils.Criptografia;

public class ApiSecurity extends Security.Authenticator {

    private static final String CHAVE_API = "KYn25678";

    @Override
    public String getUsername(Http.Context ctx) {
        try {
            String chave = ctx.request().getHeader("chave");
            String cheveDescriptografada = Criptografia.decrypt(chave);

            if (CHAVE_API.equals(cheveDescriptografada)) {
                return chave;
            }

            return null;
        }catch (Exception e){
            return null;
        }
    }
}
