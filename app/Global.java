import play.Application;
import play.GlobalSettings;
import play.Logger;
import play.db.jpa.JPA;
import play.libs.F;

public class Global extends GlobalSettings {

    public void onStart(Application app) {
        Logger.info("Application has started");
        JPA.withTransaction(new F.Callback0() {
            @Override
            public void invoke() throws Throwable {
                play.Logger.debug("First JPA call");
            }
        });

    }
}