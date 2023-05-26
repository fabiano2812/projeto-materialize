package models;

import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "cidade")
public class Cidade extends BaseEntidade {

    @Id
    @SequenceGenerator(name = "seq_cidade", sequenceName = "seq_cidade", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_cidade")
    public Long id;

    @NotEmpty
    @Column(length = 200)
    public String nome;

    @Column(name = "nome_fonetico",length = 200)
    public String nomeFonetico;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estado_id")
    public Estado estado;

    public Boolean capital = Boolean.FALSE;

    @Column(name = "prioridade_ordenacao")
    public Integer prioridadeOrdenacao;

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

    public String getNomeFonetico() {
        return nomeFonetico;
    }

    public void setNomeFonetico(String nomeFonetico) {
        this.nomeFonetico = nomeFonetico;
    }

    public Estado getEstado() {
        return estado;
    }

    public void setEstado(Estado estado) {
        this.estado = estado;
    }

    public Boolean getCapital() {
        return capital;
    }

    public void setCapital(Boolean capital) {
        this.capital = capital;
    }

    public Integer getPrioridadeOrdenacao() {
        return prioridadeOrdenacao;
    }

    public void setPrioridadeOrdenacao(Integer prioridadeOrdenacao) {
        this.prioridadeOrdenacao = prioridadeOrdenacao;
    }
}
