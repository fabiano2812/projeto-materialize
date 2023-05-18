package beans.search;

/**
 * Created by AgiumSoft on 03/03/2017.
 */
public class QueryParameter {
    public String jpql;
    public boolean fieldParametro = true;

    public QueryParameter(String jpql,boolean fieldParametro) {
        this.fieldParametro = fieldParametro;
        this.jpql = jpql;
    }

    public QueryParameter(String jpql) {
        this.fieldParametro = true;
        this.jpql = jpql;
    }
}
