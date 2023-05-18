package models;

import exceptions.BaseException;
import play.db.jpa.JPA;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@MappedSuperclass
public class BaseEntidade {

    public void desanexar(){
        JPA.em().detach(this);
    }

    public void persistir(){
        JPA.em().flush();
    }


    public BaseEntidade salvar() throws BaseException {
        JPA.em().persist(this);
        return this;
    }

    public BaseEntidade alterar() throws BaseException {
        return JPA.em().merge(this);
    }


    public void excluir() throws BaseException {

        BaseEntidade baseEntidade = this;

        if(!JPA.em().contains(this)){
            baseEntidade = JPA.em().merge(this);
        }
        JPA.em().remove(baseEntidade);
    }

    public static BaseEntidade buscarPorId(Class classe,Long id){
        return (BaseEntidade) JPA.em().find(classe, id);
    }

    public static List<BaseEntidade> buscarPorIds(Class classe, List<Long> ids){
        TypedQuery<BaseEntidade> query = JPA.em().createQuery("select x from " + classe.getSimpleName() + " x WHERE x.id IN(:ids) ", BaseEntidade.class);
        query.setParameter("ids",ids);
        return query.getResultList();
    }

    public static List<BaseEntidade> buscarTodos(Class classe) {
        TypedQuery<BaseEntidade> query = JPA.em().createQuery("select x from " + classe.getSimpleName() + " x", classe);
        return query.getResultList();
    }

}
