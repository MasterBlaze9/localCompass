package io.codeForAll.localCompass.controller;

import io.codeForAll.localCompass.dto.events.*;
import io.codeForAll.localCompass.entites.*;
import io.codeForAll.localCompass.entites.enums.RsvpStatus;
import io.codeForAll.localCompass.entites.enums.EventStatus;
import io.codeForAll.localCompass.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BuildingRepository buildingRepository;
    @Autowired
    private EventAttendeeRepository eventAttendeeRepository;

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(username)
                .orElseGet(() -> userRepository.findByPhoneNumber(username)
                        .orElseThrow(() -> new RuntimeException("User not found")));
    }

    // Create Event
    @PostMapping
    public ResponseEntity<EventResponseDTO> createEvent(@RequestBody CreateEventDTO dto) {
        User authUser = getCurrentUser();
        if (!authUser.isAdmin() && !authUser.getId().equals(dto.getCreatorId())) {
            throw new RuntimeException("Forbidden");
        }
        User creator = userRepository.findById(dto.getCreatorId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Building building = buildingRepository.findById(dto.getBuildingId())
                .orElseThrow(() -> new RuntimeException("Building not found"));

        Event event = new Event();
        event.setTitle(dto.getTitle());
        event.setDescription(dto.getDescription());
        event.setLocation(dto.getLocation());
        event.setDatetime(dto.getDatetime());
        event.setStatus(EventStatus.SCHEDULED);
        event.setCreator(creator);
        event.setBuilding(building);

        Event saved = eventRepository.save(event);
        return ResponseEntity.ok(new EventResponseDTO(saved));
    }

    // Update Event (creator or admin only)
    @PutMapping("/{id}")
    public ResponseEntity<EventResponseDTO> updateEvent(@PathVariable Long id, @RequestBody UpdateEventDTO dto) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        User authUser = getCurrentUser();
        if (!authUser.isAdmin() && !event.getCreator().getId().equals(authUser.getId())) {
            throw new RuntimeException("Forbidden");
        }

        if (dto.getTitle() != null) event.setTitle(dto.getTitle());
        if (dto.getDescription() != null) event.setDescription(dto.getDescription());
        if (dto.getLocation() != null) event.setLocation(dto.getLocation());
        if (dto.getDatetime() != null) event.setDatetime(dto.getDatetime());
        if (dto.getStatus() != null) event.setStatus(dto.getStatus());

        Event updated = eventRepository.save(event);
        return ResponseEntity.ok(new EventResponseDTO(updated));
    }

    // Delete Event (creator or admin only)
    @DeleteMapping("/{id}")
    public ResponseEntity<EventResponseDTO> deleteEvent(@PathVariable Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        User authUser = getCurrentUser();
        if (!authUser.isAdmin() && !event.getCreator().getId().equals(authUser.getId())) {
            throw new RuntimeException("Forbidden");
        }
        eventRepository.delete(event);
        return ResponseEntity.ok(new EventResponseDTO(event));
    }

    // Join Event (self or admin)
    @PostMapping("/{eventId}/attendees")
    public ResponseEntity<EventAttendeeDTO> joinEvent(@PathVariable Long eventId) {
        User authUser = getCurrentUser();

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Check if already attending to prevent duplicates
        eventAttendeeRepository.findByEventIdAndUserId(eventId, authUser.getId())
                .ifPresent(a -> {
                    throw new RuntimeException("User already attending");
                });

        EventAttendee attendee = new EventAttendee();
        attendee.setEvent(event);
        attendee.setUser(authUser);

        attendee.setRsvpStatus(RsvpStatus.PRESENT);

        EventAttendee saved = eventAttendeeRepository.save(attendee);
        return ResponseEntity.ok(new EventAttendeeDTO(saved));
    }

    @PatchMapping("/{eventId}/attendees/{userId}")
    public ResponseEntity<EventAttendeeDTO> updateAttendance(@PathVariable Long eventId,
                                                             @PathVariable Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        User authUser = getCurrentUser();
        if (!authUser.isAdmin() && !event.getCreator().getId().equals(authUser.getId())) {
            throw new RuntimeException("Forbidden");
        }
        EventAttendee attendee = eventAttendeeRepository.findByEventIdAndUserId(eventId, userId)
                .orElseThrow(() -> new RuntimeException("Attendee not found"));

        attendee.setRsvpStatus(RsvpStatus.PRESENT);
        EventAttendee updated = eventAttendeeRepository.save(attendee);
        return ResponseEntity.ok(new EventAttendeeDTO(updated));
    }

    // List Attendees (creator or admin)
    @GetMapping("/{eventId}/attendees")
    public ResponseEntity<List<EventAttendeeDTO>> getAttendees(@PathVariable Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        User authUser = getCurrentUser();
        if (!authUser.isAdmin() && !event.getCreator().getId().equals(authUser.getId())) {
            throw new RuntimeException("Forbidden");
        }
        List<EventAttendee> attendees = eventAttendeeRepository.findByEventId(eventId);
        List<EventAttendeeDTO> response = attendees.stream()
                .map(EventAttendeeDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // List Events (optional filter by building or status)
    @GetMapping
    public ResponseEntity<List<EventResponseDTO>> listEvents(@RequestParam(required = false) Long buildingId,
                                                             @RequestParam(required = false) EventStatus status,
                                                             @RequestParam(required = false) String scope) {
        User me = getCurrentUser();
        // If admin, force filtering by their building (when assigned)
        Long effectiveBuildingId = buildingId;
        if (me != null && me.isAdmin() && me.getBuilding() != null) {
            effectiveBuildingId = me.getBuilding().getId();
        }

        List<Event> events;
        if ("mine".equalsIgnoreCase(scope)) {
            List<Event> base = (effectiveBuildingId != null) ? eventRepository.findByBuildingIdOrderByDatetimeAsc(effectiveBuildingId) : eventRepository.findAll();
            events = base.stream().filter(e -> e.getCreator() != null && e.getCreator().getId().equals(me.getId())).toList();
        } else if ("attending".equalsIgnoreCase(scope)) {
            var ids = eventAttendeeRepository.findByUserId(me.getId()).stream().map(a -> a.getEvent().getId()).toList();
            events = ids.isEmpty() ? List.of() : eventRepository.findAllById(ids);
        } else if ("available".equalsIgnoreCase(scope)) {
            Long bId = (me != null && me.getBuilding() != null) ? me.getBuilding().getId() : effectiveBuildingId;
            List<Event> base = (bId != null) ? eventRepository.findByBuildingIdAndStatus(bId, EventStatus.SCHEDULED) : eventRepository.findEventByStatusOrderByDatetimeAsc(EventStatus.SCHEDULED);
            var joined = eventAttendeeRepository.findByUserId(me.getId()).stream().map(a -> a.getEvent().getId()).collect(java.util.stream.Collectors.toSet());
            events = base.stream()
                    .filter(ev -> ev.getCreator() == null || !ev.getCreator().getId().equals(me.getId()))
                    .filter(ev -> !joined.contains(ev.getId()))
                    .toList();
        } else {
            if (effectiveBuildingId != null && status != null) {
                events = eventRepository.findByBuildingIdAndStatus(effectiveBuildingId, status);
            } else if (effectiveBuildingId != null) {
                events = eventRepository.findByBuildingIdOrderByDatetimeAsc(effectiveBuildingId);
            } else if (status != null) {
                events = eventRepository.findEventByStatusOrderByDatetimeAsc(status);
            } else {
                events = eventRepository.findAll();
            }
        }

        List<EventResponseDTO> response = events.stream()
                .map(EventResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
}
