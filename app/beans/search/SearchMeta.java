package beans.search;

/**
 * Created by Adriano on 26/01/2018.
 */
public class SearchMeta {

    public Long page;
    public Long pages;
    public Long perpage;
    public Long total;

    public SearchMeta() {
    }

    public SearchMeta(Long page, Long pages, Long perpage, Long total) {
        this.page = page;
        this.pages = pages;
        this.perpage = perpage;
        this.total = total;
    }

}