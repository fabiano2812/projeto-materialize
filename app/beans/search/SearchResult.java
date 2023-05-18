package beans.search;

import java.util.List;

public class SearchResult<BaseResultBean> {

	public Long draw;
	public List<BaseResultBean> data;
	public Long recordsTotal;
	public Long recordsFiltered;
	public SearchMeta meta;

	public SearchResult() {
		super();
	}

	public SearchResult(Long draw, List<BaseResultBean> data, Long recordsTotal, FiltroBaseBean filtro) {
		this.draw = draw;
		this.data = data;
		this.recordsTotal = recordsTotal;
		this.recordsFiltered = recordsTotal;

		if (filtro != null) {
            Long pagina = (filtro.start / filtro.length) + 1;
            Long paginas = (recordsTotal / filtro.length) + 1;

            this.meta = new SearchMeta(pagina, paginas, filtro.length, recordsTotal);
        }
	}

}