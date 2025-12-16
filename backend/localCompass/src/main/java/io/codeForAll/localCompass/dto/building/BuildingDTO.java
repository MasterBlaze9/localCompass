package io.codeForAll.localCompass.dto.building;

import io.codeForAll.localCompass.entites.Building;

public class BuildingDTO {

    private Long id;
    private String name;
    private Integer totalUnits;
    private Long condominiumId;

    public BuildingDTO() {
    }

    public BuildingDTO(Building building) {
        this.id = building.getId();
        this.name = building.getName();
        this.totalUnits = building.getTotalUnits();
        this.condominiumId = building.getCondominium().getId();
    }



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

