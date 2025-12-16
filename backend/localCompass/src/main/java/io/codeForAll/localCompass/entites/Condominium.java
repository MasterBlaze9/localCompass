package io.codeForAll.localCompass.entites;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Condominium {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;

    @Column(name = "admin_email")
    private String adminEmail;


    @OneToMany(mappedBy = "condominium", cascade = CascadeType.ALL)
    private List<Building> buildings;
}
