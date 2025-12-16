package io.codeForAll.localCompass.dto.user;

public class AssignBuildingDTO {
    private Long buildingId;
    private Long userId;
    private String unitNumber; // optional

    public Long getBuildingId() { return buildingId; }
    public void setBuildingId(Long buildingId) { this.buildingId = buildingId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUnitNumber() { return unitNumber; }
    public void setUnitNumber(String unitNumber) { this.unitNumber = unitNumber; }
}
