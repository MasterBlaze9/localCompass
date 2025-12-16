package io.codeForAll.localCompass.controller;

import io.codeForAll.localCompass.dto.events.*;
import io.codeForAll.localCompass.entites.*;
import io.codeForAll.localCompass.entites.enums.RsvpStatus;
import io.codeForAll.localCompass.entites.enums.EventStatus;
import io.codeForAll.localCompass.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired private EventRepository eventRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private BuildingRepository buildingRepository;
    @Autowired private EventAttendeeRepository eventAttendeeRepository;

    // Create Event
    @PostMapping
    public ResponseEntity<EventResponseDTO> createEvent(@RequestBody CreateEventDTO dto) {
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

    // Update Event
    @PutMapping("/{id}")
    public ResponseEntity<EventResponseDTO> updateEvent(@PathVariable Long id, @RequestBody UpdateEventDTO dto) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (dto.getTitle() != null) event.setTitle(dto.getTitle());
        if (dto.getDescription() != null) event.setDescription(dto.getDescription());
        if (dto.getLocation() != null) event.setLocation(dto.getLocation());
        if (dto.getDatetime() != null) event.setDatetime(dto.getDatetime());
        if (dto.getStatus() != null) event.setStatus(dto.getStatus());

        Event updated = eventRepository.save(event);
        return ResponseEntity.ok(new EventResponseDTO(updated));
    }

    // Join Event
    @PostMapping("/{eventId}/attendees")
    public ResponseEntity<EventAttendeeDTO> joinEvent(@PathVariable Long eventId, @RequestParam Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        eventAttendeeRepository.findByEventIdAndUserId(eventId, userId)
                .ifPresent(a -> { throw new RuntimeException("User already attending"); });

        EventAttendee attendee = new EventAttendee();
        attendee.setEvent(event);
        attendee.setUser(user);
        attendee.setRsvpStatus(RsvpStatus.PENDING);

        EventAttendee saved = eventAttendeeRepository.save(attendee);
        return ResponseEntity.ok(new EventAttendeeDTO(saved));
    }

    // Update Attendance Status
    @PatchMapping("/{eventId}/attendees/{userId}")
    public ResponseEntity<EventAttendeeDTO> updateAttendance(@PathVariable Long eventId,
                                                             @PathVariable Long userId,
                                                             @RequestParam RsvpStatus status) {
        EventAttendee attendee = eventAttendeeRepository.findByEventIdAndUserId(eventId, userId)
                .orElseThrow(() -> new RuntimeException("Attendee not found"));

        attendee.setRsvpStatus(status);
        EventAttendee updated = eventAttendeeRepository.save(attendee);
        return ResponseEntity.ok(new EventAttendeeDTO(updated));
    }

    // List Attendees
    @GetMapping("/{eventId}/attendees")
    public ResponseEntity<List<EventAttendeeDTO>> getAttendees(@PathVariable Long eventId) {
        List<EventAttendee> attendees = eventAttendeeRepository.findByEventId(eventId);
        List<EventAttendeeDTO> response = attendees.stream()
                .map(EventAttendeeDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // List Events (optional filter by building or status)
    @GetMapping
    public ResponseEntity<List<EventResponseDTO>> listEvents(@RequestParam(required = false) Long buildingId,
                                                             @RequestParam(required = false) EventStatus status) {
        List<Event> events;
        if (buildingId != null && status != null) {
            events = eventRepository.findByBuildingIdAndStatus(buildingId, status);
        } else if (buildingId != null) {
            events = eventRepository.findByBuildingIdOrderByDatetimeAsc(buildingId);
        } else {
            events = eventRepository.findAll();
        }

        List<EventResponseDTO> response = events.stream()
                .map(EventResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
}

