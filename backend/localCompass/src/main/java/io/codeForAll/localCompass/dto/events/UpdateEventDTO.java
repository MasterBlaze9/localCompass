package io.codeForAll.localCompass.dto.events;

import io.codeForAll.localCompass.entites.enums.EventStatus;
import java.time.LocalDateTime;

public class UpdateEventDTO {
    private String title;
    private String description;
    private String location;
    private LocalDateTime datetime;
    private EventStatus status;

    // Getters and setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public LocalDateTime getDatetime() { return datetime; }
    public void setDatetime(LocalDateTime datetime) { this.datetime = datetime; }
    public EventStatus getStatus() { return status; }
    public void setStatus(EventStatus status) { this.status = status; }
}

