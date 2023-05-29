package beans.search;


import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Created by AgiumSoft on 01/07/2015.
 */
public class BaseResultBean {
    @JsonProperty("DT_RowId")
    public String RowId;
    public String acoesHtml;
}
