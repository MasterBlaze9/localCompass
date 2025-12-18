package io.codeForAll.localCompass.dto.building;

public class CreateBuildingDTO {

    private String name;
    private Integer totalUnits;
    private Long condominiumId;

    public CreateBuildingDTO() {
    }

    // getters & setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getTotalUnits() {
        return totalUnits;
    }

    public void setTotalUnits(Integer totalUnits) {
        this.totalUnits = totalUnits;
    }

    public Long getCondominiumId() {
        return condominiumId;
    }

    public void setCondominiumId(Long condominiumId) {
        this.condominiumId = condominiumId;
    }
}
