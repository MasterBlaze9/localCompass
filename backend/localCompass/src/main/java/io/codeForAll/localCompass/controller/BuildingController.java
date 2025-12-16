package io.codeForAll.localCompass.controller;

import io.codeForAll.localCompass.dto.building.BuildingDTO;
import io.codeForAll.localCompass.dto.building.CreateBuildingDTO;
import io.codeForAll.localCompass.entites.Building;
import io.codeForAll.localCompass.entites.Condominium;
import io.codeForAll.localCompass.repositories.BuildingRepository;
import io.codeForAll.localCompass.repositories.CondominiumRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/buildings")
public class BuildingController {

    @Autowired
    private BuildingRepository buildingRepository;

    @Autowired
    private CondominiumRepository condominiumRepository;

    // Get all buildings
    @GetMapping
    public ResponseEntity<List<BuildingDTO>> getAllBuildings() {
        List<Building> buildings = buildingRepository.findAll();
        List<BuildingDTO> response = buildings.stream()
                .map(BuildingDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // Get buildings by condominium ID
    @GetMapping("/by-condominium")
    public ResponseEntity<List<BuildingDTO>> getBuildingsByCondominium(@RequestParam Long condominiumId) {
        List<Building> buildings = buildingRepository.findByCondominiumId(condominiumId);
        List<BuildingDTO> response = buildings.stream()
                .map(BuildingDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // Get a single building by ID
    @GetMapping("/{id}")
    public ResponseEntity<BuildingDTO> getBuildingById(@PathVariable Long id) {
        Building building = buildingRepository.findBuildingById(id)
                .orElseThrow(() -> new RuntimeException("Building not found"));
        return ResponseEntity.ok(new BuildingDTO(building));
    }

    @PostMapping
    public ResponseEntity<BuildingDTO> createBuilding(@RequestBody CreateBuildingDTO dto) {
        // Minimal assumption: you already have a Condominium entity repository
        Condominium condominium = condominiumRepository.findById(dto.getCondominiumId())
                .orElseThrow(() -> new RuntimeException("Condominium not found"));

        Building building = new Building();
        building.setName(dto.getName());
        building.setTotalUnits(dto.getTotalUnits());
        building.setCondominium(condominium);

        Building savedBuilding = buildingRepository.save(building);

        return ResponseEntity.ok(new BuildingDTO(savedBuilding));
    }
}

