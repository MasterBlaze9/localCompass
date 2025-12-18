package io.codeForAll.localCompass.dto.report;

import io.codeForAll.localCompass.entites.enums.ReportStatus;

public class UpdateReportDTO {
    private String title;
    private String description;
    private String locationDetails;
    private ReportStatus status;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getLocationDetails() { return locationDetails; }
    public void setLocationDetails(String locationDetails) { this.locationDetails = locationDetails; }
    public ReportStatus getStatus() { return status; }
    public void setStatus(ReportStatus status) { this.status = status; }
}
