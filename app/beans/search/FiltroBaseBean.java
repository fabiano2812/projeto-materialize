package beans.search;

/**
 * Created by AgiumSoft on 21/06/2015.
 */
public abstract class FiltroBaseBean<T> {

    public FiltroBaseBean() {
    }

    public Long start;
    public Long length;
    public Long draw;

    public Long getStart() {
        return start;
    }

    public void setStart(Long start) {
        this.start = start;
    }

    public Long getLength() {
        return length;
    }

    public void setLength(Long length) {
        this.length = length;
    }

    public Long getDraw() {
        return draw;
    }

    public void setDraw(Long draw) {
        this.draw = draw;
    }
}
