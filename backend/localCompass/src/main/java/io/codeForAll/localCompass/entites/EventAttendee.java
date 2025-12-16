package io.codeForAll.localCompass.entites;

import io.codeForAll.localCompass.entites.enums.RsvpStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "event_attendee")
public class EventAttendee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "rsvp_status")
    private RsvpStatus rsvpStatus; // CONFIRMADO, TALVEZ...

    @Column(name = "joined_at")
    private LocalDateTime joinedAt = LocalDateTime.now();
}
