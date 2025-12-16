package io.codeForAll.localCompass.entites;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "app_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(unique = true)
    private String email;

    private String password;

    @Column(name = "unit_number")
    private String unitNumber;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "is_admin")
    private boolean isAdmin = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();


    @ManyToOne
    @JoinColumn(name = "building_id", nullable = false)
    private Building building;


    @OneToMany(mappedBy = "user")
    private List<Post> posts;

    @OneToMany(mappedBy = "user")
    private List<Report> reports;

}
