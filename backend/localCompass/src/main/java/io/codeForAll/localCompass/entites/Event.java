package io.codeForAll.localCompass.entites;

import io.codeForAll.localCompass.entites.enums.EventStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String location;

    private LocalDateTime datetime; // Data do evento

    @Enumerated(EnumType.STRING)
    private EventStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User creator; // Quem criou o evento

    @ManyToOne
    @JoinColumn(name = "building_id")
    private Building building;

    // Lista de participantes (via tabela intermédia)
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    private List<EventAttendee> attendees;
}
