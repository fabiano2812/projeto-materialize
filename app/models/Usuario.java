package models;

import play.db.jpa.JPA;
import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "usuario")
public class Usuario extends BaseEntidade {

    @Id
    @SequenceGenerator(name = "seq_usuario", sequenceName = "seq_usuario", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_usuario")
    public Long id;

    public String nome;

    private String senha;

    public Integer telefone;

    public String cargo;

    @Embedded
    public Endereco endereco;

    public String idioma;

    public String email;


    public static List<Usuario> buscarTodosUsuarios(){
        try {
            Query query = JPA.em().createQuery("SELECT u FROM Usuario u");
            return query.getResultList();
        }catch (Exception e){
            return null;
        }
    }



    public static Usuario buscarUsuarioPorEmailSenha(String email, String senha) {
        try {
            Query query = JPA.em().createQuery("SELECT u FROM Usuario u WHERE u.email = :email AND u.senha = :senha ");
            query.setParameter("email", email);
            query.setParameter("senha", senha);
            query.setMaxResults(1);
            return (Usuario) query.getSingleResult();
        } catch (NoResultException n) {
            return null;
        }
    }

    public static Usuario buscarPorId(Long id) {

        Query query = JPA.em().createQuery("SELECT u FROM Usuario u WHERE u.id = :id ");
        query.setParameter("id", id);
        return (Usuario) query.getSingleResult();
    }

    public Integer getTelefone() {
        return telefone;
    }

    public void setTelefone(Integer telefone) {
        this.telefone = telefone;
    }

    public String getIdioma() {
        return idioma;
    }

    public void setIdioma(String idioma) {
        this.idioma = idioma;
    }

    public Endereco getEndereco() {
        return endereco;
    }

    public void setEndereco(Endereco endereco) {
        this.endereco = endereco;
    }

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
