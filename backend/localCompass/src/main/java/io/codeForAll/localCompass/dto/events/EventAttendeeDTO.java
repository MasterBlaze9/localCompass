package io.codeForAll.localCompass.dto.events;

import io.codeForAll.localCompass.entites.EventAttendee;

import io.codeForAll.localCompass.entites.enums.RsvpStatus;

public class EventAttendeeDTO {
    private Long userId;
    private String userName;
    private RsvpStatus status;

    public EventAttendeeDTO(EventAttendee attendee) {
        this.userId = attendee.getUser().getId();
        this.userName = attendee.getUser().getFirstName() + " " + attendee.getUser().getLastName();
        this.status = attendee.getRsvpStatus();
    }

    // Getters and setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public RsvpStatus getStatus() { return status; }
    public void setStatus(RsvpStatus status) { this.status = status; }
}
