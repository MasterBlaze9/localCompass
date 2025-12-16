package io.codeForAll.localCompass.entites;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Building {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "total_units")
    private Integer totalUnits;

    @ManyToOne
    @JoinColumn(name = "condominium_id", nullable = false)
    private Condominium condominium;


    @OneToMany(mappedBy = "building")
    private List<User> users;
}
