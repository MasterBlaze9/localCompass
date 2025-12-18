package io.codeForAll.localCompass.dto.report;

import io.codeForAll.localCompass.entites.Report;
import io.codeForAll.localCompass.entites.enums.ReportStatus;

import java.time.LocalDateTime;

public class ReportResponseDTO {
    private Long id;
    private String title;
    private String description;
    private ReportStatus status;
    private LocalDateTime createdAt;
    private Long userId;

    public ReportResponseDTO() {}
    public ReportResponseDTO(Report r) {
        this.id = r.getId();
        this.description = r.getDescription();
        this.title = r.getTitle();
        this.status = r.getStatus();
        this.createdAt = r.getCreatedAt();
        this.userId = r.getUser() != null ? r.getUser().getId() : null;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public ReportStatus getStatus() { return status; }
    public void setStatus(ReportStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
